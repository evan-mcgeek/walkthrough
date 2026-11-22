import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { ColorSchemeType } from 'diff2html/lib-esm/types';
import type { Lines, NoteMark, Place } from '../notes';
import { previewType } from '../preview';
import type { Decision, WalkthroughView } from '../decisions';
import type { Entry, PageRequest, SessionMessage, SessionState, SessionView } from '../session';
import { type Action, type Item, itemKey, nameOf } from '../items';
import type { Checklist, Step } from '../walkthrough';
import { plural } from '../words';
import { el, type PageName, post as postTo, region, showAlert, unreachable } from './dom';
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

const header = region('header');
const main = region('main');

/** Counts what the page sent, so a poll answered from before it is not drawn over its result. */
let posted = 0;

const PAGE: PageName = { name: 'walkthrough', reopen: 'Run /walkthrough again to reopen it.' };
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
/** The label of the item's action `id`, or the id when the session no longer offers it. */
const labelOf = (item: Item, id: string) => walkthrough.actions[itemKey(item)]?.find(action => action.id === id)?.label ?? id;

function currentStep({ steps }: WalkthroughView): Step | undefined {
  const named = decodeURIComponent(location.hash.slice(1));
  return steps.find(step => step.id === named) ?? steps.find(step => !stepDecided(step)) ?? steps[0];
}

/** Each step is its own address, so the browser's back and forward move between steps too. */
function show(step: Step | undefined): void {
  if (!step) return;
  location.hash = encodeURIComponent(step.id);
}

let taking: { key: string; action: string } | null = null;

async function decide(item: Item, action: string, fields: { note?: string; text?: string } = {}): Promise<void> {
  const answer = await post('decide', { item, action, ...fields });
  if (!answer) return;
  ({ walkthrough, session } = (await answer.json()) as { walkthrough: WalkthroughView; session: SessionView });
  for (const field of ['note', 'text']) drafts.delete(`decide:${itemKey(item)}:${action}:${field}`);
  taking = null;
  render();
  if (item.type !== 'step') return;
  const at = walkthrough.steps.findIndex(one => one.id === item.id);
  show([...walkthrough.steps.slice(at + 1), ...walkthrough.steps.slice(0, at)].find(one => !stepDecided(one)));
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

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  header.replaceChildren(el('h1', {}, 'Walkthrough'));
  main.replaceChildren(el('p', { className: 'notice' }, 'The walkthrough has stopped. You can close this tab.'));
}

const SESSION: Record<SessionState, readonly [string, string]> = {
  listening: ['Listening', 'The session is listening: what you ask reaches it right away.'],
  working: ['Working', 'The session is working; what you send now waits until it listens again.'],
  'needs-you': ['Needs you', 'The session asked you something; reply to it below.'],
  gone: ['Gone', 'The session stopped listening and has not come back. What you send waits; run /walkthrough in Claude Code.'],
};

function sessionChip(): HTMLElement {
  const [label, about] = SESSION[session.state];
  const chip = el('span', { className: 'chip', title: about }, label);
  chip.dataset['state'] = session.state;
  chip.setAttribute('role', 'status');
  chip.setAttribute('aria-label', 'Session');
  return chip;
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
  const form = el('form', { className: 'draft' }, ...boxes, el('button', { type: 'submit' }, action));
  form.onsubmit = event => {
    event.preventDefault();
    onSend();
  };
  return form;
}

const draftBox = (draft: string, label: string, action: string, onSend: () => void) =>
  draftForm([draftArea(draft, label)], action, onSend);

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

