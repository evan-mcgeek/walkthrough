// What the session sends as JSON on standard input or in a file; this checks shape only, each command its own fields.
import fs from 'node:fs';
import { inInbox } from './paths';

// A file in an inbox is used up, so the session's next write there is a new file.
export function readInput(file: string | undefined): string {
  if (file === undefined) return fs.readFileSync(0, 'utf8');
  const text = fs.readFileSync(file, 'utf8');
  if (inInbox(file)) fs.rmSync(file);
  return text;
}

export const filled = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

export const fieldsOf = (value: unknown) => (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>;

function parsed(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

const wrongShape = (what: string, shape: string) => new Error(`${what} must be a JSON ${shape} on standard input; see walkthrough guide`);

export function parseList<T>(text: string, what: string, check: (fields: Record<string, unknown>, number: number) => T): T[] {
  const list = parsed(text);
  if (!Array.isArray(list)) throw wrongShape(what, 'array');
  return list.map((one: unknown, at) => check(fieldsOf(one), at + 1));
}

export function parseObject(text: string, what: string): Record<string, unknown> {
  const object = parsed(text);
  if (typeof object !== 'object' || object === null || Array.isArray(object)) throw wrongShape(what, 'object');
  return object as Record<string, unknown>;
}
