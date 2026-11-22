// The conversation between the page and the Claude Code session that drives the walkthrough, and whether that session listens.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { locked, readJson, writeJson } from './json-files';
import { type NoteInput, type NoteMark, type Place, placeIn } from './notes';
import { alive, psStart } from './processes';
import type { Item } from './items';
import { readWalkthrough } from './walkthrough';

/** `on` fingerprints the item as it was decided. */
export type Taken = { kind: 'decision'; item: Item; action: string; note?: string; text?: string; on: string };
export type PageRequest = { id: string; from: 'page'; at: string } & (
  | ({ kind: 'ask'; text: string } & Place)
  | { kind: 'reply'; to: string; text: string }
  | Taken
);
export type SessionMessage = {
  id: string;
  from: 'session';
  at: string;
  text: string;
  answer?: string;
  question?: true;
  choices?: string[];
  note?: NoteMark;
};
export type Entry = PageRequest | SessionMessage;
export type SessionState = 'listening' | 'working' | 'needs-you' | 'gone';
export type SessionView = { state: SessionState; conversation: Entry[] };

type Listener =
  | { state: 'starting' }
  | { state: 'listening'; pid: number; started: string }
  | { state: 'handed'; requests: string[] }
  | { state: 'stopped' };

// A session answers and then listens again; until this has passed it has not had the chance to come back.
const BACK_WITHIN_MS = 60 * 1000;
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
export const cleanText = (text: unknown) => (typeof text === 'string' ? text.trim() : '');

const openQuestions = (conversation: Entry[]) =>
  conversation.filter(
    entry =>
      entry.from === 'session' &&
      entry.question &&
      !conversation.some(reply => reply.from === 'page' && reply.kind === 'reply' && reply.to === entry.id),
  );

function presence(listener: Listener | null, conversation: Entry[]): Exclude<SessionState, 'needs-you'> {
  switch (listener?.state) {
    case 'starting':
      return 'working';
    case 'listening':
      return alive(listener) ? 'listening' : 'gone';
    case 'handed': {
      const answered = listener.requests.map(id =>
        conversation.find(entry => entry.from === 'session' && entry.answer === id),
      );
      if (answered.some(answer => !answer)) return 'working';
      const last = Math.max(...answered.map(answer => Date.parse(answer?.at ?? '')));
      const backWithin = Number(process.env['WALKTHROUGH_BACK_WITHIN_MS']) || BACK_WITHIN_MS;
      return Date.now() - last < backWithin ? 'working' : 'gone';
    }
    default:
      return 'gone';
  }
}

export const conversationOf = (dir: string) => readLines<Entry>(files(dir).conversation);

export function sessionView(dir: string): SessionView {
  const conversation = conversationOf(dir);
  const { listener } = files(dir);
  const state = openQuestions(conversation).length
    ? 'needs-you'
    : presence(readJson<Listener | null>(listener, null), conversation);
  return { state, conversation };
}

/** The session started the walkthrough, so it works on it until it listens; a running listener keeps listening. */
export async function starting(dir: string): Promise<void> {
  await hold(dir, () => {
    const { listener } = files(dir);
    const now = readJson<Listener | null>(listener, null);
    if (now?.state !== 'listening' || !alive(now)) writeJson(listener, { state: 'starting' } satisfies Listener);
  });
}

type Fields<T> = T extends unknown ? Omit<T, 'id' | 'from' | 'at'> : never;

export function request(dir: string, fields: Fields<PageRequest>): Promise<SessionView> {
  const entry = { id: newId(), from: 'page', at: stamp(), ...fields } as PageRequest;
  return hold(dir, () => {
    append(files(dir).conversation, entry);
    append(files(dir).inbox, entry);
    return sessionView(dir);
  });
}

export async function ask(dir: string, { text, ...where }: Record<string, unknown>): Promise<SessionView | null> {
  const said = cleanText(text);
  let place: Place;
  try {
    place = placeIn(readWalkthrough(dir), where);
  } catch {
    return null;
  }
  if (!said) return null;
  return request(dir, { kind: 'ask', ...place, text: said });
}

export async function reply(dir: string, to: unknown, text: unknown): Promise<SessionView | null> {
  const said = cleanText(text);
  const conversation = conversationOf(dir);
  const open =
    openQuestions(conversation).some(question => question.id === to) ||
    conversation.some(entry => entry.from === 'session' && entry.note && entry.id === to);
  if (!said || !open || typeof to !== 'string') return null;
  return request(dir, { kind: 'reply', to, text: said });
}

export async function say(
  dir: string,
  text: string,
  { answer, question, choice = [] }: { answer?: string; question?: boolean; choice?: string[] },
): Promise<void> {
  const choices = choice.map(one => one.trim());
  if (choices.length && !question) throw new Error('--choice needs --question');
  if (choices.some(one => !one)) throw new Error('a choice needs text');
  await hold(dir, () => {
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
      ...(choices.length && { choices }),
    });
  });
}

export function note(dir: string, notes: NoteInput[]): Promise<(SessionMessage & { note: NoteMark })[]> {
  return hold(dir, () =>
    notes.map(({ text, ...mark }) => {
      const entry = { id: newId(), from: 'session', at: stamp(), text, note: mark } satisfies SessionMessage;
      append(files(dir).conversation, entry);
      return entry;
    }),
  );
}

// A newer listener takes over from this one ('replaced'); a page server that is not running ends it ('stopped').
export async function listen(dir: string, pageRunning: () => boolean): Promise<PageRequest[] | 'stopped' | 'replaced'> {
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
  // Claude Code stops a background command with a signal; the page should not show it listening after that.
  for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP'] as const)
    process.once(signal, () => {
      void release().finally(() => process.exit(0));
    });
  for (;;) {
    const taken = await hold(dir, () => {
      if (!mine()) return 'replaced';
      const requests = readLines<PageRequest>(inbox);
      if (!requests.length) return null;
      fs.rmSync(inbox, { force: true });
      writeJson(listener, { state: 'handed', requests: requests.map(one => one.id) } satisfies Listener);
      return requests;
    });
    if (taken) return taken;
    if (!pageRunning()) {
      await release();
      return 'stopped';
    }
    await new Promise(resolve => setTimeout(resolve, LISTEN_EVERY_MS));
  }
}
