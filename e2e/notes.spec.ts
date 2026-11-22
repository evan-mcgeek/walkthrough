import type { Locator, Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const cart = ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;', 'const e = 5;', ''].join('\n');
test.use({ files: { 'cart.ts': cart } });

/** The diff row of `file` that shows line `line` of the head. */
const row = (page: Page, file: string, line: number) =>
  page
    .locator('.d2h-file-wrapper', { has: page.locator('.d2h-file-name', { hasText: file }) })
    .locator('tr', { has: page.locator('.line-num2', { hasText: new RegExp(`^${String(line)}$`) }) });
const rowAfter = (one: Locator) => one.locator('xpath=following-sibling::tr[1]');
const pin = (repo: Repo, notes: unknown[]) => {
  const noted = repo.record(notes, 'note');
  if (noted.status !== 0) throw new Error(noted.stderr);
};

// Asking for the url starts the walkthrough with the page open; the step comes after, as the skill records it.
test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record([{ title: 'Cart', explanation: 'Adds a cart.', files: ['login.ts', 'app.ts', 'cart.ts'] }]);
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
});

test('notes show at their step and beside their lines, low-priority ones behind a count', async ({ page, repo }) => {
  pin(repo, [
    { step: '1', label: 'Risk', text: 'Login lets **everyone** in.' },
    { step: '1', file: 'cart.ts', lines: [2, 3], label: 'Finding', text: 'These could be one.' },
    { step: '1', file: 'cart.ts', lines: [2, 3], label: 'Nit', text: 'Name them.', low: true },
    { step: '1', file: 'cart.ts', lines: [3, 3], label: 'Style', text: 'Spacing.', low: true },
  ]);

  const step = page.getByRole('region', { name: 'Cart' });
  const risk = step.getByRole('article', { name: 'Risk' });
  await expect(risk.locator('strong', { hasText: 'everyone' })).toBeVisible();
  const pinned = rowAfter(row(page, 'cart.ts', 3));
  await expect(pinned.getByRole('article', { name: 'Finding' })).toContainText('These could be one.');
  await expect(pinned.getByRole('article', { name: 'Finding' })).toContainText('Lines 2-3');
  await expect(pinned.getByRole('article', { name: 'Nit' })).toBeHidden();
  await expect(pinned.getByRole('article', { name: 'Style' })).toBeHidden();

  await pinned.getByText('2 more', { exact: true }).click();

  await expect(pinned.getByRole('article', { name: 'Nit' })).toContainText('Name them.');
  await expect(pinned.getByRole('article', { name: 'Style' })).toContainText('Line 3');
});

test('a reply to a note reaches the session and its answer shows in the thread', async ({ page, repo }) => {
  pin(repo, [{ step: '1', file: 'cart.ts', lines: [1, 1], label: 'Risk', text: 'A starts at one.' }]);
  const listener = repo.background('listen');
  const note = page.getByRole('article', { name: 'Risk' });

  await note.getByRole('textbox', { name: 'Reply' }).fill('On purpose.');
  await note.getByRole('button', { name: 'Reply' }).click();

  const replied = JSON.parse((await listener.ended).stdout) as { id: string; kind: string; text: string };
  expect(replied).toMatchObject({ kind: 'reply', text: 'On purpose.' });
  await expect(note.getByText('On purpose.')).toBeVisible();
  repo.run('say', '--answer', replied.id, 'Then it *stays*.');
  await expect(note.locator('em', { hasText: 'stays' })).toBeVisible();
  await expect(note.getByRole('textbox', { name: 'Reply' })).toHaveValue('');
});

test('asking about selected lines sends the range, and the answer lands on those lines', async ({ page, repo }) => {
  const listener = repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  await row(page, 'cart.ts', 2).locator('.line-num2').click();
  await row(page, 'cart.ts', 4).locator('.line-num2').click({ modifiers: ['Shift'] });

  await expect(row(page, 'cart.ts', 3)).toHaveClass(/selected/);
  await expect(row(page, 'cart.ts', 5)).not.toHaveClass(/selected/);
  const box = rowAfter(row(page, 'cart.ts', 4)).getByRole('textbox', { name: 'Ask about cart.ts lines 2-4' });
  await expect(box).toBeFocused();
  await box.fill('Why three constants?');
  await rowAfter(row(page, 'cart.ts', 4)).getByRole('button', { name: 'Ask' }).click();

  const asked = JSON.parse((await listener.ended).stdout) as { id: string };
  expect(asked).toMatchObject({ kind: 'ask', step: '1', file: 'cart.ts', lines: [2, 4], text: 'Why three constants?' });
  await expect(row(page, 'cart.ts', 3)).not.toHaveClass(/selected/);
  const pinned = rowAfter(row(page, 'cart.ts', 4));
  await expect(pinned.getByText('Why three constants?')).toBeVisible();
  await expect(pinned.getByText('Waiting for the session to answer.')).toBeVisible();

  repo.run('say', '--answer', asked.id, 'Each is used once.');

  await expect(pinned.getByText('Each is used once.')).toBeVisible();
  await expect(pinned.getByText('Waiting for the session to answer.')).toHaveCount(0);
});

test('session Markdown shows no raw HTML or images and keeps to the CSP', async ({ page, repo }) => {
  pin(repo, [
    {
      step: '1',
      label: 'Risk',
      text: [
        'Raw <b id="raw">bold</b> and <img src=x onerror="document.title=1">.',
        '',
        '| Left | Right |',
        '|:-----|------:|',
        '| a    | b     |',
        '',
        '[docs](https://example.com/docs)',
        '',
        '![Dot](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)',
      ].join('\n'),
    },
  ]);
  const note = page.getByRole('article', { name: 'Risk' });

  await expect(note).toContainText('Raw <b id="raw">bold</b> and <img src=x onerror="document.title=1">.');
  await expect(note.locator('#raw, img')).toHaveCount(0);
  await expect(note).toContainText('Dot');
  await expect(note.locator('td.align-right')).toHaveText('b');
  await expect(note.locator('[style]')).toHaveCount(0);
  await expect(note.getByRole('link', { name: 'docs' })).toHaveAttribute('target', '_blank');
  await expect(note.getByRole('link', { name: 'docs' })).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page).not.toHaveTitle('1');
});
