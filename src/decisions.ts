// The person's decisions and which steps they read; the tool attaches no meaning to any action.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { locked, readJson, writeJson } from './json-files';
import { cleanText, type Cleared, conversationOf, type Entry, type PageRequest, postedOf, request, type SessionView, type Taken } from './session';
import { anchorOf } from './notes';
import { parseDiff } from './diff';
import { fieldsOf, filled, parseList } from './input';
import { type Action, CONSEQUENCE_WORDS, type Item, itemKey, OUTCOME_WORDS, STEP_ACTIONS, type Tone, TONES } from './items';
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
  /** The paths of the files the person marked viewed, while their diff is unchanged; a reading mark, never a decision. */
  viewed: string[];
  /** The ids of the person's comments the session marked posted. */
  posted: string[];
  /** The id of the step each note, ask and comment shows on, by its id, null when its step or lines are gone. */
  anchored: Record<string, string | null>;
};

const readFile = (dir: string) => path.join(dir, 'read.json');
const viewedFile = (dir: string) => path.join(dir, 'viewed.json');
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
    { item: { type: 'verdict' }, content: `${base}..${head}` },
    { item: { type: 'walkthrough' }, content: `${base}..${head}` },
  ];
  return items.map(one => ({ ...one, key: itemKey(one.item), on: fingerprint(one.content) }));
}

// A step action recorded as a built-in one takes the built-in's tone and outcome where it gives none, as a policy written before them says.
const toned = (action: Action): Action => {
  const own = STEP_ACTIONS.find(one => one.id === action.id && one.label === action.label && !one.note === !action.note);
  return own ? { ...own, ...action } : action;
};

const actionsOf = ({ actions }: Walkthrough, item: Item) => {
  if (item.type !== 'step') return actions?.[itemKey(item)] ?? [];
  return actions?.[itemKey(item)]?.map(toned) ?? STEP_ACTIONS;
};

export function decisionsOf(walkthrough: Walkthrough, conversation: Entry[]) {
  const choices = conversation.filter(isChoice);
  return itemsOf(walkthrough, conversation).map(({ item, key, on }) => {
    const latest = choices.findLast(one => itemKey(one.item) === key && one.on === on);
    // A clear on what the item is now leaves nothing to reopen.
    const earlier = latest ? undefined : choices.findLast(one => itemKey(one.item) === key);
    return { item, key, on, actions: actionsOf(walkthrough, item), decision: taken(latest), reopened: taken(earlier) };
  });
}

/** Changes whenever a file walkthroughView reads does, so the page's poll of an unchanged view is answered without one. */
export function walkthroughVersion(dir: string): string {
  const stats = ['walkthrough.json', 'conversation.jsonl', 'read.json', 'viewed.json', 'posted.json'].map(name => {
    const stat = fs.statSync(path.join(dir, name), { throwIfNoEntry: false });
    return stat ? `${String(stat.ino)}-${String(stat.size)}-${String(stat.mtimeMs)}` : '';
  });
  return fingerprint(stats.join(':'));
}

export function walkthroughView(dir: string): WalkthroughView | null {
  const walkthrough = readWalkthrough(dir);
  if (!walkthrough) return null;
  const conversation = conversationOf(dir);
  const items = decisionsOf(walkthrough, conversation);
  const read = readJson<string[]>(readFile(dir), []);
  const viewed = readJson<string[]>(viewedFile(dir), []);
  return {
    ...walkthrough,
    actions: Object.fromEntries(items.filter(one => one.actions.length).map(one => [one.key, one.actions])),
    decided: Object.fromEntries(items.map(one => [one.key, one.decision])),
    reopened: Object.fromEntries(items.flatMap(one => (one.reopened ? [[one.key, one.reopened]] : []))),
    on: Object.fromEntries(items.map(one => [one.key, one.on])),
    read: walkthrough.steps.filter(step => read.includes(`${step.id}:${fingerprint(step.diff)}`)).map(step => step.id),
    posted: postedOf(dir),
    viewed: Object.entries(fileMarks(walkthrough)).flatMap(([file, mark]) => (viewed.includes(mark) ? [file] : [])),
    anchored: Object.fromEntries(
      conversation.flatMap(entry => {
        const place = entry.from === 'session' ? entry.note : entry.kind === 'ask' || entry.kind === 'comment' ? entry : undefined;
        return place ? [[entry.id, anchorOf(walkthrough, place)]] : [];
      }),
    ),
  };
}

