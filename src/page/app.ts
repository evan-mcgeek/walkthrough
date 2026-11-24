import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { ColorSchemeType, type DiffFile, LineType } from 'diff2html/lib-esm/types';
import { type Comment, commentsOf } from '../comments';
import type { Lines, NoteMark, Place } from '../notes';
import { parseDiff } from '../diff';
import { previewType } from '../preview';
import type { Decision, WalkthroughView } from '../decisions';
import type { Entry, PageRequest, SessionMessage, SessionState, SessionView } from '../session';
import { type Action, builtIn, type Item, itemKey, nameOf, type Shown, stepShown, targetName, TONE_SHOWN, toneOf } from '../items';
import { DEFAULT_VIEWER, type Panel, PANELS, type Viewer } from '../viewer';
import type { Checklist, ChecklistItem, Mark, Step } from '../walkthrough';
import { plural } from '../words';
import { el, kindView, type PageName, post as postTo, postQuietly, region, selectBox, showAlert, showUnreachable } from './dom';
import { appearanceDialog, loadViewer, showViewer } from './appearance';
import { icon, type IconName } from './icons';
import { renderMarkdown } from './markdown';
import { bind, helpSheet, isTyping, MEANS, runShortcut, withKey } from './shortcuts';
import { animate, FADE_IN, play, reduced, replay } from './motion';

/** The state an exported file carries, with when it was exported; it shows the walkthrough as it was, with nothing to send to. */
type Exported = { walkthrough: WalkthroughView; session: SessionView; at: string; viewer?: Viewer; images?: Record<string, { width: number; height: number }> };
const exportedText = document.getElementById('exported')?.textContent;
const exported = exportedText === undefined ? undefined : (JSON.parse(exportedText) as Exported);
const readOnly = exported !== undefined;

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
const leftEdge = region('left-edge');
const rightEdge = region('right-edge');

/** Which tool windows are open; an exported file keeps the person's, as it has no controls to change them. */
const panels = { ...DEFAULT_VIEWER.panels };

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
/** The session is still checking the step, so its actions wait. */
const beingChecked = (step: Step) => (walkthrough.checking ?? []).includes(step.id);
const HELD = 'Decide once the session has checked this step.';
/** The label of the item's action `id`, or the id when the session no longer offers it. */
const labelOf = (item: Item, id: string) => walkthrough.actions[itemKey(item)]?.find(action => action.id === id)?.label ?? id;
/** An element in a state's colour. */
const toned = <T extends HTMLElement>(element: T, state: string): T => {
  element.dataset['state'] = state;
  return element;
};
/** How a decision on the item shows: in its action's tone. */
const decidedShown = (item: Item, decision: Decision) => TONE_SHOWN[toneOf(walkthrough.actions[itemKey(item)], decision.action)];
/** How a step shows; the step the person is on shows where they are, whatever its state. */
const shownOf = (step: Step, current?: Step): Shown => (step === current ? 'cur' : stepShown(walkthrough, step, openFindings(step).length));

/** What the main pane shows; each is its own address, so the browser's back and forward move between them too. */
type View =
  | { kind: 'step'; step: Step }
  | { kind: 'session' }
  | { kind: 'checklist'; item?: string }
  | { kind: 'summary' }
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
  if (named === 'summary' && steps.length) return { kind: 'summary' };
  if (named === 'deck' && !readOnly) return { kind: 'deck' };
  const step = steps.find(one => one.id === named) ?? steps.find(one => !stepDecided(one));
  if (step) return { kind: 'step', step };
  return steps.length ? { kind: 'summary' } : { kind: 'preparing' };
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
  readShown();
  const before = moves;
  const from = currentStep()?.id;
  const answer = await post('decide', { item, action, ...fields, on: walkthrough.on[itemKey(item)] });
  if (!answer) {
    poll();
    return;
  }
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
    go(next ? next.id : 'summary');
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
// Under the main pane, so the toast sits over its foot whichever panels are open.
if (!readOnly) main.after(el('div', { className: 'toast-anchor' }, toastRegion));
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
    case 'verdict':
    case 'walkthrough':
      return `the ${item.type}`;
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
  const answer = await post('decide', { item: taken.item, clear: true, on: walkthrough.on[itemKey(taken.item)] });
  if (!answer) {
    poll();
    return;
  }
  ({ walkthrough, session } = (await answer.json()) as { walkthrough: WalkthroughView; session: SessionView });
  if (taken.item.type === 'step' && taken.landed === location.hash) go(taken.item.id);
  render();
  if (hadFocus) document.querySelector<HTMLElement>('.action-bar button, #main button')?.focus();
}

/** How long a step stays on screen before it counts as read, so a step passed on the way to another does not. */
const READ_MS = 800;
let reading: { step: string; timer: ReturnType<typeof setTimeout> } | null = null;

/** Marked by the page itself, not on the server's answer, whose redraw or alert change could undo a click made meanwhile. */
function readNow(id: string): void {
  if (walkthrough.read.includes(id)) return;
  const read = new Set([...walkthrough.read, id]);
  // In step order, as the server lists them, so the next poll finds nothing new to draw.
  walkthrough = { ...walkthrough, read: walkthrough.steps.filter(one => read.has(one.id)).map(one => one.id) };
  posted++;
  void postQuietly('read', { step: id, on: walkthrough.on[itemKey({ type: 'step', id })] });
}

function markRead(step: Step): void {
  if (readOnly || walkthrough.read.includes(step.id) || reading?.step === step.id) return;
  if (reading) clearTimeout(reading.timer);
  const timer = setTimeout(() => {
    reading = null;
    if (currentStep()?.id !== step.id) return;
    readNow(step.id);
    render();
  }, READ_MS);
  reading = { step: step.id, timer };
}

/** Deciding or asking on the step shown says it was read, however soon. */
function readShown(): void {
  if (!reading) return;
  clearTimeout(reading.timer);
  const { step } = reading;
  reading = null;
  if (currentStep()?.id === step) readNow(step);
}

async function send(route: 'ask' | 'reply' | 'comment', body: Record<string, unknown>, draft?: string): Promise<boolean> {
  readShown();
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

// A live region is announced when what it holds changes, not when it is put in the page, so this one stays and changes in place.
const status = el('span', { className: 'status' });
status.setAttribute('role', 'status');
status.setAttribute('aria-label', 'Session');
const headerEnd = el('div', { className: 'header-end' });

function statusView(): HTMLElement {
  const state = stopped ? 'gone' : session.state;
  const [label, about] = stopped ? ['Stopped', 'The walkthrough has stopped.'] : SESSION[state];
  if (status.dataset['state'] === state && status.textContent === label) return status;
  const mark = state === 'working' ? icon('spinner') : el('span', { className: 'dot' });
  if (state === 'needs-you') mark.dataset['motion'] = 'pulse';
  status.replaceChildren(mark, label);
  status.title = about;
  status.dataset['state'] = state;
  return status;
}

/** What a segment's colour means, said in its tooltip. */
function segmentWords(step: Step, shown: Shown): string {
  const item: Item = { type: 'step', id: step.id };
  const decision = decisionOf(item);
  const label = decision ? labelOf(item, decision.action) : '';
  const open = openFindings(step).length;
  const words: Record<Shown, string> = {
    cur: 'you are here',
    ok: `${label}, decided`,
    flag: `${label}, needs you`,
    neu: `${label}, decided`,
    reo: 'changed since you decided, needs you',
    find: `${open ? plural(open, 'open finding') : plural(step.kind === 'folded' ? step.problems.length : 0, 'problem')}, needs you`,
    un: 'not decided yet',
  };
  return words[shown];
}

/** The step the header counts from: the open step, or the deck's top card. */
const headerStep = () => (currentView().kind === 'deck' ? deckTop() : currentStep());

/** "Step 4 of 9 · 3 decided" beside the bar; the Summary and the pages of their own say only what is decided. */
function progressWords(): string {
  const { steps } = walkthrough;
  const decided = String(steps.filter(stepDecided).length);
  const step = headerStep();
  if (step) return `Step ${String(stepNumber(step.id))} of ${String(steps.length)} · ${decided} decided`;
  return currentView().kind === 'summary' ? `Summary · ${decided} decided` : `${decided} of ${String(steps.length)} decided`;
}

/** Kept across redraws, so the fills and the "you are here" marker move by transition from where they were. */
const bar = el('div', { className: 'progress' });
const marker = el('span', { className: 'progress-marker' });
const progressCount = el('span', { className: 'progress-count' });
progressCount.setAttribute('aria-hidden', 'true');
progressCount.dataset['motion'] = 'count:progress';

/** One segment per step in step order, coloured by its state, and the marker on where the person is; `waits` holds it while a fill reads. */
function progressView(waits: boolean): HTMLElement[] {
  const { steps } = walkthrough;
  const decided = steps.filter(stepDecided).length;
  const current = headerStep();
  const said = steps.length
    ? `${String(decided)} of ${plural(steps.length, 'step')} decided, ${String(steps.length - decided)} left, ${String(walkthrough.read.length)} read`
    : 'No steps yet';
  bar.title = said;
  const segments = [...bar.querySelectorAll<HTMLElement>(':scope > .segment')];
  while (segments.length > steps.length) segments.pop()?.remove();
  while (segments.length < steps.length) segments.push(bar.insertBefore(el('span', { className: 'segment' }), marker.parentNode ? marker : null));
  steps.forEach((step, at) => {
    const state = shownOf(step, current);
    const segment = segments[at];
    if (!segment) return;
    segment.title = `${String(at + 1)} ${step.title}: ${segmentWords(step, state)}`;
    segment.dataset['state'] = state;
    // What the segment shows under the marker: its own state, wherever the person is.
    segment.dataset['fill'] = shownOf(step);
  });
  const here = current ? steps.indexOf(current) : -1;
  if (steps.length) {
    marker.style.setProperty('--steps', String(steps.length));
    if (here >= 0) marker.style.setProperty('--at', String(here));
    marker.classList.toggle('away', here < 0);
    marker.classList.toggle('waits', waits);
    if (!marker.parentNode) bar.append(marker);
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Steps decided');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', String(steps.length));
    bar.setAttribute('aria-valuenow', String(decided));
    bar.setAttribute('aria-valuetext', said);
  }
  progressCount.textContent = steps.length ? progressWords() : '';
  return [bar, progressCount];
}

/** Each tool window's name in its title bar and menu item, and the key that shows and hides it. */
const PANEL: Record<Panel, { title: string; menu: string; key: string }> = {
  queue: { title: 'To review', menu: 'To review', key: '1' },
  checklist: { title: 'Checklist', menu: 'Checklist', key: '2' },
  explanation: { title: 'Explanation', menu: 'Explanation column', key: '3' },
};

/** The explanation column needs the width a phone does not have. */
const shows = (panel: Panel) => panels[panel] && (panel !== 'explanation' || !phone.matches);

/** The tool windows that slide to their edge, each with its box and that edge. */
const SLIDES: Partial<Record<Panel, { box: HTMLElement; edge: HTMLElement }>> = { queue: { box: queue, edge: leftEdge }, checklist: { box: side, edge: rightEdge } };
/** Tool windows hidden but still drawn while their contents fade and their width closes. */
const closing = new Set<Panel>();
const painted = (panel: Panel) => shows(panel) || closing.has(panel);

/** `refocus` moves the focus to the control that undoes this, as the one that did it may be gone. */
function togglePanel(panel: Panel, refocus = false): void {
  const slide = SLIDES[panel];
  const widthOf = (box: HTMLElement) => (box.hidden ? 0 : box.getBoundingClientRect().width);
  // Measured mid-motion too, so a window shown again on its way out turns back from where it is.
  const was = slide ? { box: widthOf(slide.box), edge: widthOf(slide.edge) } : { box: 0, edge: 0 };
  for (const running of slide ? [...slide.box.getAnimations(), ...slide.edge.getAnimations()] : []) running.cancel();
  slide?.box.classList.remove('sliding');
  panels[panel] = !panels[panel];
  closing.delete(panel);
  const sliding = slide && !phone.matches;
  if (sliding && !panels[panel] && was.box) closing.add(panel);
  // A window going to its edge takes the focus in it along, to the button that brings it back.
  const moveFocus = refocus || !!slide?.box.contains(document.activeElement);
  void postQuietly('viewer', { panels: { [panel]: panels[panel] } });
  render();
  if (sliding) slidePanel(panel, slide.box, slide.edge, was, moveFocus);
  if (moveFocus) document.querySelector<HTMLElement>(`[data-key="${panels[panel] ? 'hide' : 'show'}:${panel}"]`)?.focus();
}

const widthFrames = (from: number, to: number) =>
  [from, to].map(px => ({ width: `${String(px)}px`, minWidth: '0px', overflow: 'hidden', ...(px ? {} : { paddingLeft: '0px', paddingRight: '0px' }) }));

/** Plays `frames` on a tool window's width while what it holds keeps its open width, so nothing in it rewraps. */
function slideWidth(box: HTMLElement, from: number, to: number, timing: Parameters<typeof animate>[3]): Animation {
  const { paddingLeft, paddingRight } = getComputedStyle(box);
  const inner = Math.max(from, to) - Number.parseFloat(paddingLeft) - Number.parseFloat(paddingRight);
  box.style.setProperty('--open-width', `${String(inner)}px`);
  box.classList.add('sliding');
  const running = animate(box, 'panel-width', widthFrames(from, to), timing);
  running.finished.then(() => { box.classList.remove('sliding'); }, () => {});
  return running;
}

