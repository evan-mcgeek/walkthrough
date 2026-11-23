// The person's decisions and which steps they read; the tool attaches no meaning to any action.
import crypto from 'node:crypto';
import path from 'node:path';
import { locked, readJson, writeJson } from './json-files';
import { cleanText, type Cleared, conversationOf, type Entry, type PageRequest, request, type SessionView, type Taken } from './session';
import { anchorOf } from './notes';
import { fieldsOf, filled, parseList } from './input';
import { type Action, type Item, itemKey, STEP_ACTIONS } from './items';
import { readWalkthrough, type Walkthrough } from './walkthrough';

export type Decision = PageRequest & Taken;
type Choice = PageRequest & (Taken | Cleared);
export type WalkthroughView = Walkthrough & {
  actions: Record<string, Action[]>;
  decided: Record<string, Decision | null>;
  /** The decision each reopened item had before what it is about changed, by item key. */
  reopened: Record<string, Decision>;
  /** What a decision on each item is bound to, by item key; the page sends back the one it showed. */
  on: Record<string, string>;
  /** The ids of the steps the page has shown. */
  read: string[];
  /** The id of the step each note and ask shows on, by its id, null when its step or lines are gone. */
  anchored: Record<string, string | null>;
};

const readFile = (dir: string) => path.join(dir, 'read.json');
const fingerprint = (content: string) => crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
const isChoice = (entry: Entry): entry is Choice => entry.from === 'page' && entry.kind === 'decision';
const taken = (choice: Choice | undefined): Decision | null => (choice && !('clear' in choice) ? choice : null);
const keyOf = (value: unknown) => (typeof value === 'object' && value !== null ? itemKey(value as Item) : '');

// A decision outlives no change to what it is about.
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

export function decisionsOf(walkthrough: Walkthrough, conversation: Entry[]) {
  const choices = conversation.filter(isChoice);
  return itemsOf(walkthrough, conversation).map(({ item, key, on }) => {
    const latest = choices.findLast(one => itemKey(one.item) === key && one.on === on);
    // A clear on what the item is now leaves nothing to reopen.
    const earlier = latest ? undefined : choices.findLast(one => itemKey(one.item) === key);
    return { item, key, on, actions: actionsOf(walkthrough, item), decision: taken(latest), reopened: taken(earlier) };
  });
}

export function walkthroughView(dir: string): WalkthroughView | null {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const conversation = conversationOf(dir);
  const items = decisionsOf(walkthrough, conversation);
  const read = readJson<string[]>(readFile(dir), []);
  return {
    ...walkthrough,
    actions: Object.fromEntries(items.filter(one => one.actions.length).map(one => [one.key, one.actions])),
    decided: Object.fromEntries(items.map(one => [one.key, one.decision])),
    reopened: Object.fromEntries(items.flatMap(one => (one.reopened ? [[one.key, one.reopened]] : []))),
    on: Object.fromEntries(items.map(one => [one.key, one.on])),
    read: walkthrough.steps.filter(step => read.includes(`${step.id}:${fingerprint(step.diff)}`)).map(step => step.id),
    anchored: Object.fromEntries(
      conversation.flatMap(entry => {
        const place = entry.from === 'session' ? entry.note : entry.kind === 'ask' ? entry : undefined;
        return place ? [[entry.id, anchorOf(walkthrough, place)]] : [];
      }),
    ),
  };
}

const ITEM_TYPES = new Set(['step', 'note', 'checklist', 'walkthrough']);
const nameOfItem = (item: Item) =>
  item.type === 'walkthrough' ? 'the walkthrough' : `${item.type === 'checklist' ? 'checklist item' : item.type} ${item.id}`;

export function parseActions(text: string, walkthrough: Walkthrough, conversation: Entry[]): { item: Item; actions: Action[] }[] {
  const known = new Map(itemsOf(walkthrough, conversation).map(one => [one.key, one.item]));
  return parseList(text, 'the actions', ({ item, actions }, number) => {
    const fail = (problem: string) => new Error(`entry ${String(number)}: ${problem}`);
    const { type } = fieldsOf(item);
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
        const { id, label, note = false, edit = false } = fieldsOf(fields);
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

type Decided = { walkthrough: WalkthroughView | null; session: SessionView };
/** The item changed after the page showed it, so a decision sent on it would bind what the person never saw. */
export const CHANGED = 'changed';

export async function decide(
  dir: string,
  { item, action, note, text, clear, on }: Record<string, unknown>,
): Promise<Decided | typeof CHANGED | null> {
  const walkthrough = readWalkthrough(dir);
  const conversation = conversationOf(dir);
  const found = walkthrough && itemsOf(walkthrough, conversation).find(one => one.key === keyOf(item));
  if (!found) return null;
  if (on !== undefined && on !== found.on) return CHANGED;
  if (clear !== undefined) {
    const decided = decisionsOf(walkthrough, conversation).find(one => one.key === found.key)?.decision;
    if (clear !== true || !decided || action !== undefined || note !== undefined || text !== undefined) return null;
    const session = await request(dir, { kind: 'decision', item: found.item, clear: true, on: found.on });
    return { walkthrough: walkthroughView(dir), session };
  }
  const offered = actionsOf(walkthrough, found.item).find(one => one.id === action);
  if (!offered) return null;
  if (offered.note ? !filled(note) : note !== undefined) return null;
  if (offered.edit ? !filled(text) : text !== undefined) return null;
  const session = await request(dir, {
    kind: 'decision',
    item: found.item,
    action: offered.id,
    ...(offered.note && { note: cleanText(note) }),
    ...(offered.edit && { text: cleanText(text) }),
    on: found.on,
  });
  return { walkthrough: walkthroughView(dir), session };
}

export async function markRead(dir: string, stepId: unknown, on?: unknown): Promise<WalkthroughView | typeof CHANGED | null> {
  const step = readWalkthrough(dir)?.steps.find(one => one.id === stepId);
  if (!step) return null;
  if (on !== undefined && on !== fingerprint(step.diff)) return CHANGED;
  const file = readFile(dir);
  const mark = `${step.id}:${fingerprint(step.diff)}`;
  await locked(file, () => {
    const read = readJson<string[]>(file, []);
    if (!read.includes(mark)) writeJson(file, [...read, mark]);
  });
  return walkthroughView(dir);
}
