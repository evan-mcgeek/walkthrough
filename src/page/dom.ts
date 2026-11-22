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

/** What the page calls itself when it tells the person something went wrong. */
export type PageName = { name: string; reopen: string };

export const unreachable = ({ name, reopen }: PageName) => `Could not reach the ${name}. ${reopen}`;

/** The server's answer, or null once the person has been told why there is none. */
export async function post(page: PageName, route: string, body: unknown): Promise<Response | null> {
  try {
    const answer = await fetch(`/${route}?token=${token}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    showAlert(answer.ok ? null : `The ${page.name} could not do that (${String(answer.status)}).`);
    return answer.ok ? answer : null;
  } catch {
    showAlert(unreachable(page));
    return null;
  }
}
