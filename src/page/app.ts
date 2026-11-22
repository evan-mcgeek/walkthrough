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

let shown: Walkthrough;

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
  render((await answer.json()) as Walkthrough);
  const at = shown.steps.findIndex(one => one.id === step.id);
  show([...shown.steps.slice(at + 1), ...shown.steps.slice(0, at)].find(one => !one.decision));
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

function diffView(diff: string): HTMLElement {
  const lines = diff
    .replace(/\n$/, '')
    .split('\n')
    .map(line => el('span', { className: `line ${lineClass(line)}` }, line));
  return el('pre', { className: 'diff' }, el('div', { className: 'lines' }, ...lines));
}

const paths = (label: string, files: string[]) =>
  el('p', { className: 'paths' }, `${label}: `, ...files.flatMap((file, at) => [at ? ', ' : '', el('code', {}, file)]));

/** What the step says about itself before its diff, and the diff, by kind of step. */
function stepBody(step: Step): HTMLElement[] {
  switch (step.kind) {
    case 'whole':
      return [diffView(step.diff)];
    case 'logical':
      return [
        el(
          'div',
          { className: 'about' },
          el('p', {}, step.what),
          el('p', {}, el('strong', {}, 'Why: '), step.why),
          paths('Files', step.files),
          step.tests.length ? paths('Tests', step.tests) : el('p', { className: 'untested' }, 'No tests in this step.'),
        ),
        diffView(step.diff),
      ];
    case 'mechanical':
      return [
        el(
          'div',
          { className: 'about' },
          el('p', {}, 'Checked for consistency, not line by line.'),
          step.problems.length
            ? el('ul', { className: 'problems' }, ...step.problems.map(problem => el('li', {}, problem)))
            : el('p', { className: 'consistent' }, 'No consistency problems found.'),
          step.files.length
            ? el('ul', {}, ...step.files.map(file => el('li', {}, `${file.path} (${file.reason})`)))
            : el('p', {}, 'No mechanical files changed.'),
        ),
        ...(step.diff ? [el('details', {}, el('summary', {}, 'Show the diff'), diffView(step.diff))] : []),
      ];
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

function render(walkthrough: Walkthrough): void {
  shown = walkthrough;
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
    el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop'),
  );
  const current = currentStep(walkthrough);
  main.replaceChildren(stepsNav(steps, current), ...(current ? [stepView(current, steps)] : []));
}

window.addEventListener('hashchange', () => {
  render(shown);
  window.scrollTo(0, 0);
});

const answer = await fetch('data/walkthrough.json');
render((await answer.json()) as Walkthrough);
