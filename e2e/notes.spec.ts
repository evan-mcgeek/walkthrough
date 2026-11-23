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
  await expect(pinned.getByRole('article', { name: 'Finding' })).toContainText('lines 2–3');
  await expect(pinned.getByRole('article', { name: 'Nit' })).toBeHidden();
  await expect(pinned.getByRole('article', { name: 'Style' })).toBeHidden();

  await pinned.getByText('2 more notes', { exact: true }).click();

  await expect(pinned.getByRole('article', { name: 'Nit' })).toContainText('Name them.');
  await expect(pinned.getByRole('article', { name: 'Style' })).toContainText('line 3');
});

test('a reply to a note reaches the session and its answer shows in the thread', async ({ page, repo }) => {
  pin(repo, [{ step: '1', file: 'cart.ts', lines: [1, 1], label: 'Risk', text: 'A starts at one.' }]);
  const listener = repo.background('listen');
  const note = page.getByRole('article', { name: 'Risk' });

  await note.getByRole('button', { name: 'Reply' }).click();
  await expect(note.getByRole('textbox', { name: 'Reply' })).toBeFocused();
  await note.getByRole('textbox', { name: 'Reply' }).fill('On purpose.');
  await note.getByRole('button', { name: 'Send' }).click();

  const replied = JSON.parse((await listener.ended).stdout) as { id: string; kind: string; text: string };
  expect(replied).toMatchObject({ kind: 'reply', text: 'On purpose.' });
  await expect(note.getByText('On purpose.')).toBeVisible();
  repo.run('say', '--answer', replied.id, 'Then it *stays*.');
  await expect(note.locator('em', { hasText: 'stays' })).toBeVisible();
  await expect(note.getByRole('textbox', { name: 'Reply' })).toHaveCount(0);
  await expect(note.locator('.who')).toHaveText(['You', 'Session']);
});

test('asking about selected lines sends the range, and the answer lands on those lines', async ({ page, repo }) => {
  const listener = repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');

  await row(page, 'cart.ts', 2).locator('.line-num2').click();
  await row(page, 'cart.ts', 4).locator('.line-num2').click({ modifiers: ['Shift'] });

  await expect(row(page, 'cart.ts', 3)).toHaveClass(/selected/);
  await expect(row(page, 'cart.ts', 5)).not.toHaveClass(/selected/);
  const box = rowAfter(row(page, 'cart.ts', 4)).getByRole('textbox', { name: 'Ask about cart.ts lines 2–4' });
  await expect(box).toBeFocused();
  await box.fill('Why three constants?');
  await rowAfter(row(page, 'cart.ts', 4)).getByRole('button', { name: 'Ask' }).click();

  const asked = JSON.parse((await listener.ended).stdout) as { id: string };
  expect(asked).toMatchObject({ kind: 'ask', step: '1', file: 'cart.ts', lines: [2, 4], text: 'Why three constants?' });
  await expect(row(page, 'cart.ts', 3)).not.toHaveClass(/selected/);
  const pinned = rowAfter(row(page, 'cart.ts', 4));
  await expect(pinned.getByText('Why three constants?')).toBeVisible();
  await expect(pinned.getByText('Waiting for the session to answer.')).toBeVisible();

  repo.run('say', '--answer', asked.id, '--as', 'Finding', 'Each is used *once*.');

  const answer = pinned.getByRole('article', { name: 'Finding' });
  await expect(answer.locator('em', { hasText: 'once' })).toBeVisible();
  await expect(answer).toContainText('lines 2–4');
  await expect(answer).toContainText('You asked: Why three constants?');
  await expect(pinned.getByText('Waiting for the session to answer.')).toHaveCount(0);
  await expect(pinned.getByRole('article')).toHaveCount(1);

  const replying = repo.background('listen');
  await answer.getByRole('button', { name: 'Reply' }).click();
  await answer.getByRole('textbox', { name: 'Reply' }).fill('Then merge them.');
  await answer.getByRole('textbox', { name: 'Reply' }).press('Enter');

  expect(JSON.parse((await replying.ended).stdout)).toMatchObject({ kind: 'reply', text: 'Then merge them.' });
  await expect(answer.getByText('Then merge them.')).toBeVisible();
  await expect(pinned.getByText('Then merge them.')).toHaveCount(1);
});

test('lines can be picked from the keyboard to ask about them', async ({ page }) => {
  const number = (line: number) => row(page, 'cart.ts', line).locator('td.d2h-code-linenumber');
  await number(2).focus();

  await page.keyboard.press('Enter');
  await expect(row(page, 'cart.ts', 2)).toHaveClass(/selected/);
  await expect(page.getByRole('textbox', { name: /^Ask about cart.ts/ })).toHaveCount(0);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(number(4)).toBeFocused();
  await page.keyboard.press('Enter');

  const box = rowAfter(row(page, 'cart.ts', 4)).getByRole('textbox', { name: 'Ask about cart.ts lines 2–4' });
  await expect(box).toBeFocused();
  await expect(row(page, 'cart.ts', 3)).toHaveClass(/selected/);

  await page.keyboard.press('Escape');
  await expect(box).toHaveCount(0);
  await expect(row(page, 'cart.ts', 3)).not.toHaveClass(/selected/);
  await expect(number(4)).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Shift+Enter');
  await expect(rowAfter(row(page, 'cart.ts', 3)).getByRole('textbox', { name: 'Ask about cart.ts line 3' })).toBeFocused();
});

test('one line is picked from the keyboard with Enter on it twice', async ({ page }) => {
  await row(page, 'cart.ts', 2).locator('td.d2h-code-linenumber').focus();

  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');

  await expect(rowAfter(row(page, 'cart.ts', 2)).getByRole('textbox', { name: 'Ask about cart.ts line 2' })).toBeFocused();
});

test('a note keeps its actions in a menu, opened by its button and left with Escape', async ({ page, repo }) => {
  const id = /([0-9a-f]{8})/.exec(repo.record([{ step: '1', file: 'cart.ts', lines: [2, 2], label: 'Risk', text: 'B is two.' }], 'note').stdout)?.[1];
  pin(repo, [{ step: '1', file: 'cart.ts', lines: [4, 4], label: 'Plain', text: 'No actions here.' }]);
  repo.record([{ item: { type: 'note', id }, actions: [{ id: 'post', label: 'Post' }, { id: 'dismiss', label: 'Dismiss' }] }], 'actions');
  const note = page.getByRole('article', { name: 'Risk' });
  const button = note.getByRole('button', { name: 'Note actions' });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(note.getByRole('button', { name: 'Post' })).toHaveCount(0);
  await expect(page.getByRole('article', { name: 'Plain' }).getByRole('button', { name: 'Note actions' })).toHaveCount(0);

  await button.click();

  const menu = note.getByRole('menu', { name: 'Risk actions' });
  await expect(menu.getByRole('menuitem')).toHaveText(['Post', 'Dismiss']);
  await expect(menu.getByRole('menuitem', { name: 'Post' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Dismiss' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(button).toBeFocused();

  const listener = repo.background('listen');
  await button.click();
  await menu.getByRole('menuitem', { name: 'Dismiss' }).click();

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'decision', item: { type: 'note', id }, action: 'dismiss' });
  await expect(menu).toHaveCount(0);
  await expect(note.getByText('Decided: Dismiss', { exact: true })).toBeVisible();
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
