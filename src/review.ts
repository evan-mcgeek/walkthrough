// The review: every comment, ask, answer, resolve and submit, kept as a log the page and the session append to.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { changesBetween, commitOf, type FileStat, fileStats } from './change';
import { parseDiff } from './diff';
import { locked, readJson, writeJson } from './json-files';
import { anchorOf, type Code, codeAt, type Lines, type Place, placeIn, stepOfFile } from './lines';
import { alive, psStart } from './processes';
import { branchOfDir, readWalkthrough, type Step, type Walkthrough } from './walkthrough';

export const REVIEW_TYPES = ['comment', 'approve', 'request-changes'] as const;
export type ReviewType = (typeof REVIEW_TYPES)[number];
export type By = 'you' | 'ai';

type Logged = { id: string; at: string };
/** A comment starts a thread on lines, or with `thread` replies in one. */
type CommentEvent = { kind: 'comment'; by: By; text: string; thread?: string; place?: Place };
type AskEvent = { kind: 'ask'; text: string; thread?: string; place?: Place };
export type Event = Logged &
  (
    | CommentEvent
    | AskEvent
    | { kind: 'edit'; comment: string; text: string }
    | { kind: 'delete'; comment: string }
    | { kind: 'answer'; ask: string; text: string }
    /** A resolve logged before `by` existed is the person's. */
    | { kind: 'resolve'; thread: string; by?: By }
    | { kind: 'unresolve'; thread: string }
    | { kind: 'submit'; type?: ReviewType; summary: string; head: string }
    | { kind: 'posted'; submit: string; address?: string }
  );

export type CommentView = {
  id: string;
  /** A colleague's comment has their handle as `author`. */
  by: By | 'colleague';
  author?: string;
  at: string;
  body: string;
  /** Goes out with the next review; Edit and Delete work on it. */
  pending?: true;
  /** The submitted review it went out with. */
  review?: string;
  ask?: true;
  /** An ask the AI has not answered yet. */
  waiting?: true;
  answer?: true;
};
export type ThreadView = {
  id: string;
  file: string;
  /** None on a comment on the whole file. */
  lines?: Lines;
  /** The step it shows in, null once its lines changed or left the change. */
  step: string | null;
  colleague?: true;
  resolved?: true;
  /** Who resolved it here; unset for a thread that came resolved. */
  resolvedBy?: By;
  /** On a pull request, the resolve goes out with the next review. */
  resolvePending?: true;
  /** The submitted review the resolve went out with. */
  resolveReview?: string;
  /** Unresolve conversation takes the resolve back: it has not gone out, or it is the AI's on your own change. */
  unresolvable?: true;
  /** The lines' text: as placed, or at the head for a place stored without it; once outdated, as placed only. */
  code?: Code;
  /** Once outdated: the step that now changes its file, if any. */
  fileStep?: string;
  comments: CommentView[];
};
/** `type` only on a pull request: your own change goes to the agent without one. */
export type Submitted = { id: string; type?: ReviewType; summary: string; comments: number; posted: boolean; address?: string };
/** What changed since the latest review, made at an earlier head: its commits and each changed file's diff since then. */
export type Since = { head: string; commits: number; files: Record<string, string> };
type WithoutThreads<T> = T extends unknown ? Omit<T, 'threads'> : never;
export type WalkthroughView = WithoutThreads<Walkthrough> & {
  ready: boolean;
  /** Not ready, and the session's listen, which ran, has been gone too long for a restart. */
  sessionGone: boolean;
  /** Every changed file with its line counts, while the walkthrough is not ready. */
  changedFiles: FileStat[];
  threads: ThreadView[];
  /** Files marked Viewed while their diff is unchanged. */
  viewed: string[];
  /** Files marked Viewed at an earlier diff of theirs. */
  changed: string[];
  /** The review the person submitted at this head, while nothing new is pending. */
  submitted: Submitted | null;
  /** Set once the person reviewed an earlier head that still exists. */
  since: Since | null;
  /** A branch whose commit moved on from the head shown. */
  behind: boolean;
};

const files = (dir: string) => ({
  log: path.join(dir, 'review.jsonl'),
  inbox: path.join(dir, 'inbox.jsonl'),
  listener: path.join(dir, 'listener.json'),
  viewed: path.join(dir, 'viewed.json'),
});
// One lock for the log, the inbox and the listener: an event and a listener taking events never interleave.
// Its work is a few small writes, so a listen killed while holding it blocks the next for 2s, not 10s.
const hold = <T>(dir: string, work: () => T) => locked(path.join(dir, 'review'), work, 2000);

