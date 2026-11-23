import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Locator, Page } from '@playwright/test';
import { ONE_STEP } from '../test/helpers';
import { expect, test } from './walkthrough';

const ULTRAMARINE = 'rgb(36, 51, 184)';
const BERRY = 'rgb(156, 31, 98)';
const DARK_CANVAS = 'rgb(21, 24, 29)';
const LIGHT_CANVAS = 'rgb(255, 255, 255)';

const fill = (control: Locator) => control.evaluate(one => getComputedStyle(one).backgroundColor);
const canvas = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

async function openAppearance(page: Page) {
  await page.getByRole('banner').getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Appearance' }).click();
  return page.getByRole('dialog', { name: 'Appearance' });
}

test.beforeEach(async ({ page, repo, url }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
});

test('Appearance sets the accent and theme, which last after the page server restarts', async ({ page, repo }) => {
  const approve = page.getByRole('region', { name: 'Login' }).getByRole('button', { name: 'Approve' });
  await expect(approve).toBeVisible();
  expect(await fill(approve)).toBe(ULTRAMARINE);
  expect(await canvas(page)).toBe(LIGHT_CANVAS);

  const appearance = await openAppearance(page);
  const accents = appearance.getByRole('radiogroup', { name: 'Accent' }).getByRole('radio');
  await expect(accents).toHaveText(['Ultramarine (default)', 'Petrol', 'Berry']);
  await expect(accents.first()).toHaveAttribute('aria-checked', 'true');
  await expect(appearance.getByText('Saved for you on this machine.')).toBeVisible();

  await appearance.getByRole('radio', { name: 'Berry' }).click();
  await appearance.getByRole('radio', { name: 'Dark' }).click();

  await expect(appearance.getByRole('radio', { name: 'Berry' })).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => canvas(page)).toBe(DARK_CANVAS);
  await page.keyboard.press('Escape');
  await expect(appearance).toBeHidden();
  await expect(page.getByRole('banner').getByRole('button', { name: 'More' })).toBeFocused();

  // A new server listens on a new port, an origin whose browser storage starts empty.
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('start');
  await page.goto(repo.url());
  await expect(approve).toBeVisible();
  expect(await canvas(page)).toBe(DARK_CANVAS);
  await page.emulateMedia({ colorScheme: 'light' });
  const reopened = await openAppearance(page);
  await expect(reopened.getByRole('radio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
  await reopened.getByRole('radio', { name: 'Light' }).click();
  await expect.poll(() => canvas(page)).toBe(LIGHT_CANVAS);
  await expect.poll(() => fill(approve)).toBe(BERRY);
});

test('System follows the system setting until the person picks a theme', async ({ page }) => {
  await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
  await page.emulateMedia({ colorScheme: 'dark' });
  expect(await canvas(page)).toBe(DARK_CANVAS);

  const appearance = await openAppearance(page);
  await expect(appearance.getByRole('radio', { name: 'System' })).toHaveAttribute('aria-checked', 'true');
  await appearance.getByRole('radio', { name: 'Light' }).click();

  await expect.poll(() => canvas(page)).toBe(LIGHT_CANVAS);
});

test('the list page and an export follow the chosen appearance', async ({ page, repo }) => {
  const appearance = await openAppearance(page);
  await appearance.getByRole('radio', { name: 'Berry' }).click();
  await appearance.getByRole('radio', { name: 'Dark' }).click();
  await expect.poll(() => canvas(page)).toBe(DARK_CANVAS);
  const out = path.join(path.dirname(repo.dir), 'login.html');
  expect(repo.run('export', '--out', out).status).toBe(0);

  await page.goto('about:blank');
  repo.run('stop');
  repo.run('list');
  await page.goto(repo.url());
  await expect(page.getByRole('heading', { name: 'Walkthroughs' })).toBeVisible();
  expect(await canvas(page)).toBe(DARK_CANVAS);
  expect(await page.locator('.logo .icon-mark').evaluate(mark => getComputedStyle(mark).color)).toBe('rgb(240, 122, 180)');
  repo.run('stop', '--list');

  await page.goto(pathToFileURL(out).href);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  expect(await canvas(page)).toBe(DARK_CANVAS);
  expect(await page.locator('.logo .icon-mark').evaluate(mark => getComputedStyle(mark).color)).toBe('rgb(240, 122, 180)');
});

/** WCAG relative luminance contrast of two computed rgb() colours. */
function contrast(one: string, two: string): number {
  const luminance = (color: string) => {
    const [r = 0, g = 0, b = 0] = (color.match(/[\d.]+/g) ?? []).map(Number).map(channel => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(one), luminance(two)].sort((a, b) => b - a) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

test('every accent keeps AA contrast in both themes', async ({ page }) => {
  await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
  for (const accent of ['ultramarine', 'petrol', 'berry'])
    for (const theme of ['light', 'dark']) {
      const colors = await page.evaluate(
        ([accent, theme]) => {
          Object.assign(document.documentElement.dataset, { accent, theme });
          const of = (token: string) => {
            const probe = document.body.appendChild(document.createElement('span'));
            probe.style.color = `var(--${token})`;
            const color = getComputedStyle(probe).color;
            probe.remove();
            return color;
          };
          return Object.fromEntries(['accent', 'accent-text', 'accent-wash', 'on-accent', 'canvas', 'surface'].map(token => [token, of(token)]));
        },
        [accent, theme],
      );
      const where = `${accent} in ${theme}`;
      expect(contrast(colors['accent-text'] ?? '', colors['canvas'] ?? ''), `${where}: accent text on the canvas`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors['accent-text'] ?? '', colors['accent-wash'] ?? ''), `${where}: accent text on the wash`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors['on-accent'] ?? '', colors['accent'] ?? ''), `${where}: text on the accent fill`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors['accent'] ?? '', colors['surface'] ?? ''), `${where}: the accent against the rail`).toBeGreaterThanOrEqual(3);
    }
});
