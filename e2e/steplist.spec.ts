import { expect, lines, open, record, test } from './walkthrough';

test.use({ files: { 'tasks.ts': lines(80, 'task'), 'dates.ts': lines(20, 'date') } });

const STEPS = [
  { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] },
  { title: 'Tasks', explanation: 'Adds tasks.', files: ['tasks.ts', 'dates.ts'] },
];
const COMMENTS = [
  { file: 'tasks.ts', lines: [70, 70], body: 'Late in the file.' },
  { file: 'tasks.ts', lines: [40, 40], body: 'The first one down the file.' },
];

const stepOf = (page: import('@playwright/test').Page, title: string) => page.locator('.step-item', { has: page.getByRole('link', { name: title, exact: false }) });

test('the step you are on is open and the others fold to how much is viewed; a chevron folds or opens a step without moving you', async ({ page, repo, url }) => {
  await page.setViewportSize({ width: 1280, height: 360 });
  record(repo, STEPS);
  record(repo, COMMENTS, 'comment');
  await open(page, url);

  const login = page.locator('.step-item').nth(0);
  const tasks = page.locator('.step-item').nth(1);
  await expect(login.getByRole('button', { name: 'Hide files' })).toHaveAttribute('aria-expanded', 'true');
  await expect(login.locator('.file-row')).toHaveCount(2);
  await expect(login.getByRole('link', { name: 'login.ts', exact: true })).toBeVisible();
  const show = tasks.getByRole('button', { name: 'Show files' });
  await expect(show).toHaveAttribute('aria-expanded', 'false');
  await expect(show).toHaveAttribute('title', 'Show files');
  await expect(tasks.locator('.step-meta')).toHaveText('2 files2');
  await expect(tasks.locator('.step-meta .file-count')).toHaveAttribute('title', '2 comments');
  await expect(tasks.getByRole('link', { name: 'tasks.ts', exact: true })).toBeHidden();

  const scrolled = await page.locator('.main').evaluate(main => {
    main.scrollTop = 40;
    return main.scrollTop;
  });
  expect(scrolled).toBe(40);
  await show.click();
  await expect(tasks.getByRole('button', { name: 'Hide files' })).toHaveAttribute('aria-expanded', 'true');
  await expect(tasks.getByRole('link', { name: 'tasks.ts', exact: true })).toBeVisible();
  await expect(tasks.locator('.step-meta')).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeVisible();
  expect(await page.locator('.main').evaluate(main => main.scrollTop)).toBe(40);
  await tasks.getByRole('checkbox', { name: 'Viewed' }).first().click();
  await tasks.getByRole('button', { name: 'Hide files' }).click();
  await expect(tasks.locator('.step-meta')).toHaveText('1 of 2 viewed2');

  // The title goes to the step and opens it; the step left behind folds, as its chevron never opened it.
  await tasks.locator('.step-row').click();
  await expect(page.getByRole('heading', { level: 1, name: 'Tasks' })).toBeVisible();
  await expect(tasks.getByRole('button', { name: 'Hide files' })).toBeVisible();
  await expect(login.getByRole('button', { name: 'Show files' })).toBeVisible();
  await expect(login.locator('.step-meta')).toHaveText('2 files');

  // A step opened by its chevron stays open after you leave it.
  await login.getByRole('button', { name: 'Show files' }).click();
  await login.locator('.step-row').click();
  await tasks.locator('.step-row').click();
  await expect(login.getByRole('button', { name: 'Hide files' })).toBeVisible();
});

test('a file row is a Viewed checkbox shared with the file header and V, a link to the file and a link to its first comment', async ({ page, repo, url }) => {
  record(repo, STEPS);
  record(repo, COMMENTS, 'comment');
  await open(page, url);
  await page.getByRole('link', { name: 'Tasks', exact: true }).click();

  const row = page.locator('.file-row[data-file="tasks.ts"]');
  const mark = row.getByRole('checkbox', { name: 'Viewed' });
  const header = page.locator('.file[data-file="tasks.ts"]').getByRole('checkbox', { name: 'Viewed' });
  await expect(mark).toHaveAccessibleDescription('tasks.ts');
  await expect(mark).toHaveAttribute('title', 'Viewed');
  await expect(row.getByRole('link', { name: 'tasks.ts', exact: true })).toHaveAttribute('title', 'tasks.ts');
  const count = row.getByRole('link', { name: '2 comments on tasks.ts: go to the first' });
  await expect(count).toHaveAttribute('title', '2 comments: go to the first');
  await expect(page.locator('.file-row[data-file="dates.ts"] .file-count')).toBeHidden();

  await mark.click();
  await expect(mark).toHaveAttribute('aria-checked', 'true');
  await expect(header).toBeChecked();
  await expect(page.locator('.file[data-file="tasks.ts"]')).toHaveClass(/closed/);
  await expect(page.locator('.files-viewed')).toContainText('1 / 4 files viewed');
  await header.click();
  await expect(mark).toHaveAttribute('aria-checked', 'false');
  await mark.focus();
  await page.keyboard.press('Space');
  await expect(header).toBeChecked();
  await mark.click();
  await expect(header).not.toBeChecked();

  // The count opens the first comment down the file, whatever order the comments came in.
  await count.click();
  await expect(page.locator('.comment', { hasText: 'The first one down the file.' })).toBeInViewport();

  await page.keyboard.press('j');
  await expect(page.locator('.file.on')).toHaveAttribute('data-file', 'tasks.ts');
  await page.keyboard.press('v');
  await expect(mark).toHaveAttribute('aria-checked', 'true');
  await expect(header).toBeChecked();

  await page.locator('.main').evaluate(main => {
    main.scrollTop = main.scrollHeight;
  });
  await page.locator('.file-row[data-file="dates.ts"]').getByRole('link', { name: 'dates.ts', exact: true }).click();
  await expect(page.locator('.file[data-file="dates.ts"]')).toBeInViewport();
});

