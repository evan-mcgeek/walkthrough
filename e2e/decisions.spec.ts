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
  await expect(step.getByRole('textbox', { name: 'Ask about this step' })).toBeVisible();
  const listener = repo.background('listen');

  await step.getByRole('button', { name: 'Flag' }).click();
  await step.getByRole('textbox', { name: 'Note' }).fill('Everyone gets in.');
  await step.getByRole('button', { name: 'Send' }).click();

  expect(await decisionOf(repo, listener)).toMatchObject({
    kind: 'decision',
    item: { type: 'step', id: '1' },
    action: 'flag',
    note: 'Everyone gets in.',
  });
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Steps' }).getByText('1 decided').click();
  await page.getByRole('link', { name: '1. Login check' }).click();
  await expect(step.getByText('Decided: Flag', { exact: true })).toBeVisible();
  await expect(step.getByText('Everyone gets in.', { exact: true })).toBeVisible();
  await expect(step.getByRole('button', { name: 'Flag' })).toHaveAttribute('aria-pressed', 'true');
});

test('a decision can be changed, and the latest one shows with the session answer to it', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Approve' }).click();
  await page.getByRole('navigation', { name: 'Steps' }).getByText('1 decided').click();
  await page.getByRole('link', { name: '1. Login check' }).click();
  await expect(step.getByText('Decided: Approve', { exact: true })).toBeVisible();
  await repo.background('listen').ended;
  const listener = repo.background('listen');

  await step.getByRole('button', { name: 'Flag' }).click();
  await step.getByRole('textbox', { name: 'Note' }).fill('Not yet.');
  await step.getByRole('button', { name: 'Send' }).click();

  const flagged = await decisionOf(repo, listener);
  await page.getByRole('link', { name: '1. Login check' }).click();
  await expect(step.getByText('Decided: Flag', { exact: true })).toBeVisible();
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
  await expect(step.getByRole('group', { name: 'Decide' }).first().getByRole('button')).toHaveText(['Ship it']);
  const note = step.getByRole('article', { name: 'Draft' });
  const listener = repo.background('listen');

  await note.getByRole('button', { name: 'Edit first' }).click();
  const text = note.getByRole('textbox', { name: 'Text' });
  await expect(text).toHaveValue('Please **rename** this.');
  await text.fill('Please rename this to cart.');
  await note.getByRole('button', { name: 'Send' }).click();

  expect(await decisionOf(repo, listener)).toMatchObject({
    item: { type: 'note', id: noteId },
    action: 'edit',
    text: 'Please rename this to cart.',
  });
  await expect(note.getByText('Decided: Edit first', { exact: true })).toBeVisible();
  await expect(note.getByText('Please rename this to cart.', { exact: true })).toBeVisible();

  const item = page.getByRole('region', { name: 'Criteria' }).getByRole('listitem');
  await item.getByRole('button', { name: 'Checked' }).click();
  await item.getByRole('textbox', { name: 'Note' }).fill('Tried it.');
  await item.getByRole('button', { name: 'Send' }).click();
  await expect(item.getByText('Decided: Checked', { exact: true })).toBeVisible();

  const whole = page.getByRole('region', { name: 'Whole walkthrough' });
  await whole.getByRole('button', { name: 'Post my comments' }).click();
  await expect(whole.getByText('Decided: Post my comments', { exact: true })).toBeVisible();
});

test('steps shown are read apart from decided, and decided steps collapse in the step list', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Steps' });
  await expect(page.getByText('0 of 2 steps decided, 2 left, 1 read')).toBeVisible();
  await expect(nav.getByRole('listitem').filter({ hasText: 'Login check' })).toContainText('Read');
  await expect(nav.getByRole('listitem').filter({ hasText: 'App version' })).not.toContainText('Read');

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByText('1 of 2 steps decided, 1 left, 2 read')).toBeVisible();
  await expect(nav.getByRole('link', { name: '1. Login check' })).toBeHidden();
  await expect(nav.getByRole('link', { name: '2. App version' })).toBeVisible();
  await nav.getByText('1 decided').click();
  await expect(nav.getByRole('link', { name: '1. Login check' })).toBeVisible();

  await page.reload();
  await expect(page.getByText('1 of 2 steps decided, 1 left, 2 read')).toBeVisible();
});
