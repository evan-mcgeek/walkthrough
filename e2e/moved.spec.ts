import { git, postTo } from '../test/helpers';
import { expect, open, record, test } from './walkthrough';

const PARSE = ['export function parseDue(value?: string): Date | null {', '  if (!value) return null;', '  return new Date(`${value}T00:00:00Z`);', '}'];
const FIRST = ['export function first(items: string[]) {', '  const [head] = items;', '  return head ?? null;', '}'];
const REST = Array.from({ length: 10 }, (_, at) => `export const item${String(at + 1)} = ${String(at + 1)};`);
const file = (...lines: string[]) => `${lines.join('\n')}\n`;
const TRIMMED = ['export const alpha = 1;', 'export const beta = 2;', 'export const gamma = 3;'];

test.use({
  start: {
    'api.ts': file("import { isDate } from './dates';", ...PARSE, 'export const api = 1;'),
    'dates.ts': file('export const isDate = (value: string) => /^\\d{4}-\\d{2}-\\d{2}$/.test(value);'),
    'list.ts': file(...FIRST, ...REST),
    'trim.ts': file(...TRIMMED.map(line => `${line}   `)),
  },
  files: {
    'api.ts': file("import { isDate } from './dates';", 'export const api = 1;'),
    'dates.ts': file('export const isDate = (value: string) => /^\\d{4}-\\d{2}-\\d{2}$/.test(value);', ...PARSE),
    'list.ts': file(...REST, ...FIRST),
    'trim.ts': file(...TRIMMED),
  },
});

const STEPS = [
  { title: 'API', explanation: 'Moves parsing out.', files: ['api.ts', 'login.ts', 'app.ts', 'trim.ts'] },
  { title: 'Dates', explanation: 'Parses dates.', files: ['dates.ts', 'list.ts'] },
];

test('moved code shows once where it arrives, and each end links to the other', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await postTo(url, '/comment', { file: 'dates.ts', lines: [3, 3], text: 'Null or throw?' });
  await open(page, url);

  const api = page.locator('.file[data-file="api.ts"]');
  const left = api.locator('tr.moved-label');
  await expect(left).toHaveText(/2\s*4 lines moved to dates\.ts line 2/);
  await expect(left.locator('[role="button"]')).toHaveCount(0);
  await expect(api.locator('.d2h-del')).toHaveCount(0);
  // The counts are git's, moves included.
  const numstat = git(repo.dir, 'diff', '--numstat', 'main...HEAD', '--', 'api.ts');
  expect(numstat.split('\t').slice(0, 2)).toEqual(['0', '4']);
  await expect(api.locator('.file-stats')).toHaveText('+0 −4');
  // Lines edited in place are no move, even when only their trailing whitespace changed.
  const trim = page.locator('.file[data-file="trim.ts"]');
  await expect(trim.locator('.d2h-del .d2h-code-line-ctn')).toHaveText(TRIMMED);
  await expect(trim.locator('.d2h-ins .d2h-code-line-ctn')).toHaveText(TRIMMED);
  await expect(trim.locator('tr.moved, tr.moved-label')).toHaveCount(0);

  await left.getByRole('button').click();
  await expect(page.getByRole('heading', { level: 1, name: 'Dates' })).toBeVisible();
  const dates = page.locator('.file[data-file="dates.ts"]');
  await expect(dates.locator('tr.moved-label')).toHaveText('Moved from api.ts lines 2–5');
  const arrived = dates.locator('tr.moved');
  await expect(arrived.locator('.d2h-code-line-ctn')).toHaveText(PARSE);
  await expect(arrived.locator('.d2h-code-line-prefix')).toHaveText([' ', ' ', ' ', ' ']);
  await expect(arrived.first()).toHaveClass(/flash/);
  await expect(arrived.first()).toBeInViewport();
  await expect(dates.locator('.d2h-ins')).toHaveCount(0);
  // The arriving lines are the head's lines, so they take comments and threads.
  await expect(dates.locator('tr.moved[data-line="3"] + tr.thread-row')).toContainText('Null or throw?');
  await dates.getByRole('button', { name: 'Comment on line 4' }).click();
  await expect(dates.locator('tr.moved[data-line="4"] + tr.composer-line textarea')).toBeFocused();
  await page.keyboard.press('Escape');

  await dates.locator('tr.moved-label').getByRole('button').click();
  await expect(page.getByRole('heading', { level: 1, name: 'API' })).toBeVisible();
  await expect(left).toHaveClass(/flash/);
  await expect(left).toBeInViewport();

  await page.getByRole('link', { name: 'Dates' }).first().click();
  const list = page.locator('.file[data-file="list.ts"]');
  await expect(list.locator('tr.moved-label')).toHaveText([/1\s*4 lines moved to line 11/, 'Moved from lines 1–4']);
  await expect(list.locator('.d2h-ins, .d2h-del')).toHaveCount(0);
  await list.getByRole('button', { name: 'Moved from lines 1–4' }).click();
  await expect(list.locator('tr.moved-label').first()).toHaveClass(/flash/);
});
