// The review: every comment, ask, answer, resolve and submit, kept as a log the page and the session append to.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { type FileStat, fileStats } from './change';
import { parseDiff } from './diff';
import { locked, readJson, writeJson } from './json-files';
import { anchorOf, type Lines, type Place, placeIn } from './lines';
import { alive, psStart } from './processes';
import { readWalkthrough, type Step, type Walkthrough } from './walkthrough';

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
    | { kind: 'resolve'; thread: string }
    | { kind: 'submit'; type: ReviewType; summary: string; head: string }
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
  lines: Lines;
  /** The step it shows in, null once its lines changed or left the change. */
  step: string | null;
  colleague?: true;
  resolved?: true;
  comments: CommentView[];
};
export type Submitted = { id: string; type: ReviewType; summary: string; comments: number; posted: boolean; address?: string };
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
};

const files = (dir: string) => ({
  log: path.join(dir, 'review.jsonl'),
  inbox: path.join(dir, 'inbox.jsonl'),
  listener: path.join(dir, 'listener.json'),
  viewed: path.join(dir, 'viewed.json'),
});
// One lock for the log, the inbox and the listener: an event and a listener taking events never interleave.
const hold = <T>(dir: string, work: () => T) => locked(path.join(dir, 'review'), work);

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

type Comment = { view: CommentView; thread: string; deleted?: true };

/** The review as the log builds it: each thread with its comments, and the submits in order. */
function replay(walkthrough: Walkthrough, log: Event[]) {
  const comments = new Map<string, Comment>();
  const roots = new Map<string, Place>();
  const resolved = new Map<string, string | undefined>();
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
        comments.set(event.id, { view, thread });
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
        comments.set(event.id, { view: { id: event.id, at: event.at, body: event.text, by: 'ai', answer: true }, thread: ask.thread });
        break;
      }
      case 'resolve':
        if (!resolved.has(event.thread)) resolved.set(event.thread, undefined);
        break;
      case 'submit':
        submits.push(event);
        for (const { view, deleted } of comments.values())
          if (view.pending && !deleted) {
            delete view.pending;
            view.review = event.id;
          }
        for (const [thread, review] of resolved) if (review === undefined) resolved.set(thread, event.id);
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
  const threads: ThreadView[] = [
    ...(walkthrough.threads ?? []).map(({ id, file, lines, linesHash = '', resolved: was, author, at, body, replies }): ThreadView => ({
      id,
      file,
      lines,
      step: anchorOf(walkthrough, { file, lines, linesHash }),
      colleague: true,
      ...((was || resolved.has(id)) && { resolved: true }),
      comments: [
        { id, by: 'colleague', author, at, body },
        ...replies.map((reply, number): CommentView => ({ id: `${id}.${String(number + 1)}`, by: 'colleague', ...reply })),
        ...ownIn(id),
      ],
    })),
    ...[...roots]
      .filter(([id]) => !gone.has(id))
      .map(([id, place]): ThreadView => ({ id, file: place.file, lines: place.lines, step: anchorOf(walkthrough, place), comments: ownIn(id) })),
  ];
  return { threads, submits, posted, resolved, kept };
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
  const stats = ['walkthrough.json', 'review.jsonl', 'viewed.json', 'listener.json'].map(name => {
    const stat = fs.statSync(path.join(dir, name), { throwIfNoEntry: false });
    return stat ? `${String(stat.ino)}-${String(stat.size)}-${String(stat.mtimeMs)}` : '';
  });
  return fingerprint([...stats, String(listenerGone(dir))].join(':'));
}

export function walkthroughView(dir: string): WalkthroughView | null {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const { threads, submits, posted, kept } = replay(walkthrough, logOf(dir));
  const marks = readJson<string[]>(files(dir).viewed, []);
  const current = fileMarks(walkthrough.steps);
  const last = submits.at(-1);
  const showsSubmitted = last && last.head === walkthrough.head && !kept.some(one => one.pending);
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
          type: last.type,
          summary: last.summary,
          comments: kept.filter(one => one.review === last.id).length,
          posted: posted.has(last.id),
          ...(address !== undefined && { address }),
        }
      : null,
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
    if (!threads.some(one => one.id === thread && !one.resolved)) return false;
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

export async function resolve(dir: string, { thread }: Record<string, unknown>): Promise<boolean> {
  const walkthrough = readWalkthrough(dir);
  const found = walkthrough && replay(walkthrough, logOf(dir)).threads.find(one => one.id === thread);
  return !!found?.colleague && !found.resolved && !!(await record(dir, { kind: 'resolve', thread: found.id }));
}

/** Your own change goes to the agent only with something to fix or a decision: no comments and Comment sends nothing. */
export async function submit(dir: string, { type, summary }: Record<string, unknown>): Promise<boolean> {
  const view = walkthroughView(dir);
  if (!view || !REVIEW_TYPES.includes(type as ReviewType) || (summary !== undefined && typeof summary !== 'string') || view.submitted)
    return false;
  const pending = view.threads.flatMap(one => one.comments).filter(one => one.pending).length;
  if (!view.pr && type === 'comment' && !pending) return false;
  return !!(await record(dir, { kind: 'submit', type: type as ReviewType, summary: cleanText(summary), head: view.head }));
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
export function aiComments(dir: string, given: { place: Place; body: string }[]): Promise<Event[]> {
  return Promise.all(given.map(({ place, body }) => record(dir, { kind: 'comment', by: 'ai', text: body, place })));
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

/** What goes out: the latest submitted review not yet posted, or else what is pending, as one line each. */
export function reviewComments(dir: string): Record<string, unknown>[] {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return [];
  const log = logOf(dir);
  const { threads, submits, posted, resolved } = replay(walkthrough, log);
  const review = submits.findLast(one => !posted.has(one.id))?.id;
  const inReview = (one: CommentView) => (review === undefined ? one.pending : one.review === review);
  return [
    ...threads.flatMap(thread =>
      thread.comments.filter(inReview).map(one => {
        const body = one.by === 'ai' ? AI_PREFIX + one.body : one.body;
        const by = one.by === 'colleague' ? one.author : one.by;
        return one.id === thread.id
          ? { kind: 'comment', id: one.id, by, file: thread.file, lines: thread.lines, body, ...(thread.step === null && { outdated: true }) }
          : { kind: 'reply', id: one.id, by, thread: thread.id, body };
      }),
    ),
    ...[...resolved].filter(([, round]) => round === review).map(([thread]) => ({ kind: 'resolve', thread })),
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
    ...(thread && { file: thread.file, lines: thread.lines }),
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
  await hold(dir, () => {
    writeJson(listener, { state: 'listening', pid: process.pid, started: psStart(process.pid) } satisfies Listener);
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
