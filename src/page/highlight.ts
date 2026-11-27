// Syntax colours, put on code the page already drew: diff rows by side and line number, and Markdown code blocks by their language.
import type { DiffFile } from 'diff2html/lib-esm/types';
import { colourHtml, joinLines, PLAIN, type Run } from '../colours';
import { postQuietly, readSignal } from './dom';

function paint(element: HTMLElement, runs: Run[] | undefined): void {
  // Painted once, so drawing a box again does not wrap its spans twice.
  if ('coloured' in element.dataset) return;
  const coloured = runs && colourHtml(element.innerHTML, runs);
  if (!runs || !coloured) return;
  element.dataset['coloured'] = '';
  // Only spans with a fixed class name are added to what diff2html or markdown-it escaped.
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

const code = (body: Record<string, string>) => once(JSON.stringify(body), () => lines(postQuietly('code', body, readSignal)));

const fileAt = (rev: string, file: string) =>
  once(`${rev}:${file}`, () => lines(fetch(`tokens?rev=${encodeURIComponent(rev)}&path=${encodeURIComponent(file)}`, { signal: readSignal }).catch(() => null)));

/**
 * Colours a file's diff table once both sides' tokens arrive, in one pass so the file changes in one frame:
 * removed lines from the base, the rest, moved and copied lines too, from the head.
 */
export async function colourDiff(table: Element, file: DiffFile, revs: { base: string | undefined; head: string }): Promise<void> {
  const [before, after] = await Promise.all([
    revs.base && !file.isNew ? fileAt(revs.base, file.oldName) : null,
    file.isDeleted ? null : fileAt(revs.head, file.newName),
  ]);
  if (!before && !after) return;
  for (const row of table.querySelectorAll('tr')) {
    const removed = !!row.querySelector('td.d2h-del');
    const line = Number(row.querySelector(removed ? '.line-num1' : '.line-num2')?.textContent.trim());
    const cell = row.querySelector<HTMLElement>('.d2h-code-line-ctn');
    if (line && cell) paint(cell, (removed ? before : after)?.[line - 1]);
  }
}

/** Colours the code blocks in rendered Markdown whose fence names a language; inline code stays plain. */
export function colourCode(box: Element): void {
  for (const block of box.querySelectorAll<HTMLElement>('pre > code[class*="language-"]')) {
    const language = /(?:^|\s)language-(\S+)/.exec(block.className)?.[1];
    if (language)
      void code({ language, code: block.textContent }).then(tokens => {
        if (tokens) paint(block, joinLines(tokens));
      });
  }
}

/** Colours lines of a file shown on their own, such as an outdated thread's code, together in the file's language; `skip` plain characters lead each line. */
export function colourLines(cells: HTMLElement[], file: string, skip = 0): void {
  const open = cells.filter(cell => !('coloured' in cell.dataset));
  if (!open.length) return;
  void code({ file, code: open.map(cell => cell.textContent.slice(skip)).join('\n') }).then(tokens => {
    open.forEach((cell, at) => {
      const runs = tokens?.[at];
      paint(cell, runs && [[skip, ''], ...runs]);
    });
  });
}

/** Colours suggested changes on a file: the lines they replace as they stand at the head, the lines they add in the file's language. */
export function colourSuggestions(box: Element, file: string, head: string): void {
  for (const table of box.querySelectorAll('table.suggestion-code')) {
    const cells = (kind: string) => [...table.querySelectorAll(`tr.suggestion-${kind}`)].flatMap(row => {
      const cell = row.querySelector<HTMLElement>('td.suggestion-line');
      return cell && !('coloured' in cell.dataset) ? [{ row, cell }] : [];
    });
    const removed = cells('del');
    if (removed.length)
      void fileAt(head, file).then(tokens => {
        for (const { row, cell } of removed) {
          const runs = tokens?.[Number(row.querySelector('td.suggestion-number')?.textContent) - 1];
          // The sign before each line is one plain character.
          paint(cell, runs && [[1, ''], ...runs]);
        }
      });
    colourLines(cells('add').map(({ cell }) => cell), file, 1);
  }
}
