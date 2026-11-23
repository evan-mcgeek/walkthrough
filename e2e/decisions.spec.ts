import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const record = (repo: Repo, input: unknown, command: string) => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  return recorded.stdout;
};
const decisionOf = async (repo: Repo, listener: ReturnType<Repo['background']>) =>
  JSON.parse((await listener.ended).stdout) as Record<string, unknown>;

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps, 'steps');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('a step offers Approve, Flag and Ask; Flag takes a note before it reaches the session', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await expect(step.getByText('Undecided', { exact: true })).toBeVisible();
  await expect(step.getByRole('group', { name: 'Decide' }).getByRole('button')).toHaveText(['Approve', 'Flag']);
  await expect(step.getByRole('button', { name: 'Approve' })).toHaveClass(/primary/);
  await expect(step.getByRole('textbox', { name: 'Ask about this step' })).toBeVisible();
  const listener = repo.background('listen');

  await step.getByRole('button', { name: 'Flag' }).click();
  await expect(step.getByRole('textbox', { name: 'Note' })).toBeFocused();
  await step.getByRole('textbox', { name: 'Note' }).fill('Everyone gets in.');
  await step.getByRole('button', { name: 'Send' }).click();

  expect(await decisionOf(repo, listener)).toMatchObject({
    kind: 'decision',
    item: { type: 'step', id: '1' },
    action: 'flag',
    note: 'Everyone gets in.',
  });
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.getByRole('navigation', { name: "What's left" }).getByRole('button', { name: '1 decided' }).click();
  await page.getByRole('link', { name: 'Login check' }).click();
  await expect(step.getByText('Decided: Flag', { exact: true })).toBeVisible();
  await expect(step.getByText('Everyone gets in.', { exact: true })).toBeVisible();
  await expect(step.getByRole('button', { name: 'Flag' })).toHaveCount(0);
  await step.getByRole('button', { name: 'Change decision' }).click();
  await expect(step.getByRole('button', { name: 'Flag' })).toHaveAttribute('aria-pressed', 'true');
});

test('a decision answered after the person opened another step leaves them on that step', async ({ page }) => {
  let answer = () => {};
  const held = new Promise<void>(resolve => {
    answer = resolve;
  });
  await page.route('**/decide?*', async route => {
    await held;
    await route.continue();
  });

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('link', { name: 'App version' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  answer();

  const step = page.getByRole('region', { name: 'Login check' });
  await expect(step.getByText('Decided: Approve', { exact: true })).toBeVisible();
  // The page moves on in the same task that draws the decision, so the address is final once the tag shows.
  expect(new URL(page.url()).hash).toBe('#1');
  await expect(step).toBeVisible();
});

test('a decision on a step the session changed since the page drew it is refused, and the page shows the change', async ({ page, repo }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  await page.route('**/data/walkthrough.json', async route => {
    await held;
    await route.continue();
  });
  record(repo, [{ title: 'Everything', explanation: 'Login and the app.', files: ['login.ts', 'app.ts'] }], 'steps');

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('This changed since the page showed it; look at it again.')).toBeVisible();
  release();
  const step = page.getByRole('region', { name: 'Everything' });
  await expect(step.getByText('Undecided', { exact: true })).toBeVisible();
});

test('a press on an action survives the page redrawing before the release', async ({ page, repo }) => {
  const approve = page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' });
  await approve.hover();
  await page.mouse.down();
  repo.run('say', 'Reading along.');
  await page.waitForTimeout(2000);

  await page.mouse.up();

  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuenow', '1');
  await expect(page.getByRole('link', { name: /From the session/ })).toBeVisible();
});

test('a decision can be changed,and the latest one shows with the session answer to it', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('navigation', { name: "What's left" }).getByRole('button', { name: '1 decided' }).click();
  await page.getByRole('link', { name: 'Login check' }).click();
  await expect(step.getByText('Decided: Approve', { exact: true })).toBeVisible();
  await repo.background('listen').ended;
  const listener = repo.background('listen');

  await step.getByRole('button', { name: 'Change decision' }).click();
  await step.getByRole('button', { name: 'Flag' }).click();
  await step.getByRole('textbox', { name: 'Note' }).fill('Not yet.');
  await step.getByRole('button', { name: 'Send' }).click();

  const flagged = await decisionOf(repo, listener);
  await page.getByRole('link', { name: 'Login check' }).click();
  await expect(step.getByText('Decided: Flag', { exact: true })).toBeVisible();
  await step.getByRole('button', { name: 'Change decision' }).click();
  await expect(step.getByRole('button', { name: 'Approve' })).toHaveAttribute('aria-pressed', 'false');
  repo.run('say', '--answer', String(flagged['id']), 'Added to the fix list.');
  await expect(step.getByText('Added to the fix list.')).toBeVisible();
});

