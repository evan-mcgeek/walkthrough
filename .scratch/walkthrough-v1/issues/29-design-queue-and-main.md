# 29: "What's left" queue and the main pane

**What to build:**
The default layout of the design: the 232px "What's left" rail on the surface tone and the open step in the main pane.
The rail lists what still needs the person (undecided and reopened steps, the folded files, session messages that belong to no step, checklist items whose status the session marks as not met) with a state icon, title and sub-line; the current item is lifted; decided items fold into "N decided" at the rail's foot.
The main pane follows the board: title row with the decision tag, explanation, the "Assumed, not read" toggle, files, and the sticky action bar with Approve, Flag, session offers and the Ask box; plus the preparing state, the end of the walkthrough with whole-walkthrough actions, the Detached section, the files-in-no-step notice, "From the session", the session question, server unreachable and Stopped.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 28 Design foundation

**Status:** ready-for-agent

- [ ] Which checklist items count as "not met" comes from data the session records (a flag on the item or its status), never from status words built into the tool (ADR 0005).
- [ ] The rail and main pane match the boards for every listed state in light and dark.
- [ ] Keyboard: j / k and arrows still move between steps; the rail is reachable and operable by keyboard.
- [ ] Existing e2e tests updated to the new structure, none dropped without a replacement.
