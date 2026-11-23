# 46: Steps the session is still checking, and findings that arrive late

**What to build:**
Today the session records the steps, then pins findings whenever its reviewers and their checks finish, in no order.
A person reading along can approve a step and only later, with nothing on the page saying so, get a confirmed finding on it.
The session should check the steps in reading order, and the page should say plainly which steps are still being checked and when a finding lands on a step the person already read or decided.

1. `walkthrough checking [<step id>...]` records which steps the session is still checking (such as with the review policy's reviewers), replacing the set recorded before; with no ids, none.
   An id that names no step is refused, and nothing is recorded.
   It prints the set, such as `Checking 3 steps: 4, 5, 6.` or `Checking no steps.`
   The set is stored in walkthrough.json; recording the steps again keeps the ids that still name a step and drops the rest.
   The tool never reads why a step is being checked (ADR 0005): the session says so, the tool shows it.
2. While a step is being checked, the page:
   - shows a notice at the top of the step: "The session is still checking this step. Findings may still arrive.";
   - shows "Being checked" as the step's sub-line in What's left;
   - holds the step's actions: they are drawn disabled with the hint "Decide once the session has checked this step.", the keys A and F do nothing, and the server refuses a decision on that step;
   - still lets the person read it, ask about it and comment on its lines.
   The Summary lists steps still being checked under what is still open, as "Being checked".
3. A finding (a note with `"finding": true`) pinned on a step after the person decided that step, and not yet decided itself, puts the step back in What's left with the sub-line "New finding", in attention ink; the step's own decision stays as it was.
   Pinned after means the note's `at` is later than the step decision's `at`.
4. When a poll brings a new finding on a step the person has read or decided, the page shows an attention banner naming it, such as "New finding on step 8, Ultramarine, accents and Appearance, which you approved." with a "Go to step" button and a dismiss button.
   Several at once read as one banner: "3 new findings on steps 8 and 10."
   The banner is for the open page only; after a reload the What's left sub-line of point 3 carries it.
5. Both skills (shared "Walking through" part, kept identical) say how to use `walkthrough checking`: when the review policy has the session check steps after recording them, mark every step it will check right after `walkthrough steps`; as it finishes each step, in reading order, pin that step's notes and their actions, then record the set again without it.
   A note pinned on a step after it was cleared is still allowed; the page warns the person.
6. The review policy template's "Reviewers and findings" gains: "Check the steps in reading order: run the reviewers over the whole change, then confirm and pin each step's findings before the next, and keep every step marked as being checked until its findings are pinned with their actions."
   Its new sha256 joins the shipped list in `src/policy.ts`, and `test/policy.test.ts` keeps proving an unchanged older template still counts.
7. `walkthrough guide` documents `checking`, the held actions and the late-finding rule; GLOSSARY.md gains "Being checked"; DESIGN.md gains the step notice, the queue sub-lines and the banner, built from existing tokens and components (the attention banner `#alert` and the queue's `attention` sub-line already exist).

**Blocked by:** none

**Status:** done

- [x] `walkthrough checking` replaces the set, refuses unknown ids, prints the set, and re-recorded steps drop gone ids.
- [x] A step being checked shows its notice and queue sub-line, its actions are held on the page, by A and F, and by the server; ask and comment still work.
- [x] The Summary lists steps still being checked as open.
- [x] A finding pinned after the step's decision puts the step back in What's left with "New finding".
- [x] A new finding on a read or decided step raises the banner, with Go to step and dismiss; several read as one.
- [x] Both skills say how to use `checking`, word for word in the shared part; the template has the reading-order rule and its hash is shipped.
- [x] Guide, GLOSSARY.md and DESIGN.md describe it.

## Seams under test

- The CLI: `checking` set, replace, refusal, gone ids after `steps`; `decide` refused on a step being checked.
- The page: notice, sub-line, held actions and keys, Summary entry, late-finding sub-line, banner on poll.
- The skills: shared part identical; the template's parts unchanged in name.
