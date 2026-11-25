import { expect, lines, open, record, test, topOf } from './walkthrough';

test.use({ files: { 'tasks.ts': lines(200, 'task') } });

test('a comment arriving above or in view never moves the line being read; the pill opens it', async ({ page, repo, url }) => {
  record(repo, [{ title: 'Tasks', explanation: 'Adds tasks.', files: ['tasks.ts', 'login.ts', 'app.ts'] }]);
  await open(page, url);
  // Scrolled mid-file, reading line 120.
  await page.locator('tr[data-line="120"]').evaluate(row => {
    const main = document.getElementById('main');
    if (main) main.scrollTop += row.getBoundingClientRect().top - main.getBoundingClientRect().top - 200;
  });
  const before = await topOf(page, 'tr[data-line="120"]');

  record(repo, [{ file: 'tasks.ts', lines: [100, 100], body: 'Above you.' }, { file: 'tasks.ts', lines: [125, 125], body: 'In view.' }], 'comment');

  const pill = page.getByRole('button', { name: '2 new comments above' });
  await expect(pill).toBeVisible();
  expect(await topOf(page, 'tr[data-line="120"]')).toBe(before);
  await expect(page.getByText('Above you.')).toBeHidden();

  record(repo, [{ file: 'tasks.ts', lines: [190, 190], body: 'Far below.' }], 'comment');
  await expect(page.locator('.comment-ai').filter({ hasText: 'Far below.' })).toBeAttached();
  expect(await topOf(page, 'tr[data-line="120"]')).toBe(before);

  await pill.click();
  await expect(page.getByText('Above you.')).toBeInViewport();
  await expect(page.getByText('In view.')).toBeVisible();
  await expect(pill).toBeHidden();
});
