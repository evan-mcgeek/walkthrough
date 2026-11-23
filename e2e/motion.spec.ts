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
const rail = (page: Page) => page.getByRole('navigation', { name: "What's left" });

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
// DESIGN.md's Motion names these beside the three durations: the row's slide, a leaving pane and the attention pulse.
const NAMED = [160, 100, 1200];

test('deciding slides the rail row out, fills the progress, ticks the counts and swaps the pane, on the design tokens', async ({
  page,
}) => {
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(rail(page).getByRole('link', { name: 'Login check' })).toHaveCount(0);
  await expect.poll(async () => new Set((await started(page)).map(one => one.id))).toEqual(
    new Set(['row-slide', 'row-fade', 'row-collapse', 'fill', 'tick', 'pane-leave', 'pane-out', 'pane-enter', 'toast-in']),
  );
  for (const one of await played(page)) {
    expect([...DURATIONS, ...NAMED], one.id).toContain(one.duration);
    expect(CURVES, one.id).toContain(one.easing);
  }
  const slide = (await played(page)).find(one => one.id === 'row-slide');
  expect(slide?.keyframes.at(-1)?.['transform']).toBe('translateX(-16px)');
});

test('reduced motion keeps opacity only', async ({ page, repo }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Assumed, not read' }).click();
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: '1 assumption' }).click();
  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  repo.run('say', '--question', 'Is that right?');
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Needs you');

  await expect.poll(async () => (await played(page)).length).toBeGreaterThan(0);
  const moved = (await played(page)).filter(one =>
    one.keyframes.some(frame => Object.keys(frame).some(key => !['opacity', 'offset', 'easing', 'composite'].includes(key))),
  );
  expect(moved.map(one => one.id)).toEqual([]);
  expect((await played(page)).map(one => one.id)).not.toContain('pulse');
  await expect(rail(page).locator('.leaving')).toHaveCount(0);
});

test('Needs you pulses twice, assumptions and more notes reveal, and a redraw from polling starts nothing', async ({ page, repo }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  await step.getByRole('button', { name: 'Assumed, not read' }).click();
  await step.getByRole('button', { name: '1 assumption' }).click();
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
  await expect(page.getByRole('link', { name: /From the session/ })).toBeVisible();
  // Two more polls, the second with nothing new.
  await page.waitForTimeout(3200);
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
