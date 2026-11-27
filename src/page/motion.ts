// The design's motion (docs/design/DESIGN.md, Motion), played with the Web Animations API, which the strict CSP allows.
// Under reduced motion each keeps opacity and colour only: things fade, then snap.
import { attrs } from './dom';

type Timing = { ms: 'fast' | 'base' | 'slow' | number; curve: 'ease-out' | 'ease-in' | 'linear'; delay?: number; fill?: FillMode };

const root = getComputedStyle(document.documentElement);
const token = (name: string) => root.getPropertyValue(`--${name}`).trim();

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** What reduced motion keeps of an element arriving. */
export const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

export const duration = (ms: Timing['ms']) => (typeof ms === 'number' ? ms : Number.parseFloat(token(ms)));

export const animate = (element: Element, id: string, frames: Keyframe[], { ms, curve, delay = 0, fill = 'backwards' }: Timing) =>
  element.animate(frames, { id, duration: duration(ms), delay, fill, easing: curve === 'linear' ? 'linear' : token(curve) });

/** Stops the motion this module plays on an element, so it shows as it is. */
export function settle(element: Element): void {
  for (const running of element.getAnimations()) if (running.id) running.cancel();
}

/** Fades an element out and then runs `done`, unless something stopped the fade first; a fade already going on goes on. */
export function fadeOut(element: Element, ms: Timing['ms'], done: () => void, curve: Timing['curve'] = 'linear'): void {
  if (element.getAnimations().some(running => running.id === 'fade-out')) return;
  const fade = animate(element, 'fade-out', [{ opacity: 1 }, { opacity: 0 }], { ms, curve, fill: 'forwards' });
  fade.finished.then(
    () => {
      done();
      fade.cancel();
    },
    () => {},
  );
}

/** A count that changed rises into place. */
export const tick = (element: Element) =>
  animate(element, 'tick', reduced() ? [{ opacity: 0.55 }, { opacity: 1 }] : [{ opacity: 0.55, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }], {
    ms: 'base',
    curve: reduced() ? 'linear' : 'ease-out',
  });

/** Opens an element from nothing to its height, its content fading in after it starts. */
export function grow(element: HTMLElement): void {
  settle(element);
  if (reduced()) {
    animate(element, 'grow', FADE_IN, { ms: 'base', curve: 'linear' });
    return;
  }
  const { paddingTop, paddingBottom } = getComputedStyle(element);
  element.classList.add('growing');
  const opening = animate(element, 'grow', [{ height: '0px', paddingTop: '0px', paddingBottom: '0px' }, { height: `${String(element.offsetHeight)}px`, paddingTop, paddingBottom }], {
    ms: 'slow',
    curve: 'ease-out',
  });
  animate(element, 'grow-fade', FADE_IN, { ms: 'base', curve: 'linear', delay: 80 });
  const done = () => {
    element.classList.remove('growing');
  };
  opening.finished.then(done, done);
}

/** Fades an element, then closes its height, then runs `done`. */
export function shrink(element: HTMLElement, done: () => void): void {
  const fade = duration('fast');
  if (reduced()) {
    fadeOut(element, 'base', done);
    return;
  }
  const { paddingTop, paddingBottom } = getComputedStyle(element);
  element.classList.add('growing');
  animate(element, 'shrink-fade', [{ opacity: 1 }, { opacity: 0 }], { ms: 'fast', curve: 'linear', fill: 'forwards' });
  const closing = animate(element, 'shrink', [{ height: `${String(element.offsetHeight)}px`, paddingTop, paddingBottom }, { height: '0px', paddingTop: '0px', paddingBottom: '0px' }], {
    ms: 'slow',
    curve: 'ease-out',
    delay: fade,
    fill: 'forwards',
  });
  closing.finished.then(done, () => {
    element.classList.remove('growing');
  });
}

/**
 * Puts `scroller` at `top` at once; while a folded file on the way still opens, the page is not yet tall enough to get there,
 * so it is put there again each frame until it gets there, the opening is over, or the person scrolls.
 */
export function placePane(scroller: HTMLElement, top: number): void {
  const to = Math.max(0, top);
  const until = performance.now() + duration('slow') + duration('fast');
  let last = -1;
  const place = () => {
    if (last >= 0 && Math.abs(scroller.scrollTop - last) > 1) return;
    scroller.scrollTop = to;
    last = scroller.scrollTop;
    if (last < to - 1 && performance.now() < until) requestAnimationFrame(place);
  };
  place();
}

/**
 * Scroll and mark's scroll: `scroller` eases to `top` in 320ms, after a cut to one screen away when it is farther;
 * at once under reduced motion. It stops where it is when the person scrolls meanwhile.
 */
export function scrollPane(scroller: HTMLElement, top: number): void {
  for (const running of scroller.getAnimations()) if (running.id === 'scroll') running.cancel();
  // Not held to the scroll height now: something opening on the way may still be making room for the target.
  const to = Math.max(0, top);
  if (reduced()) {
    placePane(scroller, to);
    return;
  }
  const screen = scroller.clientHeight;
  scroller.scrollTop = Math.max(to - screen, Math.min(to + screen, scroller.scrollTop));
  const from = scroller.scrollTop;
  // An animation with no keyframes keeps the time and the house curve; each frame scrolls by its progress.
  const timing = animate(scroller, 'scroll', [], { ms: 'slow', curve: 'ease-out', fill: 'none' });
  let last = from;
  const step = () => {
    if (timing.playState === 'idle') return;
    if (Math.abs(scroller.scrollTop - last) > 1) {
      timing.cancel();
      return;
    }
    const progress = timing.playState === 'finished' ? 1 : (timing.effect?.getComputedTiming().progress ?? 0);
    scroller.scrollTop = from + (to - from) * progress;
    last = scroller.scrollTop;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Scroll and mark's mark: the elements flash in the line-pick tone and fade over 1.4s, from the start again on a second call; one mark at a time. */
export function flash(elements: Element[]): void {
  for (const marked of document.querySelectorAll('.flash')) if (!elements.includes(marked)) marked.classList.remove('flash');
  for (const element of elements) {
    for (const running of element.getAnimations({ subtree: true })) if (running instanceof CSSAnimation && running.animationName === 'flash') running.cancel();
    element.classList.remove('flash');
    element.getBoundingClientRect();
    element.classList.add('flash');
  }
}

/** A menu or a pane that goes fades out, out of reach of the keyboard and screen readers, then leaves the page. */
export function fadeAway(element: HTMLElement): void {
  attrs(element, { inert: '', 'aria-hidden': 'true' });
  fadeOut(element, 'fast', () => {
    element.remove();
  });
}
