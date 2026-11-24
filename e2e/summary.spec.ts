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

test('the Summary closes the queue: a ledger of every step, still open first, with flags and your comments, the drafts, and a rail with the verdict, finishing actions and checklist', async ({
  page,
  repo,
  url,
}) => {
  const draft = /([0-9a-f]{8})/.exec(
    record(repo, [{ step: '3', file: 'cart.ts', lines: [1, 1], label: 'Draft', text: '[AI] Name the `cart`.' }], 'note'),
  )?.[1];
  const dropped = /([0-9a-f]{8})/.exec(record(repo, [{ step: '3', label: 'Draft', text: '[AI] Add a test.' }], 'note'))?.[1];
  const kept = /([0-9a-f]{8})/.exec(record(repo, [{ step: '3', label: 'Draft', text: '[AI] Check the total.' }], 'note'))?.[1];
  const drafted = [
    { id: 'edit', label: 'Edit', edit: true },
    { id: 'drop', label: 'Drop' },
  ];
  record(
    repo,
    { title: 'Criteria', items: [{ status: 'met', mark: 'met', text: 'Logs in.' }, { status: 'not shown', mark: 'not-met', text: 'Has a cart.' }] },
    'checklist',
  );
  record(
    repo,
    [verdicts, finishing, { item: { type: 'note', id: draft }, actions: drafted }, { item: { type: 'note', id: dropped }, actions: drafted }, { item: { type: 'note', id: kept }, actions: drafted }],
    'actions',
  );
  for (const body of [
    { item: { type: 'step', id: '1' }, action: 'flag', note: 'Everyone gets in.' },
    { item: { type: 'step', id: '2' }, action: 'approve' },
    { item: { type: 'note', id: draft }, action: 'edit', text: '[AI] Name the `items`.' },
    { item: { type: 'note', id: dropped }, action: 'drop' },
  ])
    expect((await send(page, url, 'decide', body)).status()).toBe(200);
  expect((await send(page, url, 'comment', { step: '1', file: 'login.ts', lines: [1, 1], text: 'Say who may log in.' })).status()).toBe(200);
  // Step 2 recorded again with another diff reopens it.
  record(repo, [steps[0], { ...steps[1], files: ['app.ts', 'extra.ts'] }, { ...steps[2], files: ['cart.ts'] }], 'steps');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^1 of 3 steps decided/);

  const header = page.getByRole('banner');
  await expect(header.getByText('No verdict yet')).toHaveCount(0);
  const finish = header.getByRole('link', { name: 'Finish', exact: true });
  await expect(finish).toHaveAttribute('title', 'Go to the Summary to send (G S)');
  await finish.click();

  const summary = page.getByRole('region', { name: 'Summary' });
  await expect(page).toHaveURL(/#summary$/);
  await expect(page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Summary' })).toHaveAttribute('aria-current', 'page');
  await expect(summary.getByText('2 still open', { exact: true })).toBeVisible();
  await expect(summary.getByText('1 of 3 steps decided · 1 flagged · 1 of your comments · checklist 1 of 2 met', { exact: true })).toBeVisible();
  const section = (name: string) => summary.getByRole('region', { name });
  const ledger = summary.locator('table.ledger');
  await expect(ledger.getByRole('row')).toHaveText([
    'Still open2',
    '2App versionChanged since you approved.ApproveFlagChanged',
    '3CartApproveFlag',
    'Decided1',
    '1Login check“Everyone gets in.”login.ts:1 Say who may log in.Flagged',
  ]);
  await expect(ledger.locator('.ledger-decision.changed')).toHaveText('Changed');
  await expect(ledger.locator('.ledger-decision.muted')).toHaveText('');
  await expect(ledger.getByRole('row').last().getByRole('img', { name: 'Your comment' })).toBeVisible();
  await ledger.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
  await page.goBack();
  await expect(summary).toBeVisible();
  const rail = summary.getByRole('complementary', { name: 'Finish' });
  // The criteria sit under the ledger, prefilled with the session's marks, never in the rail.
  await expect(summary.getByRole('region', { name: 'Criteria' }).getByRole('listitem')).toHaveText(['Logs in.', 'Has a cart.']);
  await expect(summary.getByRole('region', { name: 'Criteria' }).getByRole('listitem').last()).toHaveAttribute('title', 'not shown');
  await expect(rail.getByRole('region', { name: 'Criteria' })).toHaveCount(0);
  const drafts = section('Goes out');
  // A draft left alone goes out as drafted, all of them together, and none waits in Still open.
  await expect(drafts.getByRole('heading')).toHaveText('Goes out1 goes out · 1 edited · 1 dropped');
  await expect(drafts.getByRole('listitem')).toHaveText([
    'cart.ts · 1Edited[AI] Name the items.Change',
    'Step 3Dropped[AI] Add a test.Change',
    'Step 3[AI] Check the total.EditDrop',
  ]);
  await expect(drafts.locator('.dropped s')).toHaveText('[AI] Add a test.');

  const verdict = rail.getByRole('region', { name: 'Verdict' });
  await expect(verdict.locator('.verdict-now')).toHaveCount(0);
  const options = verdict.getByRole('radiogroup', { name: 'Verdict' }).getByRole('radio');
  await expect(options).toHaveText(['Ready for colleagues', 'Needs fixes']);
  await expect(options.nth(0)).toHaveAttribute('aria-checked', 'false');
  const hand = summary.getByRole('button', { name: 'Send the fix list to the session' });
  await expect(hand).toBeDisabled();
  await expect(hand).toHaveClass(/primary/);
  await expect(summary.getByRole('button', { name: 'Ask the session to re-check' })).toBeEnabled();
  await expect(
    rail.getByText('Shown to colleagues with the fix list. Gives you the fix list in the chat.', { exact: true }),
  ).toBeVisible();
  // What the page sent before goes to a first listener, so the next one hears only the verdict.
  await repo.background('listen').ended;
  const listener = repo.background('listen');

  await verdict.getByRole('radio', { name: 'Needs fixes' }).click();

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'decision', item: { type: 'verdict' }, action: 'fixes' });
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toHaveAttribute('aria-checked', 'true');
  const status = header.getByTitle('Your verdict');
  await expect(status).toHaveText('Needs fixes');
  await expect(status.getByRole('button')).toHaveCount(0);
  await expect(hand).toBeEnabled();
  await expect(rail.getByText('Shown to colleagues with the fix list. Gives you the fix list in the chat.', { exact: true })).toBeVisible();
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(verdict.getByRole('radio', { name: 'Ready for colleagues' })).toBeFocused();
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' })).toHaveAttribute('aria-checked', 'true');
  await hand.click();
  await expect(summary.getByText('Decided: Send the fix list to the session', { exact: true })).toBeVisible();
});

