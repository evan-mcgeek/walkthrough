import type { IconName } from './icons';

/** The four arrangements of the same parts; the header's layout switch shows them in this order. */
export const LAYOUTS = [
  { id: 'queue', label: "What's left", icon: 'layout-queue' },
  { id: 'three', label: 'Three columns', icon: 'layout-three' },
  { id: 'split', label: 'Explanation beside code', icon: 'layout-split' },
  { id: 'panel', label: 'Tool panel', icon: 'layout-panel' },
] as const satisfies readonly { id: string; label: string; icon: IconName }[];

export type Layout = (typeof LAYOUTS)[number]['id'];

const KEY = 'walkthrough.layout';

/** The viewer's last choice, or the default when storage is blocked or holds something else. */
export function storedLayout(): Layout {
  try {
    const stored = localStorage.getItem(KEY);
    return LAYOUTS.find(layout => layout.id === stored)?.id ?? 'queue';
  } catch {
    return 'queue';
  }
}

export function storeLayout(layout: Layout): void {
  try {
    localStorage.setItem(KEY, layout);
  } catch {
    // Blocked storage only means the choice lasts until the tab closes.
  }
}
