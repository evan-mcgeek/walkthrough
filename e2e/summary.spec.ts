import { ONE_STEP } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

test.describe('a pull request', () => {
  test.use({ args: ['--pr', '212', '--title', 'Due dates for tasks'] });

  test('Submit review sends one review with its type, summary and every pending comment, then says where it went', async ({ page, repo, url }) => {
    record(repo, ONE_STEP);
    const comment = /: ([0-9a-f]{8})\./.exec(repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Everyone gets in.' }], 'comment').stdout)?.[1];
    record(repo, [{ text: 'Only users log in', status: 'not-met', comment, missing: 'Anyone gets in.' }], 'criteria');
    await open(page, url);
    await expect(page.locator('.change-label')).toHaveText('#212 Due dates for tasks');
    await expect(page).toHaveTitle('#212 Due dates for tasks · Walkthrough');
    const listener = repo.background('listen');

    await page.getByRole('link', { name: 'Finish review' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Summary' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Finish review' })).toBeHidden();
    const going = page.locator('.going-row');
    await expect(going).toHaveCount(1);
    await expect(going).toContainText('login.ts:1');
    await expect(going).toContainText('[AI] Everyone gets in.');
    await expect(page.getByRole('link', { name: '2 files not viewed' })).toBeVisible();
    await expect(page.locator('.criterion')).toContainText(['Only users log in']);
    await expect(page.locator('.criterion-word')).toHaveText('Not met');

    await page.getByPlaceholder('Leave a comment').fill('One thing before this merges.');
    // Every control's edge is the control edge, 3:1 on every grey (decision 33).
    await expect(page.getByRole('radio', { name: 'Request changes' })).toHaveCSS('border-top-color', 'rgb(129, 139, 152)');
    await page.getByRole('radio', { name: 'Request changes' }).check();
    await expect(page.getByRole('radio', { name: 'Request changes' })).toBeChecked();
    await page.getByRole('button', { name: 'Submit review' }).click();

    await expect(page.getByText('Review submitted')).toBeVisible();
    await expect(page.getByText('Request changes, with 1 comment, on #212.')).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Sent/ })).toBeVisible();
    await expect(going.getByRole('button', { name: 'Delete' })).toHaveCount(0);
    await expect(page.locator('.ai-reviewing')).toHaveCount(0);

    const submit = JSON.parse((await listener.ended).stdout) as Record<string, unknown>;
    expect(submit).toMatchObject({ kind: 'submit', type: 'request-changes', summary: 'One thing before this merges.' });
    expect(repo.run('comments').stdout).toContain('"body":"[AI] Everyone gets in."');
    expect(repo.run('posted', '--address', 'https://example.test/review/7').status).toBe(0);
    await expect(page.getByRole('link', { name: 'View review' })).toHaveAttribute('href', 'https://example.test/review/7');
  });
});

test('acceptance criteria go gaps first, each with what shows it: the comment and what is missing, the reason, or the lines that meet it', async ({ page, repo, url }) => {
  record(repo, ONE_STEP);
  const commented = repo.record([{ file: 'login.ts', lines: [1, 1], body: 'Check the user before letting them in.' }, { file: 'app.ts', body: 'Name the app.' }], 'comment');
  const [onLine = '', onFile = ''] = /: ([0-9a-f]{8}), ([0-9a-f]{8})\./.exec(commented.stdout)?.slice(1) ?? [];
  record(
    repo,
    [
      { text: 'Exports the app', status: 'met', file: 'app.ts', lines: [1, 1] },
      { text: 'Names the app', status: 'partly', comment: onFile, missing: 'The app has no name.' },
      { text: 'Works offline', status: 'not-checked', reason: 'Needs the running app.' },
      { text: 'Only users log in', status: 'not-met', comment: onLine, missing: 'Anyone gets in.' },
    ],
    'criteria',
  );
  await open(page, url);
  await page.getByRole('link', { name: 'Finish review' }).click();

  const rows = page.locator('.criterion');
  await expect(rows).toHaveText([
    'Only users log inlogin.ts:1Anyone gets in.Not met',
    'Names the appapp.tsThe app has no name.Partly met',
    'Works offlineNeeds the running app.Not checked',
    'Exports the appapp.ts:1Met',
  ]);
  await expect(rows.nth(0).getByRole('link', { name: 'login.ts:1' })).toHaveAttribute('title', 'login.ts line 1: go to the comment');
  await expect(rows.nth(1).getByRole('link', { name: 'app.ts' })).toHaveAttribute('title', 'app.ts: go to the comment');
  const met = rows.nth(3).getByRole('link', { name: 'app.ts:1' });
  await expect(met).toHaveAttribute('title', 'app.ts line 1: go to the lines');

  // Opens the lines that meet it and flashes them, as Look at does.
  await met.click();
  await expect(page.locator('.file[data-file="app.ts"] tr[data-line="1"]')).toHaveClass(/flash/);
  await page.getByRole('link', { name: 'Finish review' }).click();
  await rows.nth(0).getByRole('link', { name: 'login.ts:1' }).click();
  await expect(page.locator(`.thread[data-thread="${onLine}"]`)).toBeInViewport();

  // A deleted comment takes its link with it; what is missing stays.
  await page.getByRole('link', { name: 'Finish review' }).click();
  await page.locator('.going-row').filter({ hasText: 'Check the user' }).getByRole('button', { name: 'Delete' }).click();
  await expect(rows.nth(0)).toHaveText('Only users log inAnyone gets in.Not met');

  // At 390 the status word moves under the text.
  await page.setViewportSize({ width: 390, height: 844 });
  const text = await rows.nth(0).locator('.criterion-text').boundingBox();
  const word = await rows.nth(0).locator('.criterion-word').boundingBox();
  expect(word?.y ?? 0).toBeGreaterThan(text?.y ?? 0);
  expect(word?.x).toBe(text?.x);
});