function readLines<T>(file: string): T[] {
  let text = '';
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    return [];
  }
  return text.split('\n').flatMap(line => {
    try {
      return line.trim() ? [JSON.parse(line) as T] : [];
    } catch {
      return [];
    }
  });
}
const append = (file: string, entry: Event) => {
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
};
const newId = () => crypto.randomBytes(4).toString('hex');
const fingerprint = (content: string) => crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
/** The file a Viewed mark is for: a mark is the path, a colon and a 16-digit fingerprint. */
const markedFile = (mark: string) => mark.slice(0, -17);
export const cleanText = (text: unknown) => (typeof text === 'string' ? text.trim() : '');

export const logOf = (dir: string) => readLines<Event>(files(dir).log);

type Fields<T> = T extends unknown ? Omit<T, 'id' | 'at'> : never;
// Only an ask and a submit wake the session; everything else waits for the submit.
const WAKES = new Set<Event['kind']>(['ask', 'submit']);

export function record(dir: string, fields: Fields<Event>): Promise<Event> {
  const entry: Event = { id: newId(), at: new Date().toISOString(), ...fields };
  return hold(dir, () => {
    append(files(dir).log, entry);
    if (WAKES.has(entry.kind)) append(files(dir).inbox, entry);
    return entry;
  });
}

type Comment = { view: CommentView; thread: string; deleted?: true; wrote: string };

/** The review as the log builds it: each thread with its comments, and the submits in order. */
function replay(walkthrough: Walkthrough, log: Event[]) {
  const comments = new Map<string, Comment>();
  const roots = new Map<string, Place>();
  const resolved = new Map<string, { by: By; review?: string }>();
  // On your own change the AI's resolve never goes anywhere, so it can always be taken back.
  const takesBack = (one: { by: By; review?: string }) => one.review === undefined || (!walkthrough.pr && one.by === 'ai');
  const submits: (Event & { kind: 'submit' })[] = [];
  const posted = new Map<string, string | undefined>();
  for (const event of log) {
    switch (event.kind) {
      case 'comment':
      case 'ask': {
        const thread = event.thread ?? event.id;
        if (event.place && !event.thread) roots.set(event.id, event.place);
        const said = { id: event.id, at: event.at, body: event.text };
        const view: CommentView = event.kind === 'comment' ? { ...said, by: event.by, pending: true } : { ...said, by: 'you', ask: true, waiting: true };
        comments.set(event.id, { view, thread, wrote: event.text });
        break;
      }
      case 'edit': {
        const comment = comments.get(event.comment);
        if (comment) comment.view.body = event.text;
        break;
      }
      case 'delete': {
        const comment = comments.get(event.comment);
        if (comment) comment.deleted = true;
        break;
      }
      case 'answer': {
        const ask = comments.get(event.ask);
        if (!ask) break;
        delete ask.view.waiting;
        comments.set(event.id, { view: { id: event.id, at: event.at, body: event.text, by: 'ai', answer: true }, thread: ask.thread, wrote: event.text });
        break;
      }
      case 'resolve':
        if (!resolved.has(event.thread)) resolved.set(event.thread, { by: event.by ?? 'you' });
        break;
      case 'unresolve': {
        const one = resolved.get(event.thread);
        if (one && takesBack(one)) resolved.delete(event.thread);
        break;
      }
      case 'submit':
        submits.push(event);
        for (const { view, deleted } of comments.values())
          if (view.pending && !deleted) {
            delete view.pending;
            view.review = event.id;
          }
        for (const one of resolved.values()) one.review ??= event.id;
        break;
      case 'posted':
        posted.set(event.submit, event.address);
        break;
    }
  }
  // A thread whose first comment was deleted is gone with its replies.
  const gone = new Set([...comments.values()].filter(one => one.deleted && one.thread === one.view.id).map(one => one.thread));
  const live = [...comments.values()].filter(one => !one.deleted && !gone.has(one.thread));
  const kept = live.map(one => one.view);
  const ownIn = (thread: string) => live.filter(one => one.thread === thread).map(one => one.view);
  const resolvedIn = (id: string, was?: true): Partial<ThreadView> => {
    const one = resolved.get(id);
    if (!one) return was ? { resolved: true } : {};
    return {
      resolved: true,
      resolvedBy: one.by,
      ...(walkthrough.pr && one.review === undefined && { resolvePending: true }),
      ...(one.review !== undefined && { resolveReview: one.review }),
      ...(takesBack(one) && { unresolvable: true }),
    };
  };
  const placed = (place: Place): Pick<ThreadView, 'file' | 'lines' | 'step' | 'code' | 'fileStep'> => {
    const step = anchorOf(walkthrough, place);
    const fileStep = step === null ? stepOfFile(walkthrough, place.file) : undefined;
    const code = 'lines' in place ? (place.code ?? (step === null ? undefined : codeAt(walkthrough, place.file, place.lines))) : undefined;
    return {
      file: place.file,
      ...('lines' in place && { lines: place.lines }),
      step,
      ...(code?.length && { code }),
      ...(fileStep !== undefined && { fileStep }),
    };
  };
  const threads: ThreadView[] = [
    ...(walkthrough.threads ?? []).map(({ id, file, lines, linesHash = '', code, resolved: was, author, at, body, replies }): ThreadView => ({
      id,
      ...placed(lines ? { file, lines, linesHash, ...(code && { code }) } : { file }),
      colleague: true,
      ...resolvedIn(id, was),
      comments: [
        { id, by: 'colleague', author, at, body },
        ...replies.map((reply, number): CommentView => ({ id: `${id}.${String(number + 1)}`, by: 'colleague', ...reply })),
        ...ownIn(id),
      ],
    })),
    ...[...roots]
      .filter(([id]) => !gone.has(id))
      .map(([id, place]): ThreadView => ({ id, ...placed(place), ...resolvedIn(id), comments: ownIn(id) })),
  ];
  const wrote = new Map([...comments].map(([id, one]) => [id, one.wrote]));
  const dropped = [...comments.values()].filter(one => one.deleted && one.view.by === 'ai' && roots.has(one.view.id)).map(one => ({ ...one, place: roots.get(one.view.id) as Place }));
  return { threads, submits, posted, resolved, kept, wrote, dropped };
}