test('the step list resizes by its right edge between 200 and 400px, and double-click puts it back at 248px', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  const nav = page.locator('#nav');
  const edge = page.getByRole('separator', { name: 'Resize the step list' });
  const width = () => nav.evaluate(element => element.getBoundingClientRect().width);
  await expect(edge).toHaveAttribute('title', 'Resize the step list');
  await expect(edge).toHaveAttribute('aria-valuenow', '248');
  await expect(edge).toHaveAttribute('aria-valuemin', '200');
  await expect(edge).toHaveAttribute('aria-valuemax', '400');
  expect(await width()).toBe(248);

  await edge.focus();
  await page.keyboard.press('ArrowRight');
  await expect(edge).toHaveAttribute('aria-valuenow', '264');
  expect(await width()).toBe(264);
  for (let press = 0; press < 6; press++) await page.keyboard.press('ArrowLeft');
  await expect(edge).toHaveAttribute('aria-valuenow', '200');

  const box = await edge.boundingBox();
  if (!box) throw new Error('no edge');
  await page.mouse.move(box.x + 4, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(330, box.y + 100, { steps: 4 });
  await expect(edge).toHaveAttribute('aria-valuenow', '330');
  await page.mouse.move(700, box.y + 100, { steps: 4 });
  await page.mouse.up();
  await expect(edge).toHaveAttribute('aria-valuenow', '400');
  expect(await width()).toBe(400);

  await edge.dblclick();
  await expect(edge).toHaveAttribute('aria-valuenow', '248');
  expect(await width()).toBe(248);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(edge).toBeHidden();
});

test.describe('with many steps', () => {
  const names = Array.from({ length: 12 }, (_, at) => `part${String(at + 1)}.ts`);
  test.use({ files: Object.fromEntries(names.map(name => [name, lines(3)])) });

  test('the Summary stays pinned to the foot of a long step list while it scrolls', async ({ page, repo, url }) => {
    await page.setViewportSize({ width: 1280, height: 400 });
    record(repo, [
      { title: 'Login', explanation: 'Adds login.', files: ['login.ts', 'app.ts'] },
      ...names.map(name => ({ title: `Add ${name}`, explanation: 'One part.', files: [name] })),
    ]);
    await open(page, url);

    const nav = page.locator('#nav');
    const summary = page.locator('.summary-row');
    const gap = () => Promise.all([nav.evaluate(element => element.getBoundingClientRect().bottom), summary.evaluate(element => element.getBoundingClientRect().bottom)]).then(([a, b]) => a - b);
    expect(await nav.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
    await expect(summary).toBeInViewport();
    const before = await gap();
    expect(before).toBeLessThanOrEqual(16);
    await nav.evaluate(element => {
      element.scrollTop = element.scrollHeight / 2;
    });
    await expect(summary).toBeInViewport();
    expect(await gap()).toBe(before);
  });
});

test.describe('at 390', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the drawer’s chevrons and every part of a file row are 44px targets, the mark 40px wide', async ({ page, repo, url }) => {
    record(repo, STEPS);
    record(repo, COMMENTS, 'comment');
    await open(page, url);
    await page.getByRole('button', { name: 'Steps and files' }).click();
    await stepOf(page, 'Tasks').getByRole('button', { name: 'Show files' }).click();

    const row = page.locator('.file-row[data-file="tasks.ts"]');
    const sizes = await row.locator('> *').evaluateAll(parts => parts.map(part => [Math.round(part.getBoundingClientRect().width), Math.round(part.getBoundingClientRect().height)]));
    expect(sizes[0]).toEqual([40, 44]);
    expect(sizes.every(([, height]) => height === 44)).toBe(true);
    const chevron = await stepOf(page, 'Tasks').getByRole('button', { name: 'Hide files' }).boundingBox();
    expect([chevron?.width, chevron?.height]).toEqual([44, 44]);
    await expect(page.getByRole('heading', { level: 1, name: 'Login' })).toBeAttached();
  });
});
