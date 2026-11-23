import type { Page } from '@playwright/test';
import type { Repo } from '../test/helpers';
import { expect, test } from './walkthrough';

const steps = [
  { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
  { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
];

const record = (repo: Repo, input: unknown, command = 'steps') => {
  const recorded = repo.record(input, command);
  if (recorded.status !== 0) throw new Error(recorded.stderr);
};

const LAYOUTS = ["What's left", 'Three columns', 'Explanation beside code', 'Tool panel'];

const layoutSwitch = (page: Page) => page.getByRole('banner').getByRole('group', { name: 'Layout' });
const choose = (page: Page, layout: string) => layoutSwitch(page).getByRole('button', { name: layout }).click();

test.beforeEach(async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  record(repo, steps);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
});

test("the header offers the four layouts, with What's left pressed until another is chosen", async ({ page }) => {
  const buttons = layoutSwitch(page).getByRole('button');
  await expect(buttons).toHaveCount(4);
  for (const [at, layout] of LAYOUTS.entries()) {
    await expect(buttons.nth(at)).toHaveAccessibleName(layout);
    await expect(buttons.nth(at)).toHaveAttribute('title', layout);
    await expect(buttons.nth(at)).toHaveAttribute('aria-pressed', String(at === 0));
  }

  await choose(page, 'Tool panel');

  await expect(layoutSwitch(page).getByRole('button', { name: 'Tool panel' })).toHaveAttribute('aria-pressed', 'true');
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'false');
});

test('the chosen layout survives a reload', async ({ page }) => {
  await choose(page, 'Three columns');
  await page.reload();
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: 'Three columns' })).toHaveAttribute('aria-pressed', 'true');
});

test("with browser storage blocked the page opens on What's left and still switches, without errors", async ({ page, url }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('blocked', 'SecurityError');
    };
    Object.defineProperty(window, 'localStorage', { get: blocked });
  });
  await page.goto(url);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'true');

  await choose(page, 'Explanation beside code');

  await expect(layoutSwitch(page).getByRole('button', { name: 'Explanation beside code' })).toHaveAttribute('aria-pressed', 'true');
});

test('a stored layout the page does not know falls back to the default', async ({ page, url }) => {
  await page.evaluate(() => {
    localStorage.setItem('walkthrough.layout', 'nonsense');
  });
  await page.goto(url);
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  await expect(layoutSwitch(page).getByRole('button', { name: "What's left" })).toHaveAttribute('aria-pressed', 'true');
});
