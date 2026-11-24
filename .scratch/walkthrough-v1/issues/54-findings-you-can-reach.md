# 54: Findings you can reach without scrolling

**What to build:**
Seen in a real walkthrough: a step with an open finding looks like any other in To review, a file header says nothing about the notes on its lines, and the person had to scroll the diff to find the finding.
A finding's Accept and Reject sit behind the note's "…" menu, so the person did not know a finding could be rejected.

1. To review: a step row with open findings has the amber sub-line "1 finding" / "N findings" with the warning icon; choosing it opens the step at its first open finding.
   Other sub-lines ("Changed since you decided", "Being checked", "New finding") keep priority; take the order most in line with DESIGN.md and name it in your report.
2. File headers: after the `+16 −2` counts, the file's notes in the marks "In this step" uses: amber "1 finding" with its icon, muted "2 notes", accent "1 yours"; only counts above zero.
   Each count is a button that opens the file if it is collapsed or Viewed and scrolls to the first such note in it.
3. The action bar's amber "N open findings" is a button: each press scrolls to and focuses the next open finding in the step, wrapping to the first, with the tooltip "Go to the next open finding".
4. A note's actions show as buttons on the note, under its text beside Reply, instead of behind its "…" menu; a decided note keeps its decided tag and Undo as now.
   At 390px the buttons wrap.
5. DESIGN.md updated for each; Help lists the new counts.

Design: DESIGN.md's existing marks (the "In this step" counts, the queue's amber sub-line, step action buttons).

**Blocked by:** 53 Files set apart (both edit src/page/app.ts)

**Status:** done

- [x] Queue rows show open findings and jump to the first.
- [x] File headers show finding, note and own-comment counts that jump to the note.
- [x] "N open findings" steps through the open findings.
- [x] Note actions are buttons on the note.
- [x] Checked in light and dark, 1440px and 390px; DESIGN.md and Help match.
