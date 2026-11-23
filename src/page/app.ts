import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { ColorSchemeType } from 'diff2html/lib-esm/types';
import type { Lines, NoteMark, Place } from '../notes';
import { previewType } from '../preview';
import type { Decision, WalkthroughView } from '../decisions';
import type { Entry, PageRequest, SessionMessage, SessionState, SessionView } from '../session';
import { type Action, type Item, itemKey, nameOf } from '../items';
import type { Checklist, ChecklistItem, Step } from '../walkthrough';
import { plural } from '../words';
import { el, type PageName, post as postTo, region, showAlert, showUnreachable } from './dom';
import { icon, type IconName } from './icons';
import { renderMarkdown } from './markdown';

/** The state an exported file carries; it shows the walkthrough as it was, with nothing to send to. */
const exported = document.getElementById('exported')?.textContent;
const readOnly = exported !== undefined;

function markdown(text: string, className: string): HTMLElement {
  const box = document.createElement('div');
  box.className = `markdown ${className}`;
  box.innerHTML = renderMarkdown(text);
  return box;
}

/** Session Markdown as one line of plain text, for a rail row or a mention. */
const plain = (text: string) => markdown(text, '').textContent.replace(/\s+/g, ' ').trim();

const header = region('header');
const queue = region('queue');
const main = region('main');

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
  const answer = await post('decide', { item, action, ...fields });
  if (!answer) return;
  ({ walkthrough, session } = (await answer.json()) as { walkthrough: WalkthroughView; session: SessionView });
  for (const field of ['note', 'text']) drafts.delete(`decide:${itemKey(item)}:${action}:${field}`);
  taking = null;
  changing.delete(itemKey(item));
  render();
  // Moving on is only for the person still on the step they decided.
  if (item.type !== 'step' || moves !== before) return;
  const { steps } = walkthrough;
  const at = steps.findIndex(one => one.id === item.id);
  const next = [...steps.slice(at + 1), ...steps.slice(0, at)].find(one => !stepDecided(one));
  go(next ? next.id : 'end');
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
  const current = currentStep();
  const said = steps.length
    ? `${String(decided)} of ${plural(steps.length, 'step')} decided, ${String(steps.length - decided)} left, ${String(walkthrough.read.length)} read`
    : 'No steps yet';
  const bar = el(
    'div',
    { className: 'progress', title: said },
    ...steps.map(step => {
      const segment = el('span', { className: 'segment' });
      segment.dataset['state'] = segmentState(step, current);
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
  return [bar, count];
}

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
            statusView(),
            ...(stopped ? [] : [el('button', { type: 'button', className: 'btn small', onclick: () => void stop() }, 'Stop')]),
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
      el('button', { type: 'button', className: 'btn ghost', onclick: () => { taking = null; render(); } }, 'Cancel'),
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
  return view;
}

function notesView(notes: Note[], place: string): HTMLElement[] {
  const views = notes.filter(note => !note.note.low).map(noteView);
  const low = notes.filter(note => note.note.low);
  if (!low.length) return views;
  const more = el('details', { className: 'more', open: opened.has(place) }, el('summary', {}, `${String(low.length)} more`));
  more.append(...low.map(noteView));
  more.ontoggle = () => {
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

function disclosure(label: (Node | string)[], open: boolean, onToggle: () => void, className: string): HTMLButtonElement {
  const button = el('button', { type: 'button', className }, icon(open ? 'chevron-down' : 'chevron-right'), ...label);
  button.setAttribute('aria-expanded', String(open));
  button.onclick = onToggle;
  return button;
}

function assumedView(step: Step & { kind: 'step' }): HTMLElement[] {
  if (!step.assumptions.length) return [];
  const open = !closed.has(step.id);
  const button = disclosure(['Assumed, not read'], open, () => { toggle(closed, step.id); }, 'disclosure assumed-toggle');
  button.id = `assumed-${step.id}`;
  const list = el('ul', { className: 'assumed', hidden: !open }, ...step.assumptions.map(assumption => el('li', {}, assumption)));
  list.setAttribute('aria-labelledby', button.id);
  button.setAttribute('aria-controls', (list.id = `assumed-list-${step.id}`));
  return [el('div', { className: 'assumptions' }, button, list)];
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

function stepBody(step: Step): HTMLElement[] {
  const pinned = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && !answersAsk(entry) && anchorOf(entry) === step.id,
  );
  const stepNotes = pinned.filter(isNote).filter(note => !note.note.lines);
  const notes = stepNotes.length ? [el('div', { className: 'step-notes' }, ...notesView(stepNotes, `more:${step.id}`))] : [];
  switch (step.kind) {
    case 'step':
      return [markdown(step.explanation, 'explanation'), ...assumedView(step), ...notes, el('div', { className: 'block' }, diffView(step, pinned))];
    case 'folded':
      return [el('p', { className: 'explanation' }, 'Folded by the session, not shown line by line.'), ...notes, ...foldedView(step, pinned)];
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

/** The sticky bar at the foot of a step: its actions, or the form an action asks for, and the Ask box. */
function actionBar(step: Step): HTMLElement[] {
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
  return [el('div', { className: 'action-bar' }, el('div', { className: 'action-row' }, decided ? change : actionGroup(item, stepLook), ask))];
}

function stepView(step: Step): HTMLElement {
  const title = el('h2', { className: 'step-title', id: `step-${step.id}` }, step.title);
  const asks = session.conversation.filter(isAsk).filter(asked => anchorOf(asked) === step.id && !asked.lines);
  const section = el(
    'section',
    { className: 'step' },
    el('div', { className: 'title-row' }, title, stateTag({ type: 'step', id: step.id }, false)),
    ...stepDecisionView(step),
    ...stepBody(step),
    ...(asks.length ? [el('div', { className: 'conversation' }, ...asks.map(askThread))] : []),
    ...actionBar(step),
  );
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

const MARK_ICON = { met: 'met', partly: 'partly', 'not-met': 'not-met', unchecked: 'unchecked' } as const satisfies Record<string, IconName>;

function queueView(view: View): HTMLElement[] {
  const { steps } = walkthrough;
  const current = view.kind === 'step' ? view.step : undefined;
  const rows = steps.filter(step => !stepDecided(step)).map(step => stepRow(step, step === current));
  const messages = sessionMessages().length;
  const unplaced = walkthrough.unplaced?.length ?? 0;
  if (messages || unplaced) {
    const sub = [...(messages ? [plural(messages, 'message')] : []), ...(unplaced ? [`${plural(unplaced, 'file')} not in a step`] : [])];
    rows.push(queueRow('session', 'message', 'message', 'From the session', { text: sub.join(', ') }, view.kind === 'session' && 'page'));
  }
  for (const item of leftItems()) {
    const at = view.kind === 'checklist' && view.item === item.id;
    rows.push(queueRow(`checklist-${item.id}`, item.mark ?? 'unchecked', MARK_ICON[item.mark ?? 'unchecked'], plain(item.text), { text: 'Checklist' }, at && 'page'));
  }
  const counted = steps.length > 0 || rows.length > 0;
  const head = el('h2', { className: 'queue-head', id: 'queue-head' }, 'Left', ...(counted ? [el('span', { className: 'counter' }, String(rows.length))] : []));
  const empty = rows.length ? [] : [el('p', { className: 'queue-empty' }, steps.length ? 'Everything is decided.' : 'No steps yet')];
  const decided = steps.filter(stepDecided);
  const open = opened.has('decided') || (current !== undefined && decided.includes(current));
  const toggleDecided = el(
    'button',
    { type: 'button', className: 'decided-toggle', onclick: () => { toggle(opened, 'decided'); } },
    icon('decided'),
    el('span', {}, `${String(decided.length)} decided`),
    icon(open ? 'chevron-down' : 'chevron-right'),
  );
  toggleDecided.setAttribute('aria-expanded', String(open));
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
  return [head, ...rows, ...empty, ...foot];
}

const stepNumber = (id: string) => walkthrough.steps.findIndex(step => step.id === id) + 1;

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
      icon(MARK_ICON[mark]),
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
  // Counted only when the session marks items, since a status alone says nothing the page can count.
  if (items.some(item => item.mark !== undefined))
    head.append(el('span', { className: 'counter' }, `${String(items.filter(item => item.mark === 'met').length)}/${String(items.length)}`));
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

function sessionView(): HTMLElement {
  const title = el('h2', { className: 'step-title', id: 'from-session' }, 'From the session');
  const waiting = new Set(waitingQuestions().map(message => message.id));
  const threads = sessionMessages()
    .filter(message => !waiting.has(message.id))
    .map(message => el('div', { className: 'thread' }, said(message), ...followUps(message).map(said)));
  const section = el(
    'section',
    { className: 'messages' },
    el('div', { className: 'title-row' }, title),
    ...(threads.length ? threads : [el('p', { className: 'muted' }, 'Nothing from the session yet.')]),
  );
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

function viewBody(view: View): HTMLElement {
  switch (view.kind) {
    case 'step':
      return stepView(view.step);
    case 'session':
      return sessionView();
    case 'checklist':
      return walkthrough.checklist ? checklistView(walkthrough.checklist, view) : endView();
    case 'end':
      return endView();
    case 'preparing':
      return preparingView();
  }
}

function render(): void {
  lastSession = JSON.stringify(session);
  lastWalkthrough = JSON.stringify(walkthrough);
  // Redrawn whole, so the box being typed in gets its focus and caret back.
  const focused = document.activeElement;
  const typing = focused instanceof HTMLTextAreaElement || focused instanceof HTMLInputElement ? focused : null;
  const draft = typing?.dataset['draft'];
  const caret = [typing?.selectionStart ?? 0, typing?.selectionEnd ?? 0] as const;
  const view = currentView();
  header.replaceChildren(...headerView());
  queue.replaceChildren(...queueView(view));
  main.replaceChildren(
    ...waitingQuestions().map(questionBox),
    ...goneNotice(),
    ...unplacedNotice(),
    ...detachedView(),
    viewBody(view),
  );
  if (view.kind === 'step') void markRead(view.step);
  // A diff is kept across redraws, so a line number focused in it is still there to focus again.
  if (focused instanceof HTMLElement && focused.isConnected && document.activeElement !== focused) focused.focus();
  if (draft === undefined) return;
  const box = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(`[data-draft="${CSS.escape(draft)}"]`);
  box?.focus();
  box?.setSelectionRange(...caret);
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/** j and k walk the steps, and past the last one to the end of the walkthrough. */
function stepBy(delta: number): void {
  const { steps } = walkthrough;
  const view = currentView();
  if (view.kind === 'end' && delta < 0) {
    const last = steps.at(-1);
    if (last) go(last.id);
    return;
  }
  if (view.kind !== 'step') return;
  const next = steps[steps.indexOf(view.step) + delta];
  if (next) go(next.id);
  else if (delta > 0) go('end');
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

window.addEventListener('hashchange', () => {
  moves++;
  taking = null;
  render();
  main.scrollTo(0, 0);
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
