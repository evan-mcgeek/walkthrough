import type { Page } from '@playwright/test';
import { expect, lines, open, record, test } from './walkthrough';

const STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
];

/** Clicks the step's row and says, in the same task, whether each pane animation it started moves as well as fades. */
const moveTo = (page: Page, title: string) =>
  page.evaluate(name => {
    const row = [...document.querySelectorAll<HTMLElement>('.step-row')].find(one => one.textContent.includes(name));
    row?.click();
    return document
      .getAnimations()
      .filter(running => running.id.startsWith('pane-'))
      .map(running => {
        const frames = (running.effect as KeyframeEffect).getKeyframes();
        return frames[0]?.['transform'] !== frames.at(-1)?.['transform'];
      });
  }, title);

test('moving to another step slides the panes, and reduced motion only fades them', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  expect(await moveTo(page, 'App')).toEqual([true, true]);
  await expect(page.locator('.content > *')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'App' })).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await moveTo(page, 'Login')).toEqual([false, false]);
  await expect(page.locator('.content > *')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
});

test.describe('scroll and mark', () => {
  test.use({ files: { 'tasks.ts': lines(150, 'task'), 'dates.ts': lines(150, 'date') }, viewport: { width: 1280, height: 600 } });

  const LONG = [
    { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts', 'tasks.ts', 'dates.ts'] },
  ];
  const TWO = [
    { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] },
    { title: 'Tasks', explanation: 'Adds tasks.', files: ['tasks.ts', 'dates.ts'] },
  ];

  /** Runs `act` and says, in the same task, what the pane's scroll and the file headers do. */
  const inTask = (page: Page, act: string) =>
    page.evaluate(how => {
      const main = document.querySelector<HTMLElement>('.main');
      if (!main) throw new Error('no main');
      const from = main.scrollTop;
      if (how.startsWith('key:')) document.dispatchEvent(new KeyboardEvent('keydown', { key: how.slice(4), bubbles: true }));
      else document.querySelector<HTMLElement>(how)?.click();
      return {
        from,
        now: main.scrollTop,
        screen: main.clientHeight,
        scrolling: main.getAnimations().some(running => running.id === 'scroll'),
        swapping: document.getAnimations().some(running => running.id === 'pane-enter'),
        flashing: [...document.querySelectorAll<HTMLElement>('.file-header.flash')].map(header => header.closest<HTMLElement>('.file')?.dataset['file']),
        // How far the marked file still is from where it lands, 16px under the top.
        gap: (document.querySelector('.file-header.flash')?.getBoundingClientRect().top ?? 0) - main.getBoundingClientRect().top - 16,
      };
    }, act);

  test('a file in the step you are on, from the step list, J and K, scrolls there and then marks it, cutting a long way to one screen', async ({ page, repo, url }) => {
    record(repo, LONG);
    await open(page, url);
    const file = page.locator('.file[data-file="dates.ts"]');

    const far = await inTask(page, '.file-row[data-file="dates.ts"] .file-name');
    expect(far.scrolling).toBe(true);
    expect(far.swapping).toBe(false);
    expect(far.flashing).toEqual(['dates.ts']);
    // The file is several screens down, so the pane cuts to one screen short of it and scrolls the rest.
    expect(far.now).toBeGreaterThan(far.from);
    expect(far.gap).toBeGreaterThan(far.screen / 2);
    expect(far.gap).toBeLessThanOrEqual(far.screen + 1);
    await expect.poll(() => file.evaluate(box => Math.round(box.getBoundingClientRect().top - (box.closest('.main')?.getBoundingClientRect().top ?? 0)))).toBe(16);
    await expect(file).toHaveClass(/\bon\b/);

    const back = await inTask(page, 'key:k');
    expect(back.scrolling).toBe(true);
    expect(back.flashing).toEqual(['tasks.ts']);
    await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'tasks.ts');
  });

  test('a file in another step swaps the pane in, then marks it, with no scroll', async ({ page, repo, url }) => {
    record(repo, TWO);
    await open(page, url);
    await page.locator('.step-item').nth(1).getByRole('button', { name: 'Show files' }).click();

    const other = await inTask(page, '.file-row[data-file="dates.ts"] .file-name');
    expect(other.swapping).toBe(true);
    expect(other.scrolling).toBe(false);
    expect(other.flashing).toEqual(['dates.ts']);
    await expect(page.getByRole('heading', { level: 1, name: 'Tasks' })).toBeVisible();
    await expect(page.locator('.file[data-file="dates.ts"]')).toBeInViewport();
  });

  test('under reduced motion the pane jumps, with no scroll animation, and the mark stays', async ({ page, repo, url }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    record(repo, LONG);
    await open(page, url);

    const jump = await inTask(page, 'key:j');
    expect(jump.scrolling).toBe(false);
    const moved = await inTask(page, '.file-row[data-file="dates.ts"] .file-name');
    expect(moved.scrolling).toBe(false);
    expect(moved.flashing).toEqual(['dates.ts']);
    expect(await page.locator('.file[data-file="dates.ts"]').evaluate(box => Math.round(box.getBoundingClientRect().top - (box.closest('.main')?.getBoundingClientRect().top ?? 0)))).toBe(16);
  });

  for (const motion of ['reduce', 'no-preference'] as const)
    test(`a Summary link to a comment in a folded file in another step lands on it once the file opens (${motion})`, async ({ page, repo, url }) => {
      await page.emulateMedia({ reducedMotion: motion });
      record(repo, TWO);
      record(repo, [{ file: 'dates.ts', lines: [140, 140], body: 'Near the end.' }], 'comment');
      await open(page, url);
      await page.locator('.step-item').nth(1).getByRole('button', { name: 'Show files' }).click();
      await page.locator('.file-row[data-file="dates.ts"]').getByRole('checkbox', { name: 'Viewed' }).click();
      await page.getByRole('link', { name: 'Finish review' }).click();

      await page.locator('.going-row').filter({ hasText: 'Near the end.' }).locator('a.where').click();

      const row = page.locator('.file[data-file="dates.ts"] .thread-row').filter({ hasText: 'Near the end.' });
      await expect.poll(() => row.evaluate(one => Math.round(one.getBoundingClientRect().top - (one.closest('.main')?.getBoundingClientRect().top ?? 0)))).toBe(120);
    });
});

