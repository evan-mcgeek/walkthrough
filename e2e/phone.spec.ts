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

test('the step decides from a bottom bar of touch-sized buttons, with Ask above it', async ({ page }) => {
  const step = page.getByRole('region', { name: 'Login check' });
  const choices = step.getByRole('group', { name: 'Decide' }).getByRole('button');
  await expect(choices).toHaveText(['Flag', 'Approve']);
  for (const box of await choices.evaluateAll(all => all.map(one => one.getBoundingClientRect())))
    expect(box.height).toBeGreaterThanOrEqual(44);
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