const ITEM_TYPES = new Set(['step', 'note', 'checklist', 'verdict', 'walkthrough']);
const wordCount = (text: string) => text.trim().split(/\s+/).length;
const nameOfItem = (item: Item) =>
  'id' in item ? `${item.type === 'checklist' ? 'checklist item' : item.type} ${item.id}` : `the ${item.type}`;

export function parseActions(
  text: string,
  walkthrough: Walkthrough,
  conversation: Entry[],
): { item: Item; actions: Action[]; hint?: string }[] {
  const known = new Map(itemsOf(walkthrough, conversation).map(one => [one.key, one.item]));
  return parseList(text, 'the actions', ({ item, actions, hint }, number) => {
    const fail = (problem: string) => new Error(`entry ${String(number)}: ${problem}`);
    const { type } = fieldsOf(item);
    if (typeof type !== 'string' || !ITEM_TYPES.has(type))
      throw fail('the item must be a step, a note, a checklist item, the verdict or the walkthrough');
    const found = known.get(keyOf(item));
    if (!found) throw fail(`the walkthrough has no ${nameOfItem(item as Item)}`);
    if (!Array.isArray(actions)) throw fail('actions must be a list');
    if (hint !== undefined && !filled(hint)) throw fail('a hint needs words');
    if (hint !== undefined && 'id' in found) throw fail('only the verdict and the walkthrough take a hint');
    const ids = new Set<string>();
    let primaryName: string | undefined;
    return {
      item: found,
      actions: actions.map((fields: unknown, number) => {
        const name = `action ${String(number + 1)}`;
        const { id, label, note = false, edit = false, tone, consequence, outcome, primary = false } = fieldsOf(fields);
        if (!filled(id)) throw fail(`${name} needs an id`);
        if (!filled(label)) throw fail(`${name} needs a label`);
        if (typeof note !== 'boolean') throw fail(`${name}: note must be true or false`);
        if (typeof edit !== 'boolean') throw fail(`${name}: edit must be true or false`);
        if (tone !== undefined && !TONES.includes(tone as Tone)) throw fail(`${name}: tone must be positive, attention or none`);
        if (consequence !== undefined && !filled(consequence)) throw fail(`${name}: a consequence needs words`);
        if (consequence !== undefined && wordCount(consequence) > CONSEQUENCE_WORDS)
          throw fail(`${name}: a consequence is at most ${String(CONSEQUENCE_WORDS)} words`);
        if (outcome !== undefined && !filled(outcome)) throw fail(`${name}: an outcome needs words`);
        if (outcome !== undefined && wordCount(outcome) > OUTCOME_WORDS)
          throw fail(`${name}: an outcome is at most ${String(OUTCOME_WORDS)} words`);
        if (typeof primary !== 'boolean') throw fail(`${name}: primary must be true or false`);
        if (primary && primaryName) throw fail(`${name}: ${primaryName} is already primary, and an item has one at most`);
        if (primary) primaryName = name;
        if (edit && found.type !== 'note' && found.type !== 'checklist')
          throw fail(`${name}: only a note or a checklist item has text to edit`);
        if (ids.has(id)) throw fail(`two actions have the id ${id}`);
        ids.add(id);
        return {
          id,
          label,
          ...(note && { note: true as const }),
          ...(edit && { edit: true as const }),
          ...(tone !== undefined && { tone: tone as Tone }),
          ...(consequence !== undefined && { consequence: consequence.trim() }),
          ...(outcome !== undefined && { outcome: outcome.trim() }),
          ...(primary && { primary: true as const }),
        };
      }),
      ...(hint !== undefined && { hint: hint.trim() }),
    };
  });
}

