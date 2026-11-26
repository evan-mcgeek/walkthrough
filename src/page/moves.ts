// Moved code: a run of deleted lines that comes back unchanged as a run of added lines, shown once where it arrives.
import { type DiffFile, LineType } from 'diff2html/lib-esm/types';
import { parseDiff } from '../diff';
import { el } from './dom';
import { icon } from './icons';
import { shownSince } from './since';
import { plural, state } from './state';

/** Where moved lines left (old line numbers) and where they arrive (new line numbers), each by its first line. */
export type Move = { from: { file: string; line: number }; to: { file: string; line: number }; count: number };

/** `change` numbers each stretch of changed lines with no unchanged line in it, the same for both types. */
type Line = { file: string; line: number; text: string; change: number };

const MIN_LINES = 3;
const MIN_ALNUM = 20;

/** Each file's lines of one type in runs of consecutive line numbers. */
function runsOf(files: DiffFile[], type: LineType.DELETE | LineType.INSERT): Line[][] {
  const runs: Line[][] = [];
  let change = 0;
  for (const file of files) {
    const name = file.isDeleted ? file.oldName : file.newName;
    let run: Line[] = [];
    for (const block of file.blocks) {
      change++;
      for (const one of block.lines) {
        if (one.type === LineType.CONTEXT) change++;
        const line = type === LineType.DELETE ? one.oldNumber : one.newNumber;
        if (one.type !== type || line === undefined) continue;
        if (run.at(-1)?.line !== line - 1) runs.push((run = []));
        run.push({ file: name, line, text: one.content.slice(1).trimEnd(), change });
      }
    }
  }
  return runs;
}

const alnum = (lines: Line[]) => lines.reduce((sum, { text }) => sum + (text.match(/[\p{L}\p{N}]/gu)?.length ?? 0), 0);

export function findMoves(files: DiffFile[]): Move[] {
  const added = runsOf(files, LineType.INSERT);
  const starts = new Map<string, [Line[], number][]>();
  for (const run of added) run.forEach(({ text }, at) => starts.set(text, [...(starts.get(text) ?? []), [run, at]]));
  const used = new Set<Line>();
  const moves: Move[] = [];
  // ponytail: tries every added line with the same text, fine for a review's diff; index by run hash if huge diffs crawl.
  // A line deleted and added in the same stretch of changes was edited in place, not moved.
  for (const gone of runsOf(files, LineType.DELETE))
    for (let at = 0; at < gone.length; ) {
      let best: { run: Line[]; from: number; count: number } | null = null;
      for (const [run, from] of starts.get(gone[at]?.text ?? '') ?? []) {
        let count = 0;
        for (let line = run[from + count]; line && !used.has(line) && gone[at + count]?.text === line.text && gone[at + count]?.change !== line.change; line = run[from + count]) count++;
        if (count > (best?.count ?? 0)) best = { run, from, count };
      }
      const left = gone.slice(at, at + (best?.count ?? 0));
      const [first] = left;
      const arrived = best?.run[best.from];
      if (!best || !first || !arrived || best.count < MIN_LINES || alnum(left) < MIN_ALNUM) {
        at++;
        continue;
      }
      for (const line of best.run.slice(best.from, best.from + best.count)) used.add(line);
      moves.push({ from: { file: first.file, line: first.line }, to: { file: arrived.file, line: arrived.line }, count: best.count });
      at += best.count;
    }
  return moves;
}

let found = { diff: '', moves: [] as Move[] };

/** The moves across the diffs the page shows: every step's, or each file's since the last review. */
export function shownMoves(): Move[] {
  const since = shownSince();
  const diff = since ? Object.values(since.files).join('') : state.view.steps.map(step => step.diff).join('');
  if (diff !== found.diff) found = { diff, moves: findMoves(parseDiff(diff)) };
  return found.moves;
}

/** Goes to the other end of a move; set by the page. */
export const moving = { show: (() => {}) as (move: Move, to: 'from' | 'to') => void };

/** Turns the file's moved lines in diff2html's table into one row where they left, and a row and plain lines where they arrive. */
export function drawMoves(table: Element, file: string): void {
  const row = (type: 'del' | 'ins', line: number) =>
    [...table.querySelectorAll<HTMLTableRowElement>(`tr:has(> td.d2h-${type})`)].find(one => Number(one.querySelector(type === 'del' ? '.line-num1' : '.line-num2')?.textContent.trim()) === line);
  const link = (move: Move, to: 'from' | 'to', ...text: string[]) => {
    const button = el('button', { type: 'button', className: 'moved-link' }, icon(to === 'to' ? 'chevron-down' : 'chevron-right'), ...text);
    button.onclick = () => {
      moving.show(move, to);
    };
    return button;
  };
  const label = (number: string, content: HTMLElement) =>
    el('tr', { className: 'moved-label' }, el('td', { className: 'd2h-code-linenumber' }, el('div', { className: 'line-num1' }, number)), el('td', {}, el('div', { className: 'd2h-code-line' }, content)));
  for (const move of shownMoves()) {
    const { from, to, count } = move;
    const where = (other: string) => (from.file === to.file ? '' : `${other} `);
    if (from.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row('del', from.line + at));
      const departure = label(String(from.line), link(move, 'to', `${plural(count, 'line')} moved to ${where(to.file)}line ${String(to.line)}`));
      departure.dataset['movedFrom'] = String(from.line);
      rows[0]?.before(departure);
      for (const one of rows) one?.remove();
    }
    if (to.file === file) {
      const rows = Array.from({ length: count }, (_, at) => row('ins', to.line + at));
      rows[0]?.before(label('', link(move, 'from', `Moved from ${where(from.file)}line ${String(from.line)}`)));
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
}
