import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const cart = ['const a = 1;', 'const b = 2;', 'const c = 3;', 'const d = 4;', 'const e = 5;', ''].join('\n');
test.use({ files: { 'cart.ts': cart } });

const row = (page: Page, line: number) => page.locator('.d2h-file-wrapper[data-file="cart.ts"] tr', { has: page.locator('.line-num2', { hasText: new RegExp(`^${String(line)}$`) }) });
const rowAfter = (page: Page, line: number) => row(page, line).locator('xpath=following-sibling::tr[1]');
/** The person's comments as the session reads them at the finishing action. */
const comments = (repo: Repo) => repo.run('comments').stdout.trim().split('\n').filter(Boolean).map(line => JSON.parse(line) as Record<string, unknown>);
/** The last thing the page sent before the listener woke. */
const heard = async (listener: ReturnType<Repo['background']>) =>
  JSON.parse((await listener.ended).stdout.trim().split('\n').at(-1) ?? '') as Record<string, unknown>;

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record([{ title: 'Cart', explanation: 'Adds a cart.', files: ['login.ts', 'app.ts', 'cart.ts'] }]);
  await expect(page.getByRole('region', { name: 'Cart' })).toBeVisible();
});

test('a picked range offers Ask or Comment, and a comment saved there is kept for the session as yours', async ({ page, repo }) => {
  repo.run('start', '--comments', 'Joins the fix list');
  await row(page, 2).locator('.line-num2').click();
  await row(page, 4).locator('.line-num2').click({ modifiers: ['Shift'] });
  const picked = rowAfter(page, 4);
  await expect(picked.getByText('Lines 2–4', { exact: true })).toBeVisible();
  await expect(picked.getByRole('button')).toHaveText(['Ask', 'Comment']);

  await picked.getByRole('button', { name: 'Comment' }).click();
  const box = picked.getByRole('textbox', { name: 'Your comment' });
  await expect(box).toBeFocused();
  await expect(picked.getByText('Joins the fix list')).toBeVisible();
  await box.fill('Name the `constants`.');
  await picked.getByRole('button', { name: 'Save comment' }).click();

  const mine = rowAfter(page, 4).getByRole('article', { name: 'Your comment' });
  await expect(mine).toContainText('lines 2–4');
  await expect(mine.locator('code')).toHaveText('constants');
  await expect(mine).toContainText('Joins the fix list');
  await expect(mine).not.toContainText('[AI]');
  await expect(row(page, 4).locator('.gutter-mark.own')).toHaveCount(1);
  await expect(page.locator('.overview-stripe .tick-own')).toHaveCount(1);
  await expect(row(page, 3)).not.toHaveClass(/selected/);
  expect(comments(repo)).toEqual([expect.objectContaining({ step: '1', file: 'cart.ts', lines: [2, 4], text: 'Name the `constants`.' })]);
});

test('the “+” beside a line starts a comment on it, which stays editable and deletable until posted', async ({ page, repo }) => {
  await row(page, 3).locator('.line-num2').hover();
  await row(page, 3).locator('.add-comment').click();
  await rowAfter(page, 3).getByRole('textbox', { name: 'Your comment' }).fill('C is odd.');
  await rowAfter(page, 3).getByRole('button', { name: 'Save comment' }).click();
  const mine = rowAfter(page, 3).getByRole('article', { name: 'Your comment' });
  await expect(mine).toContainText('C is odd.');
  const id = (JSON.parse(repo.run('comments').stdout) as { id: string }).id;

  await mine.getByRole('button', { name: 'Edit comment' }).click();
  await expect(mine.getByRole('textbox', { name: 'Your comment' })).toHaveValue('C is odd.');
  await mine.getByRole('textbox', { name: 'Your comment' }).fill('C is three.');
  await mine.getByRole('button', { name: 'Save comment' }).click();

  await expect(mine).toContainText('C is three.');
  expect(comments(repo)).toEqual([expect.objectContaining({ id, text: 'C is three.' })]);
  repo.run('posted', id);
  await expect(mine.getByText('Posted', { exact: true })).toBeVisible();
  await expect(mine.getByRole('button', { name: 'Edit comment' })).toHaveCount(0);
  await expect(mine.getByRole('button', { name: 'Delete comment' })).toHaveCount(0);
});

