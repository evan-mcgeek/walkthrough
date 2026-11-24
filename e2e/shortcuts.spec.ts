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

  const sheet = page.getByRole('dialog', { name: 'Help' });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('heading')).toHaveText(['Help', 'Icons', 'Keys']);
  await expect(sheet.locator('.popover-label')).toHaveText(['Checklist', 'Notes', 'Session status']);
  await expect(sheet.getByRole('row').filter({ hasText: 'Changed since you decided (amber)' })).toHaveCount(1);
  await expect(sheet.getByRole('row').filter({ has: page.locator('.segment[data-state="flag"]') })).toHaveText('Needs you');
  await expect(sheet.getByRole('row').filter({ has: page.locator('.segment[data-state="cur"]') })).toHaveText('Where you are');
  for (const [said, state] of [['(green)', 'ok'], ['Flagged (amber)', 'flag'], ['Decided, no tone (grey)', 'neu'], ['Not decided yet (grey)', 'un'],
  ] as const)
    await expect(sheet.getByRole('row').filter({ hasText: said }).first().locator('.help-mark')).toHaveAttribute('data-state', state);
  await expect(sheet.locator('kbd')).toHaveText(['J / K', 'A', 'F', '/', 'Click, Shift-click', 'C', 'V', '1 – 3', 'G then S', '?']);
  await expect(sheet.getByRole('row').filter({ hasText: 'Show or hide a panel' })).toBeVisible();
  for (let press = 0; press < 3; press++) await page.keyboard.press('Tab');
  await expect(approve).not.toBeFocused();
  await page.keyboard.press('j');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(sheet).toBeHidden();
  await expect(approve).toBeFocused();
});

test('the More menu holds Appearance, Help and End session, and opens Help too', async ({ page }) => {
  const more = page.getByRole('banner').getByRole('button', { name: 'More' });
  await more.click();
  await expect(page.getByRole('menu', { name: 'More' }).getByRole('menuitem')).toHaveText(['Appearance', 'Help', 'End session']);
  await page.getByRole('menuitem', { name: 'Help' }).click();
  await expect(page.getByRole('dialog', { name: 'Help' })).toBeVisible();

  await page.mouse.click(5, 300);

  await expect(page.getByRole('dialog', { name: 'Help' })).toBeHidden();
  await expect(more).toBeFocused();
});

test('A approves, F flags with a note and / goes to the Ask box; none fires while typing or in a menu', async ({ page, repo }) => {
  const first = page.getByRole('region', { name: 'Login check' });
  await expect(first.getByRole('button', { name: 'Approve' })).toHaveAttribute('title', 'Approve (A)');
  await expect(first.getByRole('button', { name: 'Flag' })).toHaveAttribute('title', 'Flag (F)');
  await expect(first.getByRole('textbox', { name: 'Ask about this step' })).toHaveAttribute('placeholder', 'Ask about this step');
  await expect(first.locator('form').filter({ has: page.getByRole('textbox', { name: 'Ask about this step' }) })).toHaveAttribute('title', 'Ask about this step (/)');

  await page.getByRole('banner').getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitem').first()).toBeFocused();
  await page.keyboard.press('a');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuenow', '0');
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
  await expect(page.locator('.progress-count')).toHaveText('Summary');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuenow', '2');
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
