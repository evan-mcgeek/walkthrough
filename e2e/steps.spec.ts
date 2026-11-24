import type { Locator } from '@playwright/test';
import { expect, test } from './walkthrough';

const expectAbove = async (upper: Locator, lower: Locator) => {
  const [one, other] = await Promise.all([upper.boundingBox(), lower.boundingBox()]);
  expect((one?.y ?? Infinity) + (one?.height ?? 0)).toBeLessThanOrEqual(other?.y ?? -Infinity);
};

const steps = [
  {
    title: 'Login check',
    explanation: 'Adds a login function that lets everyone in.\n\nThe app needs a login entry point.',
    assumptions: ['Nothing else calls login yet.', 'Tests run without a network.'],
    files: ['login.ts', { path: 'login.test.ts', explanation: 'Pins that **anyone** gets in.' }],
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
  await expect(page.getByRole('navigation', { name: 'To review' }).getByRole('link')).toHaveCount(4);
});

test('shows one step at a time with its explanation and files, folded steps collapsed, and moves between steps', async ({
  page,
}) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('heading', { name: 'To review 3' })).toBeVisible();
  await expect(rail.getByRole('link')).toHaveText(['Login check', 'Regenerated schema1 problem', 'App version', 'Summary']);
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveAttribute('aria-current', 'step');
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.locator('.tag.decided')).toHaveCount(0);
  await expect(first.getByText('Adds a login function that lets everyone in.', { exact: true })).toBeVisible();
  await expect(first.getByText('The app needs a login entry point.', { exact: true })).toBeVisible();
  await expect(first.locator('.d2h-file-name')).toHaveText(['login.ts', 'login.test.ts']);
  const testFile = first.locator('.d2h-file-wrapper[data-file="login.test.ts"]');
  const aboutFile = first.locator('.file-explanation');
  await expect(aboutFile).toHaveCount(1);
  await expect(testFile.locator('.file-explanation')).toHaveText('Pins that anyone gets in.');
  await expect(aboutFile.locator('strong')).toHaveText('anyone');
  await expectAbove(testFile.locator('.d2h-file-header'), aboutFile);
  await expectAbove(aboutFile, testFile.locator('.d2h-file-diff'));
  // The step's explanation is read at length: primary ink, 15px at 1.6.
  const ink = await first.getByRole('heading', { name: 'Login check' }).evaluate(title => getComputedStyle(title).color);
  const overview = first.locator('.explanation');
  await expect(overview).toHaveCSS('color', ink);
  await expect(overview).toHaveCSS('font-size', '15px');
  await expect(overview).toHaveCSS('line-height', '24px');
  const assumed = first.getByRole('list', { name: 'Assumed, not checked' });
  await expect(assumed.getByRole('listitem')).toHaveText(['Nothing else calls login yet.', 'Tests run without a network.']);
  await first.getByRole('button', { name: 'Assumed, not checked' }).click();
  await expect(assumed).toBeHidden();
  await expect(first.getByRole('button', { name: '2 things assumed, not checked' })).toHaveAttribute('aria-expanded', 'false');
  await first.getByRole('button', { name: '2 things assumed, not checked' }).click();
  await expect(assumed).toBeVisible();
  await expect(first.locator('.d2h-ins')).toContainText(['export const login = () => true;', "test('login', () => {});"]);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toHaveCount(0);

  await page.keyboard.press('j');
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await expect(folded.getByText('Files to skim', { exact: true })).toBeVisible();
  const files = folded.getByRole('list', { name: 'Folded files' });
  await expect(files).toHaveCount(0);
  await folded.getByRole('button', { name: /^1 file/ }).click();
  await expect(files.getByRole('listitem')).toHaveText(/^schema\.json\s*Regenerated from the schema source\.\s*Show diff$/);
  await expect(folded.getByRole('list', { name: 'Problems' }).getByRole('listitem')).toHaveText(
    'schema.json still lists the removed field.',
  );
  const added = folded.locator('.d2h-code-line-ctn').filter({ hasText: '{"field": 1}' });
  await expect(added).toBeHidden();
  await files.getByRole('button', { name: 'Show diff' }).click();
  await expect(files.getByRole('button', { name: 'Hide diff' })).toHaveAttribute('aria-expanded', 'true');
  await expect(added).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);

  await rail.getByRole('link', { name: 'App version' }).click();
  await expect(page.getByRole('region', { name: 'App version' }).getByText('Bumps the app constant.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' }).locator('strong')).toHaveText('constant');
  await expect(page.getByRole('list', { name: 'Assumed, not checked' })).toHaveCount(0);
  await expect(rail.getByRole('link', { name: 'App version' })).toHaveAttribute('aria-current', 'step');
  await expect(rail.getByRole('link', { name: 'Login check' })).not.toHaveAttribute('aria-current');

  await page.goBack();
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('the rail is reached and used from the keyboard, and keeps its focus through a redraw', async ({ page, repo, browserName }) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  // Safari moves between links with Option-Tab, as its own setting leaves plain Tab to form controls.
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

  await rail.getByRole('link', { name: 'Login check' }).focus();
  await page.keyboard.press(tab);
  await expect(rail.getByRole('link', { name: 'Regenerated schema' })).toBeFocused();
  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');
  await expect(rail.getByRole('link', { name: 'Regenerated schema' })).toBeFocused();
  await page.keyboard.press(tab);
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
  await expect(region('Summary')).toBeVisible();
  await page.keyboard.press('j');
  await expect(region('Summary')).toBeVisible();
  await page.keyboard.press('k');
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
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('heading', { name: 'To review 2' })).toBeVisible();
  await rail.getByRole('button', { name: '1 decided' }).click();
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveText('Login checkApprove');

  await page.reload();
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^1 of 3 steps decided, 2 left/);
  await expect(page.getByRole('region', { name: 'Regenerated schema' })).toBeVisible();
});

