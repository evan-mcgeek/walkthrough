# Walkthrough

A review page, shaped like a code host's pull request review, where an agent session walks the person through a code change step by step, comments on it and answers their questions, following the person's own review rules.
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
Whose change a walkthrough is for: the person's own change (`/walkthrough`), which ends in Send to agent, or a pull request someone asked them to review (`/walkthrough:pr`), which ends in Submit review.
Each kind has its own part of the review policy.
_Avoid_: Mode, flow

**Pull request**:
A change someone asked the person to review, named by its number or link on the code host.
_Avoid_: Review request

**Step**:
A part of the change the agent recorded, made of whole files, in reading order, with a title, Look at pointers and a short explanation.
_Avoid_: Hunk, chunk

**Look at**:
One or two pointers in a step to the lines to read first, each with a label of a few words.

**Folded file**:
A file the agent marked as not worth reading line by line, such as a generated one; it arrives folded with the agent's one-line reason.
_Avoid_: Mechanical file, files to skim

**AI reviewing**:
The steps the session is still reviewing, so its comments on them may still arrive.
_Avoid_: Being checked

### Comments and threads

**Comment**:
Words on lines of the change, from the person, the agent or a colleague, all shown the same way.
The person's and the agent's new comments are pending until the review is submitted; the agent's carry `[AI]`.
_Avoid_: Note, finding, draft

**Thread**:
A comment with its replies; colleagues' existing threads come from the code host through the session, and the person can reply to them and resolve them.

**Ask AI**:
A question the person asks the agent on picked lines or in a thread.
The agent's answer is a reply in that thread; the question and the answer stay on the page and never go out.

**Viewed**:
The person's mark on a file they have read, which folds it; it clears when new commits change the file.

### The end of a review

**Summary**:
The page's last entry, the code host's "Finish your review" made visible: every pending comment that goes out, the unresolved threads and files not viewed as counts, the acceptance criteria, and the review box.

**Review**:
What the person submits from the Summary: a type (Comment, Approve or Request changes), a summary and every pending comment.
On a pull request the session posts it to the code host as one finished review; on the person's own change it goes to the agent as a fix list.
_Avoid_: Verdict, decision

**Acceptance criteria**:
The ticket's criteria as the agent checked them against the change, each met, partly met, not met or not checked; read-only on the page.
_Avoid_: Checklist, AC map

### Whose rules

**Review policy**:
The person's own rules for how their walkthroughs are reviewed, written for agents and kept outside any project: shared rules and a part for each kind of walkthrough.
_Avoid_: Reviewer config, settings

**Project instructions**:
The rules a project gives its agents in its own files, which the session reads for every walkthrough of that project.
_Avoid_: Repo config

### Who is involved

**Session**:
The agent session that drives a walkthrough: it records steps, comments, threads and criteria, answers the person's questions and sends the review on.

**Author session**:
The agent session that wrote the change; never a source of evidence in its own walkthrough.

**Reviewer**:
An agent the review policy asks the session to run on the change: the person's own reviewer agent when the policy names one, or else an agent with a fresh context.
_Avoid_: Checker, critic
