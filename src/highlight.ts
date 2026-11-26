// Syntax colours: code is coloured in a worker thread, so a large file never holds up the server's other answers.
import { Worker } from 'node:worker_threads';
import { changedFiles, git } from './change';
import type { Run } from './colours';
import { grammarNamed, grammarOf } from './grammars';
import type { Done, Job } from './highlight-worker';

let worker: { post: (job: Omit<Job, 'id'>) => Promise<Run[][] | null> } | null = null;

/** Starts the worker; one that fails answers plain for what it held, and the next request starts another. */
function start(): NonNullable<typeof worker> {
  const thread = new Worker(new URL('./highlight-worker.mjs', import.meta.url));
  const waiting = new Map<number, (runs: Run[][] | null) => void>();
  let next = 0;
  // Holds the process open only while it owes an answer, so `export` waits for its colours and a server still stops.
  const hold = () => {
    if (waiting.size) thread.ref();
    else thread.unref();
  };
  const answer = ({ id, runs }: Done) => {
    waiting.get(id)?.(runs);
    waiting.delete(id);
    hold();
  };
  const fail = () => {
    if (worker === self) worker = null;
    for (const done of waiting.values()) done(null);
    waiting.clear();
  };
  thread.on('message', answer).on('error', fail).on('exit', fail);
  hold();
  const self = {
    post: (job: Omit<Job, 'id'>) =>
      new Promise<Run[][] | null>(resolve => {
        const id = next++;
        waiting.set(id, resolve);
        hold();
        thread.postMessage({ ...job, id } satisfies Job);
      }),
  };
  return self;
}

const tokenise = (text: string, grammar: string | null): Promise<Run[][] | null> =>
  grammar ? (worker ??= start()).post({ text, grammar }) : Promise.resolve(null);

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

/** A code block's lines as runs, for the language its fence names or, for lines on a file, that file's language. */
export const tokensFor = (code: string, { language, file }: { language?: string; file?: string }) =>
  tokenise(code, language !== undefined ? grammarNamed(language) : file !== undefined ? grammarOf(file) : null);

/** The reading order each change is coloured in, which the steps set once they are recorded. */
const orders = new Map<string, string[]>();

/** Colours both sides of every changed file in the background, one file at a time: `first` in its order, then the rest. */
export function warm(cwd: string, base: string, head: string, first: string[]): void {
  const range = `${base}..${head}`;
  const running = orders.has(range);
  orders.set(range, first);
  if (running) return;
  void (async () => {
    const files = await changedFiles(cwd, base, head);
    const done = new Set<string>();
    for (;;) {
      const order = orders.get(range) ?? [];
      const file = [...order.flatMap(one => files.filter(changed => changed.path === one)), ...files].find(changed => !done.has(changed.path));
      if (!file) return;
      done.add(file.path);
      await Promise.all([tokensAt(cwd, base, file.from ?? file.path), tokensAt(cwd, head, file.path)]);
    }
  })().catch(() => {});
}
