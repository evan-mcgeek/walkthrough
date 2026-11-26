import type { Locator, Page } from '@playwright/test';
import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

const added = (page: Page) => page.locator('td.d2h-ins:not(.d2h-code-linenumber)').first();
const colour = (target: Locator, property: 'backgroundColor' | 'color') =>
  target.evaluate((node, name) => getComputedStyle(node)[name], property);

const pick = async (page: Page, name: string) => {
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitemradio', { name }).click();
};

const turnColorblind = async (page: Page, on: boolean) => {
  await page.getByRole('button', { name: 'Menu' }).click();
  const item = page.getByRole('menuitemcheckbox', { name: 'Colorblind' });
  await expect(item).toHaveAttribute('aria-checked', String(!on));
  await item.click();
};

test('Colorblind swaps every green and red for blue and orange, keeps the theme and survives a reload', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  record(repo, [{ text: 'Only users log in', status: 'met' }], 'criteria');
  await open(page, url);
  await pick(page, 'Light');
  const green = await colour(added(page), 'backgroundColor');

  await turnColorblind(page, true);
  await expect.poll(() => colour(added(page), 'backgroundColor')).toBe('rgb(221, 244, 255)');
  await expect.poll(() => colour(page.locator('.file-stats .added').first(), 'color')).toBe('rgb(9, 105, 218)');

  await page.reload();
  await expect(page.locator('body[data-view]')).toBeAttached();
  await expect.poll(() => colour(added(page), 'backgroundColor')).toBe('rgb(221, 244, 255)');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Light' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('menuitemcheckbox', { name: 'Colorblind' })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');

  await page.getByRole('link', { name: 'Finish review' }).click();
  await expect.poll(() => colour(page.locator('.criterion.met .icon'), 'color')).toBe('rgb(9, 105, 218)');
  await page.goBack();

  await pick(page, 'Dark');
  await expect.poll(() => colour(added(page), 'backgroundColor')).toBe('rgb(17, 42, 69)');
  await turnColorblind(page, false);
  await expect.poll(() => colour(added(page), 'backgroundColor')).toBe('rgb(20, 40, 28)');
  await pick(page, 'Light');
  await expect.poll(() => colour(added(page), 'backgroundColor')).toBe(green);
});
