# 48: File explanations in the explanation column

**What to build:**
A file's own explanation (ticket 38) sits on top of its diff, in the code pane, even when the person has the explanation column open.
Seen in a real walkthrough of this repo (eb1765a..bea7b81, steps 2 and 3, light theme, 1440px, explanation column open): the step's overview is in the column, while "The old step 1 (`walkthrough start`) moves into the new top procedure..." sits as a 15px paragraph between `plugin/skills/walkthrough/SKILL.md`'s header and its diff, as wide as the code.
With the column open, all the text belongs in the column and the code pane holds only code.

1. Explanation column open: under the step's overview, the column lists the step's files that have an explanation, in the step's file order, each as the file's path (a link) and its explanation below it, in the Prose style.
   The heading of that list is "Files".
   The link opens that file in the code pane if it is collapsed and scrolls it to the top of the pane; the file's entry shows as current while its file is the one at the top of the code pane.
   The code pane shows no file explanations then: each file is its header and its diff.
2. Explanation column hidden (the default): the file's explanation stays just under its header, above its diff, but reads as a short note on that file rather than as a second overview: 14px secondary ink at 1.55, held to 68ch, indented to the code's text and set off by a 2px accent rule on its left, with the same space above and below it.
   Long ones wrap; Markdown in it keeps the Session Markdown rules.
3. Phone (390px): as 2, since the explanation column waits for wider screens there.
4. The export follows the person's panels as the page does: in a column when the explanation column is on, under the file header otherwise.
5. DESIGN.md: the per-file explanation's two placements, the "Files" list and the note look; nothing about what an explanation says.

Design: extend DESIGN.md's existing tokens and components (Prose, Session Markdown, the accent rule used by quotes).

**Blocked by:** none

**Status:** in progress

- [ ] Column open: the column lists the files with explanations under the overview, headed "Files"; links open and scroll to the file; the current file's entry is marked; the code pane holds no file explanation.
- [ ] Column hidden: the explanation sits under the file header as a note, 14px secondary ink, 68ch, accent rule, even spacing.
- [ ] 390px and the export follow the same rules.
- [ ] DESIGN.md describes both placements.

## Seams under test

- The page: with the column open, file explanations are in the column and not in the code pane, and a link opens and scrolls to its file; with it hidden, the explanation is under the header with the note look; the export with each panel setting.
