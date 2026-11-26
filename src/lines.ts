// Lines of a changed file, numbered as at the head; this checks only that they are in the change.
import crypto from 'node:crypto';
import { parseDiff } from './diff';
import { filled } from './input';
import type { Step, Walkthrough } from './walkthrough';

/** The first and last line, numbered as in the file at the head. */
export type Lines = [number, number];
/** `linesHash` fingerprints the lines as they were when placed, so a place whose lines change is detached; `code` is their text then. */
export type Place = { file: string; lines: Lines; linesHash: string; code?: string[] };

export const isLines = (value: unknown): value is Lines =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every(line => Number.isInteger(line) && (line as number) >= 1) &&
  (value[0] as number) <= (value[1] as number);

// The page asks for every place on each poll; a step read from disk is parsed once per read.
const parsed = new WeakMap<Step, ReturnType<typeof parseDiff>>();

export function shownLines(step: Step, file: string): Map<number, string> | null {
  const files = parsed.get(step) ?? parseDiff(step.diff);
  parsed.set(step, files);
  const shown = files.find(one => one.newName === file);
  if (!shown) return null;
  const lines = shown.blocks.flatMap(block => block.lines);
  return new Map(lines.flatMap(line => (line.newNumber === undefined ? [] : [[line.newNumber, line.content.slice(1)]])));
}

const codeOf = (shown: Map<number, string>, [first, last]: Lines) => [...shown].filter(([number]) => number >= first && number <= last).map(([, line]) => line);
const hashOf = (shown: Map<number, string>, lines: Lines) => crypto.createHash('sha256').update(JSON.stringify(codeOf(shown, lines))).digest('hex').slice(0, 16);

const stepOf = ({ steps }: Walkthrough, file: string) => steps.find(one => one.files.includes(file));

/** The step that changes the file now, if any. */
export const stepOfFile = (walkthrough: Walkthrough, file: string) => stepOf(walkthrough, file)?.id;

/** The step a place shows in, or null once its file left the change or its lines changed. */
export function anchorOf(walkthrough: Walkthrough, { file, lines, linesHash }: Place): string | null {
  const found = stepOf(walkthrough, file);
  const shown = found && shownLines(found, file);
  if (!found || !shown?.has(lines[0]) || !shown.has(lines[1])) return null;
  return hashOf(shown, lines) === linesHash ? found.id : null;
}

export function placeIn(walkthrough: Walkthrough | null, { file, lines }: Record<string, unknown>): Place {
  if (!filled(file)) throw new Error('lines need a file');
  if (!isLines(lines)) throw new Error('a file needs lines, as [first, last]');
  const found = walkthrough && stepOf(walkthrough, file);
  const shown = found && shownLines(found, file);
  if (!shown) throw new Error(`no step changes ${file}`);
  const [first, last] = lines;
  if (!shown.has(first) || !shown.has(last)) throw new Error(`lines ${String(first)}-${String(last)} of ${file} are not in its diff`);
  return { file, lines: [first, last], linesHash: hashOf(shown, [first, last]), code: codeOf(shown, [first, last]) };
}
