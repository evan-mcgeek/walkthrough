import { expect, test } from './walkthrough';

const icon = (size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${String(size)}" height="${String(size)}"><rect width="${String(size)}" height="${String(size)}" fill="teal"/></svg>\n`;

test.use({ start: { 'icons/cart.svg': icon(24) }, files: { 'icons/cart.svg': icon(32), 'icons/new.svg': icon(16) } });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const files = ['icons/cart.svg', 'icons/new.svg', 'login.ts', 'app.ts'];
  const recorded = repo.record([{ title: 'Icons', explanation: 'Redraws the cart.', files }]);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('region', { name: 'Icons', exact: true })).toBeVisible();
});

const fileIn = (page: import('@playwright/test').Page, name: string) =>
  page.locator('.d2h-file-wrapper').filter({ has: page.locator('.d2h-file-name', { hasText: name }) });

test('a changed image previews Before from the base and After from the head, each with its pixel size', async ({ page }) => {
  const file = fileIn(page, 'icons/cart.svg');

  await file.getByRole('group', { name: 'Show icons/cart.svg as' }).getByRole('button', { name: 'Preview' }).click();

  const preview = file.getByRole('region', { name: 'Preview of icons/cart.svg' });
  const before = preview.getByRole('figure').filter({ hasText: 'Before' });
  const after = preview.getByRole('figure').filter({ hasText: 'After' });
  await expect(before.getByRole('img', { name: 'icons/cart.svg, before' })).toBeVisible();
  await expect(after.getByRole('img', { name: 'icons/cart.svg, after' })).toBeVisible();
  await expect(before).toHaveText('Before · 24×24');
  await expect(after).toHaveText('After · 32×32');
});

test('an added image previews only After', async ({ page }) => {
  const file = fileIn(page, 'icons/new.svg');

  await file.getByRole('button', { name: 'Preview' }).click();

  const preview = file.getByRole('region', { name: 'Preview of icons/new.svg' });
  await expect(preview.getByRole('figure')).toHaveCount(1);
  await expect(preview.getByRole('figure')).toHaveText('After · 16×16');
});
