// A step: its title, "Look at:", the AI's explanation, the author's screenshot, its files, then the steps before and after it.
import type { Since } from '../review';
import type { Step } from '../walkthrough';
import { attrs, el } from './dom';
import { drawFiles, type FilePane, type Shows } from './files';
import { icon } from './icons';
import { animate, reduced, settle } from './motion';
import { changes } from './since';
import { linesLabel, markdown, state } from './state';

export class StepPane {
  readonly box = el('section', { className: 'step' });
  private readonly head = el('div', { className: 'step-head' });
  private readonly files: FilePane[];
  private readonly foot = el('div', { className: 'step-foot' });
  private more = false;
  private drawnHead = '';
  private shot: { key: string; figure: HTMLElement } | undefined;

  /** `since` shows only what changed in each file since the last review; a step with nothing new shows its files quiet. */
  constructor(
    readonly step: Step,
    private readonly scroller: HTMLElement,
    since: Since | null = null,
  ) {
    const changed = since && step.files.filter(file => Object.hasOwn(since.files, file));
    const quiet = changed?.length === 0;
    this.files = !changed || quiet ? drawFiles(step, quiet ? { quiet } : {}) : drawFiles({ ...step, files: changed, diff: changed.map(file => since.files[file]).join('') }, { own: step });
    this.box.dataset['step'] = step.id;
    this.box.append(this.head, ...(quiet ? [nothingNew()] : []), el('div', { className: quiet ? 'files quiet' : 'files' }, ...this.files.map(pane => pane.box)), this.foot);
  }

  fileNamed(file: string): FilePane | undefined {
    return this.files.find(pane => pane.file === file);
  }

  update(shows: Shows, go: (address: string) => void): HTMLElement[] {
    // The pane outlives a recording that keeps its diff, so its head follows the step as recorded now.
    const step = state.view.steps.find(one => one.id === this.step.id) ?? this.step;
    const key = JSON.stringify([step.title, step.explanation, step.look, step.screenshot, this.more]);
    if (key !== this.drawnHead) {
      this.drawnHead = key;
      this.drawHead(step);
    }
    this.drawFoot(go);
    return this.files.flatMap(pane => pane.update(shows));
  }

  private drawHead(step: Step): void {
    const [first = '', ...rest] = step.explanation.trim().split(/\n\s*\n/);
    const explanation = markdown(this.more ? step.explanation : first, 'explanation');
    if (rest.length && !this.more) {
      const more = el('button', { type: 'button', className: 'link more' }, 'More');
      more.onclick = () => {
        this.more = true;
        this.drawHead(step);
        this.head.querySelector<HTMLElement>('.explanation')?.focus();
      };
      (explanation.lastElementChild ?? explanation).append(' ', more);
    }
    explanation.tabIndex = -1;
    const look = step.look.map(pointer =>
      el(
        'button',
        { type: 'button', className: 'look-link', title: `${pointer.file} ${linesLabel([pointer.start, pointer.end])}`, onclick: () => {
          if (!this.fileNamed(pointer.file)?.look(pointer.start, pointer.end, this.scroller)) changes.look(pointer);
        } },
        icon('next'),
        el('code', {}, pointer.file.split('/').slice(-2).join('/')),
        ` ${linesLabel([pointer.start, pointer.end])} `,
        el('span', { className: 'look-label' }, pointer.label),
      ),
    );
    this.head.replaceChildren(
      el('h1', { className: 'step-title', tabIndex: -1 }, step.title),
      ...(look.length ? [el('div', { className: 'look' }, el('span', { className: 'look-at' }, 'Look at:'), ...look)] : []),
      explanation,
      ...(step.screenshot ? [this.screenshot(step.screenshot)] : []),
    );
  }

  // Kept while the screenshot is the same, so redrawing the head leaves it open.
  private screenshot(shot: NonNullable<Step['screenshot']>): HTMLElement {
    const key = JSON.stringify(shot);
    if (this.shot?.key !== key) this.shot = { key, figure: screenshot(shot) };
    return this.shot.figure;
  }

  private drawFoot(go: (address: string) => void): void {
    const { steps } = state.view;
    const at = steps.findIndex(one => one.id === this.step.id);
    const before = steps[at - 1];
    const after = steps[at + 1];
    const key = JSON.stringify([before?.title, after?.title]);
    if (this.foot.dataset['key'] === key) return;
    this.foot.dataset['key'] = key;
    const link = (title: string, address: string, side: 'previous' | 'next') =>
      el(
        'a',
        { className: `btn step-link ${side}`, href: `#${address}`, onclick: (event: MouseEvent) => { event.preventDefault(); go(address); } },
        ...(side === 'previous' ? [icon('previous'), el('span', {}, title)] : [el('span', {}, title), icon('next')]),
      );
    this.foot.replaceChildren(
      ...(before ? [link(before.title, `step-${before.id}`, 'previous')] : [el('span')]),
      after ? link(after.title, `step-${after.id}`, 'next') : link('Summary', 'summary', 'next'),
    );
  }
}

/** The author's screenshot: closed, a thumbnail with its alt text; open, in place, the width of the step. */
function screenshot({ name, alt }: NonNullable<Step['screenshot']>): HTMLElement {
  const image = el('img', { className: 'screenshot-image', src: `screenshot/${name}`, alt: '' });
  const button = el('button', { type: 'button', className: 'screenshot-button' }, image);
  const close = el('button', { type: 'button', className: 'btn small ghost screenshot-close' }, 'Close');
  const figure = el('figure', { className: 'screenshot' }, button, el('figcaption', {}, ...(alt ? [el('span', {}, alt)] : []), close));
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.defaultPrevented || !figure.isConnected) return;
    event.preventDefault();
    toggle(false);
  };
  const toggle = (open: boolean) => {
    const from = image.getBoundingClientRect();
    const hadFocus = figure.contains(document.activeElement);
    settle(image);
    figure.classList.toggle('open', open);
    attrs(button, { 'aria-expanded': String(open), 'aria-label': open ? 'Close the screenshot' : alt ? `Open the screenshot: ${alt}` : 'Open the screenshot' });
    close.hidden = !open;
    if (open) document.addEventListener('keydown', onKey);
    else document.removeEventListener('keydown', onKey);
    if (!open && hadFocus) button.focus();
    if (!figure.isConnected || reduced()) return;
    const to = image.getBoundingClientRect();
    const size = ({ width, height }: DOMRect) => ({ width: `${String(width)}px`, height: `${String(height)}px` });
    animate(image, 'screenshot', [size(from), size(to)], open ? { ms: 'slow', curve: 'ease-out' } : { ms: 'base', curve: 'ease-in' });
  };
  button.onclick = () => {
    toggle(!figure.classList.contains('open'));
  };
  close.onclick = () => {
    toggle(false);
  };
  toggle(false);
  return figure;
}

function nothingNew(): HTMLElement {
  const all = el('button', { type: 'button', className: 'btn small' }, 'Show all changes');
  all.onclick = () => {
    changes.choose(false);
  };
  return el(
    'div',
    { className: 'nothing-new' },
    icon('met'),
    el('div', {}, el('strong', {}, 'No changes since your last review.'), el('p', {}, 'The files are as you viewed them.')),
    all,
  );
}
