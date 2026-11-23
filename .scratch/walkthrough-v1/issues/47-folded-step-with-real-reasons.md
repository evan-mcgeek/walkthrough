# 47: A folded step that reads with real reasons

**What to build:**
The folded step was designed for one-word reasons ("lockfile", "generated"), but a session writes a sentence per file ("Screenshot of the built page for the README.").
With 18 files the collapsed summary shows 18 chips cut to "Copie…" and "Scr…", "18 files" wraps onto two lines, and the problem shows only as a count until the step is opened.
Seen in a real walkthrough of this repo (eb1765a..bea7b81, step 17), dark theme, about 1200px wide.

1. The collapsed summary is one line: the chevron, "18 files" (never wrapping), the distinct reasons once each (not once per file), joined by " · " in muted text and cut with one ellipsis at the end of the line, then the problem tag.
   The full list of distinct reasons is the summary's title, so a hover shows it.
2. The session's problems show under the summary whether the step is open or not, since a problem wants the person (DESIGN.md: amber "wants you").
3. Opened, each file is one row: its path, its reason as text (not a chip) beside or under it, and Show diff; long reasons wrap.
4. A note's "…" menu sits at the end of the note's own text column, not at the far edge of the pane; check every note on a step, a line and a folded step.
5. Collapsed and opened files in a step keep one rhythm: today an opened file (DESIGN.md in the Docs step) has a larger gap above its header than the collapsed rows around it (GLOSSARY.md, README.md, PRODUCT.md), so the list jumps when a file opens.
   Every file header sits the same distance from the one before it, opened or not, as DESIGN.md's spacing says.
6. Check the folded step against the board (docs/design/screens.html, "Folded step") with real reasons of a sentence each, in light and dark, at 1280px and 390px, and in the export; update the board's description in DESIGN.md where the built page now differs.

**Blocked by:** none

**Status:** done

- [x] Collapsed: one line, distinct reasons once each, one ellipsis, title with all reasons, "N files" never wraps.
- [x] Problems show while collapsed.
- [x] Opened: each file's reason reads as text, long ones wrap.
- [x] A note's menu sits at the end of its text column.
- [x] File headers keep the same spacing whether the file is opened or collapsed.
- [x] Checked in light, dark, 1280px, 390px and the export; DESIGN.md matches.

## Seams under test

- The page: a folded step with sentence reasons, collapsed and opened; the problem visible while collapsed; the note menu's position against its text.
