# Walkthrough

A guided review of a code change: the change is shown step by step in an order that tells its story, each step explained and decided on by a person, with fresh agents checking it against its ticket and the repo's rules.

## Language

### The change and its source of truth

**Change**:
The code under review: everything between a base and a head, either your own branch before it goes to colleagues or someone else's pull request.
_Avoid_: Diff, PR (a PR is one place a change can come from)

**Ticket**:
The work item a change is meant to deliver, with its description and its decision comments.
_Avoid_: Issue, story, spec

**AC**:
One acceptance criterion of the ticket, the unit a change is checked against for completeness.
_Avoid_: Requirement

### The review

**Walkthrough**:
One guided review a person goes through on the page, either a change walkthrough or a thread walkthrough.
_Avoid_: Review session, tour

**Change walkthrough**:
A walkthrough over a change, from the ticket's ACs through the ordered steps to the outstanding list: your own branch, or a colleague's pull request.

**Thread walkthrough**:
A walkthrough over the threads of a pull request where the other side has moved: a review you received, or replies to a review you left.

**Step**:
One logical piece of the change, possibly across several files, shown with what changed, why, and which AC it serves.
_Avoid_: Hunk, chunk, file

**Finding**:
A problem a reviewer agent reports in the change, stated as a concrete failure: what input or state leads to what wrong result.
_Avoid_: Comment, issue, suggestion, nit

**Outstanding list**:
What the change still owes at the end of a walkthrough: ACs with no step that delivers them, broken repo rules, and code that serves no AC.
_Avoid_: TODO list, gaps

**Settled finding**:
A kind of finding a repo has decided not to raise again, kept in that repo as a convention with its reason.
_Avoid_: Ignore list, suppression, don't-flag list

**Review policy**:
A person's own setup for the reviewers behind their walkthroughs: which reviewers run, or which existing review agent or workflow takes their place.
_Avoid_: Reviewer config, repo policy

**Thread**:
One conversation on a pull request between a reviewer and the author, anchored to a place in the change.
_Avoid_: Comment chain, discussion

**AI marker**:
The visible tag on every comment an agent drafted for a colleague, so they know it was not written by the person.

### Who is involved

**Author session**:
The agent session that wrote the change; never a source of evidence in its own walkthrough.

**Reviewer**:
An agent with a fresh context that sees only the ticket, the change and the repo, and reports findings.
_Avoid_: Checker, critic
