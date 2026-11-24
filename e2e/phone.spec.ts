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

test('the header keeps End session in a More menu, which Escape closes', async ({ page }) => {
  const header = page.getByRole('banner');
  await expect(header.getByRole('button', { name: 'End session' })).toHaveCount(0);
  await expect(header.getByText('Session', { exact: true })).toBeHidden();
  const more = header.getByRole('button', { name: 'More' });
  await expect(more).toHaveAttribute('aria-expanded', 'false');

  await more.click();
  const menu = page.getByRole('menu', { name: 'More' });
  await expect(menu.getByRole('menuitem')).toHaveText(['Swipe to decide', 'Appearance', 'Help: what things mean', 'End session']);
  await expect(menu.getByRole('menuitem', { name: 'Swipe to decide' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(menu.getByRole('menuitem', { name: 'End session' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(more).toBeFocused();

  await more.click();
  await page.getByRole('menuitem', { name: 'End session' }).click();
  await expect(page.getByText('Stopped. The walkthrough has stopped and your decisions are kept. You can close this tab.')).toBeVisible();
});

test('the header keeps one row over the progress strip, shortening the label to fit', async ({ page, repo }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  repo.background('listen');
  const header = page.getByRole('banner');
  await expect(header.getByRole('status', { name: 'Session' })).toHaveText('Listening');
  const middle = async (part: Locator) => {
    const box = await part.boundingBox();
    return box ? Math.round(box.y + box.height / 2) : -1;
  };
  const row = await middle(header.getByText('Walkthrough', { exact: true }));
  expect(await middle(header.getByRole('status', { name: 'Session' }))).toBe(row);
  expect(await middle(header.getByRole('button', { name: 'More' }))).toBe(row);
  expect((await header.boundingBox())?.height).toBeLessThan(72);
});

test('the panels move into the More menu, where the explanation column waits for wider screens', async ({ page, repo }) => {
  const record = repo.record({ title: 'Acceptance criteria', items: [{ status: 'met', mark: 'met', text: 'A person can log in.', steps: ['1'] }] }, 'checklist');
  if (record.status !== 0) throw new Error(record.stderr);
  await expect(page.locator('.edge-stripe').getByRole('button')).toHaveCount(0);
  await page.getByRole('button', { name: 'More' }).click();
  const panels = page.getByRole('menu', { name: 'More' }).getByRole('menuitemcheckbox');
  await expect(panels).toHaveText(['To review (1)', 'Checklist (2)', 'Explanation column (3)Wider screens']);
  await expect(panels.nth(0)).toHaveAttribute('aria-checked', 'true');
  await expect(panels.nth(2)).toHaveAttribute('aria-disabled', 'true');
  // A rule sets the panels apart from Appearance, Help and End session.
  await expect(page.getByRole('menu', { name: 'More' }).getByRole('separator')).toHaveCount(1);

  await page.getByRole('menuitemcheckbox', { name: /^Checklist/ }).click();
  const side = page.getByRole('complementary', { name: 'Checklist' });
  await expect(side.getByText('A person can log in.')).toBeVisible();
  const main = await page.getByRole('main').boundingBox();
  const stacked = await side.boundingBox();
  expect(main && stacked && stacked.y >= main.y + main.height - 1).toBe(true);
  await page.getByRole('button', { name: 'More' }).click();
  await expect(page.getByRole('menuitemcheckbox', { name: 'Checklist (2)' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemcheckbox', { name: /^Explanation column/ })).toBeDisabled();
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

test('the rail becomes a select of what is left, with decided steps and the Summary after it, and the count beside it', async ({ page }) => {
  const rail = page.getByRole('navigation', { name: 'To review' });
  await expect(rail.getByRole('link')).toHaveCount(0);
  const select = rail.getByRole('combobox', { name: 'Step' });
  await expect(select.locator('option')).toHaveText(['Step 1 of 2 · Login check', 'App version', 'Summary']);
  await expect(select).toHaveValue('1');
  await expect(rail.locator('.queue-count')).toHaveText('0 decided');
  await expect(rail.locator('.queue-count')).toBeVisible();
  await expect(page.getByRole('banner').getByText(/decided/)).toBeHidden();

  await select.selectOption('2');
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  expect(new URL(page.url()).hash).toBe('#2');
  await expect(select.locator('option:checked')).toHaveText('Step 2 of 2 · App version');

  await page.getByRole('region', { name: 'App version' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(select.locator('optgroup')).toHaveAttribute('label', '1 decided');
  await expect(select.locator('option')).toHaveText(['Step 1 of 2 · Login check', 'App version', 'Summary']);
  await expect(rail.locator('.queue-count')).toHaveText('1 decided');
  await select.selectOption('summary');
  await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  await expect(select.locator('option:checked')).toHaveText('Summary');
});

test('a card swiped right approves its step, and the next card takes its place', async ({ page, repo }) => {
  await openDeck(page);
  expect(new URL(page.url()).hash).toBe('#deck');
  await expect(page.getByText('Swipe right to approve, left to flag. Tap to open the step.')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'To review' }).getByRole('combobox')).toBeHidden();

  await drag(page, card(page, 1, 'Login check'), 160);
  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'approve' }, null]);
  expect(new URL(page.url()).hash).toBe('#deck');
});

test('mid-swipe, the Approve chip previews the green its decision shows in, and the Flag chip the amber', async ({ page }) => {
  await openDeck(page);
  const top = card(page, 1, 'Login check');
  const box = await top.boundingBox();
  if (!box) throw new Error('the card is not shown');
  const colour = (token: string) =>
    page.evaluate(name => {
      const probe = document.body.appendChild(document.createElement('span'));
      probe.style.color = `var(${name})`;
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }, token);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 5 });

  const approve = page.locator('.decision-chip.approve');
  await expect(approve).toHaveCSS('color', await colour('--ok'));
  await expect(approve).toHaveCSS('background-color', await colour('--ok-bg'));
  await expect(page.locator('.decision-chip.flag')).toHaveCSS('color', await colour('--amber'));
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
});

test('a card calls out the step’s finding, and no other note', async ({ page, repo }) => {
  record(repo, [{ step: '1', label: 'Thread', text: 'A question.' }], 'note');
  await openDeck(page);
  const top = card(page, 1, 'Login check');
  await expect(top.getByText('1 file · 1 note')).toBeVisible();
  await expect(top.locator('.card-note')).toHaveCount(0);

  record(repo, [{ step: '1', label: 'Bug', text: 'Off by one.', finding: true }], 'note');

  await expect(top.locator('.card-note')).toHaveText('Bug: Off by one.');
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

test('a step whose actions are Approve and Flag recorded with no tone, as an older policy says, still swipes and shows green', async ({ page, repo }) => {
  record(repo, [{ item: { type: 'step', id: '1' }, actions: [{ id: 'approve', label: 'Approve' }, { id: 'flag', label: 'Flag', note: true }] }], 'actions');
  await openDeck(page);
  await expect(page.getByText('Swipe right to approve, left to flag. Tap to open the step.')).toBeVisible();

  await drag(page, card(page, 1, 'Login check'), 160);

  await expect(card(page, 2, 'App version')).toBeVisible();
  expect(decided(repo)).toEqual([{ action: 'approve' }, null]);
  await expect(page.getByRole('progressbar', { name: 'Steps decided' }).locator('.segment').first()).toHaveAttribute('data-fill', 'ok');
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
  await page.getByRole('link', { name: 'See the summary' }).click();
  await expect(page.getByRole('heading', { name: 'Summary', exact: true })).toBeVisible();
});

test('a second tap on Approve while the card flies sends no second decision', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname === '/decide') sent.push(request.url());
  });
  await openDeck(page);
  await card(page, 1, 'Login check').waitFor();

  await page.getByRole('group', { name: 'Decide' }).getByRole('button', { name: 'Approve' }).dblclick();

  await expect(card(page, 2, 'App version')).toBeVisible();
  // Longer than a card's flight, so a second one would have landed.
  await page.waitForTimeout(400);
  expect(sent).toHaveLength(1);
});

test('a card swiped while the session changed its actions comes back undecided, with the new actions', async ({ page, repo }) => {
  await openDeck(page);
  const first = card(page, 1, 'Login check');
  await first.waitFor();
  const box = await first.boundingBox();
  if (!box) throw new Error('the card is not shown');
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 60, y, { steps: 5 });

  const polled = page.waitForResponse(async answer => answer.url().includes('data/walkthrough.json') && answer.status() === 200 && (await answer.text()).includes('"Ship"'));
  record(repo, [{ item: { type: 'step', id: '1' }, actions: [{ id: 'approve', label: 'Ship' }, { id: 'hold', label: 'Hold' }] }], 'actions');
  await polled;
  await page.mouse.move(x + 160, y, { steps: 5 });
  await page.mouse.up();

  await expect(page.getByRole('group', { name: 'Decide' }).getByRole('button')).toHaveText(['Hold', 'Ship']);
  await expect(first).toBeVisible();
  expect(decided(repo)).toEqual([null, null]);
});
