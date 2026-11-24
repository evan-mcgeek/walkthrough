import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const long = Array.from({ length: 120 }, (_, at) => `const v${String(at + 1)} = ${String(at + 1)};`).join('\n');
test.use({ files: { 'cart.ts': `${long}\n` } });

const row = (page: Page, line: number) => page.locator('.d2h-file-wrapper[data-file="cart.ts"] tr', { has: page.locator('.line-num2', { hasText: new RegExp(`^${String(line)}$`) }) });
const pin = (repo: Repo, notes: unknown[]) => {
  const noted = repo.record(notes, 'note');
  if (noted.status !== 0) throw new Error(noted.stderr);
  return [...noted.stdout.matchAll(/([0-9a-f]{8})/g)].map(match => match[1] ?? '');
};

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record([{ title: 'Cart', explanation: 'Adds a cart.', files: ['login.ts', 'app.ts', 'cart.ts'] }]);
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
});

test('findings the session flags are marked in the gutter and on the overview stripe, apart from other notes', async ({ page, repo }) => {
  pin(repo, [
    { step: '1', file: 'cart.ts', lines: [2, 3], label: 'Bug', text: 'Off by one.', finding: true },
    { step: '1', file: 'cart.ts', lines: [5, 5], label: 'Finding', text: 'Only the word.' },
  ]);

  await expect(row(page, 3).locator('.gutter-mark.finding')).toHaveCount(1);
  await expect(row(page, 5).locator('.gutter-mark.note')).toHaveCount(1);
  await expect(row(page, 2).locator('.gutter-mark')).toHaveCount(0);
  const stripe = page.locator('.d2h-file-wrapper[data-file="cart.ts"] .overview-stripe');
  await expect(stripe.locator('.tick-finding')).toHaveCount(1);
  await expect(stripe.locator('.tick-note')).toHaveCount(1);
  await expect(stripe.locator('.run-add')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Bug' }).locator('.label.finding .icon-warn')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Finding' }).locator('.label.finding')).toHaveCount(0);
});

test('while a step has open findings Approve steps down and the action bar counts them', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Cart' });
  const [first = ''] = pin(repo, [
    { step: '1', file: 'cart.ts', lines: [2, 2], label: 'Bug', text: 'One.', finding: true },
    { step: '1', file: 'cart.ts', lines: [4, 4], label: 'Bug', text: 'Two.', finding: true },
  ]);
  repo.record([{ item: { type: 'note', id: first }, actions: [{ id: 'accept', label: 'Accept' }] }], 'actions');

  await expect(step.locator('.action-bar').getByText('2 open findings')).toBeVisible();
  await expect(step.getByRole('button', { name: 'Approve' })).not.toHaveClass(/primary/);
  await page.getByRole('article', { name: 'Bug' }).first().getByRole('button', { name: 'Accept' }).click();

  await expect(step.locator('.action-bar').getByText('1 open finding', { exact: true })).toBeVisible();
});

test('a step with no open finding keeps Approve primary and says nothing', async ({ page }) => {
  const step = page.getByRole('region', { name: 'Cart' });
  await expect(step.getByRole('button', { name: 'Approve' })).toHaveClass(/primary/);
  await expect(step.locator('.open-findings')).toHaveCount(0);
});

test('a tick on the overview stripe jumps to its note', async ({ page, repo }) => {
  pin(repo, [{ step: '1', file: 'cart.ts', lines: [115, 115], label: 'Bug', text: 'Far down.', finding: true }]);
  const note = page.getByRole('article', { name: 'Bug' });
  await expect(note).toBeAttached();
  await expect(note).not.toBeInViewport();

  await page.locator('.d2h-file-wrapper[data-file="cart.ts"] .overview-stripe .tick-finding').click();

  await expect(note).toBeInViewport();
});

test('beside the step head, In this step names its files, counts its notes and lists the criteria linked to it', async ({ page, repo }) => {
  pin(repo, [
    { step: '1', file: 'cart.ts', lines: [2, 2], label: 'Bug', text: 'Off by one.', finding: true },
    { step: '1', file: 'cart.ts', lines: [5, 5], label: 'Nit', text: 'A name.' },
  ]);
  const items = [
    { status: 'no', mark: 'not-met', text: 'Has a cart', steps: ['1'] },
    { status: 'yes', mark: 'met', text: 'Logs in', steps: ['1'] },
    { status: '?', text: 'Elsewhere' },
  ];
  repo.record({ title: 'Criteria', items }, 'checklist');
  const facts = page.getByRole('complementary', { name: 'In this step' });

  await expect(facts.getByRole('link')).toHaveText(['login.ts', 'app.ts', 'cart.ts']);
  await expect(facts.getByRole('listitem')).toHaveText(['login.ts+1 −0', 'app.ts+1 −1', 'cart.ts+120 −0', '1 finding', '1 note', 'Has a cart', 'Logs in']);

  const login = page.locator('.d2h-file-wrapper[data-file="login.ts"]');
  await login.getByRole('button', { name: 'Collapse login.ts' }).click();
  await facts.getByRole('link', { name: 'login.ts' }).click();

  await expect(login.getByRole('button', { name: 'Collapse login.ts' })).toBeInViewport();
});