/** A tool window's contents fade, then its width closes while its edge opens; showing reverses with the width leading. */
function slidePanel(panel: Panel, box: HTMLElement, edge: HTMLElement, was: { box: number; edge: number }, moveFocus: boolean): void {
  const contents = `panel:${panel}`;
  if (closing.has(panel)) {
    const fade = play(contents, 'panel-fade', [{ opacity: 1 }, { opacity: 0 }], { ms: reduced() ? 'fast' : 100, curve: 'linear', fill: 'forwards' });
    const done = (running: Animation) => () => {
      if (!closing.delete(panel)) return;
      render();
      running.cancel();
      // With reduced motion the edge's button arrives only now.
      if (moveFocus && document.activeElement === document.body) document.querySelector<HTMLElement>(`[data-key="show:${panel}"]`)?.focus();
      if (reduced()) play(`edge:${panel}`, 'edge-in', FADE_IN, { ms: 'base', curve: 'linear' });
      replay();
    };
    if (reduced()) {
      // Contents fade, then the width snaps.
      const hold = animate(box, 'panel-hold', [{ opacity: 1 }, { opacity: 1 }], { ms: fade, curve: 'linear' });
      hold.finished.then(done(hold), () => {});
    } else {
      const closes = slideWidth(box, was.box, 0, { ms: 'base', curve: 'ease-out', delay: 60, fill: 'both' });
      closes.finished.then(done(closes), () => {});
      const edgeWidth = edge.getBoundingClientRect().width;
      if (was.edge < edgeWidth) animate(edge, 'edge-width', widthFrames(was.edge, edgeWidth), { ms: 'base', curve: 'ease-out', delay: 60, fill: 'backwards' });
      play(`edge:${panel}`, 'edge-in', FADE_IN, { ms: 'fast', curve: 'linear', delay: 200 });
    }
    replay();
    return;
  }
  if (box.hidden) return;
  play(contents, 'panel-fade', FADE_IN, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out', delay: 120 });
  // A window shown from its edge grows from the edge's width, so nothing beside it jumps.
  if (!reduced()) slideWidth(box, was.box + (edge.hidden ? was.edge : 0), box.getBoundingClientRect().width, { ms: 'slow', curve: 'ease-out', fill: 'backwards' });
  replay();
}

/** A tool window's title bar: its title and the button that hides it to its edge. */
function panelHead(panel: Panel, ...title: HTMLElement[]): HTMLElement {
  const name = `Hide ${PANEL[panel].title}`;
  const hide = el('button', { type: 'button', className: 'icon-button panel-hide', title: withKey(name, PANEL[panel].key) }, icon('minus'));
  hide.setAttribute('aria-label', name);
  hide.dataset['key'] = `hide:${panel}`;
  hide.onclick = () => {
    togglePanel(panel, true);
  };
  return el('div', { className: 'panel-head' }, ...title, hide);
}

/** The button a hidden window leaves on its edge. */
function showButton(panel: Panel, count: string | null): HTMLButtonElement {
  const button = el(
    'button',
    { type: 'button', className: 'edge-button', title: withKey(`Show ${PANEL[panel].title}`, PANEL[panel].key) },
    el('span', {}, PANEL[panel].title),
    ...(count === null ? [] : [el('span', { className: 'edge-count' }, count)]),
  );
  button.setAttribute('aria-expanded', 'false');
  button.dataset['key'] = `show:${panel}`;
  button.dataset['motion'] = `edge:${panel}`;
  button.onclick = () => {
    togglePanel(panel, true);
  };
  return button;
}

type MenuItem = (label: string, choose: () => void, role?: string) => HTMLButtonElement;

/** At phone width the More menu holds the panels as checkable items; the explanation column waits for a wider screen. */
function panelItems(item: MenuItem): HTMLButtonElement[] {
  return PANELS.map(panel => {
    const { menu, key } = PANEL[panel];
    const narrow = panel === 'explanation';
    const made = item(`${menu} (${key})`, () => {
      if (!narrow) togglePanel(panel);
    }, 'menuitemcheckbox');
    made.prepend(icon(`panel-${panel}`));
    made.setAttribute('aria-checked', String(shows(panel)));
    if (narrow) {
      made.setAttribute('aria-disabled', 'true');
      made.append(el('span', { className: 'menu-note' }, 'Wider screens'));
    }
    return made;
  });
}

const HELP = 'Help: what things mean';
const END = 'End session';

/** The data-key of the button whose menu is open, kept across redraws. */
let menuOpen: string | null = null;

function closeMenu(refocus = false): void {
  const key = menuOpen;
  menuOpen = null;
  render();
  if (refocus && key !== null) document.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`)?.focus();
}

/** Opens the menu of the button keyed `key`, settling from that button as a popover does; it closes at once. */
function openMenu(key: string): void {
  menuOpen = key;
  render();
  play('menu', 'popover-in', FADE_IN, { ms: 'fast', curve: 'linear' });
  if (!reduced()) play('menu', 'popover-settle', [{ transform: 'translateY(-4px) scale(0.98)' }, { transform: 'none' }], { ms: 'base', curve: 'ease-out' });
  replay();
}

document.addEventListener('click', event => {
  if (menuOpen !== null && !(event.target instanceof Element && event.target.closest('.menu, .more-menu'))) closeMenu();
});

const moreButton = () => document.querySelector('[data-key="more"]');

/** The header's More menu: Appearance and Help, and at phone width what the header has no room for. */
function moreMenu(): HTMLElement {
  const button = el('button', { type: 'button', className: 'icon-button', onclick: () => {
    if (menuOpen === 'more') closeMenu();
    else openMenu('more');
    document.querySelector<HTMLElement>('.menu [role^=menuitem]')?.focus();
  } }, icon('more'));
  button.setAttribute('aria-label', 'More');
  button.setAttribute('aria-haspopup', 'menu');
  button.setAttribute('aria-expanded', String(menuOpen === 'more'));
  button.dataset['key'] = 'more';
  const box = el('div', { className: 'more-menu' }, button);
  if (menuOpen !== 'more') return box;
  const item: MenuItem = (label, choose, role = 'menuitem') => {
    const made = el('button', { type: 'button', tabIndex: -1, onclick: () => { closeMenu(); choose(); } }, label);
    made.setAttribute('role', role);
    made.dataset['key'] = `menu:${label}`;
    return made;
  };
  const swipe =
    phone.matches && !stopped && walkthrough.steps.length && currentView().kind !== 'deck' ? [item('Swipe to decide', () => { go('deck'); })] : [];
  const toggles = phone.matches ? panelItems(item) : [];
  const after = [
    item('Appearance', () => { appearanceDialog(moreButton); }),
    item(HELP, () => { helpSheet(moreButton); }),
    ...(phone.matches && !stopped ? [item(END, () => void stop())] : []),
  ];
  const items = [...swipe, ...toggles, ...after];
  const separator = el('div', { className: 'menu-separator' });
  separator.setAttribute('role', 'separator');
  const menu = el('div', { className: 'menu' }, ...swipe, ...toggles, ...(toggles.length ? [separator] : []), ...after);
  menu.setAttribute('role', 'menu');
  menu.dataset['motion'] = 'menu';
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

/** Puts `children` in `parent` in order, leaving in place those already there, so what they are playing goes on. */
function place(parent: HTMLElement, children: Node[]): void {
  for (const child of [...parent.childNodes]) if (!children.includes(child)) child.remove();
  children.forEach((child, at) => {
    if (parent.childNodes[at] !== child) parent.insertBefore(child, parent.childNodes[at] ?? null);
  });
}

/** The header's verdict slot, kept across redraws so its label can be docked into it. */
const verdictText = el('span', { className: 'verdict-text' });
const verdictSlot = el('span', { className: 'verdict-status', title: 'Your verdict' }, icon('finish'), verdictText);

function headerVerdict(): HTMLElement[] {
  const label = verdictLabel();
  const chosen = decisionOf(VERDICT);
  if (label === null || !chosen) return [];
  if (verdictText.textContent !== label) verdictText.textContent = label;
  verdictSlot.dataset['state'] = decidedShown(VERDICT, chosen);
  return [verdictSlot];
}

/** Where the header's verdict was before a redraw, to fade the old label out from. */
type VerdictWas = { label: string; width: number };

/** A fixed copy of the label laid over the page while it travels, so no redraw cuts it. */
function verdictChip(label: string): HTMLElement {
  for (const old of document.querySelectorAll('.verdict-chip')) old.remove();
  const chip = el('span', { className: 'verdict-chip' }, label);
  chip.setAttribute('aria-hidden', 'true');
  document.body.append(chip);
  return chip;
}

/** Where a node's text is drawn, which an element's box pads by its line height. */
function textRect(node: Node): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(node);
  return range.getBoundingClientRect();
}

const removeWhenDone = (running: Animation, element: Element) => {
  running.finished.then(() => { element.remove(); }, () => {});
};

/** The one authored moment: the chosen verdict lifts off its option as a chip and docks into the header's slot. */
function dockVerdict(was: VerdictWas | null): void {
  const slot = verdictSlot.getBoundingClientRect();
  // At phone width the header has no slot.
  if (!slot.width) return;
  for (const running of [...verdictSlot.getAnimations(), ...verdictText.getAnimations()]) running.cancel();
  const to = textRect(verdictText);
  if (was) {
    // Inside the slot, so it moves as the slot's width eases to the new label.
    for (const older of verdictSlot.querySelectorAll('.verdict-old')) older.remove();
    const old = el('span', { className: 'verdict-old' }, was.label);
    old.setAttribute('aria-hidden', 'true');
    old.style.setProperty('left', `${String(verdictText.offsetLeft)}px`);
    old.style.setProperty('top', `${String(verdictText.offsetTop)}px`);
    verdictSlot.append(old);
    removeWhenDone(animate(old, 'verdict-old', [{ opacity: 1 }, { opacity: 0 }], { ms: reduced() ? 100 : 'base', curve: 'linear', fill: 'forwards' }), old);
  }
  if (reduced()) {
    if (was) animate(verdictText, 'verdict-in', FADE_IN, { ms: 100, curve: 'linear', delay: 100 });
    else animate(verdictSlot, 'verdict-in', FADE_IN, { ms: 'base', curve: 'linear' });
    return;
  }
  const opens = [{ width: `${String(was?.width ?? 0)}px`, overflow: 'hidden' }, { width: `${String(slot.width)}px`, overflow: 'hidden' }];
  animate(verdictSlot, 'verdict-width', opens, { ms: 'slow', curve: 'ease-out' });
  // The label arrives as the chip fades, so it never drops out.
  animate(was ? verdictText : verdictSlot, 'verdict-land', [{ opacity: 0 }, { opacity: 0, offset: 0.62 }, { opacity: 1 }], { ms: 440, curve: 'linear' });
  const label = main.querySelector('.verdict-option[aria-checked="true"]')?.lastChild;
  if (!label) return;
  const from = textRect(label);
  const chip = verdictChip(verdictText.textContent);
  // The chip's own text sits exactly on the option's.
  const own = textRect(chip);
  chip.style.setProperty('left', `${String(from.left - own.left)}px`);
  chip.style.setProperty('top', `${String(from.top + from.height / 2 - (own.top + own.height / 2))}px`);
  const dx = to.left - from.left;
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  const scale = Math.max(to.height / from.height, 0.9);
  animate(chip, 'verdict-chip', [{ transform: 'none' }, { transform: `translate(${String(dx)}px, ${String(dy)}px) scale(${String(scale)})` }], {
    ms: 440,
    curve: 'ease-out',
    fill: 'forwards',
  });
  const fade = [{ opacity: 1 }, { opacity: 1, offset: 0.62 }, { opacity: 0, borderColor: 'transparent', backgroundColor: 'transparent' }];
  removeWhenDone(animate(chip, 'verdict-chip-fade', fade, { ms: 440, curve: 'linear', fill: 'forwards' }), chip);
}

/** The header's way to the Summary, where the verdict is chosen. */
const finishReview = () =>
  walkthrough.steps.length
    ? [keyed(el('a', { href: '#summary', className: 'btn small ghost finish-review', title: 'Finish review: go to the Summary (G S)' }, 'Finish review'), 'finish-review')]
    : [];

function drawHeader(waits: boolean): void {
  const range = `against ${targetName(walkthrough.target)}, ${walkthrough.base.slice(0, 7)}..${walkthrough.head.slice(0, 7)}`;
  const prefix = el('span', { className: 'status-prefix' }, 'Session');
  prefix.setAttribute('aria-hidden', 'true');
  place(headerEnd, [
    ...headerVerdict(),
    ...finishReview(),
    prefix,
    statusView(),
    ...(stopped ? [] : [el('button', { type: 'button', className: 'btn small stop', onclick: () => void stop() }, END)]),
    moreMenu(),
  ]);
  place(header, [
    el('span', { className: 'logo' }, icon('mark'), 'Walkthrough'),
    ...kindView(walkthrough.kindLabel),
    el('h1', { className: 'session-label', title: range }, nameOf(walkthrough)),
    ...progressView(waits),
    headerEnd,
  ]);
}

function draftArea(draft: string, label: string, start = '', rows = 2): HTMLTextAreaElement {
  const box = el('textarea', { rows, value: drafts.get(draft) ?? start, placeholder: label });
  box.dataset['draft'] = draft;
  box.setAttribute('aria-label', label);
  box.oninput = () => drafts.set(draft, box.value);
  return box;
}

/** A control a redraw rebuilds, found again by `key` so it keeps the keyboard's focus. */
function keyed<T extends HTMLElement>(control: T, key: string): T {
  control.dataset['key'] = key;
  return control;
}

/** Blank words are never sent: a box of only spaces is emptied, so the browser says it needs words. */
function filledIn(form: HTMLFormElement): boolean {
  for (const box of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]'))
    if (!box.value.trim()) {
      box.value = '';
      drafts.delete(box.dataset['draft'] ?? '');
    }
  return form.reportValidity();
}

/** A one-line box that sends on Enter, as the board's Ask and Reply boxes do. */
function lineBox(draft: string, label: string, placeholder: string, onSend: () => void): HTMLFormElement {
  const box = el('input', { type: 'text', value: drafts.get(draft) ?? '', placeholder, required: true });
  box.dataset['draft'] = draft;
  box.setAttribute('aria-label', label);
  box.oninput = () => drafts.set(draft, box.value);
  const form = el('form', { className: 'line-box' }, box);
  form.onsubmit = event => {
    event.preventDefault();
    if (filledIn(form)) onSend();
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

const turn = (entry: Entry) =>
  el('div', { className: 'turn' }, el('span', { className: 'who' }, entry.from === 'session' ? 'Session' : 'You'), said(entry));

/** Replies hang behind a rule under what they answer. */
const replies = (entries: Entry[]) => (entries.length ? [el('div', { className: 'replies' }, ...entries.map(turn))] : []);

/** An ask and its answers: a note that answers it carries the question; anything else answers under the question itself. */
function askThread(asked: Ask): HTMLElement {
  const answers = followUps(asked);
  const notes = answers.filter(isNote);
  const inNotes = new Set(notes.flatMap(note => followUps(note).map(entry => entry.id)));
  const rest = answers.filter(entry => !isNote(entry) && !inNotes.has(entry.id));
  const own =
    notes.length && !rest.length
      ? []
      : [
          el(
            'div',
            { className: 'note asked' },
            el('div', { className: 'note-head' }, el('span', { className: 'label' }, 'You asked'), ...linesOf(asked.lines)),
            said(asked),
            ...(answers.length ? replies(rest) : [el('p', { className: 'muted' }, 'Waiting for the session to answer.')]),
          ),
        ];
  return el('div', { className: 'ask-thread' }, ...own, ...notes.map(note => noteView(note, asked)));
}

const linesLabel = ([first, last]: Lines) =>
  first === last ? `Line ${String(first)}` : `Lines ${String(first)}–${String(last)}`;
const linesOf = (lines: Lines | undefined) => (lines ? [el('span', { className: 'lines' }, linesLabel(lines).toLowerCase())] : []);

/** How an action shows: the built-in Approve leads, Flag follows, and what the session offers on a step is marked as offered. */
type Look = 'primary' | 'secondary' | 'offer';

function actionButton(item: Item, action: Action, look: Look, small: boolean): HTMLButtonElement {
  const key = itemKey(item);
  const classes = ['btn', ...(look === 'secondary' ? [] : [look]), ...(small ? ['small'] : [])];
  const button = el('button', { type: 'button', className: classes.join(' ') }, ...(look === 'offer' ? [icon('message')] : []), action.label);
  button.setAttribute('aria-pressed', String(decisionOf(item)?.action === action.id));
  button.dataset['key'] = `action:${key}:${action.id}`;
  const shortcut = item.type === 'step' && STEP_KEYS[action.id];
  if (shortcut) button.title = withKey(shortcut.tip(action.label), shortcut.key);
  button.onclick = () => {
    take(item, action);
  };
  return button;
}

/** The step actions a key takes, and the tooltip that names it. */
const STEP_KEYS: Record<string, { key: string; tip: (label: string) => string }> = {
  approve: { key: 'A', tip: label => `${label} and go to the next step` },
  flag: { key: 'F', tip: label => label },
};

/** An action that asks for words opens its form; any other decides at once. */
function take(item: Item, action: Action): void {
  if (action.note || action.edit) {
    taking = { key: itemKey(item), action: action.id };
    render();
    document.querySelector<HTMLTextAreaElement>('.taking textarea')?.focus();
  } else void decide(item, action.id);
}

/** A decided item's actions close to one Change, which opens them again; its state tag already says what was done. */
function changeButton(item: Item, small: boolean): HTMLElement {
  const key = itemKey(item);
  const change = keyed(el('button', { type: 'button', className: small ? 'btn small' : 'btn' }, 'Change'), `change:${key}`);
  change.onclick = () => {
    changing.add(key);
    render();
  };
  const group = el('div', { className: 'choices' }, change);
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Decide');
  return group;
}

function actionGroup(item: Item, look: (action: Action, at: number) => Look, small = false, closes = true): HTMLElement {
  if (closes && decisionOf(item) && !changing.has(itemKey(item))) return changeButton(item, small);
  const actions = walkthrough.actions[itemKey(item)] ?? [];
  const group = el('div', { className: 'choices' }, ...actions.map((action, at) => actionButton(item, action, look(action, at), small)));
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Decide');
  return group;
}

const firstLeads = (_: Action, at: number): Look => (at === 0 ? 'primary' : 'secondary');
const stepLook = ({ id }: Action): Look => (id === 'approve' ? 'primary' : id === 'flag' ? 'secondary' : 'offer');

const CHANGED = 'Changed since you decided';

function stateTag(item: Item, long: boolean): HTMLElement {
  const key = itemKey(item);
  const decision = walkthrough.decided[key] ?? null;
  const reopened = walkthrough.reopened[key];
  if (decision) return toned(el('span', { className: 'tag decided' }, `Decided: ${labelOf(item, decision.action)}`), decidedShown(item, decision));
  if (reopened)
    return el('span', { className: 'tag reopened' }, long ? `Changed since you chose ${labelOf(item, reopened.action)}` : CHANGED);
  return el('span', { className: 'tag' }, 'Undecided');
}

/** The state, actions and what was said about the decision of a note, checklist item or the whole walkthrough. */
function decideView(item: Item, text = '', small = true, look: (action: Action, at: number) => Look = firstLeads): HTMLElement[] {
  const key = itemKey(item);
  const actions = walkthrough.actions[key] ?? [];
  if (!actions.length) return [];
  const shown = walkthrough.decided[key] ?? walkthrough.reopened[key];
  const taken = taking?.key === key ? actions.find(action => action.id === taking?.action) : undefined;
  return [
    el(
      'div',
      { className: 'decide' },
      el(
        'div',
        { className: 'decide-row' },
        ...(shown || readOnly ? [stateTag(item, true)] : []),
        ...(readOnly ? [] : [actionGroup(item, look, small)]),
      ),
      // A reopened item keeps what the person and the session said about the decision it had.
      ...(shown ? decisionSaid(shown) : []),
      ...(taken ? [takingForm(item, taken, text)] : []),
    ),
  ];
}

/** The person's own words on a decision; the session's answers to it only mark it handled, unless `receipts` shows them. */
function decisionSaid(decision: Decision, receipts = false): HTMLElement[] {
  return [
    ...(decision.note ? [el('p', { className: 'said person' }, decision.note)] : []),
    ...(decision.text ? [markdown(decision.text, 'said person')] : []),
    ...(receipts ? followUps(decision).map(said) : []),
  ];
}

function takingForm(item: Item, action: Action, text: string): HTMLFormElement {
  const draft = (field: string) => `decide:${itemKey(item)}:${action.id}:${field}`;
  const boxes = [
    ...(action.edit ? [draftArea(draft('text'), 'Text', text, 3)] : []),
    ...(action.note ? [draftArea(draft('note'), 'Note', '', 3)] : []),
  ];
  // Edited text cannot be empty; the note is the person's to leave out.
  for (const box of boxes) box.required = box.dataset['draft'] === draft('text');
  const form = el(
    'form',
    { className: 'taking' },
    el('p', { className: 'taking-head' }, action.label),
    ...boxes,
    el(
      'div',
      { className: 'taking-row' },
      el('span', { className: 'hint' }, 'Goes to the session with your decision.'),
      keyed(el('button', { type: 'button', className: 'btn ghost', onclick: () => { taking = null; flung = null; render(); } }, 'Cancel'), draft('cancel')),
      keyed(el('button', { type: 'submit', className: 'btn primary' }, 'Send'), draft('send')),
    ),
  );
  form.onsubmit = event => {
    event.preventDefault();
    if (!filledIn(form)) return;
    void decide(item, action.id, {
      ...(action.note && { note: drafts.get(draft('note')) ?? '' }),
      ...(action.edit && { text: drafts.get(draft('text')) ?? text }),
    });
  };
  return form;
}

/** Where a detached note, ask or comment was. */
function placeWas({ file, lines }: Place): string {
  return file !== undefined && lines ? `${file} ${linesLabel(lines).toLowerCase()}` : 'a step no longer in the change';
}

/** The lines a detached note, ask or comment was pinned on, as they read then, without their shared indent. */
function oldLines({ linesText }: Place): HTMLElement[] {
  if (!linesText?.length) return [];
  const indent = Math.min(...linesText.filter(line => line.trim()).map(line => line.length - line.trimStart().length));
  return [el('pre', { className: 'old-lines' }, linesText.map(line => line.slice(indent)).join('\n'))];
}

/** Notes whose Reply box the person opened. */
const replying = new Set<string>();

/** The note's foot: its actions as buttons, then Reply, or the Reply box under them once opened. */
function replyView(note: Note, actions: HTMLElement[]): HTMLElement[] {
  const foot = (...end: HTMLElement[]) => (actions.length || end.length ? [el('div', { className: 'note-foot' }, ...actions, ...end)] : []);
  if (readOnly) return foot();
  const draft = `reply:${note.id}`;
  if (!replying.has(note.id) && !drafts.get(draft)) {
    const open = el('button', { type: 'button', className: 'link' }, 'Reply');
    open.dataset['key'] = `reply:${note.id}`;
    open.onclick = () => {
      replying.add(note.id);
      render();
      document.querySelector<HTMLInputElement>(`[data-draft="${CSS.escape(draft)}"]`)?.focus();
    };
    return foot(open);
  }
  const form = lineBox(draft, 'Reply', 'Reply…', () => {
    void send('reply', { to: note.id, text: drafts.get(draft) ?? '' }, draft).then(sent => {
      if (!sent) return;
      replying.delete(note.id);
      render();
    });
  });
  form.className = 'reply';
  form.append(keyed(el('button', { type: 'submit', className: 'btn small' }, 'Send'), `send:${draft}`));
  form.onkeydown = event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    replying.delete(note.id);
    drafts.delete(draft);
    render();
    document.querySelector<HTMLElement>(`[data-key="${CSS.escape(`reply:${note.id}`)}"]`)?.focus();
  };
  return [...foot(), form];
}

/** "new since you approved" on a finding that arrived after the person decided its step. */
function lateWords(note: Note): string | null {
  const step = walkthrough.steps.find(one => one.id === anchorOf(note));
  return !readOnly && step && lateFindings(step).includes(note) ? `new since you ${doneWith(step)}` : null;
}

/** `asked` is the ask the note answers: it shows the question, with the note as the session's reply. */
function noteView(note: Note, asked?: Ask): HTMLElement {
  const { label, lines } = note.note;
  const item: Item = { type: 'note', id: note.id };
  const key = itemKey(item);
  const detached = anchorOf(note) === null;
  const since = lateWords(note);
  const late = since && (lines ? `${linesLabel(lines).toLowerCase()} · ${since}` : since);
  const shown = walkthrough.decided[key] ?? walkthrough.reopened[key];
  const taken = taking?.key === key ? walkthrough.actions[key]?.find(action => action.id === taking?.action) : undefined;
  const view = el(
    'article',
    { className: 'note' },
    el(
      'div',
      { className: 'note-head' },
      ...(detached ? [icon(note.note.finding ? 'warn' : 'message')] : []),
      el('span', { className: note.note.finding ? 'label finding' : 'label' }, ...(note.note.finding && !detached ? [icon('warn')] : []), label),
      ...(detached ? [el('span', { className: 'was' }, `was on ${placeWas(placeOf(note))}`)] : late ? [el('span', { className: 'lines' }, late)] : linesOf(lines)),
      ...(shown ? [stateTag(item, false)] : []),
    ),
    ...(detached ? oldLines(placeOf(note)) : []),
    ...(asked
      ? [el('p', { className: 'you-asked' }, el('span', { className: 'muted' }, 'You asked:'), ` ${asked.text}`), ...replies([note, ...followUps(note)])]
      : [...(taken?.edit ? [] : [markdown(note.text, 'note-text')]), ...replies(followUps(note))]),
    // A reopened note keeps what the person and the session said about the decision it had.
    ...(shown ? decisionSaid(shown) : []),
    ...(taken ? [takingForm(item, taken, note.text)] : []),
    ...(taken ? [] : replyView(note, readOnly || !walkthrough.actions[key]?.length ? [] : [actionGroup(item, () => 'secondary', true)])),
  );
  view.setAttribute('aria-label', label);
  view.id = `note-${note.id}`;
  view.dataset['motion'] = `note:${note.id}`;
  return view;
}

function notesView(notes: Note[], place: string): HTMLElement[] {
  const views = notes.filter(note => !note.note.low).map(note => noteView(note));
  const low = notes.filter(note => note.note.low);
  if (!low.length) return views;
  const labels = [...new Set(low.map(note => note.note.label))].join(', ');
  const more = el(
    'details',
    { className: 'more', open: opened.has(place) },
    el('summary', {}, el('span', { className: 'more-link' }, plural(low.length, 'more note')), el('span', { className: 'muted' }, ` · ${labels}`)),
  );
  more.append(...low.map(note => noteView(note)));
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

/**
 * `ended` once the last line is picked too; from the keyboard the first line is picked on its own first.
 * A picked range first offers Ask and Comment (`choose`), then shows the box for the one taken.
 */
let picked: { step: string; file: string; from: number; lines: Lines; ended: boolean; mode: 'choose' | 'ask' | 'comment' } | null = null;

function lineAt(event: Event): { cell: HTMLElement; file: string; line: number } | null {
  const target = event.target instanceof Element ? event.target : null;
  const cell = target?.closest<HTMLElement>('.d2h-code-linenumber');
  const row = cell?.closest<HTMLTableRowElement>('tr[data-line]');
  const file = row?.dataset['file'];
  return readOnly || !cell || !row || file === undefined ? null : { cell, file, line: Number(row.dataset['line']) };
}

function pick(step: Step, file: string, line: number, extend: boolean, ended: boolean): void {
  const from = extend && picked?.step === step.id && picked.file === file ? picked.from : line;
  picked = { step: step.id, file, from, lines: [Math.min(from, line), Math.max(from, line)], ended, mode: 'choose' };
  render();
  if (ended) document.querySelector<HTMLElement>('.picked-choose .btn')?.focus();
}

const focusDraft = (draft: string) => document.querySelector<HTMLElement>(`[data-draft="${CSS.escape(draft)}"]`)?.focus();
const newCommentDraft = ({ step, file, lines }: { step: string; file: string; lines: Lines }) => `comment:${step}:${file}:${lines.join('-')}`;

function choosePicked(mode: 'ask' | 'comment'): void {
  if (!picked?.ended) return;
  picked = { ...picked, mode };
  render();
  if (mode === 'ask') document.querySelector<HTMLInputElement>('.picked-ask input')?.focus();
  else focusDraft(newCommentDraft(picked));
}

function startComment(step: Step, file: string, line: number): void {
  picked = { step: step.id, file, from: line, lines: [line, line], ended: true, mode: 'comment' };
  render();
  focusDraft(newCommentDraft(picked));
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
  pick(step, at.file, at.line, started, event.shiftKey || started);
}

function unpick(): void {
  picked = null;
  render();
}

/** Lets the picked lines go and puts the keyboard back on the last of them. */
function cancelPick(): void {
  if (!picked) return;
  const end = drawn.get(picked.step)?.rows.get(lineKey(picked.file, picked.lines[1]));
  unpick();
  end?.querySelector<HTMLElement>('.d2h-code-linenumber')?.focus();
}

function pickedChoice(step: Step, lines: Lines): HTMLElement {
  const ask = keyed(el('button', { type: 'button', className: 'btn small' }, icon('ask'), 'Ask about lines'), `pick-ask:${step.id}`);
  ask.onclick = () => {
    choosePicked('ask');
  };
  const comment = keyed(el('button', { type: 'button', className: 'btn small' }, icon('own'), 'Comment'), `pick-comment:${step.id}`);
  comment.onclick = () => {
    choosePicked('comment');
  };
  comment.title = 'Comment on these lines (C)';
  return el('div', { className: 'picked-choose' }, el('span', { className: 'picked-lines' }, linesLabel(lines)), el('span', { className: 'spacer' }), ask, comment);
}

const commentHint = () => (walkthrough.commentHint ? [el('span', { className: 'hint' }, walkthrough.commentHint)] : []);

/** The box the person writes a comment in, new or edited; Escape or Cancel leaves it. */
function commentBox(draft: string, start: string, where: HTMLElement[], onSave: (text: string) => void, onCancel: () => void): HTMLFormElement {
  const box = draftArea(draft, 'Your comment', start, 3);
  box.required = true;
  const cancel = () => {
    drafts.delete(draft);
    onCancel();
  };
  const form = el(
    'form',
    { className: 'mine composing' },
    el('div', { className: 'note-head' }, el('span', { className: 'mine-who' }, icon('own'), 'Your comment'), ...where),
    box,
    el(
      'div',
      { className: 'mine-row' },
      ...commentHint(),
      el('span', { className: 'spacer' }),
      keyed(el('button', { type: 'button', className: 'btn ghost small', onclick: cancel }, 'Cancel'), `cancel:${draft}`),
      keyed(el('button', { type: 'submit', className: 'btn primary small' }, 'Save comment'), `save:${draft}`),
    ),
  );
  form.onsubmit = event => {
    event.preventDefault();
    if (filledIn(form)) onSave(drafts.get(draft) ?? start);
  };
  form.onkeydown = event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    cancel();
  };
  return form;
}

function newComment(step: Step, file: string, lines: Lines): HTMLFormElement {
  const draft = newCommentDraft({ step: step.id, file, lines });
  return commentBox(draft, '', linesOf(lines), text => {
    void send('comment', { step: step.id, file, lines, text }, draft).then(sent => {
      if (sent) unpick();
    });
  }, cancelPick);
}

/** The step a comment shows on, null when its lines are gone. */
const commentAnchor = (comment: Comment) => {
  const at = walkthrough.anchored[comment.id];
  return at === undefined ? comment.step : at;
};

/** Saved comments the person opened to edit. */
const editingComments = new Set<string>();

function commentView(comment: Comment): HTMLElement {
  const { id, lines } = comment;
  const posted = walkthrough.posted.includes(id);
  const where = commentAnchor(comment) === null ? [el('span', { className: 'was' }, `was on ${placeWas(comment)}`)] : linesOf(lines);
  const view = el('article', { className: 'mine', id: `comment-${id}` });
  view.setAttribute('aria-label', 'Your comment');
  view.dataset['motion'] = `comment:${id}`;
  if (editingComments.has(id) && !posted && !readOnly) {
    const draft = `edit-comment:${id}`;
    const done = () => {
      editingComments.delete(id);
      render();
      document.querySelector<HTMLElement>(`[data-key="${CSS.escape(`edit:${id}`)}"]`)?.focus();
    };
    view.append(commentBox(draft, comment.text, where, text => {
      void send('comment', { comment: id, text }, draft).then(sent => {
        if (sent) done();
      });
    }, done));
    return view;
  }
  const edit = keyed(el('button', { type: 'button', className: 'icon-button' }, icon('edit')), `edit:${id}`);
  edit.setAttribute('aria-label', 'Edit comment');
  edit.title = 'Edit comment';
  edit.onclick = () => {
    editingComments.add(id);
    render();
    focusDraft(`edit-comment:${id}`);
  };
  const remove = keyed(el('button', { type: 'button', className: 'icon-button' }, icon('trash')), `delete:${id}`);
  remove.setAttribute('aria-label', 'Delete comment');
  remove.title = 'Delete comment';
  remove.onclick = () => {
    void send('comment', { comment: id, delete: true });
  };
  view.append(
    el(
      'div',
      { className: 'note-head' },
      el('span', { className: 'mine-who' }, icon('own'), 'Your comment'),
      ...where,
      el('span', { className: 'spacer' }),
      ...(posted || readOnly ? [] : [edit, remove]),
    ),
    ...(commentAnchor(comment) === null ? oldLines(comment) : []),
    markdown(comment.text, 'comment-text'),
    // The session's answer to a comment only marks it handled, so nothing arrives under it.
    ...(posted ? [el('span', { className: 'hint' }, 'Posted')] : commentHint()),
  );
  return view;
}

function pickedAsk(step: Step, file: string, lines: Lines): HTMLElement {
  const draft = `ask:${step.id}:${file}:${lines.join('-')}`;
  const label = `Ask about ${file} ${linesLabel(lines).toLowerCase()}`;
  const form = lineBox(draft, label, '', () => {
    void send('ask', { step: step.id, file, lines, text: drafts.get(draft) ?? '' }, draft).then(sent => {
      if (sent) unpick();
    });
  });
  const box = form.querySelector('input');
  if (box) box.id = `picked-${step.id}`;
  form.className = 'picked-ask';
  form.prepend(el('label', { htmlFor: `picked-${step.id}` }, label));
  form.append(
    keyed(el('button', { type: 'button', className: 'btn ghost small', onclick: unpick }, 'Cancel'), `cancel:${draft}`),
    keyed(el('button', { type: 'submit', className: 'btn primary small' }, 'Ask'), `send:${draft}`),
  );
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
  const files = parseDiff(step.diff);
  new Diff2HtmlUI(view, files, {
    outputFormat: 'line-by-line',
    drawFileList: false,
    matching: 'lines',
    // The page's own tokens recolour it, in both themes.
    colorScheme: ColorSchemeType.LIGHT,
    fileContentToggle: false,
  }).draw();
  const rows = new Map<string, HTMLTableRowElement>();
  // diff2html draws one wrapper per file, in the order it parses them.
  view.querySelectorAll('.d2h-file-wrapper').forEach((wrapper, at) => {
    const parsed = files[at];
    const file = parsed?.newName ?? '';
    (wrapper as HTMLElement).dataset['file'] = parsed?.isDeleted ? parsed.oldName : file;
    const fileDiff = wrapper.querySelector('.d2h-file-diff');
    if (parsed && fileDiff) {
      wrapper.querySelector('.d2h-file-name-wrapper')?.after(fileStats(parsed));
      (wrapper as HTMLElement).dataset['changed'] = String(parsed.addedLines + parsed.deletedLines);
      const body = el('div', { className: 'diff-body' });
      fileDiff.replaceWith(body);
      body.append(fileDiff, overviewStripe(fileDiff));
      addPreview(wrapper, step.id, parsed);
      if (!readOnly) fileControls(wrapper as HTMLElement, step);
    }
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
    const at = lineAt(event);
    if (at && event.target instanceof Element && event.target.closest('.add-comment')) startComment(step, at.file, at.line);
    else pickLine(step, event);
  };
  if (!readOnly) {
    // One "+" for the whole diff, moved to the line number under the pointer or the keyboard.
    const plus = el('button', { type: 'button', className: 'add-comment', tabIndex: -1 }, icon('plus'));
    const place = (event: Event) => {
      const at = lineAt(event);
      if (!at || plus.parentElement === at.cell) return;
      const name = `Comment on line ${String(at.line)}`;
      plus.setAttribute('aria-label', name);
      plus.title = `${name} (C)`;
      at.cell.append(plus);
    };
    view.addEventListener('pointerover', place);
    view.addEventListener('focusin', place);
    const cells = [...view.querySelectorAll<HTMLElement>('tr[data-line] .d2h-code-linenumber')];
    // One line number is in the tab order, and the arrows move from it, so the diff is one stop.
    cells.forEach((cell, at) => {
      cell.tabIndex = at === 0 ? 0 : -1;
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-pressed', 'false');
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

const SVG = 'http://www.w3.org/2000/svg';

/** A mark on the overview stripe from row `from` of `total`, `size` rows long; a note's tick keeps 3px however long the file. */
function stripeMark(className: string, from: number, size: number | null, total: number): SVGRectElement {
  const mark = document.createElementNS(SVG, 'rect');
  mark.classList.add(className);
  mark.setAttribute('y', `${String((from / total) * 100)}%`);
  mark.setAttribute('height', size === null ? '3' : `${String((size / total) * 100)}%`);
  mark.setAttribute('x', size === null ? '0' : '2');
  mark.setAttribute('width', size === null ? '100%' : '6');
  return mark;
}

/** The whole file's added and removed runs, in a slim column beside its code that does not scroll with it. */
function overviewStripe(fileDiff: Element): SVGSVGElement {
  const stripe = document.createElementNS(SVG, 'svg');
  stripe.classList.add('overview-stripe');
  stripe.setAttribute('aria-hidden', 'true');
  const rows = [...fileDiff.querySelectorAll<HTMLElement>('tbody > tr')];
  const types = rows.map(row => (row.querySelector('.d2h-ins') ? 'add' : row.querySelector('.d2h-del') ? 'del' : null));
  rows.forEach((row, at) => {
    row.dataset['at'] = String(at);
    const type = types[at];
    if (!type || types[at - 1] === type) return;
    let end = at;
    while (types[end + 1] === type) end++;
    const run = stripeMark(`run-${type}`, at, end - at + 1, rows.length);
    svgTip(run, type === 'add' ? 'Added lines' : 'Removed lines');
    stripe.append(run);
  });
  stripe.dataset['rows'] = String(rows.length);
  return stripe;
}

/** Files with more changed lines than this start collapsed. */
const LARGE_FILE = 400;
/** Files the person collapsed or opened, by path; the others are collapsed while viewed or large. */
const folds = new Map<string, boolean>();

const isClosed = (wrapper: HTMLElement) => {
  const file = wrapper.dataset['file'] ?? '';
  return folds.get(file) ?? (walkthrough.viewed.includes(file) || Number(wrapper.dataset['changed']) > LARGE_FILE);
};

/** Redraws, then moves `wrapper` from how it was drawn to how it is now: a file opens or closes by its height, its header flush. */
function foldAround(wrapper: HTMLElement | null): void {
  const was = wrapper && {
    closed: wrapper.classList.contains('closed'),
    viewed: wrapper.classList.contains('viewed'),
    // Measured mid-motion too, so a file turned back goes on from where it is.
    height: wrapper.getBoundingClientRect().height,
  };
  render();
  if (!wrapper || !was || !wrapper.isConnected) return;
  const header = wrapper.querySelector<HTMLElement>(':scope > .d2h-file-header');
  if (wrapper.classList.contains('viewed') && !was.viewed) {
    const label = header?.querySelector<HTMLElement>('.viewed-toggle > span');
    if (label) {
      const reveal = [
        { maxWidth: '0px', marginLeft: '-6px', opacity: 0, overflow: 'hidden' },
        { maxWidth: `${String(label.getBoundingClientRect().width)}px`, marginLeft: '0px', opacity: 1, overflow: 'hidden' },
      ];
      animate(label, 'viewed-label', reduced() ? FADE_IN : reveal, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out' });
    }
    const name = header?.querySelector('.d2h-file-name');
    if (name) animate(name, 'viewed-dim', [{ color: 'var(--ink)' }, { color: 'var(--muted)' }], { ms: 'base', curve: 'linear' });
  }
  const closed = wrapper.classList.contains('closed');
  if (closed === was.closed) return;
  for (const running of wrapper.getAnimations({ subtree: true })) if (running.id.startsWith('fold')) running.cancel();
  wrapper.classList.remove('closing');
  const contents = [...wrapper.children].filter(child => child !== header);
  const chevron = header?.querySelector('.file-toggle > .icon');
  const turn = [{ transform: 'none' }, { transform: 'rotate(90deg)' }];
  if (chevron && !reduced()) animate(chevron, 'fold-turn', closed ? turn.reverse() : turn, { ms: 'fast', curve: 'ease-out' });
  const height = wrapper.getBoundingClientRect().height;
  const rows = [{ height: `${String(was.height)}px`, overflow: 'hidden' }, { height: `${String(height)}px`, overflow: 'hidden' }];
  if (!closed) {
    for (const part of contents) animate(part, 'fold-fade', FADE_IN, { ms: 'base', curve: 'linear', delay: reduced() ? 0 : 80 });
    if (!reduced()) animate(wrapper, 'fold-rows', rows, { ms: 'slow', curve: 'ease-out' });
    return;
  }
  // What the file held stays drawn until it has faded and the file has closed.
  wrapper.classList.add('closing');
  const fades = contents.map(part => animate(part, 'fold-fade', [{ opacity: 1 }, { opacity: 0 }], { ms: reduced() ? 'fast' : 80, curve: 'linear', fill: 'forwards' }));
  const ends = reduced() ? fades[0] : animate(wrapper, 'fold-rows', rows, { ms: 'base', curve: 'ease-out', delay: 80, fill: 'both' });
  if (!ends) {
    wrapper.classList.remove('closing');
    return;
  }
  ends.finished.then(() => {
    wrapper.classList.remove('closing');
    for (const running of wrapper.getAnimations({ subtree: true })) if (running.id.startsWith('fold')) running.cancel();
  }, () => {});
}

/** Viewed is the person's reading mark: it folds the file away and never decides anything. */
async function markViewed(step: Step, file: string): Promise<void> {
  const viewed = !walkthrough.viewed.includes(file);
  walkthrough = { ...walkthrough, viewed: viewed ? [...walkthrough.viewed, file] : walkthrough.viewed.filter(one => one !== file) };
  folds.set(file, viewed);
  foldAround(drawn.get(step.id)?.view.querySelector<HTMLElement>(`.d2h-file-wrapper[data-file="${CSS.escape(file)}"]`) ?? null);
  const answer = await post('viewed', { step: step.id, file, viewed, on: walkthrough.on[itemKey({ type: 'step', id: step.id })] });
  if (answer) {
    walkthrough = (await answer.json()) as WalkthroughView;
    render();
    return;
  }
  // The page showed its own mark, so the server's is fetched whole.
  walkthroughTag = '';
  poll();
}

function fileControls(wrapper: HTMLElement, step: Step): void {
  const file = wrapper.dataset['file'] ?? '';
  const header = wrapper.querySelector('.d2h-file-header');
  const toggle = el('button', { type: 'button', className: 'icon-button file-toggle' }, icon('chevron-right'));
  toggle.onclick = () => {
    folds.set(file, !isClosed(wrapper));
    foldAround(wrapper);
  };
  const viewed = el('button', { type: 'button', className: 'viewed-toggle', title: withKey('Viewed', 'V') }, icon('eye'), el('span', {}, 'Viewed'));
  viewed.setAttribute('aria-label', `Mark ${file} as viewed`);
  viewed.onclick = () => {
    void markViewed(step, file);
  };
  header?.prepend(toggle);
  header?.append(viewed);
}

/** What a line's gutter marks, the strongest first: a finding, the person's own comment, any other note. */
type Marked = 'finding' | 'own' | 'note';
const MARKED: Marked[] = ['finding', 'own', 'note'];
const MARK_ICONS: Record<Marked, IconName> = { finding: 'warn', own: 'own', note: 'message' };
const MARK_WORDS: Record<Marked, string> = { finding: 'A finding on this line', own: 'Your comment on this line', note: 'A note on this line' };

/** A tooltip for a mark drawn in SVG, which has no title attribute of its own. */
function svgTip(mark: SVGElement, words: string): void {
  const title = document.createElementNS(SVG, 'title');
  title.textContent = words;
  mark.append(title);
}

function jumpTo(row: HTMLElement): void {
  const next = row.nextElementSibling;
  (next?.classList.contains('pinned-row') ? next : row).scrollIntoView({ block: 'center' });
}

function markLines(view: HTMLElement, rows: Map<string, HTMLTableRowElement>, marks: Map<string, Marked>): void {
  for (const old of view.querySelectorAll('.gutter-mark, .overview-stripe .tick')) old.remove();
  for (const [key, kind] of marks) {
    const row = rows.get(key);
    const stripe = row?.closest('.diff-body')?.querySelector<SVGSVGElement>('.overview-stripe');
    if (!row || !stripe) continue;
    const mark = el('span', { className: `gutter-mark ${kind}`, title: MARK_WORDS[kind] }, icon(MARK_ICONS[kind]));
    mark.setAttribute('aria-hidden', 'true');
    row.querySelector('.d2h-code-linenumber')?.append(mark);
    const tick = stripeMark(`tick-${kind}`, Number(row.dataset['at']), null, Number(stripe.dataset['rows']));
    tick.classList.add('tick');
    svgTip(tick, MARK_WORDS[kind]);
    tick.addEventListener('click', () => {
      jumpTo(row);
    });
    stripe.append(tick);
  }
}

/** The session's explanation of one of a step's files; a path like `constructor` must not find an inherited member. */
const fileExplanation = (step: Step, file: string): string | undefined =>
  step.kind === 'step' && step.fileExplanations && Object.hasOwn(step.fileExplanations, file) ? step.fileExplanations[file] : undefined;

/** A link that opens one of the step's files if it is collapsed and scrolls it to the top of its pane. */
function fileLink(step: Step, file: string, className: string): HTMLElement {
  const link = el('a', { href: `#${encodeURIComponent(step.id)}`, className }, file);
  link.onclick = event => {
    event.preventDefault();
    if (!readOnly) {
      folds.set(file, false);
      render();
    }
    // The export shows every step, so its file is looked for in its own step.
    const scope = readOnly ? document.getElementById(step.id) : main;
    scope?.querySelector(`.d2h-file-wrapper[data-file="${CSS.escape(file)}"]`)?.scrollIntoView({ block: 'start' });
  };
  return link;
}

/** Under the overview in the explanation column: each file the session explained, in the step's order, linking to its diff. */
function filesExplained(step: Step): HTMLElement[] {
  if (!shows('explanation') || step.kind !== 'step') return [];
  const entries = step.files.flatMap(file => {
    const text = fileExplanation(step, file);
    if (!text) return [];
    const entry = el('li', { className: 'file-entry' }, fileLink(step, file, 'file-entry-path'), markdown(text, 'file-explanation'));
    entry.dataset['file'] = file;
    return [entry];
  });
  if (!entries.length) return [];
  const heading = el('h3', { className: 'files-head', id: `files-${step.id}` }, 'Files');
  const list = el('ul', { className: 'files-explained' }, ...entries);
  list.setAttribute('aria-labelledby', heading.id);
  return [el('div', { className: 'files-block' }, heading, list)];
}

/** Marks the column's entry for the file at the top of the code pane; at the pane's end, where a short last file cannot reach the top, the last file. */
function markTopFile(): void {
  const entries = prosePane.querySelectorAll<HTMLElement>('.file-entry');
  if (!entries.length) return;
  const wrappers = [...codePane.querySelectorAll<HTMLElement>('.d2h-file-wrapper')].filter(wrapper => wrapper.offsetParent);
  const atEnd = codePane.scrollTop > 0 && codePane.scrollTop + codePane.clientHeight >= codePane.scrollHeight - 1;
  const top = codePane.getBoundingClientRect().top;
  const current = atEnd ? wrappers.at(-1) : wrappers.find(wrapper => wrapper.getBoundingClientRect().bottom > top + 1);
  for (const entry of entries) {
    if (entry.dataset['file'] === current?.dataset['file']) entry.setAttribute('aria-current', 'true');
    else entry.removeAttribute('aria-current');
  }
}

function diffView(step: Step, pinned: (Note | Ask)[]): HTMLElement {
  const { view, rows } = drawDiff(step);
  for (const old of view.querySelectorAll('.pinned-row')) old.remove();
  const press = (row: HTMLTableRowElement, picked: boolean) => {
    row.classList.toggle('selected', picked);
    if (!readOnly) row.querySelector('.d2h-code-linenumber')?.setAttribute('aria-pressed', String(picked));
  };
  for (const old of view.querySelectorAll<HTMLTableRowElement>('tr.selected')) press(old, false);
  for (const old of view.querySelectorAll('.file-explanation')) old.remove();
  // With the explanation column open, the column holds every explanation and the code pane only code.
  const beside = shows('explanation');
  for (const wrapper of view.querySelectorAll<HTMLElement>('.d2h-file-wrapper')) {
    const file = wrapper.dataset['file'] ?? '';
    const text = fileExplanation(step, file);
    if (text && !beside) wrapper.querySelector('.d2h-file-header')?.after(markdown(text, 'file-explanation'));
    if (readOnly) continue;
    const closed = isClosed(wrapper);
    const viewed = walkthrough.viewed.includes(file);
    wrapper.classList.toggle('closed', closed);
    wrapper.classList.toggle('viewed', viewed);
    const toggle = wrapper.querySelector('.file-toggle');
    toggle?.setAttribute('aria-expanded', String(!closed));
    toggle?.setAttribute('aria-label', `${closed ? 'Expand' : 'Collapse'} ${file}`);
    const mark = wrapper.querySelector<HTMLElement>('.viewed-toggle');
    mark?.setAttribute('aria-pressed', String(viewed));
    if (mark) mark.title = viewed ? 'Viewed (V)' : 'Mark as viewed (V)';
  }
  const mine = commentsOf(session.conversation).filter(comment => commentAnchor(comment) === step.id);
  const at = new Map<string, { entries: (Note | Ask)[]; comments: Comment[] }>();
  const marks = new Map<string, Marked>();
  const add = (file: string | undefined, lines: Lines | undefined, mark: Marked, entry: Note | Ask | Comment) => {
    if (file === undefined || !lines) return;
    const key = lineKey(file, lines[1]);
    const here = at.get(key) ?? { entries: [], comments: [] };
    if ('from' in entry) here.entries.push(entry);
    else here.comments.push(entry);
    at.set(key, here);
    const was = marks.get(key);
    if (!was || MARKED.indexOf(mark) < MARKED.indexOf(was)) marks.set(key, mark);
  };
  for (const entry of pinned) {
    const { file, lines } = placeOf(entry);
    add(file, lines, isNote(entry) && entry.note.finding ? 'finding' : 'note', entry);
  }
  for (const comment of mine) add(comment.file, comment.lines, 'own', comment);
  markLines(view, rows, marks);
  for (const old of view.querySelectorAll('.file-marks')) old.remove();
  if (!readOnly)
    for (const wrapper of view.querySelectorAll<HTMLElement>('.d2h-file-wrapper'))
      wrapper.querySelector('.file-stats')?.after(...fileMarks(step, wrapper.dataset['file'] ?? '', pinned.filter(isNote), mine));
  const pick = picked?.step === step.id ? picked : null;
  const pickKey = pick && lineKey(pick.file, pick.lines[1]);
  if (pick && pickKey) {
    for (const row of rows.values()) {
      const line = Number(row.dataset['line']);
      if (row.dataset['file'] === pick.file && line >= pick.lines[0] && line <= pick.lines[1]) press(row, true);
    }
    if (pick.ended && !at.has(pickKey)) at.set(pickKey, { entries: [], comments: [] });
  }
  const composer = (shown: NonNullable<typeof picked>) =>
    shown.mode === 'ask' ? pickedAsk(step, shown.file, shown.lines) : shown.mode === 'comment' ? newComment(step, shown.file, shown.lines) : pickedChoice(step, shown.lines);
  for (const [key, { entries, comments }] of at) {
    const shown = el(
      'div',
      { className: 'pinned' },
      ...notesView(entries.filter(isNote), `more:${step.id}:${key}`),
      ...entries.filter(isAsk).map(askThread),
      ...comments.map(commentView),
      ...(pick?.ended && key === pickKey ? [composer(pick)] : []),
    );
    rows.get(key)?.after(el('tr', { className: 'pinned-row' }, el('td', { colSpan: 2 }, shown)));
  }
  return view;
}

/** After a file's counts, its notes in the marks "In this step" uses; each goes to the first of its kind in the file. */
function fileMarks(step: Step, file: string, notes: Note[], mine: Comment[]): HTMLElement[] {
  const inFile = <T extends Note | Comment>(shown: T[]) =>
    inPageOrder(step, shown.filter(one => pinnedAt(one).file === file && pinnedAt(one).lines !== undefined));
  const mark = (className: string, name: IconName, words: string, what: string, first: Note | Comment | undefined): HTMLElement[] => {
    if (!first) return [];
    const go = () => {
      if ('from' in first) revealNote(step, first);
      else reveal(step, first, `comment-${first.id}`);
    };
    return [el('button', { type: 'button', className: `file-mark ${className}`.trim(), title: `Go to the first ${what} in this file`, onclick: go }, icon(name), words)];
  };
  const findings = inFile(notes.filter(note => note.note.finding));
  const others = inFile(notes.filter(note => !note.note.finding));
  const yours = inFile(mine);
  const marks = [
    ...mark('finding', 'warn', plural(findings.length, 'finding'), 'finding', findings[0]),
    ...mark('', 'message', plural(others.length, 'note'), 'note', others[0]),
    ...mark('own', 'own', `${String(yours.length)} yours`, 'comment of yours', yours[0]),
  ];
  return marks.length ? [el('span', { className: 'file-marks' }, ...marks)] : [];
}

/** Files the person switched to their preview, by step id and path, so a redraw keeps them so. */
const previewed = new Set<string>();

const fileStats = (parsed: DiffFile) =>
  el('span', { className: 'file-stats' }, parsed.isBinary ? 'binary' : `+${String(parsed.addedLines)} \u2212${String(parsed.deletedLines)}`);

function imageFigure(side: 'Before' | 'After', source: string, file: string): HTMLElement {
  const caption = el('figcaption', {}, side);
  const image = el('img', { src: source, alt: `${file}, ${side.toLowerCase()}` });
  image.onload = () => {
    caption.textContent = `${side} · ${String(image.naturalWidth)}×${String(image.naturalHeight)}`;
  };
  image.onerror = () => {
    caption.textContent = `${side} · could not load`;
  };
  return el('figure', {}, el('div', { className: 'image-box' }, image), caption);
}

function addPreview(wrapper: Element, stepId: string, parsed: DiffFile): void {
  const head = parsed.isDeleted ? null : parsed.newName;
  const base = parsed.isNew ? null : parsed.oldName;
  const file = head ?? base ?? '';
  const type = previewType(file);
  const image = type?.startsWith('image/') ?? false;
  const diff = wrapper.querySelector<HTMLElement>('.diff-body');
  // An export has no server to load an image from, so it says what the image is in words.
  if (readOnly && image && parsed.isBinary && diff) {
    const size = exported.images?.[file];
    const change = parsed.isNew ? 'added' : parsed.isDeleted ? 'deleted' : 'replaced';
    const words = ['Binary image', ...(size ? [`${String(size.width)} × ${String(size.height)}`] : []), change].join(' · ');
    diff.replaceChildren(el('p', { className: 'binary-image' }, icon('file'), words));
    return;
  }
  // A preview is read from the server, which an exported file does not have; a deleted Markdown file has nothing to show.
  if (!type || !diff || readOnly || (head === null && !image)) return;
  const at = (path: string) => `file?path=${encodeURIComponent(path)}`;
  const preview = el('div', { className: 'preview', hidden: true });
  preview.setAttribute('role', 'region');
  preview.setAttribute('aria-label', `Preview of ${file}`);
  const fill = async () => {
    if (image) {
      preview.replaceChildren(
        el(
          'div',
          { className: 'image-compare' },
          ...(base === null ? [] : [imageFigure('Before', `${at(base)}&at=base`, file)]),
          ...(head === null ? [] : [imageFigure('After', at(head), file)]),
        ),
      );
      return;
    }
    preview.replaceChildren(el('p', { className: 'muted' }, 'Loading the preview.'));
    const answer = await fetch(at(file)).catch(() => null);
    const added = new Set(parsed.blocks.flatMap(block => block.lines).flatMap(line => (line.type === LineType.INSERT ? [line.newNumber] : [])));
    if (!answer?.ok) {
      preview.replaceChildren(el('p', { className: 'muted' }, 'Could not load the preview.'));
      return;
    }
    preview.innerHTML = renderMarkdown(await answer.text(), file, added);
    // A table keeps its own width, so its wash comes from a row around it.
    for (const table of preview.querySelectorAll('table.inserted')) {
      const row = el('div', { className: 'inserted' });
      table.classList.remove('inserted');
      table.replaceWith(row);
      row.append(table);
    }
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

const ASSUMED = 'Assumed, not checked';

function assumedView(step: Step & { kind: 'step' }): HTMLElement[] {
  if (!step.assumptions.length) return [];
  if (readOnly)
    return [el('div', { className: 'assumptions' }, el('p', { className: 'assumed-head' }, ASSUMED), el('ul', { className: 'assumed' }, ...step.assumptions.map(assumption => el('li', {}, assumption))))];
  const open = !closed.has(step.id);
  const motion = `reveal:${step.id}`;
  const onToggle = () => {
    if (!open) {
      const rows = [{ gridTemplateRows: '0fr', opacity: 0 }, { gridTemplateRows: '1fr', opacity: 1 }];
      play(motion, 'reveal', reduced() ? FADE_IN : rows, reduced() ? { ms: 'base', curve: 'linear' } : { ms: 'slow', curve: 'ease-out' });
    }
    toggle(closed, step.id);
  };
  const label = open ? ASSUMED : `${plural(step.assumptions.length, 'thing')} assumed, not checked`;
  const button = disclosure([label], open, onToggle, 'disclosure assumed-toggle', `assumed:${step.id}`);
  button.id = `assumed-${step.id}`;
  const list = el('ul', { className: 'assumed' }, ...step.assumptions.map(assumption => el('li', {}, assumption)));
  list.setAttribute('aria-labelledby', button.id);
  button.setAttribute('aria-controls', (list.id = `assumed-list-${step.id}`));
  const shown = el('div', { className: 'assumed-wrap', hidden: !open }, list);
  shown.dataset['motion'] = motion;
  return [el('div', { className: 'assumptions' }, button, shown)];
}

/** A path that may break after each slash. */
const breakable = (path: string) => path.split('/').flatMap((part, at, parts) => (at < parts.length - 1 ? [`${part}/`, el('wbr')] : [part]));

function foldedView(step: Step & { kind: 'folded' }, pinned: (Note | Ask)[]): HTMLElement[] {
  const key = `fold:${step.id}`;
  // A file with a note on its lines starts shown, and so does the fold that holds it, so no note waits unseen behind Show diff.
  const noted = new Set(pinned.map(entry => placeOf(entry).file));
  const isShown = (toggled: string, byDefault: boolean) => opened.has(toggled) !== byDefault;
  // An export has no one to open it for, so it shows the files at once.
  const open = readOnly || isShown(key, step.files.some(file => noted.has(file.path)));
  const problems = step.problems.length ? [el('span', { className: 'tag reopened' }, plural(step.problems.length, 'problem'))] : [];
  const reasons = [...new Set(step.files.map(file => plain(file.reason)))];
  const label = [
    el('span', { className: 'fold-count' }, plural(step.files.length, 'file')),
    open ? el('span', { className: 'spacer' }) : el('span', { className: 'fold-reasons' }, reasons.join(' · ')),
    ...problems,
  ];
  const summary = readOnly
    ? el('p', { className: 'fold-lead' }, `${plural(step.files.length, 'file')} to skim, each with the session’s reason.`)
    : disclosure(label, open, () => { toggle(opened, key); }, 'fold-summary', key);
  summary.title = reasons.join('\n');
  // A problem wants the person, so it shows whether the files are open or not.
  const found = step.problems.length
    ? [el('ul', { className: 'problems' }, ...step.problems.map(problem => el('li', { className: 'problem' }, icon('warn'), markdown(problem, 'problem-text'))))]
    : [];
  found[0]?.setAttribute('aria-label', 'Problems the session found');
  if (!open) return [el('div', { className: 'block' }, summary, ...found)];
  const diff = step.diff ? diffView(step, pinned) : null;
  const wrappers = new Map([...(diff?.querySelectorAll<HTMLElement>('.d2h-file-wrapper') ?? [])].map(wrapper => [wrapper.dataset['file'], wrapper]));
  const diffKey = (path: string) => `fold-diff:${step.id}:${path}`;
  for (const [path, wrapper] of wrappers) wrapper.hidden = !readOnly && !isShown(diffKey(path ?? ''), noted.has(path));
  const files = el(
    'ul',
    { className: 'fold-files' },
    ...step.files.map(file => {
      const shown = isShown(diffKey(file.path), noted.has(file.path));
      const button = el('button', { type: 'button', className: 'btn small', onclick: () => { toggle(opened, diffKey(file.path)); } }, shown ? 'Hide diff' : 'Show diff');
      button.setAttribute('aria-expanded', String(shown));
      button.dataset['key'] = diffKey(file.path);
      return el(
        'li',
        {},
        el('code', { className: 'fold-path' }, ...breakable(file.path)),
        markdown(file.reason, 'fold-reason'),
        // An export lists every file open, its diff right under its path and reason; a copy, as the drawn diff is kept for the next render.
        ...(readOnly ? [wrappers.get(file.path)?.cloneNode(true)].filter(wrapper => wrapper !== undefined).map(wrapper => el('div', { className: 'diff' }, wrapper)) : wrappers.has(file.path) ? [button] : []),
      );
    }),
  );
  files.setAttribute('aria-label', 'Folded files');
  const anyShown = !readOnly && [...wrappers.values()].some(wrapper => !wrapper.hidden);
  return [el('div', { className: 'block' }, summary, ...found, files, ...(diff && anyShown ? [el('div', { className: 'fold-diff' }, diff)] : []))];
}

/** The kind line of a folded step, whose title is the session's own. */
const SKIM = 'Files to skim';

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
        prose: [...lateLine(step), ...checkingNotice(step), markdown(step.explanation, 'explanation'), ...filesExplained(step), ...said, ...assumedView(step), ...notes],
        code: [el('div', { className: 'block' }, diffView(step, pinned))],
      };
    case 'folded':
      return {
        prose: [...lateLine(step), ...checkingNotice(step), el('p', { className: 'explanation' }, SKIM), ...said, ...notes],
        code: foldedView(step, pinned),
      };
  }
}

