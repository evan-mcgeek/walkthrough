import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const checklist = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', text: 'A person can log in.', steps: ['1'] },
    { status: 'not yet', text: 'The app shows its **version**.', steps: ['1', '2'] },
    { status: 'open question', text: 'Who may log in?' },
  ],
};

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record(steps);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
});

test('shows the session title and items with their statuses beside the steps', async ({ page, repo }) => {
  const recorded = repo.record(checklist, 'checklist');
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await page.reload();

  const panel = page.getByRole('region', { name: 'Acceptance criteria' });
  const items = panel.getByRole('listitem');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).getByText('met', { exact: true })).toBeVisible();
  await expect(items.nth(0).getByText('A person can log in.', { exact: true })).toBeVisible();
  await expect(items.nth(1).getByText('not yet', { exact: true })).toBeVisible();
  await expect(items.nth(1).getByText('The app shows its **version**.', { exact: true })).toBeVisible();
  await expect(items.nth(2).getByText('open question', { exact: true })).toBeVisible();
  await expect(items.nth(2).getByRole('link')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('an item link opens the step it links to', async ({ page, repo }) => {
  repo.record(checklist, 'checklist');
  await page.reload();
  const second = page.getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem').nth(1);
  await expect(second.getByRole('link')).toHaveText(['Step 1', 'Step 2']);

  await second.getByRole('link', { name: 'Step 2' }).click();

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);
});

test('with no checklist recorded, the panel is absent', async ({ page }) => {
  await page.reload();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(page.locator('.checklist')).toHaveCount(0);
});
