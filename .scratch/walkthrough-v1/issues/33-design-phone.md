# 33: Phone layout and swipe deck

**What to build:**
At 390px the page follows the phone boards: layout switch and Stop move into a More menu, the progress bar takes its own strip, the queue becomes a select with the drawn chevron, diffs scroll inside the file with notes pinned, and primary actions become a sticky bottom bar of 44px targets.
A step can be decided by swiping its card (right approves, left flags and opens the Flag note), with the decision chip, edge labels and the next card beneath as drawn; the buttons stay for anyone who doesn't swipe.
Swipe right means Approve only when the step offers the built-in Approve; when the session defines other actions, the deck offers no swipe for that step.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 29 "What's left" queue and the main pane, 30 Diff, notes, asks and previews restyled

**Status:** done

- [x] The 390px states match the phone boards in light and dark.
- [x] Swipe works by touch and pointer, respects reduced motion, and never decides a step whose actions the session replaced.
- [x] e2e at 390px covers the More menu, the queue select and both swipe directions.
