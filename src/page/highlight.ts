// Syntax colours, put on code the page already drew: diff rows by side and line number, and Markdown code blocks by their language.
import type { DiffFile } from 'diff2html/lib-esm/types';
import { colourHtml, joinLines, PLAIN, ruleFor, type Run } from '../colours';
import { postQuietly } from './dom';

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
const ruled = new Set<string>();

function paint(element: HTMLElement, runs: Run[] | undefined): void {
  // Painted once, so drawing a box again does not wrap its spans twice.
  if ('coloured' in element.dataset) return;
  const coloured = runs && colourHtml(element.innerHTML, runs);
  if (!runs || !coloured) return;
  element.dataset['coloured'] = '';
  for (const [, key] of runs) {
    const rule = ruled.has(key) ? null : ruleFor(key);
    if (rule) sheet.insertRule(rule, sheet.cssRules.length);
    ruled.add(key);
  }
  // Only spans with a checked class name are added to what diff2html or markdown-it escaped.
  element.innerHTML = coloured;
}

const lines = async (answer: Promise<Response | null>): Promise<Run[][] | null> => {
  const response = await answer;
  const body = response?.ok ? ((await response.json()) as Run[][] | typeof PLAIN) : PLAIN;
  return body === PLAIN ? null : body;
};

const asked = new Map<string, Promise<Run[][] | null>>();
const once = (key: string, ask: () => Promise<Run[][] | null>) => {
  let found = asked.get(key);
  if (!found) {
    found = ask().catch(() => null);
    asked.set(key, found);
  }
  return found;
};

const code = (body: Record<string, string>) => once(JSON.stringify(body), () => lines(postQuietly('code', body)));

const fileAt = (rev: string, file: string) =>
  once(`${rev}:${file}`, () => lines(fetch(`tokens?rev=${encodeURIComponent(rev)}&path=${encodeURIComponent(file)}`).catch(() => null)));

/** Colours a file's diff table once its tokens arrive: removed lines from the base, the rest, moved and copied lines too, from the head. */
export function colourDiff(table: Element, file: DiffFile, revs: { base: string | undefined; head: string }): void {
  const side = async (removed: boolean) => {
    const rev = removed ? revs.base : revs.head;
    if (!rev || (removed ? file.isNew : file.isDeleted)) return;
    const tokens = await fileAt(rev, removed ? file.oldName : file.newName);
    if (!tokens) return;
    for (const row of table.querySelectorAll('tr')) {
      if (!!row.querySelector('td.d2h-del') !== removed) continue;
      const line = Number(row.querySelector(removed ? '.line-num1' : '.line-num2')?.textContent.trim());
      const cell = row.querySelector<HTMLElement>('.d2h-code-line-ctn');
      if (line && cell) paint(cell, tokens[line - 1]);
    }
  };
  void side(true);
  void side(false);
}

/** Colours the code blocks in rendered Markdown whose fence names a language. */
export function colourCode(box: Element): void {
  for (const block of box.querySelectorAll<HTMLElement>('pre > code[class*="language-"]')) {
    const language = /(?:^|\s)language-(\S+)/.exec(block.className)?.[1];
    if (language)
      void code({ language, code: block.textContent }).then(tokens => {
        if (tokens) paint(block, joinLines(tokens));
      });
  }
}

/** Colours suggested changes on a file: the lines they replace as they stand at the head, the lines they add in the file's language. */
export function colourSuggestions(box: Element, file: string, head: string): void {
  for (const table of box.querySelectorAll('table.suggestion-code')) {
    const cells = (kind: string) => [...table.querySelectorAll(`tr.suggestion-${kind}`)].flatMap(row => {
      const cell = row.querySelector<HTMLElement>('td.suggestion-line');
      return cell && !('coloured' in cell.dataset) ? [{ row, cell }] : [];
    });
    // The sign before each line is one plain character.
    const signed = (runs: Run[] | undefined): Run[] | undefined => runs && [[1, ''], ...runs];
    const removed = cells('del');
    if (removed.length)
      void fileAt(head, file).then(tokens => {
        for (const { row, cell } of removed) paint(cell, signed(tokens?.[Number(row.querySelector('td.suggestion-number')?.textContent) - 1]));
      });
    const added = cells('add');
    if (added.length)
      void code({ file, code: added.map(({ cell }) => cell.textContent.slice(1)).join('\n') }).then(tokens => {
        added.forEach(({ cell }, at) => {
          paint(cell, signed(tokens?.[at]));
        });
      });
  }
}
