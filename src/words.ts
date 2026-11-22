export const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

const MAX_TEXT = 4000;

export function tooLong(fields: Record<string, unknown>): string | null {
  const long = Object.values(fields).find((value): value is string => typeof value === 'string' && value.length > MAX_TEXT);
  return long === undefined
    ? null
    : `That text is ${String(long.length)} characters long; the most it can be is ${String(MAX_TEXT)}.`;
}
