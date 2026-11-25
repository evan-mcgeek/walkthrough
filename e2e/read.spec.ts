import fs from 'node:fs';
import path from 'node:path';
import { git } from '../test/helpers';
import { expect, lines, open, record, test } from './walkthrough';

test.use({ files: { 'tasks.ts': lines(60, 'task') } });

const STEPS = [
  { title: 'Login', explanation: 'Adds login.\n\nThe rest of it.', files: ['login.ts', 'app.ts'], look: [{ file: 'login.ts', start: 1, end: 1, label: 'who gets in' }] },
  { title: 'Tasks', explanation: 'Adds tasks.', files: ['tasks.ts'], look: [{ file: 'tasks.ts', start: 50, end: 52, label: 'the last tasks' }] },
];

test('a step reads with Look at and More; Viewed folds a file and counts, and clears when new commits change it', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  await expect(page).toHaveTitle('feature/login · Walkthrough');
  await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
  await expect(page.getByText('The rest of it.')).toBeHidden();
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByText('The rest of it.')).toBeVisible();

  await page.getByRole('link', { name: 'Tasks' }).first().click();
  await page.getByRole('button', { name: /tasks\.ts 50.52 the last tasks/ }).click();
  const target = page.locator('tr[data-line="50"]');
  await expect(target).toHaveClass(/flash/);
  await expect(target).toBeInViewport();

  const header = page.locator('.files-viewed');
  await expect(header).toContainText('0 / 3 files viewed');
  const file = page.locator('.file[data-file="tasks.ts"]');
  await file.getByRole('checkbox', { name: 'Viewed' }).check();
  await expect(file).toHaveClass(/closed/);
  await expect(header).toContainText('1 / 3 files viewed');
  await expect(page.locator('.file-row[title="tasks.ts"]').getByRole('img', { name: 'Viewed' })).toBeVisible();

  fs.writeFileSync(path.join(repo.dir, 'tasks.ts'), lines(61, 'task'));
  git(repo.dir, 'commit', '-am', 'One more task');
  repo.run('start');

  await expect(file.getByText('Changed since last view')).toBeVisible();
  await expect(file).not.toHaveClass(/closed/);
  await expect(file.getByRole('checkbox', { name: 'Viewed' })).not.toBeChecked();
  await expect(header).toContainText('0 / 3 files viewed');
  await expect(page.locator('.file-row[title="tasks.ts"]').getByRole('img', { name: 'Not viewed' })).toBeVisible();
});
