# 53: Files set apart, and checklist statuses in colour

**What to build:**
Seen in a real walkthrough (light theme, 1440px, a step of three files): two files in a step are told apart by one hairline rule, and the file header has the same fill as the code, so the reviewer could not see where one file ends.
The checklist's "met" is muted grey, so a met criterion reads as nothing happened; partly met and not met are both amber text.
A long checklist item in To review runs to nine lines.

1. In a step with several files, each file after the first sits 32px below the one before it, opened or collapsed; the file's top rule is in the control edge tone, and its header row is on surface tint, in light and dark.
   This replaces round 3's flush headers; a folded step's file list and the export follow the same rhythm.
2. Checklist statuses take colour everywhere they show (checklist panel, checklist page, Summary, the rail checklist, "In this step"): met in green (icon and status words), partly met in amber, not met in rust, not checked yet muted.
   The green is its own token (`met`, light and dark, AA on canvas and surface tint), not the Listening green or the diff addition green.
3. A checklist item's row in To review shows at most two lines of its text, ending in an ellipsis, with the full text as its tooltip; the item's page shows all of it.
4. DESIGN.md: file spacing, the `met` token, and the Narrow Status Rule amended for met; Help lists the checklist colours.

Design: DESIGN.md's existing tokens and components; round 4 (BRIEF-round-4.md on the canvas) may later redraw the status colours as one set.

**Blocked by:** none

**Status:** done

- [x] Files after the first sit 32px apart, with a stronger rule and a tinted header, on the page and in the export.
- [x] Met green, partly amber, not met rust, unchecked muted, in every place a checklist status shows.
- [x] A checklist item's queue row holds to two lines, full text in its tooltip.
- [x] Checked in light and dark, 1440px and 390px; DESIGN.md and Help match.
