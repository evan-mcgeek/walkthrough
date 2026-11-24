// What the person can decide on and the choices the session offers, shared by the CLI and the page.
import type { WalkthroughView } from './decisions';
import type { Step } from './walkthrough';

/** The verdict is the person's decision on the whole walkthrough; the walkthrough's own actions finish it. */
export type Item = { type: 'step' | 'note' | 'checklist'; id: string } | { type: 'verdict' } | { type: 'walkthrough' };
/** The colour a decision with the action shows in; the session picks it from the review policy, and left out it is none. */
export type Tone = 'positive' | 'attention' | 'none';
export const TONES: readonly Tone[] = ['positive', 'attention', 'none'];
/** `consequence` says where a decision goes or what it costs, `outcome` what it did; `primary` marks the one whose consequence shows. */
export type Action = {
  id: string;
  label: string;
  note?: true;
  edit?: true;
  tone?: Tone;
  consequence?: string;
  outcome?: string;
  primary?: true;
};
/** The most words a consequence and an outcome hold. */
export const CONSEQUENCE_WORDS = 8;
export const OUTCOME_WORDS = 3;

/** What a step offers when the session records no actions on it. */
export const STEP_ACTIONS: Action[] = [
  { id: 'approve', label: 'Approve', tone: 'positive', outcome: 'Approved' },
  { id: 'flag', label: 'Flag', note: true, tone: 'attention', outcome: 'Flagged' },
];

/** Whether `actions` are the built-in Approve and Flag, as opposed to actions the session chose. */
export const builtIn = (actions: Action[]) =>
  actions.length === STEP_ACTIONS.length &&
  actions.every((action, at) => {
    const own = STEP_ACTIONS[at];
    return (
      own?.id === action.id &&
      own.label === action.label &&
      !own.note === !action.note &&
      !own.edit === !action.edit &&
      (action.tone === undefined || own.tone === action.tone)
    );
  });

/**
 * How a step shows in the header bar, To review, the Summary and Help: where the person is, decided in its action's tone,
 * changed since decided, undecided with an open finding or problem, or undecided; whether it was read has no look.
 */
export type Shown = 'cur' | 'ok' | 'flag' | 'neu' | 'reo' | 'find' | 'un';
export const TONE_SHOWN: Record<Tone, 'ok' | 'flag' | 'neu'> = { positive: 'ok', attention: 'flag', none: 'neu' };

/** The tone of the action taken on an item, none when the action is gone or has no tone. */
export const toneOf = (actions: Action[] | undefined, id: string): Tone => actions?.find(one => one.id === id)?.tone ?? 'none';

/** How a step shows away from where the person is; `findings` counts its open findings. */
export function stepShown(view: Pick<WalkthroughView, 'actions' | 'decided' | 'reopened'>, step: Step, findings: number): Exclude<Shown, 'cur'> {
  const key = itemKey({ type: 'step', id: step.id });
  const decision = view.decided[key];
  if (decision) return TONE_SHOWN[toneOf(view.actions[key], decision.action)];
  if (view.reopened[key]) return 'reo';
  return findings > 0 || (step.kind === 'folded' && step.problems.length > 0) ? 'find' : 'un';
}

export const itemKey = (item: Item) => ('id' in item ? `${item.type}:${item.id}` : item.type);

/** A range's target is a commit when its base named no branch. */
export const targetName = (target: string) => (/^[0-9a-f]{40,64}$/.test(target) ? target.slice(0, 7) : target);

export const nameOf = (named: { kind: 'branch'; branch: string } | { kind: 'range'; label: string }) =>
  named.kind === 'branch' ? named.branch : named.label;
