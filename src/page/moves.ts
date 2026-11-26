// Moved and copied code, drawn into diff2html's table: moved lines once where they arrive, copied lines under where they come from.
import type { Copy } from '../copies';
import { parseDiff } from '../diff';
import { findMoves, type Move } from '../moves';
import { el } from './dom';
import { icon } from './icons';
import { shownSince } from './since';
import { plural, state } from './state';

let found = { diff: '', moves: [] as Move[] };

/** The moves across the diffs the page shows: every step's, or each file's since the last review. */
export function shownMoves(): Move[] {
  const since = shownSince();
  const diff = since ? Object.values(since.files).join('') : state.view.steps.map(step => step.diff).join('');
  if (diff !== found.diff) found = { diff, moves: findMoves(parseDiff(diff)) };
  return found.moves;
}

/** Goes to the other end of a move, or to where copied lines come from; set by the page. */
export const moving = { show: (() => {}) as (move: Move, to: 'from' | 'to') => void, copied: (() => {}) as (copy: Copy) => void };

/** Turns the file's moved lines in diff2html's table into one row where they left, and a row and plain lines where they arrive; copied lines get a row above them. */
export function drawMoves(table: Element, file: string, copies: Copy[] = []): void {
  const row = (type: 'del' | 'ins', line: number) =>
    [...table.querySelectorAll<HTMLTableRowElement>(`tr:has(> td.d2h-${type})`)].find(one => Number(one.querySelector(type === 'del' ? '.line-num1' : '.line-num2')?.textContent.trim()) === line);
  const link = (onclick: () => void, down: boolean, text: string) =>
    el('button', { type: 'button', className: 'moved-link', onclick }, icon(down ? 'chevron-down' : 'chevron-right'), text);
  const label = (number: string, content: HTMLElement) =>
    el('tr', { className: 'moved-label' }, el('td', { className: 'd2h-code-linenumber' }, el('div', { className: 'line-num1' }, number)), el('td', {}, el('div', { className: 'd2h-code-line' }, content)));
  const goTo = (move: Move, to: 'from' | 'to') => () => {
    moving.show(move, to);
  };
  const where = (one: string, other: string) => (one === other ? '' : `${other} `);
  for (const move of shownMoves()) {
    const { from, to, count } = move;
    if (from.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row('del', from.line + at));
      const departure = label(
        String(from.line),
        link(goTo(move, 'to'), true, `${plural(count, 'line')} moved to ${where(from.file, to.file)}line ${String(to.line)}`),
      );
      departure.dataset['movedFrom'] = String(from.line);
      rows[0]?.before(departure);
      for (const one of rows) one?.remove();
    }
    if (to.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row('ins', to.line + at));
      rows[0]?.before(label('', link(goTo(move, 'from'), false, `Moved from ${where(to.file, from.file)}line ${String(from.line)}`)));
      for (const one of rows) {
        one?.classList.add('moved');
        for (const cell of one?.cells ?? []) cell.classList.replace('d2h-ins', 'd2h-cntx');
        const prefix = one?.querySelector('.d2h-code-line-prefix');
        if (prefix) prefix.textContent = ' ';
        const code = one?.querySelector('.d2h-code-line-ctn');
        // Drops the word marks diff2html put on a line it paired with a deleted one.
        if (code) code.textContent = code.textContent;
      }
    }
  }
  for (const copy of copies) {
    const { from, to } = copy;
    const text = `Copied from ${where(to.file, from.file)}line ${String(from.line)}`;
    const go = () => {
      moving.copied(copy);
    };
    if (to.file === file) row('ins', to.line)?.before(label('', copy.inDiff ? link(go, false, text) : el('span', {}, text)));
  }
}