// A mark follows the file's own diff, so it outlives the file moving between steps but not the file changing.
function fileMarks(steps: Step[]): Record<string, string> {
  return Object.fromEntries(
    steps.flatMap(step =>
      parseDiff(step.diff).map(file => {
        const name = file.isDeleted ? file.oldName : file.newName;
        return [name, `${name}:${fingerprint(JSON.stringify(file))}`];
      }),
    ),
  );
}

/** Changes whenever a file walkthroughView reads does, so the page's poll of an unchanged view is answered without one. */
export function walkthroughVersion(dir: string): string {
  const branch = branchOfDir(dir);
  const stats = ['walkthrough.json', 'review.jsonl', 'viewed.json', 'listener.json'].map(name => {
    const stat = fs.statSync(path.join(dir, name), { throwIfNoEntry: false });
    return stat ? `${String(stat.ino)}-${String(stat.size)}-${String(stat.mtimeMs)}` : '';
  });
  return fingerprint([...stats, String(listenerGone(dir)), branch === undefined ? '' : (branchHead(branch) ?? '')].join(':'));
}

const branchHead = (branch: string) => commitOf(process.cwd(), `refs/heads/${branch}`);

// The page polls far more often than heads move, so each pair of heads is diffed once.
const between = new Map<string, ReturnType<typeof changesBetween>>();

function sinceOf(walkthrough: Walkthrough, head: string): Since | null {
  const key = [process.cwd(), head, walkthrough.head].join(':');
  if (!between.has(key)) {
    // A server serves one walkthrough, so only its latest pair of heads is worth keeping.
    between.clear();
    between.set(key, changesBetween(process.cwd(), head, walkthrough.head));
  }
  const found = between.get(key);
  if (!found) return null;
  const shown = new Set(walkthrough.steps.flatMap(step => step.files));
  return { head, commits: found.commits, files: Object.fromEntries(Object.entries(found.files).filter(([file]) => shown.has(file))) };
}

