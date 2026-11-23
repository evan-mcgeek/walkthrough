import type { Listed } from '../list';
import { plural } from '../words';
import { el, type PageName, post as postTo, region, showUnreachable } from './dom';

const header = region('header');
const main = region('main');

const PAGE: PageName = { name: 'list', reopen: 'Run walkthrough list again to reopen it.' };
const post = (route: string, body: Record<string, unknown>) => postTo(PAGE, route, body);

async function open(one: Listed): Promise<void> {
  const answer = await post('open', { id: one.id });
  if (answer) location.assign(((await answer.json()) as { url: string }).url);
}

async function stop(): Promise<void> {
  if (!(await post('stop', {}))) return;
  clearInterval(poller);
  header.replaceChildren(el('h1', { className: 'logo' }, 'Walkthroughs'));
  main.replaceChildren(el('p', { className: 'notice' }, 'The list has stopped. You can close this tab.'));
}

function row(one: Listed): HTMLTableRowElement {
  const progress = `${String(one.decided)} of ${plural(one.steps, 'step')} decided, ${String(one.read)} read`;
  const last = new Date(one.last);
  return el(
    'tr',
    {},
    el('td', {}, el('button', { type: 'button', className: 'btn ghost', onclick: () => void open(one) }, one.name)),
    // What walkthrough prune takes to remove this one.
    el('td', {}, el('code', {}, one.id)),
    el('td', {}, one.steps ? progress : 'Preparing'),
    el('td', {}, el('time', { dateTime: one.last }, last.toLocaleString())),
  );
}

let shown = '';

function render(list: Listed[]): void {
  shown = JSON.stringify(list);
  header.replaceChildren(
    el('h1', { className: 'logo' }, 'Walkthroughs'),
    el('div', { className: 'header-end' }, el('button', { type: 'button', className: 'btn small', onclick: () => void stop() }, 'Stop')),
  );
  if (!list.length) {
    main.replaceChildren(el('p', { className: 'notice' }, 'This repo has no walkthroughs; run /walkthrough to start one.'));
    return;
  }
  const head = el('tr', {}, ...['Walkthrough', 'Id', 'Progress', 'Last activity'].map(name => el('th', { scope: 'col' }, name)));
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
      showUnreachable(PAGE);
    });
}, 5000);
