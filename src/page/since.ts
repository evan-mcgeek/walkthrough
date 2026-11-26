// "Changes since your last review": GitHub's switch between that and all changes, and the steps' files each shows.
import type { Step } from '../walkthrough';
import { attrs, el, menuKeys } from './dom';
import { icon } from './icons';
import { FADE_IN, animate } from './motion';
import { allFiles, plural, state } from './state';

export const changes = {
  /** Whether the page shows only what changed since the last review. */
  since: false,
  /** Shows that view, or all changes; set by the page. */
  choose: (() => {}) as (since: boolean) => void,
};

/** The changes since the last review while the page shows them. */
export const shownSince = () => (changes.since ? state.view.since : null);

/** A step's files the view shows. */
export function shownFiles(step: Step): string[] {
  const since = shownSince();
  return since ? step.files.filter(file => Object.hasOwn(since.files, file)) : step.files;
}

const SINCE = 'Changes since your last review';
const ALL = 'All changes';

/** The header's button and its menu with the two choices. */
export class ChangesSwitch {
  readonly box = el('span', { className: 'changes-switch' });
  private readonly label = el('span', { className: 'changes-label' });
  private readonly button = attrs(
    el('button', { type: 'button', className: 'btn small changes-button', title: `${SINCE} (C)` }, icon('branch'), this.label, icon('chevron-down')),
    { 'aria-haspopup': 'menu', 'aria-expanded': 'false' },
  );
  private menu: HTMLElement | null = null;

  constructor() {
    this.button.onclick = () => {
      if (this.menu) this.close(true);
      else this.open();
    };
    this.box.append(this.button);
    document.addEventListener('pointerdown', event => {
      if (this.menu && event.target instanceof Node && !this.box.contains(event.target)) this.close(false);
    });
  }

  update(): void {
    this.label.textContent = changes.since ? SINCE : ALL;
  }

  get isOpen(): boolean {
    return this.menu !== null;
  }

  open(): void {
    const since = state.view.since;
    if (this.menu || !since || this.box.hidden) return;
    const files = Object.keys(since.files).length;
    const item = (shows: boolean, name: string, meta: string) => {
      const checked = changes.since === shows;
      const button = attrs(
        el(
          'button',
          { type: 'button', className: 'menu-item', tabIndex: -1 },
          el('span', { className: 'menu-check' }, ...(checked ? [icon('met')] : [])),
          el('span', { className: 'menu-text' }, name, el('span', { className: 'menu-meta' }, meta)),
        ),
        { role: 'menuitemradio', 'aria-checked': String(checked) },
      );
      button.onclick = () => {
        this.close(true);
        if (!checked) changes.choose(shows);
      };
      return button;
    };
    const menu = attrs(
      el(
        'div',
        { className: 'menu changes-menu' },
        item(false, ALL, plural(allFiles().length, 'file')),
        item(true, SINCE, `${plural(since.commits, 'commit')} · ${plural(files, 'file')}`),
      ),
      { role: 'menu', 'aria-label': 'Changes' },
    );
    menuKeys(menu, () => {
      this.close(true);
    });
    this.menu = menu;
    this.box.append(menu);
    this.button.setAttribute('aria-expanded', 'true');
    animate(menu, 'menu-in', FADE_IN, { ms: 'fast', curve: 'linear' });
    menu.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }

  close(refocus: boolean): void {
    if (!this.menu) return;
    this.menu.remove();
    this.menu = null;
    this.button.setAttribute('aria-expanded', 'false');
    if (refocus) this.button.focus();
  }
}