test('deciding the last open step opens the Summary, which j reaches from the last step too', async ({ page }) => {
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('region', { name: 'Regenerated schema' }).getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('region', { name: 'App version' }).getByRole('button', { name: 'Flag' }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Not this version.');
  await page.getByRole('button', { name: 'Send' }).click();

  const end = page.getByRole('region', { name: 'Summary' });
  const ledger = end.locator('table.ledger');
  await expect(ledger.getByRole('row')).toHaveText(['Decided3', '1Login checkApproved', '2Regenerated schemaApproved', '3App version“Not this version.”Flagged']);
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByText('Nothing left.', { exact: true })).toBeVisible();
  await expect(rail.getByRole('heading', { name: 'To review 0' })).toBeVisible();

  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.keyboard.press('j');
  await expect(end).toBeVisible();
  await ledger.getByRole('link', { name: 'App version' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
});

test('a redraw from the session or from steps recorded again keeps the step being read and its opened diff', async ({
  page,
  repo,
}) => {
  await page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Regenerated schema' }).click();
  const folded = page.getByRole('region', { name: 'Regenerated schema' });
  await folded.getByRole('button', { name: /^1 file/ }).click();
  await folded.getByRole('button', { name: 'Show diff' }).click();
  await expect(folded.getByRole('button', { name: 'Hide diff' })).toHaveAttribute('aria-expanded', 'true');
  const address = page.url();

  repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.getByRole('button', { name: 'Hide diff' })).toHaveAttribute('aria-expanded', 'true');

  repo.record(steps.map(step => (step.title === 'App version' ? { ...step, title: 'App version bump' } : step)));
  await expect(page.getByRole('link', { name: 'App version bump' })).toBeVisible();

  expect(page.url()).toBe(address);
  await expect(folded).toBeVisible();
  await expect(folded.getByRole('button', { name: 'Hide diff' })).toHaveAttribute('aria-expanded', 'true');
});

test('a line note on a folded step opens the fold and its file, so the note is never hidden behind Show diff', async ({ page, repo }) => {
  const noted = repo.record([{ step: '2', file: 'schema.json', lines: [1, 1], label: 'Stale', text: 'Still lists the field.' }], 'note');
  if (noted.status !== 0) throw new Error(noted.stderr);
  await page.getByRole('link', { name: 'Regenerated schema' }).click();
  const folded = page.getByRole('region', { name: 'Regenerated schema' });

  await expect(folded.getByRole('article', { name: 'Stale' })).toBeVisible();
  await expect(folded.getByRole('button', { name: 'Hide diff' })).toHaveAttribute('aria-expanded', 'true');

  await folded.getByRole('button', { name: 'Hide diff' }).click();
  await expect(folded.getByRole('article', { name: 'Stale' })).toBeHidden();
  await expect(folded.getByRole('button', { name: 'Show diff' })).toHaveAttribute('aria-expanded', 'false');
});

test('a step passed on the way to another is not marked read', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const progress = page.getByRole('progressbar', { name: 'Steps decided' });
  await expect(progress).toHaveAttribute('aria-valuetext', '0 of 3 steps decided, 3 left, 1 read');
  const select = page.getByRole('combobox', { name: 'Step' });

  // As arrowing through the select does on Windows and Linux, which picks each option on the way.
  await select.selectOption({ label: 'Regenerated schema' });
  await select.selectOption({ label: 'App version' });

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(progress).toHaveAttribute('aria-valuetext', '0 of 3 steps decided, 3 left, 2 read');
  // Longer than a step takes to count as read.
  await page.waitForTimeout(1500);
  await expect(progress).toHaveAttribute('aria-valuetext', '0 of 3 steps decided, 3 left, 2 read');
});
