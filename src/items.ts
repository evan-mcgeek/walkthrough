// What the person can decide on and the choices the session offers, shared by the CLI and the page.

export type Item = { type: 'step' | 'note' | 'checklist'; id: string } | { type: 'walkthrough' };
export type Action = { id: string; label: string; note?: true; edit?: true };

export const itemKey = (item: Item) => (item.type === 'walkthrough' ? item.type : `${item.type}:${item.id}`);

/** What a walkthrough is called: its branch or its label. */
export const nameOf = (named: { kind: 'branch'; branch: string } | { kind: 'range'; label: string }) =>
  named.kind === 'branch' ? named.branch : named.label;