test.describe('ending', () => {
  test.use({ files: { 'tasks.ts': lines(150, 'task') }, viewport: { width: 1280, height: 600 } });

  test('End session fades the walkthrough out where it was read, without jumping it to the top', async ({ page, repo, url }) => {
    record(repo, [{ title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts', 'tasks.ts'] }]);
    await open(page, url);
    await page.locator('.main').evaluate(main => {
      main.scrollTop = 600;
    });
    await page.getByRole('button', { name: 'Menu' }).click();
    const scrolled = await page.evaluate(async () => {
      const main = document.querySelector<HTMLElement>('.main');
      [...document.querySelectorAll<HTMLElement>('.menu-item')].find(item => item.textContent === 'End session')?.click();
      const inTask = main?.scrollTop;
      await new Promise(requestAnimationFrame);
      const fading = document.getAnimations().some(running => running.id === 'end-leave' && running.playState === 'running');
      return { inTask, fading, during: main?.scrollTop };
    });
    expect(scrolled).toEqual({ inTask: 600, fading: true, during: 600 });
  });
});

test('the menu fades in and out, and End session fades the walkthrough out before the farewell fades in, with nothing sliding', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  await page.getByRole('button', { name: 'Menu' }).click();
  const closing = await page.evaluate(() => {
    document.querySelector<HTMLElement>('.menu-button')?.click();
    return document.getAnimations().map(running => running.id);
  });
  expect(closing).toContain('fade-out');
  await expect(page.getByRole('menu')).toHaveCount(0);

  await page.getByRole('button', { name: 'Menu' }).click();
  const leaving = await page.evaluate(() => {
    [...document.querySelectorAll<HTMLElement>('.menu-item')].find(item => item.textContent === 'End session')?.click();
    return document.getAnimations().filter(running => running.id === 'end-leave').map(running => (running.effect as KeyframeEffect).getKeyframes().some(frame => frame['transform']));
  });
  expect(leaving.length).toBeGreaterThan(0);
  expect(leaving.every(moves => !moves)).toBe(true);
  await expect(page.getByRole('heading', { name: 'Session ended' })).toBeVisible();
  await expect(page.locator('#nav')).toBeHidden();
});
