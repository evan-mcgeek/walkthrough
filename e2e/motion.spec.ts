import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', assumptions: ['Nothing else calls login.'], files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

type Played = { id: string; keyframes: Record<string, unknown>[]; duration: number; delay: number; easing: string; iterations: number };

// Every animation the page starts goes through Element.animate; this keeps a record of each.
const RECORD = () => {
  const played: unknown[] = [];
  (window as unknown as { played: unknown[] }).played = played;
  const { animate } = Element.prototype as { animate: (this: Element, ...args: Parameters<Element['animate']>) => Animation };
  Element.prototype.animate = function (this: Element, keyframes, options) {
    const timing: KeyframeAnimationOptions = typeof options === 'object' ? options : { duration: options ?? 0 };
    played.push({
      id: timing.id ?? '',
      keyframes: Array.isArray(keyframes) ? keyframes : [],
      duration: Number(timing.duration ?? 0),
      delay: timing.delay ?? 0,
      easing: timing.easing ?? 'linear',
      iterations: timing.iterations ?? 1,
    });
    return animate.call(this, keyframes, options);
  };
};

const played = (page: Page) => page.evaluate(() => (window as unknown as { played: Played[] }).played);
/** Each animation once: a redraw in the middle of one plays it on again from where it was, with the same keyframes and timing. */
const started = async (page: Page) => [...new Map((await played(page)).map(one => [JSON.stringify(one), one])).values()];
const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
  return recorded.stdout;
};
const rail = (page: Page) => page.getByRole('navigation', { name: 'To review' });

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  // The steps arriving swap the pane; each test starts once that has played.
  await page.waitForTimeout(500);
  await page.evaluate(RECORD);
});

const DURATIONS = [120, 200, 320];
const CURVES = ['cubic-bezier(0.16, 1, 0.3, 1)', 'cubic-bezier(0.7, 0, 0.84, 0)', 'linear'];
// DESIGN.md's Motion names these beside the three durations: the row hiding, a leaving pane, a closing popover, the verdict and the attention pulse.
const NAMED = [60, 100, 80, 440, 1200];
const verdicts = { item: { type: 'verdict' }, actions: [{ id: 'ready', label: 'Ready for colleagues' }, { id: 'fixes', label: 'Needs fixes' }] };
/** Keyframe properties that only fade or recolour. */
const FADES = ['opacity', 'offset', 'easing', 'composite', 'color', 'backgroundColor'];

test('deciding lifts the rail row as a chip into "N decided", closes the rows, ticks the counts and swaps the pane, on the design tokens', async ({
  page,
}) => {
  // The marker's classes as each redraw leaves them, however soon the next one comes.
  await page.locator('.progress-marker').evaluate(marker => {
    const seen: string[] = [];
    (window as unknown as { seen: string[] }).seen = seen;
    new MutationObserver(() => seen.push(marker.getAttribute('class') ?? '')).observe(marker, { attributeFilter: ['class', 'style'] });
  });
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(rail(page).getByRole('link', { name: 'Login check' })).toHaveCount(0);
  await expect(rail(page).getByRole('button', { name: '1 decided' })).toBeVisible();
  // The marker waits for the fill before it walks on.
  expect(await page.evaluate(() => (window as unknown as { seen: string[] }).seen)).toContain('progress-marker waits');
  await expect.poll(async () => new Set((await started(page)).map(one => one.id))).toEqual(
    new Set(['chip-travel', 'chip-fade', 'row-fade', 'row-collapse', 'decided-flash', 'count-land', 'tick', 'pane-leave', 'pane-out', 'pane-enter', 'toast-in']),
  );
  for (const one of await played(page)) {
    expect([...DURATIONS, ...NAMED], one.id).toContain(one.duration);
    expect(CURVES, one.id).toContain(one.easing);
  }
  const shown = await started(page);
  expect(shown.find(one => one.id === 'chip-travel')?.keyframes.at(-1)?.['transform']).toMatch(/^translateY\(\d+(\.\d+)?px\) scale\(0\.92\)$/);
  expect(shown.find(one => one.id === 'count-land')?.delay).toBe(240);
  expect(shown.find(one => one.id === 'row-fade')?.duration).toBe(60);
  // The chip and the row it left are gone once they have played; nothing is left half collapsed.
  await expect(page.locator('.queue-chip')).toHaveCount(0);
  await expect(rail(page).locator('.leaving')).toHaveCount(0);
});

