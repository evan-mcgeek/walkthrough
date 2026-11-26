// Syntax colours: a grammar is downloaded the first time a change needs it, checked against the hash recorded at build, and kept.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createHighlighterCoreSync, type HighlighterCore, type LanguageRegistration, type ThemedToken } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import { changedFiles, git } from './change';
import type { Run } from './colours';
import { stateDir } from './paths';

/** Written by the build from Linguist and tm-grammars. */
declare const GRAMMARS: {
  version: string;
  extensions: Record<string, string>;
  filenames: Record<string, string>;
  names: Record<string, string>;
  grammars: Record<string, { sha256: string; embedded?: string[] }>;
};

const MAX_LINE = 1000;
const THEMES = { light: 'github-light', dark: 'github-dark' };
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

const source = (name: string) => `https://cdn.jsdelivr.net/npm/tm-grammars@${GRAMMARS.version}/grammars/${name}.json`;

async function download(name: string): Promise<Buffer | null> {
  const folder = process.env['WALKTHROUGH_GRAMMARS'];
  if (folder) return fs.promises.readFile(path.join(folder, `${name}.json`)).catch(() => null);
  try {
    const answer = await fetch(source(name), { signal: AbortSignal.timeout(30_000) });
    return answer.ok ? Buffer.from(await answer.arrayBuffer()) : null;
  } catch {
    return null;
  }
}

const matches = (name: string, bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex') === GRAMMARS.grammars[name]?.sha256;

/** One grammar, from the cache or downloaded into it; null when it cannot be had or is not the one recorded, for the rest of this process. */
const fetched = new Map<string, Promise<LanguageRegistration | null>>();
function grammarFile(name: string): Promise<LanguageRegistration | null> {
  let found = fetched.get(name);
  if (!found) {
    found = (async () => {
      const cached = path.join(stateDir(), 'grammars', GRAMMARS.version, `${name}.json`);
      const kept = fs.existsSync(cached) ? fs.readFileSync(cached) : null;
      // A changed cached file is dropped, so the next server downloads it again.
      if (kept && !matches(name, kept)) fs.rmSync(cached, { force: true });
      const bytes = kept ?? (await download(name));
      if (!bytes || !matches(name, bytes)) return null;
      if (!kept) {
        fs.mkdirSync(path.dirname(cached), { recursive: true, mode: 0o700 });
        const part = `${cached}.${String(process.pid)}`;
        fs.writeFileSync(part, bytes);
        fs.renameSync(part, cached);
      }
      return JSON.parse(bytes.toString('utf8')) as LanguageRegistration;
    })().catch(() => null);
    fetched.set(name, found);
  }
  return found;
}

/** A grammar and every grammar it embeds. */
function withEmbedded(name: string, found = new Set<string>()): Set<string> {
  if (found.has(name) || !Object.hasOwn(GRAMMARS.grammars, name)) return found;
  found.add(name);
  for (const one of GRAMMARS.grammars[name]?.embedded ?? []) withEmbedded(one, found);
  return found;
}

let highlighter: HighlighterCore | null = null;
const loaded = new Map<string, Promise<boolean>>();

/** Loads a grammar and those it embeds; false when the grammar itself is missing, while a missing embedded one leaves only its part plain. */
function load(name: string): Promise<boolean> {
  let done = loaded.get(name);
  if (!done) {
    done = (async () => {
      const files = await Promise.all([...withEmbedded(name)].map(grammarFile));
      if (!files[0]) return false;
      highlighter ??= createHighlighterCoreSync({
        themes: [githubLight, githubDark],
        langs: [],
        // Skips a pattern JavaScript cannot run instead of failing the whole grammar.
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      });
      highlighter.loadLanguageSync(...files.filter(one => one !== null));
      return true;
    })().catch(() => false);
    loaded.set(name, done);
  }
  return done;
}

const plainColours = [githubLight, githubDark].map(theme => theme.colors?.['editor.foreground']?.toLowerCase());

function keyOf({ htmlStyle }: ThemedToken): string {
  const light = htmlStyle?.['color']?.toLowerCase();
  const dark = htmlStyle?.['--shiki-dark']?.toLowerCase();
  if (!light || !dark || (light === plainColours[0] && dark === plainColours[1])) return '';
  return `${light.slice(1)}-${dark.slice(1)}${htmlStyle?.['font-style'] === 'italic' ? '-i' : ''}${htmlStyle?.['font-weight'] === 'bold' ? '-b' : ''}`;
}

/** Each line as runs of one colour; lines over 1,000 characters stay plain. */
async function tokenise(text: string, grammar: string | null): Promise<Run[][] | null> {
  if (!grammar || !(await load(grammar)) || !highlighter) return null;
  try {
    const { tokens } = highlighter.codeToTokens(text, { lang: grammar, themes: THEMES, tokenizeMaxLineLength: MAX_LINE });
    return tokens.map(line =>
      line.reduce<Run[]>((runs, token) => {
        const key = keyOf(token);
        const last = runs.at(-1);
        if (last?.[1] === key) last[0] += token.content.length;
        else runs.push([token.content.length, key]);
        return runs;
      }, []),
    );
  } catch {
    return null;
  }
}

/** Colours by git blob id, which stays the same for a file the next head leaves unchanged. */
const byBlob = new Map<string, Promise<Run[][] | null>>();

/** A file's lines at a commit as runs, or null when it is not there or its language has no grammar. */
export function tokensAt(cwd: string, rev: string, file: string): Promise<Run[][] | null> {
  const grammar = grammarOf(file);
  if (!grammar || !/^[0-9a-f]{40,64}$/.test(rev)) return Promise.resolve(null);
  let blob: string;
  try {
    blob = git(cwd, 'rev-parse', '--verify', '--quiet', `${rev}:${file}`).trim();
  } catch {
    return Promise.resolve(null);
  }
  const key = `${blob}:${grammar}`;
  let found = byBlob.get(key);
  if (!found) {
    found = tokenise(git(cwd, 'cat-file', 'blob', blob), grammar);
    byBlob.set(key, found);
  }
  return found;
}

/** A code block's lines as runs, for the language its fence names or, for lines a suggestion adds, the file it is on. */
export const tokensFor = (code: string, { language, file }: { language?: string; file?: string }) =>
  tokenise(code, language !== undefined ? grammarNamed(language) : file !== undefined ? grammarOf(file) : null);

const warmed = new Set<string>();

/** Colours both sides of every changed file in the background, one file per turn, so the page finds them ready. */
export function warm(cwd: string, base: string, head: string): void {
  if (warmed.has(`${base}..${head}`)) return;
  warmed.add(`${base}..${head}`);
  const turn = () => new Promise(resolve => setImmediate(resolve));
  void (async () => {
    for (const file of await changedFiles(cwd, base, head)) {
      await tokensAt(cwd, base, file.from ?? file.path);
      await turn();
      await tokensAt(cwd, head, file.path);
      await turn();
    }
  })().catch(() => {});
}
