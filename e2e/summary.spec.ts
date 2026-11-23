import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

test.use({ files: { 'cart.ts': 'export const cart = [];\n', 'extra.ts': 'export const extra = 1;\n' } });

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
  { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts', 'extra.ts'] },
];
const verdicts = {
  item: { type: 'verdict' },
  hint: 'Shown to colleagues with the fix list.',
  actions: [
    { id: 'ready', label: 'Ready for colleagues' },
    { id: 'fixes', label: 'Needs fixes' },
  ],
};
const finishing = {
  item: { type: 'walkthrough' },
  hint: 'Gives you the fix list in the chat.',
  actions: [
    { id: 'hand', label: 'Send the fix list to the session' },
    { id: 'recheck', label: 'Ask the session to re-check' },
  ],
};

const record = (repo: Repo, input: unknown, command: string) => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  return recorded.stdout;
};
const send = (page: Page, url: string, route: string, body: unknown) =>
  page.request.post(new URL(`/${route}?token=${new URL(url).pathname.split('/')[2] ?? ''}`, url).href, { data: body });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps, 'steps');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('the Summary closes the queue: what is still open, the verdict, decisions by label, flags, your comments, drafts and the checklist', async ({
  page,
  repo,
  url,
}) => {
  const draft = /([0-9a-f]{8})/.exec(
    record(repo, [{ step: '3', file: 'cart.ts', lines: [1, 1], label: 'Draft', text: '[AI] Name the `cart`.' }], 'note'),
  )?.[1];
  const dropped = /([0-9a-f]{8})/.exec(record(repo, [{ step: '3', label: 'Draft', text: '[AI] Add a test.' }], 'note'))?.[1];
  const drafted = [
    { id: 'post', label: 'Post', edit: true },
    { id: 'drop', label: 'Drop' },
  ];
  record(
    repo,
    { title: 'Criteria', items: [{ status: 'met', mark: 'met', text: 'Logs in.' }, { status: 'not shown', mark: 'not-met', text: 'Has a cart.' }] },
    'checklist',
  );
  record(
    repo,
    [verdicts, finishing, { item: { type: 'note', id: draft }, actions: drafted }, { item: { type: 'note', id: dropped }, actions: drafted }],
    'actions',
  );
  for (const body of [
    { item: { type: 'step', id: '1' }, action: 'flag', note: 'Everyone gets in.' },
    { item: { type: 'step', id: '2' }, action: 'approve' },
    { item: { type: 'note', id: draft }, action: 'post', text: '[AI] Name the `items`.' },
    { item: { type: 'note', id: dropped }, action: 'drop' },
  ])
    expect((await send(page, url, 'decide', body)).status()).toBe(200);
  expect((await send(page, url, 'comment', { step: '1', file: 'login.ts', lines: [1, 1], text: 'Say who may log in.' })).status()).toBe(200);
  // Step 2 recorded again with another diff reopens it.
  record(repo, [steps[0], { ...steps[1], files: ['app.ts', 'extra.ts'] }, { ...steps[2], files: ['cart.ts'] }], 'steps');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^1 of 3 steps decided/);

  const header = page.getByRole('banner');
  await expect(header.getByText('No verdict yet')).toHaveCount(0);
  const finish = header.getByRole('link', { name: 'Finish review' });
  await expect(finish).toHaveAttribute('title', 'Finish review: go to the Summary (G S)');
  await finish.click();

  const summary = page.getByRole('region', { name: 'Summary' });
  await expect(page).toHaveURL(/#summary$/);
  await expect(page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Summary' })).toHaveAttribute('aria-current', 'page');
  await expect(summary.getByText('2 still open', { exact: true })).toBeVisible();
  await expect(summary.getByText('1 of 3 steps decided · 1 flagged · 1 of your comments · checklist 1 of 2 met', { exact: true })).toBeVisible();
  const section = (name: string) => summary.getByRole('region', { name });
  await expect(section('Still open').getByRole('listitem')).toHaveText([
    '2 App versionChanged since you chose Approve',
    '3 CartUndecided',
  ]);
  await expect(section('Decided').getByRole('row')).toHaveText(['Flag1 Login check1']);
  await expect(section('Flagged').getByRole('listitem')).toHaveText(['1 Login checkEveryone gets in.']);
  await expect(section('Your comments').getByRole('listitem')).toHaveText(['login.ts · 1Say who may log in.']);
  await expect(section('Checklist').getByRole('listitem')).toHaveText([/^Logs in\.\s*met$/, /^Has a cart\.\s*not shown$/]);
  const drafts = section('Comments the session drafted');
  await expect(drafts.getByRole('heading')).toHaveText('Comments the session drafted1 edited · 1 dropped');
  await expect(drafts.getByRole('listitem')).toHaveText(['cart.ts · 1Edited[AI] Name the items.', 'Step 3Dropped[AI] Add a test.']);
  await expect(drafts.locator('.dropped s')).toHaveText('[AI] Add a test.');

  const verdict = section('Verdict');
  await expect(verdict.getByText('No verdict yet. Check what is still open, then choose.')).toBeVisible();
  await expect(verdict.getByText('Shown to colleagues with the fix list.')).toBeVisible();
  const options = verdict.getByRole('radiogroup', { name: 'Verdict' }).getByRole('radio');
  await expect(options).toHaveText(['Ready for colleagues', 'Needs fixes']);
  await expect(options.nth(0)).toHaveAttribute('aria-checked', 'false');
  const hand = summary.getByRole('button', { name: 'Send the fix list to the session' });
  await expect(hand).toBeDisabled();
  await expect(hand).toHaveClass(/primary/);
  await expect(summary.getByRole('button', { name: 'Ask the session to re-check' })).toBeEnabled();
  await expect(summary.getByText('Gives you the fix list in the chat. Choose a verdict first.', { exact: true })).toBeVisible();
  // What the page sent before goes to a first listener, so the next one hears only the verdict.
  await repo.background('listen').ended;
  const listener = repo.background('listen');

  await verdict.getByRole('radio', { name: 'Needs fixes' }).click();

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'decision', item: { type: 'verdict' }, action: 'fixes' });
  await expect(verdict.getByText('Your verdict: Needs fixes')).toBeVisible();
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toHaveAttribute('aria-checked', 'true');
  const status = header.getByTitle('Your verdict');
  await expect(status).toHaveText('Needs fixes');
  await expect(status.getByRole('button')).toHaveCount(0);
  await expect(hand).toBeEnabled();
  await verdict.getByRole('button', { name: 'Change' }).click();
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(verdict.getByRole('radio', { name: 'Ready for colleagues' })).toBeFocused();
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toHaveAttribute('aria-checked', 'true');
  await hand.click();
  await expect(summary.getByText('Decided: Send the fix list to the session', { exact: true })).toBeVisible();
});

test('G then S goes to the Summary from any step, and the Summary is the last row of the queue', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('link').last()).toHaveText('Summary');

  await page.keyboard.press('g');
  await page.keyboard.press('s');

  await expect(page.getByRole('region', { name: 'Summary' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Verdict' }).getByText('No verdict yet.', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Verdict' }).getByRole('radio')).toHaveCount(0);
  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
  await page.keyboard.press('s');
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
});
