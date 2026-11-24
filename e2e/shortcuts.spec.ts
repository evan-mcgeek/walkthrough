import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const recorded = repo.record(steps);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

const heard = async (listener: ReturnType<Repo['background']>) => JSON.parse((await listener.ended).stdout) as unknown;

test('? opens Help, which says what things mean and lists every key, keeps the page behind it still and gives the focus back', async ({ page }) => {
  const approve = page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' });
  await approve.focus();

  await page.keyboard.press('?');

  const sheet = page.getByRole('dialog', { name: 'Help: what things mean' });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('heading')).toHaveText(['Help: what things mean', 'What things mean', 'Keyboard shortcuts']);
  await expect(sheet.locator('.popover-label')).toHaveText(['Steps in To review', 'The progress bar', 'Notes on the code', 'Session status', 'Checklist items']);
  await expect(sheet.getByRole('row').filter({ hasText: 'Changed since you decided' })).toHaveCount(2);
  await expect(sheet.getByRole('row').filter({ hasText: 'Where you are: solid ink, taller' }).locator('.segment')).toHaveAttribute('data-state', 'current');
  await expect(sheet.locator('kbd')).toHaveText(['J / K', 'A', 'F', '/', 'Click, Shift-click a line', 'C', 'V', '1 – 3', 'G then S', '?']);
  await expect(sheet.getByRole('row').filter({ hasText: 'Show or hide a panel' })).toBeVisible();
  for (let press = 0; press < 3; press++) await page.keyboard.press('Tab');
  await expect(approve).not.toBeFocused();
  await page.keyboard.press('j');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(sheet).toBeHidden();
  await expect(approve).toBeFocused();
});

test('the More menu holds Appearance and Help, and opens Help too', async ({ page }) => {
  const more = page.getByRole('banner').getByRole('button', { name: 'More' });
  await more.click();
  await expect(page.getByRole('menu', { name: 'More' }).getByRole('menuitem')).toHaveText(['Appearance', 'Help: what things mean']);
  await page.getByRole('menuitem', { name: 'Help: what things mean' }).click();
  await expect(page.getByRole('dialog', { name: 'Help: what things mean' })).toBeVisible();

  await page.mouse.click(5, 300);

  await expect(page.getByRole('dialog', { name: 'Help: what things mean' })).toBeHidden();
  await expect(more).toBeFocused();
});

test('A approves, F flags with a note and / goes to the Ask box; none fires while typing or in a menu', async ({ page, repo }) => {
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.getByRole('button', { name: 'Approve' })).toHaveAttribute('title', 'Approve and go to the next step (A)');
  await expect(first.getByRole('button', { name: 'Flag' })).toHaveAttribute('title', 'Flag (F)');
  await expect(first.getByRole('textbox', { name: 'Ask about this step' })).toHaveAttribute('placeholder', 'Ask about this step…');
  await expect(first.locator('form').filter({ has: page.getByRole('textbox', { name: 'Ask about this step' }) })).toHaveAttribute('title', 'Ask about this step (/)');

  await page.getByRole('banner').getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('a');
  await expect(page.getByText('Step 1 of 2 · 0 decided', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');

  const deciding = repo.background('listen');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Listening');
  await page.keyboard.press('a');
  expect(await heard(deciding)).toMatchObject({ kind: 'decision', item: { type: 'step', id: '1' }, action: 'approve' });
  const second = page.getByRole('region', { name: 'App version' });
  await expect(second).toBeVisible();

  await page.keyboard.press('/');
  const ask = second.getByRole('textbox', { name: 'Ask about this step' });
  await expect(ask).toBeFocused();
  await expect(ask).toHaveValue('');
  await page.keyboard.type('a f');
  await expect(ask).toHaveValue('a f');
  await ask.blur();

  await page.keyboard.press('f');
  const note = second.getByRole('textbox', { name: 'Note' });
  await expect(note).toBeFocused();
  await page.keyboard.type('Too early.');
  await second.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Summary · 2 decided', { exact: true })).toBeVisible();
});

test('G then S goes to the Summary, and G alone does nothing', async ({ page }) => {
  await page.keyboard.press('g');
  await page.keyboard.press('j');
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();

  await page.keyboard.press('g');
  await page.keyboard.press('s');

  await expect(page.getByRole('region', { name: 'Summary' })).toBeVisible();
});

test('a key pressed before the page has drawn the walkthrough does nothing', async ({ page }) => {
  await page.route('**/data/walkthrough.json', async route => {
    await page.keyboard.press('1');
    await route.continue();
  }, { times: 1 });
  await page.reload();
  await expect(page.getByRole('navigation', { name: 'To review' }).getByRole('link', { name: 'Login check' })).toBeVisible();
});
