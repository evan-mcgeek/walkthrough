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
A part of the change the agent recorded, made of whole files, shown with its diff and the agent's explanation.
_Avoid_: Hunk, chunk

**Folded step**:
A step the agent marked as not worth reading line by line, shown collapsed with the agent's reason for each file.
_Avoid_: Mechanical step, generated step

### What the agent puts on the page

**Note**:
Something the agent pins to a step or to a line of it: a finding, an answer, a comment thread, anything the person should see in place.
_Avoid_: Comment, annotation

**Checklist**:
A list the agent shows beside the steps, each item with a status and links to steps; what it lists (acceptance criteria, open questions, anything) is up to the review policy.
_Avoid_: AC map, outstanding list

**Action**:
A choice the agent offers on a step, a note, a checklist item or the whole walkthrough, which the person can take with an optional note.
_Avoid_: Button, command

**Decision**:
The action a person took on an item, with their note, sent to the session and kept with the walkthrough.
Taking it back with Undo is sent the same way and leaves the item undecided.

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