const noteSaying = (page: Page, text: string) => page.getByRole('article').filter({ hasText: text });
const sendComment = (page: Page, url: string, body: unknown) =>
  page.request.post(new URL(`/comment?token=${new URL(url).pathname.split('/')[2] ?? ''}`, url).href, { data: body });

test('a step with open findings says how many in To review beside one triangle, and choosing it opens the step at the first', async ({ page, repo }) => {
  pin(repo, [
    { step: '1', file: 'cart.ts', lines: [90, 90], label: 'Bug', text: 'Overdue todos sort last.', finding: true },
    { step: '1', file: 'cart.ts', lines: [60, 60], label: 'Bug', text: 'A due date of today reads as overdue.', finding: true },
  ]);
  await page.getByRole('button', { name: 'Mark cart.ts as viewed' }).click();
  const row = page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: /Cart/ });
  const sub = row.locator('.queue-sub');
  await expect(sub).toHaveText('2 open findings');
  await expect(sub).toHaveClass(/attention/);
  // The row's own state icon is the triangle away from the step, so the count carries none of its own.
  await expect(sub.locator('.icon')).toHaveCount(0);
  await page.keyboard.press('g');
  await page.keyboard.press('s');
  await expect(row.locator('.icon-warn')).toHaveCount(1);
  await page.goBack();
  const first = noteSaying(page, 'A due date of today reads as overdue.');
  await expect(first).toBeHidden();

  await row.click();

  await expect(first).toBeInViewport();
  await expect(first).toBeFocused();

  repo.run('checking', '1');
  await expect(sub).toHaveText('Being checked');
});

test('a file header counts its findings, notes and your comments, and each count goes to the first of its kind, opening the file', async ({ page, repo, url }) => {
  pin(repo, [
    { step: '1', file: 'cart.ts', lines: [100, 100], label: 'Bug', text: 'A todo due today reads as overdue.', finding: true },
    { step: '1', file: 'cart.ts', lines: [80, 80], label: 'Nit', text: 'Name the due date.' },
    { step: '1', file: 'cart.ts', lines: [30, 30], label: 'Nit', text: 'Sort by due date.' },
  ]);
  expect((await sendComment(page, url, { step: '1', file: 'cart.ts', lines: [50, 50], text: 'Show the due date in the list.' })).status()).toBe(200);
  const cart = page.locator('.d2h-file-wrapper[data-file="cart.ts"]');
  const marks = cart.locator('.d2h-file-header .file-stats + .file-marks').getByRole('button');
  await expect(marks).toHaveText(['1 finding', '2 notes', '1 yours']);
  await expect(marks.first()).toHaveAttribute('title', 'Go to the first finding in this file');
  await expect(page.locator('.d2h-file-wrapper[data-file="login.ts"] .file-marks')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mark cart.ts as viewed' }).click();
  await expect(cart.locator('.d2h-file-diff')).toBeHidden();

  await marks.filter({ hasText: '1 finding' }).click();

  await expect(cart.locator('.d2h-file-diff')).toBeVisible();
  await expect(noteSaying(page, 'A todo due today reads as overdue.')).toBeFocused();
  await expect(noteSaying(page, 'A todo due today reads as overdue.')).toBeInViewport();
  await marks.filter({ hasText: '2 notes' }).click();
  await expect(noteSaying(page, 'Sort by due date.')).toBeFocused();
  await expect(noteSaying(page, 'Sort by due date.')).toBeInViewport();
  await marks.filter({ hasText: '1 yours' }).click();
  await expect(page.getByRole('article', { name: 'Your comment' })).toBeFocused();
  await expect(page.getByRole('article', { name: 'Your comment' })).toBeInViewport();

  await page.keyboard.press('?');
  const help = page.getByRole('dialog', { name: 'Help: what things mean' });
  for (const words of ['1 findingOn a file: go to its first finding', '2 notesOn a file: go to its first note', '1 yoursOn a file: go to your first comment on it', '2 open findingsUnder a step: go to the next open finding', 'Open findings, as "2 open findings": opens the step at the first'])
    await expect(help.getByRole('row').filter({ hasText: words })).toHaveCount(1);
});

test('the action bar’s open findings go to the next one at each press, wrapping to the first', async ({ page, repo }) => {
  pin(repo, [
    { step: '1', file: 'cart.ts', lines: [90, 90], label: 'Bug', text: 'Overdue todos sort last.', finding: true },
    { step: '1', file: 'cart.ts', lines: [20, 20], label: 'Bug', text: 'A due date of today reads as overdue.', finding: true },
    { step: '1', file: 'cart.ts', lines: [50, 50], label: 'Nit', text: 'Name the due date.' },
  ]);
  const count = page.getByRole('region', { name: 'Cart' }).locator('.action-bar').getByRole('button', { name: '2 open findings' });
  await expect(count).toHaveAttribute('title', 'Go to the next open finding');

  for (const text of ['A due date of today reads as overdue.', 'Overdue todos sort last.', 'A due date of today reads as overdue.']) {
    await count.click();
    await expect(noteSaying(page, text)).toBeFocused();
    await expect(noteSaying(page, text)).toBeInViewport();
  }
});
