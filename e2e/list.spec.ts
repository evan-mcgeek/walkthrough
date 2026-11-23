import { ONE_STEP } from '../test/helpers';
import { expect, test } from './walkthrough';

const RANGE = ['--base', 'origin/main', '--head', 'feature/login', '--label', 'Login change'];

test.afterEach(({ repo }) => {
  repo.run('stop', '--list');
  repo.run('stop', ...RANGE);
});

test('the list shows every walkthrough of the repo with its progress and opens one', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByRole('progressbar', { name: 'Steps decided' })).toHaveAttribute(
    'aria-valuetext',
    '1 of 1 step decided, 0 left, 1 read',
  );
  repo.record([{ item: { type: 'verdict' }, actions: [{ id: 'fixes', label: 'Needs fixes' }] }], 'actions');
  await page.getByRole('radio', { name: 'Needs fixes' }).click();
  await expect(page.getByRole('banner').getByTitle('Your verdict')).toHaveText('Needs fixes');
  // Away from the page first, whose polls would fail once its server stops.
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('start', ...RANGE, '--kind', 'requested');
  repo.run('stop', ...RANGE);

  expect(repo.run('list').stdout).toContain('The list of walkthroughs is open in your browser.');
  await page.goto(repo.url());

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Walkthroughs');
  await expect(page.getByRole('banner')).toContainText('shop');
  await expect(page.getByRole('banner').locator('.logo svg.icon-mark')).toBeVisible();
  const icon = await page.request.get(new URL((await page.locator('link[rel="icon"]').getAttribute('href')) ?? '', repo.url()).href);
  expect(icon.headers()['content-type']).toBe('image/svg+xml');
  await expect(page.getByRole('columnheader')).toHaveText(['Walkthrough', 'Progress', 'Verdict', 'Last activity']);
  const rows = page.getByRole('row');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(1).getByRole('cell')).toHaveText(['Login changerequestedrange-Login%20change', 'Preparing', 'No verdict yet', /now|ago/]);
  await expect(rows.nth(1).locator('.kind')).toHaveAttribute('title', 'The kind of walkthrough');
  await expect(rows.nth(2).locator('.kind')).toHaveCount(0);
  await expect(rows.nth(2).getByRole('cell')).toHaveText(['feature/loginbranch-feature~login', '1 of 1 step decided, 1 read', 'Needs fixes', /now|ago/]);
  // A decided segment is filled in the accent, as the mark is.
  const accent = await page.locator('.logo .icon-mark').evaluate(mark => getComputedStyle(mark).color);
  const decided = rows.nth(2).locator('.segment[data-state="decided"]');
  expect(await decided.evaluate(one => getComputedStyle(one.firstElementChild ?? one).backgroundColor)).toBe(accent);
  // The full time stays at hand behind the relative one.
  await expect(rows.nth(2).locator('time')).toHaveAttribute('datetime', /^\d{4}-\d\d-\d\dT/);

  await rows.nth(2).getByRole('button', { name: 'feature/login' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  await expect(page.getByRole('region', { name: 'Decided' }).getByRole('row')).toHaveText(['Approve1 Login1']);
});

test('the Stop button ends the list', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.run('list');
  const list = repo.url();
  await page.goto(list);

  await page.getByRole('button', { name: 'Stop' }).click();

  await expect(page.getByText('The list has stopped. You can close this tab.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Stop' })).toHaveCount(0);
  await expect(page.request.get(list)).rejects.toThrow();
});

// Opened here rather than through `url`, whose check for console errors would catch the failed poll.
test('the list clears its unreachable banner once the server answers again', async ({ page, repo }) => {
  repo.run('list');
  let failing = false;
  await page.route('**/data/list.json', route => (failing ? route.abort() : route.continue()));
  await page.clock.install();
  await page.goto(repo.url());
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Walkthroughs');

  failing = true;
  await page.clock.runFor(5000);
  await expect(page.getByRole('alert')).toContainText('Could not reach the list.');
  failing = false;
  await page.clock.runFor(5000);

  await expect(page.getByRole('alert')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/unreachable/);
});

test('at phone width a walkthrough keeps its name on one line beside its activity, and its cells stay a table', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.record(ONE_STEP);
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('list');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(repo.url());

  const row = page.getByRole('row').nth(1);
  await expect(row.getByRole('cell')).toHaveText(['feature/loginbranch-feature~login', '0 of 1 step decided, 0 read', 'No verdict yet', /now|ago/]);
  expect((await row.getByRole('button', { name: 'feature/login' }).boundingBox())?.height).toBeLessThan(24);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