export function walkthroughView(dir: string): WalkthroughView | null {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const { threads, submits, posted, kept } = replay(walkthrough, logOf(dir));
  const marks = readJson<string[]>(files(dir).viewed, []);
  const current = fileMarks(walkthrough.steps);
  const last = submits.at(-1);
  const showsSubmitted = last && last.head === walkthrough.head && !kept.some(one => one.pending) && !threads.some(one => one.resolvePending);
  const address = last && posted.get(last.id);
  const ready = walkthrough.ready !== false && walkthrough.steps.length > 0;
  return {
    ...walkthrough,
    ready,
    sessionGone: !ready && listenerGone(dir),
    changedFiles: ready ? [] : fileStats(process.cwd(), walkthrough.base, walkthrough.head),
    threads,
    viewed: Object.entries(current).flatMap(([file, mark]) => (marks.includes(mark) ? [file] : [])),
    changed: Object.entries(current).flatMap(([file, mark]) =>
      !marks.includes(mark) && marks.some(one => markedFile(one) === file) ? [file] : [],
    ),
    submitted: showsSubmitted
      ? {
          id: last.id,
          ...(last.type && { type: last.type }),
          summary: last.summary,
          comments: kept.filter(one => one.review === last.id).length,
          posted: posted.has(last.id),
          ...(address !== undefined && { address }),
        }
      : null,
    since: ready && last && last.head !== walkthrough.head ? sinceOf(walkthrough, last.head) : null,
    behind: walkthrough.kind === 'branch' && (branchHead(walkthrough.branch) ?? walkthrough.head) !== walkthrough.head,
  };
}

/** What the page sends; null when it does not fit the review as it is. */
export async function comment(dir: string, { comment: id, text, delete: deleting, thread, ...where }: Record<string, unknown>): Promise<boolean> {
  const said = cleanText(text);
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return false;
  const { threads } = replay(walkthrough, logOf(dir));
  if (id !== undefined) {
    const pending = threads.flatMap(one => one.comments).some(one => one.id === id && one.pending);
    if (typeof id !== 'string' || !pending) return false;
    if (deleting === true && text === undefined) return !!(await record(dir, { kind: 'delete', comment: id }));
    return !!said && deleting === undefined && !!(await record(dir, { kind: 'edit', comment: id, text: said }));
  }
  if (!said) return false;
  if (thread !== undefined) {
    if (!threads.some(one => one.id === thread)) return false;
    return !!(await record(dir, { kind: 'comment', by: 'you', text: said, thread: thread as string }));
  }
  const place = placeOrNull(walkthrough, where);
  return !!place && !!(await record(dir, { kind: 'comment', by: 'you', text: said, place }));
}

const placeOrNull = (walkthrough: Walkthrough, where: Record<string, unknown>) => {
  try {
    return placeIn(walkthrough, where);
  } catch {
    return null;
  }
};

export async function ask(dir: string, { text, thread, ...where }: Record<string, unknown>): Promise<boolean> {
  const said = cleanText(text);
  const walkthrough = readWalkthrough(dir);
  if (!said || !walkthrough) return false;
  if (thread !== undefined) {
    if (!replay(walkthrough, logOf(dir)).threads.some(one => one.id === thread)) return false;
    return !!(await record(dir, { kind: 'ask', text: said, thread: thread as string }));
  }
  const place = placeOrNull(walkthrough, where);
  return !!place && !!(await record(dir, { kind: 'ask', text: said, place }));
}

const threadOf = (dir: string, id: unknown) => {
  const walkthrough = readWalkthrough(dir);
  return walkthrough ? replay(walkthrough, logOf(dir)).threads.find(one => one.id === id) : undefined;
};

/** The person resolves a colleague's thread from the page. */
export async function resolve(dir: string, { thread }: Record<string, unknown>): Promise<boolean> {
  const found = threadOf(dir, thread);
  return !!found?.colleague && !found.resolved && !!(await record(dir, { kind: 'resolve', thread: found.id, by: 'you' }));
}

export async function unresolve(dir: string, { thread }: Record<string, unknown>): Promise<boolean> {
  const found = threadOf(dir, thread);
  return !!found?.unresolvable && !!(await record(dir, { kind: 'unresolve', thread: found.id }));
}

