import type { Page } from '@playwright/test';
import { expect, test } from './walkthrough';

test.use({ files: { 'cart.ts': 'export const cart = [];\n' } });

const progress = (page: Page) => page.getByRole('progressbar', { name: 'Steps decided' });
const segments = (page: Page) =>
  progress(page).locator('[data-state]').evaluateAll(all => all.map(one => one.getAttribute('data-state')));

test('the progress bar has a segment per step coloured by its state, marks where the person is, and says the step and the count', async ({
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
  await expect(page.getByText('Step 1 of 3 · 0 decided', { exact: true })).toBeVisible();
  expect(await segments(page)).toEqual(['cur', 'un', 'un']);
  await expect(progress(page).locator('[data-state]').nth(1)).toHaveAttribute('title', '2 App version: not decided yet');
  await expect(progress(page).locator('[data-state]').nth(0)).toHaveAttribute('title', '1 Login check: you are here');

  await page.getByRole('region', { name: 'Login check' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('region', { name: 'App version' })).toBeVisible();
  await expect(progress(page)).toHaveAttribute('aria-valuetext', '1 of 3 steps decided, 2 left, 2 read');
  await expect(page.getByText('Step 2 of 3 · 1 decided', { exact: true })).toBeVisible();
  expect(await segments(page)).toEqual(['ok', 'cur', 'un']);
  await expect(progress(page).locator('[data-state]').nth(0)).toHaveAttribute('title', '1 Login check: Approve, decided');

  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(progress(page)).toHaveAttribute('aria-valuetext', '1 of 3 steps decided, 2 left, 3 read');
  expect(await segments(page)).toEqual(['ok', 'un', 'cur']);

  // A decided step read again is still where the person is: the ink marker, taller, sits on it; reduced motion puts it there at once.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('k');
  await page.keyboard.press('k');
  await expect(page.getByRole('region', { name: 'Login check' })).toBeVisible();
  expect(await segments(page)).toEqual(['cur', 'un', 'un']);
  const current = progress(page).locator('[data-state="cur"]');
  const marker = progress(page).locator('.progress-marker');
  await expect(marker).toHaveCSS('height', '9px');
  await expect(current).toHaveCSS('height', '5px');
  const [on, under] = await Promise.all([marker.boundingBox(), current.boundingBox()]);
  expect(Math.round(on?.x ?? 0)).toBe(Math.round(under?.x ?? -1));
  expect(Math.round(on?.width ?? 0)).toBe(Math.round(under?.width ?? -1));
  expect(await marker.evaluate(one => getComputedStyle(one).backgroundColor)).toBe(
    await page.evaluate(() => {
      const probe = document.body.appendChild(document.createElement('span'));
      probe.style.color = 'var(--ink)';
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    }),
  );

  await page.keyboard.press('g');
  await page.keyboard.press('s');
  await expect(page.getByText('Summary · 1 decided', { exact: true })).toBeVisible();
  expect(await segments(page)).toEqual(['ok', 'un', 'un']);
  // On the Summary no step is where the person is, so the marker fades out.
  await expect(marker).toHaveClass(/\baway\b/);
});

const tokenColor = (page: Page, token: string) =>
  page.evaluate(name => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = `var(${name})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, token);

test('the bar and To review draw one traffic-light set: green for a positive decision, hatched amber for a flag or an open finding, grey for a decision with no tone', async ({
  page,
  repo,
  url,
}) => {
  await expect(page).toHaveURL(url);
  repo.record([
    { title: 'Login check', explanation: 'Adds a login function.', files: ['login.ts'] },
    { title: 'App version', explanation: 'Bumps the app constant.', files: ['app.ts'] },
    { title: 'Cart', explanation: 'Adds a cart.', files: ['cart.ts'] },
  ]);
  repo.record([{ item: { type: 'step', id: '3' }, actions: [{ id: 'noted', label: 'Noted' }] }], 'actions');
  repo.record([{ step: '2', label: 'Finding', text: 'The version is not shown anywhere.', finding: true }], 'note');
  const send = (body: unknown) => page.request.post(new URL(`/decide?token=${new URL(url).pathname.split('/')[2] ?? ''}`, url).href, { data: body });
  expect((await send({ item: { type: 'step', id: '1' }, action: 'approve' })).status()).toBe(200);
  expect((await send({ item: { type: 'step', id: '3' }, action: 'noted' })).status()).toBe(200);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${url}#summary`);
  await expect.poll(() => segments(page)).toEqual(['ok', 'find', 'neu']);

  const fill = (at: number) =>
    progress(page)
      .locator('.segment')
      .nth(at)
      .evaluate(one => {
        const after = getComputedStyle(one, '::after');
        return { color: after.backgroundColor, image: after.backgroundImage, edge: after.boxShadow, track: getComputedStyle(one).backgroundColor };
      });
  expect(await fill(0)).toMatchObject({ color: await tokenColor(page, '--ok'), image: 'none', edge: 'none' });
  expect((await fill(1)).image).toMatch(/^repeating-linear-gradient\(135deg/);
  // A decision with no tone is outlined with no fill, so it reads apart from green in greyscale.
  expect(await fill(2)).toEqual({ color: 'rgba(0, 0, 0, 0)', image: 'none', edge: `${await tokenColor(page, '--neu')} 0px 0px 0px 1.5px inset`, track: 'rgba(0, 0, 0, 0)' });
  await expect(progress(page).locator('.segment').nth(1)).toHaveAttribute('title', '2 App version: 1 open finding, needs you');

  const rail = page.getByRole('navigation', { name: 'To review' });
  const open = rail.getByRole('link', { name: 'App version' });
  await expect(open).toHaveAttribute('data-state', 'find');
  await expect(open.locator('svg').first()).toHaveCSS('color', await tokenColor(page, '--amber'));
  await rail.locator('[data-key="decided-toggle"]').click();
  const approved = rail.getByRole('link', { name: 'Login check' });
  await expect(approved.locator('svg').first()).toHaveCSS('color', await tokenColor(page, '--ok'));
  await expect(approved.locator('.queue-sub')).toHaveText('Approve');
  await expect(approved.locator('.queue-sub')).toHaveCSS('color', await tokenColor(page, '--ok'));
  const noted = rail.getByRole('link', { name: 'Cart' });
  await expect(noted.locator('svg').first()).toHaveCSS('color', await tokenColor(page, '--neu'));
  await expect(noted.locator('.queue-sub')).toHaveCSS('color', await tokenColor(page, '--muted'));
  for (const link of [approved, noted]) await expect(link.locator('svg').first()).not.toHaveCSS('color', await tokenColor(page, '--accent'));
  await approved.click();
  await expect(page.getByRole('region', { name: 'Login check' }).getByText('Decided: Approve', { exact: true })).toHaveCSS('color', await tokenColor(page, '--ok'));
});

test('the session status shows its state with a dot, or a spinning icon while the session works, Listening in secondary ink', async ({
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
  // Green means a positive decision, so Listening is in secondary ink.
  await expect(status).toHaveCSS('color', await tokenColor(page, '--ink-secondary'));

  listener.child.kill('SIGTERM');
  await expect(status).toHaveAttribute('data-state', 'gone');
  await expect(status).toHaveText('Gone');
  await expect(status.locator('.dot')).toHaveCount(1);

  repo.run('say', '--question', 'Is the login meant to accept everyone?');
  await expect(status).toHaveAttribute('data-state', 'needs-you');
  await expect(status).toHaveText('Needs you');
  await expect(status.locator('.dot')).toHaveCount(1);
});

test('the header names the walkthrough and its range, and End session stays at hand after the muted Session status', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const label = page.getByRole('heading', { level: 1 });
  await expect(label).toHaveText('feature/login');
  const range = `${repo.base.slice(0, 7)}..${repo.head.slice(0, 7)}`;
  await expect(label).toHaveAttribute('title', new RegExp(`^against \\S*main, ${range}$`));
  await expect(page.getByRole('banner').getByRole('button', { name: 'End session' })).toBeVisible();
  const prefix = page.getByRole('banner').getByText('Session', { exact: true });
  await expect(prefix).toBeVisible();
  const [said, status] = await Promise.all([prefix.boundingBox(), page.getByRole('status', { name: 'Session' }).boundingBox()]);
  expect(said && status && said.x + said.width < status.x).toBe(true);
});

test('the header shows the kind the session gave the walkthrough beside its name, in muted ink', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  const kind = page.getByRole('banner').locator('.kind');
  await expect(kind).toHaveCount(0);

  repo.run('start', '--kind', 'requested');

  await expect(kind).toHaveText('requested');
  await expect(kind).toHaveAttribute('title', 'The kind of walkthrough');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  const muted = await page.evaluate(() => {
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.color = 'var(--muted)';
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  });
  expect(await kind.evaluate(one => getComputedStyle(one).color)).toBe(muted);
});

