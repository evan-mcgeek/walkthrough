import type { Listed } from '../list';
import { el } from './dom';

const token = location.pathname.split('/')[2] ?? '';
const header = document.getElementById('header') as HTMLElement;
const alertBox = document.getElementById('alert') as HTMLElement;
const main = document.getElementById('main') as HTMLElement;

const plural = (count: number, word: string) => `${String(count)} ${word}${count === 1 ? '' : 's'}`;
const UNREACHABLE = 'Could not reach the list. Run walkthrough list again to reopen it.';

function showAlert(message: string | null): void {
  alertBox.textContent = message;
  alertBox.hidden = message === null;
}

async function post(route: string, body: unknown): Promise<Response | null> {
  try {
    const answer = await fetch(`/${route}?token=${token}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    showAlert(answer.ok ? null : `The list could not do that (${String(answer.status)}).`);
    return answer.ok ? answer : null;
  } catch {
    showAlert(UNREACHABLE);
    return null;
  }
}

/** Opens the walkthrough's page here, its server started when it is not running. */
async function open(one: Listed): Promise<void> {
  const answer = await post('open', { id: one.id });
  if (answer) location.assign(((await answer.json()) as { url: string }).url);
}

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  header.replaceChildren(el('h1', {}, 'Walkthroughs'));
  main.replaceChildren(el('p', { className: 'notice' }, 'The list has stopped. You can close this tab.'));
}

function row(one: Listed): HTMLTableRowElement {
  const progress = `${String(one.decided)} of ${plural(one.steps, 'step')} decided, ${String(one.read)} read`;
  const last = new Date(one.last);
  return el(
    'tr',
    {},
    el('td', {}, el('button', { type: 'button', className: 'quiet', onclick: () => void open(one) }, one.name)),
    el('td', {}, one.steps ? progress : 'Preparing'),
    el('td', {}, el('time', { dateTime: one.last }, last.toLocaleString())),
  );
}

let shown = '';

function render(list: Listed[]): void {
  shown = JSON.stringify(list);
  header.replaceChildren(
    el('div', { className: 'title' }, el('h1', {}, 'Walkthroughs')),
    el('div', { className: 'actions' }, el('button', { type: 'button', className: 'quiet', onclick: () => void stop() }, 'Stop')),
  );
  if (!list.length) {
    main.replaceChildren(el('p', { className: 'notice' }, 'This repo has no walkthroughs; run /walkthrough to start one.'));
    return;
  }
  const head = el('tr', {}, ...['Walkthrough', 'Progress', 'Last activity'].map(name => el('th', { scope: 'col' }, name)));
  main.replaceChildren(el('table', { className: 'walkthroughs' }, el('thead', {}, head), el('tbody', {}, ...list.map(row))));
}

const load = async () => {
  const answer = await fetch('data/list.json');
  if (!answer.ok) throw new Error(String(answer.status));
  return answer.text();
};

render(JSON.parse(await load()) as Listed[]);
// The list changes as sessions record and the person decides, and an open list keeps its server from stopping idle.
const poller = setInterval(() => {
  load()
    .then(text => {
      if (text !== shown) render(JSON.parse(text) as Listed[]);
    })
    .catch(() => {
      showAlert(UNREACHABLE);
    });
}, 5000);
