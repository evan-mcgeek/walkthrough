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

test('every rule that sets the code font turns ligatures off, so => and !== show as typed in any font of the stack', () => {
  const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, , body]) => /var\(--(font-mono|text-code)\)/.test(body ?? '') && !/--font-mono:/.test(body ?? ''));
  const missing = rules.filter(([, , body]) => !/font-variant-ligatures: none;/.test(body ?? '') || !/font-feature-settings: 'liga' 0, 'calt' 0;/.test(body ?? ''));

  expect(rules.length).toBeGreaterThan(10);
  expect(missing.map(([, selector]) => selector?.trim())).toEqual([]);
});

test('code is set in the self-hosted Geist Mono, then a local face sized to it, then the system stack', () => {
  expect(css).toContain(
    "--font-mono: 'Geist Mono', 'Geist Mono Fallback', 'Geist Mono Fallback Consolas', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;",
  );
  const faces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => body ?? '');
  const geist = faces.filter(face => face.includes("font-family: 'Geist Mono';"));
  expect(geist.map(face => /font-weight: (\d+)/.exec(face)?.[1])).toEqual(['400', '500', '600']);
  for (const face of geist) {
    expect(face).toContain('font-display: swap;');
    expect(face).toMatch(/src: url\('[./]+\/docs\/design\/fonts\/geist-mono-latin-\d00-normal\.woff2'\)/);
  }
  for (const face of faces.filter(one => !geist.includes(one))) expect(face).toMatch(/src: local\(.*size-adjust: [\d.]+%/s);
  expect(css).not.toMatch(/JetBrains|https?:\/\//);
});
