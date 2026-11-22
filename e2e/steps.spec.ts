import { expect, test } from './walkthrough';

const steps = [
  {
    title: 'Login check',
    what: 'Adds a login function that lets everyone in.',
    why: 'The app needs a login entry point.',
    files: ['login.ts'],
    tests: ['login.test.ts'],
  },
  {
    title: 'App version',
    what: 'Bumps the app constant and adds a dependency.',
    why: 'The app now has login.',
    files: ['app.ts', 'package.json'],
  },
];

test.use({
  files: {
    'login.test.ts': "test('login', () => {});\n",
    'package.json': '{"dependencies":{"left-pad":"^1.3.0"}}\n',
    'package-lock.json': '{"lockfileVersion":3,"packages":{"":{"dependencies":{"left-pad":"^1.2.0"}}}}\n',
  },
});

// Asking for the url starts the walkthrough with the page open; the steps come after, as the skill records them.
test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record(steps);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await page.reload();
});

test('shows one step at a time with what changed, why and its tests, and moves between steps', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Steps' });
  await expect(nav.getByRole('link')).toHaveText(['1. Login check', '2. App version', '3. Mechanical changes']);
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.getByText('Adds a login function that lets everyone in.')).toBeVisible();
  await expect(first.getByText('The app needs a login entry point.')).toBeVisible();
  await expect(first.getByText('Tests: login.test.ts', { exact: true })).toBeVisible();
  await expect(first.locator('.d2h-ins')).toContainText(["test('login', () => {});", 'export const login = () => true;']);
  await expect(page.getByRole('region', { name: 'App version' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Next' }).click();
  const second = page.getByRole('region', { name: 'App version' });
  await expect(second.getByText('No tests in this step.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);

  await nav.getByRole('link', { name: '3. Mechanical changes' }).click();
  const mechanical = page.getByRole('region', { name: 'Mechanical changes' });
  await expect(mechanical.getByText('package-lock.json (lockfile)')).toBeVisible();
  await expect(mechanical.getByText('Checked for consistency, not line by line.')).toBeVisible();
  await expect(mechanical.getByRole('listitem').filter({ hasText: 'does not match' })).toHaveText(
    'package-lock.json does not match package.json: dependencies left-pad is ^1.3.0 in package.json but ^1.2.0 in package-lock.json',
  );
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();

  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
});

test('shows how many steps are decided and left, and approving moves on to the next open step', async ({ page }) => {
  await expect(page.getByText('0 of 3 steps decided, 3 left')).toBeVisible();

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('1 of 3 steps decided, 2 left')).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Steps' }).getByRole('link', { name: '1. Login check' })).toHaveClass(
    /decided/,
  );

  await page.reload();
  await expect(page.getByText('1 of 3 steps decided, 2 left')).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
});

test('a redraw from the session keeps the step being read and its opened diff', async ({ page, repo }) => {
  await page.getByRole('navigation', { name: 'Steps' }).getByRole('link', { name: '3. Mechanical changes' }).click();
  const mechanical = page.getByRole('region', { name: 'Mechanical changes' });
  await mechanical.getByText('Show the diff').click();
  await expect(mechanical.locator('details')).toHaveAttribute('open', '');
  const address = page.url();

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  expect(page.url()).toBe(address);
  await expect(mechanical).toBeVisible();
  await expect(mechanical.locator('details')).toHaveAttribute('open', '');
});
