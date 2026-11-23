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
  // Away from the page first, whose polls would fail once its server stops.
  await page.goto('about:blank');
  repo.run('stop');
  repo.run('start', ...RANGE);
  repo.run('stop', ...RANGE);

  expect(repo.run('list').stdout).toContain('The list of walkthroughs is open in your browser.');
  await page.goto(repo.url());

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Walkthroughs');
  const rows = page.getByRole('row');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(1).getByRole('cell')).toHaveText(['Login change', 'range-Login%20change', 'Preparing', /\d/]);
  await expect(rows.nth(2).getByRole('cell')).toHaveText(['feature/login', 'branch-feature~login', '1 of 1 step decided, 1 read', /\d/]);

  await rows.nth(2).getByRole('button', { name: 'feature/login' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('feature/login');
  await expect(page.getByRole('region', { name: 'Login' }).getByText('Decided: Approve', { exact: true })).toBeVisible();
});

test('the Stop button ends the list', async ({ page, repo, url }) => {
  await expect(page).toHaveURL(url);
  repo.run('list');
  const list = repo.url();
  await page.goto(list);

  await page.getByRole('button', { name: 'Stop' }).click();

  await expect(page.getByText('The list has stopped. You can close this tab.')).toBeVisible();
  await expect(page.request.get(list)).rejects.toThrow();
});
