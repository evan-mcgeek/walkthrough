// What the person can decide on and the choices the session offers, shared by the CLI and the page.

/** Something the person can decide on. */
export type Item = { type: 'step' | 'note' | 'checklist'; id: string } | { type: 'walkthrough' };
/** A choice the session offers on an item; `note` asks the person for a note, `edit` lets them edit the item's text first. */
export type Action = { id: string; label: string; note?: true; edit?: true };

export const itemKey = (item: Item) => (item.type === 'walkthrough' ? item.type : `${item.type}:${item.id}`);