test('at phone width the kind takes the name’s place beside the logo, on one row with the session status and More', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  await page.setViewportSize({ width: 390, height: 844 });
  repo.run('start', '--kind', 'Your change');
  const banner = page.getByRole('banner');
  const kind = banner.locator('.kind');
  await expect(kind).toHaveText('Your change');

  const [logo, shown, more] = await Promise.all([banner.locator('.logo').boundingBox(), kind.boundingBox(), banner.getByRole('button', { name: 'More' }).boundingBox()]);
  expect(shown && logo && shown.x > logo.x + logo.width).toBe(true);
  expect(more && shown && Math.abs(more.y + more.height / 2 - (shown.y + shown.height / 2))).toBeLessThan(2);
  await expect(page.getByRole('heading', { level: 1, name: 'feature/login' })).toBeAttached();
  // Kept for screen readers, drawn in no space.
  expect((await banner.locator('.session-label').boundingBox())?.width).toBeLessThanOrEqual(1);
});

test('the header signs the page with the mark, and the server serves its favicon and app icon', async ({ page, url }) => {
  await expect(page).toHaveURL(url);
  const logo = page.getByRole('banner').locator('.logo');
  await expect(logo).toHaveText('Walkthrough');
  await expect(logo.locator('svg.icon-mark')).toBeVisible();
  for (const [rel, type] of [
    ['icon', 'image/svg+xml'],
    ['apple-touch-icon', 'image/png'],
  ] as const) {
    const href = await page.locator(`link[rel="${rel}"]`).getAttribute('href');
    const answer = await page.request.get(new URL(href ?? '', url).href);
    expect(answer.status()).toBe(200);
    expect(answer.headers()['content-type']).toBe(type);
  }
});
