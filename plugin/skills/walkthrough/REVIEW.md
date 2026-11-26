# Review policy

How I review a change.
The walkthrough session reads this on every walkthrough, together with the project's instructions for agents, and follows both.
Where they disagree about the project's own code, the project's instructions win; about how I review, this policy wins.
Every rule here is a default; edit any of it.

It has three parts.
"Shared rules" apply to every walkthrough.
"My change" applies when I walk through my own change, with `/walkthrough`.
"Someone else's change" applies when someone asks me to review theirs, with `/walkthrough:pr`.
Follow the shared rules and the one part for this walkthrough, and leave the other part out.

## Shared rules

### The ticket

- Before recording anything, read the ticket or spec the change is for, and its acceptance criteria, from your tracker or from wherever the branch name, the commits, the change's description or I point.
- Review against the ticket: what it asks for and its acceptance criteria.
  Leave the rest alone unless it breaks something.

### How much to explain

- Right after starting, ask me how well I know the feature this change belongs to, offering these answers, and say I may skip:
  "I know it well", "I know most of it", "I know a little", "It's new to me".
- "I know it well": each step's explanation says only what changed, in one sentence; no background, no terms explained.
- "I know most of it": a sentence or two per step, with background only for what this change adds to the feature.
- "I know a little": open the first step's explanation with two or three sentences on what the feature does and why, then explain as the shared rules say.
- "It's new to me": as "I know a little", and explain each of the feature's own terms the first time it appears.
- When I skip, explain as for "I know a little".

### Steps

- A step is one idea rather than one file, and may span several files.
- Steps are ordered by dependency, so each builds on what I have already read; within a layer, what is called comes before what calls it.
- Where the order is otherwise free, put the step that most needs my attention early rather than last.
- When the change is too big to walk through well, say so in the chat before recording steps, suggest how to split it, and go on only when I say so.
- A test goes into the step whose behaviour it proves, never into a step of its own; a step without tests says so in its explanation.
- Files nobody writes by hand (regenerated, copied in from elsewhere, recorded test output) are folded, each with the reason in a few words.
  Check each folded file against the files it comes from, and comment on a mismatch.
- A file that only looks generated but is written by hand stays unfolded, in the step it serves.
- Look at points to the one or two places in the step I should read first, each labelled in two to four words.

### Explanations

- An explanation says what changed and why, from the code and the ticket; the author session's own summary of the change is never a source.
- The first step's explanation opens with one sentence on what the change makes behave differently.
- Its first paragraph is one or two sentences, 30 words at most, and stands on its own.
  Anything more goes in a second paragraph, behind More, in at most three sentences.
- Give the why, and the alternative the change rejected when the code or the ticket shows one.
- Describe what the code does; judging it is mine, so words such as "clean", "correct", "robust" or "good" stay out.
- Say so when something is assumed rather than read.

### Reviewers

- Reviewer agent: none.
  To hand the reviewing to your own agent, write its name here and the runs it needs, and the rest of this section no longer applies.
- Run reviewers in a fresh context that sees only the change at the pinned head, the ticket, the project and this policy.
- For a change of fewer than 300 changed lines, run one reviewer that covers the project's rules and these concerns: contracts, error handling, state, tests.
- For a larger change, run one reviewer for the project's rules, which quotes the rule behind each finding, and one for each of those concerns.
- Whatever its size, a change that touches sign-in, permissions, money, personal data, stored data's shape or anything hard to undo gets the larger set.
- Pick each run's model by the worst that its files or its question could break.
- A smaller model (today Sonnet) for a run whose files cannot change behaviour, data or security, such as presentation, wording, docs or comments, and for a run that judges only style, structure or simplicity.
- Every other run, and the run that checks the findings, uses the session's own model.
- When unsure, the session's own model.
- A finding states a concrete failure: what input or state leads to what wrong result, at which file and lines.
- Give all the findings at once to a second fresh-context agent, which confirms or refutes each against the code at the head.
- A finding that goes against a convention in the project's instructions is settled; leave it out.
- The reviewers' reports, evidence and verdicts stay in the chat, never on the page.

### Comments

- Comment only on a confirmed finding that matters: it breaks something, misses an acceptance criterion, or goes against the project's rules.
  Leave out unconfirmed findings and matters of taste.
- Put the comment on the lines where the problem is, worded for the author.
- One or two sentences, 40 words at most: what is wrong and what it breaks, then the fix when it is clear.
  No evidence and no verdicts in it.
- Do not repeat what a thread already on the change says.
- On a new head, resolve each of your comments from an earlier review that the new code fixes, without a reply.

### Acceptance criteria

- When the ticket has acceptance criteria, record each one, in the ticket's words, in at most 12 words.
- Mark it met, partly or not-met from the code and the reviewers' check, or not-checked when the code cannot show it.

### Answers

- An answer to my question is at most two sentences, and the first answers it directly.

### My comments

- My comments and replies are mine: never mark them "[AI]", never reword them, and follow my edits and deletions.
- Your comments I kept go out with their "[AI]" mark, as I left them.

### Learning from my review

- Once my review has gone out, look at the comments of yours I deleted or reworded.
- Only when they share a cause that would come up again, suggest in the chat one line for this policy that would have left them out or worded them my way, and change the policy only when I agree; otherwise say nothing.

## My change

### The change

- With no other word from me, walk through my current branch.
- When I name another target branch or a range of commits, walk through that instead.

### Fix list

- When I send to agent, give me one fix list in the chat, ready to paste into the author session.
- Head it with my summary, then each comment with its file and lines and its words as they are.
- The author session makes the fixes; the walkthrough session's work ends at the fix list.

## Someone else's change

### The change

- I name the change by its number or link on your code host.
- Fetch its head from your code host into a local ref, without checking it out, and walk from its base to that ref with a label naming it, such as "PR 123", and its number and title.
- Read the change's description and discussion as well as its ticket.
- When its description shows a screenshot of the change, put it on the step it shows; leave out one that fits no step.

### Threads already on the change

- Before recording the steps, read the change's review threads on your code host.
- Record each unresolved thread from someone else, with its replies and its id on your code host.

### My review

- When I submit, post one finished review on your code host, not a pending one: my review type, my summary and every comment as a line comment on its lines.
- Post my replies in their threads, and resolve the threads I resolved and those you resolved.
- A comment whose lines changed since goes in the review's summary, with its file and line.
- Then record where the review is; when something did not go out, tell me in the chat what.
- The author's branch and the change's description stay as they are.

### Replies to my review

- When I open a change I reviewed again after its author replied or pushed, fetch its new head and go on with the same walkthrough, under the same label.
- Record the threads again, with their new replies, and comment only on what is new since my review.