const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

test('the ledger and the verdict take their action\'s tone: Approve green, Flag amber, an action with no tone grey, and the verdict in the rail and the header', async ({
  page,
  repo,
  url,
}) => {
  const toned = {
    ...verdicts,
    actions: [
      { id: 'ready', label: 'Ready for colleagues', tone: 'positive' },
      { id: 'fixes', label: 'Needs fixes', tone: 'attention' },
    ],
  };
  record(repo, [toned, finishing, { item: { type: 'step', id: '3' }, actions: [{ id: 'noted', label: 'Noted' }] }], 'actions');
  for (const body of [
    { item: { type: 'step', id: '1' }, action: 'flag', note: 'Everyone gets in.' },
    { item: { type: 'step', id: '2' }, action: 'approve' },
    { item: { type: 'step', id: '3' }, action: 'noted' },
    { item: { type: 'verdict' }, action: 'fixes' },
  ])
    expect((await send(page, url, 'decide', body)).status()).toBe(200);
  await page.goto(`${url}#summary`);

  const ledger = page.locator('table.ledger');
  const row = (title: string) => ledger.getByRole('row').filter({ hasText: title });
  for (const [title, token, words] of [
    ['Login check', '--amber', '--amber'],
    ['App version', '--ok', '--ok'],
    ['Cart', '--neu', '--ink-secondary'],
  ] as const) {
    await expect(row(title).locator('.ledger-mark svg')).toHaveCSS('color', await tokenColor(page, token));
    await expect(row(title).locator('.ledger-decision')).toHaveCSS('color', await tokenColor(page, words));
  }
  const verdict = page.getByRole('region', { name: 'Verdict' });
  await expect(verdict.getByText('Needs fixes', { exact: true }).first()).toHaveCSS('color', await tokenColor(page, '--amber'));
  await expect(verdict.getByRole('radio', { name: 'Needs fixes' }).locator('svg')).toHaveCSS('color', await tokenColor(page, '--amber'));
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveCSS('color', await tokenColor(page, '--amber'));
  await expect(page.getByRole('banner').getByTitle('Your verdict').locator('svg')).toHaveCSS('color', await tokenColor(page, '--amber'));
});

test('G then S goes to the Summary from any step, and the Summary is the last row of the queue', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('link').last()).toHaveText('Summary');

  await page.keyboard.press('g');
  await page.keyboard.press('s');

  await expect(page.getByRole('region', { name: 'Summary' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Verdict' }).locator('.verdict-now')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Verdict' }).getByRole('radio')).toHaveCount(0);
  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
  await page.keyboard.press('s');
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
});

test('a Still open row offers its own actions, and its title goes to the exact place with its file open', async ({ page, repo, url }) => {
  const noteId = /([0-9a-f]{8})/.exec(
    record(repo, [{ step: '3', file: 'cart.ts', lines: [1, 1], label: 'Finding', text: 'The cart is never emptied.', finding: true }], 'note'),
  )?.[1];
  record(
    repo,
    [{ item: { type: 'note', id: noteId }, actions: [{ id: 'accept', label: 'Accept' }, { id: 'reject', label: 'Reject', note: true }] }],
    'actions',
  );
  await page.goto(`${url}#3`);
  await page.getByRole('button', { name: 'Viewed cart.ts' }).click();
  const note = page.locator(`#note-${noteId ?? ''}`);
  await expect(note).toBeHidden();

  await page.goto(`${url}#summary`);
  const ledger = page.locator('table.ledger');
  const row = (title: string) => ledger.getByRole('row').filter({ has: page.getByRole('link', { name: title, exact: true }) });
  // The finding has a row of its own, so its step only counts it.
  await expect(row('Cart').locator('.ledger-sub')).toHaveText('1 open finding');
  await row('Finding: The cart is never emptied.').getByRole('link').click();
  await expect(page).toHaveURL(`${url}#3`);
  await expect(note).toBeInViewport();
  await expect(note).toBeFocused();

  await page.goto(`${url}#summary`);
  await row('Login check').getByRole('button', { name: 'Approve' }).click();
  await expect(row('Login check').locator('.ledger-decision')).toHaveText('Approve');
  await expect(page).toHaveURL(`${url}#summary`);

  await row('Finding: The cart is never emptied.').getByRole('button', { name: 'Reject' }).click();
  await ledger.getByRole('textbox', { name: 'Note' }).fill('Emptied on checkout.');
  await ledger.getByRole('button', { name: 'Send' }).click();
  await expect(row('Finding: The cart is never emptied.')).toHaveCount(0);
  await expect.poll(() => repo.run('decisions').stdout).toContain('Emptied on checkout.');
});
