import fs from 'node:fs';
import path from 'node:path';
import { git, type Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

test.use({ files: { 'login.ts': 'one\ntwo\nthree\n' } });

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};

/** Login ("1") and App ("2") approved, notes on both, a checklist linking both; then the head reverts app.ts and drops line three of login.ts. */
test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, [
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
  ]);
  record(repo, { title: 'Criteria', items: [{ status: 'met', text: 'Logs in.', steps: ['1', '2'] }] }, 'checklist');
  record(
    repo,
    [
      { step: '2', label: 'Version note', text: 'Why bump it?' },
      { step: '1', file: 'login.ts', lines: [3, 3], label: 'Third line', text: 'Is three needed?' },
      { step: '1', file: 'login.ts', lines: [1, 1], label: 'First line', text: 'One is fine.' },
    ],
    'note',
  );
  for (const name of ['Login check', 'App version']) {
    await page.getByRole('link', { name: new RegExp(name) }).click();
    await page.getByRole('region', { name }).getByRole('button', { name: 'Approve' }).click();
  }
  fs.writeFileSync(path.join(repo.dir, 'login.ts'), 'one\ntwo\n');
  fs.writeFileSync(path.join(repo.dir, 'app.ts'), 'export const app = 1;\n');
  git(repo.dir, 'commit', '-am', 'Trim');
  const again = repo.run('start');
  if (again.status !== 0) throw new Error(again.stderr);
  await page.goto(repo.url());
});

test('a step whose diff changed shows reopened with the decision it had', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Steps' });
  await expect(nav.getByRole('listitem')).toHaveCount(1);
  await expect(nav.getByRole('listitem').filter({ hasText: 'Login check' })).toContainText('Reopened');
  const step = page.getByRole('region', { name: 'Login check' });
  await expect(step.getByText('Reopened: changed since you chose Approve', { exact: true })).toBeVisible();
  await expect(step.getByRole('article', { name: 'First line' })).toBeVisible();
});

test('notes whose step or lines are gone show detached, still open to a reply', async ({ page }) => {
  const detached = page.getByRole('region', { name: 'Detached' });
  await expect(detached.getByRole('article')).toHaveCount(2);
  const version = detached.getByRole('article', { name: 'Version note' });
  await expect(version.getByText('Was on a step no longer in the change', { exact: true })).toBeVisible();
  const third = detached.getByRole('article', { name: 'Third line' });
  await expect(third.getByText('Was on login.ts, line 3', { exact: true })).toBeVisible();
  await expect(third.getByRole('textbox', { name: 'Reply' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' }).getByText('Is three needed?')).toHaveCount(0);
});

test('changed files in no step yet are named until the session records steps for them', async ({ page, repo }) => {
  fs.writeFileSync(path.join(repo.dir, 'cart.ts'), 'export const cart = [];\n');
  git(repo.dir, 'add', 'cart.ts');
  git(repo.dir, 'commit', '-m', 'Add cart');
  repo.run('start');
  const notice = page.getByRole('region', { name: 'In no step yet' });

  await expect(notice).toContainText('cart.ts');
  await expect(notice).not.toContainText('login.ts');

  record(repo, [
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
  ]);

  await expect(notice).toHaveCount(0);
});

test('a checklist link to a step that is gone shows as gone, beside the links that remain', async ({ page }) => {
  const item = page.getByRole('region', { name: 'Criteria' }).getByRole('listitem');
  await expect(item.getByRole('link')).toHaveText(['Step 1']);
  await expect(item.getByText('1 linked step is no longer in the change', { exact: true })).toBeVisible();
});
