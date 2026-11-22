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

async function decide(step: Step, decision: Decision): Promise<void> {
  const answer = await post('decide', { step: step.id, decision });
  if (answer) render((await answer.json()) as Walkthrough);
}

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
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
  );
  section.setAttribute('aria-labelledby', title.id);
  return section;
}

function render(walkthrough: Walkthrough): void {
  const pinned = `${walkthrough.base.slice(0, 7)}..${walkthrough.head.slice(0, 7)}`;
  header.replaceChildren(
    el(
      'div',
      { className: 'title' },
      el('h1', {}, walkthrough.branch),
      el('p', { className: 'pinned' }, `against ${walkthrough.target}, `, el('code', {}, pinned)),
    ),
    el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop'),
  );
  main.replaceChildren(...walkthrough.steps.map(stepView));
}

const answer = await fetch('data/walkthrough.json');
render((await answer.json()) as Walkthrough);
