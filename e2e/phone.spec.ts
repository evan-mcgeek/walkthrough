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
