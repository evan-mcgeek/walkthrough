import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { ColorSchemeType } from 'diff2html/lib-esm/types';
import type { Lines, NoteMark, Place } from '../notes';
import { previewType } from '../preview';
import type { Decision, WalkthroughView } from '../decisions';
import type { Entry, PageRequest, SessionMessage, SessionState, SessionView } from '../session';
import { type Action, builtIn, type Item, itemKey, nameOf } from '../items';
import type { Checklist, ChecklistItem, Step } from '../walkthrough';
import { plural } from '../words';
import { el, type PageName, post as postTo, region, selectBox, showAlert, showUnreachable } from './dom';
import { icon, type IconName } from './icons';
import { type Layout, LAYOUTS, storedLayout, storeLayout } from './layout';
import { renderMarkdown } from './markdown';
import { animate, now, play, reduced, replay } from './motion';

/** The state an exported file carries; it shows the walkthrough as it was, with nothing to send to. */
const exported = document.getElementById('exported')?.textContent;
const readOnly = exported !== undefined;

/** What reduced motion keeps of an element arriving. */
const FADE_IN = [{ opacity: 0 }, { opacity: 1 }];

function markdown(text: string, className: string): HTMLElement {
  const box = document.createElement('div');
  box.className = `markdown ${className}`;
  box.innerHTML = renderMarkdown(text);
  return box;
}

/** Session Markdown as one line of plain text, for a rail row or a mention. */
const plain = (text: string) => markdown(text, '').textContent.replace(/\s+/g, ' ').trim();

/** Phone width: the step's actions move to a bottom bar and the deck can decide by swipe. */
const phone = matchMedia('(max-width: 760px)');

const header = region('header');
const queue = region('queue');
const main = region('main');
const side = region('side');
const tools = region('tools');

/** An exported file keeps the default, since it has no switch to change it. */
let layout: Layout = readOnly ? 'queue' : storedLayout();

/** Counts what the page sent, so a poll answered from before it is not drawn over its result. */
let posted = 0;

const PAGE: PageName = { name: 'walkthrough', reopen: 'Run /walkthrough again to reopen it.', retry: () => { poll(); } };
const post = (route: string, body: Record<string, unknown>) => {
  posted++;
  return postTo(PAGE, route, body);
};

let walkthrough: WalkthroughView;
let session: SessionView;
/** What the person typed and has not sent, by box, so a redraw keeps it. */
const drafts = new Map<string, string>();

const decisionOf = (item: Item) => walkthrough.decided[itemKey(item)] ?? null;
const stepDecided = (step: Step) => decisionOf({ type: 'step', id: step.id }) !== null;
const stepReopened = (step: Step) => walkthrough.reopened[itemKey({ type: 'step', id: step.id })];
/** The label of the item's action `id`, or the id when the session no longer offers it. */
const labelOf = (item: Item, id: string) => walkthrough.actions[itemKey(item)]?.find(action => action.id === id)?.label ?? id;

/** What the main pane shows; each is its own address, so the browser's back and forward move between them too. */
type View =
  | { kind: 'step'; step: Step }
  | { kind: 'session' }
  | { kind: 'checklist'; item?: string }
  | { kind: 'end' }
  | { kind: 'deck' }
  | { kind: 'preparing' };

const CHECKLIST_ITEM = /^checklist-(.+)$/;

function currentView(): View {
  const named = decodeURIComponent(location.hash.slice(1));
  const { steps } = walkthrough;
  if (named === 'session') return { kind: 'session' };
  if (named === 'checklist' && walkthrough.checklist) return { kind: 'checklist' };
  const item = CHECKLIST_ITEM.exec(named)?.[1];
  if (item !== undefined && walkthrough.checklist) return { kind: 'checklist', item };
  if (named === 'end' && steps.length) return { kind: 'end' };
  if (named === 'deck' && !readOnly) return { kind: 'deck' };
  const step = steps.find(one => one.id === named) ?? steps.find(one => !stepDecided(one));
  if (step) return { kind: 'step', step };
  return steps.length ? { kind: 'end' } : { kind: 'preparing' };
}

const currentStep = () => {
  const view = currentView();
  return view.kind === 'step' ? view.step : undefined;
};

const go = (address: string) => {
  location.hash = encodeURIComponent(address);
};

/** Counts the person's moves between views, so an answer that arrives later never moves them again. */
let moves = 0;

let taking: { key: string; action: string } | null = null;
/** Decided items whose actions the person opened again to change their decision. */
const changing = new Set<string>();

async function decide(item: Item, action: string, fields: { note?: string; text?: string } = {}): Promise<void> {
  const before = moves;
  const from = currentStep()?.id;
  const answer = await post('decide', { item, action, ...fields });
  if (!answer) return;
  ({ walkthrough, session } = (await answer.json()) as { walkthrough: WalkthroughView; session: SessionView });
  for (const field of ['note', 'text']) drafts.delete(`decide:${itemKey(item)}:${action}:${field}`);
  taking = null;
  flung = null;
  changing.delete(itemKey(item));
  // Moving on is only for the person still on the step they decided; it comes before drawing, so the pane swaps once.
  const moving = item.type === 'step' && moves === before && from === item.id;
  if (moving) {
    const { steps } = walkthrough;
    const at = steps.findIndex(one => one.id === item.id);
    const next = [...steps.slice(at + 1), ...steps.slice(0, at)].find(one => !stepDecided(one));
    go(next ? next.id : 'end');
  }
  render();
  offerUndo(item, action, moving);
}

/** The decision the toast offers to take back, and the address deciding it moved the person to, if it did. */
let undoable: { item: Item; landed: string | null } | null = null;
const UNDO_MS = 6000;
const toastText = el('span', { className: 'toast-text' });
const toast = el(
  'div',
  { className: 'toast' },
  icon('met'),
  toastText,
  el('button', { type: 'button', className: 'toast-undo', onclick: () => void undo() }, 'Undo'),
);
const toastRegion = el('div', { className: 'toast-region' });
toastRegion.setAttribute('role', 'status');
// Between the main pane and the tool panel, so the toast sits over the main pane's foot in every layout.
if (!readOnly) tools.before(el('div', { className: 'toast-anchor' }, toastRegion));
let toastTimer: ReturnType<typeof setTimeout> | undefined;
let toastHeld = { pointer: false, focus: false };

/** The toast stays while the pointer or focus is on it, and leaves a while after both are gone. */
function holdToast(held: Partial<typeof toastHeld> = {}): void {
  toastHeld = { ...toastHeld, ...held };
  clearTimeout(toastTimer);
  if (!toastHeld.pointer && !toastHeld.focus) toastTimer = setTimeout(hideToast, UNDO_MS);
}
toast.onpointerenter = () => {
  holdToast({ pointer: true });
};
toast.onpointerleave = () => {
  holdToast({ pointer: false });
};
toast.addEventListener('focusin', () => {
  holdToast({ focus: true });
});
toast.addEventListener('focusout', () => {
  holdToast({ focus: false });
});

function itemName(item: Item): string {
  switch (item.type) {
    case 'step':
      return `step ${String(stepNumber(item.id))}`;
    case 'checklist':
      return `checklist item ${String((walkthrough.checklist?.items.findIndex(one => one.id === item.id) ?? -1) + 1)}`;
    case 'note': {
      const noted = session.conversation.find(entry => entry.id === item.id);
      return noted && isNote(noted) ? `the ${noted.note.label} note` : 'the note';
    }
    case 'walkthrough':
      return 'the walkthrough';
  }
}

function offerUndo(item: Item, action: string, moved: boolean): void {
  undoable = { item, landed: moved ? location.hash : null };
  toastText.textContent = `Decided ${itemName(item)}: ${labelOf(item, action)}`;
  for (const leaving of toast.getAnimations()) leaving.cancel();
  if (!toast.isConnected) {
    toastHeld = { pointer: false, focus: false };
    toastRegion.append(toast);
    const rise = [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }];
    animate(toast, 'toast-in', reduced() ? FADE_IN : rise, { ms: 'base', curve: 'ease-out', delay: 120 });
  }
  holdToast();
}

function hideToast(): void {
  clearTimeout(toastTimer);
  undoable = null;
  if (!toast.isConnected) return;
  const out = animate(toast, 'toast-out', [{ opacity: 1 }, { opacity: 0 }], { ms: 'fast', curve: 'ease-in', fill: 'forwards' });
  out.finished.then(
    () => {
      toast.remove();
      out.cancel();
    },
    () => {},
  );
}

/** Takes the decision back, and returns the person to the step when they are still where deciding it took them. */
async function undo(): Promise<void> {
  const taken = undoable;
  if (!taken) return;
  const hadFocus = toast.contains(document.activeElement);
  hideToast();
  const answer = await post('decide', { item: taken.item, clear: true });
  if (!answer) return;
  ({ walkthrough, session } = (await answer.json()) as { walkthrough: WalkthroughView; session: SessionView });
  if (taken.item.type === 'step' && taken.landed === location.hash) go(taken.item.id);
  render();
  if (hadFocus) document.querySelector<HTMLElement>('.action-bar button, #main button')?.focus();
}

const reading = new Set<string>();

async function markRead(step: Step): Promise<void> {
  if (readOnly || walkthrough.read.includes(step.id) || reading.has(step.id)) return;
  reading.add(step.id);
  const answer = await post('read', { step: step.id });
  reading.delete(step.id);
  if (!answer) return;
  // Only what was read: a decision sent meanwhile may have answered with newer decisions.
  walkthrough = { ...walkthrough, read: ((await answer.json()) as WalkthroughView).read };
  render();
}

async function send(route: 'ask' | 'reply', body: Record<string, unknown>, draft?: string): Promise<boolean> {
  const answer = await post(route, body);
  if (!answer) return false;
  if (draft) drafts.delete(draft);
  session = (await answer.json()) as SessionView;
  render();
  return true;
}

let lastSession = '';
let lastWalkthrough = '';

let stopped = false;

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  stopped = true;
  taking = null;
  hideToast();
  render();
  const banner = region('alert');
  banner.className = 'banner';
  banner.replaceChildren(
    el('span', { className: 'banner-text' }, el('strong', {}, 'Stopped.'), ' The walkthrough has stopped and your decisions are kept. You can close this tab.'),
  );
  banner.hidden = false;
  const panes = region('panes');
  panes.classList.add('stopped');
  panes.inert = true;
}

const SESSION: Record<SessionState, readonly [string, string]> = {
  listening: ['Listening', 'The session is listening: what you ask reaches it right away.'],
  working: ['Working', 'The session is working; what you send now waits until it listens again.'],
  'needs-you': ['Needs you', 'The session asked you something; reply to it below.'],
  gone: ['Gone', 'The session stopped listening and has not come back. What you send waits; run /walkthrough in Claude Code.'],
};