/** A decided step that got findings after the decision says so under its title; the decision stays. */
function lateLine(step: Step): HTMLElement[] {
  const late = readOnly ? 0 : lateFindings(step).length;
  if (!late) return [];
  const what = late === 1 ? 'A finding arrived' : `${String(late)} findings arrived`;
  const matters = late === 1 ? 'the finding matters' : 'the findings matter';
  return [el('p', { className: 'late-line' }, icon('warn'), el('span', {}, `${what} after you ${doneWith(step)}. Your decision stays; change it if ${matters}.`))];
}

function checkingNotice(step: Step): HTMLElement[] {
  if (!beingChecked(step)) return [];
  return [el('div', { className: 'notice checking' }, icon('unchecked'), el('span', {}, 'The session is still checking this step. Findings may still arrive.'))];
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
    ];
  }
  if (!decision) return [];
  const shown = [
    ...(decision.note ? [el('span', { className: 'muted' }, readOnly ? 'Note' : 'Your note'), el('p', { className: 'said person' }, decision.note)] : []),
    ...(decision.text ? [markdown(decision.text, 'said person')] : []),
  ];
  return shown.length ? [el('div', { className: 'decision-said' }, ...shown)] : [];
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
  ask.title = withKey('Ask about this step', '/');
  const decided = stepDecided(step) && !changing.has(key);
  const change = el('button', { type: 'button', className: 'btn', onclick: () => { changing.add(key); render(); } }, 'Change decision');
  change.dataset['key'] = `change:${key}`;
  // While findings are open, Approve weighs no more than Flag.
  const open = openFindings(step).length;
  const choices = decided ? change : actionGroup(item, action => (open && action.id === 'approve' ? 'secondary' : stepLook(action)));
  const held = beingChecked(step) ? [el('span', { className: 'held' }, HELD)] : [];
  if (held.length)
    for (const button of [choices, ...choices.querySelectorAll('button')]) if (button instanceof HTMLButtonElement) button.disabled = true;
  const asking = asks ? [ask] : [];
  const late = decided ? lateFindings(step) : [];
  const counted = inPageOrder(step, late.length ? late : openFindings(step));
  const count = counted.length
    ? [
        keyed(
          el(
            'button',
            { type: 'button', className: 'open-findings', title: 'Go to the next open finding', onclick: () => { nextFinding(step, counted); } },
            icon('warn'),
            late.length ? plural(late.length, 'new finding') : plural(open, 'open finding'),
          ),
          `findings:${step.id}`,
        ),
      ]
    : [];
  const bar = held.length ? 'action-bar holding' : 'action-bar';
  if (!phone.matches) return [el('div', { className: bar }, el('div', { className: 'action-row' }, choices, ...asking, ...held, ...count))];
  // A thumb reaches the right first, so the leading action goes last.
  if (!decided) choices.replaceChildren(...[...choices.children].reverse());
  return [...asking.map(box => el('div', { className: 'step-ask' }, box)), el('div', { className: bar }, ...held, ...count, choices)];
}

