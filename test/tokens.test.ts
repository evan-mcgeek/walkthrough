import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

const page = path.resolve(import.meta.dirname, '..', 'src', 'page');
const sheets = [path.join(page, 'style.css'), ...fs.readdirSync(path.join(page, 'styles')).map(file => path.join(page, 'styles', file))];
const css = sheets.map(file => fs.readFileSync(file, 'utf8')).join('\n');

test('every custom property the stylesheets use is defined, so a renamed token cannot leave a rule without its colour', () => {
  const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name));
  // A use with a fallback, such as a value the swipe deck sets while dragging, needs no definition.
  const used = new Set([...css.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map(([, name]) => name));

  expect([...used].filter(name => !defined.has(name))).toEqual([]);
});
