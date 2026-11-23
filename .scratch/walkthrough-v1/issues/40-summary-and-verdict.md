# 40: Review summary step

**What to build:**
1. A final "Summary" entry in the queue: decisions, flags, your comments, drafts ready to post, checklist status, what is still open.
2. The finishing actions live there ("Post my review", "Hand fixes to the author", or whatever the session offers).
3. Undecided items are listed as undecided, never as approved.
4. A final verdict on the whole walkthrough, chosen by the person: on a review request the template's defaults are Approve, Request changes and Comment (sent with the review, through the session and the policy); on your own change, Ready for colleagues or Needs fixes. The choices come from the session and the policy as walkthrough-level actions (ADR 0005); the tool only shows them and records the choice.
5. The verdict is chosen only on the Summary, right under what is still undecided; a "Finish review" control in the header jumps to the Summary from anywhere.
6. Once chosen, the verdict shows in the header and on the list page as a status, not a control; before that the walkthrough reads "No verdict yet".

Design: the round 2 boards have landed: follow docs/design/DESIGN.md and docs/design/screens.html exactly (for 42: panels are tool windows with title bars that hide to labelled buttons on the window edges; keys 1-4).

**Blocked by:** 36 Two flows, two commands

**Status:** done
