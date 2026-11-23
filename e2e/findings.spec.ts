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
  await page.getByRole('article', { name: 'Bug' }).first().getByRole('button', { name: 'Note actions' }).click();
  await page.getByRole('menuitem', { name: 'Accept' }).click();

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
