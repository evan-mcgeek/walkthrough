// The design's motion (docs/design/DESIGN.md, Motion), played with the Web Animations API, which the strict CSP allows.
// Under reduced motion each keeps opacity and colour only: things fade, then snap.

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
