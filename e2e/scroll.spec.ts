import type { Page } from '@playwright/test';
import { expect, test } from './walkthrough';

const long = Array.from({ length: 60 }, (_, at) => `export const line${String(at + 1)} = '${'x'.repeat(at)}';`).join('\n');

test.use({ files: { 'long.ts': `${long}\n` } });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record([{ title: 'Long', explanation: 'A long file.', files: ['long.ts', 'login.ts', 'app.ts'] }]);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('region', { name: 'Long' })).toBeVisible();
});

/** How far line `line` of long.ts sits from its line number, after the main pane scrolled to the bottom. */
async function offsetAtBottom(page: Page, line: number): Promise<number> {
  await page.locator('#main').evaluate(main => {
    main.scrollTo(0, main.scrollHeight);
  });
  const row = page.locator(`tr[data-file="long.ts"][data-line="${String(line)}"]`);
  const [code, number] = await Promise.all([row.locator('.d2h-code-line').boundingBox(), row.locator('.d2h-code-linenumber').boundingBox()]);
  if (!code || !number) throw new Error('the line is not shown');
  return Math.abs(code.y - number.y);
}

test('line numbers stay beside their lines when the step scrolls', async ({ page }) => {
  expect(await offsetAtBottom(page, 58)).toBeLessThan(2);
});

test('at phone width too, where a diff scrolls sideways inside its file', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await offsetAtBottom(page, 58)).toBeLessThan(2);
  const diff = page.locator('.d2h-file-diff').first();
  expect(await diff.evaluate(one => one.scrollWidth > one.clientWidth)).toBe(true);
});

test('a diff scrolled sideways stays there when the page redraws', async ({ page, repo }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const diff = page.locator('.d2h-file-wrapper[data-file="long.ts"] .d2h-file-diff');
  await diff.evaluate(one => {
    one.scrollLeft = 100;
  });

  repo.run('say', 'Still here.');

  await expect(page.getByRole('combobox', { name: 'Step' }).getByRole('option', { name: 'From the session' })).toHaveCount(1);
  expect(await diff.evaluate(one => one.scrollLeft)).toBe(100);
});

test('the right arrow in a diff scrolls its long lines instead of moving to the next step', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const diff = page.locator('.d2h-file-wrapper[data-file="long.ts"] .d2h-file-diff');
  // Once the step's read mark is drawn, no redraw cuts the scroll short.
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /, 1 read$/);
  await diff.locator('tr[data-line] td.d2h-code-linenumber').first().focus();

  // Held as long as a person holds a key: WebKit can drop a press released before its scroll animation starts.
  await page.keyboard.press('ArrowRight', { delay: 100 });

  await expect(page.getByRole('region', { name: 'Long' })).toBeVisible();
  expect(new URL(page.url()).hash).not.toBe('#summary');
  await expect.poll(() => diff.evaluate(one => one.scrollLeft)).toBeGreaterThan(0);
});

/** How far the action bar of the step named `name` sits above the foot of the main pane. */
async function barGap(page: Page, name: string): Promise<number> {
  const [main, bar] = await Promise.all([
    page.locator('#main').boundingBox(),
    page.getByRole('region', { name }).locator('.action-bar').boundingBox(),
  ]);
  if (!main || !bar) throw new Error('no main pane or action bar');
  return Math.round(main.y + main.height - (bar.y + bar.height));
}

test('a long step keeps its action bar at the foot of the pane while it scrolls', async ({ page }) => {
  expect(await barGap(page, 'Long')).toBe(0);
  await page.locator('#main').evaluate(main => {
    main.scrollTo(0, main.scrollHeight / 2);
  });
  expect(await barGap(page, 'Long')).toBe(0);
});

test('a short step docks its action bar at the foot of the pane', async ({ page, repo }) => {
  repo.record([
    { title: 'Long', explanation: 'A long file.', files: ['long.ts', 'login.ts'] },
    { title: 'Short', explanation: 'Bumps the app constant.', files: ['app.ts'] },
  ]);
  await page.getByRole('link', { name: 'Short' }).click();
  await expect(page.locator('.pane-leaving')).toHaveCount(0);
  expect(await barGap(page, 'Short')).toBe(0);
});
