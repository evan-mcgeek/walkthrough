// What the session sends as JSON on standard input; this checks shape only, each command its own fields.
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

/** Each entry of the array, checked by `check` with its number from 1. */
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
