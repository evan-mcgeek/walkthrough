import { expect, open, record, test } from './walkthrough';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

const STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts'] },
  { title: 'App', explanation: 'Bumps the app.', files: ['app.ts'] },
];

test('at 390 the step list opens from the header, every control is a 44px target, and nothing scrolls the page sideways', async ({ page, repo, url }) => {
  record(repo, STEPS);
  record(repo, [{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment');
  await open(page, url);

  await expect(page.locator('.step-list')).toBeHidden();
  expect(await page.locator('.files-viewed').evaluate(count => (count as HTMLElement).innerText)).toBe('0 / 2');
  await page.getByRole('button', { name: 'Steps and files' }).click();
  await page.getByRole('link', { name: 'App' }).first().click();
  await expect(page.locator('.step-list')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'App' })).toBeVisible();

  await page.getByRole('link', { name: 'Login' }).click();
  const small = await page.locator('button:visible, a.btn:visible, .viewed:visible, .look-link:visible').evaluateAll(controls =>
    controls.filter(control => control.getBoundingClientRect().height < 44 && !control.closest('.app-header')).map(control => control.outerHTML.slice(0, 80)),
  );
  expect(small).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  await page.getByRole('link', { name: 'Finish review' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Summary' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Finish review' })).toBeHidden();
  await expect(page.locator('.going-row')).toContainText('Everyone gets in.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