/** Asks about the whole step, as threads under it. */
function stepAsks(step: Step): HTMLElement[] {
  const asks = session.conversation.filter(isAsk).filter(asked => anchorOf(asked) === step.id && !asked.lines);
  return asks.length ? [el('div', { className: 'conversation' }, ...asks.map(askThread))] : [];
}

/** "In this step" beside the step head: its files, what was noted on it and the criteria linked to it. */
function factsRail(step: Step): HTMLElement[] {
  if (step.kind !== 'step') return [];
  const files = [...drawDiff(step).view.querySelectorAll<HTMLElement>('.d2h-file-wrapper')].map(wrapper => {
    const file = wrapper.dataset['file'] ?? '';
    return el('li', {}, fileLink(step, file, 'facts-file'), el('span', { className: 'facts-count' }, wrapper.querySelector('.file-stats')?.textContent ?? ''));
  });
  const notes = stepNotesOf(step);
  const findings = notes.filter(note => note.note.finding).length;
  const yours = commentsOf(session.conversation).filter(comment => commentAnchor(comment) === step.id).length;
  const counts = [
    ...(findings ? [el('li', { className: 'finding' }, icon('warn'), plural(findings, 'finding'))] : []),
    ...(notes.length > findings ? [el('li', {}, icon('message'), plural(notes.length - findings, 'note'))] : []),
    ...(yours ? [el('li', { className: 'own' }, icon('own'), `${String(yours)} yours`)] : []),
  ];
  const criteria = (walkthrough.checklist?.items ?? [])
    .filter(item => item.steps.includes(step.id))
    .map(item => {
      const mark = item.mark ?? 'unchecked';
      const row = el('li', { title: stateName(mark) ?? '' }, icon(mark, stateName(mark)), el('span', {}, plain(item.text)));
      row.dataset['mark'] = mark;
      return row;
    });
  const rail = el(
    'aside',
    { className: 'facts' },
    el('h3', { className: 'facts-head' }, 'In this step'),
    ...[files, counts, criteria].filter(group => group.length).map(group => el('ul', {}, ...group)),
  );
  rail.setAttribute('aria-label', 'In this step');
  return [rail];
}

