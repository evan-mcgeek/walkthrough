import path from 'node:path';

/** Written by the build from Linguist, tm-grammars and Shiki's languages. */
declare const GRAMMARS: {
  version: string;
  extensions: Record<string, string>;
  filenames: Record<string, string>;
  names: Record<string, string>;
  /** `lazy`: embedded grammars needed only for code the text names. */
  grammars: Record<string, { sha256: string; embedded?: string[]; lazy?: string[] }>;
};

export const grammars = GRAMMARS;

const own = (table: Record<string, string>, key: string) => (Object.hasOwn(table, key) ? table[key] : undefined);

/** The grammar for a file by its name, then by its longest extension; null when there is none. */
export function grammarOf(file: string): string | null {
  const name = path.posix.basename(file);
  const byName = own(GRAMMARS.filenames, name);
  if (byName) return byName;
  for (let dot = name.indexOf('.', 1); dot !== -1; dot = name.indexOf('.', dot + 1)) {
    const found = own(GRAMMARS.extensions, name.slice(dot).toLowerCase());
    if (found) return found;
  }
  return null;
}

/** The grammar a code block's language names, such as `ts` or `TypeScript`. */
export const grammarNamed = (language: string): string | null => own(GRAMMARS.names, language.trim().toLowerCase()) ?? null;
