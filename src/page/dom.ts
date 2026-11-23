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

/** The session's label for the kind of walkthrough, as it gave it; none without one. */
export const kindView = (kind: string | undefined) =>
  kind === undefined ? [] : [el('span', { className: 'kind', title: 'The kind of walkthrough' }, kind)];

export function region(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) throw new Error(`the page has no #${id}`);
  return found;
}

/**
 * A popover that holds the focus while open (Appearance, the shortcut sheet): Escape or a click outside closes it,
 * and the focus goes back to what `returnTo` finds then, as a redraw may have replaced the control that opened it.
 */
export function openDialog(label: string, returnTo: () => Element | null, ...content: Node[]): HTMLDialogElement {
  const heading = el('h2', { className: 'popover-head', id: `dialog-${label.toLowerCase().replace(/\W+/g, '-')}` });
  heading.append(label);
  const dialog = el('dialog', { className: 'popover' }, heading, ...content);
  dialog.setAttribute('aria-labelledby', heading.id);
  // A click on the dialog itself, not on what it holds, landed on its backdrop.
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    dialog.remove();
    const back = returnTo();
    if (back instanceof HTMLElement) back.focus();
  });
  document.body.append(dialog);
  dialog.showModal();
  return dialog;
}

/** Radio buttons as one tab stop, moved through with the arrow keys; `choose` takes the value picked. */
export function radioGroup<T extends string>(label: string, options: readonly (readonly [T, string])[], chosen: T, choose: (value: T) => void): HTMLElement {
  const radios = options.map(([value, name]) => {
    const radio = el('button', { type: 'button', className: 'radio', tabIndex: value === chosen ? 0 : -1 }, name);
    radio.setAttribute('role', 'radio');
    radio.setAttribute('aria-checked', String(value === chosen));
    radio.dataset['value'] = value;
    // A dialog opening on the group puts the focus on what is chosen.
    radio.autofocus = value === chosen;
    radio.onclick = () => {
      pick(value);
    };
    return radio;
  });
  const pick = (value: T) => {
    for (const radio of radios) {
      const on = radio.dataset['value'] === value;
      radio.setAttribute('aria-checked', String(on));
      radio.tabIndex = on ? 0 : -1;
      if (on) radio.focus();
    }
    choose(value);
  };
  const group = el('div', { className: 'radios' }, ...radios);
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', label);
  group.onkeydown = event => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const at = radios.findIndex(radio => radio === document.activeElement);
    const next = options[(at + step + options.length) % options.length];
    if (next) pick(next[0]);
  };
  return group;
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
