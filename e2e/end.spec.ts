import type { Page } from '@playwright/test';
import { ONE_STEP } from '../test/helpers';
import { catchCopies, expect, lastCopied, open, record, test } from './walkthrough';

const AI_COMMENT = [{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }];

/** Clicks in the page and says, in the same task, whether the farewell already shows and which animations it started. */
const clickAndLook = (page: Page, selector: string) =>
  page.evaluate(found => {
    document.querySelector<HTMLElement>(found)?.click();
    const shown = document.querySelector('.end-page h1')?.textContent ?? '';
    const names = document.getAnimations().map(running => (running instanceof CSSAnimation ? running.animationName : running.id));
    return { shown, names };
  }, selector);

/** Counts the page's polls from now on. */
const pollsFrom = (page: Page) => {
  const seen = { count: 0 };
  page.on('request', request => {
    if (request.url().endsWith('data/walkthrough.json')) seen.count++;
  });
  return seen;
};

test.describe('a pull request', () => {
  test.use({ args: ['--pr', '212', '--title', 'Due dates for tasks'] });

  test('End session from the submitted box shows the farewell before the server stops, waving once with happy eyes', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    record(repo, AI_COMMENT, 'comment');
    await open(page, url, '#summary');
    const listener = repo.background('listen');
    await page.getByRole('radio', { name: 'Request changes' }).check();
    await page.getByRole('button', { name: 'Submit review' }).click();
    await expect(page.getByText('Review submitted')).toBeVisible();
    // The session still runs until End session.
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-awake.svg');
    expect(repo.run('posted', '--address', 'https://example.test/review/7').status).toBe(0);
    const view = page.locator('.review-box.done').getByRole('link', { name: 'View review' });
    await expect(view).toHaveAttribute('href', 'https://example.test/review/7');
    await expect(view.locator('svg')).toHaveCount(1);
    await expect(view).toHaveClass(/\bbtn\b/);
    const ink = await view.evaluate(link => [getComputedStyle(link).color, getComputedStyle(link.querySelector('svg') ?? link).color]);
    expect(ink[0]).toBe(ink[1]);
    expect(ink[0]).toBe(await page.evaluate(() => {
      const probe = document.body.appendChild(document.createElement('span'));
      probe.style.setProperty('color', 'var(--accent-text)');
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }));
    await listener.ended;

    const { shown, names } = await clickAndLook(page, '.review-box.done .btn.ghost');
    expect(shown).toBe('Session ended');
    expect(names).toContain('wave6');

    const end = page.locator('.end-page');
    await expect(end.getByRole('heading', { level: 1, name: 'Session ended' })).toBeVisible();
    await expect(end.getByText('Review submitted')).toBeVisible();
    await expect(end.getByText('Request changes, with 1 comment, on #212.')).toBeVisible();
    await expect(end.getByRole('link', { name: 'View review' })).toHaveAttribute('href', 'https://example.test/review/7');
    await expect(end.getByRole('heading', { name: 'Pick it up again' })).toBeVisible();
    await expect(end.getByText('Run this in your agent:')).toBeVisible();
    await expect(end.locator('.command code')).toHaveText('/walkthrough:pr 212');
    await expect(end.getByText('A new commit reopens only the steps that changed.')).toBeVisible();
    await expect(end.getByText('You can close this tab.')).toBeVisible();
    await expect(end.locator('.bye6 .hap')).toHaveCount(2);
    await expect(end.locator('.bye6 .eye')).toHaveCount(0);
    await expect(page.locator('#nav')).toBeHidden();
    await expect(page.locator('.change-label')).toHaveText('#212 Due dates for tasks');
    await expect(page.getByRole('link', { name: 'Finish review' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
    await expect(page.getByRole('alert')).toBeHidden();
    await expect(page).toHaveTitle('#212 Due dates for tasks · Walkthrough');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-done.svg');
    await expect.poll(() => fetch(url).then(() => 'up', () => 'down')).toBe('down');
  });

  test('End session from the menu with nothing submitted: nothing was posted, dot eyes, the exact command to copy, and no more polls', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    record(repo, AI_COMMENT, 'comment');
    await catchCopies(page);
    await open(page, url);

    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('menuitem', { name: 'End session' }).click();

    const end = page.locator('.end-page');
    await expect(end.getByRole('heading', { level: 1, name: 'Session ended' })).toBeVisible();
    await expect(end.getByText('Nothing was posted.')).toBeVisible();
    await expect(end.getByText('Your 1 comment and Viewed marks are kept for next time.')).toBeVisible();
    await expect(end.getByRole('link', { name: 'View review' })).toHaveCount(0);
    await expect(end.locator('.bye6 .eye')).toHaveCount(2);
    await expect(end.locator('.bye6 .hap')).toHaveCount(0);
    // Nothing went out: never done, never awake.
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-ended.svg');
    const polls = pollsFrom(page);

    await end.getByRole('button', { name: 'Copy command' }).click();
    await expect(end.getByRole('button', { name: 'Copied' })).toBeVisible();
    expect(await lastCopied(page)).toBe('/walkthrough:pr 212');
    await expect(end.getByRole('button', { name: 'Copy command' })).toBeVisible({ timeout: 4000 });
    expect(polls.count).toBe(0);
  });

  test('the session isn’t running shows only after two failed polls, and Try again brings the page back as it was', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    await open(page, url);
    await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
    const failed = { count: 0, shownAtSecond: true };
    await page.route('**/data/walkthrough.json', async route => {
      failed.count++;
      if (failed.count === 2) failed.shownAtSecond = await page.locator('.end-page').isVisible();
      await route.abort();
    });

    const end = page.locator('.end-page');
    await expect(end.getByRole('heading', { level: 1, name: 'The session isn’t running' })).toBeVisible({ timeout: 8000 });
    expect(failed.count).toBeGreaterThanOrEqual(2);
    expect(failed.shownAtSecond).toBe(false);
    await expect(end.getByText('This page lost its session.')).toBeVisible();
    await expect(
      end.getByText('Nothing is lost; your comments and Viewed marks are saved.'),
    ).toBeVisible();
    await expect(end.locator('.command code')).toHaveText('/walkthrough:pr 212');
    await expect(end.getByText('You can close this tab.')).toHaveCount(0);
    await expect(end.locator('.bye6 .zz')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-asleep.svg');
    await expect(page.getByText('Could not reach the walkthrough page.')).toHaveCount(0);
    await expect(page.locator('#nav')).toBeHidden();
    expect(await end.evaluate(box => box.getAnimations({ subtree: true }).map(one => (one as CSSAnimation).animationName))).toContain('zz6');

    // The "z" loop pauses while the tab is hidden, as the desk scene does.
    const hide = (hidden: boolean) =>
      page.evaluate(now => {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => now });
        document.dispatchEvent(new Event('visibilitychange'));
      }, hidden);
    const drift = () => end.locator('.zz').evaluate(zz => zz.getAnimations().map(one => one.playState));
    await hide(true);
    expect(await drift()).toEqual(['paused']);
    await hide(false);
    expect(await drift()).toEqual(['running']);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await end.evaluate(box => box.getAnimations({ subtree: true }).length)).toBe(0);

    await page.unroute('**/data/walkthrough.json');
    await Promise.all([page.waitForRequest('**/data/walkthrough.json'), end.getByRole('button', { name: 'Try again' }).click()]);
    await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
    await expect(end).toBeHidden();
    await expect(page.locator('#nav')).toBeVisible();
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-awake.svg');
  });
});

