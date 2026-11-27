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

test('the AI and you comment on a whole file in the band above its diff, oldest first, and its Summary row links to the file', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  record(repo, [{ file: 'login.ts', body: 'Nothing tests a wrong password.' }], 'comment');
  await open(page, url);

  const file = page.locator('.file[data-file="login.ts"]');
  const band = file.locator('.file-threads');
  const ai = band.locator('.comment-ai');
  await expect(ai).toContainText('[AI] Nothing tests a wrong password.');
  await expect(ai.getByText('Pending')).toBeVisible();

  const button = file.getByRole('button', { name: 'Comment on this file' });
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect(band.locator('> :first-child textarea')).toBeFocused();
  await expect(band.locator('> :first-child textarea')).toHaveAttribute('placeholder', 'Leave a comment');
  await expect(band.getByRole('textbox', { name: 'Comment on this file' })).toBeFocused();
  await page.keyboard.type('Name it for what it does.');
  // A second click keeps the draft.
  await button.click();
  await expect(band.locator('> :first-child textarea')).toHaveValue('Name it for what it does.');
  await band.getByRole('button', { name: 'Add comment' }).click();
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  const threads = band.locator('> .thread');
  await expect(threads).toHaveCount(2);
  await expect(threads.nth(0)).toContainText('Nothing tests a wrong password.');
  const thread = threads.nth(1);
  await expect(thread.locator('.comment-you')).toContainText('Name it for what it does.');
  await expect(thread.getByText('Pending')).toBeVisible();
  await expect(file.locator('.thread-row')).toHaveCount(0);
  await expect(file.locator('.file-comments')).toHaveText('2');
  await expect(page.locator('.file-row[data-file="login.ts"] .file-count')).toHaveText('2');
  expect(repo.run('comments').stdout.trim().split('\n').map(line => JSON.parse(line) as unknown)).toContainEqual(expect.objectContaining({ file: 'login.ts', subject: 'file', body: 'Name it for what it does.' }));

  await thread.getByRole('button', { name: 'Ask AI' }).click();
  await thread.locator('textarea').fill('Is the name clear?');
  await thread.locator('.composer').getByRole('button', { name: 'Ask AI' }).click();
  await expect(thread.locator('.answering')).toBeVisible();

  await page.getByRole('link', { name: 'Finish review' }).click();
  const link = page.locator('.going-row').filter({ hasText: 'Name it for what it does.' }).getByRole('link', { name: 'login.ts', exact: true });
  await expect(link).toHaveAttribute('title', 'login.ts: go to the comment');
  await link.click();
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
