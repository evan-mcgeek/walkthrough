# 13: Thread walkthrough: a review you received

**What to build:**
On the person's own pull request with unanswered threads, `/walkthrough <PR number>` runs a thread walkthrough.
Each thread sits at the step it touches, and a fresh agent checks the comment against the code at head and says whether it holds, with evidence.
The person accepts (goes to the fix list), pushes back (a reply is drafted), or asks.

**Blocked by:** 12 Colleague's PR: change walkthrough and pending review

**Status:** wontfix

Superseded by the re-scope of 2026-11-22 (ADR 0005): see tickets 16-27.

- [ ] Kind detection picks a thread walkthrough for the person's own PR with unanswered threads; a flag forces the kind.
- [ ] Each thread is placed at its step.
- [ ] Each comment gets a fresh-agent verdict with evidence at the head.
- [ ] Accept adds to the fix list; Push back drafts a short reply with the AI marker; Ask answers on the page.
- [ ] Replies go into a pending review the person submits.
- [ ] CLI tests cover kind detection and the replies payload.
