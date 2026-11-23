import { tooLong } from '../words';
import { icon } from './icons';

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children);
  return node;
}

/** A native select with the drawn chevron in place of the browser's arrow. */
export function selectBox(select: HTMLSelectElement): HTMLElement {
  return el('div', { className: 'select' }, select, icon('chevron-down'));
}

export function region(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) throw new Error(`the page has no #${id}`);
  return found;
}

const token = location.pathname.split('/')[2] ?? '';

export function showAlert(message: string | null): void {
  const box = region('alert');
  box.className = 'banner attention';
  box.replaceChildren(...(message === null ? [] : [icon('warn'), el('span', {}, message)]));
  box.hidden = message === null;
  document.body.classList.remove('unreachable');
}

/** `retry` asks the server again at once; without it the page only keeps trying on its own. */
export type PageName = { name: string; reopen: string; retry?: () => void };

/** Says the server is gone and dims the page behind the banner until it answers again. */
export function showUnreachable({ name, reopen, retry }: PageName): void {
  // Drawn once: a banner redrawn on every failed poll is announced again and takes the focus off Retry.
  if (document.body.classList.contains('unreachable')) return;
  const box = region('alert');
  box.className = 'banner attention';
  box.replaceChildren(
    icon('offline'),
    el('span', { className: 'banner-text' }, el('strong', {}, `Could not reach the ${name}.`), ` ${reopen}`),
    ...(retry ? [el('button', { type: 'button', className: 'btn small', onclick: retry }, 'Retry now')] : []),
  );
  box.hidden = false;
  document.body.classList.add('unreachable');
}

const send = (route: string, body: Record<string, unknown>) =>
  fetch(`/${route}?token=${token}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

/** For what the page sends on its own: how it ends leaves the alert about what the person did alone. */
export const postQuietly = (route: string, body: Record<string, unknown>) => send(route, body).catch(() => null);

/** The server's answer, or null once the person has been told why there is none. */
export async function post(page: PageName, route: string, body: Record<string, unknown>): Promise<Response | null> {
  const problem = tooLong(body);
  if (problem) {
    showAlert(problem);
    return null;
  }
  try {
    const answer = await send(route, body);
    if (answer.ok) {
      showAlert(null);
      return answer;
    }
    const said = (await answer.json().catch(() => ({}))) as { error?: unknown };
    showAlert(typeof said.error === 'string' ? said.error : `The ${page.name} could not do that (${String(answer.status)}).`);
    return null;
  } catch {
    showUnreachable(page);
    return null;
  }
}
