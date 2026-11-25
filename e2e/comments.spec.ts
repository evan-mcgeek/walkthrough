import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

test('you add, edit and delete a comment on lines, and edit or delete the AI’s, which carries [AI]', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  record(repo, [{ file: 'app.ts', lines: [1, 1], body: 'The version should come from the package.' }], 'comment');
  await open(page, url);

  const ai = page.locator('.comment-ai');
  await expect(ai).toContainText('[AI] The version should come from the package.');
  await expect(ai.getByText('Pending')).toBeVisible();
  await expect(page.locator('.gutter-mark.ai')).toHaveCount(1);

  await page.locator('.file[data-file="login.ts"]').getByRole('button', { name: 'Comment on line 1' }).click();
  await page.getByPlaceholder('Leave a comment').fill('Everyone gets in.');
  await page.getByRole('button', { name: 'Add comment' }).click();
  const mine = page.locator('.comment-you');
  await expect(mine).toContainText('Everyone gets in.');
  await expect(mine.getByText('Pending')).toBeVisible();
  await expect(page.locator('.gutter-mark.you')).toHaveCount(1);

  await mine.getByRole('button', { name: 'Edit' }).click();
  await mine.locator('textarea').fill('Everyone gets in; check the password.');
  await mine.getByRole('button', { name: 'Update comment' }).click();
  await expect(mine).toContainText('Everyone gets in; check the password.');

  await ai.getByRole('button', { name: 'Edit' }).click();
  await ai.locator('textarea').fill('Read the version from the package.');
  await ai.getByRole('button', { name: 'Update comment' }).click();
  await expect(ai).toContainText('[AI] Read the version from the package.');

  await ai.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('.comment-ai')).toHaveCount(0);
  await expect(page.locator('.summary-row')).toContainText('1');

  const comments = repo.run('comments').stdout.trim().split('\n').map(line => JSON.parse(line) as { by: string; body: string });
  expect(comments).toEqual([expect.objectContaining({ by: 'you', body: 'Everyone gets in; check the password.' })]);
});
