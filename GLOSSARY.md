# Walkthrough

A page that shows a code change step by step while an agent session, following the person's own review rules, explains it, comments on it and acts on the person's decisions.
The tool knows only git, its own state and the page; every rule comes from the person or the project.

## Language

### What is reviewed

**Change**:
The code under review: everything between a base commit and a head commit.
_Avoid_: Diff, PR (a pull request is one place a change can come from)

**Walkthrough**:
One review of one change that a person goes through on the page, kept until it is pruned.
_Avoid_: Review session, tour

**Kind of walkthrough**:
Whose change a walkthrough is for: the person's own change (`/walkthrough`), or a review request, a change someone asked them to review (`/walkthrough:pr`).
Each kind has its own part of the review policy; the session names the kind to the CLI as a label the page shows, and the tool does nothing else with it.
_Avoid_: Mode, flow

**Review request**:
A change someone asked the person to review, named by its number or link on the code host.

**Step**:
A part of the change the agent recorded, made of whole files, shown with its diff and the agent's explanation, its overview.
A file in it may carry a short explanation of its own, shown above that file's diff, or under the overview while the explanation column is open.
_Avoid_: Hunk, chunk

**Folded step**:
A step the agent marked as not worth reading line by line, shown collapsed with the agent's reason for each file.
_Avoid_: Mechanical step, generated step

**Being checked**:
A step the session is still checking, such as with the review policy's reviewers, so its findings may still arrive; the page holds its actions until the session records it as checked.
A finding that arrives on a step after the person decided it puts the step back in what is left, with their decision kept.
_Avoid_: Pending, in review

### What the agent puts on the page

**Note**:
Something the agent pins to a step or to a line of it: a finding, an answer, a comment thread, anything the person should see in place.
_Avoid_: Annotation

**Finding**:
A note the session flags as a finding under the review policy, whatever its label; it is marked in the line gutter and on the overview stripe, and is open until the person decides it.

### What the person puts on the page

**Comment**:
The person's own words on lines of a step, never marked `[AI]`; it reaches the session and stays editable and deletable until the session marks it posted.
_Avoid_: Note (a note is the agent's)

**Viewed**:
The person's mark on a file they have read, which collapses it; a reading mark, never a decision.

**Checklist**:
A list the agent shows beside the steps, each item with a status and links to steps; what it lists (acceptance criteria, open questions, anything) is up to the review policy.
_Avoid_: AC map, outstanding list

**Action**:
A choice the agent offers on a step, a note, a checklist item, the verdict or the whole walkthrough, which the person can take with an optional note.
The whole walkthrough's first action is its finishing action, such as handing over the fix list or posting the review.
_Avoid_: Button, command

**Decision**:
The action a person took on an item, with their note, sent to the session and kept with the walkthrough.
Taking it back with Undo is sent the same way and leaves the item undecided.

**Summary**:
The last entry of the queue: what the person decided and what is still open, their comments and the drafts, the verdict and the finishing action.

**Verdict**:
The person's decision on the whole walkthrough, one of the choices the session offers for it, such as Approve or Needs fixes; chosen only on the Summary, and shown as a neutral status once chosen.
The finishing action waits for it.
_Avoid_: Final decision, review state

### Whose rules

**Review policy**:
The person's own rules for how their walkthroughs are reviewed, written for agents and kept outside any project: shared rules and a part for each kind of walkthrough.
_Avoid_: Reviewer config, settings

**Project instructions**:
The rules a project gives its agents in its own files, which the session reads for every walkthrough of that project.
_Avoid_: Repo config

### Who is involved

**Session**:
The agent session that drives a walkthrough: it records steps, notes, checklists and actions, and answers the person's decisions.

**Author session**:
The agent session that wrote the change; never a source of evidence in its own walkthrough.

**Reviewer**:
An agent with a fresh context that the review policy asks the session to run on the change.
_Avoid_: Checker, critic