function decideView(item: Item, text = ''): HTMLElement[] {
  const key = itemKey(item);
  const actions = walkthrough.actions[key] ?? [];
  if (!actions.length) return [];
  const decision = walkthrough.decided[key] ?? null;
  const reopened = walkthrough.reopened[key];
  // A reopened item keeps what the person and the session said about the decision it had.
  const shown = decision ?? reopened;
  const state = decision
    ? el('p', { className: 'decision decided' }, `Decided: ${labelOf(item, decision.action)}`)
    : reopened
      ? el('p', { className: 'decision reopened' }, `Reopened: changed since you chose ${labelOf(item, reopened.action)}`)
      : el('p', { className: 'decision' }, 'Undecided');
  const buttons = actions.map(action => {
    const button = el('button', { type: 'button', className: 'quiet' }, action.label);
    button.setAttribute('aria-pressed', String(decision?.action === action.id));
    button.onclick = () => {
      if (action.note || action.edit) {
        taking = { key, action: action.id };
        render();
      } else void decide(item, action.id);
    };
    return button;
  });
  const group = el('div', { className: 'choices' }, ...buttons);
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Decide');
  const taken = taking?.key === key ? actions.find(action => action.id === taking?.action) : undefined;
  return [
    el(
      'div',
      { className: 'decide' },
      el(
        'div',
        { className: 'decide-row' },
        state,
        ...(readOnly ? [] : [group]),
      ),
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
  const form = draftForm(boxes, 'Send', () => {
    void decide(item, action.id, {
      ...(action.note && { note: drafts.get(draft('note')) ?? '' }),
      ...(action.edit && { text: drafts.get(draft('text')) ?? text }),
    });
  });
  form.classList.add('taking');
  form.append(el('button', { type: 'button', className: 'quiet', onclick: () => { taking = null; render(); } }, 'Cancel'));
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

function askView(step: Step): HTMLElement[] {
  const asks = session.conversation.filter(isAsk).filter(asked => anchorOf(asked) === step.id && !asked.lines);
  if (readOnly && !asks.length) return [];
  const draft = `ask:${step.id}`;
  return [el(
    'div',
    { className: 'conversation' },
    ...asks.map(askThread),
    ...writable(draftBox(draft, 'Ask about this step', 'Ask', () => {
      void send('ask', { step: step.id, text: drafts.get(draft) ?? '' }, draft);
    })),
  )];
}

let picked: { step: string; file: string; from: number; lines: Lines } | null = null;

function pickLine(step: Step, event: MouseEvent): void {
  const target = event.target instanceof Element ? event.target : null;
  const row = target?.closest<HTMLTableRowElement>('tr[data-line]');
  const file = row?.dataset['file'];
  if (readOnly || !row || file === undefined || !target?.closest('.d2h-code-linenumber')) return;
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
    void send('ask', { step: step.id, file, lines, text: drafts.get(draft) ?? '' }, draft).then(sent => {
      if (sent) unpick();
    });
  });
  form.append(el('button', { type: 'button', className: 'quiet', onclick: unpick }, 'Cancel'));
  form.classList.add('picked-ask');
  return form;
}

function choiceButtons({ id, choices = [] }: SessionMessage): HTMLElement[] {
  if (!choices.length) return [];
  const buttons = choices.map(choice =>
    el('button', { type: 'button', onclick: () => void send('reply', { to: id, text: choice }) }, choice),
  );
  return [el('div', { className: 'choices' }, ...buttons)];
}

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
      ...followUps(message).map(said),
      ...(message.question && !replies.length && !readOnly
        ? [
            ...choiceButtons(message),
            draftBox(draft, 'Reply', 'Reply', () => {
              void send('reply', { to: message.id, text: drafts.get(draft) ?? '' }, draft);
            }),
          ]
        : []),
    );
  });
  const title = el('h2', { id: 'from-session' }, 'From the session');
  const section = el('section', { className: 'messages conversation' }, title, ...threads);
  section.setAttribute('aria-labelledby', title.id);
  return [section];
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
    preview.replaceChildren(el('p', { className: 'notice' }, 'Loading the preview.'));
    const answer = await fetch(source).catch(() => null);
    if (answer?.ok) preview.innerHTML = renderMarkdown(await answer.text(), { images: true });
    else preview.replaceChildren(el('p', { className: 'notice' }, 'Could not load the preview.'));
  };
  const choices = (['Diff', 'Preview'] as const).map(label =>
    el('button', { type: 'button', className: 'quiet', onclick: () => void choose(label === 'Preview') }, label),
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
  const toggle = el('div', { className: 'switch' }, ...choices);
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', `Show ${file} as`);
  void choose(previewed.has(key));
  wrapper.querySelector('.d2h-file-header')?.append(toggle);
  diff.after(preview);
}

