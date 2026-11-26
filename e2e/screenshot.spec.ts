import fs from 'node:fs';
import path from 'node:path';
import { inboxOf } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

const SHOT = path.resolve(import.meta.dirname, '..', 'docs', 'images', 'main-light.png');
const ALT = 'The task list with an overdue task';

test("the author's screenshot opens in place to the step's width and closes by Close, the image or Esc", async ({ page, repo, url }) => {
  const file = path.join(inboxOf(repo.run('start')), 'shot.png');
  fs.copyFileSync(SHOT, file);
  record(repo, [{ title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'], screenshot: { file, alt: ALT } }]);
  await open(page, url);

  const button = page.getByRole('button', { name: `Open the screenshot: ${ALT}` });
  const image = page.locator('.screenshot-image');
  await expect(page.locator('.screenshot figcaption span')).toHaveText(ALT);
  await expect(image).toHaveJSProperty('complete', true);
  expect(await image.evaluate(img => [img.getBoundingClientRect().width, img.getBoundingClientRect().height, (img as HTMLImageElement).naturalWidth])).toEqual([240, 156, 1440]);

  await button.click();
  const close = page.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toBeVisible();
  await expect(page.locator('.screenshot')).toHaveClass(/open/);
  const stepWidth = await page.locator('.step-head').evaluate(head => Math.min(960, head.clientWidth));
  await expect.poll(() => page.locator('.screenshot-button').evaluate(shot => shot.getBoundingClientRect().width)).toBe(stepWidth);

  await close.click();
  await expect(close).toBeHidden();
  await expect(page.getByRole('button', { name: `Open the screenshot: ${ALT}` })).toBeFocused();

  await button.click();
  await page.getByRole('button', { name: 'Close the screenshot' }).click();
  await expect(page.locator('.screenshot')).not.toHaveClass(/open/);

  await button.click();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(page.locator('.screenshot')).toHaveClass(/open/);

  await page.getByRole('heading', { level: 1, name: 'Login' }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.screenshot')).not.toHaveClass(/open/);
  await expect.poll(() => image.evaluate(img => img.getBoundingClientRect().height)).toBe(156);
});
