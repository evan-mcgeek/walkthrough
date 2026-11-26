// Syntax colours, put on code the page already drew: diff rows by side and line number, and Markdown code blocks by their language.
import type { DiffFile } from 'diff2html/lib-esm/types';
import { colourHtml, joinLines, PLAIN, ruleFor, type Run } from '../colours';
import { postQuietly } from './dom';

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
const ruled = new Set<string>();

function paint(element: Element, runs: Run[] | undefined): void {
  const coloured = runs && colourHtml(element.innerHTML, runs);
  if (!runs || !coloured) return;
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
      const code = row.querySelector('.d2h-code-line-ctn');
      if (line && code) paint(code, tokens[line - 1]);
    }
  };
  void side(true);
  void side(false);
}

/** Colours the code blocks in rendered Markdown whose fence names a language. */
export function colourCode(box: Element): void {
  for (const code of box.querySelectorAll('pre > code[class*="language-"]')) {
    const language = /(?:^|\s)language-(\S+)/.exec(code.className)?.[1];
    const text = code.textContent;
    if (!language) continue;
    void once(`${language}\n${text}`, () => lines(postQuietly('code', { language, code: text }))).then(tokens => {
      if (tokens) paint(code, joinLines(tokens));
    });
  }
}