/** The session resolves the thread of one of its comments that went out with an earlier review, once the new code fixes it. */
export async function aiResolve(dir: string, id: string): Promise<void> {
  const found = threadOf(dir, id);
  const first = found?.comments[0];
  if (logOf(dir).some(event => event.kind === 'delete' && event.comment === id)) throw new Error(`the comment ${id} was deleted`);
  if (!found || !first) throw new Error(`no thread starts with the comment ${id}; pass the id of your comment that started it`);
  if (first.by !== 'ai') throw new Error(`the comment ${id} is not yours`);
  if (first.pending) throw new Error(`the comment ${id} is still pending: it has not gone out with a review`);
  if (found.resolved) throw new Error(`the thread of the comment ${id} is already resolved`);
  await record(dir, { kind: 'resolve', thread: id, by: 'ai' });
}

/** A pull request's review has a type; your own change goes to the agent with its comments and no type. */
export async function submit(dir: string, { type, summary }: Record<string, unknown>): Promise<boolean> {
  const view = walkthroughView(dir);
  if (!view || (summary !== undefined && typeof summary !== 'string') || view.submitted) return false;
  const pending = view.threads.flatMap(one => one.comments).some(one => one.pending);
  // The author of a pull request can only comment on it.
  if (view.pr ? !REVIEW_TYPES.includes(type as ReviewType) || (view.pr.yours && type !== 'comment') : type !== undefined || !pending) return false;
  return !!(await record(dir, { kind: 'submit', ...(view.pr && { type: type as ReviewType }), summary: cleanText(summary), head: view.head }));
}

export async function markViewed(dir: string, { file, viewed }: Record<string, unknown>): Promise<boolean> {
  const walkthrough = readWalkthrough(dir);
  const mark = walkthrough && typeof file === 'string' ? fileMarks(walkthrough.steps)[file] : undefined;
  if (!mark || typeof viewed !== 'boolean') return false;
  const marks = files(dir).viewed;
  await locked(marks, () => {
    const kept = readJson<string[]>(marks, []).filter(one => markedFile(one) !== file);
    writeJson(marks, viewed ? [...kept, mark] : kept);
  });
  return true;
}

/** The session's own pending comments on lines; they go out with the review unless the person deletes them. */
export async function aiComments(dir: string, given: { place: Place; body: string }[]): Promise<Event[]> {
  const recorded: Event[] = [];
  // One after another, so the log keeps them in the order the session gave them.
  for (const { place, body } of given) recorded.push(await record(dir, { kind: 'comment', by: 'ai', text: body, place }));
  return recorded;
}

export async function answer(dir: string, id: string, text: string): Promise<void> {
  if (!logOf(dir).some(event => event.kind === 'ask' && event.id === id)) throw new Error(`the page asked nothing with the id ${id}`);
  await record(dir, { kind: 'answer', ask: id, text });
}

/** Records that the latest review submitted went out, at `address` when it has one. */
export async function markPosted(dir: string, address?: string): Promise<void> {
  const log = logOf(dir);
  const last = log.findLast(event => event.kind === 'submit');
  if (!last || log.some(event => event.kind === 'posted' && event.submit === last.id)) throw new Error('the person has submitted no review that is not posted yet');
  await record(dir, { kind: 'posted', submit: last.id, ...(address !== undefined && { address }) });
}

const AI_PREFIX = '[AI] ';
/** Where a comment sits, as `comments` and `listen` print it: its lines, or `"subject": "file"` for the whole file. */
const whereOf = ({ file, lines }: { file: string; lines?: Lines }) => (lines ? { file, lines } : { file, subject: 'file' });

/** What goes out: the latest submitted review not yet posted, or else what is pending, as one line each; with `all`, every one ever made. */
export function reviewComments(dir: string, all = false): Record<string, unknown>[] {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return [];
  const log = logOf(dir);
  const { threads, submits, posted, resolved, wrote, dropped } = replay(walkthrough, log);
  const review = submits.findLast(one => !posted.has(one.id))?.id;
  const reworded = (one: CommentView) => (all && one.by === 'ai' && wrote.get(one.id) !== one.body ? { wrote: AI_PREFIX + (wrote.get(one.id) ?? '') } : {});
  const inReview = (one: CommentView) => (all ? one.pending === true || one.review !== undefined : review === undefined ? one.pending : one.review === review);
  return [
    ...threads.flatMap(thread =>
      thread.comments.filter(inReview).map(one => {
        const body = one.by === 'ai' ? AI_PREFIX + one.body : one.body;
        const by = one.by === 'colleague' ? one.author : one.by;
        return one.id === thread.id
          ? { kind: 'comment', id: one.id, by, ...whereOf(thread), body, ...reworded(one), ...(thread.step === null && { outdated: true }) }
          : { kind: 'reply', id: one.id, by, thread: thread.id, body, ...reworded(one) };
      }),
    ),
    ...(all ? dropped : []).map(({ view, wrote: text, place }) => ({ kind: 'comment', id: view.id, by: 'ai', ...whereOf(place), body: AI_PREFIX + text, deleted: true })),
    ...[...resolved]
      .filter(([, one]) => all || (one.review === review && (walkthrough.pr || one.by === 'you')))
      .map(([id, one]) => {
        const thread = one.by === 'ai' ? threads.find(found => found.id === id) : undefined;
        return thread ? { kind: 'resolve', thread: id, by: 'ai', ...whereOf(thread), body: AI_PREFIX + (thread.comments[0]?.body ?? '') } : { kind: 'resolve', thread: id };
      }),
  ];
}

