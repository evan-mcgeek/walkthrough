// Copied code: a run of added lines whose text also stands, unchanged, elsewhere in the head.
import { spawn } from 'node:child_process';
import { LineType } from 'diff2html/lib-esm/types';
import { parseDiff } from './diff';
import { shownLines } from './lines';
import { enough, findMoves, type Line, type Move, runsOf } from './moves';
import type { Step } from './walkthrough';

/** `from` is numbered as at the head; `inDiff` says whether the change's diff shows those lines. */
export type Copy = Move & { inDiff: boolean };

const MAX_ADDED = 5000;

// Without blocking, so the walkthrough's lock held meanwhile is kept fresh; a git that fails gives nothing.
function gitOut(cwd: string, args: string[], input: string): Promise<Buffer> {
  return new Promise(resolve => {
    const child = spawn('git', args, { cwd, stdio: ['pipe', 'pipe', 'ignore'] });
    const chunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.on('error', () => {
      resolve(Buffer.alloc(0));
    });
    child.on('close', code => {
      resolve(code === 0 ? Buffer.concat(chunks) : Buffer.alloc(0));
    });
    child.stdin.end(input);
  });
}

const keyOf = (file: string, line: number) => `${file}\n${String(line)}`;

/** The lines of each run that start with a line that is not blank. */
const trimmed = (run: Line[]) => run.slice(Math.max(0, run.findIndex(line => line.text.trim())));

// Paths are printed from the repo top; a path holding a newline is skipped.
async function grep(cwd: string, head: string, patterns: string[]): Promise<{ file: string; line: number; text: string }[]> {
  const out = await gitOut(cwd, ['grep', '-F', '--line-number', '-z', '-I', '--full-name', '--no-color', '-f', '-', head, '--', ':(top)'], `${patterns.join('\n')}\n`);
  return out.toString('utf8').split('\n').flatMap(record => {
    const [file = '', line = '', ...text] = record.split('\0');
    return file.startsWith(`${head}:`) ? [{ file: file.slice(head.length + 1), line: Number(line), text: text.join('\0').trimEnd() }] : [];
  });
}

/** Each file's lines at `head`, read in one batch. */
async function linesAt(cwd: string, head: string, files: string[]): Promise<Map<string, string[]>> {
  const out = await gitOut(cwd, ['cat-file', '--batch'], files.map(file => `${head}:${file}\n`).join(''));
  const read = new Map<string, string[]>();
  let at = 0;
  for (const file of files) {
    const end = out.indexOf(10, at);
    if (end < 0) break;
    const size = Number(/ blob (\d+)$/.exec(out.subarray(at, end).toString())?.[1] ?? -1);
    if (size < 0) {
      at = end + 1;
      continue;
    }
    read.set(file, out.subarray(end + 1, end + 1 + size).toString('utf8').split('\n'));
    at = end + 1 + size + 1;
  }
  return read;
}

/** The copies across the change's diff: each qualifying run of added lines found whole at the head outside itself; moved lines and edits in place are never one. */
export async function findCopies(cwd: string, head: string, diff: string, steps: Step[]): Promise<Copy[]> {
  const files = parseDiff(diff);
  const moved = new Set(findMoves(files).flatMap(({ to, count }) => Array.from({ length: count }, (_, at) => keyOf(to.file, to.line + at))));
  // Moved lines split a run, so code copied next to code moved is still found.
  const added = runsOf(files, LineType.INSERT).flatMap(run => {
    const pieces: Line[][] = [];
    let piece: Line[] = [];
    for (const line of run)
      if (moved.has(keyOf(line.file, line.line))) piece = [];
      else {
        if (!piece.length) pieces.push(piece);
        piece.push(line);
      }
    return pieces;
  });
  if (added.reduce((sum, run) => sum + run.length, 0) > MAX_ADDED) return [];
  const runOf = new Map(added.flatMap((run, at) => run.map(line => [keyOf(line.file, line.line), at] as const)));
  const deleted = new Set(runsOf(files, LineType.DELETE).flatMap(run => run.map(line => `${String(line.change)}\n${line.text}`)));
  const runs = added
    .map((run, at) => ({ lines: trimmed(run), at }))
    .filter(({ lines }) => enough(lines) && !lines.some(line => deleted.has(`${String(line.change)}\n${line.text}`)));
  if (!runs.length) return [];
  // ponytail: one grep for every run's first line, then every file it hits is read; a very common first line reads many files.
  const hits = new Map<string, { file: string; line: number }[]>();
  for (const hit of await grep(cwd, head, [...new Set(runs.map(({ lines }) => lines[0]?.text ?? ''))])) hits.set(hit.text, [...(hits.get(hit.text) ?? []), hit]);
  const read = await linesAt(cwd, head, [...new Set([...hits.values()].flat().map(hit => hit.file))].filter(file => !file.includes('\n')));
  const copies: Copy[] = [];
  for (const { lines, at } of runs) {
    const [first] = lines;
    if (!first) continue;
    // A source that is added code of this run or a later one would make the earlier of two equal runs the copy.
    const later = (file: string, line: number) => lines.some((_, offset) => (runOf.get(keyOf(file, line + offset)) ?? -1) >= at);
    const isAdded = (file: string, line: number) => lines.some((_, offset) => runOf.has(keyOf(file, line + offset)));
    const source = (hits.get(first.text) ?? [])
      .filter(({ file, line }) => !later(file, line) && lines.every((one, offset) => read.get(file)?.[line - 1 + offset]?.trimEnd() === one.text))
      .sort((one, other) => Number(isAdded(one.file, one.line)) - Number(isAdded(other.file, other.line)) || Number(one.file !== first.file) - Number(other.file !== first.file))[0];
    if (!source) continue;
    const step = steps.find(one => one.files.includes(source.file));
    const shown = step && shownLines(step, source.file);
    const inDiff = !!shown && lines.every((_, offset) => shown.has(source.line + offset));
    copies.push({ from: { file: source.file, line: source.line }, to: { file: first.file, line: first.line }, count: lines.length, inDiff });
  }
  return copies;
}

/** Each step with the copies that arrive in its files. */
export async function withCopies(cwd: string, head: string, steps: Step[]): Promise<Step[]> {
  const copies = await findCopies(cwd, head, steps.map(step => step.diff).join(''), steps);
  return steps.map(step => {
    const mine = copies.filter(copy => step.files.includes(copy.to.file));
    const kept = { ...step };
    delete kept.copies;
    return mine.length ? { ...kept, copies: mine } : kept;
  });
}