// The step in the explanation column and its panes stay in the page across redraws, as the main pane does, so each keeps where it was scrolled.
const prosePane = el('div', { className: 'prose' });
const codePane = el('div', { className: 'code' });
const splitStep = el('section', { className: 'step split' }, prosePane, codePane);

/** In the explanation column the prose pane leads with the notices, then the step and its actions; the files fill the code pane. */
function stepView(step: Step, notices: HTMLElement[], view: View): HTMLElement {
  const title = el('h2', { className: 'step-title', id: `step-${step.id}` }, step.title);
  const { prose, code } = stepBody(step);
  const explaining = shows('explanation');
  const lead = [el('div', { className: 'title-row' }, title, stateTag({ type: 'step', id: step.id }, false)), ...prose];
  const parts = [
    ...(explaining ? lead : [el('div', { className: 'step-head' }, el('div', { className: 'step-lead' }, ...lead), ...factsRail(step))]),
    ...(explaining ? [] : code),
    ...stepAsks(step),
    ...actionBar(step),
  ];
  if (!explaining) {
    const section = el('section', { className: 'step' }, ...parts);
    section.setAttribute('aria-labelledby', title.id);
    return section;
  }
  prosePane.replaceChildren(panelHead('explanation', el('span', {}, PANEL.explanation.title)), ...notices, ...navRow(view), ...parts);
  codePane.replaceChildren(...code);
  splitStep.setAttribute('aria-labelledby', title.id);
  return splitStep;
}

/** What a state icon says, to a screen reader and in its tooltip, where no text beside it says so already. */
const stateName = (mark: IconName) => (['decided', 'flagged', 'no-tone', 'reopened'].includes(mark) ? undefined : MEANS[mark]);

/** The icon of each way a step shows. */
const SHOWN_ICON: Record<Shown, IconName> = { cur: 'current', ok: 'decided', flag: 'flagged', neu: 'no-tone', reo: 'reopened', find: 'warn', un: 'unread' };

/** A sub-line's colour: green, amber needs you, or red not met; muted without one. */
type SubColour = 'ok' | 'attention' | 'bad';
type Sub = { text: string; colour?: SubColour | undefined };
const SHOWN_SUB: Partial<Record<Shown, SubColour>> = { ok: 'ok', flag: 'attention' };

/** A row of the rail: a state icon, a title and an optional sub-line, linking to what it names. */
function queueRow(
  address: string,
  state: string,
  mark: IconName,
  title: string,
  sub: Sub | null,
  // Only a step is one of a sequence; the session's messages and the checklist are pages of their own.
  current: false | 'step' | 'page',
  // A long title holds to two lines, all of it in its tooltip.
  clamped = false,
): HTMLElement {
  const name = clamped ? el('span', { className: 'queue-name clamped', title }, title) : title;
  const row = el(
    'a',
    { href: `#${encodeURIComponent(address)}`, className: 'queue-item' },
    icon(mark, stateName(mark)),
    el(
      'span',
      { className: 'queue-title' },
      name,
      ...(sub ? [el('span', { className: `queue-sub ${sub.colour ?? ''}`.trim() }, sub.text)] : []),
    ),
  );
  row.dataset['state'] = state;
  row.dataset['key'] = `row:${address}`;
  // The row's tooltip says what its icon shows, for anyone who cannot tell it from its shape or colour.
  const means = stateName(mark);
  if (means) row.title = means;
  if (current) row.setAttribute('aria-current', current);
  return row;
}

/** A step's row; one with open findings opens at the first of them. */
function stepRow(step: Step, isCurrent: boolean): HTMLElement {
  const row = stepRowView(step, isCurrent);
  if (openFindings(step).length)
    row.onclick = event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openAtFinding(step);
    };
  return row;
}

/** The sub-line says, in this order: a finding after the decision, being checked, changed since decided, open findings, a folded step's problems. */
function stepRowView(step: Step, isCurrent: boolean): HTMLElement {
  const current = isCurrent && 'step';
  const item: Item = { type: 'step', id: step.id };
  const shown = shownOf(step, isCurrent ? step : undefined);
  const decision = decisionOf(item);
  if (decision) {
    const sub: Sub = lateFindings(step).length
      ? { text: 'New finding', colour: 'attention' }
      : { text: labelOf(item, decision.action), colour: SHOWN_SUB[decidedShown(item, decision)] };
    return queueRow(step.id, shown, SHOWN_ICON[shown], step.title, sub, current);
  }
  const open = openFindings(step).length;
  const findings: Sub | null = open ? { text: plural(open, 'open finding'), colour: 'attention' } : null;
  const checking = beingChecked(step) ? { text: 'Being checked' } : null;
  if (stepReopened(step)) return queueRow(step.id, shown, SHOWN_ICON[shown], step.title, checking ?? { text: CHANGED, colour: 'attention' }, current);
  // Files to skim keep their own icon, so the rail names them apart from the steps to read.
  if (step.kind === 'folded') {
    const problems: Sub | null = step.problems.length ? { text: plural(step.problems.length, 'problem'), colour: 'attention' } : null;
    const state = isCurrent ? shown : 'folded';
    return queueRow(step.id, state, isCurrent ? 'current' : 'folded', step.title, checking ?? findings ?? problems, current);
  }
  return queueRow(step.id, shown, SHOWN_ICON[shown], step.title, checking ?? findings, current);
}

/** A step is left while it is undecided, or a finding was pinned on it after the person decided it. */
const stepLeft = (step: Step) => !stepDecided(step) || lateFindings(step).length > 0;

const SESSION_PAGE = 'Session messages';

/** The row that opens the Session messages page, when the session said anything, files are in no step or notes lost their code. */
function sessionRow(view: View): HTMLElement[] {
  const messages = sessionMessages().length;
  const unplaced = walkthrough.unplaced?.length ?? 0;
  const gone = detachedCount();
  if (!messages && !unplaced && !gone) return [];
  const sub = [
    ...(messages ? [plural(messages, 'message')] : []),
    ...(unplaced ? [`${plural(unplaced, 'file')} not in a step`] : []),
    ...(gone ? [`${String(gone)} on removed code`] : []),
  ];
  const current = view.kind === 'session';
  return [queueRow('session', 'message', current ? 'current' : 'message', SESSION_PAGE, { text: sub.join(' · ') }, current && 'page')];
}

/** The address and title of what the main pane shows, as the phone's select names it. */
function viewAddress(view: View): [string, string] | null {
  switch (view.kind) {
    case 'step':
      return [view.step.id, view.step.title];
    case 'session':
      return ['session', SESSION_PAGE];
    case 'checklist': {
      const item = walkthrough.checklist?.items.find(one => one.id === view.item);
      return item ? [`checklist-${item.id}`, plain(item.text)] : ['checklist', walkthrough.checklist?.title ?? ''];
    }
    case 'summary':
      return ['summary', 'Summary'];
    case 'deck':
      return ['deck', 'Swipe to decide'];
    case 'preparing':
      return null;
  }
}

/** The rail at phone width: a select of the rows left, then the decided steps and the Summary; the open step says where it is. */
function queueSelect(view: View, left: [string, string][], decided: Step[]): HTMLElement[] {
  const shown = viewAddress(view);
  const named = (address: string, title: string) =>
    view.kind === 'step' && address === shown?.[0] ? `Step ${String(stepNumber(address))} of ${String(walkthrough.steps.length)} · ${title}` : title;
  const option = ([address, title]: [string, string]) => el('option', { value: address, selected: address === shown?.[0] }, named(address, title));
  const known = [...left, ...decided.map(step => [step.id, step.title]), ['summary', '']].some(([address]) => address === shown?.[0]);
  const select = el(
    'select',
    {
      onchange: () => {
        const step = walkthrough.steps.find(one => one.id === select.value);
        if (step) openAtFinding(step);
        else go(select.value);
      },
    },
    ...(shown && !known ? [option(shown)] : []),
    ...(walkthrough.steps.length || left.length ? [] : [el('option', { disabled: true, selected: true }, 'No steps yet')]),
    ...left.map(option),
    ...(decided.length ? [el('optgroup', { label: `${String(decided.length)} decided` }, ...decided.map(step => option([step.id, step.title])))] : []),
    ...(walkthrough.steps.length ? [option(['summary', 'Summary'])] : []),
  );
  select.setAttribute('aria-label', 'Step');
  select.dataset['key'] = 'queue-select';
  const box = selectBox(select);
  box.classList.add('queue-select');
  const count = el('span', { className: 'queue-count' }, `${String(walkthrough.steps.filter(stepDecided).length)} decided`);
  return [box, ...(walkthrough.steps.length ? [count] : [])];
}

function queueView(view: View): HTMLElement[] {
  const { steps } = walkthrough;
  const current = view.kind === 'step' ? view.step : undefined;
  const undecided = steps.filter(stepLeft);
  const fromSession = sessionRow(view);
  const rows = [...undecided.map(step => stepRow(step, step === current)), ...fromSession];
  const left: [string, string][] = undecided.map(step => {
    const open = openFindings(step).length;
    return [step.id, lateFindings(step).length ? `${step.title} · New finding` : open ? `${step.title} · ${plural(open, 'open finding')}` : step.title];
  });
  if (fromSession.length) left.push(['session', SESSION_PAGE]);
  const counted = steps.length > 0 || rows.length > 0;
  const leftCount = el('span', { className: 'counter' }, String(rows.length));
  leftCount.dataset['motion'] = 'count:left';
  const head = panelHead('queue', el('h2', { className: 'queue-head', id: 'queue-head' }, PANEL.queue.title, ...(counted ? [leftCount] : [])));
  const empty = rows.length ? [] : [el('p', { className: 'queue-empty' }, steps.length ? 'Everything is decided.' : 'No steps yet')];
  const decided = steps.filter(step => !stepLeft(step));
  const open = opened.has('decided') || (current !== undefined && decided.includes(current));
  // Only the number arrives as the chip lands; the words stay put.
  const decidedNumber = el('span', {}, String(decided.length));
  decidedNumber.dataset['motion'] = 'count:decided';
  const decidedCount = el('span', {}, decidedNumber, ' decided');
  const toggleDecided = el(
    'button',
    { type: 'button', className: 'decided-toggle', onclick: () => { toggle(opened, 'decided'); } },
    icon('decided'),
    decidedCount,
    icon(open ? 'chevron-down' : 'chevron-right'),
  );
  toggleDecided.setAttribute('aria-expanded', String(open));
  toggleDecided.dataset['key'] = 'decided-toggle';
  toggleDecided.dataset['motion'] = 'flash:decided';
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
  const summary = steps.length ? [queueRow('summary', 'summary', 'summary', 'Summary', null, view.kind === 'summary' && 'page')] : [];
  return [...queueSelect(view, left, decided), head, ...rows, ...empty, ...foot, ...summary];
}

const stepNumber = (id: string) => walkthrough.steps.findIndex(step => step.id === id) + 1;

/** Counted only when the session marks items, since a status alone says nothing the page can count. */
function metCount(items: ChecklistItem[]): string | null {
  if (!items.some(item => item.mark !== undefined)) return null;
  return `${String(items.filter(item => item.mark === 'met').length)} of ${String(items.length)} met`;
}

/** Each item reads down: its mark and text, then its status and linked steps on one line; `compact` leaves its actions to the checklist's own page. */
function checklistRows(items: ChecklistItem[], view: View, compact: boolean): HTMLElement[] {
  return items.map(item => {
    const links: HTMLElement[] = item.steps.flatMap(id => {
      const at = stepNumber(id);
      const step = walkthrough.steps[at - 1];
      if (!step) return [];
      const link = keyed(el('a', { href: `#${encodeURIComponent(id)}`, className: 'step-link', title: step.title }, String(at)), `step-link:${item.id}:${id}`);
      link.setAttribute('aria-label', `Step ${String(at)}`);
      return [link];
    });
    const gone = item.steps.length - links.length;
    const mark = item.mark ?? 'unchecked';
    const named = [links.length === 1 ? ' · Step ' : ' · Steps ', ...links.flatMap((link, at) => (at ? [', ', link] : [link]))];
    const steps = links.length ? [el('span', { className: 'item-steps' }, ...named)] : [];
    const row = el(
      'li',
      { className: view.kind === 'checklist' && view.item === item.id ? 'current' : '' },
      icon(mark, stateName(mark)),
      el(
        'div',
        { className: 'item-body' },
        markdown(item.text, 'item-text'),
        el('p', { className: 'item-line' }, el('span', { className: 'item-status' }, item.status), ...steps),
        ...(gone ? [el('p', { className: 'gone' }, icon('unlink'), `${plural(gone, 'linked step')} no longer in the change`)] : []),
      ),
      ...(compact ? [] : decideView({ type: 'checklist', id: item.id }, item.text, true, () => 'secondary')),
    );
    row.dataset['mark'] = mark;
    row.id = `checklist-item-${item.id}`;
    return row;
  });
}

