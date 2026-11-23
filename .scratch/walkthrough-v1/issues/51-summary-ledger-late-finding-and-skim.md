# 51: The Summary as a ledger, a late finding on its step, and the round 3 boards for files

**What to build:**
Round 3 of the design (docs/design/DESIGN.md, the boards in docs/design/screens.html: #summary, #late, #checking, #fold3, #rhythm, #notemenu, #perfile, #note).

1. The Summary as DESIGN.md's Summary section and board #summary show: the title with "N still open" and one plain count line; two columns up to 1080px: the walk, a ledger of every step grouped "Still open N" then "Decided N" (step number, state icon, title link, the decision in words at the right, Being checked muted, Changed in amber), with the person's comments, the drafts ("Comments the session drafted") and the checklist as the boards place them; and the sticky 288px finish rail: the verdict heading, "No verdict yet." or "Your verdict: <label>", the session's verdict options as stacked radio buttons, then the finishing action, as the board draws them. Undecided items never read as approved.
2. A late finding on its step, as board #late: opening a decided step that got a finding after the decision shows the amber-wash line under the title ("A finding arrived after you approved. Your decision stays; change it if the finding matters.", with the person's own decision label in place of "approved"), the note's head reads "line N · new since you approved", and the action bar holds Change decision, the Ask box and "1 new finding" in amber.
3. A step being checked (#checking), files to skim (#fold3), the header rhythm (#rhythm), the note menu (#notemenu), file explanations (#perfile) and notes on removed code (1px dashed control edge, 8px radius): match the boards where the built page differs.
4. The export and 390px follow each board where it draws them.

Design: docs/design/DESIGN.md and the round 3 boards in docs/design/screens.html.

**Blocked by:** 50 Plain words, the frame without a tool panel, the stepper and Help (both edit src/page/app.ts)

**Status:** ready-for-agent
