# 31: Three more layouts and the layout switch

**What to build:**
The header's layout switch offers the four layouts with identical functions: "What's left" (default), "Three columns", "Explanation beside code" and "Tool panel" (tabs under the step), as drawn.
The chosen layout is remembered per viewer in browser storage, with a safe fallback to the default when storage is unavailable.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 29 "What's left" queue and the main pane, 30 Diff, notes, asks and previews restyled

**Status:** done

- [x] Each layout matches its board and keeps every function of the default layout.
- [x] The choice survives a reload; a blocked storage falls back to the default without errors.
- [x] e2e covers switching and that actions still work in each layout.
