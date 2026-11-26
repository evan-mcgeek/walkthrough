import { expect, open, record, test } from './walkthrough';

const file = (...lines: string[]) => `${lines.join('\n')}\n`;
const PARSE = ['export function parseDue(value?: string): Date | null {', '  if (!value) return null;', '  return new Date(`${value}T00:00:00Z`);', '}'];
const FORMAT = ['export function formatDue(date: Date): string {', '  return date.toISOString().slice(0, 10);', '}'];
const COUNT = ['export function count(items: unknown[]) {', '  return items.filter(Boolean).length;', '}'];

test.use({
  start: {
    'api.ts': file(...PARSE, 'export const api = 1;'),
    'dates.ts': file('export const today = () => new Date();'),
    'format.ts': file(...FORMAT),
    'sum.ts': file('export const sum = 0;'),
  },
  files: {
    'api.ts': file('export const api = 1;'),
    'dates.ts': file('export const today = () => new Date();', ...PARSE, ...FORMAT),
    'sum.ts': file('export const sum = 0;', ...COUNT),
    'cart.ts': file(...COUNT, 'export const cart = [];'),
  },
});

const STEPS = [
  { title: 'Dates', explanation: 'Moves parsing next to formatting.', files: ['api.ts', 'dates.ts', 'sum.ts', 'login.ts', 'app.ts'] },
  { title: 'Cart', explanation: 'Counts the cart.', files: ['cart.ts'] },
];

test('copied code keeps its + under a row that links to where it comes from, or names it when the change does not show it', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  const dates = page.locator('.file[data-file="dates.ts"]');
  await expect(dates.locator('tr.moved-label')).toHaveText(['Moved from api.ts line 1', 'Copied from format.ts line 1']);
  await expect(dates.locator('tr.moved-label').nth(1).getByRole('button')).toHaveCount(0);
  const copied = dates.locator('tr:has(> td.d2h-ins)');
  await expect(copied.locator('.d2h-code-line-ctn')).toHaveText(FORMAT);
  await expect(copied.locator('.d2h-code-line-prefix')).toHaveText(['+', '+', '+']);
  await expect(page.locator('.file[data-file="dates.ts"] .file-stats')).toHaveText('+7 −0');

  await page.getByRole('link', { name: 'Cart' }).first().click();
  const cart = page.locator('.file[data-file="cart.ts"]');
  await cart.getByRole('button', { name: 'Copied from sum.ts line 2' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Dates' })).toBeVisible();
  const source = page.locator('.file[data-file="sum.ts"] tr[data-line="2"]');
  await expect(source).toHaveClass(/flash/);
  await expect(source).toBeInViewport();
});
