import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

test('Ask AI on picked lines wakes the session, and its answer is a reply that never goes out', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await open(page, url);
  const listener = repo.background('listen');

  await page.locator('.file[data-file="login.ts"]').getByRole('button', { name: 'Comment on line 1' }).click();
  await page.getByPlaceholder('Leave a comment').fill('Who can log in?');
  await page.getByRole('button', { name: 'Ask AI' }).click();

  const thread = page.locator('.thread').first();
  await expect(thread).toContainText('Ask AI: Who can log in?');
  await expect(thread.getByText('Answering…')).toBeVisible();
  await expect(thread.getByText('Pending')).toHaveCount(0);

  const { stdout } = await listener.ended;
  const ask = JSON.parse(stdout) as { kind: string; id: string; file: string; lines: number[] };
  expect(ask).toMatchObject({ kind: 'ask', file: 'login.ts', lines: [1, 1], text: 'Who can log in?' });
  expect(repo.run('say', '--answer', ask.id, 'Everyone: it returns true.').status).toBe(0);

  await expect(thread.locator('.comment-ai')).toContainText('Everyone: it returns true.');
  await expect(thread.getByText('Answering…')).toHaveCount(0);
  await expect(thread.locator('.ai-tag')).toHaveCount(0);
  expect(repo.run('comments').stdout).toBe('');
});