function statusView(): HTMLElement {
  const state = stopped ? 'gone' : session.state;
  const [label, about] = stopped ? ['Stopped', 'The walkthrough has stopped.'] : SESSION[state];
  const mark = state === 'working' ? icon('spinner') : el('span', { className: 'dot' });
  if (state === 'needs-you') mark.dataset['motion'] = 'pulse';
  const status = el('span', { className: 'status', title: about }, mark, label);
  status.dataset['state'] = state;
  status.setAttribute('role', 'status');
  status.setAttribute('aria-label', 'Session');
  return status;
}

type SegmentState = 'decided' | 'reopened' | 'current' | 'read' | 'unread';

function segmentState(step: Step, current: Step | undefined): SegmentState {
  if (stepDecided(step)) return 'decided';
  if (stepReopened(step)) return 'reopened';
  if (step === current) return 'current';
  return walkthrough.read.includes(step.id) ? 'read' : 'unread';
}

/** One segment per step in step order, coloured by its state, and the count of decided steps. */
function progressView(): HTMLElement[] {
  const { steps } = walkthrough;
  const decided = steps.filter(stepDecided).length;
  const current = currentView().kind === 'deck' ? deckTop() : currentStep();
  const said = steps.length
    ? `${String(decided)} of ${plural(steps.length, 'step')} decided, ${String(steps.length - decided)} left, ${String(walkthrough.read.length)} read`
    : 'No steps yet';
  const bar = el(
    'div',
    { className: 'progress', title: said },
    ...steps.map(step => {
      const state = segmentState(step, current);
      const fill = el('span', { className: 'segment-fill' });
      fill.dataset['motion'] = `fill:${step.id}`;
      const segment = el('span', { className: 'segment' }, ...(state === 'decided' ? [fill] : []));
      segment.dataset['state'] = state;
      return segment;
    }),
  );
  if (steps.length) {
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Steps decided');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', String(steps.length));
    bar.setAttribute('aria-valuenow', String(decided));
    bar.setAttribute('aria-valuetext', said);
  }
  const count = el('span', { className: 'progress-count' }, `${String(decided)}/${String(steps.length)}`);
  count.setAttribute('aria-hidden', 'true');
  count.dataset['motion'] = 'count:progress';
  return [bar, count];
}

function chooseLayout(id: Layout): void {
  layout = id;
  storeLayout(id);
  render();
}

function layoutSwitch(): HTMLElement {
  const choices = LAYOUTS.map(({ id, label, icon: shape }) => {
    const button = el('button', { type: 'button', title: label }, icon(shape));
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(id === layout));
    button.dataset['key'] = `layout:${id}`;
    button.onclick = () => {
      chooseLayout(id);
    };
    return button;
  });
  const group = el('div', { className: 'segmented icons layout-switch' }, ...choices);
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Layout');
  return group;
}

/** The header's More menu, which holds what the header has no room for at phone width. */
let menuOpen = false;

function closeMenu(): void {
  menuOpen = false;
  render();
}

function moreMenu(): HTMLElement {
  const button = el('button', { type: 'button', className: 'icon-button', onclick: () => {
    menuOpen = !menuOpen;
    render();
    document.querySelector<HTMLElement>('.menu [role=menuitem]')?.focus();
  } }, icon('more'));
  button.setAttribute('aria-label', 'More');
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', String(menuOpen));
  button.dataset['key'] = 'more';
  const box = el('div', { className: 'more-menu' }, button);
  if (!menuOpen) return box;
  const choices: [string, () => void][] = stopped
    ? []
    : [
        ...(walkthrough.steps.length && currentView().kind !== 'deck' ? [['Swipe to decide', () => { go('deck'); }] as [string, () => void]] : []),
        ['Stop', () => void stop()],
      ];
  const item = (label: string, choose: () => void, role = 'menuitem') => {
    const made = el('button', { type: 'button', tabIndex: -1, onclick: () => { closeMenu(); choose(); } }, label);
    made.setAttribute('role', role);
    made.dataset['key'] = `menu:${label}`;
    return made;
  };
  const actions = choices.map(([label, choose]) => item(label, choose));
  const layouts = LAYOUTS.map(({ id, label }) => {
    const radio = item(label, () => { chooseLayout(id); }, 'menuitemradio');
    radio.setAttribute('aria-checked', String(id === layout));
    return radio;
  });
  const items = [...actions, ...layouts];
  const separator = el('div', { className: 'menu-separator' });
  separator.setAttribute('role', 'separator');
  const menu = el('div', { className: 'menu' }, ...actions, ...(actions.length ? [separator] : []), ...layouts);
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'More');
  menu.onkeydown = event => {
    const at = items.indexOf(event.target as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      items.at((at + (event.key === 'ArrowDown' ? 1 : -1)) % items.length)?.focus();
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      closeMenu();
      if (event.key === 'Tab') return;
      document.querySelector<HTMLElement>('[data-key="more"]')?.focus();
    } else return;
    event.preventDefault();
  };
  box.append(menu);
  return box;
}

document.addEventListener('click', event => {
  if (menuOpen && !(event.target instanceof Element && event.target.closest('.more-menu'))) closeMenu();
});

function headerView(): HTMLElement[] {
  const range = `against ${walkthrough.target}, ${walkthrough.base.slice(0, 7)}..${walkthrough.head.slice(0, 7)}`;
  return [
    el('span', { className: 'logo' }, 'Walkthrough'),
    el('h1', { className: 'session-label', title: range }, nameOf(walkthrough)),
    ...progressView(),
    el(
      'div',
      { className: 'header-end' },
      ...(readOnly
        ? [el('span', { className: 'header-note' }, 'Exported, read-only')]
        : [
            layoutSwitch(),
            statusView(),
            ...(stopped ? [] : [el('button', { type: 'button', className: 'btn small stop', onclick: () => void stop() }, 'Stop')]),
            moreMenu(),
          ]),
    ),
  ];
}

/** Nothing in an exported file is sent anywhere, so it has no boxes to type into. */
const writable = (form: HTMLFormElement) => (readOnly ? [] : [form]);

function draftArea(draft: string, label: string, start = '', rows = 2): HTMLTextAreaElement {
  const box = el('textarea', { rows, value: drafts.get(draft) ?? start, placeholder: label });
  box.dataset['draft'] = draft;
  box.setAttribute('aria-label', label);
  box.oninput = () => drafts.set(draft, box.value);
  return box;
}

function draftForm(boxes: HTMLTextAreaElement[], action: string, onSend: () => void): HTMLFormElement {
  const form = el('form', { className: 'draft' }, ...boxes, el('button', { type: 'submit', className: 'btn primary' }, action));
  form.onsubmit = event => {
    event.preventDefault();
    onSend();
  };
  return form;
}

const draftBox = (draft: string, label: string, action: string, onSend: () => void) =>
  draftForm([draftArea(draft, label)], action, onSend);

/** A one-line box that sends on Enter, as the board's Ask and Reply boxes do. */
function lineBox(draft: string, label: string, placeholder: string, onSend: () => void): HTMLFormElement {
  const box = el('input', { type: 'text', value: drafts.get(draft) ?? '', placeholder });
  box.dataset['draft'] = draft;
  box.setAttribute('aria-label', label);
  box.oninput = () => drafts.set(draft, box.value);
  const form = el('form', { className: 'line-box' }, box);
  form.onsubmit = event => {
    event.preventDefault();
    onSend();
  };
  return form;
}

/** The person's words as they typed them; the session's as Markdown. */
const said = (entry: Entry) =>
  entry.from === 'session' ? markdown(entry.text, 'said session') : el('p', { className: 'said person' }, entry.text ?? '');

function followUps(root: Entry): Entry[] {
  const thread = new Set([root.id]);
  return session.conversation.filter(entry => {
    const to = entry.from === 'session' ? entry.answer : entry.kind === 'reply' ? entry.to : undefined;
    if (to === undefined || !thread.has(to)) return false;
    thread.add(entry.id);
    return true;
  });
}

type Ask = PageRequest & { kind: 'ask' };
type Note = SessionMessage & { note: NoteMark };
const isNote = (entry: Entry): entry is Note => entry.from === 'session' && entry.note !== undefined;
const isAsk = (entry: Entry): entry is Ask => entry.from === 'page' && entry.kind === 'ask';
const placeOf = (entry: Note | Ask): Place => (isNote(entry) ? entry.note : entry);
/** The step a note or ask shows on, null when its place is gone; one newer than the walkthrough fetched shows where it was put. */
const anchorOf = (entry: Note | Ask) => {
  const at = walkthrough.anchored[entry.id];
  return at === undefined ? placeOf(entry).step : at;
};

/** A note that answers an ask shows in the ask's thread, with its own replies. */
const answersAsk = (entry: Entry) => isNote(entry) && entry.answer !== undefined;

/** What the session said that belongs to no step: not an answer and not a note. */
const sessionMessages = () =>
  session.conversation.filter((entry): entry is SessionMessage => entry.from === 'session' && !entry.answer && !entry.note);

const answered = (message: SessionMessage) =>
  session.conversation.some(entry => entry.from === 'page' && entry.kind === 'reply' && entry.to === message.id);

/** A question waits in its box until the person replies to it. */
const waitingQuestions = () => (readOnly ? [] : sessionMessages().filter(message => message.question && !answered(message)));

function askThread(asked: Ask): HTMLElement {
  const answers = followUps(asked);
  const inNotes = new Set(answers.filter(isNote).flatMap(note => followUps(note).map(entry => entry.id)));
  return el(
    'div',
    { className: 'thread' },
    said(asked),
    ...(answers.length
      ? answers.filter(entry => !inNotes.has(entry.id)).map(entry => (isNote(entry) ? noteView(entry) : said(entry)))
      : [el('p', { className: 'muted' }, 'Waiting for the session to answer.')]),
  );
}

const linesLabel = ([first, last]: Lines) =>
  first === last ? `Line ${String(first)}` : `Lines ${String(first)}-${String(last)}`;

/** How an action shows: the built-in Approve leads, Flag follows, and what the session offers on a step is marked as offered. */
type Look = 'primary' | 'secondary' | 'offer';

function actionButton(item: Item, action: Action, look: Look, small: boolean): HTMLButtonElement {
  const key = itemKey(item);
  const classes = ['btn', ...(look === 'secondary' ? [] : [look]), ...(small ? ['small'] : [])];
  const button = el('button', { type: 'button', className: classes.join(' ') }, ...(look === 'offer' ? [icon('message')] : []), action.label);
  button.setAttribute('aria-pressed', String(decisionOf(item)?.action === action.id));
  button.dataset['key'] = `action:${key}:${action.id}`;
  button.onclick = () => {
    if (action.note || action.edit) {
      taking = { key, action: action.id };
      render();
      document.querySelector<HTMLTextAreaElement>('.taking textarea')?.focus();
    } else void decide(item, action.id);
  };
  return button;
}

function actionGroup(item: Item, look: (action: Action, at: number) => Look, small = false): HTMLElement {
  const actions = walkthrough.actions[itemKey(item)] ?? [];
  const group = el('div', { className: 'choices' }, ...actions.map((action, at) => actionButton(item, action, look(action, at), small)));
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Decide');
  return group;
}