test('the session actions show on notes, checklist items and the whole walkthrough, editing text first where allowed', async ({
  page,
  repo,
}) => {
  const noteId = /([0-9a-f]{8})/.exec(
    record(repo, [{ step: '1', label: 'Draft', text: 'Please **rename** this.' }], 'note'),
  )?.[1];
  record(repo, { title: 'Criteria', items: [{ status: 'met', text: 'A person can log in.' }] }, 'checklist');
  record(
    repo,
    [
      {
        item: { type: 'note', id: noteId },
        actions: [
          { id: 'post', label: 'Post' },
          { id: 'edit', label: 'Edit first', edit: true },
        ],
      },
      { item: { type: 'checklist', id: '1' }, actions: [{ id: 'check', label: 'Checked', note: true }] },
      { item: { type: 'walkthrough' }, actions: [{ id: 'submit', label: 'Post my comments' }] },
      { item: { type: 'step', id: '1' }, actions: [{ id: 'ship', label: 'Ship it' }] },
    ],
    'actions',
  );
  const step = page.getByRole('region', { name: 'Login check' });
  await expect(step.getByRole('group', { name: 'Decide' }).last().getByRole('button')).toHaveText(['Ship it']);
  await expect(step.getByRole('button', { name: 'Ship it' })).toHaveClass(/offer/);
  const note = step.getByRole('article', { name: 'Draft' });
  const listener = repo.background('listen');

  await note.getByRole('button', { name: 'Note actions' }).click();
  await note.getByRole('menuitem', { name: 'Edit first' }).click();
  const text = note.getByRole('textbox', { name: 'Text' });
  await expect(text).toHaveValue('Please **rename** this.');
  // The box holds the text being edited, so the note shows it once and offers no Reply meanwhile.
  await expect(note.getByText('Please rename this.', { exact: true })).toHaveCount(0);
  await expect(note.getByRole('button', { name: 'Reply' })).toHaveCount(0);
  await text.fill('Please rename this to cart.');
  await note.getByRole('button', { name: 'Send' }).click();

  expect(await decisionOf(repo, listener)).toMatchObject({
    item: { type: 'note', id: noteId },
    action: 'edit',
    text: 'Please rename this to cart.',
  });
  await expect(note.getByText('Decided: Edit first', { exact: true })).toBeVisible();
  await expect(note.getByText('Please rename this to cart.', { exact: true })).toBeVisible();

  const rail = page.getByRole('navigation', { name: "What's left" });
  await rail.getByRole('link', { name: 'A person can log in.' }).click();
  const item = page.getByRole('region', { name: 'Criteria' }).getByRole('listitem');
  await expect(item.getByRole('button', { name: 'Checked' })).toBeVisible();
  await expect(item.getByText('Undecided', { exact: true })).toHaveCount(0);
  await item.getByRole('button', { name: 'Checked' }).click();
  await item.getByRole('textbox', { name: 'Note' }).fill('Tried it.');
  await item.getByRole('button', { name: 'Send' }).click();
  await expect(item.getByText('Decided: Checked', { exact: true })).toBeVisible();
  await expect(rail.getByRole('link', { name: 'A person can log in.' })).toHaveCount(0);

  await rail.getByRole('link', { name: 'App version' }).click();
  await page.keyboard.press('j');
  const whole = page.getByRole('region', { name: 'Whole walkthrough' });
  await expect(whole.getByText('Undecided', { exact: true })).toHaveCount(0);
  await whole.getByRole('button', { name: 'Post my comments' }).click();
  await expect(whole.getByText('Decided: Post my comments', { exact: true })).toBeVisible();
});