function checklistView({ title, description, items }: Checklist, view: View, compact = false): HTMLElement {
  const heading = el(
    'h2',
    { className: view.kind === 'checklist' ? 'step-title' : 'section-head', id: 'checklist' },
    compact ? el('a', { href: '#checklist' }, title) : title,
  );
  const rows = checklistRows(items, view, compact);
  const head = view.kind === 'checklist' ? el('div', { className: 'title-row' }, heading) : heading;
  const met = metCount(items);
  if (met !== null) head.append(el('span', { className: 'counter' }, met));
  const about = description ? [el('p', { className: 'checklist-description' }, description)] : [];
  const section = el('section', { className: 'checklist' }, head, ...about, el('ul', {}, ...rows));
  section.setAttribute('aria-labelledby', heading.id);
  return section;
}

function wholeView(): HTMLElement[] {
  const item: Item = { type: 'walkthrough' };
  const actions = walkthrough.actions[itemKey(item)] ?? [];
  if (!actions.length) return [];
  const shown = walkthrough.decided[itemKey(item)] ?? walkthrough.reopened[itemKey(item)];
  const heading = el('h2', { className: 'section-head', id: 'whole' }, 'Whole walkthrough', ...(shown || readOnly ? [stateTag(item, true)] : []));
  const taken = taking?.key === itemKey(item) ? actions.find(action => action.id === taking?.action) : undefined;
  const section = el(
    'section',
    { className: 'whole' },
    heading,
    ...(shown ? decisionSaid(shown) : []),
    ...(readOnly ? [] : [taken ? takingForm(item, taken, '') : el('div', { className: 'action-row' }, finishGroup())]),
  );
  section.setAttribute('aria-labelledby', heading.id);
  return [section];
}

const VERDICT: Item = { type: 'verdict' };
const WHOLE: Item = { type: 'walkthrough' };

/** The label of the verdict the person chose, while it holds. */
function verdictLabel(): string | null {
  const chosen = decisionOf(VERDICT);
  return chosen ? labelOf(VERDICT, chosen.action) : null;
}

/** The chosen verdict as a status in its tone, never a control. */
const verdictStatus = (): HTMLElement[] => {
  const label = verdictLabel();
  const chosen = decisionOf(VERDICT);
  if (label === null || !chosen) return [];
  return [toned(el('span', { className: 'verdict-status', title: 'Your verdict' }, icon('finish'), label), decidedShown(VERDICT, chosen))];
};

/** While the session offers a verdict and none is chosen, the walkthrough's first action, its finishing one, waits. */
const finishWaits = () => (walkthrough.actions[itemKey(VERDICT)] ?? []).length > 0 && !decisionOf(VERDICT);

const linesShort = ([first, last]: Lines) => (first === last ? String(first) : `${String(first)}–${String(last)}`);

function summarySection(name: string, count: string | null, ...body: HTMLElement[]): HTMLElement {
  const id = `summary-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  const heading = el('h2', { className: 'section-head', id }, name, ...(count === null ? [] : [el('span', { className: 'counter' }, count)]));
  const section = el('section', { className: 'summary-section' }, heading, ...body);
  section.setAttribute('aria-labelledby', id);
  return section;
}

/** A row of the Summary's ledger: `open` rows lead, and the decision in words closes the row in its tone. */
type LedgerRow = {
  item: Item;
  address: string;
  number: string;
  mark: IconName;
  /** What colours the icon and a decision's words. */
  state: string;
  title: string;
  words: string;
  tone: 'decided' | 'muted' | 'changed';
  subs: HTMLElement[];
  open: boolean;
  /** What an action that edits text starts from. */
  text?: string;
};

const ledgerSub = (text: string, className = '') => el('span', { className: `ledger-sub ${className}`.trim(), title: text }, text);

/** The person's own comments on a step, in the accent, each after its file's name and lines. */
function ownSubs(step: Step): HTMLElement[] {
  return commentsOf(session.conversation)
    .filter(comment => commentAnchor(comment) === step.id)
    .map(comment => {
      const where = el('span', { className: 'where', title: comment.file }, `${comment.file.split('/').at(-1) ?? comment.file}:${linesShort(comment.lines)}`);
      return el('span', { className: 'ledger-sub own', title: plain(comment.text) }, icon('own', 'Your comment'), where, ' ', plain(comment.text));
    });
}

function stepLedgerRow(step: Step): LedgerRow {
  const item: Item = { type: 'step', id: step.id };
  const decision = decisionOf(item);
  const reopened = stepReopened(step);
  const row = { item, address: step.id, number: String(stepNumber(step.id)), title: step.title };
  const own = ownSubs(step);
  const checking = beingChecked(step) ? [ledgerSub('Findings may still arrive.', decision ? 'muted' : '')] : [];
  // A step decided before the session held it keeps its decision, so the groups add up to the count of decided steps.
  if (decision) {
    const said = [decision.note, decision.text].flatMap(text => (text ? [ledgerSub(`“${plain(text)}”`)] : []));
    const late = lateFindings(step).length;
    const arrived = late ? [ledgerSub(`${plural(late, 'new finding')} since you ${doneWith(step)}.`, 'changed')] : [];
    const state = decidedShown(item, decision);
    const subs = [...said, ...arrived, ...checking, ...own];
    return { ...row, mark: SHOWN_ICON[state], state, words: labelOf(item, decision.action), tone: 'decided', subs, open: false };
  }
  if (checking.length) return { ...row, mark: 'unchecked', state: 'unchecked', words: 'Being checked', tone: 'muted', subs: [...checking, ...own], open: true };
  if (reopened) {
    const since = ledgerSub(`Changed since you chose ${labelOf(item, reopened.action)}.`, 'muted');
    return { ...row, mark: 'reopened', state: 'reo', words: 'Changed', tone: 'changed', subs: [since, ...own], open: true };
  }
  const state = shownOf(step);
  const listed = (count: number, what: string, texts: string[]) =>
    count ? [ledgerSub(texts.length ? `${plural(count, what)}: ${texts.join(' · ')}` : plural(count, what), 'changed finding')] : [];
  const findings = openFindings(step);
  const problems = step.kind === 'folded' ? step.problems : [];
  // A finding with actions has a row of its own, so the step only counts it.
  const unlisted = findings.filter(note => !(walkthrough.actions[itemKey({ type: 'note', id: note.id })] ?? []).length);
  const open = [...listed(findings.length, 'open finding', unlisted.map(note => plain(note.text))), ...listed(problems.length, 'problem', problems)];
  for (const sub of open) sub.prepend(icon('warn'));
  return { ...row, mark: SHOWN_ICON[state], state, words: 'Undecided', tone: 'muted', subs: [...open, ...own], open: true };
}

/** Notes and checklist items offering actions the person has not taken, or that changed since they took one. */
function otherOpenRows(): LedgerRow[] {
  type Open = Pick<LedgerRow, 'item' | 'address' | 'mark' | 'state' | 'title' | 'text'>;
  const notes = session.conversation.filter(isNote).filter(note => !isDraft(note)).map((note): Open => ({
    item: { type: 'note', id: note.id },
    address: anchorOf(note) ?? 'session',
    mark: note.note.finding ? 'warn' : 'message',
    state: note.note.finding ? 'find' : 'note',
    title: `${note.note.label}: ${plain(note.text)}`,
    text: note.text,
  }));
  return notes
    .filter(one => !decisionOf(one.item) && (walkthrough.actions[itemKey(one.item)] ?? []).length > 0)
    .map(one => {
      const reopened = walkthrough.reopened[itemKey(one.item)];
      const subs = reopened ? [ledgerSub(`Changed since you chose ${labelOf(one.item, reopened.action)}.`, 'muted')] : [];
      return { ...one, number: '', words: reopened ? 'Changed' : 'Undecided', tone: reopened ? 'changed' : 'muted', subs, open: true };
    });
}

const ledgerRows = () => [...walkthrough.steps.map(stepLedgerRow), ...otherOpenRows()];

/** A Still open row's own actions, so the person decides it from the Summary; a step being checked waits. */
function ledgerActions(item: Item, text = '', closes = true): HTMLElement[] {
  const key = itemKey(item);
  const actions = walkthrough.actions[key] ?? [];
  const step = item.type === 'step' ? walkthrough.steps.find(one => one.id === item.id) : undefined;
  if (readOnly || !actions.length || (step && beingChecked(step))) return [];
  const taken = taking?.key === key ? actions.find(action => action.id === taking?.action) : undefined;
  if (taken) return [takingForm(item, taken, text)];
  return [el('div', { className: 'ledger-actions' }, actionGroup(item, () => 'secondary', true, closes))];
}

/** A row's title goes to the exact place: a step at its first open finding, a note on its lines with its file open. */
function ledgerGo(item: Item, address: string): ((event: MouseEvent) => void) | null {
  const step = walkthrough.steps.find(one => one.id === address);
  if (!step) return null;
  const note = item.type === 'note' ? session.conversation.filter(isNote).find(one => one.id === item.id) : undefined;
  if (item.type === 'step' ? !openFindings(step).length : !note) return null;
  return event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (note) openAtNote(step, note);
    else openAtFinding(step);
  };
}

/** Every step in one table, still open first, then decided; undecided never reads as decided. */
function ledgerView(rows: LedgerRow[]): HTMLElement {
  const groups = [
    ['Still open', rows.filter(row => row.open)],
    ['Decided', rows.filter(row => !row.open)],
  ] as const;
  const bodies = groups
    .filter(([, group]) => group.length)
    .map(([name, group]) => {
      const head = el('th', { colSpan: 4, scope: 'rowgroup' }, name, el('span', { className: 'counter' }, String(group.length)));
      return el(
        'tbody',
        {},
        el('tr', { className: 'ledger-group' }, head),
        ...group.map(({ item, address, number, mark, state, title, words, tone, subs, open, text }) => {
          const link = keyed(el('a', { href: `#${encodeURIComponent(address)}`, title }, title), `ledger:${itemKey(item)}`);
          const going = ledgerGo(item, address);
          if (going) link.onclick = going;
          const actions = open ? ledgerActions(item, text) : [];
          const row = el(
            'tr',
            { className: 'ledger-row' },
            el('td', { className: 'ledger-number' }, number),
            el('td', { className: 'ledger-mark' }, icon(mark, stateName(mark))),
            el('td', { className: 'ledger-title' }, link, ...(subs.length ? [el('span', { className: 'ledger-subs' }, ...subs)] : []), ...actions),
            el('td', { className: `ledger-decision ${tone}` }, words),
          );
          row.dataset['state'] = state;
          return row;
        }),
      );
    });
  const table = el('table', { className: 'ledger' }, ...bodies);
  table.setAttribute('aria-label', 'Every step and what you decided');
  return table;
}

function verdictView(): HTMLElement {
  const actions = walkthrough.actions[itemKey(VERDICT)] ?? [];
  const chosen = decisionOf(VERDICT);
  const reopened = walkthrough.reopened[itemKey(VERDICT)];
  const options = actions.map((action, at) => {
    const checked = chosen?.action === action.id;
    const option = keyed(
      el(
        'button',
        { type: 'button', className: 'verdict-option', tabIndex: checked || (!chosen && at === 0) ? 0 : -1 },
        icon(checked ? 'decided' : 'unread'),
        action.label,
      ),
      `verdict:${action.id}`,
    );
    if (chosen && checked) option.dataset['state'] = decidedShown(VERDICT, chosen);
    option.setAttribute('role', 'radio');
    option.setAttribute('aria-checked', String(checked));
    option.onclick = () => {
      take(VERDICT, action);
    };
    return option;
  });
  const now = chosen
    ? el('p', { className: 'verdict-now' }, 'Your verdict: ', toned(el('strong', {}, labelOf(VERDICT, chosen.action)), decidedShown(VERDICT, chosen)))
    : reopened
      ? el('p', { className: 'verdict-now reopened' }, icon('reopened'), `Changed since you chose ${labelOf(VERDICT, reopened.action)}`)
      : el('p', { className: 'verdict-now muted' }, 'No verdict yet.');
  const group = el('div', { className: 'verdict-options' }, ...options);
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', 'Verdict');
  // Arrows only move between the choices; Enter or Space chooses, since a choice goes to the session.
  group.onkeydown = event => {
    const by = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[event.key];
    const at = options.indexOf(event.target as HTMLButtonElement);
    if (by === undefined || at < 0) return;
    event.preventDefault();
    options[(at + by + options.length) % options.length]?.focus();
  };
  const taken = taking?.key === itemKey(VERDICT) ? actions.find(action => action.id === taking?.action) : undefined;
  const heading = el('h2', { className: 'section-head', id: 'summary-verdict' }, 'Verdict');
  const section = el(
    'section',
    { className: 'verdict' },
    heading,
    now,
    ...(options.length && !readOnly && !(decisionOf(WHOLE) && !changing.has(itemKey(WHOLE))) ? [group] : []),
    ...(taken ? [takingForm(VERDICT, taken, '')] : []),
    ...(chosen ? decisionSaid(chosen) : []),
  );
  section.setAttribute('aria-labelledby', heading.id);
  return section;
}

const DRAFT_STATES = ['Goes out', 'Edited', 'Dropped'] as const;
const draftCount = (count: number, state: (typeof DRAFT_STATES)[number]) =>
  `${String(count)} ${state === 'Goes out' ? (count === 1 ? 'goes out' : 'go out') : state.toLowerCase()}`;

/** A note the person can edit before it goes is a draft: it goes out as drafted or edited, unless any other action drops it. */
const isDraft = (note: Note) => (walkthrough.actions[itemKey({ type: 'note', id: note.id })] ?? []).some(action => action.edit);

/** Every draft in one place, one line each, with its own actions; the whole text is on the note, one click away. */
function draftsView(): HTMLElement[] {
  const drafts = session.conversation.filter(isNote).filter(isDraft).map(note => {
    const item: Item = { type: 'note', id: note.id };
    const decision = decisionOf(item);
    const kept = !decision || walkthrough.actions[itemKey(item)]?.find(action => action.id === decision.action)?.edit;
    const edited = kept && decision?.text !== undefined && decision.text !== note.text ? decision.text : undefined;
    const state: (typeof DRAFT_STATES)[number] = !kept ? 'Dropped' : edited === undefined ? 'Goes out' : 'Edited';
    return { note, item, state, text: edited ?? note.text };
  });
  if (!drafts.length) return [];
  const counts = DRAFT_STATES.flatMap(state => {
    const count = drafts.filter(one => one.state === state).length;
    return count ? [draftCount(count, state)] : [];
  });
  const rows = drafts.map(({ note, item, state, text }) => {
    const { file, lines } = note.note;
    const address = anchorOf(note) ?? 'session';
    const step = walkthrough.steps.find(one => one.id === address);
    const where = file !== undefined && lines ? `${file} · ${linesShort(lines)}` : step ? `Step ${String(stepNumber(step.id))}` : 'On removed code';
    const words = plain(text);
    const link = keyed(el('a', { className: 'draft-line', href: `#${encodeURIComponent(address)}`, title: words }, state === 'Dropped' ? el('s', {}, words) : words), `draft:${note.id}`);
    const going = ledgerGo(item, address);
    if (going) link.onclick = going;
    return el(
      'li',
      { className: state === 'Dropped' ? 'dropped' : '' },
      el('span', { className: 'where' }, where),
      el('span', { className: 'draft-text' }, el('span', { className: 'draft-state' }, state), link),
      ...ledgerActions(item, note.text),
    );
  });
  return [summarySection('Comments the session drafted', counts.join(' · '), el('ul', { className: 'summary-list' }, ...rows))];
}

/** A person's mark on a criterion is the tone of the action they took; otherwise the session's mark stands. */
const TONE_MARK: Partial<Record<string, Mark>> = { positive: 'met', attention: 'not-met' };

/** The criteria under the ledger, prefilled with the session's judgement: its mark shows chosen, and the person presses another only to overrule it. */
function criteriaView(): HTMLElement[] {
  const { checklist } = walkthrough;
  if (!checklist) return [];
  const rows = checklist.items.map(one => {
    const item: Item = { type: 'checklist', id: one.id };
    const actions = walkthrough.actions[itemKey(item)] ?? [];
    const decision = decisionOf(item);
    const mark: Mark | 'unchecked' = (decision && TONE_MARK[toneOf(actions, decision.action)]) || one.mark || 'unchecked';
    const words = plain(one.text);
    const link = el('a', { className: 'draft-line', href: `#checklist-${encodeURIComponent(one.id)}`, title: words }, words);
    const own = actions.length && !readOnly ? ledgerActions(item, one.text, false) : [];
    if (!decision)
      for (const [at, button] of [...(own[0]?.querySelectorAll('button') ?? [])].entries())
        button.setAttribute('aria-pressed', String(actions[at] !== undefined && TONE_MARK[toneOf(actions, actions[at].id)] === one.mark));
    const row = el('li', { title: one.status }, el('span', { className: 'draft-text' }, icon(mark, stateName(mark)), link), ...own);
    row.dataset['mark'] = mark;
    return row;
  });
  return [summarySection(checklist.title, metCount(checklist.items), el('ul', { className: 'summary-list criteria' }, ...rows))];
}

/** The walkthrough's actions, the first of which waits for a verdict. */
function finishGroup(): HTMLElement {
  const group = actionGroup(WHOLE, firstLeads);
  const first = group.querySelector('button');
  if (first) first.disabled = finishWaits();
  return group;
}

/** The walkthrough's own actions close the page: the first, its finishing action, leads and waits for a verdict; one hint says what goes where. */
function finishView(): HTMLElement[] {
  const actions = readOnly ? [] : (walkthrough.actions[itemKey(WHOLE)] ?? []);
  const shown = decisionOf(WHOLE) ?? walkthrough.reopened[itemKey(WHOLE)];
  const taken = taking?.key === itemKey(WHOLE) ? actions.find(action => action.id === taking?.action) : undefined;
  const hint = [
    ...(actions.length && finishWaits() ? ['Choose a verdict first.'] : []),
    walkthrough.hints?.[itemKey(VERDICT)],
    ...(actions.length ? [walkthrough.hints?.[itemKey(WHOLE)]] : []),
  ]
    .filter(Boolean)
    .join(' ');
  return [
    ...(actions.length ? [el('div', { className: 'finish' }, ...(shown ? [stateTag(WHOLE, true)] : []), taken ? takingForm(WHOLE, taken, '') : finishGroup())] : []),
    ...(hint ? [el('p', { className: 'hint finish-hint' }, hint)] : []),
    // What the finishing action did, such as where the review went, is the one answer worth reading.
    ...(shown && actions.length ? decisionSaid(shown, true) : []),
  ];
}