/** The text of an AI comment as it is stored: the page shows `[AI]` itself. */
export const withoutPrefix = (body: string) => (body.startsWith(AI_PREFIX) ? body.slice(AI_PREFIX.length).trim() : body.trim());

// A listen from an older release records no start time.
type Listener = { state: 'listening'; pid: number; started?: string } | { state: 'stopped' };
const LISTEN_EVERY_MS = 500;
// Long enough for the session to start listen again after it handled what woke it.
const LISTEN_GAP_MS = 15_000;

const listenerAlive = (dir: string) => {
  const now = readJson<Listener | null>(files(dir).listener, null);
  return now?.state === 'listening' && alive(now);
};

/** A listen ran, and none has been alive for longer than a restart takes. */
export function listenerGone(dir: string): boolean {
  const stat = fs.statSync(files(dir).listener, { throwIfNoEntry: false });
  return !!stat && Date.now() - stat.mtimeMs > LISTEN_GAP_MS && !listenerAlive(dir);
}

/** Forgets a listen that is no longer running, so the page waits for this session's own. */
export const forgetStoppedListener = (dir: string) =>
  hold(dir, () => {
    if (!listenerAlive(dir)) fs.rmSync(files(dir).listener, { force: true });
  });

/** What listen prints for an ask: the question with its lines and the thread so far. */
export function handedAsk(dir: string, event: Event & { kind: 'ask' }): Record<string, unknown> {
  const walkthrough = readWalkthrough(dir);
  const thread = walkthrough && replay(walkthrough, logOf(dir)).threads.find(one => one.comments.some(said => said.id === event.id));
  const before = thread?.comments.slice(0, thread.comments.findIndex(said => said.id === event.id)) ?? [];
  return {
    kind: 'ask',
    id: event.id,
    text: event.text,
    ...(thread && whereOf(thread)),
    thread: before.map(said => ({ by: said.by === 'colleague' ? said.author : said.by, body: said.body })),
  };
}

// A newer listener takes over from this one ('replaced'); a page server that is not running ends it ('stopped').
export async function listen(dir: string, pageRunning: () => boolean): Promise<Event[] | 'stopped' | 'replaced'> {
  const { inbox, listener } = files(dir);
  const mine = () => {
    const now = readJson<Listener | null>(listener, null);
    return now?.state === 'listening' && now.pid === process.pid;
  };
  // Outside the lock: a listen killed while holding it leaves it held until it goes stale.
  const started = psStart(process.pid);
  await hold(dir, () => {
    writeJson(listener, { state: 'listening', pid: process.pid, started } satisfies Listener);
  });
  const release = () =>
    hold(dir, () => {
      if (mine()) writeJson(listener, { state: 'stopped' } satisfies Listener);
    });
  for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP'] as const)
    process.once(signal, () => {
      void release().finally(() => process.exit(0));
    });
  for (;;) {
    const taken = await hold(dir, () => {
      if (!mine()) return 'replaced';
      const events = readLines<Event>(inbox);
      if (!events.length) return null;
      fs.rmSync(inbox, { force: true });
      writeJson(listener, { state: 'stopped' } satisfies Listener);
      return events;
    });
    if (taken) return taken;
    if (!pageRunning()) {
      await release();
      return 'stopped';
    }
    await new Promise(resolve => setTimeout(resolve, LISTEN_EVERY_MS));
  }
}