/** While the session offers a verdict and none is chosen, the walkthrough's first action, its finishing one, waits. */
function waitsForVerdict(walkthrough: Walkthrough, conversation: Entry[], item: Item): boolean {
  if (item.type !== 'walkthrough' || !actionsOf(walkthrough, { type: 'verdict' }).length) return false;
  return !decisionsOf(walkthrough, conversation).find(one => one.item.type === 'verdict')?.decision;
}

type Decided = { walkthrough: WalkthroughView | null; session: SessionView };
/** The item changed after the page showed it, so a decision sent on it would bind what the person never saw. */
export const CHANGED = 'changed';
/** The session is still checking the step, so its findings may not all be on the page yet. */
export const CHECKING = 'checking';

export async function decide(
  dir: string,
  { item, action, note, text, clear, on }: Record<string, unknown>,
): Promise<Decided | typeof CHANGED | typeof CHECKING | null> {
  const walkthrough = readWalkthrough(dir);
  const conversation = conversationOf(dir);
  const found = walkthrough && itemsOf(walkthrough, conversation).find(one => one.key === keyOf(item));
  if (!found) return null;
  if (on !== undefined && on !== found.on) return CHANGED;
  if (found.item.type === 'step' && walkthrough.checking?.includes(found.item.id)) return CHECKING;
  if (clear !== undefined) {
    const decided = decisionsOf(walkthrough, conversation).find(one => one.key === found.key)?.decision;
    if (clear !== true || !decided || action !== undefined || note !== undefined || text !== undefined) return null;
    const session = await request(dir, { kind: 'decision', item: found.item, clear: true, on: found.on });
    return { walkthrough: walkthroughView(dir), session };
  }
  const offered = actionsOf(walkthrough, found.item).find(one => one.id === action);
  if (!offered) return null;
  if (offered === actionsOf(walkthrough, found.item)[0] && waitsForVerdict(walkthrough, conversation, found.item)) return null;
  if (offered.note ? note !== undefined && typeof note !== 'string' : note !== undefined) return null;
  if (offered.edit ? !filled(text) : text !== undefined) return null;
  const session = await request(dir, {
    kind: 'decision',
    item: found.item,
    action: offered.id,
    ...(offered.note && filled(note) && { note: cleanText(note) }),
    ...(offered.edit && { text: cleanText(text) }),
    on: found.on,
  });
  return { walkthrough: walkthroughView(dir), session };
}

// A mark follows the file's own diff, so it outlives the file moving between steps but not the file changing.
function fileMarks({ steps }: Walkthrough): Record<string, string> {
  return Object.fromEntries(
    steps.flatMap(step =>
      parseDiff(step.diff).map(file => {
        const name = file.isDeleted ? file.oldName : file.newName;
        return [name, `${name}:${fingerprint(JSON.stringify(file))}`];
      }),
    ),
  );
}

export async function markViewed(
  dir: string,
  { step: stepId, file, viewed, on }: Record<string, unknown>,
): Promise<WalkthroughView | typeof CHANGED | null> {
  const walkthrough = readWalkthrough(dir);
  const step = walkthrough?.steps.find(one => one.id === stepId);
  if (!walkthrough || !step || typeof viewed !== 'boolean' || typeof file !== 'string') return null;
  if (on !== undefined && on !== fingerprint(step.diff)) return CHANGED;
  const mark = fileMarks({ ...walkthrough, steps: [step] })[file];
  if (!mark) return null;
  const marks = viewedFile(dir);
  await locked(marks, () => {
    const kept = readJson<string[]>(marks, []).filter(one => one !== mark);
    writeJson(marks, viewed ? [...kept, mark] : kept);
  });
  return walkthroughView(dir);
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
