# 50: Plain words, the frame without a tool panel, the stepper and Help

**What to build:**
Round 3 of the design (docs/design/DESIGN.md, PRODUCT.md "Plain words", and the boards in docs/design/screens.html: #notool, #stepper, #panels, #keys, #status, #steps, #mobile).
Build the page's frame and words exactly as the boards show them.

1. Plain words everywhere on the page, the list page and the export, as PRODUCT.md's "Plain words" table gives them: "To review", "N of M decided" / "Step 4 of 9 · 3 decided", "Changed since you decided", "Being checked", "New finding", "Notes on removed code", "Session messages", "Thing assumed, not checked", "Comments the session drafted", "End session".
   Internal names stay in code and data only; the session-facing guide and CLI words do not change.
   "Files to skim" is the kind line of a folded step (in place of "Folded by the session, not shown line by line."); the step keeps the session's own title, since the tool shows what the session records (ADR 0005).
   The own-change finishing action keeps the label the policy template gives ("Hand over fixes"); the template is not changed by this ticket.
2. No tool panel: remove it, its bottom strip and its key; keys 1 to 3 toggle To review, Checklist and Explanation; notes on removed code and session messages live on the Session messages page, whose row in To review counts both ("1 file not in a step · 2 on removed code").
3. The header: the stepper's current segment is solid ink and taller (9px against 5px, 2px corners) whatever its state, "Step 4 of 9 · 3 decided" beside it ("Summary · 7 decided" on the Summary); a muted "Session" prefix before the session status (dropped at 390px); End session; More holds Appearance and Help on desktop, and at 390px Swipe to decide, the panels as checkboxes, a rule, Appearance, Help and End session.
4. Help (opened with ? or from More) replaces the shortcut sheet: "What things mean" (the queue icons in words, the progress colours and the current-step marker, the note labels, the session statuses), then "Keyboard shortcuts", as DESIGN.md's "Help: what things mean" and board #keys show; every icon and colour on the page also says itself in its tooltip.
5. Title bars name each window ("To review 8", "Explanation", "Checklist") with a hide button whose tooltip names its key.
6. Clean DESIGN.md of what no longer exists (bottom-strip tokens and spacing), and update GLOSSARY.md where a page word it quotes changed.

Design: docs/design/HANDOFF.md first (it wins over the boards where they differ), then docs/design/DESIGN.md and the round 3 boards in docs/design/screens.html.

**Blocked by:** none

**Status:** ready-for-agent