test('a double click, an undo or a turn back mid-motion leaves no ghost and nothing half closed', async ({ page, repo }) => {
  const approve = page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' });
  await approve.dblclick();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await page.getByRole('status').filter({ hasText: 'Decided step 1: Approve' }).getByRole('button', { name: 'Undo' }).click();
  await expect(rail(page).getByRole('link', { name: 'Login check' })).toHaveCount(1);
  await expect(page.locator('.queue-chip')).toHaveCount(0);
  await expect(rail(page).locator('.leaving')).toHaveCount(0);

  // Hidden and shown again before the width has closed: the rail is back at its width.
  await page.keyboard.press('1');
  await page.keyboard.press('1');
  await expect(rail(page)).toBeVisible();
  await expect(rail(page)).not.toHaveClass(/\bsliding\b/);
  await expect(rail(page)).toHaveCSS('width', '224px');

  // A file closed and opened again at once is open, its code drawn.
  await page.getByRole('link', { name: 'Login check' }).click();
  const file = page.locator('.d2h-file-wrapper').first();
  const toggle = file.getByRole('button', { name: /^(Collapse|Expand) login\.ts$/ });
  await toggle.dblclick();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(file).not.toHaveClass(/\bclosing\b/);
  await expect(file.locator('.d2h-file-diff')).toBeVisible();

  // Two verdicts chosen in a row: one chip at most, and the header says the last.
  record(repo, [verdicts], 'actions');
  await page.keyboard.press('g');
  await page.keyboard.press('s');
  const options = page.getByRole('radiogroup', { name: 'Verdict' });
  await options.getByRole('radio', { name: 'Needs fixes' }).click();
  await options.getByRole('radio', { name: 'Ready for colleagues' }).click();
  expect(await page.locator('.verdict-chip').count()).toBeLessThanOrEqual(1);
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Ready for colleagues');
  await expect(page.locator('.verdict-chip, .verdict-old')).toHaveCount(0);
});

