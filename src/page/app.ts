import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { ColorSchemeType } from 'diff2html/lib-esm/types';
import type { Lines, NoteMark, Place } from '../notes';
import type { Entry, PageRequest, SessionMessage, SessionState, SessionView } from '../session';
import type { Checklist, Decision, Step, Walkthrough } from '../walkthrough';
import { markdown } from './markdown';

const token = location.pathname.split('/')[2] ?? '';

function region(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) throw new Error(`the page has no #${id}`);
  return found;
}
const header = region('header');
const alertBox = region('alert');
const main = region('main');

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

function showAlert(message: string | null): void {
  alertBox.textContent = message;
  alertBox.hidden = message === null;
}

/** Counts what the page sent, so a poll answered from before it is not drawn over its result. */
let posted = 0;

/** The server's answer, or null once the person has been told why there is none. */
async function post(route: string, body: unknown): Promise<Response | null> {
  posted++;
  try {
    const answer = await fetch(`/${route}?token=${token}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    showAlert(answer.ok ? null : `The walkthrough could not do that (${String(answer.status)}).`);
    return answer.ok ? answer : null;
  } catch {
    showAlert('Could not reach the walkthrough. Run /walkthrough again to reopen it.');
    return null;
  }
}

const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

let walkthrough: Walkthrough;
let session: SessionView;
/** What the person typed and has not sent, by box, so a redraw keeps it. */
const drafts = new Map<string, string>();

/** The step named in the address, else the first undecided one. */
function currentStep({ steps }: Walkthrough): Step | undefined {
  const named = decodeURIComponent(location.hash.slice(1));
  return steps.find(step => step.id === named) ?? steps.find(step => !step.decision) ?? steps[0];
}

/** Each step is its own address, so the browser's back and forward move between steps too. */
function show(step: Step | undefined): void {
  if (!step) return;
  location.hash = encodeURIComponent(step.id);
}

async function decide(step: Step, decision: Decision): Promise<void> {
  const answer = await post('decide', { step: step.id, decision });
  if (!answer) return;
  walkthrough = (await answer.json()) as Walkthrough;
  render();
  const at = walkthrough.steps.findIndex(one => one.id === step.id);
  show([...walkthrough.steps.slice(at + 1), ...walkthrough.steps.slice(0, at)].find(one => !one.decision));
}

/** Sends what the person typed in the box `draft`; it is kept when the walkthrough could not take it. */
async function send(route: 'ask' | 'reply', draft: string, body: Record<string, unknown>): Promise<boolean> {
  const answer = await post(route, { ...body, text: drafts.get(draft) ?? '' });
  if (!answer) return false;
  drafts.delete(draft);
  session = (await answer.json()) as SessionView;
  render();
  return true;
}

let lastSession = '';
let lastWalkthrough = '';

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  header.replaceChildren(el('h1', {}, 'Walkthrough'));
  main.replaceChildren(el('p', { className: 'notice' }, 'The walkthrough has stopped. You can close this tab.'));
}

const SESSION: Record<SessionState, readonly [string, string]> = {
  listening: ['Listening', 'The session is listening: what you ask reaches it right away.'],
  working: ['Working', 'The session is working on what you sent; what you send now waits for it.'],
  'needs-you': ['Needs you', 'The session asked you something; reply to it below.'],
  quiet: ['Quiet', 'No session is listening. What you send waits until one does; run /walkthrough in Claude Code.'],
};

function sessionChip(): HTMLElement {
  const [label, about] = SESSION[session.state];
  const chip = el('span', { className: 'chip', title: about }, label);
  chip.dataset['state'] = session.state;
  chip.setAttribute('role', 'status');
  chip.setAttribute('aria-label', 'Session');
  return chip;
}

/** A box the person types into, with its draft kept across redraws, and the button that sends it. */
function draftBox(draft: string, label: string, action: string, onSend: () => void): HTMLFormElement {
  const box = el('textarea', { rows: 2, value: drafts.get(draft) ?? '', placeholder: label });
  box.dataset['draft'] = draft;
  box.setAttribute('aria-label', label);
  box.oninput = () => drafts.set(draft, box.value);
  const form = el('form', { className: 'draft' }, box, el('button', { type: 'submit' }, action));
  form.onsubmit = event => {
    event.preventDefault();
    onSend();
  };
  return form;
}

/** The person's words as they typed them; the session's as Markdown. */
const said = (entry: Entry) =>
  entry.from === 'session' ? markdown(entry.text, 'said session') : el('p', { className: 'said person' }, entry.text);

/** What followed `root`: replies to it, answers to those, and so on, in the order they came. */
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

function askThread(asked: Ask): HTMLElement {
  const answers = followUps(asked);
  return el(
    'div',
    { className: 'thread' },
    said(asked),
    ...(answers.length ? answers.map(said) : [el('p', { className: 'notice' }, 'Waiting for the session to answer.')]),
  );
}

const linesLabel = ([first, last]: Lines) =>
  first === last ? `Line ${String(first)}` : `Lines ${String(first)}-${String(last)}`;

function noteView(note: Note): HTMLElement {
  const { label, lines } = note.note;
  const draft = `reply:${note.id}`;
  const view = el(
    'article',
    { className: 'note' },
    el(
      'p',
      { className: 'note-head' },
      el('span', { className: 'label' }, label),
      ...(lines ? [el('span', { className: 'lines' }, linesLabel(lines))] : []),
    ),
    markdown(note.text, 'note-text'),
    ...followUps(note).map(said),
    draftBox(draft, 'Reply', 'Reply', () => void send('reply', draft, { to: note.id })),
  );
  view.setAttribute('aria-label', label);
  return view;
}

/** Notes in the order pinned, the low-priority ones behind a count the person opens; `place` keeps it open across redraws. */
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

function askView(step: Step): HTMLElement {
  const asks = session.conversation.filter(isAsk).filter(asked => asked.step === step.id && !asked.lines);
  const draft = `ask:${step.id}`;
  return el(
    'div',
    { className: 'conversation' },
    ...asks.map(askThread),
    draftBox(draft, 'Ask about this step', 'Ask', () => void send('ask', draft, { step: step.id })),
  );
}

/** The lines the person picked to ask about; `from` is the line picked first. */
let picked: { step: string; file: string; from: number; lines: Lines } | null = null;

/** A click on a line number picks that line; with Shift, the lines from the one picked before. */
function pickLine(step: Step, event: MouseEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest<HTMLTableRowElement>('tr[data-line]');
  const file = row?.dataset['file'];
  if (!row || file === undefined || !target?.closest('.d2h-code-linenumber')) return;
  const line = Number(row.dataset['line']);
  const from = event.shiftKey && picked?.step === step.id && picked.file === file ? picked.from : line;
  picked = { step: step.id, file, from, lines: [Math.min(from, line), Math.max(from, line)] };
  render();
  document.querySelector<HTMLTextAreaElement>('.picked-ask textarea')?.focus();
}

function unpick(): void {
  picked = null;
  render();
}

function pickedAsk(step: Step, file: string, lines: Lines): HTMLElement {
  const draft = `ask:${step.id}:${file}:${lines.join('-')}`;
  const form = draftBox(draft, `Ask about ${file} ${linesLabel(lines).toLowerCase()}`, 'Ask', () => {
    void send('ask', draft, { step: step.id, file, lines }).then(sent => {
      if (sent) unpick();
    });
  });
  form.append(el('button', { type: 'button', className: 'quiet', onclick: unpick }, 'Cancel'));
  form.classList.add('picked-ask');
  return form;
}

/** What the session said that answers no ask: its notes, and its questions with the person's replies. */
function sessionMessages(): HTMLElement[] {
  const messages = session.conversation.filter(
    (entry): entry is SessionMessage => entry.from === 'session' && !entry.answer && !entry.note,
  );
  if (!messages.length) return [];
  const threads = messages.map(message => {
    const replies = session.conversation.filter(
      entry => entry.from === 'page' && entry.kind === 'reply' && entry.to === message.id,
    );
    const draft = `reply:${message.id}`;
    return el(
      'div',
      { className: 'thread' },
      said(message),
      ...replies.map(said),
      ...(message.question && !replies.length
        ? [draftBox(draft, 'Reply', 'Reply', () => void send('reply', draft, { to: message.id }))]
        : []),
    );
  });
  const title = el('h2', { id: 'from-session' }, 'From the session');
  const section = el('section', { className: 'messages conversation' }, title, ...threads);
  section.setAttribute('aria-labelledby', title.id);
  return [section];
}

/** Where a line shows in a step's diff, by file and line number at the head. */
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
  // diff2html draws the files in the order parsed.
  view.querySelectorAll('.d2h-file-wrapper').forEach((wrapper, at) => {
    const file = files[at]?.newName ?? '';
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
  const made = { diff: step.diff, view, rows };
  drawn.set(step.id, made);
  return made;
}

/** The step's diff with its notes, asks and picked lines shown after the last line each is about. */
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
    if (!at.has(pickKey)) at.set(pickKey, []);
  }
  for (const [key, entries] of at) {
    const shown = el(
      'div',
      { className: 'pinned' },
      ...notesView(entries.filter(isNote), `more:${step.id}:${key}`),
      ...entries.filter(isAsk).map(askThread),
      ...(pick && key === pickKey ? [pickedAsk(step, pick.file, pick.lines)] : []),
    );
    rows.get(key)?.after(el('tr', { className: 'pinned-row' }, el('td', { colSpan: 2 }, shown)));
  }
  return view;
}

const paths = (label: string, files: string[]) =>
  el('p', { className: 'paths' }, `${label}: `, ...files.flatMap((file, at) => [at ? ', ' : '', el('code', {}, file)]));

/** Steps whose collapsed diff the person opened, so a redraw keeps it open. */
const opened = new Set<string>();

/** What the step says about itself, its notes, and its diff, by kind of step. */
function stepBody(step: Step): HTMLElement[] {
  const pinned = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && placeOf(entry).step === step.id,
  );
  const stepNotes = pinned.filter(isNote).filter(note => !note.note.lines);
  const notes = stepNotes.length ? [el('div', { className: 'step-notes' }, ...notesView(stepNotes, `more:${step.id}`))] : [];
  switch (step.kind) {
    case 'step':
      return [
        el('div', { className: 'about' }, markdown(step.explanation, 'explanation'), paths('Files', step.files)),
        ...notes,
        diffView(step, pinned),
      ];
    case 'folded': {
      const details = el(
        'details',
        { open: opened.has(step.id) },
        el('summary', {}, 'Show the diff'),
        diffView(step, pinned),
      );
      details.ontoggle = () => {
        if (details.open) opened.add(step.id);
        else opened.delete(step.id);
      };
      return [
        el(
          'div',
          { className: 'about' },
          el('p', {}, 'Folded by the session, not shown line by line.'),
          el('ul', {}, ...step.files.map(file => el('li', {}, el('code', {}, file.path), `: ${file.reason}`))),
          ...(step.problems.length
            ? [
                el('p', {}, el('strong', {}, 'Problems the session found:')),
                el('ul', { className: 'problems' }, ...step.problems.map(problem => el('li', {}, problem))),
              ]
            : []),
        ),
        ...notes,
        ...(step.diff ? [details] : []),
      ];
    }
  }
}

function stepView(step: Step, steps: Step[]): HTMLElement {
  const title = el('h2', { id: `step-${step.id}` }, step.title);
  const decision = step.decision
    ? el('span', { className: 'decision approved' }, 'Approved')
    : el('button', { type: 'button', onclick: () => void decide(step, 'approved') }, 'Approve');
  const at = steps.indexOf(step);
  const move = (label: string, to: Step | undefined) =>
    el('button', { type: 'button', className: 'quiet', disabled: !to, onclick: () => { show(to); } }, label);
  const section = el(
    'section',
    { className: 'step' },
    el('div', { className: 'step-head' }, title, decision),
    ...stepBody(step),
    askView(step),
  );
  section.setAttribute('aria-labelledby', title.id);
  const pager = el('div', { className: 'pager' }, move('Previous', steps[at - 1]), move('Next', steps[at + 1]));
  return el('div', {}, section, pager);
}

function stepsNav(steps: Step[], current: Step | undefined): HTMLElement {
  const items = steps.map((step, at) => {
    const href = `#${encodeURIComponent(step.id)}`;
    const link = el('a', { href, className: step.decision ? 'decided' : '' }, `${String(at + 1)}. ${step.title}`);
    if (step === current) link.setAttribute('aria-current', 'step');
    return el('li', {}, link);
  });
  const nav = el('nav', { className: 'steps' }, el('ol', {}, ...items));
  nav.setAttribute('aria-label', 'Steps');
  return nav;
}

