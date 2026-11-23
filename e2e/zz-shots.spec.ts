import type { Page } from '@playwright/test';
import { expect, test } from './walkthrough';

test.use({ files: { 'cart.ts': 'export const cart = [];\n', 'extra.ts': 'export const extra = 1;\n' } });

const send = (page: Page, url: string, route: string, body: unknown) =>
  page.request.post(new URL(`/${route}?token=${new URL(url).pathname.split('/')[2] ?? ''}`, url).href, { data: body });

const OUT = '/tmp/wt40/shots';

test('summary shots', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record([
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
    { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts', 'extra.ts'] },
  ]);
  const draft = /([0-9a-f]{8})/.exec(repo.record([{ step: '3', file: 'cart.ts', lines: [1, 1], label: 'Draft', text: '[AI] Name the `cart`.' }], 'note').stdout)?.[1];
  const dropped = /([0-9a-f]{8})/.exec(repo.record([{ step: '3', label: 'Draft', text: '[AI] Add a test.' }], 'note').stdout)?.[1];
  const drafted = [{ id: 'post', label: 'Post', edit: true }, { id: 'drop', label: 'Drop' }];
  repo.record({ title: 'Criteria', items: [{ status: 'met', mark: 'met', text: 'Logs in.' }, { status: 'not shown', mark: 'not-met', text: 'Has a cart.' }, { status: 'partly', mark: 'partly', text: 'Survives a reload.' }] }, 'checklist');
  repo.record(
    [
      { item: { type: 'verdict' }, hint: 'Sent with the review.', actions: [{ id: 'approve', label: 'Approve' }, { id: 'changes', label: 'Request changes' }, { id: 'comment', label: 'Comment' }] },
      { item: { type: 'walkthrough' }, hint: 'Goes into a pending review you submit yourself.', actions: [{ id: 'post', label: 'Post my review' }, { id: 'recheck', label: 'Ask the session to re-check step 2' }] },
      { item: { type: 'note', id: draft }, actions: drafted },
      { item: { type: 'note', id: dropped }, actions: drafted },
    ],
    'actions',
  );
  for (const body of [
    { item: { type: 'step', id: '1' }, action: 'flag', note: 'Invalid dates should be a 400.' },
    { item: { type: 'step', id: '2' }, action: 'approve' },
    { item: { type: 'note', id: draft }, action: 'post', text: '[AI] Name the `items`.' },
    { item: { type: 'note', id: dropped }, action: 'drop' },
  ])
    await send(page, url, 'decide', body);
  await send(page, url, 'comment', { step: '1', file: 'login.ts', lines: [1, 1], text: 'The 400 should name the field.' });
  repo.record([
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts', 'extra.ts'] },
    { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
  ]);
  await page.goto(`${url}#summary`);
  const summary = page.getByRole('region', { name: 'Summary' });
  await expect(summary.getByRole('region', { name: 'Your comments' })).toBeVisible();
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 1400, height: 1100 });
    await page.screenshot({ path: `${OUT}/summary-none-${scheme}.png` });
  }
  await page.getByRole('radio', { name: 'Request changes' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toBeVisible();
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 1400, height: 1100 });
    await page.mouse.move(0, 0);
    await page.screenshot({ path: `${OUT}/summary-chosen-${scheme}.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${OUT}/summary-390-${scheme}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(`${url}#2`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/step-light.png` });
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('list');
  await page.goto(repo.url());
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 1100, height: 500 });
    await page.screenshot({ path: `${OUT}/list-${scheme}.png` });
    await page.setViewportSize({ width: 390, height: 700 });
    await page.screenshot({ path: `${OUT}/list-390-${scheme}.png` });
  }
  repo.run('stop', '--list');
});

test('board shots', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto(`file://${process.cwd()}/docs/design/screens.html`);
  const boards = page.locator('#summary .frame');
  for (let at = 0; at < (await boards.count()); at++) await boards.nth(at).screenshot({ path: `${OUT}/board-summary-${String(at)}.png` });
  const list = page.locator('#list .frame');
  for (let at = 0; at < (await list.count()); at++) await list.nth(at).screenshot({ path: `${OUT}/board-list-${String(at)}.png` });
});
