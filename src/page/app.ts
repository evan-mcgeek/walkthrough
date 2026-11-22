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

let walkthrough: Walkthrough;
let session: SessionView;
/** What the person typed and has not sent, by box, so a redraw keeps it. */
const drafts = new Map<string, string>();

async function decide(step: Step, decision: Decision): Promise<void> {
  const answer = await post('decide', { step: step.id, decision });
  if (!answer) return;
  walkthrough = (await answer.json()) as Walkthrough;
  render();
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

// Content lines start with a space, + or -, or a backslash note; every other line is a file header.
const lineClass = (line: string) =>
  line.startsWith('+++ ') || line.startsWith('--- ')
    ? 'meta'
    : line.startsWith('@@')
      ? 'hunk'
      : line.startsWith('+')
        ? 'add'
        : line.startsWith('-')
          ? 'del'
          : line.startsWith(' ') || line.startsWith('\\')
            ? ''
            : 'meta';

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

function stepView(step: Step): HTMLElement {
  const title = el('h2', { id: `step-${step.id}` }, step.title);
  const decision = step.decision
    ? el('span', { className: 'decision approved' }, 'Approved')
    : el('button', { type: 'button', onclick: () => void decide(step, 'approved') }, 'Approve');
  const lines = step.diff
    .replace(/\n$/, '')
    .split('\n')
    .map(line => el('span', { className: `line ${lineClass(line)}` }, line));
  const section = el(
    'section',
    { className: 'step' },
    el('div', { className: 'step-head' }, title, decision),
    el('pre', { className: 'diff' }, el('div', { className: 'lines' }, ...lines)),
    askView(step),
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

function render(): void {
  lastSession = JSON.stringify(session);
  // Redrawn whole, so the box being typed in gets its focus and caret back.
  const typing = document.activeElement instanceof HTMLTextAreaElement ? document.activeElement : null;
  const draft = typing?.dataset['draft'];
  const caret = [typing?.selectionStart ?? 0, typing?.selectionEnd ?? 0] as const;
  const pinned = `${walkthrough.base.slice(0, 7)}..${walkthrough.head.slice(0, 7)}`;
  header.replaceChildren(
    el(
      'div',
      { className: 'title' },
      el('h1', {}, walkthrough.branch),
      el('p', { className: 'pinned' }, `against ${walkthrough.target}, `, el('code', {}, pinned)),
    ),
    el(
      'div',
      { className: 'actions' },
      sessionChip(),
      el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop'),
    ),
  );
  main.replaceChildren(...sessionMessages(), ...walkthrough.steps.map(stepView));
  if (draft === undefined) return;
  const box = document.querySelector<HTMLTextAreaElement>(`textarea[data-draft="${CSS.escape(draft)}"]`);
  box?.focus();
  box?.setSelectionRange(...caret);
}

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