test('a checklist item the session records again after a decision shows reopened, keeping the note and the answer', async ({
  page,
  repo,
}) => {
  const disagree = [{ item: { type: 'checklist', id: '1' }, actions: [{ id: 'no', label: 'Disagree', note: true }] }];
  record(repo, { title: 'Criteria', items: [{ status: 'met', text: 'A person can log in.' }] }, 'checklist');
  record(repo, disagree, 'actions');
  await page.getByRole('navigation', { name: "What's left" }).getByRole('link', { name: 'A person can log in.' }).click();
  const item = page.getByRole('region', { name: 'Criteria' }).getByRole('listitem');
  const listener = repo.background('listen');
  await item.getByRole('button', { name: 'Disagree' }).click();
  await item.getByRole('textbox', { name: 'Note' }).fill('Only staff can.');
  await item.getByRole('button', { name: 'Send' }).click();
  const decided = await decisionOf(repo, listener);

  record(repo, { title: 'Criteria', items: [{ id: '1', status: 'not met', text: 'Only staff can log in.' }] }, 'checklist');
  repo.run('say', '--answer', String(decided['id']), 'Marked it not met.');

  await expect(item.getByText('Reopened: changed since you chose Disagree', { exact: true })).toBeVisible();
  await expect(item.getByText('Only staff can.', { exact: true })).toBeVisible();
  await expect(item.getByText('Marked it not met.', { exact: true })).toBeVisible();
  await expect(item.getByRole('button', { name: 'Disagree' })).toHaveAttribute('aria-pressed', 'false');
});

test('steps shown are read apart from decided, and decided steps fold into a count at the foot of the rail', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', '0 of 2 steps decided, 2 left, 1 read');
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveAttribute('data-state', 'read');
  await expect(rail.getByRole('link', { name: 'App version' })).toHaveAttribute('data-state', 'unread');

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', '1 of 2 steps decided, 1 left, 2 read');
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveCount(0);
  await expect(rail.getByRole('link', { name: 'App version' })).toBeVisible();
  const decided = rail.getByRole('button', { name: '1 decided' });
  await expect(decided).toHaveAttribute('aria-expanded', 'false');
  await decided.click();
  await expect(decided).toHaveAttribute('aria-expanded', 'true');
  await expect(rail.getByRole('link', { name: 'Login check' })).toHaveAttribute('data-state', 'decided');

  await page.reload();
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', '1 of 2 steps decided, 1 left, 2 read');
});

test('an empty Ask or Flag note is not sent, and the box says it needs words', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') sent.push(new URL(request.url()).pathname);
  });
  const step = page.getByRole('region', { name: 'Login check' });
  const ask = step.getByRole('textbox', { name: 'Ask about this step' });

  await ask.fill('   ');
  await ask.press('Enter');
  await expect(ask).toHaveValue('');
  expect(await ask.evaluate((box: HTMLInputElement) => box.validity.valueMissing)).toBe(true);
  await step.getByRole('button', { name: 'Flag' }).click();
  await step.getByRole('button', { name: 'Send' }).click();

  const note = step.getByRole('textbox', { name: 'Note' });
  await expect(note).toBeFocused();
  expect(await note.evaluate((box: HTMLTextAreaElement) => box.validity.valueMissing)).toBe(true);
  await expect(page.getByRole('alert')).toBeHidden();
  expect(sent.filter(route => route !== '/read')).toEqual([]);
});