const firstLeads = (_: Action, at: number): Look => (at === 0 ? 'primary' : 'secondary');
const stepLook = ({ id }: Action): Look => (id === 'approve' ? 'primary' : id === 'flag' ? 'secondary' : 'offer');

function stateTag(item: Item, long: boolean): HTMLElement {
  const key = itemKey(item);
  const decision = walkthrough.decided[key] ?? null;
  const reopened = walkthrough.reopened[key];
  if (decision) return el('span', { className: 'tag decided' }, `Decided: ${labelOf(item, decision.action)}`);
  if (reopened)
    return el('span', { className: 'tag reopened' }, long ? `Reopened: changed since you chose ${labelOf(item, reopened.action)}` : 'Reopened');
  return el('span', { className: 'tag' }, 'Undecided');
}

/** The state, actions and what was said about the decision of a note, checklist item or the whole walkthrough. */
function decideView(item: Item, text = '', small = true): HTMLElement[] {
  const key = itemKey(item);
  const actions = walkthrough.actions[key] ?? [];
  if (!actions.length) return [];
  const shown = walkthrough.decided[key] ?? walkthrough.reopened[key];
  const taken = taking?.key === key ? actions.find(action => action.id === taking?.action) : undefined;
  return [
    el(
      'div',
      { className: 'decide' },
      el('div', { className: 'decide-row' }, stateTag(item, true), ...(readOnly ? [] : [actionGroup(item, firstLeads, small)])),
      // A reopened item keeps what the person and the session said about the decision it had.
      ...(shown ? decisionSaid(shown) : []),
      ...(taken ? [takingForm(item, taken, text)] : []),
    ),
  ];
}

function decisionSaid(decision: Decision): HTMLElement[] {
  return [
    ...(decision.note ? [el('p', { className: 'said person' }, decision.note)] : []),
    ...(decision.text ? [markdown(decision.text, 'said person')] : []),
    ...followUps(decision).map(said),
  ];
}

function takingForm(item: Item, action: Action, text: string): HTMLFormElement {
  const draft = (field: string) => `decide:${itemKey(item)}:${action.id}:${field}`;
  const boxes = [
    ...(action.edit ? [draftArea(draft('text'), 'Text', text, 3)] : []),
    ...(action.note ? [draftArea(draft('note'), 'Note', '', 3)] : []),
  ];
  const form = el(
    'form',
    { className: 'taking' },
    el('p', { className: 'taking-head' }, action.label),
    ...boxes,
    el(
      'div',
      { className: 'taking-row' },
      el('span', { className: 'hint' }, 'Goes to the session with your decision.'),
      el('button', { type: 'button', className: 'btn ghost', onclick: () => { taking = null; flung = null; render(); } }, 'Cancel'),
      el('button', { type: 'submit', className: 'btn primary' }, 'Send'),
    ),
  );
  form.onsubmit = event => {
    event.preventDefault();
    void decide(item, action.id, {
      ...(action.note && { note: drafts.get(draft('note')) ?? '' }),
      ...(action.edit && { text: drafts.get(draft('text')) ?? text }),
    });
  };
  return form;
}

function wasView(entry: Note | Ask): HTMLElement {
  const { file, lines } = placeOf(entry);
  const where = file !== undefined && lines ? `${file}, ${linesLabel(lines).toLowerCase()}` : 'a step no longer in the change';
  return el('p', { className: 'was' }, `Was on ${where}`);
}

function noteView(note: Note): HTMLElement {
  const { label, lines } = note.note;
  const draft = `reply:${note.id}`;
  const detached = anchorOf(note) === null;
  const view = el(
    'article',
    { className: 'note' },
    el(
      'p',
      { className: 'note-head' },
      el('span', { className: 'label' }, label),
      ...(lines && !detached ? [el('span', { className: 'lines' }, linesLabel(lines))] : []),
    ),
    ...(detached ? [wasView(note)] : []),
    markdown(note.text, 'note-text'),
    ...decideView({ type: 'note', id: note.id }, note.text),
    ...followUps(note).map(said),
    ...writable(draftBox(draft, 'Reply', 'Reply', () => {
      void send('reply', { to: note.id, text: drafts.get(draft) ?? '' }, draft);
    })),
  );
  view.setAttribute('aria-label', label);
  view.id = `note-${note.id}`;
  view.dataset['motion'] = `note:${note.id}`;
  return view;
}

function notesView(notes: Note[], place: string): HTMLElement[] {
  const views = notes.filter(note => !note.note.low).map(noteView);
  const low = notes.filter(note => note.note.low);
  if (!low.length) return views;
  const more = el('details', { className: 'more', open: opened.has(place) }, el('summary', {}, `${String(low.length)} more`));
  more.append(...low.map(noteView));
  more.ontoggle = () => {
    // A redraw opens it again on its own, which reveals nothing.
    if (more.open && !opened.has(place)) {
      const rise = [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }];
      low.forEach((note, at) => {
        play(`note:${note.id}`, 'rise', reduced() ? FADE_IN : rise, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out', delay: at * 40 });
      });
      replay();
    }
    if (more.open) opened.add(place);
    else opened.delete(place);
  };
  return [...views, more];
}

/** `ended` once the last line is picked too; from the keyboard the first line is picked on its own first. */
let picked: { step: string; file: string; from: number; lines: Lines; ended: boolean } | null = null;

function lineAt(event: Event): { cell: HTMLElement; file: string; line: number } | null {
  const target = event.target instanceof Element ? event.target : null;
  const cell = target?.closest<HTMLElement>('.d2h-code-linenumber');
  const row = cell?.closest<HTMLTableRowElement>('tr[data-line]');
  const file = row?.dataset['file'];
  return readOnly || !cell || !row || file === undefined ? null : { cell, file, line: Number(row.dataset['line']) };
}

function pick(step: Step, file: string, line: number, extend: boolean, ended: boolean): void {
  const from = extend && picked?.step === step.id && picked.file === file ? picked.from : line;
  picked = { step: step.id, file, from, lines: [Math.min(from, line), Math.max(from, line)], ended };
  render();
  if (ended) document.querySelector<HTMLTextAreaElement>('.picked-ask textarea')?.focus();
}

function pickLine(step: Step, event: MouseEvent): void {
  const at = lineAt(event);
  if (at) pick(step, at.file, at.line, event.shiftKey, true);
}