test('deleting a comment takes it off the page and out of what the session reads', async ({ page, repo }) => {
  await row(page, 2).locator('.line-num2').hover();
  await row(page, 2).locator('.add-comment').click();
  await rowAfter(page, 2).getByRole('textbox', { name: 'Your comment' }).fill('Drop me.');
  await rowAfter(page, 2).getByRole('button', { name: 'Save comment' }).click();
  const mine = page.getByRole('article', { name: 'Your comment' });
  await expect(mine).toBeVisible();

  await mine.getByRole('button', { name: 'Delete comment' }).click();

  await expect(mine).toHaveCount(0);
  expect(comments(repo)).toEqual([]);
  await expect(row(page, 2).locator('.gutter-mark')).toHaveCount(0);
});

test('C comments on the focused line or on the picked range, from the keyboard', async ({ page }) => {
  await row(page, 2).locator('td.d2h-code-linenumber').focus();

  await page.keyboard.press('c');

  const box = rowAfter(page, 2).getByRole('textbox', { name: 'Your comment' });
  await expect(box).toBeFocused();
  await expect(rowAfter(page, 2)).toContainText('line 2');
  await page.keyboard.press('Escape');
  await expect(box).toHaveCount(0);

  await row(page, 3).locator('td.d2h-code-linenumber').focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(rowAfter(page, 4).getByRole('button', { name: 'Ask', exact: true })).toBeFocused();
  await page.keyboard.press('c');
  await expect(rowAfter(page, 4).getByRole('textbox', { name: 'Your comment' })).toBeFocused();
  await expect(rowAfter(page, 4)).toContainText('lines 3–4');
});

test('a comment wakes no one and nothing lands under it; the session\'s answer to a decision stays off the page, and an answer to an ask shows', async ({ page, repo }) => {
  const listener = repo.background('listen');
  await row(page, 3).locator('.line-num2').hover();
  await row(page, 3).locator('.add-comment').click();
  await rowAfter(page, 3).getByRole('textbox', { name: 'Your comment' }).fill('C is odd.');
  await rowAfter(page, 3).getByRole('button', { name: 'Save comment' }).click();
  const mine = rowAfter(page, 3).getByRole('article', { name: 'Your comment' });
  await expect(mine).toContainText('C is odd.');

  // The listener sleeps through the comment and wakes on the next thing that needs the session.
  await page.getByRole('button', { name: 'Flag' }).click();
  await page.getByRole('textbox', { name: 'Note' }).fill('Odd names.');
  await page.getByRole('button', { name: 'Send' }).click();
  const handed = (await listener.ended).stdout.trim().split('\n').map(line => JSON.parse(line) as Record<string, unknown>);
  expect(handed.map(one => one['kind'])).toEqual(['decision']);
  await page.goto(`${page.url().split('#')[0] ?? ''}#1`);
  await expect(mine).toBeVisible();
  const below = row(page, 5);
  const before = (await below.boundingBox())?.y;

  const taken = page.waitForResponse(async response => response.url().includes('session.json') && (await response.text()).includes('On the fix list.'));
  expect(repo.run('say', '--answer', String(handed[0]?.['id']), 'On the fix list.').status).toBe(0);
  await taken;
  await expect(page.getByText('On the fix list.')).toHaveCount(0);
  expect((await below.boundingBox())?.y).toBe(before);

  const asking = repo.background('listen');
  await page.getByRole('textbox', { name: 'Ask about this step' }).fill('Why three?');
  await page.getByRole('textbox', { name: 'Ask about this step' }).press('Enter');
  const ask = await heard(asking);
  expect(repo.run('say', '--answer', String(ask['id']), 'One per constant.').status).toBe(0);
  await expect(page.getByText('One per constant.')).toBeVisible();
});
