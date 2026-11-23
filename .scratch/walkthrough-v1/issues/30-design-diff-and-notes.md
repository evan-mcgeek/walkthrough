# 30: Diff, notes, asks and previews restyled

**What to build:**
diff2html's line-by-line output is restyled through classes to the design's diff tokens (number columns, code type, addition and deletion washes with deeper gutters, muted hunk headers, picked-line tone), with sticky full-bleed file headers separated by rules, not cards.
Note rows, the "N more notes" row and the Ask-about-lines composer sit in rows indented to the code column as on the board; replies hang behind a 2px rule; the note actions sit in a menu.
Markdown previews and the image Diff / Preview switch follow the board, including Before and After for a changed image.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 28 Design foundation

**Status:** ready-for-agent

- [ ] The diff, notes, composer and previews match the boards in light and dark.
- [ ] The image preview shows Before (base) and After (head) side by side with pixel sizes, read from git through the server's file route.
- [ ] Line picking by mouse and keyboard keeps working and shows the picked-line tone.
