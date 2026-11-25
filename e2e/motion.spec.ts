import type { Page } from '@playwright/test';
import { expect, open, record, test } from './walkthrough';

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
