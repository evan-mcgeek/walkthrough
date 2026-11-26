// Moved code: a run of deleted lines that comes back unchanged as a run of added lines.
import { type DiffFile, LineType } from 'diff2html/lib-esm/types';

/** Where moved or copied lines come from and where they arrive, each by its first line; a move's `from` is numbered as at the base. */
export type Move = { from: { file: string; line: number }; to: { file: string; line: number }; count: number };

/** `change` numbers each stretch of changed lines with no unchanged line in it, the same for both types. */
export type Line = { file: string; line: number; text: string; change: number };

const MIN_LINES = 3;
const MIN_ALNUM = 20;

/** Each file's lines of one type in runs of consecutive line numbers. */
export function runsOf(files: DiffFile[], type: LineType.DELETE | LineType.INSERT): Line[][] {
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

/** Whether lines are enough to call moved or copied. */
export const enough = (lines: { text: string }[]) =>
  lines.length >= MIN_LINES && lines.reduce((sum, { text }) => sum + (text.match(/[\p{L}\p{N}]/gu)?.length ?? 0), 0) >= MIN_ALNUM;

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
      if (!best || !first || !arrived || !enough(left)) {
        at++;
        continue;
      }
      for (const line of best.run.slice(best.from, best.from + best.count)) used.add(line);
      moves.push({ from: { file: first.file, line: first.line }, to: { file: arrived.file, line: arrived.line }, count: best.count });
      at += best.count;
    }
  return moves;
}
