import { Diff2HtmlUI } from 'diff2html/lib-esm/ui/js/diff2html-ui-slim';
import { ColorSchemeType } from 'diff2html/lib-esm/types';
import { parse } from 'diff2html/lib-esm/diff-parser';
import { previewType } from '../preview';
import { renderMarkdown } from './markdown';
import type { Entry, SessionMessage, SessionState, SessionView } from '../session';
import type { Decision, Step, Walkthrough } from '../walkthrough';

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

/** The server's answer, or null once the person has been told why there is none. */
async function post(route: string, body: unknown): Promise<Response | null> {
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
async function send(route: 'ask' | 'reply', draft: string, body: Record<string, string>): Promise<void> {
  const answer = await post(route, { ...body, text: drafts.get(draft) ?? '' });
  if (!answer) return;
  drafts.delete(draft);
  session = (await answer.json()) as SessionView;
  render();
}

let lastSession = '';

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

const said = (entry: Entry, className: string) => el('p', { className: `said ${className}` }, entry.text);

function askView(step: Step): HTMLElement {
  const asks = session.conversation.flatMap(entry =>
    entry.from === 'page' && entry.kind === 'ask' && entry.step === step.id ? [entry] : [],
  );
  const threads = asks.map(asked => {
    const answers = session.conversation.filter(entry => entry.from === 'session' && entry.answer === asked.id);
    return el(
      'div',
      { className: 'thread' },
      said(asked, 'person'),
      ...(answers.length
        ? answers.map(answer => said(answer, 'session'))
        : [el('p', { className: 'notice' }, 'Waiting for the session to answer.')]),
    );
  });
  const draft = `ask:${step.id}`;
  return el(
    'div',
    { className: 'conversation' },
    ...threads,
    draftBox(draft, 'Ask about this step', 'Ask', () => void send('ask', draft, { step: step.id })),
  );
}

/** What the session said that answers no ask: its notes, and its questions with the person's replies. */
function sessionMessages(): HTMLElement[] {
  const messages = session.conversation.filter(
    (entry): entry is SessionMessage => entry.from === 'session' && !entry.answer,
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
      said(message, message.question ? 'session question' : 'session'),
      ...replies.map(reply => said(reply, 'person')),
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

// Kept across redraws: the page redraws whenever the session's state changes, and drawing a diff is the slow part.
const drawn = new Map<string, { diff: string; view: HTMLElement }>();

function diffView(step: Step): HTMLElement {
  const kept = drawn.get(step.id);
  if (kept?.diff === step.diff) return kept.view;
  const view = el('div', { className: 'diff' });
  new Diff2HtmlUI(view, step.diff, {
    outputFormat: 'line-by-line',
    drawFileList: false,
    matching: 'lines',
    colorScheme: ColorSchemeType.AUTO,
    fileContentToggle: false,
  }).draw();
  // diff2html draws one wrapper per file, in the order it parses them.
  const files = parse(step.diff);
  view.querySelectorAll('.d2h-file-wrapper').forEach((wrapper, at) => {
    const file = files[at];
    if (file && !file.isDeleted) addPreview(wrapper, file.newName);
  });
  drawn.set(step.id, { diff: step.diff, view });
  return view;
}

/** A Diff / Preview switch on a file the page can preview, which shows the file as it is at the head commit. */
function addPreview(wrapper: Element, file: string): void {
  const type = previewType(file);
  const diff = wrapper.querySelector<HTMLElement>('.d2h-file-diff');
  if (!type || !diff) return;
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
    if (answer?.ok) preview.innerHTML = renderMarkdown(await answer.text());
    else preview.replaceChildren(el('p', { className: 'notice' }, 'Could not load the preview.'));
  };
  const choices = (['Diff', 'Preview'] as const).map(label =>
    el('button', { type: 'button', className: 'quiet', onclick: () => void choose(label === 'Preview') }, label),
  );
  const choose = async (previewing: boolean) => {
    for (const [at, button] of choices.entries()) button.setAttribute('aria-pressed', String(previewing === (at === 1)));
    diff.hidden = previewing;
    preview.hidden = !previewing;
    if (previewing && !preview.hasChildNodes()) await fill();
  };
  const toggle = el('div', { className: 'switch' }, ...choices);
  toggle.setAttribute('role', 'group');
  toggle.setAttribute('aria-label', `Show ${file} as`);
  void choose(false);
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

/** What the step says about itself before its diff, and the diff, by kind of step. */
function stepBody(step: Step): HTMLElement[] {
  switch (step.kind) {
    case 'whole':
      return [diffView(step)];
    case 'step':
      return [
        el(
          'div',
          { className: 'about' },
          ...step.explanation.split(/\n\s*\n/).map(paragraph => el('p', {}, paragraph.trim())),
          ...assumedView(step.id, step.assumptions),
          paths('Files', step.files),
        ),
        diffView(step),
      ];
    case 'folded': {
      const details = el('details', { open: opened.has(step.id) }, el('summary', {}, 'Show the diff'), diffView(step));
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

function render(): void {
  lastSession = JSON.stringify(session);
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
    el('p', { className: 'progress' }, progress),
    el(
      'div',
      { className: 'actions' },
      sessionChip(),
      el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop'),
    ),
  );
  const current = currentStep(walkthrough);
  main.replaceChildren(...sessionMessages(), stepsNav(steps, current), ...(current ? [stepView(current, steps)] : []));
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
// The session answers through the CLI, so the page asks for the conversation and the session's state again and again.
const poller = setInterval(() => {
  if (polling) return;
  polling = true;
  fetch('data/session.json')
    .then(async answer => {
      const text = await answer.text();
      if (!answer.ok || text === lastSession) return;
      session = JSON.parse(text) as SessionView;
      render();
    })
    .catch(() => {
      showAlert('Could not reach the walkthrough. Run /walkthrough again to reopen it.');
    })
    .finally(() => {
      polling = false;
    });
}, POLL_MS);