test('your own change: no review type, Send to agent, then the farewell says it went to the agent', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await open(page, url, '#summary');

  await expect(page.getByRole('radio')).toHaveCount(0);
  await expect(page.getByText('No comments. Add one on a line.')).toBeVisible();
  const send = page.getByRole('button', { name: 'Send to agent' });
  await expect(send).toBeDisabled();
  await expect(page.getByText('Add a comment to send it.')).toBeVisible();

  record(repo, AI_COMMENT, 'comment');
  await expect(send).toBeEnabled();
  await expect(page.getByText('Add a comment to send it.')).toBeHidden();
  const listener = repo.background('listen');
  await send.click();
  await expect(page.getByText('Sent to the agent')).toBeVisible();
  await expect(page.getByText('1 comment. The agent is fixing it; follow along there.')).toBeVisible();
  const [line] = (await listener.ended).stdout.trim().split('\n');
  expect(JSON.parse(line ?? '{}')).toEqual({ kind: 'submit', id: expect.any(String) as unknown, summary: '' });

  await page.locator('.review-box.done').getByRole('button', { name: 'End session' }).click();
  const end = page.locator('.end-page');
  await expect(end.getByText('Sent to the agent')).toBeVisible();
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-done.svg');
  await expect(end.getByText('1 comment. The agent picks it up in your conversation.')).toBeVisible();
  await expect(end.locator('.command code')).toHaveText('/walkthrough');
  await expect(end.locator('.bye6 .hap')).toHaveCount(2);
  await expect(page).toHaveTitle('feature/login · Walkthrough');
});
