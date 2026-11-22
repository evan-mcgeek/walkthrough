import { tooLong } from '../words';

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

const token = location.pathname.split('/')[2] ?? '';

export function showAlert(message: string | null): void {
  const box = region('alert');
  box.textContent = message;
  box.hidden = message === null;
}

export type PageName = { name: string; reopen: string };

export const unreachable = ({ name, reopen }: PageName) => `Could not reach the ${name}. ${reopen}`;

/** The server's answer, or null once the person has been told why there is none. */
export async function post(page: PageName, route: string, body: Record<string, unknown>): Promise<Response | null> {
  const problem = tooLong(body);
  if (problem) {
    showAlert(problem);
    return null;
  }
  try {
    const answer = await fetch(`/${route}?token=${token}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (answer.ok) {
      showAlert(null);
      return answer;
    }
    const said = (await answer.json().catch(() => ({}))) as { error?: unknown };
    showAlert(typeof said.error === 'string' ? said.error : `The ${page.name} could not do that (${String(answer.status)}).`);
    return null;
  } catch {
    showAlert(unreachable(page));
    return null;
  }
}
