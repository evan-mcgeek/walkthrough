// Colours code off the server's thread: a grammar is downloaded the first time a change needs it, checked against the hash recorded at build, and kept.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parentPort } from 'node:worker_threads';
import { createHighlighterCoreSync, type HighlighterCore, type LanguageRegistration, type ThemedToken } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import type { Run } from './colours';
import { grammarNamed, grammars } from './grammars';
import { stateDir } from './paths';

export type Job = { id: number; text: string; grammar: string };
export type Done = { id: number; runs: Run[][] | null };

const MAX_LINE = 1000;
const THEMES = { light: 'github-light', dark: 'github-dark' };
/** Each light|dark colour pair of the two themes that names a kind of code, and its class; any other pair is plain. */
const KINDS = new Map([
  ['#6a737d|#6a737d', 'c'],
  ['#d73a49|#f97583', 'k'],
  ['#005cc5|#79b8ff', 'n'],
  ['#6f42c1|#b392f0', 'e'],
  ['#22863a|#85e89d', 't'],
  ['#032f62|#9ecbff', 's'],
  ['#032f62|#dbedff', 'r'],
  ['#e36209|#ffab70', 'v'],
  ['#b31d28|#fdaeb7', 'x'],
]);

const source = (name: string) => `https://cdn.jsdelivr.net/npm/tm-grammars@${grammars.version}/grammars/${name}.json`;

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

const matches = (name: string, bytes: Buffer) => crypto.createHash('sha256').update(bytes).digest('hex') === grammars.grammars[name]?.sha256;

/** One grammar, from the cache or downloaded into it; null when it cannot be had or is not the one recorded, for the rest of this process. */
const fetched = new Map<string, Promise<LanguageRegistration | null>>();
function grammarFile(name: string): Promise<LanguageRegistration | null> {
  let found = fetched.get(name);
  if (!found) {
    found = (async () => {
      const cached = path.join(stateDir(), 'grammars', grammars.version, `${name}.json`);
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
      const lazy = grammars.grammars[name]?.lazy;
      // Shiki loads a grammar again when one it embeds lazily arrives later.
      return { ...(JSON.parse(bytes.toString('utf8')) as LanguageRegistration), ...(lazy && { embeddedLangsLazy: lazy }) };
    })().catch(() => null);
    fetched.set(name, found);
  }
  return found;
}

/** A grammar, those it embeds, and those it embeds lazily only when the text names them. */
function needed(name: string, named: (grammar: string) => boolean, found = new Set<string>()): Set<string> {
  if (found.has(name) || !Object.hasOwn(grammars.grammars, name)) return found;
  found.add(name);
  const { embedded = [], lazy = [] } = grammars.grammars[name] ?? {};
  for (const one of embedded) if (!lazy.includes(one) || named(one)) needed(one, named, found);
  return found;
}

let highlighter: HighlighterCore | null = null;

/** Loads a grammar and what it needs; false when the grammar itself is missing, while a missing embedded one leaves only its part plain. */
async function load(names: Set<string>): Promise<boolean> {
  const files = await Promise.all([...names].map(grammarFile));
  if (!files[0]) return false;
  highlighter ??= createHighlighterCoreSync({
    themes: [githubLight, githubDark],
    langs: [],
    // Skips a pattern JavaScript cannot run instead of failing the whole grammar.
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });
  const loaded = new Set(highlighter.getLoadedLanguages());
  const fresh = files.filter(one => one !== null && !loaded.has(one.name)) as LanguageRegistration[];
  if (fresh.length) highlighter.loadLanguageSync(...fresh);
  return true;
}

const kindOf = ({ htmlStyle }: ThemedToken) => KINDS.get(`${String(htmlStyle?.['color']).toLowerCase()}|${String(htmlStyle?.['--shiki-dark']).toLowerCase()}`) ?? '';

/** Each line as runs of one kind of code; lines over 1,000 characters stay plain. */
async function tokenise(text: string, grammar: string): Promise<Run[][] | null> {
  let words: Set<string | null> | undefined;
  const named = (one: string) => (words ??= new Set(text.toLowerCase().match(/[\w#+-]+/g)?.map(grammarNamed))).has(one);
  if (!(await load(needed(grammar, named))) || !highlighter) return null;
  try {
    const { tokens } = highlighter.codeToTokens(text, { lang: grammar, themes: THEMES, tokenizeMaxLineLength: MAX_LINE });
    return tokens.map(line =>
      line.reduce<Run[]>((runs, token) => {
        const kind = kindOf(token);
        const last = runs.at(-1);
        if (last?.[1] === kind) last[0] += token.content.length;
        else runs.push([token.content.length, kind]);
        return runs;
      }, []),
    );
  } catch {
    return null;
  }
}

parentPort?.on('message', ({ id, text, grammar }: Job) => {
  void tokenise(text, grammar).then(runs => {
    parentPort?.postMessage({ id, runs } satisfies Done);
  });
});
