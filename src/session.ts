// The conversation between the page and the Claude Code session that drives the walkthrough, and whether that session listens.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { locked, readJson, writeJson } from './json-files';
import { type NoteInput, type NoteMark, type Place, placeIn } from './notes';
import { alive, psStart } from './processes';
import { readWalkthrough } from './walkthrough';

/** What the person sends from the page; `listen` hands these to the session. */
export type PageRequest = { id: string; from: 'page'; at: string; text: string } & (
  | ({ kind: 'ask' } & Place)
  | { kind: 'reply'; to: string }
);
/** What the session says on the page: an answer, a question for the person, a note pinned to a place, or else a note at the top. */
export type SessionMessage = {
  id: string;
  from: 'session';
  at: string;
  text: string;
  answer?: string;
  question?: true;
  note?: NoteMark;
};
export type Entry = PageRequest | SessionMessage;
export type SessionState = 'listening' | 'working' | 'needs-you' | 'quiet';
export type SessionView = { state: SessionState; conversation: Entry[] };

/** Either a running listener, or the time the session took requests and has not listened since. */
type Listener = { pid: number; started: string } | { pid: null; busy: string };

const MAX_TEXT = 4000;
// Working this long without listening again, the session has most likely stopped.
const QUIET_AFTER_MS = 10 * 60 * 1000;
const LISTEN_EVERY_MS = 500;

const files = (dir: string) => ({
  conversation: path.join(dir, 'conversation.jsonl'),
  inbox: path.join(dir, 'inbox.jsonl'),
  listener: path.join(dir, 'listener.json'),
});
// One lock for all of them: a request, an answer and a listener taking requests never interleave.
const hold = <T>(dir: string, work: () => T) => locked(path.join(dir, 'session'), work);

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
const append = (file: string, entry: Entry) => {
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
};
const newId = () => crypto.randomBytes(4).toString('hex');
const stamp = () => new Date().toISOString();
const cleanText = (text: unknown) => (typeof text === 'string' ? text.trim().slice(0, MAX_TEXT) : '');

/** Questions the session asked that the person has not replied to. */
const openQuestions = (conversation: Entry[]) =>
  conversation.filter(
    entry =>
      entry.from === 'session' &&
      entry.question &&
      !conversation.some(reply => reply.from === 'page' && reply.kind === 'reply' && reply.to === entry.id),
  );

export function sessionView(dir: string): SessionView {
  const { conversation: file, listener: marker } = files(dir);
  const conversation = readLines<Entry>(file);
  const listener = readJson<Listener | null>(marker, null);
  const state: SessionState = openQuestions(conversation).length
    ? 'needs-you'
    : listener?.pid && alive(listener)
      ? 'listening'
      : listener?.pid === null && Date.now() - Date.parse(listener.busy) < QUIET_AFTER_MS
        ? 'working'
        : 'quiet';
  return { state, conversation };
}

function request(dir: string, entry: PageRequest): SessionView {
  return hold(dir, () => {
    append(files(dir).conversation, entry);
    append(files(dir).inbox, entry);
    return sessionView(dir);
  });
}

/** The person's question about a step or lines of it, or null when there is no such place or no question. */
export function ask(dir: string, { text, ...where }: Record<string, unknown>): SessionView | null {
  const said = cleanText(text);
  let place: Place;
  try {
    place = placeIn(readWalkthrough(dir), where);
  } catch {
    return null;
  }
  if (!said) return null;
  return request(dir, { id: newId(), from: 'page', at: stamp(), kind: 'ask', ...place, text: said });
}

/** The person's reply to a note or an open question of the session, or null when there is no such one or no reply. */
export function reply(dir: string, to: unknown, text: unknown): SessionView | null {
  const said = cleanText(text);
  const conversation = readLines<Entry>(files(dir).conversation);
  const open =
    openQuestions(conversation).some(question => question.id === to) ||
    conversation.some(entry => entry.from === 'session' && entry.note && entry.id === to);
  if (!said || !open || typeof to !== 'string') return null;
  return request(dir, { id: newId(), from: 'page', at: stamp(), kind: 'reply', to, text: said });
}

/** Puts the session's words on the page; `answer` names the ask they answer. */
export function say(dir: string, text: string, { answer, question }: { answer?: string; question?: boolean }): void {
  hold(dir, () => {
    const { conversation } = files(dir);
    if (answer && !readLines<Entry>(conversation).some(entry => entry.from === 'page' && entry.id === answer))
      throw new Error(`the page sent no request ${answer}`);
    append(conversation, {
      id: newId(),
      from: 'session',
      at: stamp(),
      text,
      ...(answer && { answer }),
      ...(question && { question: true as const }),
    });
  });
}

/** Pins the session's notes to their places on the page, in order. */
export function note(dir: string, notes: NoteInput[]): (SessionMessage & { note: NoteMark })[] {
  return hold(dir, () =>
    notes.map(({ text, ...mark }) => {
      const entry = { id: newId(), from: 'session', at: stamp(), text, note: mark } satisfies SessionMessage;
      append(files(dir).conversation, entry);
      return entry;
    }),
  );
}

/**
 * Waits for the person to act on the page and returns what they sent.
 * A newer listener takes over from this one ('replaced'); a page server that is not running ends it ('stopped').
 */
export async function listen(dir: string, pageRunning: () => boolean): Promise<PageRequest[] | 'stopped' | 'replaced'> {
  const { inbox, listener } = files(dir);
  const mine = () => readJson<Listener | null>(listener, null)?.pid === process.pid;
  hold(dir, () => {
    writeJson(listener, { pid: process.pid, started: psStart(process.pid) } satisfies Listener);
  });
  const release = () => {
    hold(dir, () => {
      if (mine()) fs.rmSync(listener, { force: true });
    });
  };
  // Claude Code stops a background command with a signal; the page should not show it listening after that.
  for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP'] as const)
    process.once(signal, () => {
      release();
      process.exit(0);
    });
  for (;;) {
    const taken = hold(dir, () => {
      if (!mine()) return 'replaced';
      const requests = readLines<PageRequest>(inbox);
      if (!requests.length) return null;
      fs.rmSync(inbox, { force: true });
      writeJson(listener, { pid: null, busy: stamp() } satisfies Listener);
      return requests;
    });
    if (taken) return taken;
    if (!pageRunning()) {
      release();
      return 'stopped';
    }
    await new Promise(resolve => setTimeout(resolve, LISTEN_EVERY_MS));
  }
}
