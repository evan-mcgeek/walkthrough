import { afterEach, expect, test } from 'vitest';
import { makeRepo, type Repo, viewAt } from './helpers';

let repo: Repo;
afterEach(async () => {
  repo.run('stop');
  await repo.settled();
});

const file = (...lines: string[]) => `${lines.join('\n')}\n`;
const TOTAL = ['export function total(items: number[]) {', '  return items.reduce((sum, item) => sum + item, 0);', '}'];
const PARSE = ['export function parseDue(value: string) {', '  return new Date(`${value}T00:00:00Z`);', '}'];
const COUNT = ['export function count(items: unknown[]) {', '  return items.filter(Boolean).length;', '}'];
const TINY = ['a();', 'b();', 'c();'];
const TWO = ['export const shippingCountries = loadCountries();', 'export const taxCountries = loadTaxCountries();'];

test('finds code copied from elsewhere at the head when the steps are recorded, never a move or a run under the thresholds', async () => {
  repo = makeRepo({
    start: { 'util.ts': file('// Helpers', ...TOTAL), 'old.ts': file(...PARSE, 'export const old = 1;'), 'keep.ts': file(...PARSE), 'tiny.ts': file(...TINY, ...TWO), 'sum.ts': file(...COUNT) },
    feature: { 'cart.ts': file('// Cart', ...TOTAL, 'export const cart = [];'), 'old.ts': file('export const old = 1;'), 'new.ts': file(...PARSE), 'tiny2.ts': file(...TINY), 'two.ts': file(...TWO), 'sum.ts': file(...COUNT, ...COUNT) },
  });
  repo.run('start');
  const all = ['app.ts', 'cart.ts', 'login.ts', 'new.ts', 'old.ts', 'sum.ts', 'tiny2.ts', 'two.ts'];
  expect(repo.record([{ title: 'All', explanation: 'Everything.', files: all }]).stderr).toBe('');

  const [step] = (await viewAt(repo.url())).steps;
  expect(step?.copies).toEqual([
    { from: { file: 'util.ts', line: 2 }, to: { file: 'cart.ts', line: 2 }, count: 3, inDiff: false },
    { from: { file: 'sum.ts', line: 1 }, to: { file: 'sum.ts', line: 4 }, count: 3, inDiff: true },
  ]);
});
