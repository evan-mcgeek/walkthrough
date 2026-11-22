// The session pins notes to a step or to lines of a file in it; this checks only that the place is in the walkthrough.
import crypto from 'node:crypto';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { filled, parseList } from './input';
import { pathsOf } from './steps';
import type { Step, Walkthrough } from './walkthrough';

/** The first and last line, numbered as in the file at the head. */
export type Lines = [number, number];
/** `linesHash` fingerprints the lines as they were when pinned. */
export type Place = { step: string; file?: string; lines?: Lines; linesHash?: string };
export type NoteMark = Place & { label: string; low?: true };
export type NoteInput = NoteMark & { text: string };

const isLines = (value: unknown): value is Lines =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every(line => Number.isInteger(line) && (line as number) >= 1) &&
  (value[0] as number) <= (value[1] as number);

// The page asks for every note's place on each poll; a step read from disk is parsed once per read.
const parsed = new WeakMap<Step, ReturnType<typeof parse>>();

/** The text of each line of `file` the step's diff shows, by its number at the head. */
function shownLines(step: Step, file: string): Map<number, string> | null {
  const files = parsed.get(step) ?? parse(step.diff);
  parsed.set(step, files);
  const shown = files.find(one => one.newName === file);
  if (!shown) return null;
  const lines = shown.blocks.flatMap(block => block.lines);
  return new Map(lines.flatMap(line => (line.newNumber === undefined ? [] : [[line.newNumber, line.content.slice(1)]])));
}

function hashOf(shown: Map<number, string>, [first, last]: Lines): string {
  const text = [...shown].filter(([number]) => number >= first && number <= last).map(([, line]) => line);
  return crypto.createHash('sha256').update(JSON.stringify(text)).digest('hex').slice(0, 16);
}

// Lines follow their file to whichever step has it, while what they say is unchanged.
export function anchorOf({ steps }: Walkthrough, { step, file, lines, linesHash }: Place): string | null {
  if (file === undefined || !lines) return steps.some(one => one.id === step) ? step : null;
  const found = steps.find(one => pathsOf(one).includes(file));
  if (!found) return null;
  const shown = shownLines(found, file);
  if (!shown?.has(lines[0]) || !shown.has(lines[1])) return null;
  return linesHash === undefined || hashOf(shown, lines) === linesHash ? found.id : null;
}

export function placeIn(walkthrough: Walkthrough | null, { step, file, lines }: Record<string, unknown>): Place {
  const found = walkthrough?.steps.find(one => one.id === step);
  if (!found) throw new Error(`the walkthrough has no step ${String(step)}`);
  if (file === undefined && lines === undefined) return { step: found.id };
  if (!filled(file)) throw new Error('lines need a file');
  if (!isLines(lines)) throw new Error('a file needs lines, as [first, last]');
  const numbers = shownLines(found, file);
  if (!numbers) throw new Error(`step ${found.id} does not change ${file}`);
  const [first, last] = lines;
  if (!numbers.has(first) || !numbers.has(last))
    throw new Error(`lines ${String(first)}-${String(last)} of ${file} are not in the diff of step ${found.id}`);
  return { step: found.id, file, lines: [first, last], linesHash: hashOf(numbers, [first, last]) };
}

export function parseNotes(text: string, walkthrough: Walkthrough | null): NoteInput[] {
  return parseList(text, 'the notes', (note, number) => {
    const name = `note ${String(number)}`;
    const { label, text: said, low = false } = note;
    if (!filled(label)) throw new Error(`${name} needs a label`);
    if (!filled(said)) throw new Error(`${name} needs text`);
    if (typeof low !== 'boolean') throw new Error(`${name}: low must be true or false`);
    let place: Place;
    try {
      place = placeIn(walkthrough, note);
    } catch (error) {
      throw new Error(`${name}: ${(error as Error).message}`);
    }
    return { ...place, label, text: said, ...(low && { low: true as const }) };
  });
}
