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

export function region(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) throw new Error(`the page has no #${id}`);
  return found;
}

/** Sets attributes no property covers, such as ARIA. */
export function attrs<T extends Element>(node: T, given: Record<string, string>): T {
  for (const [name, value] of Object.entries(given)) node.setAttribute(name, value);
  return node;
}

/** Arrow keys move through a menu's items; Escape and Tab close it. */
export function menuKeys(menu: HTMLElement, close: () => void): void {
  menu.onkeydown = event => {
    const items = [...menu.querySelectorAll<HTMLElement>('.menu-item')];
    const at = document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
    const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (step) {
      event.preventDefault();
      items[(at + step + items.length) % items.length]?.focus();
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      close();
    }
  };
}

const token = location.pathname.split('/')[2] ?? '';

export function showAlert(message: string | null): void {
  const box = region('alert');
  box.replaceChildren(...(message === null ? [] : [icon('warn'), el('span', {}, message)]));
  box.hidden = message === null;
  document.body.classList.remove('unreachable');
}

/** A page that says in a banner how to reopen it, or one that handles losing its server with `lost`. */
export type PageName = { name: string; reopen: string } | { name: string; lost: () => void };

/** Says the server is gone and holds the page behind the banner until it answers again. */
export function showUnreachable({ name, reopen }: { name: string; reopen: string }): void {
  // Drawn once: a banner redrawn on every failed poll is announced again and takes the focus off Retry.
  if (document.body.classList.contains('unreachable')) return;
  const box = region('alert');
  box.replaceChildren(
    icon('offline'),
    el('span', { className: 'banner-text' }, el('strong', {}, `Could not reach the ${name}.`), ` ${reopen}`),
  );
  box.hidden = false;
  document.body.classList.add('unreachable');
}

/** What the page reads for itself (code colours, previews), cancelled when the session ends so no request is left to fail as the server stops. */
const reads = new AbortController();
export const readSignal = reads.signal;
export const stopReading = () => {
  reads.abort();
};

const send = (route: string, body: Record<string, unknown>, signal?: AbortSignal) =>
  fetch(`/${route}?token=${token}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    ...(signal && { signal }),
  });

/** For what the page sends on its own: how it ends leaves the alert about what the person did alone. */
export const postQuietly = (route: string, body: Record<string, unknown>, signal?: AbortSignal) => send(route, body, signal).catch(() => null);

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
    if ('lost' in page) page.lost();
    else showUnreachable(page);
    return null;
  }
}
