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
    'lib/sum.ts': file('export const sum = 0;'),
  },
  files: {
    'api.ts': file('export const api = 1;'),
    'dates.ts': file('export const today = () => new Date();', ...PARSE, ...FORMAT, 'export const later = 1;'),
    'lib/sum.ts': file('export const sum = 0;', ...COUNT),
    'cart.ts': file(...COUNT, 'export const cart = [];'),
  },
});

const STEPS = [
  { title: 'Dates', explanation: 'Moves parsing next to formatting.', files: ['api.ts', 'dates.ts', 'lib/sum.ts', 'login.ts', 'app.ts'] },
  { title: 'Cart', explanation: 'Counts the cart.', files: ['cart.ts'] },
];

test('copied code keeps its + under a row that links to where it comes from, or names it when the change does not show it', async ({ page, repo, url }) => {
  record(repo, STEPS);
  await open(page, url);

  const dates = page.locator('.file[data-file="dates.ts"]');
  await expect(dates.locator('tr.moved-label')).toHaveText(['Moved from api.ts lines 1–4', 'Copied from format.ts lines 1–3']);
  await expect(dates.locator('tr.moved-label').nth(1).getByRole('button')).toHaveCount(0);
  const added = dates.locator('tr:has(> td.d2h-ins)');
  await expect(added.locator('.d2h-code-line-ctn')).toHaveText([...FORMAT, 'export const later = 1;']);
  await expect(added.locator('.d2h-code-line-prefix')).toHaveText(['+', '+', '+', '+']);
  await expect(page.locator('.file[data-file="dates.ts"] .file-stats')).toHaveText('+8 −0');
  // The rule runs from the label down the copy and turns under its last line, so the next addition is outside it.
  const rule = (row: number) =>
    added.nth(row).locator('> td:not(.d2h-code-linenumber)').evaluate(cell => [getComputedStyle(cell).boxShadow !== 'none', getComputedStyle(cell).backgroundImage !== 'none']);
  expect(await rule(1)).toEqual([true, false]);
  expect(await rule(2)).toEqual([true, true]);
  expect(await rule(3)).toEqual([false, false]);

  await page.getByRole('link', { name: 'Cart' }).first().click();
  const cart = page.locator('.file[data-file="cart.ts"]');
  const label = cart.locator('tr.moved-label button');
  await expect(label).toHaveAccessibleName('Copied from lib/sum.ts lines 2–4');
  await expect(label).toHaveAttribute('title', 'Copied from lib/sum.ts lines 2–4');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await label.evaluate(button => (button as HTMLElement).innerText)).toBe('Copied from sum.ts lines 2–4');
  await page.setViewportSize({ width: 1280, height: 720 });
  await label.click();
  await expect(page.getByRole('heading', { level: 1, name: 'Dates' })).toBeVisible();
  const source = page.locator('.file[data-file="lib/sum.ts"] tr[data-line="2"]');
  await expect(source).toHaveClass(/flash/);
  await expect(source).toBeInViewport();
});
