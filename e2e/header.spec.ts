import type { Page } from '@playwright/test';
import { expect, test } from './walkthrough';

test.use({ files: { 'cart.ts': 'export const cart = [];\n' } });

const progress = (page: Page) => page.getByRole('progressbar', { name: 'Steps decided' });
const segments = (page: Page) =>
  progress(page).locator('[data-state]').evaluateAll(all => all.map(one => one.getAttribute('data-state')));

test('the progress bar has a segment per step coloured by its state, with a count of decided steps', async ({
  page,
  repo,
  url,
}) => {
  await expect(page).toHaveURL(url);
  await expect(progress(page)).toHaveCount(0);
  repo.record([
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
    { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
  ]);

  await expect(progress(page)).toHaveAttribute('aria-valuetext', '0 of 3 steps decided, 3 left, 1 read');
  await expect(progress(page)).toHaveAttribute('aria-valuenow', '0');
  await expect(progress(page)).toHaveAttribute('aria-valuemax', '3');
  await expect(page.getByText('0/3', { exact: true })).toBeVisible();
  expect(await segments(page)).toEqual(['current', 'unread', 'unread']);

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(progress(page)).toHaveAttribute('aria-valuetext', '1 of 3 steps decided, 2 left, 2 read');
  await expect(page.getByText('1/3', { exact: true })).toBeVisible();
  expect(await segments(page)).toEqual(['decided', 'current', 'unread']);

  await page.getByRole('link', { name: '3. Cart' }).click();
  await expect(progress(page)).toHaveAttribute('aria-valuetext', '1 of 3 steps decided, 2 left, 3 read');
  expect(await segments(page)).toEqual(['decided', 'read', 'current']);
});

test('the session status shows its state with a dot, or a spinning icon while the session works', async ({
  page,
  repo,
  url,
}) => {
  await expect(page).toHaveURL(url);
  const status = page.getByRole('status', { name: 'Session' });
  await expect(status).toHaveAttribute('data-state', 'working');
  await expect(status.locator('svg')).toHaveCount(1);
  await expect(status.locator('.dot')).toHaveCount(0);

  const listener = repo.background('listen');
  await expect(status).toHaveAttribute('data-state', 'listening');
  await expect(status).toHaveText('Listening');
  await expect(status.locator('.dot')).toHaveCount(1);
  await expect(status.locator('svg')).toHaveCount(0);

  listener.child.kill('SIGTERM');
  await expect(status).toHaveAttribute('data-state', 'gone');
  await expect(status).toHaveText('Gone');
  await expect(status.locator('.dot')).toHaveCount(1);

  repo.run('say', '--question', 'Is the login meant to accept everyone?');
  await expect(status).toHaveAttribute('data-state', 'needs-you');
  await expect(status).toHaveText('Needs you');
  await expect(status.locator('.dot')).toHaveCount(1);
});

test('the header names the walkthrough and its range, and Stop stays at hand', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const label = page.getByRole('heading', { level: 1 });
  await expect(label).toHaveText('feature/login');
  const range = `${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`;
  await expect(label).toHaveAttribute('title', new RegExp(`^against \\S*main, ${range}$`));
  await expect(page.getByRole('banner').getByRole('button', { name: 'Stop' })).toBeVisible();
});
