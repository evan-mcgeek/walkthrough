import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

test.use({ files: { 'cart.ts': 'export const cart = [];\n' } });

const steps = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
  { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
];

const run = (repo: Repo, ...args: string[]) => {
  const ran = repo.run(...args);
  if (ran.status !== 0) throw new Error(ran.stderr);
};
const record = (repo: Repo, input: unknown, command: string) => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};
const finding = (step: string, text: string) => ({ step, label: 'Finding', text, finding: true });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps, 'steps');
  await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
});

test('a step being checked says so and holds its actions, while the person can still read and ask about it', async ({ page, repo }) => {
  run(repo, 'checking', '1', '2');
  const step = page.getByRole('region', { name: 'Login' });
  const rail = page.getByRole('navigation', { name: 'To review' });

  await expect(step.getByText('Still checking this step. Findings may arrive.')).toBeVisible();
  await expect(rail.getByRole('link', { name: /Login/ })).toContainText('Being checked');
  await expect(rail.getByRole('link', { name: /Cart/ })).not.toContainText('Being checked');
  await expect(step.getByRole('button', { name: 'Approve' })).toBeDisabled();
  await expect(step.getByRole('button', { name: 'Flag' })).toBeDisabled();
  await expect(step.getByText('Decide after the check', { exact: true })).toBeVisible();
  await page.keyboard.press('a');
  await page.keyboard.press('f');
  await expect(step.getByRole('textbox', { name: 'Note' })).toHaveCount(0);
  await expect(step.locator('.tag.decided')).toHaveCount(0);

  await step.getByRole('textbox', { name: 'Ask about this step' }).fill('Why login?');
  await step.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');
  await expect(step.getByText('Waiting for an answer')).toBeVisible();
  await rail.getByRole('link', { name: 'Summary' }).click();
  await expect(page.getByText('0 of 3 steps decided · 2 being checked', { exact: true })).toBeVisible();
  const ledger = page.locator('table.ledger');
  await expect(ledger.getByRole('row')).toHaveText([
    'Still open3',
    '1LoginBeing checked',
    '2AppBeing checked',
    '3CartApproveFlag',
  ]);
  await expect(ledger.locator('.ledger-decision.muted')).toHaveText(['Being checked', 'Being checked', '']);

  run(repo, 'checking', '2');
  await rail.getByRole('link', { name: /Login/ }).click();
  await expect(step.getByText('Still checking this step.', { exact: false })).toHaveCount(0);
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App' })).toBeVisible();
  await expect(rail.getByRole('button', { name: '1 decided' })).toBeVisible();
});

test('a finding pinned after the person decided the step brings it back with a banner that goes to it, and the step says so', async ({
  page,
  repo,
}) => {
  await page.getByRole('region', { name: 'Login' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App' })).toBeVisible();
  const rail = page.getByRole('navigation', { name: 'To review' });
  const banner = page.getByRole('alert');

  record(repo, [{ ...finding('1', 'Everyone gets in.'), file: 'login.ts', lines: [1, 1] }], 'note');

  await expect(banner).toHaveText('New finding on step 1, which you approved.Go to step');
  await expect(rail.locator(':scope > .queue-item').filter({ hasText: 'Login' })).toContainText('New finding');
  await banner.getByRole('button', { name: 'Go to step' }).click();
  const step = page.getByRole('region', { name: 'Login' });
  await expect(step).toBeVisible();
  await expect(step.getByText('Approved', { exact: true })).toBeVisible();
  await expect(banner).toBeHidden();
  await expect(step.getByText('New finding after you approved.', { exact: true })).toBeVisible();
  await expect(step.getByRole('article', { name: 'Finding' }).getByText('line 1 · new since you approved', { exact: true })).toBeVisible();
  await expect(step.getByRole('button', { name: 'Change', exact: true })).toBeVisible();
  await expect(step.getByRole('button', { name: 'Approve' })).toHaveCount(0);
  await expect(step.locator('.open-findings')).toHaveText('1 new finding');
  await rail.getByRole('link', { name: 'Summary' }).click();
  await expect(page.locator('table.ledger').getByRole('row', { name: /Login/ })).toHaveText(
    '1Login1 new finding since you approved.Approved',
  );
  await rail.locator(':scope > .queue-item').filter({ hasText: 'Login' }).click();

  await page.reload();
  await expect(step).toBeVisible();
  await expect(banner).toBeHidden();
  await expect(rail.locator(':scope > .queue-item').filter({ hasText: 'Login' })).toContainText('New finding');
});

test('several new findings read as one banner, a finding on an unread step raises none, and dismiss hides it', async ({ page, repo }) => {
  await page.getByRole('region', { name: 'Login' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.locator('[data-key="row:2"][data-state="cur"]')).toBeVisible();
  const banner = page.getByRole('alert');

  record(repo, [finding('3', 'Not read yet.'), { step: '2', label: 'Nit', text: 'Pinned with it.' }], 'note');
  await expect(page.getByRole('region', { name: 'App' }).getByText('Pinned with it.')).toBeVisible();
  await expect(banner).toBeHidden();

  record(repo, [finding('1', 'One.'), finding('2', 'Two.'), finding('2', 'Three.')], 'note');

  await expect(banner).toHaveText('3 new findings on steps 1 and 2.Go to step');
  await banner.getByRole('button', { name: 'Dismiss' }).click();
  await expect(banner).toBeHidden();
  await expect(page.getByRole('region', { name: 'App' })).toBeVisible();
});
