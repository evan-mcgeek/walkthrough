import type { Page } from '@playwright/test';
import { expect, test } from './walkthrough';

const big = Array.from({ length: 450 }, (_, at) => `export const line${String(at)} = ${String(at)};`).join('\n');
test.use({ files: { 'big.ts': `${big}\n` } });

const file = (page: Page, path: string) => page.locator(`.d2h-file-wrapper[data-file="${path}"]`);

/** A design token as the browser resolves it for colour, in the page's current theme. */
const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record([{ title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts', 'big.ts'] }]);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
});

test('each file collapses from its header and opens again', async ({ page }) => {
  const login = file(page, 'login.ts');
  await expect(login.locator('.d2h-file-diff')).toBeVisible();

  await page.getByRole('button', { name: 'Collapse login.ts' }).click();

  await expect(login.locator('.d2h-file-diff')).toBeHidden();
  await expect(login.locator('.d2h-file-name')).toBeVisible();
  const expand = page.getByRole('button', { name: 'Expand login.ts' });
  await expect(expand).toHaveAttribute('aria-expanded', 'false');
  await expect(file(page, 'app.ts').locator('.d2h-file-diff')).toBeVisible();
  await expand.click();
  await expect(login.locator('.d2h-file-diff')).toBeVisible();
});

test('each file after the first sits 32px below the one before it, opened or collapsed, behind a control-edge rule and a tinted header', async ({ page }) => {
  await page.getByRole('button', { name: 'Collapse login.ts' }).click();
  await page.getByRole('button', { name: 'Collapse app.ts' }).click();
  await page.getByRole('button', { name: 'Expand big.ts' }).click();
  await expect(file(page, 'big.ts').locator('.d2h-file-diff')).toBeVisible();

  const boxes = await Promise.all(['login.ts', 'app.ts', 'big.ts'].map(path => file(page, path).boundingBox()));
  const gaps = boxes.slice(1).map((box, at) => (box?.y ?? 0) - ((boxes[at]?.y ?? 0) + (boxes[at]?.height ?? 0)));
  expect(gaps).toEqual([32, 32]);
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await expect(file(page, 'app.ts')).toHaveCSS('border-top-color', await tokenColor(page, '--control-edge'));
    await expect(file(page, 'app.ts').locator('.d2h-file-header')).toHaveCSS('background-color', await tokenColor(page, '--surface-tint'));
  }
});

test('a large file starts collapsed', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Expand big.ts' })).toBeVisible();
  await expect(file(page, 'big.ts').locator('.d2h-file-diff')).toBeHidden();
  await expect(file(page, 'login.ts').locator('.d2h-file-diff')).toBeVisible();
});

test('Viewed collapses a file, outlasts a reload, and decides nothing', async ({ page, repo }) => {
  const viewed = page.getByRole('button', { name: 'Viewed login.ts' });
  await expect(viewed).toHaveAttribute('aria-pressed', 'false');
  await expect(viewed).toHaveAttribute('title', 'Viewed (V)');

  await viewed.click();

  await expect(viewed).toHaveAttribute('aria-pressed', 'true');
  await expect(viewed).toHaveText('Viewed');
  await expect(file(page, 'login.ts').locator('.d2h-file-diff')).toBeHidden();
  await expect(page.getByRole('region', { name: 'Login' }).locator('.tag.decided')).toHaveCount(0);
  await expect.poll(() => JSON.parse(repo.run('decisions').stdout.split('\n')[0] ?? '{}') as unknown).toMatchObject({ decision: null });

  await page.reload();
  await expect(viewed).toHaveAttribute('aria-pressed', 'true');
  await expect(file(page, 'login.ts').locator('.d2h-file-diff')).toBeHidden();
  await viewed.click();
  await expect(viewed).toHaveAttribute('aria-pressed', 'false');
  await expect(file(page, 'login.ts').locator('.d2h-file-diff')).toBeVisible();
});

test('V marks the file in focus viewed, or else the first one not viewed yet', async ({ page }) => {
  await file(page, 'app.ts').locator('tr[data-line] td.d2h-code-linenumber').first().focus();

  await page.keyboard.press('v');

  await expect(page.getByRole('button', { name: 'Viewed app.ts' })).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
  });
  await page.keyboard.press('v');
  await expect(page.getByRole('button', { name: 'Viewed login.ts' })).toHaveAttribute('aria-pressed', 'true');
});
