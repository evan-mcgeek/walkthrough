// The design's motion (docs/design/DESIGN.md, Motion), played with the Web Animations API, which the strict CSP allows.

type Timing = { ms: 'fast' | 'base' | 'slow' | number; curve: 'ease-out' | 'ease-in' | 'linear'; delay?: number; iterations?: number; fill?: FillMode };
type Motion = {
  key: string;
  frames: Keyframe[];
  timing: KeyframeAnimationOptions & { id: string };
  start: number;
  end: number;
  running: Animation[];
};

const root = getComputedStyle(document.documentElement);
const token = (name: string) => root.getPropertyValue(`--${name}`).trim();

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** What reduced motion keeps of an element arriving. */
export const FADE_IN: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }];

// The animation clock, which page timers and their fakes leave alone.
const now = () => Number(document.timeline.currentTime ?? performance.now());

function options(id: string, { ms, curve, delay = 0, iterations = 1, fill = 'backwards' }: Timing) {
  const duration = typeof ms === 'number' ? ms : Number.parseFloat(token(ms));
  return { id, duration, delay, iterations, fill, easing: curve === 'linear' ? 'linear' : token(curve) };
}

/** Plays on an element no redraw replaces. */
export const animate = (element: Element, id: string, frames: Keyframe[], timing: Timing) => element.animate(frames, options(id, timing));

const live: Motion[] = [];

/**
 * Plays on every element marked `data-motion="<key>"` from the next replay until it ends, and returns how long that is;
 * an element a redraw puts in place of another goes on from the same point instead of starting over.
 */
export function play(key: string, id: string, frames: Keyframe[], given: Timing): number {
  const timing = options(id, given);
  const lasts = timing.delay + timing.duration * timing.iterations;
  const start = now();
  // A newer motion of the same kind on the same elements takes over, as a chevron turning back does.
  for (const older of live.filter(one => one.key === key && one.timing.id === id)) {
    for (const running of older.running) running.cancel();
    live.splice(live.indexOf(older), 1);
  }
  live.push({ key, frames, timing, start, end: start + lasts, running: [] });
  return lasts;
}

export function replay(): void {
  const at = now();
  for (const motion of [...live]) {
    if (motion.end <= at) {
      live.splice(live.indexOf(motion), 1);
      continue;
    }
    for (const target of document.querySelectorAll(`[data-motion="${CSS.escape(motion.key)}"]`)) {
      const playing = target.getAnimations();
      if (motion.running.some(running => playing.includes(running))) continue;
      const running = target.animate(motion.frames, motion.timing);
      running.currentTime = at - motion.start;
      motion.running.push(running);
    }
  }
}
