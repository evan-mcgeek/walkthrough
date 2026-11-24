import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const checklist = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', text: 'A person can log in.', steps: ['1'] },
    { status: 'not yet', mark: 'not-met', text: 'The app shows its **version**.', steps: ['1', '2'] },
    { status: 'open question', text: 'Who may log in?' },
  ],
};

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record(steps);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
});

test('an item the session marks not met is left in the rail and opens the checklist with its title, items and statuses', async ({
  page,
  repo,
}) => {
  const recorded = repo.record(checklist, 'checklist');
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await page.reload();
  const rail = page.getByRole('navigation', { name: 'To review' });
  const left = rail.getByRole('link', { name: 'The app shows its version.' });
  await expect(left).toHaveText('The app shows its version.Checklist');
  await expect(left).toHaveAttribute('data-state', 'not-met');
  await expect(rail.getByRole('link', { name: 'A person can log in.' })).toHaveCount(0);
  await expect(rail.getByRole('heading', { name: 'To review 3' })).toBeVisible();

  await left.click();

  await expect(left).toHaveAttribute('aria-current', 'page');
  const panel = page.getByRole('region', { name: 'Acceptance criteria' });
  const items = panel.getByRole('listitem');
  await expect(items).toHaveCount(3);
  await expect(items.nth(0).getByText('met', { exact: true })).toBeVisible();
  await expect(items.nth(0).getByText('A person can log in.', { exact: true })).toBeVisible();
  await expect(items.nth(1).getByText('not yet', { exact: true })).toBeVisible();
  await expect(items.nth(1).getByText('The app shows its version.', { exact: true })).toBeVisible();
  await expect(items.nth(1).locator('strong')).toHaveText('version');
  await expect(items.nth(2).getByText('open question', { exact: true })).toBeVisible();
  await expect(items.nth(1)).toHaveAttribute('data-mark', 'not-met');
  await expect(items.nth(0)).toHaveAttribute('data-mark', 'unchecked');
  await expect(items.nth(2).getByRole('link')).toHaveCount(0);
  // The checklist page reads as the panel does: the status, then the steps, on one line under the text.
  await expect(items.locator('.item-line')).toHaveText(['met · Step 1', 'not yet · Steps 1, 2', 'open question']);
});

test('inline code in an item stays on one line in the narrow panel', async ({ page, repo }) => {
  const recorded = repo.record(
    { title: 'Criteria', items: [{ status: 'met', mark: 'met', text: 'Running `walkthrough start --kind review` records the kind.', steps: ['1'] }] },
    'checklist',
  );
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await page.reload();
  await expect(page.locator('h1')).toBeAttached();
  await page.keyboard.press('2');
  const code = page.getByRole('complementary', { name: 'Checklist' }).locator('.item-text code');
  await expect(code).toBeVisible();
  expect(await code.evaluate(inline => inline.getClientRects().length)).toBe(1);
});

test('a status word alone never puts an item in the rail; only the mark the session records does', async ({ page, repo }) => {
  repo.record({ title: 'Criteria', items: [{ status: 'not met', text: 'Who may log in?' }] }, 'checklist');
  await page.reload();
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('link')).toHaveText(['Login check', 'App version', 'Summary']);

  repo.record({ title: 'Criteria', items: [{ status: 'not met', mark: 'not-met', text: 'Who may log in?' }] }, 'checklist');

  await expect(rail.getByRole('link', { name: 'Who may log in?' })).toBeVisible();
});

test('an item link opens the step it links to', async ({ page, repo }) => {
  repo.record(checklist, 'checklist');
  await page.reload();
  await page.getByRole('link', { name: 'The app shows its version.' }).click();
  const second = page.getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem').nth(1);
  await expect(second.getByRole('link')).toHaveText(['1', '2']);
  await expect(second.getByRole('link', { name: 'Step 1' })).toHaveAttribute('title', 'Login check');

  await second.getByRole('link', { name: 'Step 2' }).click();

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Login check' })).toHaveCount(0);
});

test('the checklist shows on the Summary, and is absent when none is recorded', async ({ page, repo }) => {
  await page.goto(`${page.url().split('#')[0] ?? ''}#summary`);
  await expect(page.getByRole('region', { name: 'Summary' })).toBeVisible();
  await expect(page.locator('.checklist')).toHaveCount(0);

  repo.record(checklist, 'checklist');

  await expect(page.getByRole('region', { name: 'Checklist' }).getByRole('listitem')).toHaveCount(3);
});

test('checklist marks and rail states are named for screen readers and in their tooltips, not only drawn', async ({ page, repo }) => {
  const recorded = repo.record(checklist, 'checklist');
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await page.reload();
  const rail = page.getByRole('navigation', { name: 'To review' });

  await expect(rail.getByRole('link', { name: 'App version' }).getByRole('img')).toHaveAccessibleName('Not read yet');
  await expect(rail.getByRole('link', { name: 'App version' })).toHaveAttribute('title', 'Not read yet');
  await expect(rail.getByRole('link', { name: 'Login check' }).getByRole('img')).toHaveAccessibleName('The step you are on');
  await expect(rail.getByRole('link', { name: 'The app shows its version.' }).getByRole('img')).toHaveAccessibleName('Not met');
  await rail.getByRole('link', { name: 'The app shows its version.' }).click();
  const items = page.getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem');
  for (const [at, mark] of ['Not checked yet', 'Not met', 'Not checked yet'].entries())
    await expect(items.nth(at).getByRole('img').first()).toHaveAccessibleName(mark);
});
