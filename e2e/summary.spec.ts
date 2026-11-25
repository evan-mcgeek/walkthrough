import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

test.describe('a pull request', () => {
  test.use({ args: ['--pr', '212', '--title', 'Due dates for tasks'] });

  test('Submit review sends one review with its type, summary and every pending comment, then says where it went', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    record(repo, [{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment');
    record(repo, [{ text: 'Only users log in', status: 'not-met' }], 'criteria');
    await open(page, url);
    await expect(page.locator('.change-label')).toHaveText('#212 Due dates for tasks');
    const listener = repo.background('listen');

    await page.getByRole('link', { name: 'Finish review' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Summary' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Finish review' })).toBeHidden();
    const going = page.locator('.going-row');
    await expect(going).toHaveCount(1);
    await expect(going).toContainText('login.ts:1');
    await expect(going).toContainText('[AI] Everyone gets in.');
    await expect(page.getByRole('link', { name: '2 files not viewed' })).toBeVisible();
    await expect(page.locator('.criterion')).toContainText(['Only users log in']);
    await expect(page.locator('.criterion-word')).toHaveText('Not met');

    await page.getByPlaceholder('Leave a comment').fill('One thing before this merges.');
    await page.getByRole('radio', { name: 'Request changes' }).check();
    await page.getByRole('button', { name: 'Submit review' }).click();

    await expect(page.getByText('Review submitted')).toBeVisible();
    await expect(page.getByText('Request changes, with 1 comment, on #212.')).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Sent/ })).toBeVisible();
    await expect(going.getByRole('button', { name: 'Delete' })).toHaveCount(0);
    await expect(page.locator('.ai-reviewing')).toHaveCount(0);

    const submit = JSON.parse((await listener.ended).stdout) as Record<string, unknown>;
    expect(submit).toMatchObject({ kind: 'submit', type: 'request-changes', summary: 'One thing before this merges.' });
    expect(repo.run('comments').stdout).toContain('"body":"[AI] Everyone gets in."');
    expect(repo.run('posted', '--address', 'https://example.test/review/7').status).toBe(0);
    await expect(page.getByRole('link', { name: 'View review' })).toHaveAttribute('href', 'https://example.test/review/7');
  });
});

test('your own change: Send to agent waits for a comment, Approve or Request changes', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await open(page, url, '#summary');

  await expect(page.getByText('No comments. Add one on a line, or answer the AI’s.')).toBeVisible();
  const send = page.getByRole('button', { name: 'Send to agent' });
  await expect(send).toBeDisabled();
  await expect(page.getByText('Add a comment, or choose Approve or Request changes.')).toBeVisible();

  await page.getByRole('radio', { name: 'Approve' }).check();
  await expect(send).toBeEnabled();
  await expect(page.getByText('Add a comment, or choose Approve or Request changes.')).toBeHidden();
  await send.click();
  await expect(page.getByText('Sent to the agent')).toBeVisible();
});
