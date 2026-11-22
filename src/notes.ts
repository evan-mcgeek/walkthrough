// The session pins notes to a step or to lines of a file in it; this checks only that the place is in the walkthrough.
import { parse } from 'diff2html/lib-esm/diff-parser';
import { filled, pathsOf } from './steps';
import type { Step, Walkthrough } from './walkthrough';

/** The first and last line, numbered as in the file at the head. */
export type Lines = [number, number];
export type Place = { step: string; file?: string; lines?: Lines };
export type NoteMark = Place & { label: string; low?: true };
export type NoteInput = NoteMark & { text: string };

const isLines = (value: unknown): value is Lines =>
  Array.isArray(value) &&
  value.length === 2 &&
  value.every(line => Number.isInteger(line) && (line as number) >= 1) &&
  (value[0] as number) <= (value[1] as number);

// The page asks for every note's place on each poll; a step read from disk is parsed once per read.
const parsed = new WeakMap<Step, ReturnType<typeof parse>>();

function shownLines(step: Step, file: string): Set<number | undefined> | null {
  const files = parsed.get(step) ?? parse(step.diff);
  parsed.set(step, files);
  const shown = files.find(one => one.newName === file);
  return shown ? new Set(shown.blocks.flatMap(block => block.lines.map(line => line.newNumber))) : null;
}

// Lines follow their file to whichever step has it.
export function anchorOf({ steps }: Walkthrough, { step, file, lines }: Place): string | null {
  if (file === undefined || !lines) return steps.some(one => one.id === step) ? step : null;
  const found = steps.find(one => pathsOf(one).includes(file));
  if (!found) return null;
  const shown = shownLines(found, file);
  return shown?.has(lines[0]) && shown.has(lines[1]) ? found.id : null;
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
  return { step: found.id, file, lines: [first, last] };
}

export function parseNotes(text: string, walkthrough: Walkthrough | null): NoteInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  if (!Array.isArray(parsed)) throw new Error('the notes must be a JSON array on standard input; see walkthrough guide');
  return parsed.map((one: unknown, at) => {
    const note = (one ?? {}) as Record<string, unknown>;
    const name = `note ${String(at + 1)}`;
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
