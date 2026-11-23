import { ONE_STEP } from '../test/helpers';
import { expect, test } from './walkthrough';

test('shows the session preparing until it records steps, then the steps without a reload', async ({
  page,
  repo,
  url,
}) => {
  await expect(page).toHaveURL(url);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  const range = `${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`;
  await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('title', new RegExp(`^against \\S*main, ${range}$`));
  const preparing = page.getByText('Preparing the steps');
  await expect(preparing).toBeVisible();
  await expect(page.getByText('They appear here as the session records them.')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Preparing' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: "What's left" })).toContainText('No steps yet');
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveCount(0);
  let loads = 0;
  page.on('load', () => loads++);

  repo.record(ONE_STEP);

  const step = page.getByRole('region', { name: 'Login' });
  // diff2html marks files and changed lines with classes only, no roles.
  const file = (name: string) =>
    step.locator('.d2h-file-wrapper').filter({ has: page.getByText(name, { exact: true }) });
  await expect(file('login.ts').locator('.d2h-ins')).toContainText(['export const login = () => true;']);
  await expect(file('app.ts').locator('.d2h-del')).toContainText(['export const app = 1;']);
  await expect(file('app.ts').locator('.d2h-ins')).toContainText(['export const app = 2;']);
  await expect(preparing).toHaveCount(0);
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute('aria-valuetext', /^0 of 1 step decided, 1 left/);
  expect(loads).toBe(0);
});

test('a poll of a walkthrough that has not changed gets no body', async ({ page, url }) => {
  await expect(page).toHaveURL(url);

  // WebKit reports the server's 304 as a 200, so the poll is found by the version it sent still being the current one.
  const unchanged = await page.waitForResponse(
    answer => answer.url().endsWith('data/walkthrough.json') && answer.request().headers()['if-none-match'] === answer.headers()['etag'],
  );

  expect(unchanged.request().headers()['if-none-match']).toMatch(/^"[0-9a-f]{16}"$/);
  expect((await unchanged.request().sizes()).responseBodySize).toBe(0);
});

test('an approved step stays approved when the page is opened again', async ({ page, context, repo, url }) => {
  repo.record(ONE_STEP);
  const step = page.getByRole('region', { name: 'Login' });
  await step.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'All 1 step decided' })).toBeVisible();

  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(url);

  await expect(reopened.getByRole('region', { name: 'All 1 step decided' })).toBeVisible();
  await reopened.getByRole('region', { name: 'All 1 step decided' }).getByRole('link', { name: 'Login' }).click();
  const again = reopened.getByRole('region', { name: 'Login' });
  await expect(again.getByText('Decided: Approve', { exact: true })).toBeVisible();
  await again.getByRole('button', { name: 'Change decision' }).click();
  await expect(again.getByRole('button', { name: 'Approve' })).toHaveAttribute('aria-pressed', 'true');
});

test('the Stop button ends the server', async ({ page, request, url }) => {
  await page.getByRole('button', { name: 'Stop' }).click();

  await expect(page.getByText('Stopped. The walkthrough has stopped and your decisions are kept. You can close this tab.')).toBeVisible();
  await expect(page.getByRole('status', { name: 'Session' })).toHaveText('Stopped');
  await expect(page.getByRole('button', { name: 'Stop' })).toHaveCount(0);
  await expect(page.locator('#panes')).toHaveAttribute('inert', '');
  await expect(page.getByText('Preparing the steps')).toBeVisible();
  await expect(request.get(url)).rejects.toThrow();
});

// Started here rather than through `url`, whose check for console errors would catch the refused connection.
test('an action after the server stopped says how to reopen the walkthrough', async ({ page, repo }) => {
  repo.run('start');
  repo.record(ONE_STEP);
  await page.goto(repo.url());
  repo.run('stop');

  await page.getByRole('button', { name: 'Approve' }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'Could not reach the walkthrough. Run /walkthrough again to reopen it.Retry now',
  );
  await expect(page.locator('body')).toHaveClass(/unreachable/);

  const retry = page.getByRole('alert').getByRole('button', { name: 'Retry now' });
  await retry.focus();
  await retry.evaluate(button => Object.assign(button, { shown: true }));
  for (let polls = 0; polls < 2; polls++) await page.waitForEvent('requestfailed', failed => failed.url().includes('data/session.json'));

  await expect(retry).toBeFocused();
  expect(await retry.evaluate(button => 'shown' in button)).toBe(true);
});

test('a walkthrough of a range is headed by its label', async ({ page, repo }) => {
  const login = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login change'];
  expect(repo.run('start', ...login).status).toBe(0);
  try {
    await page.goto(repo.url());
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Login change');

    repo.record(ONE_STEP, 'steps', ...login);

    await expect(page.getByRole('region', { name: 'Login' })).toBeVisible();
  } finally {
    repo.run('stop', ...login);
  }
});

test('a request without the token is refused', async ({ request, url }) => {
  const { origin } = new URL(url);

  const approve = { item: { type: 'step', id: '1' }, action: 'approve' };
  expect((await request.post(`${origin}/decide`, { data: approve })).status()).toBe(404);
  expect((await request.get(`${origin}/s/${'0'.repeat(48)}/`)).status()).toBe(404);
});

test('a step shows read before the server stores it, and storing it neither redraws nor clears an alert', async ({
  page,
  repo,
  url,
}) => {
  await expect(page).toHaveURL(url);
  let release = () => {};
  const held = new Promise<void>(resolve => (release = resolve));
  await page.route('**/read?*', async route => {
    await held;
    await route.continue();
  });
  repo.record(ONE_STEP);
  const step = page.getByRole('region', { name: 'Login' });
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute(
    'aria-valuetext',
    '0 of 1 step decided, 1 left, 1 read',
  );
  const box = step.getByRole('textbox', { name: 'Ask about this step' });
  await box.fill('a'.repeat(4001));
  await box.press('Enter');
  await expect(page.getByRole('alert')).toBeVisible();
  const approve = await step.getByRole('button', { name: 'Approve' }).elementHandle();

  const stored = page.waitForResponse('**/read?*');
  release();
  await stored;
  // The page has long handled the answer by its next poll.
  await (await page.waitForRequest('**/data/walkthrough.json')).response();

  await expect(page.getByRole('alert')).toBeVisible();
  expect(await approve.evaluate(node => node.isConnected)).toBe(true);
});