/** The last entry of the queue: the walk as a ledger, and the rail that finishes it with the verdict. */
function summaryView(): HTMLElement {
  const { steps } = walkthrough;
  const rows = ledgerRows();
  const open = rows.filter(row => row.open).length;
  const title = el('h2', { className: 'step-title', id: 'summary' }, 'Summary');
  const comments = commentsOf(session.conversation).length;
  const flagged = steps.filter(step => decisionOf({ type: 'step', id: step.id })?.note).length;
  const checking = steps.filter(beingChecked).length;
  const items = walkthrough.checklist?.items ?? [];
  const counts = [
    `${String(steps.filter(stepDecided).length)} of ${plural(steps.length, 'step')} decided`,
    ...(checking ? [`${String(checking)} being checked`] : []),
    ...(flagged ? [`${String(flagged)} flagged`] : []),
    ...(comments ? [`${String(comments)} of your comments`] : []),
    ...(items.some(item => item.mark !== undefined) ? [`checklist ${String(items.filter(item => item.mark === 'met').length)} of ${String(items.length)} met`] : []),
  ];
  const rail = el('aside', { className: 'finish-rail' }, verdictView(), ...finishView());
  rail.setAttribute('aria-label', 'Finish');
  const section = el(
    'section',
    { className: 'summary' },
    el('div', { className: 'title-row' }, title, el('span', { className: 'tag' }, open ? `${String(open)} still open` : 'Nothing still open')),
    el('p', { className: 'summary-line' }, counts.join(' · ')),
    el('div', { className: 'summary-grid' }, el('div', { className: 'summary-walk' }, ledgerView(rows), ...criteriaView(), ...draftsView()), rail),
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

/** A section of the Session messages page: a heading with its icon and count, then what it holds. */
function messagesSection(id: string, mark: IconName, name: string, count: number, ...body: HTMLElement[]): HTMLElement {
  const heading = el('h3', { className: 'messages-head', id }, icon(mark), name, el('span', { className: 'counter' }, String(count)));
  const section = el('section', { className: `messages-section ${id}` }, heading, ...body);
  section.setAttribute('aria-labelledby', id);
  return section;
}

/** What the session said outside any step; a question still waiting shows in its own box instead. */
function sessionThreads(): HTMLElement[] {
  const waiting = new Set(waitingQuestions().map(message => message.id));
  const threads = sessionMessages()
    .filter(message => !waiting.has(message.id))
    .map(message => el('div', { className: 'thread' }, icon('message'), el('div', { className: 'thread-body' }, said(message), ...followUps(message).map(said))));
  return threads.length ? [messagesSection('from-session', 'message', 'From the session', threads.length, ...threads)] : [];
}

/** The Session messages page: files in no step, what the session said outside the steps, then notes on removed code; the export leaves out the files and notes, which lead it. */
function sessionView(stepless = true): HTMLElement {
  const title = el('h2', { className: 'step-title', id: 'session-messages' }, SESSION_PAGE);
  const about = el('p', { className: 'page-about' }, 'What the session told you outside the steps, and notes whose code was removed.');
  const body = [...(stepless ? unplacedNotice() : []), ...sessionThreads(), ...(stepless ? detachedView() : [])];
  const section = el(
    'section',
    { className: 'messages' },
    el('div', { className: 'title-row' }, title),
    ...(stepless ? [about] : []),
    ...(body.length ? body : [el('p', { className: 'muted' }, 'Nothing from the session yet.')]),
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

function preparingView(): HTMLElement {
  return el(
    'div',
    { className: 'preparing' },
    el('div', { className: 'preparing-head' }, icon('mark', 'Preparing'), el('div', {}, el('strong', {}, 'Preparing the steps'), el('span', { className: 'muted' }, 'They appear here as the session records them.'))),
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
  // A second tap while the card flies would decide twice.
  if (deck.classList.contains('flying')) return;
  swiping = true;
  deck.classList.remove('dragging');
  deck.classList.add('flying');
  moveCard(deck, to * (innerWidth + 120));
  setTimeout(() => {
    const item: Item = { type: 'step', id: step.id };
    const top = deckTop();
    // The session changed the card or its actions meanwhile, so it comes back to show what the swipe would decide now.
    if (top?.id !== step.id || top.diff !== step.diff || !builtIn(walkthrough.actions[itemKey(item)] ?? [])) {
      swiping = false;
      render();
      return;
    }
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
  const files = parseDiff(step.diff);
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
  const first = notes.find(note => note.note.finding);
  const explanation =
    step.kind === 'step'
      ? markdown(step.explanation, 'explanation')
      : el('p', { className: 'explanation' }, SKIM);
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
  card.dataset['key'] = `card:${step.id}`;
  return card;
}

/** The steps left as a deck of cards: swiping the top one decides it, and the buttons stay for anyone who doesn't swipe. */
function deckView(): HTMLElement {
  if (!walkthrough.steps.length) return preparingView();
  const section = el('section', { className: 'deck-view' });
  section.setAttribute('aria-label', 'Swipe to decide');
  const top = deckTop();
  if (!top) {
    section.append(el('p', { className: 'deck-empty' }, 'Everything is decided.'), el('a', { href: '#summary' }, 'See the summary'));
    return section;
  }
  const next = walkthrough.steps.find(step => step !== top && !stepDecided(step));
  const item: Item = { type: 'step', id: top.id };
  // Swiping right means Approve only while the step offers the built-in actions, and decides nothing while it is being checked.
  const swipes = builtIn(walkthrough.actions[itemKey(item)] ?? []) && !beingChecked(top);
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
  const hint = beingChecked(top)
    ? 'Tap to open the step.'
    : swipes
      ? 'Swipe right to approve, left to flag. Tap to open the step.'
      : "The session chose this step's actions; use the buttons. Tap to open the step.";
  section.append(deck, el('p', { className: 'swipe-hint' }, hint), ...bar);
  return section;
}

function questionBox(message: SessionMessage): HTMLElement {
  const draft = `reply:${message.id}`;
  const choices = (message.choices ?? []).map((choice, at) =>
    keyed(
      el('button', { type: 'button', className: at === 0 ? 'btn primary' : 'btn', onclick: () => void send('reply', { to: message.id, text: choice }) }, choice),
      `choice:${message.id}:${String(at)}`,
    ),
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

/** Notes and asks whose step or lines left the change, and checklist items linked to a step that is gone. */
function detached(): { gone: (Note | Ask)[]; comments: Comment[]; links: ChecklistItem[] } {
  const gone = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && !answersAsk(entry) && anchorOf(entry) === null,
  );
  const comments = commentsOf(session.conversation).filter(comment => commentAnchor(comment) === null);
  const known = new Set(walkthrough.steps.map(step => step.id));
  const links = (walkthrough.checklist?.items ?? []).filter(item => item.steps.some(id => !known.has(id)));
  return { gone, comments, links };
}

const detachedCount = () => {
  const { gone, comments, links } = detached();
  return gone.length + comments.length + links.length;
};

function detachedView(): HTMLElement[] {
  const { gone, comments, links } = detached();
  const count = gone.length + comments.length + links.length;
  if (!count) return [];
  return [
    messagesSection(
      'removed-code',
      'unlink',
      'Notes on removed code',
      count,
      el('p', { className: 'page-about' }, 'Their lines are gone from the change, so they wait here instead of being dropped.'),
      ...gone.map(entry =>
        isNote(entry) ? noteView(entry) : el('div', {}, el('p', { className: 'was' }, `Was on ${placeWas(entry)}`), ...oldLines(entry), askThread(entry)),
      ),
      ...comments.map(commentView),
      ...links.map(item => el('p', { className: 'detached-item' }, icon('unlink'), el('span', {}, `Checklist “${plain(item.text)}” linked to a step that no longer exists`))),
    ),
  ];
}

function viewBody(view: View, notices: HTMLElement[]): HTMLElement {
  switch (view.kind) {
    case 'step':
      return stepView(view.step, notices, view);
    case 'session':
      return sessionView();
    case 'checklist':
      return walkthrough.checklist ? checklistView(walkthrough.checklist, view) : summaryView();
    case 'summary':
      return summaryView();
    case 'deck':
      return deckView();
    case 'preparing':
      return preparingView();
  }
}

/** The checklist panel: the checklist, compact, and the whole walkthrough's actions, unless the main pane shows them already. */
function checklistPanel(view: View): HTMLElement[] {
  if (view.kind === 'checklist' || view.kind === 'summary') return [];
  const { checklist } = walkthrough;
  return [...(checklist ? [checklistView(checklist, view, true)] : []), ...wholeView()];
}

/** Where Previous and Next lead: the steps in order, then the Summary; from a page of its own, back to the steps. */
function neighbours(view: View): [string | null, string | null] {
  const { steps } = walkthrough;
  if (view.kind === 'step') {
    const at = steps.indexOf(view.step);
    return [steps[at - 1]?.id ?? null, steps[at + 1]?.id ?? 'summary'];
  }
  if (view.kind === 'summary') return [steps.at(-1)?.id ?? null, null];
  return [null, steps.find(step => !stepDecided(step))?.id ?? (steps.length ? 'summary' : null)];
}

/** With the queue hidden, Previous and Next walk the steps from above the title. */
function navRow(view: View): HTMLElement[] {
  if (shows('queue') || view.kind === 'preparing' || view.kind === 'deck') return [];
  const [previous, next] = neighbours(view);
  const button = (label: string, key: string, shape: IconName, to: string | null) => {
    const made = el('button', { type: 'button', className: 'icon-button', title: withKey(label, key), disabled: to === null }, icon(shape));
    made.setAttribute('aria-label', label);
    made.dataset['key'] = `nav:${shape}`;
    made.onclick = () => {
      if (to !== null) go(to);
    };
    return made;
  };
  const at = view.kind === 'step' ? [el('span', { className: 'step-number' }, `Step ${String(stepNumber(view.step.id))}`)] : [];
  const nav = el('nav', { className: 'step-nav' }, button('Previous step', 'K', 'previous', previous), ...at, button('Next step', 'J', 'next', next));
  nav.setAttribute('aria-label', 'Steps');
  return [nav];
}

const stepNotesOf = (step: Step) =>
  session.conversation.filter((entry): entry is Note => isNote(entry) && !answersAsk(entry) && anchorOf(entry) === step.id);

/** The step's findings the person has not decided yet; which notes are findings is the session's flag. */
const openFindings = (step: Step) => stepNotesOf(step).filter(note => note.note.finding && !decisionOf({ type: 'note', id: note.id }));

const pinnedAt = (one: Note | Comment): Place => ('from' in one ? one.note : one);

/** Notes or comments in the order the step shows them: those on the step first, then each file's by the line they are pinned under. */
function inPageOrder<T extends Note | Comment>(step: Step, shown: T[]): T[] {
  const files = step.diff ? [...drawDiff(step).view.querySelectorAll<HTMLElement>('.d2h-file-wrapper')].map(wrapper => wrapper.dataset['file']) : [];
  const rank = (one: T) => {
    const { file, lines } = pinnedAt(one);
    return file !== undefined && lines ? [files.indexOf(file) + 1, lines[1]] : [0, 0];
  };
  return [...shown].sort((a, b) => {
    const [fileA = 0, lineA = 0] = rank(a);
    const [fileB = 0, lineB = 0] = rank(b);
    return fileA - fileB || lineA - lineB;
  });
}

/** Opens what hides a note or comment (its collapsed or Viewed file, a folded step's diff, "N more notes"), then scrolls to it and focuses it. */
function reveal(step: Step, { file, lines }: { file?: string; lines?: Lines }, id: string, low = false): void {
  if (file !== undefined && lines) {
    // A folded step shows a noted file by default, so forgetting the person's toggles shows it.
    if (step.kind === 'folded') for (const key of [`fold:${step.id}`, `fold-diff:${step.id}:${file}`]) opened.delete(key);
    else folds.set(file, false);
  }
  if (low) opened.add(file !== undefined && lines ? `more:${step.id}:${lineKey(file, lines[1])}` : `more:${step.id}`);
  render();
  const shown = [...main.querySelectorAll<HTMLElement>(`#${CSS.escape(id)}`)].find(found => !leavingPane?.contains(found));
  if (!shown) return;
  shown.tabIndex = -1;
  shown.scrollIntoView({ block: 'center' });
  shown.focus({ preventScroll: true });
}

const revealNote = (step: Step, note: Note) => {
  reveal(step, note.note, `note-${note.id}`, note.note.low);
};

/** The note to reveal once the page has moved to its step. */
let seeking: { step: string; note: string } | null = null;

function openAtNote(step: Step, note: Note): void {
  if (decodeURIComponent(location.hash.slice(1)) === step.id) revealNote(step, note);
  else {
    seeking = { step: step.id, note: note.id };
    go(step.id);
  }
}

/** A step with open findings opens at the first of them. */
function openAtFinding(step: Step): void {
  const [first] = inPageOrder(step, openFindings(step));
  if (first) openAtNote(step, first);
  else {
    seeking = null;
    go(step.id);
  }
}

/** The open finding the action bar went to last, so the next press goes on from it. */
let lastFinding: string | null = null;

function nextFinding(step: Step, findings: Note[]): void {
  const next = findings[(findings.findIndex(note => note.id === lastFinding) + 1) % findings.length];
  if (!next) return;
  lastFinding = next.id;
  revealNote(step, next);
}

/** The step's open findings pinned after the person decided it; the step's own decision stays. */
function lateFindings(step: Step): Note[] {
  const decided = decisionOf({ type: 'step', id: step.id });
  if (!decided) return [];
  return stepNotesOf(step).filter(note => note.note.finding && note.at > decided.at && !decisionOf({ type: 'note', id: note.id }));
}

/** The findings the page has drawn, none before its first drawing. */
let seenFindings: Set<string> | null = null;
/** Findings that arrived on a step the person read or decided, named in the banner until they go to it or dismiss it. */
let arrived: string[] = [];

/** What the person did with the step, for the banner: Approve and Flag in their past tense, the session's own actions by label. */
function doneWith(step: Step): string {
  const item: Item = { type: 'step', id: step.id };
  const decision = decisionOf(item);
  if (!decision) return 'read';
  const label = labelOf(item, decision.action).toLowerCase();
  const past: Record<string, string> = { approve: 'approved', flag: 'flagged' };
  return builtIn(walkthrough.actions[itemKey(item)] ?? []) ? (past[decision.action] ?? label) : `chose ${label}`;
}

const listed = (words: string[]) => (words.length > 1 ? `${words.slice(0, -1).join(', ')} and ${words.at(-1) ?? ''}` : (words[0] ?? ''));

function dismissArrived(): void {
  arrived = [];
  const box = region('alert');
  if (box.dataset['kind'] !== 'own') return;
  box.hidden = true;
  box.replaceChildren();
  delete box.dataset['kind'];
  delete box.dataset['text'];
}

/** Raises the banner when a finding lands on a step the person read or decided; an error or offline banner goes first. */
function arrivedBanner(): void {
  if (readOnly || stopped) return;
  const findings = session.conversation.filter((entry): entry is Note => isNote(entry) && entry.note.finding === true && !answersAsk(entry));
  const seen = seenFindings;
  if (seen)
    for (const note of findings) {
      const step = walkthrough.steps.find(one => one.id === anchorOf(note));
      if (!seen.has(note.id) && step && (stepDecided(step) || walkthrough.read.includes(step.id))) arrived.push(note.id);
    }
  seenFindings = new Set(findings.map(note => note.id));
  const notes = findings.filter(note => arrived.includes(note.id));
  const steps = walkthrough.steps.filter(step => notes.some(note => anchorOf(note) === step.id));
  const box = region('alert');
  const own = box.dataset['kind'] === 'own';
  const [first] = steps;
  if (!first) {
    if (own) dismissArrived();
    return;
  }
  if (!box.hidden && !own) return;
  const text =
    notes.length === 1
      ? `New finding on step ${String(stepNumber(first.id))}, ${first.title}, which you ${doneWith(first)}.`
      : `${String(notes.length)} new findings on ${steps.length === 1 ? 'step' : 'steps'} ${listed(steps.map(step => String(stepNumber(step.id))))}.`;
  if (own && box.dataset['text'] === text) return;
  const goTo = el('button', { type: 'button', className: 'btn small' }, 'Go to step');
  goTo.onclick = () => {
    dismissArrived();
    go(first.id);
  };
  const dismiss = el('button', { type: 'button', className: 'icon-button', title: 'Dismiss' }, icon('close'));
  dismiss.setAttribute('aria-label', 'Dismiss');
  dismiss.onclick = dismissArrived;
  box.dataset['kind'] = 'own';
  box.dataset['text'] = text;
  box.className = 'banner attention';
  box.replaceChildren(icon('warn'), el('span', { className: 'banner-text' }, text), goTo, dismiss);
  box.hidden = false;
}

/** The buttons hidden windows leave on their edges; an edge with none is not drawn. */
function drawEdges(view: View, side: HTMLElement[]): void {
  // With reduced motion the edge waits for the window's contents to fade, as the width snaps rather than closes.
  const hidden = (panel: Panel) => !shows(panel) && !phone.matches && !(closing.has(panel) && reduced());
  leftEdge.replaceChildren(
    ...(hidden('queue') ? [showButton('queue', queue.querySelector('.queue-head .counter')?.textContent ?? null)] : []),
    ...(hidden('explanation') && view.kind === 'step' ? [showButton('explanation', null)] : []),
  );
  const items = walkthrough.checklist?.items ?? [];
  rightEdge.replaceChildren(...(hidden('checklist') && side.length ? [showButton('checklist', metCount(items))] : []));
  for (const edge of [leftEdge, rightEdge]) edge.hidden = !edge.hasChildNodes();
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

/** A redraw replaces the box being typed in, which would break a word an input method is still composing. */
let composing = false;
document.addEventListener('compositionstart', () => {
  composing = true;
}, true);
// Leaving the box ends a composition too, should a browser not say so.
for (const ended of ['compositionend', 'focusout'] as const)
  document.addEventListener(ended, () => {
    if (!composing) return;
    composing = false;
    if (redrawLater) render();
  }, true);

/** A step in the export: its number, title and state, then all it shows on the page but the actions. */
function exportStep(step: Step, number: number): HTMLElement {
  const title = el('span', { id: `step-${step.id}` }, step.title);
  const { prose, code } = stepBody(step);
  // Its id is the step's own address, so a link to a step scrolls to it.
  const section = el(
    'section',
    { className: 'export-step', id: step.id },
    el('h2', { className: 'export-title' }, el('span', { className: 'number' }, String(number)), title, stateTag({ type: 'step', id: step.id }, true)),
    ...prose,
    ...code,
    ...stepAsks(step),
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

/** The export is one document: every step in order, then the checklist, the session's messages and the whole walkthrough. */
function exportView(at: string): HTMLElement[] {
  const { steps } = walkthrough;
  const when = new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const decided = steps.filter(stepDecided).length;
  return [
    el(
      'header',
      { className: 'export-head' },
      el('span', { className: 'logo' }, icon('mark'), 'Walkthrough'),
      el('h1', {}, nameOf(walkthrough)),
      el('p', { className: 'muted' }, `Walkthrough export · ${when} · ${plural(steps.length, 'step')}, ${String(decided)} decided`),
      ...(verdictLabel() === null ? [el('p', { className: 'muted' }, 'No verdict yet')] : verdictStatus()),
    ),
    ...unplacedNotice(),
    ...detachedView(),
    ...steps.map((step, index) => exportStep(step, index + 1)),
    ...(walkthrough.checklist ? [checklistView(walkthrough.checklist, { kind: 'summary' })] : []),
    ...(sessionMessages().length ? [sessionView(false)] : []),
    ...wholeView(),
  ];
}

function render(): void {
  if (exported) {
    main.replaceChildren(...exportView(exported.at));
    return;
  }
  // A redraw would swap a pressed control, a dragged card or a composing box out from under the person, so it waits.
  if (pressed || swiping || composing) {
    redrawLater = true;
    return;
  }
  redrawLater = false;
  const view = currentView();
  if (view.kind === 'step') markRead(view.step);
  lastSession = JSON.stringify(session);
  lastWalkthrough = JSON.stringify(walkthrough);
  // Redrawn whole, so the box being typed in gets its focus and caret back.
  const focused = document.activeElement;
  const typing = focused instanceof HTMLTextAreaElement || focused instanceof HTMLInputElement ? focused : null;
  const draft = typing?.dataset['draft'];
  const caret = [typing?.selectionStart ?? 0, typing?.selectionEnd ?? 0] as const;
  document.body.dataset['view'] = view.kind;
  // Emptying a pane to redraw it scrolls it back to the top in WebKit, so each pane is put back where it was.
  const panes = [queue, main, prosePane, codePane, side];
  const scrolled = panes.map(pane => pane.scrollTop);
  // A kept diff leaves the page while its step is redrawn, which loses how far it was scrolled sideways.
  const sideways = [...document.querySelectorAll<HTMLElement>('.d2h-file-diff, .preview, .preview pre')]
    .filter(box => box.scrollLeft > 0)
    .map(box => [box, box.scrollLeft] as const);
  const before = drawnState;
  const decided = new Set(Object.keys(walkthrough.decided).filter(key => walkthrough.decided[key]));
  const newly = before ? [...decided].filter(key => !before.decided.has(key)) : [];
  const decisionsMoved = newly.length > 0 || [...(before?.decided ?? [])].some(key => !decided.has(key));
  const shownView = viewKey(view);
  const swapped = before !== null && before.view !== shownView;
  const rows = [...queue.querySelectorAll<HTMLElement>(':scope > .queue-item[data-key]')].map((row): LeavingRow => {
    const { paddingTop, paddingBottom } = getComputedStyle(row);
    return { row, key: row.dataset['key'] ?? '', height: row.offsetHeight, paddingTop, paddingBottom, rect: row.getBoundingClientRect() };
  });
  const wasSplit = main.contains(splitStep);
  // The split step's panes stay for the next step, so what leaves is their content, moved into panes of its own.
  const oldPane = !swapped
    ? []
    : wasSplit
      ? [el('section', { className: 'step split' }, el('div', { className: 'prose' }, ...prosePane.childNodes), el('div', { className: 'code' }, ...codePane.childNodes))]
      : [...main.childNodes].filter(node => node !== leavingPane);
  const verdictWas: VerdictWas | null = verdictSlot.isConnected
    ? { label: verdictText.textContent, width: verdictSlot.getBoundingClientRect().width }
    : null;
  drawHeader(newly.some(key => key.startsWith('step:')));
  arrivedBanner();
  // Drawn while hidden too, as its edge button counts what it holds.
  queue.replaceChildren(...queueView(view));
  queue.hidden = !painted('queue');
  const notices = [...waitingQuestions().map(questionBox), ...goneNotice()];
  const explaining = shows('explanation') && view.kind === 'step';
  main.classList.toggle('split', explaining);
  const shown = [...(explaining ? [] : [...navRow(view), ...notices]), viewBody(view, notices)];
  const present = [...main.children].filter(child => child !== leavingPane);
  // Putting the explanation column's step back would lose where its panes were scrolled.
  if (shown.length !== present.length || shown.some((part, at) => present[at] !== part)) main.replaceChildren(...shown);
  const beside = checklistPanel(view);
  side.replaceChildren(...(painted('checklist') && beside.length ? [panelHead('checklist', el('span', {}, PANEL.checklist.title)), ...beside] : []));
  side.hidden = !side.hasChildNodes();
  // A window on its way to its edge is a picture of what was.
  for (const [panel, box] of [['queue', queue], ['checklist', side]] as const) {
    box.inert = closing.has(panel);
    if (closing.has(panel)) box.setAttribute('aria-hidden', 'true');
    else box.removeAttribute('aria-hidden');
    for (const part of box.children) (part as HTMLElement).dataset['motion'] ??= `panel:${panel}`;
  }
  drawEdges(view, beside);
  panes.forEach((pane, at) => {
    pane.scrollTop = scrolled[at] ?? 0;
  });
  for (const [box, left] of sideways) box.scrollLeft = left;
  markTopFile();
  for (const part of shown) part.dataset['motion'] = 'pane-enter';
  leaveRows(rows, newly);
  if (swapped) swapPanes(oldPane, wasSplit, scrolled.slice(1, 4));
  else if (leavingPane) main.prepend(leavingPane);
  const counts = new Map(
    [...document.querySelectorAll<HTMLElement>('[data-motion^="count:"]')].map(count => [count.dataset['motion'] ?? '', count.textContent]),
  );
  if (decisionsMoved) moveDecided(counts, before?.counts);
  const state = stopped ? 'stopped' : session.state;
  if (state === 'needs-you' && before?.state !== 'needs-you' && !reduced())
    play('pulse', 'pulse', [{ boxShadow: '0 0 0 0 currentColor' }, { boxShadow: '0 0 0 6px transparent' }], { ms: 1200, curve: 'ease-out', iterations: 2 });
  drawnState = { decided, view: shownView, state, counts };
  replay();
  const verdict = verdictLabel();
  if (before && verdict !== null && verdict !== (verdictWas?.label ?? null)) dockVerdict(verdictWas);
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

/** A rail row that left because its item was decided, kept in place while it collapses, and the chip that carries it to "N decided". */
type Ghost = { row: HTMLElement; key: string; after: string[]; chip: HTMLElement | null };
const ghosts = new Set<Ghost>();

function dropGhost(ghost: Ghost): void {
  ghosts.delete(ghost);
  ghost.row.remove();
  ghost.chip?.remove();
}

type LeavingRow = { row: HTMLElement; key: string; height: number; paddingTop: string; paddingBottom: string; rect: DOMRect };

const itemOfRow = (key: string) => {
  const address = key.slice('row:'.length);
  const item = CHECKLIST_ITEM.exec(address)?.[1];
  return item === undefined ? `step:${address}` : `checklist:${item}`;
};

/** A decided row hides and the rows below close up, while a chip of it lifts off and travels into "N decided" at the rail's foot. */
function leaveRows(rows: LeavingRow[], newly: string[]): void {
  const flying = !reduced() && shows('queue') && !phone.matches;
  const chips: { chip: HTMLElement; rect: DOMRect }[] = [];
  rows.forEach(({ row, key, height, paddingTop, paddingBottom, rect }, at) => {
    if (!newly.includes(itemOfRow(key)) || queue.querySelector(`:scope > [data-key="${CSS.escape(key)}"]`)) return;
    for (const older of ghosts) if (older.key === key) dropGhost(older);
    const chip = flying ? (row.cloneNode(true) as HTMLElement) : null;
    row.classList.add('leaving');
    row.removeAttribute('aria-current');
    row.setAttribute('aria-hidden', 'true');
    row.inert = true;
    delete row.dataset['key'];
    delete row.dataset['motion'];
    const ghost: Ghost = { row, key, after: rows.slice(at + 1).map(one => one.key), chip };
    ghosts.add(ghost);
    // The row is the same element however often the rail is redrawn, so what plays on it goes on; its end takes it away.
    const fade = [{ opacity: 1 }, { opacity: 0 }];
    const hides = animate(row, 'row-fade', fade, { ms: reduced() ? 'base' : 60, curve: 'linear', fill: 'forwards' });
    const collapse = [
      { height: `${String(height)}px`, paddingTop, paddingBottom, marginBottom: '0px' },
      // The rail's 2px gap goes with the row.
      { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginBottom: '-2px' },
    ];
    const ends = reduced() ? hides : animate(row, 'row-collapse', collapse, { ms: 'slow', curve: 'ease-out', delay: 120, fill: 'both' });
    ends.finished.then(() => {
      if (ghosts.has(ghost)) dropGhost(ghost);
    }, () => {});
    if (chip) chips.push({ chip, rect });
  });
  placeGhosts();
  const target = queue.querySelector<HTMLElement>('.decided-toggle');
  if (!target || !chips.length) return;
  const to = target.getBoundingClientRect();
  for (const { chip, rect } of chips) {
    chip.className = 'queue-item queue-chip';
    for (const name of ['href', 'data-key', 'aria-current', 'title']) chip.removeAttribute(name);
    chip.setAttribute('aria-hidden', 'true');
    chip.inert = true;
    for (const [side, px] of [['left', rect.left], ['top', rect.top], ['width', rect.width]] as const) chip.style.setProperty(side, `${String(px)}px`);
    document.body.append(chip);
    const dy = to.top + to.height / 2 - (rect.top + rect.height / 2);
    animate(chip, 'chip-travel', [{ transform: 'none' }, { transform: `translateY(${String(dy)}px) scale(0.92)` }], { ms: 'slow', curve: 'ease-out', fill: 'forwards' });
    const out = animate(chip, 'chip-fade', [{ opacity: 1 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }], { ms: 'slow', curve: 'linear', fill: 'forwards' });
    out.finished.then(() => { chip.remove(); }, () => {});
  }
  play('flash:decided', 'decided-flash', [{ backgroundColor: 'var(--surface-tint)' }, { backgroundColor: 'transparent' }], { ms: 'base', curve: 'linear', delay: 240 });
}

function placeGhosts(): void {
  // A row back in the rail, its decision taken back, needs no picture of it leaving.
  for (const ghost of ghosts) if (queue.querySelector(`:scope > [data-key="${CSS.escape(ghost.key)}"]`)) dropGhost(ghost);
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
  main.scrollTo(0, 0);
  main.prepend(pane);
  [shown, ...shown.querySelectorAll(':scope > .step > .prose, :scope > .step > .code')].forEach((scroller, at) => {
    scroller.scrollTop = scrolled[at] ?? 0;
  });
  leavingPane = pane;
  // The leaving pane is one element a redraw puts back, so what plays on it goes on, and its end takes it away.
  const gone = animate(pane, 'pane-leave', [{ opacity: 1 }, { opacity: 0 }], { ms: 100, curve: 'linear', fill: 'forwards' });
  if (!reduced()) animate(pane, 'pane-out', [{ transform: 'none' }, { transform: 'translateX(-12px)' }], { ms: 100, curve: 'ease-in', fill: 'forwards' });
  const enter = [{ opacity: 0, transform: 'translateX(12px)' }, { opacity: 1, transform: 'none' }];
  play('pane-enter', 'pane-enter', reduced() ? FADE_IN : enter, { ms: 'base', curve: reduced() ? 'linear' : 'ease-out', delay: 100 });
  gone.finished.then(() => {
    if (leavingPane !== pane) return;
    pane.remove();
    leavingPane = null;
  }, () => {});
}

/** Every count that changed ticks; "N decided" takes its new count as the chip lands. */
function moveDecided(counts: Map<string, string>, before = new Map<string, string>()): void {
  const tick = [{ opacity: 0.55, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }];
  const lands = [{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }];
  for (const [key, text] of counts) {
    if (before.get(key) === text) continue;
    if (reduced()) play(key, 'tick', [{ opacity: 0.55 }, { opacity: 1 }], { ms: 'base', curve: 'linear' });
    else if (key === 'count:decided') play(key, 'count-land', lands, { ms: 'base', curve: 'ease-out', delay: 240 });
    else play(key, 'tick', tick, { ms: 'base', curve: 'ease-out' });
  }
}

/** V marks the file the keyboard is in, or else the step's first file not viewed yet. */
function viewedByKey(step: Step, target: EventTarget | null): void {
  const files = [...main.querySelectorAll<HTMLElement>('.d2h-file-wrapper')].filter(file => !file.hidden && !leavingPane?.contains(file));
  const within = target instanceof Element ? target.closest<HTMLElement>('.d2h-file-wrapper') : null;
  const file = within && files.includes(within) ? within : files.find(one => !walkthrough.viewed.includes(one.dataset['file'] ?? ''));
  if (file) void markViewed(step, file.dataset['file'] ?? '');
}

/** j and k walk the steps, and past the last one to the Summary. */
function stepBy(delta: number): void {
  const view = currentView();
  if (view.kind !== 'step' && view.kind !== 'summary') return;
  const to = neighbours(view)[delta > 0 ? 1 : 0];
  if (to) go(to);
}

if (exported) {
  document.body.classList.add('exported');
  header.remove();
  queue.remove();
  main.className = 'export';
  document.title = `${nameOf(exported.walkthrough)} · Walkthrough`;
}

if (exported?.viewer) {
  showViewer(exported.viewer);
  Object.assign(panels, exported.viewer.panels);
} else if (!exported) Object.assign(panels, (await loadViewer())?.panels);

({ walkthrough, session } = exported
  ? exported
  : await Promise.all(
      ['data/walkthrough.json', 'data/session.json'].map(async data => (await fetch(data)).json() as Promise<unknown>),
    ).then(([shownWalkthrough, shownSession]) => ({
      walkthrough: shownWalkthrough as WalkthroughView,
      session: shownSession as SessionView,
    })));
render();
// The browser looked for the address before the export drew its steps.
if (readOnly && location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

// Wired once the page is drawn, so nothing acts on a walkthrough not loaded yet.
document.addEventListener('keydown', event => {
  if (readOnly || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape' && picked) {
    cancelPick();
    return;
  }
  if (runShortcut(event) || isTyping(event.target) || document.querySelector('dialog[open]')) return;
  // Inside what scrolls sideways the arrows scroll it, so long lines stay reachable from the keyboard.
  const sideways = event.target instanceof Element && event.target.closest('.d2h-file-diff, pre, .preview, .menu, dialog') !== null;
  if (event.key === 'ArrowRight' && !sideways) stepBy(1);
  else if (event.key === 'ArrowLeft' && !sideways) stepBy(-1);
});

/** Takes the open step's action `id`, while the step is undecided or its decision is being changed. */
function takeStepAction(id: string): void {
  const step = currentStep();
  if (!step || readOnly || stopped) return;
  const item: Item = { type: 'step', id: step.id };
  const key = itemKey(item);
  const action = walkthrough.actions[key]?.find(one => one.id === id);
  if (action && !beingChecked(step) && (!stepDecided(step) || changing.has(key))) take(item, action);
}

/** Where the focus goes back to once a popover closes: the control that had it, or the one a redraw put in its place. */
function focusNow(): () => Element | null {
  const had = document.activeElement;
  const key = had instanceof HTMLElement ? had.dataset['key'] : undefined;
  return () => (had?.isConnected ? had : key === undefined ? null : document.querySelector(`[data-key="${CSS.escape(key)}"]`));
}

bind('j', () => { stepBy(1); });
bind('k', () => { stepBy(-1); });
bind('a', () => { takeStepAction('approve'); });
bind('f', () => { takeStepAction('flag'); });
bind('/', () => {
  const step = currentStep();
  if (step) document.querySelector<HTMLElement>(`[data-draft="${CSS.escape(`ask:${step.id}`)}"]`)?.focus();
});
bind('v', event => {
  const step = currentStep();
  if (step) viewedByKey(step, event.target);
});
bind('c', event => {
  const step = currentStep();
  const at = lineAt(event);
  if (picked?.ended && picked.mode === 'choose') choosePicked('comment');
  else if (step && at) startComment(step, at.file, at.line);
});
bind('g s', () => {
  if (walkthrough.steps.length) go('summary');
});
bind('?', () => {
  helpSheet(focusNow());
});
PANELS.forEach((panel, at) => {
  bind(String(at + 1), () => {
    togglePanel(panel);
  });
});

phone.addEventListener('change', render);
codePane.addEventListener('scroll', markTopFile, { passive: true });

window.addEventListener('hashchange', () => {
  // The export is one document the browser scrolls to the address itself.
  if (readOnly) return;
  moves++;
  taking = null;
  flung = null;
  render();
  main.scrollTo(0, 0);
  prosePane.scrollTop = 0;
  codePane.scrollTop = 0;
  const view = currentView();
  if (view.kind === 'checklist' && view.item !== undefined) document.getElementById(`checklist-item-${view.item}`)?.scrollIntoView({ block: 'nearest' });
  const sought = seeking;
  seeking = null;
  const note = view.kind === 'step' && view.step.id === sought?.step ? session.conversation.filter(isNote).find(one => one.id === sought.note) : undefined;
  if (note && view.kind === 'step') revealNote(view.step, note);
});

const POLL_MS = 1500;
let polling = false;
/** The version of the walkthrough the page last took from a poll, which the server answers with no body while it holds. */
let walkthroughTag = '';
const fetchText = async (data: string, tag = '') => {
  const answer = await fetch(data, tag ? { headers: { 'if-none-match': tag } } : {});
  if (answer.status === 304) return { text: null, tag };
  if (!answer.ok) throw new Error(`${data}: ${String(answer.status)}`);
  return { text: await answer.text(), tag: answer.headers.get('etag') ?? '' };
};

// The session records and answers through the CLI, so the page asks for the walkthrough and the session again and again.
function poll(): void {
  if (polling || stopped) return;
  polling = true;
  const since = posted;
  Promise.all([fetchText('data/walkthrough.json', walkthroughTag), fetchText('data/session.json')])
    .then(([fresh, { text: sessionText }]) => {
      if (document.body.classList.contains('unreachable')) showAlert(null);
      if (since !== posted) return;
      walkthroughTag = fresh.tag;
      const walkthroughText = fresh.text ?? lastWalkthrough;
      if (walkthroughText === lastWalkthrough && sessionText === lastSession) return;
      walkthrough = JSON.parse(walkthroughText) as WalkthroughView;
      session = JSON.parse(sessionText ?? lastSession) as SessionView;
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
