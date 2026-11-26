import fs from 'node:fs';
import path from 'node:path';
import { git, postTo } from '../test/helpers';
import { expect, lines, open, record, test } from './walkthrough';

const TASKS = lines(60, 'task');
test.use({ start: { 'tasks.ts': TASKS }, files: { 'tasks.ts': TASKS.replace('task5 = 5;', 'task5 = 50;').replace('task15 = 15;', 'task15 = 150;').replace('task40 = 40;', 'task40 = 400;') } });

const STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'Tasks', explanation: 'Changes three tasks.', files: ['tasks.ts', 'app.ts'], look: [{ file: 'tasks.ts', start: 15, end: 15, label: 'the one kept' }] },
];

const commit = (dir: string, file: string, text: string) => {
  fs.writeFileSync(path.join(dir, file), text);
  git(dir, 'commit', '-am', 'More');
};

test('back after a review, the page opens on the changes since; a quiet step offers all changes, and switching keeps Viewed', async ({ page, repo, url }) => {
  record(repo, STEPS);
  for (const file of ['login.ts', 'tasks.ts', 'app.ts']) await postTo(url, '/viewed', { file, viewed: true });
  await postTo(url, '/comment', { file: 'login.ts', lines: [1, 1], text: 'Who gets in?' });
  await postTo(url, '/comment', { file: 'tasks.ts', lines: [40, 40], text: 'Why 400?' });
  const ai = /: ([0-9a-f]{8})\./.exec(repo.record([{ file: 'tasks.ts', lines: [6, 6], body: 'Six stays.' }], 'comment').stdout)?.[1] ?? '';
  expect((await postTo(url, '/submit', { summary: '' })).status).toBe(200);
  // One task changes again and the other goes back to how it was.
  commit(repo.dir, 'tasks.ts', TASKS.replace('task5 = 5;', 'task5 = 500;').replace('task15 = 15;', 'task15 = 150;'));
  repo.run('start');
  record(repo, STEPS);
  expect(repo.run('resolve', ai).status).toBe(0);

  await open(page, url);
  const changes = page.locator('.changes-button');
  await expect(changes).toHaveText('Changes since your last review');
  await expect(changes).toHaveAttribute('title', 'Changes since your last review (C)');
  await expect(page.locator('.step-row.quiet')).toHaveText(/Login/);
  await expect(page.locator('.file-row')).toHaveCount(1);
  await expect(page.locator('.files-viewed')).toContainText('2 / 3 files viewed');

  await expect(page.getByText('No changes since your last review.')).toBeVisible();
  await expect(page.getByText('The files are as you viewed them.')).toBeVisible();
  await expect(page.locator('.file[data-file="login.ts"]')).toHaveClass(/closed/);

  await page.locator('.step-row', { hasText: 'Tasks' }).click();
  await expect(page.locator('.file')).toHaveCount(1);
  const tasks = page.locator('.file[data-file="tasks.ts"]');
  await expect(tasks.getByText('Changed since last view')).toBeVisible();
  await expect(tasks.locator('.d2h-ins .d2h-code-line-ctn')).toHaveText([/task5 = 500/, /task40 = 40;/]);
  await expect(tasks.locator('tr[data-line="5"] .line-num2')).toHaveAttribute('role', 'button');
  await expect(tasks.locator('tr[data-line="40"] .line-num2')).not.toHaveAttribute('role', 'button');
  await expect(tasks.locator('.file-threads .thread')).toContainText('Why 400?');
  await expect(tasks.locator(`.thread[data-thread="${ai}"] .resolved-line`)).toContainText('AI marked this conversation as resolved.');
  await tasks.getByRole('checkbox', { name: 'Viewed' }).check();

  await page.keyboard.press('c');
  const menu = page.getByRole('menu', { name: 'Changes' });
  await expect(menu.getByRole('menuitemradio', { name: /All changes\s*3 files/ })).toBeVisible();
  await expect(menu.getByRole('menuitemradio', { name: /Changes since your last review\s*1 commit · 1 file/ })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  await page.locator('.step-row', { hasText: 'Login' }).click();
  await page.getByRole('button', { name: 'Show all changes' }).click();
  await expect(changes).toHaveText('All changes');
  await expect(page.locator('.file-row')).toHaveCount(3);
  await expect(page.locator('.nothing-new')).toHaveCount(0);

  await page.locator('.step-row', { hasText: 'Tasks' }).click();
  await expect(tasks.getByRole('checkbox', { name: 'Viewed' })).toBeChecked();
  await expect(page.locator('.file')).toHaveCount(2);
  await changes.click();
  await page.getByRole('menuitemradio', { name: /Changes since your last review/ }).click();
  await expect(changes).toHaveText('Changes since your last review');
  await expect(page.getByRole('heading', { level: 1, name: 'Tasks' })).toBeVisible();
  await expect(tasks.getByRole('checkbox', { name: 'Viewed' })).toBeChecked();
  await expect(page.locator('.files-viewed')).toContainText('3 / 3 files viewed');

  // Look at lines only all changes show switches to them.
  await page.getByRole('button', { name: /tasks\.ts 15 the one kept/ }).click();
  await expect(changes).toHaveText('All changes');
  await expect(tasks.locator('tr[data-line="15"]')).toHaveClass(/flash/);
});

test('the behind line shows within a poll of a commit on the branch, with the command to copy', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);
  const behind = page.locator('.behind');
  await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
  await expect(behind).toBeHidden();
  commit(repo.dir, 'app.ts', 'export const app = 3;\n');
  await expect(behind).toContainText('The branch has new commits. Run the walkthrough again to see them:');
  await expect(behind.locator('code')).toHaveText('/walkthrough');
  await expect(behind.getByRole('button', { name: 'Copy command' })).toBeVisible();
  await page.getByRole('link', { name: 'Finish review' }).click();
  await expect(behind).toBeVisible();
});

test('J and K move through the files across steps, V marks the file you are on Viewed', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);
  await expect(page.locator('.file[data-file="login.ts"] .viewed-toggle')).toHaveAttribute('title', 'Viewed (V)');

  await page.keyboard.press('j');
  await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'login.ts');
  await expect(page.locator('.file-row.on')).toHaveAttribute('title', 'login.ts');
  await page.keyboard.press('j');
  await expect(page.getByRole('heading', { level: 1, name: 'Tasks' })).toBeVisible();
  await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'tasks.ts');
  await expect(page.locator('.file-row.on')).toHaveAttribute('title', 'tasks.ts');

  await page.keyboard.press('v');
  await expect(page.locator('.file[data-file="tasks.ts"]').getByRole('checkbox', { name: 'Viewed' })).toBeChecked();
  await expect(page.locator('.files-viewed')).toContainText('1 / 3 files viewed');
  await page.keyboard.press('Control+v');
  await page.keyboard.press('j');
  await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'app.ts');
  await page.keyboard.press('k');
  await expect(page.locator('.files-viewed')).toContainText('1 / 3 files viewed');

  await page.keyboard.press('k');
  await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
  await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'login.ts');
});
