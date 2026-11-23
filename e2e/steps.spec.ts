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
  await expect(page.getByRole('navigation', { name: "What's left" }).getByRole('link')).toHaveCount(3);
});

test('shows one step at a time with its explanation and files, folded steps collapsed, and moves between steps', async ({
  page,
}) => {
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(rail.getByRole('heading', { name: 'Left 3' })).toBeVisible();
  await expect(rail.getByRole('link')).toHaveText(['Login check', 'Regenerated schema1 problem', 'App version']);
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveAttribute('aria-current', 'step');
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.getByText('Undecided', { exact: true })).toBeVisible();
  await expect(first.getByText('Adds a login function that lets everyone in.', { exact: true })).toBeVisible();
  await expect(first.getByText('The app needs a login entry point.', { exact: true })).toBeVisible();
  await expect(first.locator('.d2h-file-name')).toHaveText(['login.ts', 'login.test.ts']);
  const assumed = first.getByRole('list', { name: 'Assumed, not read' });
  await expect(assumed.getByRole('listitem')).toHaveText(['Nothing else calls login yet.', 'Tests run without a network.']);
  await first.getByRole('button', { name: 'Assumed, not read' }).click();
  await expect(assumed).toBeHidden();
  await expect(first.getByRole('button', { name: 'Assumed, not read' })).toHaveAttribute('aria-expanded', 'false');
  await first.getByRole('button', { name: 'Assumed, not read' }).click();
  await expect(assumed).toBeVisible();
  await expect(first.locator('.d2h-ins')).toContainText(['export const login = () => true;', "test('login', () => {});"]);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toHaveCount(0);

  await page.keyboard.press('j');
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await expect(folded.getByText('Folded by the session, not shown line by line.')).toBeVisible();
  const files = folded.getByRole('list', { name: 'Folded files' });
  await expect(files).toHaveCount(0);
  await folded.getByRole('button', { name: /^1 file/ }).click();
  await expect(files.getByRole('listitem')).toHaveText('schema.jsonRegenerated from the schema source.');
  await expect(folded.getByRole('list', { name: 'Problems the session found' }).getByRole('listitem')).toHaveText(
    'schema.json still lists the removed field.',
  );
  const added = folded.locator('.d2h-code-line-ctn').filter({ hasText: '{"field": 1}' });
  await expect(added).toBeHidden();
  await folded.getByText('Show the diff').click();
  await expect(added).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);

  await rail.getByRole('link', { name: 'App version' }).click();
  await expect(page.getByRole('region', { name: 'App version' }).getByText('Bumps the app constant.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' }).locator('strong')).toHaveText('constant');
  await expect(page.getByRole('list', { name: 'Assumed, not read' })).toHaveCount(0);
  await expect(rail.getByRole('link', { name: 'App version' })).toHaveAttribute('aria-current', 'step');
  await expect(rail.getByRole('link', { name: 'Login check' })).not.toHaveAttribute('aria-current');

  await page.goBack();
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('the rail is reached and used from the keyboard', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();

  await rail.getByRole('link', { name: 'Login check' }).focus();
  await page.keyboard.press('Tab');
  await expect(rail.getByRole('link', { name: 'Regenerated schema' })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
});

test('j and k, and the right and left arrows, move between steps, but not while typing', async ({ page }) => {
  const region = (name: string) => page.getByRole('region', { name });
  await expect(region('Login check')).toBeVisible();

  await page.keyboard.press('j');
  await expect(region('Regenerated schema')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(region('App version')).toBeVisible();
  await page.keyboard.press('j');
  await expect(region('App version')).toBeVisible();
  await page.keyboard.press('k');
  await expect(region('Regenerated schema')).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(region('Login check')).toBeVisible();

  const ask = region('Login check').getByRole('textbox', { name: 'Ask about this step' });
  await ask.focus();
  await page.keyboard.press('j');
  await page.keyboard.press('ArrowRight');
  await expect(ask).toHaveValue('j');
  await expect(region('Login check')).toBeVisible();
});

test('shows how many steps are decided and left, and approving moves on to the next open step', async ({ page }) => {
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^0 of 3 steps decided, 3 left/);

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^1 of 3 steps decided, 2 left/);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(rail.getByRole('heading', { name: 'Left 2' })).toBeVisible();
  await rail.getByRole('button', { name: '1 decided' }).click();
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveText('Login checkDecided: Approve');

  await page.reload();
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^1 of 3 steps decided, 2 left/);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('deciding the last open step opens the end of the walkthrough, which j reaches from the last step too', async ({ page }) => {
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('region', { name: 'Regenerated schema' }).getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('region', { name: 'App version' }).getByRole('button', { name: 'Flag' }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Not this version.');
  await page.getByRole('button', { name: 'Send' }).click();

  const end = page.getByRole('region', { name: 'All 3 steps decided' });
  await expect(end.getByRole('row')).toHaveText(['1Login checkApprove', '2Regenerated schemaApprove', '3App versionNot this version.Flag']);
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(rail.getByText('Everything is decided.')).toBeVisible();
  await expect(rail.getByRole('heading', { name: 'Left 0' })).toBeVisible();

  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.keyboard.press('j');
  await expect(end).toBeVisible();
  await end.getByRole('link', { name: 'Login check' }).click();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('a redraw from the session or from steps recorded again keeps the step being read and its opened diff', async ({
  page,
  repo,
}) => {
  await page.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'Regenerated schema' }).click();
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await folded.getByRole('button', { name: /^1 file/ }).click();
  await folded.getByText('Show the diff').click();
  await expect(folded.locator('details')).toHaveAttribute('open', '');
  const address = page.url();

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.locator('details')).toHaveAttribute('open', '');

  repo.record(steps.map(step => (step.title === 'App version' ? { ...step, title: 'App version bump' } : step)));
  await expect(page.getByRole('link', { name: 'App version bump' })).toBeVisible();

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.locator('details')).toHaveAttribute('open', '');
});
