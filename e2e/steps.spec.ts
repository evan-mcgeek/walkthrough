import { expect, test } from './walkthrough';

const steps = [
  {
    title: 'Login check',
    explanation: 'Adds a login function that lets everyone in.\n\nThe app needs a login entry point.',
    assumptions: ['Nothing else calls login yet.', 'Tests run without a network.'],
    files: ['login.ts', 'login.test.ts'],
  },
  {
    title: 'Regenerated schema',
    folded: true,
    files: [{ path: 'schema.json', reason: 'Regenerated from the schema source.' }],
    problems: ['schema.json still lists the removed field.'],
  },
  { title: 'App version', explanation: 'Bumps the app **constant**.', files: ['app.ts'] },
];

test.use({ files: { 'login.test.ts': "test('login', () => {});\n", 'schema.json': '{"field": 1}\n' } });

// Asking for the url starts the walkthrough with the page open; the steps come after, as the skill records them.
test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record(steps);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('navigation', { name: 'Steps' })).toBeVisible();
});

test('shows one step at a time with its explanation and files, folded steps collapsed, and moves between steps', async ({
  page,
}) => {
  const nav = page.getByRole('navigation', { name: 'Steps' });
  await expect(nav.getByRole('link')).toHaveText(['1. Login check', '2. Regenerated schema', '3. App version']);
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.getByText('Adds a login function that lets everyone in.', { exact: true })).toBeVisible();
  await expect(first.getByText('The app needs a login entry point.', { exact: true })).toBeVisible();
  await expect(first.getByText('Files: login.ts, login.test.ts', { exact: true })).toBeVisible();
  const assumed = first.getByRole('list', { name: 'Assumed, not read' });
  await expect(assumed.getByRole('listitem')).toHaveText(['Nothing else calls login yet.', 'Tests run without a network.']);
  await expect(first.locator('.d2h-ins')).toContainText(["test('login', () => {});", 'export const login = () => true;']);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Next' }).click();
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await expect(folded.getByText('Folded by the session, not shown line by line.')).toBeVisible();
  await expect(folded.getByRole('listitem').filter({ hasText: 'schema.json:' })).toHaveText(
    'schema.json: Regenerated from the schema source.',
  );
  await expect(folded.getByRole('listitem').filter({ hasText: 'removed field' })).toHaveText(
    'schema.json still lists the removed field.',
  );
  const added = folded.locator('.d2h-code-line-ctn').filter({ hasText: '{"field": 1}' });
  await expect(added).toBeHidden();
  await folded.getByText('Show the diff').click();
  await expect(added).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);

  await nav.getByRole('link', { name: '3. App version' }).click();
  await expect(page.getByRole('region', { name: 'App version' }).getByText('Bumps the app constant.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' }).locator('strong')).toHaveText('constant');
  await expect(page.getByRole('list', { name: 'Assumed, not read' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();

  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('shows how many steps are decided and left, and approving moves on to the next open step', async ({ page }) => {
  await expect(page.getByText('0 of 3 steps decided, 3 left')).toBeVisible();

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('1 of 3 steps decided, 2 left')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
  const nav = page.getByRole('navigation', { name: 'Steps' });
  await nav.getByText('1 decided').click();
  await expect(nav.getByRole('link', { name: '1. Login check' })).toHaveClass(/decided/);

  await page.reload();
  await expect(page.getByText('1 of 3 steps decided, 2 left')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('a redraw from the session or from steps recorded again keeps the step being read and its opened diff', async ({
  page,
  repo,
}) => {
  await page.getByRole('navigation', { name: 'Steps' }).getByRole('link', { name: '2. Regenerated schema' }).click();
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await folded.getByText('Show the diff').click();
  await expect(folded.locator('details')).toHaveAttribute('open', '');
  const address = page.url();

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.locator('details')).toHaveAttribute('open', '');

  repo.record(steps.map(step => (step.title === 'App version' ? { ...step, title: 'App version bump' } : step)));
  await expect(page.getByRole('link', { name: '3. App version bump' })).toBeVisible();

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.locator('details')).toHaveAttribute('open', '');
});
