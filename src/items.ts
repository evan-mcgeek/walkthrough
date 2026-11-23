// What the person can decide on and the choices the session offers, shared by the CLI and the page.

/** The verdict is the person's decision on the whole walkthrough; the walkthrough's own actions finish it. */
export type Item = { type: 'step' | 'note' | 'checklist'; id: string } | { type: 'verdict' } | { type: 'walkthrough' };
export type Action = { id: string; label: string; note?: true; edit?: true };

/** What a step offers when the session records no actions on it. */
export const STEP_ACTIONS: Action[] = [
  { id: 'approve', label: 'Approve' },
  { id: 'flag', label: 'Flag', note: true },
];

/** Whether `actions` are the built-in Approve and Flag, as opposed to actions the session chose. */
export const builtIn = (actions: Action[]) =>
  actions.length === STEP_ACTIONS.length &&
  actions.every((action, at) => {
    const own = STEP_ACTIONS[at];
    return own?.id === action.id && own.label === action.label && !own.note === !action.note && !own.edit === !action.edit;
  });

export const itemKey = (item: Item) => ('id' in item ? `${item.type}:${item.id}` : item.type);

/** A range's target is a commit when its base named no branch. */
export const targetName = (target: string) => (/^[0-9a-f]{40,64}$/.test(target) ? target.slice(0, 7) : target);

export const nameOf = (named: { kind: 'branch'; branch: string } | { kind: 'range'; label: string }) =>
  named.kind === 'branch' ? named.branch : named.label;
