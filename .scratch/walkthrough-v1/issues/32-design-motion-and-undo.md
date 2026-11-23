# 32: Motion and undo

**What to build:**
The design's motion: deciding slides the rail row out and collapses it, fills the progress segment and ticks the counts; panes swap leave-then-enter; assumptions and extra notes reveal; Needs you pulses twice; all on the three durations and two curves, with the reduced-motion version (opacity and colour only).
After a decision an undo toast offers Undo for a short time; Undo clears the decision, recorded in the decisions log and passed to the session like any other decision.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 29 "What's left" queue and the main pane

**Status:** ready-for-agent

- [ ] Every animation uses the duration and curve tokens and has its reduced-motion form.
- [ ] Undo returns the item to undecided everywhere (page, `walkthrough decisions`, listen output) and the log keeps both entries.
- [ ] No animation runs when the page redraws from polling without a change.