test('the verdict docks into the header, tool windows slide to their edge, files fold and popovers settle, on the design tokens', async ({
  page,
  repo,
}) => {
  await page.keyboard.press('1');
  await expect(rail(page)).toBeHidden();
  await expect(page.getByRole('button', { name: 'To review' })).toBeVisible();
  await page.getByRole('button', { name: 'To review' }).click();
  await expect(rail(page)).toBeVisible();
  const file = page.locator('.d2h-file-wrapper').first();
  await file.getByRole('button', { name: 'Collapse login.ts' }).click();
  await expect(file.getByRole('button', { name: 'Expand login.ts' })).toHaveAttribute('aria-expanded', 'false');
  await file.getByRole('button', { name: 'Mark login.ts as viewed' }).click();
  await expect(file.getByRole('button', { name: 'Mark login.ts as viewed' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Appearance' }).click();
  await expect(page.getByRole('dialog', { name: 'Appearance' })).toBeVisible();
  await page.keyboard.press('Escape');
  // Closed at once, whatever is still fading.
  await expect(page.getByRole('dialog', { name: 'Appearance' })).toBeHidden();
  record(repo, [verdicts], 'actions');
  await page.keyboard.press('g');
  await page.keyboard.press('s');
  await page.getByRole('radiogroup', { name: 'Verdict' }).getByRole('radio', { name: 'Needs fixes' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Needs fixes');

  await expect.poll(async () => new Set((await started(page)).map(one => one.id))).toEqual(
    new Set([
      ...['panel-fade', 'panel-width', 'edge-in'],
      ...['fold-turn', 'fold-fade', 'fold-rows', 'viewed-label', 'viewed-dim'],
      ...['popover-in', 'popover-settle', 'popover-out'],
      ...['pane-leave', 'pane-out', 'pane-enter'],
      ...['verdict-width', 'verdict-land', 'verdict-chip', 'verdict-chip-fade', 'toast-in'],
    ]),
  );
  for (const one of await played(page)) {
    expect([...DURATIONS, ...NAMED], one.id).toContain(one.duration);
    expect(CURVES, one.id).toContain(one.easing);
  }
  expect((await started(page)).find(one => one.id === 'verdict-land')?.keyframes).toEqual([
    expect.objectContaining({ opacity: 0 }),
    expect.objectContaining({ opacity: 0, offset: 0.62 }),
    expect.objectContaining({ opacity: 1 }),
  ]);
  await expect(page.locator('.verdict-chip, .popover.leaving')).toHaveCount(0);
});

test('changing the accent cross-fades its colours, and a theme switch snaps', async ({ page }) => {
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Appearance' }).click();
  const root = page.locator('html');
  // What the root's transition was each time its accent or theme changed, however soon the fade ends.
  await root.evaluate(html => {
    const seen: string[] = [];
    (window as unknown as { seen: string[] }).seen = seen;
    new MutationObserver(() => seen.push(`${html.dataset['accent'] ?? ''} ${html.dataset['theme'] ?? ''} ${getComputedStyle(html).transitionProperty}`)).observe(html, {
      attributeFilter: ['data-accent', 'data-theme'],
    });
  });
  const seen = () => page.evaluate(() => (window as unknown as { seen: string[] }).seen);
  await page.getByRole('radio', { name: 'Berry' }).click();
  await expect(root).toHaveAttribute('data-accent', 'berry');
  expect((await seen()).at(-1)).toMatch(/^berry .*--accent, --accent-hover/);
  await page.getByRole('radio', { name: 'Dark' }).click();
  expect((await seen()).at(-1)).toMatch(/^berry dark all$/);
  await expect(root).not.toHaveClass(/\baccent-fade\b/);
  // The registered accent still follows the theme: Berry's dark value.
  await expect.poll(() => root.evaluate(html => getComputedStyle(html).getPropertyValue('--accent').trim())).toBe('rgb(240, 122, 180)');
});

test('reduced motion keeps opacity and colour only', async ({ page, repo }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Assumed, not checked' }).click();
  await step.getByRole('button', { name: '1 thing assumed, not checked' }).click();
  const file = page.locator('.d2h-file-wrapper').first();
  await file.getByRole('button', { name: 'Collapse login.ts' }).click();
  await file.getByRole('button', { name: 'Expand login.ts' }).click();
  await file.getByRole('button', { name: 'Mark login.ts as viewed' }).click();
  await expect(file.getByRole('button', { name: 'Mark login.ts as viewed' })).toHaveAttribute('aria-pressed', 'true');
  // The rail's contents fade, then it is gone and its edge button is there for the focus.
  await page.getByRole('button', { name: 'Hide To review' }).click();
  await expect(page.getByRole('button', { name: 'To review' })).toBeFocused();
  await page.getByRole('button', { name: 'To review' }).click();
  await expect(rail(page)).toBeVisible();
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Appearance' }).click();
  await page.keyboard.press('Escape');
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  record(repo, [verdicts], 'actions');
  await page.keyboard.press('g');
  await page.keyboard.press('s');
  const options = page.getByRole('radiogroup', { name: 'Verdict' });
  await options.getByRole('radio', { name: 'Needs fixes' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Needs fixes');
  await options.getByRole('radio', { name: 'Ready for colleagues' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Ready for colleagues');
  repo.run('say', '--question', 'Is that right?');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Needs you');

  const ids = new Set((await played(page)).map(one => one.id));
  for (const id of ['row-fade', 'fold-fade', 'viewed-label', 'panel-fade', 'edge-in', 'popover-in', 'popover-out', 'pane-enter', 'verdict-in', 'verdict-old']) expect(ids, id).toContain(id);
  for (const id of ['pulse', 'chip-travel', 'verdict-chip', 'verdict-width', 'panel-width', 'fold-rows', 'fold-turn', 'popover-settle']) expect(ids, id).not.toContain(id);
  const moved = (await played(page)).filter(one => one.keyframes.some(frame => Object.keys(frame).some(key => !FADES.includes(key))));
  expect(moved.map(one => one.id)).toEqual([]);
  // What CSS moves, the stepper's marker and fills, only fades.
  expect(await page.locator('.progress-marker').evaluate(marker => getComputedStyle(marker).transitionProperty)).toBe('opacity');
  expect(await page.locator('.progress > .segment').first().evaluate(segment => getComputedStyle(segment, '::after').transitionProperty)).toBe('opacity');
  await expect(rail(page).locator('.leaving')).toHaveCount(0);
});

test('Needs you pulses twice, assumptions and more notes reveal, and a redraw from polling starts nothing', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Assumed, not checked' }).click();
  await step.getByRole('button', { name: '1 thing assumed, not checked' }).click();
  record(
    repo,
    [
      { step: '1', file: 'login.ts', lines: [1, 1], label: 'Nit', text: 'Name it.', low: true },
      { step: '1', file: 'login.ts', lines: [1, 1], label: 'Style', text: 'Spacing.', low: true },
    ],
    'note',
  );
  await step.getByText('2 more notes', { exact: true }).click();
  await expect(step.getByRole('article', { name: 'Style' })).toBeVisible();
  repo.run('say', '--question', 'Is that right?');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Needs you');

  await expect.poll(async () => (await started(page)).map(one => one.id).sort()).toEqual(['pulse', 'reveal', 'rise', 'rise', 'turn', 'turn']);
  const shown = await started(page);
  expect(shown.filter(one => one.id === 'rise').map(one => one.delay)).toEqual([0, 40]);
  expect(shown.find(one => one.id === 'pulse')?.iterations).toBe(2);
  // The pulse is over; nothing is left to play on.
  await page.waitForTimeout(2600);
  const before = (await played(page)).length;

  repo.run('say', 'Still reading.');
  await expect(page.getByRole('link', { name: /Session messages/ })).toBeVisible();
  // Two more polls, the second with nothing new.
  await page.waitForResponse('**/data/walkthrough.json');
  await page.waitForResponse('**/data/walkthrough.json');
  await page.evaluate(() => new Promise(requestAnimationFrame));
  expect((await played(page)).length).toBe(before);
});

test('Undo takes the decision back: undecided on the page, in walkthrough decisions and to the session', async ({
  page,
  repo,
}) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Approve' }).click();
  const toast = page.getByRole('status').filter({ hasText: 'Decided step 1: Approve' });
  await expect(toast).toBeVisible();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await repo.background('listen').ended;
  const listener = repo.background('listen');

  await toast.getByRole('button', { name: 'Undo' }).click();

  expect(JSON.parse((await listener.ended).stdout)).toMatchObject({ kind: 'decision', item: { type: 'step', id: '1' }, clear: true });
  await expect(toast).toBeHidden();
  await expect(step.getByText('Undecided', { exact: true })).toBeVisible();
  await expect(rail(page).getByRole('link', { name: 'Login check' })).toHaveAttribute('aria-current', 'step');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuenow', '0');
  expect(JSON.parse(repo.run('decisions').stdout.split('\n')[0] ?? '')).toEqual({ item: { type: 'step', id: '1' }, decision: null });
});

test('the Undo toast leaves by itself after a short time, and stays while the pointer is on it', async ({ page }) => {
  await page.clock.install();
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  const toast = page.getByRole('status').filter({ hasText: 'Decided step 1: Approve' });
  await expect(toast).toBeVisible();

  await toast.hover();
  await page.clock.runFor(10_000);
  await expect(toast).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.runFor(10_000);

  await expect(toast).toBeHidden();
});

test("Undo's focus ring takes the toast's text colour, which stands out on its fill in both themes", async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await page.getByRole('group', { name: 'Decide' }).getByRole('button', { name: 'Approve' }).click();
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    const [ring, text] = await toast.getByRole('button', { name: 'Undo' }).evaluate((undo: HTMLButtonElement) => {
      undo.focus({ focusVisible: true });
      return [getComputedStyle(undo).outlineColor, getComputedStyle(undo.closest('.toast') ?? undo).color];
    });
    expect(ring).toBe(text);
  }
});
