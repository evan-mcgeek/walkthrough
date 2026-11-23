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
  const rail = page.getByRole('navigation', { name: "What's left" });

  await expect(step.getByText('The session is still checking this step. Findings may still arrive.')).toBeVisible();
  await expect(rail.getByRole('link', { name: /Login/ })).toContainText('Being checked');
  await expect(rail.getByRole('link', { name: /Cart/ })).not.toContainText('Being checked');
  await expect(step.getByRole('button', { name: 'Approve' })).toBeDisabled();
  await expect(step.getByRole('button', { name: 'Flag' })).toBeDisabled();
  await expect(step.getByText('Decide once the session has checked this step.')).toBeVisible();
  await page.keyboard.press('a');
  await page.keyboard.press('f');
  await expect(step.getByRole('textbox', { name: 'Note' })).toHaveCount(0);
  await expect(step.getByText('Undecided', { exact: true })).toBeVisible();

  await step.getByRole('textbox', { name: 'Ask about this step' }).fill('Why login?');
  await step.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');
  await expect(step.getByText('Waiting for the session to answer.')).toBeVisible();
  await rail.getByRole('link', { name: 'Summary' }).click();
  const open = page.getByRole('region', { name: 'Still open' });
  await expect(open.getByRole('listitem')).toHaveText(['1 LoginBeing checked', '2 AppBeing checked', '3 CartUndecided']);

  run(repo, 'checking', '2');
  await rail.getByRole('link', { name: /Login/ }).click();
  await expect(step.getByText('The session is still checking this step.', { exact: false })).toHaveCount(0);
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App' })).toBeVisible();
  await expect(rail.getByRole('button', { name: '1 decided' })).toBeVisible();
});

test('a finding pinned after the person decided the step brings it back with a banner that goes to it', async ({ page, repo }) => {
  await page.getByRole('region', { name: 'Login' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App' })).toBeVisible();
  const rail = page.getByRole('navigation', { name: "What's left" });
  const banner = page.getByRole('alert');

  record(repo, [finding('1', 'Everyone gets in.')], 'note');

  await expect(banner).toHaveText('New finding on step 1, Login, which you approved.Go to step');
  await expect(rail.locator(':scope > .queue-item').filter({ hasText: 'Login' })).toContainText('New finding since you decided');
  await banner.getByRole('button', { name: 'Go to step' }).click();
  const step = page.getByRole('region', { name: 'Login' });
  await expect(step).toBeVisible();
  await expect(step.getByText('Decided: Approve', { exact: true })).toBeVisible();
  await expect(banner).toBeHidden();

  await page.reload();
  await expect(step).toBeVisible();
  await expect(banner).toBeHidden();
  await expect(rail.locator(':scope > .queue-item').filter({ hasText: 'Login' })).toContainText('New finding since you decided');
});

test('several new findings read as one banner, a finding on an unread step raises none, and dismiss hides it', async ({ page, repo }) => {
  await page.getByRole('region', { name: 'Login' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.locator('[data-key="row:2"][data-state="read"]')).toBeVisible();
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
