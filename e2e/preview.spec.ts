import { expect, test } from './walkthrough';

const guide = [
  '# Guide',
  '',
  'Read **this** first.',
  '',
  '<script>window.ran = true</script>',
  '',
  '<img src="x" onerror="window.ran = true">',
  '',
  '[Run](javascript:window.ran=true)',
  '',
  '[Home](https://example.com/)',
  '',
  '![Dot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)',
  '',
  '| Name | Count |',
  '| :--- | ----: |',
  '| apples | 3 |',
  '',
  '![Logo](../logo.svg)',
  '',
].join('\n');
const logo =
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="teal"/></svg>\n';

test.use({ files: { 'docs/guide.md': guide, 'logo.svg': logo } });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const files = ['docs/guide.md', 'logo.svg', 'login.ts', 'app.ts'];
  const recorded = repo.record([{ title: 'Docs and login', explanation: 'Adds docs and login.', files }]);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('region', { name: 'Docs and login' })).toBeVisible();
});

const fileIn = (page: import('@playwright/test').Page, name: string) =>
  page.locator('.d2h-file-wrapper').filter({ has: page.locator('.d2h-file-name', { hasText: name }) });

test('a changed Markdown file previews rendered and safe, and switches back to its diff', async ({ page }) => {
  const file = fileIn(page, 'docs/guide.md');
  const toggle = file.getByRole('group', { name: 'Show docs/guide.md as' });
  await expect(toggle.getByRole('button', { name: 'Diff' })).toHaveAttribute('aria-pressed', 'true');

  await toggle.getByRole('button', { name: 'Preview' }).click();

  const preview = file.getByRole('region', { name: 'Preview of docs/guide.md' });
  await expect(preview.getByRole('heading', { name: 'Guide' })).toBeVisible();
  await expect(preview.locator('strong')).toHaveText('this');
  await expect(preview.getByText('<script>window.ran = true</script>')).toBeVisible();
  await expect(preview.getByText('<img src="x" onerror="window.ran = true">')).toBeVisible();
  await expect(preview.locator('script, [onerror]')).toHaveCount(0);
  await expect(preview.getByRole('img', { name: 'Dot' })).toBeVisible();
  // A relative image loads from the repo as it is at the head commit.
  const logo = preview.getByRole('img', { name: 'Logo' });
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(40);
  await expect(preview.getByRole('link', { name: 'Home' })).toHaveAttribute('target', '_blank');
  await expect(preview.getByRole('link', { name: 'Home' })).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(preview.locator('a[href^="javascript:"]')).toHaveCount(0);
  await expect(preview.getByRole('cell', { name: '3' })).toHaveCSS('text-align', 'right');
  expect(await page.evaluate(() => (window as { ran?: boolean }).ran)).toBeUndefined();
  await expect(file.locator('.d2h-file-diff')).toBeHidden();
  await expect(toggle.getByRole('button', { name: 'Preview' })).toHaveAttribute('aria-pressed', 'true');

  await toggle.getByRole('button', { name: 'Diff' }).click();

  await expect(preview).toBeHidden();
  await expect(file.locator('.d2h-file-diff')).toBeVisible();
});

test('a changed image previews as it is at the head commit; other files have no switch', async ({ page }) => {
  const file = fileIn(page, 'logo.svg');

  await file.getByRole('group', { name: 'Show logo.svg as' }).getByRole('button', { name: 'Preview' }).click();

  const image = file.getByRole('region', { name: 'Preview of logo.svg' }).getByRole('img', { name: 'logo.svg' });
  await expect(image).toBeVisible();
  expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(40);
  await expect(fileIn(page, 'login.ts').getByRole('group')).toHaveCount(0);
});

test('a redraw from the session keeps a file in preview, even when its step is recorded again', async ({
  page,
  repo,
}) => {
  const file = fileIn(page, 'docs/guide.md');
  await file.getByRole('button', { name: 'Preview' }).click();
  await expect(file.getByRole('heading', { name: 'Guide' })).toBeVisible();

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  await expect(file.getByRole('heading', { name: 'Guide' })).toBeVisible();
  await expect(file.locator('.d2h-file-diff')).toBeHidden();

  repo.record([
    { title: 'Docs', explanation: 'Adds docs.', files: ['docs/guide.md', 'logo.svg'] },
    { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] },
  ]);
  await expect(page.getByRole('region', { name: 'Docs', exact: true })).toBeVisible();

  await expect(file.getByRole('heading', { name: 'Guide' })).toBeVisible();
  await expect(file.locator('.d2h-file-diff')).toBeHidden();
});
