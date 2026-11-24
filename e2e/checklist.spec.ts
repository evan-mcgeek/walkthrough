import type { Locator, Page } from '@playwright/test';
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
  await expect(left).toHaveText('The app shows its version.Checklist · not met');
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

  await expect(rail.getByRole('link', { name: 'App version' }).getByRole('img')).toHaveAccessibleName('Not decided yet');
  await expect(rail.getByRole('link', { name: 'App version' })).toHaveAttribute('title', 'Not decided yet');
  await expect(rail.getByRole('link', { name: 'Login check' }).getByRole('img')).toHaveAccessibleName('The step you are on');
  await expect(rail.getByRole('link', { name: 'The app shows its version.' }).getByRole('img')).toHaveAccessibleName('Not met');
  await rail.getByRole('link', { name: 'The app shows its version.' }).click();
  const items = page.getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem');
  for (const [at, mark] of ['Not checked yet', 'Not met', 'Not checked yet'].entries())
    await expect(items.nth(at).getByRole('img').first()).toHaveAccessibleName(mark);
});

/** A design token as the browser resolves it for colour, in the page's current theme. */
const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

const marked = {
  title: 'Acceptance criteria',
  items: [
    { status: 'met', mark: 'met', text: 'A todo can have a due date.', steps: ['1'] },
    { status: 'partly met', mark: 'partly', text: 'Overdue todos show in red.', steps: ['1'] },
    { status: 'not met', mark: 'not-met', text: 'Due dates sort the list.', steps: ['1'] },
    { status: 'not checked', mark: 'unchecked', text: 'Due dates survive a reload.', steps: ['1'] },
  ],
};

test('a checklist status wears its colour everywhere it shows: met green, partly amber, not met red, not checked muted', async ({ page, repo }) => {
  repo.record(marked, 'checklist');
  const at = (address: string) => page.goto(`${page.url().split('#')[0] ?? ''}#${address}`);
  const expectColours = async (shown: Locator) => {
    await expect(shown).toHaveCount(4);
    for (const [index, token] of ['--ok', '--amber', '--bad', '--muted'].entries())
      await expect(shown.nth(index)).toHaveCSS('color', await tokenColor(page, token));
  };
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await at('1');
    await expectColours(page.getByRole('complementary', { name: 'In this step' }).locator('li[data-mark] > .icon'));
    const left = page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Due dates sort the list.' });
    await expect(left.locator('.icon')).toHaveCSS('color', await tokenColor(page, '--bad'));

    await at('checklist');
    const items = page.getByRole('main').getByRole('region', { name: 'Acceptance criteria' }).getByRole('listitem');
    await expectColours(items.locator('> .icon'));
    await expectColours(items.locator('.item-status'));

    await at('summary');
    await expectColours(page.getByRole('complementary', { name: 'Finish' }).locator('.rail-checklist .icon'));
  }

  await page.keyboard.press('?');
  const help = page.getByRole('dialog', { name: 'Help: what things mean' });
  for (const words of ['Met (green)', 'Partly met (amber)', 'Not met (red)', 'Not checked yet (grey)'])
    await expect(help.getByRole('row').filter({ hasText: words })).toHaveCount(1);
});

test('a long checklist item holds to two lines in To review, with all of it in its tooltip and on its page', async ({ page, repo }) => {
  const text = Array.from({ length: 6 }, () => 'A todo with a due date in the past shows as overdue in the list.').join(' ');
  repo.record({ title: 'Acceptance criteria', items: [{ status: 'not met', mark: 'not-met', text }] }, 'checklist');
  const row = page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: text });
  const name = row.locator('.queue-name');
  await expect(name).toHaveAttribute('title', text);
  const lines = (shown: Locator) =>
    shown.evaluate(box => Math.round(box.getBoundingClientRect().height / parseFloat(getComputedStyle(box).lineHeight)));
  expect(await lines(name)).toBe(2);
  expect(await name.evaluate(box => box.scrollHeight > box.clientHeight)).toBe(true);

  await row.click();

  const full = page.getByRole('main').locator('.item-text');
  await expect(full).toHaveText(text);
  expect(await lines(full)).toBeGreaterThan(2);
});
