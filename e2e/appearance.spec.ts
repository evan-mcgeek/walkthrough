import type { Page } from '@playwright/test';
import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

const added = (page: Page) => page.locator('td.d2h-ins:not(.d2h-code-linenumber)').first();
const background = (page: Page) => added(page).evaluate(cell => getComputedStyle(cell).backgroundColor);

const turnColourBlind = async (page: Page, on: boolean) => {
  await page.getByRole('button', { name: 'Menu' }).click();
  const item = page.getByRole('menuitemcheckbox', { name: 'Colour-blind diff' });
  await expect(item).toHaveAttribute('aria-checked', String(!on));
  await item.click();
};

test('the colour-blind diff swaps the added and removed tones, keeps the theme and survives a reload', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  await open(page, url);
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitemradio', { name: 'Dark' }).click();
  const green = await background(page);

  await turnColourBlind(page, true);
  await expect.poll(() => background(page)).not.toBe(green);
  const blue = await background(page);

  await page.reload();
  await expect(page.locator('body[data-view]')).toBeAttached();
  await expect.poll(() => background(page)).toBe(blue);
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('menuitemradio', { name: 'Dark' })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('Escape');

  await turnColourBlind(page, false);
  await expect.poll(() => background(page)).toBe(green);
});