function checklistView({ title, items }: Checklist, steps: Step[]): HTMLElement {
  const heading = el('h2', { id: 'checklist' }, title);
  const rows = items.map(item => {
    const links = item.steps.flatMap(id => {
      const at = steps.findIndex(step => step.id === id);
      const step = steps[at];
      // A step recorded again may no longer have the id the item links to.
      return step ? [el('a', { href: `#${encodeURIComponent(id)}`, title: step.title }, `Step ${String(at + 1)}`)] : [];
    });
    return el(
      'li',
      {},
      el('span', { className: 'status' }, item.status),
      markdown(item.text, 'item-text'),
      ...(links.length ? [el('p', { className: 'links' }, ...links)] : []),
    );
  });
  const section = el('section', { className: 'checklist' }, heading, el('ul', {}, ...rows));
  section.setAttribute('aria-labelledby', heading.id);
  return section;
}

function render(): void {
  lastSession = JSON.stringify(session);
  lastWalkthrough = JSON.stringify(walkthrough);
  // Redrawn whole, so the box being typed in gets its focus and caret back.
  const typing = document.activeElement instanceof HTMLTextAreaElement ? document.activeElement : null;
  const draft = typing?.dataset['draft'];
  const caret = [typing?.selectionStart ?? 0, typing?.selectionEnd ?? 0] as const;
  const { steps } = walkthrough;
  const pinned = `${walkthrough.base.slice(0, 7)}..${walkthrough.head.slice(0, 7)}`;
  const decided = steps.filter(step => step.decision).length;
  const progress = `${String(decided)} of ${plural(steps.length, 'step')} decided, ${String(steps.length - decided)} left`;
  header.replaceChildren(
    el(
      'div',
      { className: 'title' },
      el('h1', {}, walkthrough.branch),
      el('p', { className: 'pinned' }, `against ${walkthrough.target}, `, el('code', {}, pinned)),
    ),
    ...(steps.length ? [el('p', { className: 'progress' }, progress)] : []),
    el(
      'div',
      { className: 'actions' },
      sessionChip(),
      el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop'),
    ),
  );
  const current = currentStep(walkthrough);
  const checklist = walkthrough.checklist ? [checklistView(walkthrough.checklist, steps)] : [];
  main.replaceChildren(
    ...sessionMessages(),
    ...(current
      ? [el('div', { className: 'side' }, stepsNav(steps, current), ...checklist), stepView(current, steps)]
      : [
          el('p', { className: 'notice' }, 'The session is preparing the steps; they appear here as it records them.'),
          ...checklist,
        ]),
  );
  if (draft === undefined) return;
  const box = document.querySelector<HTMLTextAreaElement>(`textarea[data-draft="${CSS.escape(draft)}"]`);
  box?.focus();
  box?.setSelectionRange(...caret);
}

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});

const [shownWalkthrough, shownSession] = await Promise.all(
  ['data/walkthrough.json', 'data/session.json'].map(async data => (await fetch(data)).json() as Promise<unknown>),
);
walkthrough = shownWalkthrough as Walkthrough;
session = shownSession as SessionView;
render();

const POLL_MS = 1500;
let polling = false;
const fetchText = async (data: string) => {
  const answer = await fetch(data);
  if (!answer.ok) throw new Error(`${data}: ${String(answer.status)}`);
  return answer.text();
};
// The session records and answers through the CLI, so the page asks for the walkthrough and the session again and again.
const poller = setInterval(() => {
  if (polling) return;
  polling = true;
  const since = posted;
  Promise.all([fetchText('data/walkthrough.json'), fetchText('data/session.json')])
    .then(([walkthroughText, sessionText]) => {
      if (since !== posted || (walkthroughText === lastWalkthrough && sessionText === lastSession)) return;
      walkthrough = JSON.parse(walkthroughText) as Walkthrough;
      session = JSON.parse(sessionText) as SessionView;
      render();
    })
    .catch(() => {
      showAlert('Could not reach the walkthrough. Run /walkthrough again to reopen it.');
    })
    .finally(() => {
      polling = false;
    });
}, POLL_MS);