function pickByKey(step: Step, event: KeyboardEvent): void {
  const at = lineAt(event);
  if (!at) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const cells = [...(event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('tr[data-line] .d2h-code-linenumber')];
    const next = cells[cells.indexOf(at.cell) + (event.key === 'ArrowDown' ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    at.cell.tabIndex = -1;
    next.tabIndex = 0;
    next.focus();
    return;
  }
  if (event.key !== 'Enter') return;
  event.preventDefault();
  const started = picked?.step === step.id && picked.file === at.file && !picked.ended;
  pick(step, at.file, at.line, started, event.shiftKey || (started && picked?.from !== at.line));
}

function unpick(): void {
  picked = null;
  render();
}

function pickedAsk(step: Step, file: string, lines: Lines): HTMLElement {
  const draft = `ask:${step.id}:${file}:${lines.join('-')}`;
  const form = draftBox(draft, `Ask about ${file} ${linesLabel(lines).toLowerCase()}`, 'Ask', () => {
    void send('ask', { step: step.id, file, lines, text: drafts.get(draft) ?? '' }, draft).then(sent => {
      if (sent) unpick();
    });
  });
  form.append(el('button', { type: 'button', className: 'btn ghost', onclick: unpick }, 'Cancel'));
  form.classList.add('picked-ask');
  return form;
}

const lineKey = (file: string, line: number) => JSON.stringify([file, line]);
type Drawn = { diff: string; view: HTMLElement; rows: Map<string, HTMLTableRowElement> };
// Kept across redraws: the page redraws whenever the session's state changes, and drawing a diff is the slow part.
const drawn = new Map<string, Drawn>();

function drawDiff(step: Step): Drawn {
  const kept = drawn.get(step.id);
  if (kept?.diff === step.diff) return kept;
  const view = el('div', { className: 'diff' });
  const files = parse(step.diff);
  new Diff2HtmlUI(view, files, {
    outputFormat: 'line-by-line',
    drawFileList: false,
    matching: 'lines',
    colorScheme: ColorSchemeType.AUTO,
    fileContentToggle: false,
  }).draw();
  const rows = new Map<string, HTMLTableRowElement>();
  // diff2html draws one wrapper per file, in the order it parses them.
  view.querySelectorAll('.d2h-file-wrapper').forEach((wrapper, at) => {
    const parsed = files[at];
    const file = parsed?.newName ?? '';
    if (parsed && !parsed.isDeleted) addPreview(wrapper, step.id, file);
    for (const number of wrapper.querySelectorAll('.line-num2')) {
      const line = number.textContent.trim();
      const row = number.closest('tr');
      if (!line || !row) continue;
      row.dataset['file'] = file;
      row.dataset['line'] = line;
      rows.set(lineKey(file, Number(line)), row);
    }
  });
  view.onclick = event => {
    pickLine(step, event);
  };
  if (!readOnly) {
    const cells = [...view.querySelectorAll<HTMLElement>('tr[data-line] .d2h-code-linenumber')];
    // One line number is in the tab order, and the arrows move from it, so the diff is one stop.
    cells.forEach((cell, at) => {
      cell.tabIndex = at === 0 ? 0 : -1;
      cell.setAttribute('aria-label', `Ask about line ${cell.closest('tr')?.dataset['line'] ?? ''} of ${cell.closest('tr')?.dataset['file'] ?? ''}`);
    });
    view.onkeydown = event => {
      pickByKey(step, event);
    };
  }
  const made = { diff: step.diff, view, rows };
  drawn.set(step.id, made);
  return made;
}

function diffView(step: Step, pinned: (Note | Ask)[]): HTMLElement {
  const { view, rows } = drawDiff(step);
  for (const old of view.querySelectorAll('.pinned-row')) old.remove();
  for (const old of view.querySelectorAll('tr.selected')) old.classList.remove('selected');
  const at = new Map<string, (Note | Ask)[]>();
  for (const entry of pinned) {
    const { file, lines } = placeOf(entry);
    if (file === undefined || !lines) continue;
    const key = lineKey(file, lines[1]);
    at.set(key, [...(at.get(key) ?? []), entry]);
  }
  const pick = picked?.step === step.id ? picked : null;
  const pickKey = pick && lineKey(pick.file, pick.lines[1]);
  if (pick && pickKey) {
    for (const row of rows.values()) {
      const line = Number(row.dataset['line']);
      if (row.dataset['file'] === pick.file && line >= pick.lines[0] && line <= pick.lines[1]) row.classList.add('selected');
    }
    if (pick.ended && !at.has(pickKey)) at.set(pickKey, []);
  }
  for (const [key, entries] of at) {
    const shown = el(
      'div',
      { className: 'pinned' },
      ...notesView(entries.filter(isNote), `more:${step.id}:${key}`),
      ...entries.filter(isAsk).map(askThread),
      ...(pick?.ended && key === pickKey ? [pickedAsk(step, pick.file, pick.lines)] : []),
    );
    rows.get(key)?.after(el('tr', { className: 'pinned-row' }, el('td', { colSpan: 2 }, shown)));
  }
  return view;
}

/** Files the person switched to their preview, by step id and path, so a redraw keeps them so. */
const previewed = new Set<string>();

function addPreview(wrapper: Element, stepId: string, file: string): void {
  const type = previewType(file);
  const diff = wrapper.querySelector<HTMLElement>('.d2h-file-diff');
  // A preview is read from the server, which an exported file does not have.
  if (!type || !diff || readOnly) return;
  const source = `file?path=${encodeURIComponent(file)}`;
  const preview = el('div', { className: 'preview', hidden: true });
  preview.setAttribute('role', 'region');
  preview.setAttribute('aria-label', `Preview of ${file}`);
  const fill = async () => {
    if (type.startsWith('image/')) {
      preview.replaceChildren(el('img', { src: source, alt: file }));
      return;
    }
    preview.replaceChildren(el('p', { className: 'muted' }, 'Loading the preview.'));
    const answer = await fetch(source).catch(() => null);
    if (answer?.ok) preview.innerHTML = renderMarkdown(await answer.text(), file);
    else preview.replaceChildren(el('p', { className: 'muted' }, 'Could not load the preview.'));
  };
  const choices = (['Diff', 'Preview'] as const).map(label =>
    el('button', { type: 'button', onclick: () => void choose(label === 'Preview') }, label),
  );
  const key = JSON.stringify([stepId, file]);
  const choose = async (previewing: boolean) => {
    if (previewing) previewed.add(key);
    else previewed.delete(key);
    for (const [at, button] of choices.entries()) button.setAttribute('aria-pressed', String(previewing === (at === 1)));
    diff.hidden = previewing;
    preview.hidden = !previewing;
    if (previewing && !preview.hasChildNodes()) await fill();
  };
  const toggle = el('div', { className: 'segmented' }, ...choices);
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', `Show ${file} as`);
  void choose(previewed.has(key));
  wrapper.querySelector('.d2h-file-header')?.append(toggle);
  diff.after(preview);
}

/** Disclosures the person opened (low-priority notes, a folded step's files and diff, the decided steps), so a redraw keeps them open. */
const opened = new Set<string>();
/** Assumption lists the person closed; they start open. */
const closed = new Set<string>();

function toggle(set: Set<string>, key: string): void {
  if (set.has(key)) set.delete(key);
  else set.add(key);
  render();
}

function disclosure(label: (Node | string)[], open: boolean, onToggle: () => void, className: string, key: string): HTMLButtonElement {
  const chevron = icon('chevron-right');
  chevron.dataset['motion'] = `turn:${key}`;
  const button = el('button', { type: 'button', className }, chevron, ...label);
  button.setAttribute('aria-expanded', String(open));
  button.dataset['key'] = className;
  button.onclick = () => {
    if (!reduced()) {
      const turn = [{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)' }];
      play(`turn:${key}`, 'turn', open ? turn.reverse() : turn, { ms: 'fast', curve: 'ease-out' });
    }
    onToggle();
  };
  return button;
}

function assumedView(step: Step & { kind: 'step' }): HTMLElement[] {
  if (!step.assumptions.length) return [];
  const open = !closed.has(step.id);
  const motion = `reveal:${step.id}`;
  const onToggle = () => {
    if (!open) {
      const rows = [{ gridTemplateRows: '0fr', opacity: 0 }, { gridTemplateRows: '1fr', opacity: 1 }];
      play(motion, 'reveal', reduced() ? FADE_IN : rows, reduced() ? { ms: 'base', curve: 'linear' } : { ms: 'slow', curve: 'ease-out' });
    }
    toggle(closed, step.id);
  };
  const button = disclosure(['Assumed, not read'], open, onToggle, 'disclosure assumed-toggle', `assumed:${step.id}`);
  button.id = `assumed-${step.id}`;
  const list = el('ul', { className: 'assumed' }, ...step.assumptions.map(assumption => el('li', {}, assumption)));
  list.setAttribute('aria-labelledby', button.id);
  button.setAttribute('aria-controls', (list.id = `assumed-list-${step.id}`));
  const shown = el('div', { className: 'assumed-wrap', hidden: !open }, list);
  shown.dataset['motion'] = motion;
  return [el('div', { className: 'assumptions' }, button, shown)];
}

function foldedView(step: Step & { kind: 'folded' }, pinned: (Note | Ask)[]): HTMLElement[] {
  const key = `fold:${step.id}`;
  const open = opened.has(key);
  const problems = step.problems.length ? [el('span', { className: 'tag reopened' }, plural(step.problems.length, 'problem'))] : [];
  const summary = disclosure(
    [el('span', {}, plural(step.files.length, 'file')), el('span', { className: 'spacer' }), ...problems],
    open,
    () => { toggle(opened, key); },
    'fold-summary',
    key,
  );
  if (!open) return [el('div', { className: 'block' }, summary)];
  const files = el(
    'ul',
    { className: 'fold-files' },
    ...step.files.map(file => el('li', {}, el('code', { className: 'fold-path' }, file.path), markdown(file.reason, 'fold-reason'))),
  );
  files.setAttribute('aria-label', 'Folded files');
  const found = step.problems.length
    ? [el('ul', { className: 'problems' }, ...step.problems.map(problem => el('li', { className: 'problem' }, icon('warn'), markdown(problem, 'problem-text'))))]
    : [];
  found[0]?.setAttribute('aria-label', 'Problems the session found');
  const details = el('details', { className: 'fold-diff', open: opened.has(step.id) }, el('summary', {}, 'Show the diff'), diffView(step, pinned));
  details.ontoggle = () => {
    if (details.open) opened.add(step.id);
    else opened.delete(step.id);
  };
  return [el('div', { className: 'block' }, summary, files, ...found, ...(step.diff ? [details] : []))];
}

/** A step's explanation, what was said about its decision, its assumptions and notes as prose; its files as code. */
function stepBody(step: Step): { prose: HTMLElement[]; code: HTMLElement[] } {
  const said = stepDecisionView(step);
  const pinned = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && !answersAsk(entry) && anchorOf(entry) === step.id,
  );
  const stepNotes = pinned.filter(isNote).filter(note => !note.note.lines);
  const notes = stepNotes.length ? [el('div', { className: 'step-notes' }, ...notesView(stepNotes, `more:${step.id}`))] : [];
  switch (step.kind) {
    case 'step':
      return {
        prose: [markdown(step.explanation, 'explanation'), ...said, ...assumedView(step), ...notes],
        code: [el('div', { className: 'block' }, diffView(step, pinned))],
      };
    case 'folded':
      return {
        prose: [el('p', { className: 'explanation' }, 'Folded by the session, not shown line by line.'), ...said, ...notes],
        code: foldedView(step, pinned),
      };
  }
}

/** What the person and the session said about the step's decision, or the decision it had before it reopened. */
function stepDecisionView(step: Step): HTMLElement[] {
  const item: Item = { type: 'step', id: step.id };
  const decision = decisionOf(item);
  const reopened = stepReopened(step);
  if (reopened && !decision) {
    const note = reopened.note ? [' ', el('s', {}, `“${reopened.note}”`)] : [];
    return [
      el('p', { className: 'reopened-line' }, 'Changed since you chose ', el('strong', {}, labelOf(item, reopened.action)), '.', ...note),
      ...followUps(reopened).map(said),
    ];
  }
  if (!decision) return [];
  return [
    el(
      'div',
      { className: 'decision-said' },
      ...(decision.note ? [el('span', { className: 'muted' }, 'Your note'), el('p', { className: 'said person' }, decision.note)] : []),
      ...(decision.text ? [markdown(decision.text, 'said person')] : []),
      ...followUps(decision).map(said),
    ),
  ];
}

/** The sticky bar at the foot of a step: its actions, or the form an action asks for, and the Ask box unless `asks` is false. */
function actionBar(step: Step, asks = true): HTMLElement[] {
  if (readOnly) return [];
  const item: Item = { type: 'step', id: step.id };
  const key = itemKey(item);
  const actions = walkthrough.actions[key] ?? [];
  const taken = taking?.key === key ? actions.find(action => action.id === taking?.action) : undefined;
  if (taken) return [el('div', { className: 'action-bar' }, takingForm(item, taken, ''))];
  const draft = `ask:${step.id}`;
  const ask = lineBox(draft, 'Ask about this step', 'Ask about this step…', () => {
    void send('ask', { step: step.id, text: drafts.get(draft) ?? '' }, draft);
  });
  const decided = stepDecided(step) && !changing.has(key);
  const change = el('button', { type: 'button', className: 'btn', onclick: () => { changing.add(key); render(); } }, 'Change decision');
  change.dataset['key'] = `change:${key}`;
  const choices = decided ? change : actionGroup(item, stepLook);
  const asking = asks ? [ask] : [];
  if (!phone.matches) return [el('div', { className: 'action-bar' }, el('div', { className: 'action-row' }, choices, ...asking))];
  // A thumb reaches the right first, so the leading action goes last.
  if (!decided) choices.replaceChildren(...[...choices.children].reverse());
  return [...asking.map(box => el('div', { className: 'step-ask' }, box)), el('div', { className: 'action-bar' }, choices)];
}

// The split step and its panes stay in the page across redraws, as the main pane does, so each keeps where it was scrolled.
const prosePane = el('div', { className: 'prose' });
const codePane = el('div', { className: 'code' });
const splitStep = el('section', { className: 'step split' }, prosePane, codePane);

/** In "Explanation beside code" the prose pane leads with the notices, then the step, its actions and the checklist; the files fill the code pane. */
function stepView(step: Step, notices: HTMLElement[], view: View): HTMLElement {
  const title = el('h2', { className: 'step-title', id: `step-${step.id}` }, step.title);
  const asks = session.conversation.filter(isAsk).filter(asked => anchorOf(asked) === step.id && !asked.lines);
  const { prose, code } = stepBody(step);
  const parts = [
    el('div', { className: 'title-row' }, title, stateTag({ type: 'step', id: step.id }, false)),
    ...prose,
    ...(layout === 'split' ? [] : code),
    ...(asks.length ? [el('div', { className: 'conversation' }, ...asks.map(askThread))] : []),
    ...actionBar(step),
  ];
  let section = splitStep;
  if (layout === 'split') {
    prosePane.replaceChildren(...notices, navRow(view), ...parts, ...besideChecklist(view), ...sessionRow(view));
    codePane.replaceChildren(...code);
  } else section = el('section', { className: 'step' }, ...parts);
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

/** A row of the rail: a state icon, a title and an optional sub-line, linking to what it names. */
function queueRow(
  address: string,
  state: string,
  mark: IconName,
  title: string,
  sub: { text: string; attention?: boolean } | null,
  // Only a step is one of a sequence; the session's messages and the checklist are pages of their own.
  current: false | 'step' | 'page',
): HTMLElement {
  const row = el(
    'a',
    { href: `#${encodeURIComponent(address)}`, className: 'queue-item' },
    icon(mark),
    el('span', { className: 'queue-title' }, title, ...(sub ? [el('span', { className: sub.attention ? 'queue-sub attention' : 'queue-sub' }, sub.text)] : [])),
  );
  row.dataset['state'] = state;
  row.dataset['key'] = `row:${address}`;
  if (current) row.setAttribute('aria-current', current);
  return row;
}

function stepRow(step: Step, isCurrent: boolean): HTMLElement {
  const current = isCurrent && 'step';
  if (stepDecided(step)) {
    const decision = decisionOf({ type: 'step', id: step.id });
    const label = decision ? labelOf({ type: 'step', id: step.id }, decision.action) : '';
    return queueRow(step.id, 'decided', 'decided', step.title, { text: `Decided: ${label}` }, current);
  }
  if (stepReopened(step)) return queueRow(step.id, 'reopened', 'reopened', step.title, { text: 'Reopened' }, current);
  if (step.kind === 'folded') {
    const problems = step.problems.length ? { text: plural(step.problems.length, 'problem'), attention: true } : null;
    return queueRow(step.id, 'folded', 'folded', step.title, problems, current);
  }
  const read = walkthrough.read.includes(step.id);
  return queueRow(step.id, read ? 'read' : 'unread', read ? 'read' : 'unread', step.title, null, current);
}

/** Checklist items that still need the person: marked not met by the session, or offering actions not yet decided. */
function leftItems(): ChecklistItem[] {
  return (walkthrough.checklist?.items ?? []).filter(item => {
    const key = itemKey({ type: 'checklist', id: item.id });
    return item.mark === 'not-met' || ((walkthrough.actions[key] ?? []).length > 0 && !walkthrough.decided[key]);
  });
}

/** The row that opens what the session said outside any step, when it said anything or files are in no step. */
function sessionRow(view: View): HTMLElement[] {
  const messages = sessionMessages().length;
  const unplaced = walkthrough.unplaced?.length ?? 0;
  if (!messages && !unplaced) return [];
  const sub = [...(messages ? [plural(messages, 'message')] : []), ...(unplaced ? [`${plural(unplaced, 'file')} not in a step`] : [])];
  return [queueRow('session', 'message', 'message', 'From the session', { text: sub.join(', ') }, view.kind === 'session' && 'page')];
}

/** The address and title of what the main pane shows, as the phone's select names it. */
function viewAddress(view: View): [string, string] | null {
  switch (view.kind) {
    case 'step':
      return [view.step.id, view.step.title];
    case 'session':
      return ['session', 'From the session'];
    case 'checklist': {
      const item = walkthrough.checklist?.items.find(one => one.id === view.item);
      return item ? [`checklist-${item.id}`, plain(item.text)] : ['checklist', walkthrough.checklist?.title ?? ''];
    }
    case 'end':
      return ['end', 'End of the walkthrough'];
    case 'deck':
      return ['deck', 'Swipe to decide'];
    case 'preparing':
      return null;
  }
}

/** The rail at phone width: a select of the rows left, then the decided steps and the end. */
function queueSelect(view: View, left: [string, string][], decided: Step[]): HTMLElement {
  const shown = viewAddress(view);
  const option = ([address, title]: [string, string]) =>
    el('option', { value: address, selected: address === shown?.[0] }, address === shown?.[0] ? `Left ${String(left.length)} · ${title}` : title);
  const known = [...left, ...decided.map(step => [step.id, step.title]), ['end', '']].some(([address]) => address === shown?.[0]);
  const select = el(
    'select',
    { onchange: () => { go(select.value); } },
    ...(shown && !known ? [option(shown)] : []),
    ...(walkthrough.steps.length || left.length ? [] : [el('option', { disabled: true, selected: true }, 'No steps yet')]),
    ...left.map(option),
    ...(decided.length ? [el('optgroup', { label: `${String(decided.length)} decided` }, ...decided.map(step => option([step.id, step.title])))] : []),
    ...(walkthrough.steps.length ? [option(['end', 'End of the walkthrough'])] : []),
  );
  select.setAttribute('aria-label', 'Step');
  select.dataset['key'] = 'queue-select';
  const box = selectBox(select);
  box.classList.add('queue-select');
  return box;
}

function queueView(view: View): HTMLElement[] {
  const { steps } = walkthrough;
  const current = view.kind === 'step' ? view.step : undefined;
  const undecided = steps.filter(step => !stepDecided(step));
  const fromSession = sessionRow(view);
  const rows = [...undecided.map(step => stepRow(step, step === current)), ...fromSession];
  const left: [string, string][] = undecided.map(step => [step.id, step.title]);
  if (fromSession.length) left.push(['session', 'From the session']);
  for (const item of leftItems()) {
    const at = view.kind === 'checklist' && view.item === item.id;
    rows.push(queueRow(`checklist-${item.id}`, item.mark ?? 'unchecked', item.mark ?? 'unchecked', plain(item.text), { text: 'Checklist' }, at && 'page'));
    left.push([`checklist-${item.id}`, plain(item.text)]);
  }
  const counted = steps.length > 0 || rows.length > 0;
  const leftCount = el('span', { className: 'counter' }, String(rows.length));
  leftCount.dataset['motion'] = 'count:left';
  const head = el('h2', { className: 'queue-head', id: 'queue-head' }, 'Left', ...(counted ? [leftCount] : []));
  const empty = rows.length ? [] : [el('p', { className: 'queue-empty' }, steps.length ? 'Everything is decided.' : 'No steps yet')];
  const decided = steps.filter(stepDecided);
  const open = opened.has('decided') || (current !== undefined && decided.includes(current));
  const decidedCount = el('span', {}, `${String(decided.length)} decided`);
  decidedCount.dataset['motion'] = 'count:decided';
  const toggleDecided = el(
    'button',
    { type: 'button', className: 'decided-toggle', onclick: () => { toggle(opened, 'decided'); } },
    icon('decided'),
    decidedCount,
    icon(open ? 'chevron-down' : 'chevron-right'),
  );
  toggleDecided.setAttribute('aria-expanded', String(open));
  toggleDecided.dataset['key'] = 'decided-toggle';
  const foot = decided.length
    ? [
        el(
          'div',
          { className: 'queue-foot' },
          toggleDecided,
          ...(open ? [el('div', { className: 'queue-decided' }, ...decided.map(step => stepRow(step, step === current)))] : []),
        ),
      ]
    : [];
  return [queueSelect(view, left, decided), head, ...rows, ...empty, ...foot];
}

const stepNumber = (id: string) => walkthrough.steps.findIndex(step => step.id === id) + 1;

/** Counted only when the session marks items, since a status alone says nothing the page can count. */
const metCount = (items: ChecklistItem[]) =>
  items.some(item => item.mark !== undefined) ? `${String(items.filter(item => item.mark === 'met').length)}/${String(items.length)}` : null;

function checklistView({ title, items }: Checklist, view: View): HTMLElement {
  const heading = el('h2', { className: view.kind === 'checklist' ? 'step-title' : 'section-head', id: 'checklist' }, title);
  const rows = items.map(item => {
    const links: HTMLElement[] = item.steps.flatMap(id => {
      const at = stepNumber(id);
      const step = walkthrough.steps[at - 1];
      if (!step) return [];
      const link = el('a', { href: `#${encodeURIComponent(id)}`, className: 'step-link', title: step.title }, String(at));
      link.setAttribute('aria-label', `Step ${String(at)}`);
      return [link];
    });
    const gone = item.steps.length - links.length;
    const mark = item.mark ?? 'unchecked';
    const row = el(
      'li',
      { className: view.kind === 'checklist' && view.item === item.id ? 'current' : '' },
      icon(mark),
      el('div', { className: 'item-body' }, markdown(item.text, 'item-text'), el('span', { className: 'item-status' }, item.status)),
      ...links,
      ...(gone
        ? [el('p', { className: 'gone' }, icon('unlink'), `${plural(gone, 'linked step')} ${gone === 1 ? 'is' : 'are'} no longer in the change`)]
        : []),
      ...decideView({ type: 'checklist', id: item.id }, item.text),
    );
    row.dataset['mark'] = mark;
    row.id = `checklist-item-${item.id}`;
    return row;
  });
  const head = view.kind === 'checklist' ? el('div', { className: 'title-row' }, heading) : heading;
  const met = metCount(items);
  if (met !== null) head.append(el('span', { className: 'counter' }, met));
  const section = el('section', { className: 'checklist' }, head, el('ul', {}, ...rows));
  section.setAttribute('aria-labelledby', heading.id);
  return section;
}

function wholeView(): HTMLElement[] {
  const item: Item = { type: 'walkthrough' };
  const actions = walkthrough.actions[itemKey(item)] ?? [];
  if (!actions.length) return [];
  const heading = el('h2', { className: 'section-head', id: 'whole' }, 'Whole walkthrough', stateTag(item, true));
  const shown = walkthrough.decided[itemKey(item)] ?? walkthrough.reopened[itemKey(item)];
  const taken = taking?.key === itemKey(item) ? actions.find(action => action.id === taking?.action) : undefined;
  const section = el(
    'section',
    { className: 'whole' },
    heading,
    ...(shown ? decisionSaid(shown) : []),
    ...(readOnly ? [] : [taken ? takingForm(item, taken, '') : el('div', { className: 'action-row' }, actionGroup(item, firstLeads))]),
  );
  section.setAttribute('aria-labelledby', heading.id);
  return [section];
}

function endView(): HTMLElement {
  const { steps } = walkthrough;
  const decided = steps.filter(stepDecided).length;
  const title = el(
    'h2',
    { className: 'step-title', id: 'end' },
    decided === steps.length ? `All ${plural(steps.length, 'step')} decided` : `${String(decided)} of ${plural(steps.length, 'step')} decided`,
  );
  const rows = steps.map((step, at) => {
    const item: Item = { type: 'step', id: step.id };
    const decision = decisionOf(item);
    return el(
      'tr',
      {},
      el('td', { className: 'number' }, String(at + 1)),
      el('td', {}, el('a', { href: `#${encodeURIComponent(step.id)}` }, step.title), ...(decision?.note ? [el('span', { className: 'decision-note' }, decision.note)] : [])),
      el('td', { className: 'decision' }, decision ? el('span', { className: 'tag decided' }, labelOf(item, decision.action)) : stateTag(item, false)),
    );
  });
  const section = el(
    'section',
    { className: 'end' },
    el('div', { className: 'title-row' }, title),
    el('p', { className: 'explanation' }, 'Decisions stay changeable until you finish.'),
    el('table', { className: 'decisions' }, el('tbody', {}, ...rows)),
    ...(walkthrough.checklist ? [checklistView(walkthrough.checklist, { kind: 'end' })] : []),
    ...wholeView(),
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

/** What the session said outside any step, each with its replies; a question still waiting shows in its own box instead. */
function sessionThreads(): HTMLElement[] {
  const waiting = new Set(waitingQuestions().map(message => message.id));
  const threads = sessionMessages()
    .filter(message => !waiting.has(message.id))
    .map(message => el('div', { className: 'thread' }, said(message), ...followUps(message).map(said)));
  return threads.length ? threads : [el('p', { className: 'muted' }, 'Nothing from the session yet.')];
}

function sessionView(): HTMLElement {
  const title = el('h2', { className: 'step-title', id: 'from-session' }, 'From the session');
  const section = el('section', { className: 'messages' }, el('div', { className: 'title-row' }, title), ...sessionThreads());
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

function preparingView(): HTMLElement {
  return el(
    'div',
    { className: 'preparing' },
    el('div', { className: 'preparing-head' }, icon('spinner'), el('div', {}, el('strong', {}, 'Preparing the steps'), el('span', { className: 'muted' }, 'They appear here as the session records them.'))),
    el('div', { className: 'skeleton title' }),
    el('div', { className: 'skeleton' }),
    el('div', { className: 'skeleton short' }),
  );
}

/* ---------- the swipe deck ---------- */

/** How far a card travels before letting it go decides it. */
const SWIPE = 90;
/** The --base duration a card takes to fly out. */
const FLIGHT_MS = 200;
/** From touching a card until it is let go or its flight ends; a redraw meanwhile waits in `redrawLater`. */
let swiping = false;
/** The step whose card was swiped away, until its decision is taken or cancelled; 1 is right, -1 left. */
let flung: { step: string; to: 1 | -1 } | null = null;

const deckTop = () => walkthrough.steps.find(step => !stepDecided(step));

/** Where the dragged card is: the deck's custom properties move the card, its chips, edges and the card beneath. */
function moveCard(deck: HTMLElement, dx: number): void {
  const progress = Math.min(Math.abs(dx) / SWIPE, 1);
  deck.style.setProperty('--dx', `${String(dx)}px`);
  deck.style.setProperty('--turn', `${String(dx * 0.025)}deg`);
  deck.style.setProperty('--p', String(progress));
  deck.style.setProperty('--pa', String(dx > 0 ? progress : 0));
  deck.style.setProperty('--pf', String(dx < 0 ? progress : 0));
  deck.dataset['toward'] = dx > 0 ? 'approve' : dx < 0 ? 'flag' : '';
  deck.classList.toggle('past', progress === 1);
}

function settle(): void {
  swiping = false;
  if (redrawLater) render();
}

/** Flies the top card out, then approves its step, or asks for the Flag note. */
function fling(deck: HTMLElement, step: Step, to: 1 | -1): void {
  swiping = true;
  deck.classList.remove('dragging');
  deck.classList.add('flying');
  moveCard(deck, to * (innerWidth + 120));
  setTimeout(() => {
    const item: Item = { type: 'step', id: step.id };
    flung = { step: step.id, to };
    if (to < 0) taking = { key: itemKey(item), action: 'flag' };
    swiping = false;
    render();
    if (to < 0) document.querySelector<HTMLTextAreaElement>('.taking textarea')?.focus();
    // A decision that does not go through brings the card back.
    else
      void decide(item, 'approve').then(() => {
        if (!flung) return;
        flung = null;
        render();
      });
  }, FLIGHT_MS);
}

/** The card follows a finger or the mouse sideways when it `swipes`; a vertical move is left to scrolling, and a drag is never a tap. */
function swipeable(deck: HTMLElement, card: HTMLElement, step: Step, swipes: boolean): void {
  let moved = false;
  card.ondragstart = event => {
    event.preventDefault();
  };
  card.onclick = event => {
    if (moved) event.preventDefault();
  };
  card.onpointerdown = down => {
    if (down.button !== 0 || swiping) return;
    if (down.pointerType === 'mouse') down.preventDefault();
    // Captured, the pointer's up or cancel always arrives, so the deck never waits on a lost gesture.
    if (down.isTrusted) card.setPointerCapture(down.pointerId);
    moved = false;
    swiping = true;
    let dragged = false;
    let dx = 0;
    const end = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerId !== down.pointerId) return;
      const x = event.clientX - down.clientX;
      const y = event.clientY - down.clientY;
      if (!dragged) {
        if (Math.abs(x) <= 8 && Math.abs(y) <= 8) return;
        moved = true;
        dragged = Math.abs(x) > Math.abs(y);
        if (!dragged || !swipes) {
          end();
          settle();
          return;
        }
        deck.classList.add('dragging');
      }
      dx = x;
      moveCard(deck, dx);
    };
    const up = (event: PointerEvent) => {
      if (event.pointerId !== down.pointerId) return;
      end();
      if (!dragged) {
        settle();
        return;
      }
      if (event.type === 'pointerup' && Math.abs(dx) > SWIPE) {
        fling(deck, step, dx > 0 ? 1 : -1);
        return;
      }
      deck.classList.remove('dragging');
      moveCard(deck, 0);
      settle();
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };
}

/** Three lines of the step's diff: those ending at its first note's lines, or the start of its first hunk. */
function miniDiff(step: Step, note: Note | undefined): HTMLElement[] {
  const files = parse(step.diff);
  const file = files.find(one => one.newName === note?.note.file) ?? files[0];
  if (!file) return [];
  const rows = file.blocks.flatMap(block => [block.header, ...block.lines]);
  const last = note?.note.lines?.[1];
  const end = last === undefined ? -1 : rows.findIndex(row => typeof row !== 'string' && row.newNumber === last);
  const shown = end < 0 ? rows.slice(0, 3) : rows.slice(Math.max(0, end - 2), end + 1);
  const table = el(
    'table',
    { className: 'mini-diff' },
    el(
      'tbody',
      {},
      ...shown.map(row =>
        typeof row === 'string'
          ? el('tr', { className: 'hunk' }, el('td'), el('td'), el('td', {}, row))
          : el(
              'tr',
              { className: row.type },
              el('td', {}, String(row.oldNumber ?? '')),
              el('td', {}, String(row.newNumber ?? '')),
              el('td', {}, el('span', { className: 'prefix' }, row.content.slice(0, 1)), row.content.slice(1)),
            ),
      ),
    ),
  );
  return [el('div', { className: 'mini' }, table)];
}

function cardView(step: Step, top: boolean, swipes: boolean): HTMLElement {
  const notes = session.conversation.filter((entry): entry is Note => isNote(entry) && !answersAsk(entry) && anchorOf(entry) === step.id);
  const first = notes.find(note => !note.note.low);
  const explanation =
    step.kind === 'step'
      ? markdown(step.explanation, 'explanation')
      : el('p', { className: 'explanation' }, 'Folded by the session, not shown line by line.');
  // The card is one link, so links in the explanation read as text.
  for (const link of explanation.querySelectorAll('a')) link.replaceWith(...link.childNodes);
  const title = el('div', { className: 'title-row' }, el('span', { className: 'step-title' }, step.title), stateTag({ type: 'step', id: step.id }, false));
  if (!top) {
    const beneath = el('div', { className: 'swipe-card next' }, title, explanation);
    beneath.setAttribute('aria-hidden', 'true');
    return beneath;
  }
  const chip = (kind: 'approve' | 'flag', mark: IconName, label: string) => {
    const shown = el('span', { className: `decision-chip ${kind}` }, icon(mark), label);
    shown.setAttribute('aria-hidden', 'true');
    return shown;
  };
  const where = (lines: Lines | undefined) => (lines ? ` · ${linesLabel(lines).toLowerCase()}` : '');
  const card = el(
    'a',
    { className: 'swipe-card top', href: `#${encodeURIComponent(step.id)}`, draggable: false },
    ...(swipes ? [chip('approve', 'met', 'Approve'), chip('flag', 'warn', 'Flag')] : []),
    title,
    explanation,
    ...(step.kind === 'step' ? miniDiff(step, first) : []),
    ...(first
      ? [el('p', { className: 'card-note' }, icon('warn'), el('span', {}, el('b', {}, first.note.label), `${where(first.note.lines)}: ${plain(first.text)}`))]
      : []),
    el('span', { className: 'card-meta' }, `${plural(step.files.length, 'file')} · ${notes.length ? plural(notes.length, 'note') : 'no notes'}`),
  );
  card.setAttribute('aria-label', `Open step ${String(stepNumber(step.id))}, ${step.title}`);
  return card;
}

/** The steps left as a deck of cards: swiping the top one decides it, and the buttons stay for anyone who doesn't swipe. */
function deckView(): HTMLElement {
  if (!walkthrough.steps.length) return preparingView();
  const section = el('section', { className: 'deck-view' });
  section.setAttribute('aria-label', 'Swipe to decide');
  const top = deckTop();
  if (!top) {
    section.append(el('p', { className: 'deck-empty' }, 'Everything is decided.'), el('a', { href: '#end' }, 'See the end of the walkthrough'));
    return section;
  }
  const next = walkthrough.steps.find(step => step !== top && !stepDecided(step));
  const item: Item = { type: 'step', id: top.id };
  // Swiping right means Approve only while the step offers the built-in actions.
  const swipes = builtIn(walkthrough.actions[itemKey(item)] ?? []);
  const card = cardView(top, true, swipes);
  const edge = (side: 'left' | 'right', mark: IconName, label: string) => {
    const shown = el('span', { className: `edge ${side}` }, ...(side === 'left' ? [icon(mark), label] : [label, icon(mark)]));
    shown.setAttribute('aria-hidden', 'true');
    return shown;
  };
  const deck = el(
    'div',
    { className: swipes ? 'deck swipes' : 'deck' },
    ...(swipes ? [edge('left', 'previous', 'Flag'), edge('right', 'next', 'Approve')] : []),
    ...(next ? [cardView(next, false, swipes)] : []),
    card,
  );
  if (flung?.step === top.id) deck.classList.add('flung');
  swipeable(deck, card, top, swipes);
  const bar = actionBar(top, false);
  for (const [id, to] of [['approve', 1], ['flag', -1]] as const) {
    const button = bar.at(-1)?.querySelector<HTMLButtonElement>(`[data-key="${CSS.escape(`action:${itemKey(item)}:${id}`)}"]`);
    if (button && swipes)
      button.onclick = () => {
        fling(deck, top, to);
      };
  }
  const hint = swipes
    ? 'Swipe right to approve, left to flag. Tap to open the step.'
    : "The session chose this step's actions; use the buttons. Tap to open the step.";
  section.append(deck, el('p', { className: 'swipe-hint' }, hint), ...bar);
  return section;
}

function questionBox(message: SessionMessage): HTMLElement {
  const draft = `reply:${message.id}`;
  const choices = (message.choices ?? []).map((choice, at) =>
    el('button', { type: 'button', className: at === 0 ? 'btn primary' : 'btn', onclick: () => void send('reply', { to: message.id, text: choice }) }, choice),
  );
  const reply = lineBox(draft, 'Reply', choices.length ? 'Or reply…' : 'Reply…', () => {
    void send('reply', { to: message.id, text: drafts.get(draft) ?? '' }, draft);
  });
  const head = el('p', { className: 'question-head', id: `asks-${message.id}` }, icon('ask'), 'The session asks');
  const box = el('section', { className: 'question-box' }, head, markdown(message.text, 'question-text'), el('div', { className: 'action-row' }, ...choices, reply));
  box.setAttribute('aria-labelledby', head.id);
  return box;
}

function goneNotice(): HTMLElement[] {
  if (readOnly || stopped || session.state !== 'gone') return [];
  return [
    el(
      'div',
      { className: 'notice' },
      icon('offline'),
      el('span', {}, el('strong', {}, 'The session stopped listening.'), ' Your decisions are kept; start the session again to continue.'),
    ),
  ];
}

function unplacedNotice(): HTMLElement[] {
  const files = walkthrough.unplaced ?? [];
  if (!files.length) return [];
  const notice = el(
    'div',
    { className: 'notice' },
    icon('file'),
    el(
      'div',
      { className: 'notice-body' },
      el('span', {}, 'Changed files not in any step yet'),
      el('div', { className: 'file-chips' }, ...files.map(file => el('code', { className: 'file-chip' }, file))),
    ),
  );
  notice.setAttribute('role', 'region');
  notice.setAttribute('aria-label', 'Changed files not in any step yet');
  return [notice];
}

function detachedView(): HTMLElement[] {
  const gone = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && !answersAsk(entry) && anchorOf(entry) === null,
  );
  const known = new Set(walkthrough.steps.map(step => step.id));
  const links = (walkthrough.checklist?.items ?? []).filter(item => item.steps.some(id => !known.has(id)));
  const count = gone.length + links.length;
  if (!count) return [];
  const title = el('h2', { className: 'detached-head', id: 'detached' }, icon('unlink'), 'Detached', el('span', { className: 'counter' }, String(count)));
  const section = el(
    'section',
    { className: 'detached-box' },
    title,
    ...gone.map(entry => (isNote(entry) ? noteView(entry) : el('div', {}, wasView(entry), askThread(entry)))),
    ...links.map(item => el('p', { className: 'detached-item' }, icon('unlink'), el('span', {}, `Checklist “${plain(item.text)}” linked to a step that no longer exists`))),
  );
  section.setAttribute('aria-labelledby', title.id);
  return [section];
}

function viewBody(view: View, notices: HTMLElement[]): HTMLElement {
  switch (view.kind) {
    case 'step':
      return stepView(view.step, notices, view);
    case 'session':
      return sessionView();
    case 'checklist':
      return walkthrough.checklist ? checklistView(walkthrough.checklist, view) : endView();
    case 'end':
      return endView();
    case 'deck':
      return deckView();
    case 'preparing':
      return preparingView();
  }
}

/** The checklist sits beside the step in every layout but the default, unless the main pane shows it already. */
function besideChecklist(view: View): HTMLElement[] {
  const { checklist } = walkthrough;
  if (layout === 'queue' || !checklist || view.kind === 'checklist' || view.kind === 'end') return [];
  return [checklistView(checklist, view)];
}

/** Where Previous and Next lead: the steps in order, then the end; from a page of its own, back to the steps. */
function neighbours(view: View): [string | null, string | null] {
  const { steps } = walkthrough;
  if (view.kind === 'step') {
    const at = steps.indexOf(view.step);
    return [steps[at - 1]?.id ?? null, steps[at + 1]?.id ?? 'end'];
  }
  if (view.kind === 'end') return [steps.at(-1)?.id ?? null, null];
  return [null, steps.find(step => !stepDecided(step))?.id ?? (steps.length ? 'end' : null)];
}

/** "Explanation beside code" has no rail, so the prose pane walks the steps with Previous and Next. */
function navRow(view: View): HTMLElement {
  const [previous, next] = neighbours(view);
  const button = (label: string, shape: IconName, to: string | null) => {
    const made = el('button', { type: 'button', className: 'icon-button', title: label, disabled: to === null }, icon(shape));
    made.setAttribute('aria-label', label);
    made.dataset['key'] = `nav:${shape}`;
    made.onclick = () => {
      if (to !== null) go(to);
    };
    return made;
  };
  const nav = el('nav', { className: 'step-nav' }, button('Previous step', 'previous', previous), button('Next step', 'next', next));
  nav.setAttribute('aria-label', 'Steps');
  return nav;
}

type Tool = 'notes' | 'checklist' | 'session';
/** The tool panel's tab the person chose; until then the checklist, or the notes when there is none. */
let tool: Tool | null = null;

const stepNotesOf = (step: Step) =>
  session.conversation.filter((entry): entry is Note => isNote(entry) && !answersAsk(entry) && anchorOf(entry) === step.id);

/** Opens whatever hides a note in the step and brings it into view. */
function showNote(step: Step, note: Note): void {
  if (step.kind === 'folded') {
    opened.add(`fold:${step.id}`);
    opened.add(step.id);
  }
  render();
  const shown = document.getElementById(`note-${note.id}`);
  if (!shown) return;
  for (let hidden = shown.closest('details'); hidden; hidden = hidden.parentElement?.closest('details') ?? null) hidden.open = true;
  shown.tabIndex = -1;
  shown.focus();
}

function noteIndex(step: Step, notes: Note[]): HTMLElement[] {
  if (!notes.length) return [el('p', { className: 'muted' }, 'No notes on this step.')];
  const rows = notes.map(note => {
    const { label, lines } = note.note;
    const button = el(
      'button',
      { type: 'button', className: 'note-link' },
      el('span', { className: 'label' }, label),
      ...(lines ? [el('span', { className: 'lines' }, linesLabel(lines))] : []),
      el('span', { className: 'gist' }, plain(note.text)),
    );
    button.dataset['key'] = `note-link:${note.id}`;
    button.onclick = () => {
      showNote(step, note);
    };
    return el('li', {}, button);
  });
  return [el('ul', { className: 'note-index' }, ...rows)];
}

/** "Tool panel": the step's notes, the checklist and what the session said, as tabs under the step. */
function toolPanel(view: View): HTMLElement[] {
  const step = view.kind === 'step' ? view.step : undefined;
  const checklist = besideChecklist(view);
  const tabs: { id: Tool; label: string; count: string; body: () => HTMLElement[] }[] = [];
  if (step) {
    const notes = stepNotesOf(step);
    tabs.push({ id: 'notes', label: 'Notes', count: String(notes.length), body: () => noteIndex(step, notes) });
  }
  const items = walkthrough.checklist?.items ?? [];
  if (checklist.length) tabs.push({ id: 'checklist', label: 'Checklist', count: metCount(items) ?? String(items.length), body: () => checklist });
  tabs.push({ id: 'session', label: 'From the session', count: String(sessionMessages().length), body: sessionThreads });
  const chosen = tool ?? (walkthrough.checklist ? 'checklist' : 'notes');
  const shown = tabs.find(tab => tab.id === chosen) ?? tabs[0];
  if (!shown) return [];
  const select = (id: Tool) => {
    tool = id;
    render();
    document.querySelector<HTMLElement>(`[data-key="tab:${id}"]`)?.focus();
  };
  const buttons = tabs.map(tab => {
    const selected = tab === shown;
    const button = el('button', { type: 'button', className: 'tab', id: `tab-${tab.id}`, tabIndex: selected ? 0 : -1 }, tab.label, el('span', { className: 'counter' }, tab.count));
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(selected));
    if (selected) button.setAttribute('aria-controls', 'tool-body');
    button.dataset['key'] = `tab:${tab.id}`;
    button.onclick = () => {
      select(tab.id);
    };
    return button;
  });
  const list = el('div', { className: 'tabs' }, ...buttons);
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Tool panel');
  list.onkeydown = event => {
    const at = tabs.indexOf(shown);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1 + tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    const tab = tabs[to % tabs.length];
    if (tab) select(tab.id);
  };
  const body = el('div', { className: `tool-body ${shown.id}`, id: 'tool-body' }, ...shown.body());
  body.setAttribute('role', 'tabpanel');
  body.setAttribute('aria-labelledby', `tab-${shown.id}`);
  return [list, body];
}

/** A redraw under a pressed pointer would swap the control out before its click lands, so it waits for the release. */
let pressed = false;
let redrawLater = false;
document.addEventListener('pointerdown', () => {
  pressed = true;
}, true);
for (const [target, released] of [[document, 'pointerup'], [document, 'pointercancel'], [window, 'blur']] as const)
  target.addEventListener(released, () => {
    pressed = false;
    if (!redrawLater) return;
    redrawLater = false;
    // After the click this release makes.
    setTimeout(render, 0);
  }, true);

function render(): void {
  // A redraw would swap a pressed control or a dragged card out from under the person, so it waits for the release.
  if (pressed || swiping) {
    redrawLater = true;
    return;
  }
  redrawLater = false;
  lastSession = JSON.stringify(session);
  lastWalkthrough = JSON.stringify(walkthrough);
  // Redrawn whole, so the box being typed in gets its focus and caret back.
  const focused = document.activeElement;
  const typing = focused instanceof HTMLTextAreaElement || focused instanceof HTMLInputElement ? focused : null;
  const draft = typing?.dataset['draft'];
  const caret = [typing?.selectionStart ?? 0, typing?.selectionEnd ?? 0] as const;
  const view = currentView();
  document.body.dataset['layout'] = layout;
  document.body.dataset['view'] = view.kind;
  // Emptying a pane to redraw it scrolls it back to the top in WebKit, so each pane is put back where it was.
  const panes = [queue, main, prosePane, codePane, side, tools];
  const scrolled = panes.map(pane => pane.scrollTop);
  const before = drawnState;
  const decided = new Set(Object.keys(walkthrough.decided).filter(key => walkthrough.decided[key]));
  const newly = before ? [...decided].filter(key => !before.decided.has(key)) : [];
  const decisionsMoved = newly.length > 0 || [...(before?.decided ?? [])].some(key => !decided.has(key));
  const shownView = viewKey(view);
  const swapped = before !== null && before.view !== shownView;
  const rows = [...queue.querySelectorAll<HTMLElement>(':scope > .queue-item[data-key]')].map(row => {
    const { paddingTop, paddingBottom } = getComputedStyle(row);
    return { row, key: row.dataset['key'] ?? '', height: row.offsetHeight, paddingTop, paddingBottom };
  });
  const wasSplit = main.contains(splitStep);
  // The split step's panes stay for the next step, so what leaves is their content, moved into panes of its own.
  const oldPane = !swapped
    ? []
    : wasSplit
      ? [el('section', { className: 'step split' }, el('div', { className: 'prose' }, ...prosePane.childNodes), el('div', { className: 'code' }, ...codePane.childNodes))]
      : [...main.childNodes].filter(node => node !== leavingPane);
  header.replaceChildren(...headerView());
  queue.replaceChildren(...queueView(view));
  const notices = [...waitingQuestions().map(questionBox), ...goneNotice(), ...unplacedNotice(), ...detachedView()];
  const split = layout === 'split' && view.kind === 'step';
  main.classList.toggle('split', split);
  const shown = [...(split ? [] : [...(layout === 'split' && view.kind !== 'preparing' ? [navRow(view)] : []), ...notices]), viewBody(view, notices)];
  const present = [...main.children].filter(child => child !== leavingPane);
  // Putting the split step back would lose where its panes were scrolled.
  if (shown.length !== present.length || shown.some((part, at) => present[at] !== part)) main.replaceChildren(...shown);
  side.replaceChildren(...(layout === 'three' ? besideChecklist(view) : []));
  side.hidden = !side.hasChildNodes();
  tools.replaceChildren(...(layout === 'panel' ? toolPanel(view) : []));
  panes.forEach((pane, at) => {
    pane.scrollTop = scrolled[at] ?? 0;
  });
  for (const part of shown) part.dataset['motion'] = 'pane-enter';
  leaveRows(rows, newly);
  placeGhosts();
  if (swapped) swapPanes(oldPane, wasSplit, scrolled.slice(1, 4));
  else if (leavingPane) main.prepend(leavingPane);
  const counts = new Map(
    [...document.querySelectorAll<HTMLElement>('[data-motion^="count:"]')].map(count => [count.dataset['motion'] ?? '', count.textContent]),
  );
  if (decisionsMoved) moveDecided(newly, counts, before?.counts);
  const state = stopped ? 'stopped' : session.state;
  if (state === 'needs-you' && before?.state !== 'needs-you' && !reduced())
    play('pulse', 'pulse', [{ boxShadow: '0 0 0 0 currentColor' }, { boxShadow: '0 0 0 6px transparent' }], { ms: 1200, curve: 'ease-out', iterations: 2 });
  drawnState = { decided, view: shownView, state, counts };
  replay();
  if (view.kind === 'step') void markRead(view.step);
  // The pane leaving is a picture of what was, so nothing in it takes focus again.
  const current = (selector: string) => [...document.querySelectorAll<HTMLElement>(selector)].find(found => !leavingPane?.contains(found));
  const lost = focused instanceof HTMLElement && (!focused.isConnected || !!leavingPane?.contains(focused));
  // A diff is kept across redraws, so a line number focused in it is still there to focus again; a redrawn control is found by its key.
  const kept = lost && focused.dataset['key'] !== undefined ? current(`[data-key="${CSS.escape(focused.dataset['key'])}"]`) : focused;
  if (kept instanceof HTMLElement && kept.isConnected && document.activeElement !== kept) kept.focus();
  if (draft === undefined) return;
  const box = current(`[data-draft="${CSS.escape(draft)}"]`) as HTMLTextAreaElement | HTMLInputElement | undefined;
  box?.focus();
  box?.setSelectionRange(...caret);
}

/** What the last drawing showed, so the next one moves only what changed. */
let drawnState: { decided: Set<string>; view: string; state: string; counts: Map<string, string> } | null = null;

const viewKey = (view: View) => (view.kind === 'step' ? `step:${view.step.id}` : view.kind);

/** A rail row that left because its item was decided, kept in place while it slides out and collapses. */
type Ghost = { row: HTMLElement; after: string[]; until: number };
const ghosts = new Set<Ghost>();

const itemOfRow = (key: string) => {
  const address = key.slice('row:'.length);
  const item = CHECKLIST_ITEM.exec(address)?.[1];
  return item === undefined ? `step:${address}` : `checklist:${item}`;
};

function leaveRows(rows: { row: HTMLElement; key: string; height: number; paddingTop: string; paddingBottom: string }[], newly: string[]): void {
  rows.forEach(({ row, key, height, paddingTop, paddingBottom }, at) => {
    if (!newly.includes(itemOfRow(key)) || queue.querySelector(`:scope > [data-key="${CSS.escape(key)}"]`)) return;
    const motion = `leave:${key}`;
    row.classList.add('leaving');
    row.removeAttribute('aria-current');
    row.setAttribute('aria-hidden', 'true');
    row.inert = true;
    delete row.dataset['key'];
    row.dataset['motion'] = motion;
    const ghost = { row, after: rows.slice(at + 1).map(one => one.key), until: Infinity };
    ghosts.add(ghost);
    const fade = [{ opacity: 1 }, { opacity: 0 }];
    const lasts = reduced()
      ? [play(motion, 'row-fade', fade, { ms: 'base', curve: 'linear', fill: 'forwards' })]
      : [
          play(motion, 'row-slide', [{ transform: 'none' }, { transform: 'translateX(-16px)' }], { ms: 160, curve: 'ease-out', fill: 'forwards' }),
          play(motion, 'row-fade', fade, { ms: 160, curve: 'linear', fill: 'forwards' }),
          play(
            motion,
            'row-collapse',
            [
              { height: `${String(height)}px`, paddingTop, paddingBottom, marginBottom: '0px' },
              // The rail's 2px gap goes with the row.
              { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-2px' },
            ],
            { ms: 'slow', curve: 'ease-out', delay: 120, fill: 'both' },
          ),
        ];
    ghost.until = now() + Math.max(...lasts);
    setTimeout(() => {
      ghosts.delete(ghost);
      row.remove();
    }, Math.max(...lasts));
  });
}

function placeGhosts(): void {
  for (const ghost of ghosts) if (ghost.until <= now()) ghosts.delete(ghost);
  for (const { row, after } of ghosts) {
    const next = after.map(key => queue.querySelector(`:scope > [data-key="${CSS.escape(key)}"]`)).find(found => found !== null);
    const end = queue.querySelector(':scope > .queue-empty, :scope > .queue-foot');
    if (next) next.before(row);
    else if (end) end.before(row);
    else queue.append(row);
  }
}

/** The pane that was, shown over the new one while it leaves; the new one enters after it has gone. */
let leavingPane: HTMLElement | null = null;

/** `scrolled` is where the main pane, then the split step's prose and code panes, were scrolled. */
function swapPanes(old: Node[], split: boolean, scrolled: number[]): void {
  leavingPane?.remove();
  const shown = el('div', { className: split ? 'main split' : 'main' }, ...old);
  const pane = el('div', { className: 'pane-leaving' }, shown);
  pane.inert = true;
  pane.setAttribute('aria-hidden', 'true');
  pane.dataset['motion'] = 'pane-leave';
  main.scrollTo(0, 0);
  main.prepend(pane);
  [shown, ...shown.querySelectorAll(':scope > .step > .prose, :scope > .step > .code')].forEach((scroller, at) => {
    scroller.scrollTop = scrolled[at] ?? 0;
  });
  leavingPane = pane;
  const gone = play('pane-leave', 'pane-leave', [{ opacity: 1 }, { opacity: 0 }], { ms: 100, curve: 'linear', fill: 'forwards' });
  if (!reduced()) play('pane-leave', 'pane-out', [{ transform: 'none' }, { transform: 'translateX(-12px)' }], { ms: 100, curve: 'ease-in', fill: 'forwards' });
  const enter = [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }];
  play('pane-enter', 'pane-enter', reduced() ? FADE_IN : enter, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out', delay: 100 });
  setTimeout(() => {
    if (leavingPane !== pane) return;
    pane.remove();
    leavingPane = null;
  }, gone);
}

/** Decided steps fill their progress segment and every count that changed ticks. */
function moveDecided(newly: string[], counts: Map<string, string>, before = new Map<string, string>()): void {
  for (const key of newly.filter(one => one.startsWith('step:'))) {
    const fill = [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }];
    play(`fill:${key.slice('step:'.length)}`, 'fill', reduced() ? FADE_IN : fill, reduced() ? { ms: 'base', curve: 'linear' } : { ms: 'slow', curve: 'ease-out' });
  }
  const tick = [{ opacity: 0.55, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }];
  for (const [key, text] of counts)
    if (before.get(key) !== text)
      play(key, 'tick', reduced() ? [{ opacity: 0.55 }, { opacity: 1 }] : tick, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out' });
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** j and k walk the steps, and past the last one to the end of the walkthrough. */
function stepBy(delta: number): void {
  const view = currentView();
  if (view.kind !== 'step' && view.kind !== 'end') return;
  const to = neighbours(view)[delta > 0 ? 1 : 0];
  if (to) go(to);
}

document.addEventListener('keydown', event => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape' && picked) {
    const end = drawn.get(picked.step)?.rows.get(lineKey(picked.file, picked.lines[1]));
    unpick();
    end?.querySelector<HTMLElement>('.d2h-code-linenumber')?.focus();
    return;
  }
  if (isTyping(event.target)) return;
  if (event.key === 'j' || event.key === 'ArrowRight') stepBy(1);
  else if (event.key === 'k' || event.key === 'ArrowLeft') stepBy(-1);
});

phone.addEventListener('change', render);

window.addEventListener('hashchange', () => {
  moves++;
  taking = null;
  flung = null;
  render();
  main.scrollTo(0, 0);
  prosePane.scrollTop = 0;
  codePane.scrollTop = 0;
  const view = currentView();
  if (view.kind === 'checklist' && view.item !== undefined) document.getElementById(`checklist-item-${view.item}`)?.scrollIntoView({ block: 'nearest' });
});

({ walkthrough, session } = exported
  ? (JSON.parse(exported) as { walkthrough: WalkthroughView; session: SessionView })
  : await Promise.all(
      ['data/walkthrough.json', 'data/session.json'].map(async data => (await fetch(data)).json() as Promise<unknown>),
    ).then(([shownWalkthrough, shownSession]) => ({
      walkthrough: shownWalkthrough as WalkthroughView,
      session: shownSession as SessionView,
    })));
render();

const POLL_MS = 1500;
let polling = false;
const fetchText = async (data: string) => {
  const answer = await fetch(data);
  if (!answer.ok) throw new Error(`${data}: ${String(answer.status)}`);
  return answer.text();
};

// The session records and answers through the CLI, so the page asks for the walkthrough and the session again and again.
function poll(): void {
  if (polling || stopped) return;
  polling = true;
  const since = posted;
  Promise.all([fetchText('data/walkthrough.json'), fetchText('data/session.json')])
    .then(([walkthroughText, sessionText]) => {
      if (document.body.classList.contains('unreachable')) showAlert(null);
      if (since !== posted || (walkthroughText === lastWalkthrough && sessionText === lastSession)) return;
      walkthrough = JSON.parse(walkthroughText) as WalkthroughView;
      session = JSON.parse(sessionText) as SessionView;
      render();
    })
    .catch(() => {
      showUnreachable(PAGE);
    })
    .finally(() => {
      polling = false;
    });
}

const poller = readOnly ? undefined : setInterval(poll, POLL_MS);
