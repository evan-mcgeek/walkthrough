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

test('you comment on a whole file above its diff, ask the AI in that thread, and its Summary row links to the file', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await open(page, url);

  const file = page.locator('.file[data-file="login.ts"]');
  await file.getByRole('button', { name: 'Comment on this file' }).click();
  await expect(file.locator('.file-threads textarea')).toBeFocused();
  await page.keyboard.type('Name it for what it does.');
  await file.getByRole('button', { name: 'Add comment' }).click();
  const thread = file.locator('.file-threads .thread');
  await expect(thread.locator('.comment-you')).toContainText('Name it for what it does.');
  await expect(thread.getByText('Pending')).toBeVisible();
  await expect(file.locator('.thread-row')).toHaveCount(0);
  await expect(file.locator('.file-comments')).toHaveText('1');
  expect(JSON.parse(repo.run('comments').stdout)).toMatchObject({ file: 'login.ts', subject: 'file', body: 'Name it for what it does.' });

  await thread.getByRole('button', { name: 'Ask AI' }).click();
  await thread.locator('textarea').fill('Is the name clear?');
  await thread.locator('.composer').getByRole('button', { name: 'Ask AI' }).click();
  await expect(thread.locator('.answering')).toBeVisible();

  await page.getByRole('link', { name: 'Finish review' }).click();
  await page.locator('.going-row').getByRole('link', { name: 'login.ts', exact: true }).click();
  await expect(thread).toBeInViewport();
});

test('the AI’s suggestion shows as a suggested change on its lines, tagged on the Summary, and Edit shows its fence', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  const body = 'Check the password.\n\n```suggestion\nexport const login = (password: string) =>\n  password === secret;\n```';
  record(repo, [{ file: 'login.ts', lines: [1, 1], body }], 'comment');
  await open(page, url);

  const ai = page.locator('.comment-ai');
  const block = ai.locator('.suggestion');
  await expect(block.locator('.suggestion-head')).toHaveText('Suggested change');
  await expect(block.locator('.suggestion-del')).toHaveText(['1-export const login = () => true;']);
  await expect(block.locator('.suggestion-add')).toHaveText(['1+export const login = (password: string) =>', '2+  password === secret;']);
  await expect(block.getByRole('button')).toHaveCount(0);

  await ai.getByRole('button', { name: 'Edit' }).click();
  await expect(ai.locator('textarea')).toHaveValue(body);
  await ai.getByRole('button', { name: 'Cancel' }).click();

  await page.getByRole('link', { name: 'Finish review' }).click();
  await expect(page.locator('.going-row .row-text')).toHaveText('Suggested change[AI] Check the password.');
});
