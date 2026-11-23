// A step's diff as files, each named by its path as git lists it elsewhere.
import { parse } from 'diff2html/lib-esm/diff-parser';
import type { DiffFile } from 'diff2html/lib-esm/types';

const encoder = new TextEncoder();
const ESCAPED: Record<string, number> = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34, '\\': 92 };

// git pads a name holding a space with a tab, and C-quotes one with a byte it would not print, which diff2html keeps.
function pathOf(name: string): string {
  const padless = name.replace(/\t$/, '');
  // An unquoted name never holds a backslash, as git quotes any name that does.
  if (!padless.includes('\\')) return padless;
  const bytes: number[] = [];
  for (let at = 0; at < padless.length; at++) {
    const char = padless.charAt(at);
    // A quote left unescaped is the closing one, which diff2html keeps when a tab pads it.
    if (char === '"') continue;
    if (char !== '\\') bytes.push(...encoder.encode(char));
    else if (/^[0-7]{3}$/.test(padless.slice(at + 1, at + 4))) {
      bytes.push(parseInt(padless.slice(at + 1, at + 4), 8));
      at += 3;
    } else bytes.push(ESCAPED[padless.charAt(++at)] ?? 92);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export const parseDiff = (diff: string): DiffFile[] =>
  parse(diff).map(file => ({ ...file, oldName: pathOf(file.oldName), newName: pathOf(file.newName) }));
