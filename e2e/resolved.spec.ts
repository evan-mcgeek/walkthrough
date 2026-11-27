import fs from 'node:fs';
import path from 'node:path';
import { git, ONE_STEP, postTo } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

test.describe('a pull request', () => {
  test.use({ args: ['--pr', '212', '--title', 'Due dates for tasks'] });

  test('the AI resolves its comment: one resolved line with Pending, Show resolved opens it, and Unresolve conversation takes it back', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    const recorded = repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment');
    const id = /: ([0-9a-f]{8})\./.exec(recorded.stdout)?.[1] ?? '';
    await postTo(url, '/submit', { type: 'comment', summary: '' });
    repo.run('posted');
    expect(repo.run('resolve', id).status).toBe(0);
    await open(page, url);

    const thread = page.locator(`.thread[data-thread="${id}"]`);
    await expect(thread.locator('.resolved-line')).toHaveText(/^AIAI marked this conversation as resolved\.PendingShow resolved$/);
    await expect(thread.locator('.thread-body')).toHaveJSProperty('inert', true);
    const show = thread.getByRole('button', { name: 'Show resolved' });
    await expect(show).toHaveAttribute('aria-expanded', 'false');

    await show.click();
    await expect(thread.getByRole('button', { name: 'Hide resolved' })).toHaveAttribute('aria-expanded', 'true');
    await expect(thread.locator('.comment-ai')).toContainText('[AI] Everyone gets in.');
    await expect(thread.getByRole('button', { name: 'Reply…' })).toBeVisible();

    await page.getByRole('link', { name: 'Finish review' }).click();
    const row = page.locator('.resolved-row');
    await expect(page.getByRole('heading', { name: /^Resolved conversations/ })).toBeVisible();
    await expect(row).toHaveText('AIlogin.ts:1ResolvedPendingEveryone gets in.');
    await row.getByRole('link', { name: 'login.ts:1' }).click();
    await expect(thread.getByRole('button', { name: 'Hide resolved' })).toBeVisible();

    await thread.getByRole('button', { name: 'Unresolve conversation' }).click();
    await expect(thread.locator('.resolved-line')).toBeHidden();
    await expect(thread.getByRole('button', { name: 'Reply…' })).toBeFocused();
    expect(repo.run('comments').stdout).toBe('');
    await page.getByRole('link', { name: 'Finish review' }).click();
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
    await expect(page.locator('.resolved-row')).toHaveCount(0);
  });

  test('a colleague’s thread you resolve folds to GitHub’s resolved line, Pending until it goes out', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    record(repo, [{ id: '1042', file: 'login.ts', lines: [1, 1], author: 'dana-k', at: '2026-11-23T09:30:00Z', body: 'Why everyone?' }], 'threads');
    await open(page, url);

    const thread = page.locator('.thread[data-thread="1042"]');
    await thread.getByRole('button', { name: 'Resolve' }).click();
    await expect(thread.locator('.resolved-line')).toHaveText(/^YYou marked this conversation as resolved\.PendingShow resolved$/);
    await expect(thread.locator('.thread-body')).toHaveJSProperty('inert', true);

    await thread.getByRole('button', { name: 'Show resolved' }).click();
    await thread.getByRole('button', { name: 'Unresolve conversation' }).click();
    await expect(thread.locator('.resolved-line')).toBeHidden();
    await expect(thread.getByRole('button', { name: 'Resolve' })).toBeVisible();
  });
});

test('an outdated comment sits at the top of its file, under the file’s own comments, with the code it was written on, and its Summary row links there', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await postTo(url, '/comment', { file: 'app.ts', lines: [1, 1], text: 'Bump it once.' });
  await postTo(url, '/comment', { file: 'app.ts', text: 'Split this file.' });
  record(repo, [{ id: '1042', file: 'app.ts', lines: [1, 1], author: 'dana-k', at: '2026-11-23T09:30:00Z', body: 'Why 2?' }], 'threads');
  fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 3;\n');
  git(repo.dir, 'commit', '-am', 'More');
  repo.run('start');
  repo.run('ready');
  await open(page, url);

  const file = page.locator('.file[data-file="app.ts"]');
  await expect(file.locator('.file-threads > .thread')).toHaveText([/Split this file\./, /Why 2\?/, /Bump it once\./]);
  const thread = file.locator('.file-threads .thread').filter({ hasText: 'Bump it once.' });
  await expect(thread.locator('.outdated-head')).toHaveText('app.tsOutdated');
  await expect(thread.locator('.outdated-line')).toHaveText('1export const app = 2;');
  // Coloured as its file.
  await expect(thread.locator('.outdated-line .sx-k').first()).toContainText('export');
  await expect(thread.locator('.comment-you')).toContainText('Bump it once.');
  await expect(thread.getByRole('button', { name: 'Edit' })).toBeVisible();
  await expect(file.locator('.thread-row')).toHaveCount(0);
  await expect(file.locator('.file-comments')).toHaveText('3');

  await page.getByRole('link', { name: 'Finish review' }).click();
  const row = page.locator('.going-row').filter({ hasText: 'Bump it once.' });
  await expect(row.locator('.outdated-tag')).toHaveText('Outdated');
  await row.getByRole('link', { name: 'app.ts:1' }).click();
  await expect(thread).toBeInViewport();
  // Its lines are the old ones, so the thread itself is marked, never today's line 1.
  await expect(thread).toHaveClass(/\bflash\b/);
  await expect(file.locator('tr.flash')).toHaveCount(0);

  await page.getByRole('link', { name: 'Finish review' }).click();
  await page.getByRole('link', { name: '1 unresolved thread' }).click();
  await expect(file.locator('.thread[data-thread="1042"]')).toBeInViewport();
});
