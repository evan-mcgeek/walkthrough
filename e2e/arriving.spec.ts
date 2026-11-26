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
  const width = () => page.locator('tr[data-line="120"]').evaluate(row => row.getBoundingClientRect().width);
  const wide = await width();

  record(repo, [{ file: 'tasks.ts', lines: [100, 100], body: 'Above you.' }, { file: 'tasks.ts', lines: [125, 125], body: 'In view.' }], 'comment');

  const pill = page.getByRole('button', { name: '2 new comments above' });
  await expect(pill).toBeVisible();
  expect(await topOf(page, 'tr[data-line="120"]')).toBe(before);
  // The pill floats over the diff; it never narrows it.
  expect(await width()).toBe(wide);
  await expect(page.getByText('Above you.')).toBeHidden();

  record(repo, [{ file: 'tasks.ts', lines: [190, 190], body: 'Far below.' }], 'comment');
  await expect(page.locator('.comment-ai').filter({ hasText: 'Far below.' })).toBeAttached();
  expect(await topOf(page, 'tr[data-line="120"]')).toBe(before);

  await pill.click();
  await expect(page.getByText('Above you.')).toBeInViewport();
  await expect(page.getByText('In view.')).toBeVisible();
  await expect(pill).toBeHidden();
});

test('an answer arriving above never moves the line being read', async ({ page, repo, url }) => {
  record(repo, [{ title: 'Tasks', explanation: 'Adds tasks.', files: ['tasks.ts', 'login.ts', 'app.ts'] }]);
  await open(page, url);
  const listener = repo.background('listen');
  await page.locator('.file[data-file="tasks.ts"]').getByRole('button', { name: 'Comment on line 100' }).click();
  await page.getByPlaceholder('Leave a comment').fill('Why a hundred?');
  await page.getByRole('button', { name: 'Ask AI' }).click();
  await expect(page.getByText('Answering…')).toBeVisible();
  const { stdout } = await listener.ended;
  const { id } = JSON.parse(stdout) as { id: string };

  // Reading line 130, the question well above the top.
  await page.locator('tr[data-line="130"]').evaluate(row => {
    const main = document.getElementById('main');
    if (main) main.scrollTop += row.getBoundingClientRect().top - main.getBoundingClientRect().top - 200;
  });
  await expect(page.getByText('Answering…')).not.toBeInViewport();
  const before = await topOf(page, 'tr[data-line="130"]');

  expect(repo.run('say', '--answer', id, 'Because a hundred tasks fit.\n\nAnd the next hundred wait.').status).toBe(0);
  await expect(page.locator('.comment-ai').filter({ hasText: 'Because a hundred tasks fit.' })).toBeAttached();
  await expect(page.getByText('Answering…')).toHaveCount(0);
  // The pane scrolls by whole pixels, so the answer's fractional height may round.
  expect(await topOf(page, 'tr[data-line="130"]')).toBeCloseTo(before, 0);
});
