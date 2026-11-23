import type { Locator, Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

test.use({ viewport: { width: 390, height: 844 } });

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  return recorded.stdout;
};

/** The latest decision on each step, as the session reads them. */
const decided = (repo: Repo) =>
  repo
    .run('decisions')
    .stdout.trim()
    .split('\n')
    .map(line => JSON.parse(line) as { item: { type: string; id?: string }; decision: { action: string; note?: string } | null })
    .filter(line => line.item.type === 'step')
    .map(line => line.decision && { action: line.decision.action, ...(line.decision.note && { note: line.decision.note }) });

const openDeck = async (page: Page) => {
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Swipe to decide' }).click();
};

const card = (page: Page, number: number, title: string) => page.getByRole('link', { name: `Open step ${String(number)}, ${title}` });

/** Drags with the mouse from the middle of the card, `by` pixels sideways. */
async function drag(page: Page, target: Locator, by: number): Promise<void> {
  await target.waitFor();
  const box = await target.boundingBox();
  if (!box) throw new Error('the card is not shown');
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + by / 2, y, { steps: 5 });
  await page.mouse.move(x + by, y, { steps: 5 });
  await page.mouse.up();
}

/** Swipes as a finger does: the pointer events a touch screen sends, `by` pixels sideways. */
async function swipe(target: Locator, by: number): Promise<void> {
  await target.waitFor();
  const box = await target.boundingBox();
  if (!box) throw new Error('the card is not shown');
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  const at = (dx: number) => ({ pointerId: 7, pointerType: 'touch', isPrimary: true, bubbles: true, clientX: x + dx, clientY: y });
  await target.dispatchEvent('pointerdown', at(0));
  for (const dx of [10, 30, by / 2, by]) await target.dispatchEvent('pointermove', at(dx));
  await target.dispatchEvent('pointerup', at(by));
}

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test('the header keeps Stop in a More menu, which Escape closes', async ({ page }) => {
  const header = page.getByRole('banner');
  await expect(header.getByRole('button', { name: 'Stop' })).toHaveCount(0);
  const more = header.getByRole('button', { name: 'More' });
  await expect(more).toHaveAttribute('aria-expanded', 'false');

  await more.click();
  const menu = page.getByRole('menu', { name: 'More' });
  await expect(menu.getByRole('menuitem')).toHaveText(['Swipe to decide', 'Stop']);
  await expect(menu.getByRole('menuitem', { name: 'Swipe to decide' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Stop' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(more).toBeFocused();

  await more.click();
  await page.getByRole('menuitem', { name: 'Stop' }).click();
  await expect(page.getByText('Stopped. The walkthrough has stopped and your decisions are kept. You can close this tab.')).toBeVisible();
});

test('the layouts move into the More menu too', async ({ page }) => {
  await expect(page.getByRole('group', { name: 'Layout' })).toBeHidden();
  await page.getByRole('button', { name: 'More' }).click();
  const layouts = page.getByRole('menu', { name: 'More' }).getByRole('menuitemradio');
  await expect(layouts).toHaveText(["What's left", 'Three columns', 'Explanation beside code', 'Tool panel']);
  await expect(layouts.filter({ hasText: "What's left" })).toHaveAttribute('aria-checked', 'true');

  await layouts.filter({ hasText: 'Tool panel' }).click();
  await expect(page.getByRole('tablist', { name: 'Tool panel' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Step' })).toBeVisible();
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Tool panel' })).toHaveAttribute('aria-checked', 'true');
});

test('the step decides from a bottom bar of touch-sized buttons, with Ask above it', async ({ page }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  const choices = step.getByRole('group', { name: 'Decide' }).getByRole('button');
  await expect(choices).toHaveText(['Flag', 'Approve']);
  for (const choice of await choices.all()) expect((await choice.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  const bar = await step.getByRole('group', { name: 'Decide' }).boundingBox();
  const ask = await step.getByRole('textbox', { name: 'Ask about this step' }).boundingBox();
  expect(bar && ask && ask.y + ask.height <= bar.y).toBe(true);
  expect(bar && Math.round(bar.y + bar.height)).toBeGreaterThan(844 - 24);
  expect(ask?.height).toBeGreaterThanOrEqual(44);

  await choices.getByText('Flag').click();
  await expect(step.getByRole('textbox', { name: 'Note' })).toBeFocused();
});

test('the rail becomes a select of what is left, with decided steps and the end after it', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: "What's left" });
  await expect(rail.getByRole('link')).toHaveCount(0);
  const select = rail.getByRole('combobox', { name: 'Step' });
  await expect(select.locator('option')).toHaveText(['Left 2 · Login check', 'App version', 'End of the walkthrough']);
  await expect(select).toHaveValue('1');

  await select.selectOption('2');
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#2');
  await expect(select.locator('option:checked')).toHaveText('Left 2 · App version');

  await page.getByRole('region', { name: 'App version' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(select.locator('optgroup')).toHaveAttribute('label', '1 decided');
  await expect(select.locator('option')).toHaveText(['Left 1 · Login check', 'App version', 'End of the walkthrough']);
  await select.selectOption('end');
  await expect(page.getByRole('heading', { name: '1 of 2 steps decided' })).toBeVisible();
  await expect(select.locator('option:checked')).toHaveText('Left 1 · End of the walkthrough');
});

test('a card swiped right approves its step, and the next card takes its place', async ({ page, repo }) => {
  await openDeck(page);
  expect(new URL(page.url()).hash).toBe('#deck');
  await expect(page.getByText('Swipe right to approve, left to flag. Tap to open the step.')).toBeVisible();
  await expect(page.getByRole('navigation', { name: "What's left" }).getByRole('combobox')).toBeHidden();

  await drag(page, card(page, 1, 'Login check'), 160);
  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'approve' }, null]);
  expect(new URL(page.url()).hash).toBe('#deck');
});

test('a card swiped left by touch flags its step with the note the Flag asks for', async ({ page, repo }) => {
  await openDeck(page);
  await swipe(card(page, 1, 'Login check'), -160);
  const note = page.getByRole('textbox', { name: 'Note' });
  await expect(note).toBeFocused();
  await note.fill('Everyone gets in.');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'flag', note: 'Everyone gets in.' }, null]);
});

test('a short swipe decides nothing, Cancel brings a flagged card back, and a tap opens the step', async ({ page, repo }) => {
  await openDeck(page);
  const first = card(page, 1, 'Login check');
  await drag(page, first, 40);
  await swipe(first, -160);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(first).toBeVisible();
  expect(decided(repo)).toEqual([null, null]);

  await first.click();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#1');
  await page.goBack();
  await expect(first).toBeVisible();
});

test('the deck offers no swipe on a step whose actions the session chose; its buttons stay', async ({ page, repo }) => {
  record(repo, [{ item: { type: 'step', id: '1' }, actions: [{ id: 'approve', label: 'Approve' }, { id: 'fix', label: 'Needs a fix', note: true }] }], 'actions');
  await openDeck(page);
  const first = card(page, 1, 'Login check');
  await expect(page.getByText("The session chose this step's actions; use the buttons. Tap to open the step.")).toBeVisible();
  await drag(page, first, 160);
  await swipe(first, -160);
  await expect(first).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Note' })).toHaveCount(0);
  expect(decided(repo)).toEqual([null, null]);

  const choices = page.getByRole('group', { name: 'Decide' }).getByRole('button');
  await expect(choices).toHaveText(['Needs a fix', 'Approve']);
  await choices.getByText('Approve').click();
  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'approve' }, null]);
});

test('with reduced motion a swiped card only fades, and the swipe still decides', async ({ page, repo }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openDeck(page);
  const first = card(page, 1, 'Login check');
  await first.waitFor();
  const box = await first.boundingBox();
  if (!box) throw new Error('the card is not shown');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 120, box.y + box.height / 2, { steps: 8 });
  expect(await first.evaluate(one => getComputedStyle(one).transform)).toBe('none');
  await page.mouse.up();

  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'approve' }, null]);
});

test('the deck ends when every step is decided', async ({ page }) => {
  await openDeck(page);
  for (const [number, title] of [[1, 'Login check'], [2, 'App version']] as const) {
    await card(page, number, title).waitFor();
    await page.getByRole('group', { name: 'Decide' }).getByRole('button', { name: 'Approve' }).click();
  }
  await expect(page.getByRole('region', { name: 'Swipe to decide' }).getByText('Everything is decided.')).toBeVisible();
  await page.getByRole('link', { name: 'See the end of the walkthrough' }).click();
  await expect(page.getByRole('heading', { name: 'All 2 steps decided' })).toBeVisible();
});