const paths = (label: string, files: string[]) =>
  el('p', { className: 'paths' }, `${label}: `, ...files.flatMap((file, at) => [at ? ', ' : '', el('code', {}, file)]));

function assumedView(stepId: string, assumptions: string[]): HTMLElement[] {
  if (!assumptions.length) return [];
  const label = el('p', { id: `assumed-${stepId}` }, el('strong', {}, 'Assumed, not read'));
  const list = el('ul', {}, ...assumptions.map(assumption => el('li', {}, assumption)));
  list.setAttribute('aria-labelledby', label.id);
  return [label, list];
}

/** Steps whose collapsed diff the person opened, so a redraw keeps it open. */
const opened = new Set<string>();

function stepBody(step: Step): HTMLElement[] {
  const pinned = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && anchorOf(entry) === step.id,
  );
  const stepNotes = pinned.filter(isNote).filter(note => !note.note.lines);
  const notes = stepNotes.length ? [el('div', { className: 'step-notes' }, ...notesView(stepNotes, `more:${step.id}`))] : [];
  switch (step.kind) {
    case 'step':
      return [
        el(
          'div',
          { className: 'about' },
          markdown(step.explanation, 'explanation'),
          ...assumedView(step.id, step.assumptions),
          paths('Files', step.files),
        ),
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
  const at = steps.indexOf(step);
  const move = (label: string, to: Step | undefined) =>
    el('button', { type: 'button', className: 'quiet', disabled: !to, onclick: () => { show(to); } }, label);
  const section = el(
    'section',
    { className: 'step' },
    el('div', { className: 'step-head' }, title),
    ...decideView({ type: 'step', id: step.id }),
    ...stepBody(step),
    ...askView(step),
  );
  section.setAttribute('aria-labelledby', title.id);
  const pager = el('div', { className: 'pager' }, move('Previous', steps[at - 1]), move('Next', steps[at + 1]));
  return el('div', {}, section, pager);
}

function stepsNav(steps: Step[], current: Step | undefined): HTMLElement {
  const item = (step: Step) => {
    const decision = decisionOf({ type: 'step', id: step.id });
    const href = `#${encodeURIComponent(step.id)}`;
    const link = el('a', { href, className: decision ? 'decided' : '' }, `${String(steps.indexOf(step) + 1)}. ${step.title}`);
    if (step === current) link.setAttribute('aria-current', 'step');
    const read = walkthrough.read.includes(step.id) ? 'Read' : '';
    const reopened = walkthrough.reopened[itemKey({ type: 'step', id: step.id })] ? 'Reopened' : read;
    const mark = decision ? labelOf({ type: 'step', id: step.id }, decision.action) : reopened;
    return el('li', {}, link, ...(mark ? [el('span', { className: 'mark' }, mark)] : []));
  };
  const nav = el('nav', { className: 'steps' }, el('ol', {}, ...steps.filter(step => !stepDecided(step)).map(item)));
  const decided = steps.filter(stepDecided);
  if (decided.length) {
    const group = el(
      'details',
      { className: 'decided-steps', open: opened.has('decided') || (current !== undefined && decided.includes(current)) },
      el('summary', {}, `${String(decided.length)} decided`),
      el('ol', {}, ...decided.map(item)),
    );
    group.ontoggle = () => {
      if (group.open) opened.add('decided');
      else opened.delete('decided');
    };
    nav.append(group);
  }
  nav.setAttribute('aria-label', 'Steps');
  return nav;
}

function wholeView(): HTMLElement[] {
  const decide = decideView({ type: 'walkthrough' });
  if (!decide.length) return [];
  const heading = el('h2', { id: 'whole' }, 'Whole walkthrough');
  const section = el('section', { className: 'whole' }, heading, ...decide);
  section.setAttribute('aria-labelledby', heading.id);
  return [section];
}

function checklistView({ title, items }: Checklist, steps: Step[]): HTMLElement {
  const heading = el('h2', { id: 'checklist' }, title);
  const rows = items.map(item => {
    const links: HTMLElement[] = item.steps.flatMap(id => {
      const at = steps.findIndex(step => step.id === id);
      const step = steps[at];
      return step ? [el('a', { href: `#${encodeURIComponent(id)}`, title: step.title }, `Step ${String(at + 1)}`)] : [];
    });
    const gone = item.steps.length - links.length;
    if (gone)
      links.push(el('span', { className: 'gone' }, `${plural(gone, 'linked step')} ${gone === 1 ? 'is' : 'are'} no longer in the change`));
    return el(
      'li',
      {},
      el('span', { className: 'status' }, item.status),
      markdown(item.text, 'item-text'),
      ...(links.length ? [el('p', { className: 'links' }, ...links)] : []),
      ...decideView({ type: 'checklist', id: item.id }, item.text),
    );
  });
  const section = el('section', { className: 'checklist' }, heading, el('ul', {}, ...rows));
  section.setAttribute('aria-labelledby', heading.id);
  return section;
}

function detachedView(): HTMLElement[] {
  const gone = session.conversation.filter(
    (entry): entry is Note | Ask => (isNote(entry) || isAsk(entry)) && anchorOf(entry) === null,
  );
  if (!gone.length) return [];
  const title = el('h2', { id: 'detached' }, 'Detached');
  const section = el(
    'section',
    { className: 'messages conversation' },
    title,
    el('p', { className: 'notice' }, 'Notes and questions whose step or lines are no longer in the change.'),
    ...gone.map(entry => (isNote(entry) ? noteView(entry) : el('div', {}, wasView(entry), askThread(entry)))),
  );
  section.setAttribute('aria-labelledby', title.id);
  return [section];
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
  const decided = steps.filter(stepDecided).length;
  const progress = `${String(decided)} of ${plural(steps.length, 'step')} decided, ${String(steps.length - decided)} left, ${String(walkthrough.read.length)} read`;
  header.replaceChildren(
    el(
      'div',
      { className: 'title' },
      el('h1', {}, nameOf(walkthrough)),
      el('p', { className: 'pinned' }, `against ${walkthrough.target}, `, el('code', {}, pinned)),
    ),
    ...(steps.length ? [el('p', { className: 'progress' }, progress)] : []),
    readOnly
      ? el('p', { className: 'notice' }, 'Exported, read-only')
      : el(
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
    ...detachedView(),
    ...(current
      ? [el('div', { className: 'side' }, stepsNav(steps, current), ...checklist, ...wholeView()), stepView(current, steps)]
      : [
          el('p', { className: 'notice' }, 'The session is preparing the steps; they appear here as it records them.'),
          ...checklist,
          ...wholeView(),
        ]),
  );
  if (current) void markRead(current);
  if (draft === undefined) return;
  const box = document.querySelector<HTMLTextAreaElement>(`textarea[data-draft="${CSS.escape(draft)}"]`);
  box?.focus();
  box?.setSelectionRange(...caret);
}

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
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
const poller = readOnly ? undefined : setInterval(() => {
  if (polling) return;
  polling = true;
  const since = posted;
  Promise.all([fetchText('data/walkthrough.json'), fetchText('data/session.json')])
    .then(([walkthroughText, sessionText]) => {
      if (since !== posted || (walkthroughText === lastWalkthrough && sessionText === lastSession)) return;
      walkthrough = JSON.parse(walkthroughText) as WalkthroughView;
      session = JSON.parse(sessionText) as SessionView;
      render();
    })
    .catch(() => {
      showAlert(unreachable(PAGE));
    })
    .finally(() => {
      polling = false;
    });
}, POLL_MS);
