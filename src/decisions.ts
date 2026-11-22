// The person's decisions and which steps they read; the tool attaches no meaning to any action.
import crypto from 'node:crypto';
import path from 'node:path';
import { locked, readJson, writeJson } from './json-files';
import { cleanText, conversationOf, type Entry, type PageRequest, request, type SessionView, type Taken } from './session';
import { filled } from './steps';
import { type Action, type Item, itemKey } from './items';
import { readWalkthrough, type Walkthrough } from './walkthrough';

export type Decision = PageRequest & Taken;
/** The walkthrough as the page and the session see it: every item's actions, and its latest decision or null while undecided. */
export type WalkthroughView = Walkthrough & {
  actions: Record<string, Action[]>;
  decided: Record<string, Decision | null>;
  /** The decision each reopened step had before its diff changed, by item key. */
  reopened: Record<string, Decision>;
  /** The ids of the steps the page has shown. */
  read: string[];
};

const STEP_ACTIONS: Action[] = [
  { id: 'approve', label: 'Approve' },
  { id: 'flag', label: 'Flag', note: true },
];

const readFile = (dir: string) => path.join(dir, 'read.json');
const fingerprint = (content: string) => crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
const isDecision = (entry: Entry): entry is Decision => entry.from === 'page' && entry.kind === 'decision';
const keyOf = (value: unknown) => (typeof value === 'object' && value !== null ? itemKey(value as Item) : '');

/** Every item the person can decide on, with what a decision on it is about: a decision outlives no change to that. */
function itemsOf({ steps, checklist, base, head }: Walkthrough, conversation: Entry[]) {
  const items: { item: Item; content: string }[] = [
    ...steps.map(step => ({ item: { type: 'step' as const, id: step.id }, content: step.diff })),
    ...conversation.flatMap(entry =>
      entry.from === 'session' && entry.note ? [{ item: { type: 'note' as const, id: entry.id }, content: entry.text }] : [],
    ),
    ...(checklist?.items ?? []).map(one => ({ item: { type: 'checklist' as const, id: one.id }, content: one.text })),
    { item: { type: 'walkthrough' }, content: `${base}..${head}` },
  ];
  return items.map(one => ({ ...one, key: itemKey(one.item), on: fingerprint(one.content) }));
}

const actionsOf = ({ actions }: Walkthrough, item: Item) =>
  actions?.[itemKey(item)] ?? (item.type === 'step' ? STEP_ACTIONS : []);

/** Each item with the actions it offers and its latest decision, null while undecided; a step decided before its diff changed is reopened. */
export function decisionsOf(walkthrough: Walkthrough, conversation: Entry[]) {
  const decisions = conversation.filter(isDecision);
  return itemsOf(walkthrough, conversation).map(({ item, key, on }) => {
    const decision = decisions.findLast(one => itemKey(one.item) === key && one.on === on) ?? null;
    const earlier = item.type === 'step' && !decision ? decisions.findLast(one => itemKey(one.item) === key) : undefined;
    return { item, key, actions: actionsOf(walkthrough, item), decision, reopened: earlier ?? null };
  });
}

export function walkthroughView(dir: string): WalkthroughView | null {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const items = decisionsOf(walkthrough, conversationOf(dir));
  const read = readJson<string[]>(readFile(dir), []);
  return {
    ...walkthrough,
    actions: Object.fromEntries(items.filter(one => one.actions.length).map(one => [one.key, one.actions])),
    decided: Object.fromEntries(items.map(one => [one.key, one.decision])),
    reopened: Object.fromEntries(items.flatMap(one => (one.reopened ? [[one.key, one.reopened]] : []))),
    read: walkthrough.steps.filter(step => read.includes(`${step.id}:${fingerprint(step.diff)}`)).map(step => step.id),
  };
}

const ITEM_TYPES = new Set(['step', 'note', 'checklist', 'walkthrough']);
const nameOfItem = (item: Item) =>
  item.type === 'walkthrough' ? 'the walkthrough' : `${item.type === 'checklist' ? 'checklist item' : item.type} ${item.id}`;

/** The actions the session sent for each item, or an error naming the first that does not fit the walkthrough. */
export function parseActions(text: string, walkthrough: Walkthrough, conversation: Entry[]): { item: Item; actions: Action[] }[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  if (!Array.isArray(parsed)) throw new Error('the actions must be a JSON array on standard input; see walkthrough guide');
  const known = new Map(itemsOf(walkthrough, conversation).map(one => [one.key, one.item]));
  return parsed.map((one: unknown, at) => {
    const fail = (problem: string) => new Error(`entry ${String(at + 1)}: ${problem}`);
    const { item, actions } = (one ?? {}) as Record<string, unknown>;
    const { type } = (item ?? {}) as Record<string, unknown>;
    if (typeof type !== 'string' || !ITEM_TYPES.has(type))
      throw fail('the item must be a step, a note, a checklist item or the walkthrough');
    const found = known.get(keyOf(item));
    if (!found) throw fail(`the walkthrough has no ${nameOfItem(item as Item)}`);
    if (!Array.isArray(actions)) throw fail('actions must be a list');
    const ids = new Set<string>();
    return {
      item: found,
      actions: actions.map((fields: unknown, number) => {
        const name = `action ${String(number + 1)}`;
        const { id, label, note = false, edit = false } = (fields ?? {}) as Record<string, unknown>;
        if (!filled(id)) throw fail(`${name} needs an id`);
        if (!filled(label)) throw fail(`${name} needs a label`);
        if (typeof note !== 'boolean') throw fail(`${name}: note must be true or false`);
        if (typeof edit !== 'boolean') throw fail(`${name}: edit must be true or false`);
        if (edit && found.type !== 'note' && found.type !== 'checklist')
          throw fail(`${name}: only a note or a checklist item has text to edit`);
        if (ids.has(id)) throw fail(`two actions have the id ${id}`);
        ids.add(id);
        return { id, label, ...(note && { note: true as const }), ...(edit && { edit: true as const }) };
      }),
    };
  });
}

/** Records the action the person took on an item, or null when the item does not offer it or its note or text is missing or not asked for. */
export function decide(
  dir: string,
  { item, action, note, text }: Record<string, unknown>,
): { walkthrough: WalkthroughView | null; session: SessionView } | null {
  const walkthrough = readWalkthrough(dir);
  const found = walkthrough && itemsOf(walkthrough, conversationOf(dir)).find(one => one.key === keyOf(item));
  const offered = found && actionsOf(walkthrough, found.item).find(one => one.id === action);
  if (!found || !offered) return null;
  if (offered.note ? !filled(note) : note !== undefined) return null;
  if (offered.edit ? !filled(text) : text !== undefined) return null;
  const session = request(dir, {
    kind: 'decision',
    item: found.item,
    action: offered.id,
    ...(offered.note && { note: cleanText(note) }),
    ...(offered.edit && { text: cleanText(text) }),
    on: found.on,
  });
  return { walkthrough: walkthroughView(dir), session };
}

/** Marks the step as shown on the page, or null when there is no such step. */
export function markRead(dir: string, stepId: unknown): WalkthroughView | null {
  const step = readWalkthrough(dir)?.steps.find(one => one.id === stepId);
  if (!step) return null;
  const file = readFile(dir);
  const mark = `${step.id}:${fingerprint(step.diff)}`;
  locked(file, () => {
    const read = readJson<string[]>(file, []);
    if (!read.includes(mark)) writeJson(file, [...read, mark]);
  });
  return walkthroughView(dir);
}
