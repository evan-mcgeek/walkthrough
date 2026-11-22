# Review policy

How I review a change.
The walkthrough session reads this on every walkthrough, together with the project's instructions for agents, and follows both.
Where they disagree about the project's own code, the project's instructions win; about how I review, this policy wins.
Every rule here is a default; edit any of it.

## The change

- With no other word from me, walk through my current branch.
- For a colleague's change, fetch its head from your code host into a local ref, without checking it out, and walk from its base to that ref with a label naming it.
- Before recording anything, read the ticket or spec the change is for, from your tracker or from wherever the branch name, the commits or I point.

## Steps

- A step is one idea rather than one file, and may span several files.
- Steps are ordered by dependency, so each builds on what I have already read; within a layer, what is called comes before what calls it.
- A test goes into the step whose behaviour it proves, never into a step of its own; a step without tests says so in its explanation.
- Files nobody writes by hand (regenerated, copied in from elsewhere, recorded test output) are folded, each with the reason it was folded.
  Check each folded file against the files it comes from, and record any mismatch as a problem of the folded step.
- A file that only looks generated but is written by hand stays in the step it serves.

## Explanations

- An explanation says what changed and why, from the code and the ticket; the author session's own summary of the change is never a source.
- Short sentences, one idea per step.
- Give the why, and the alternative the change rejected when the code or the ticket shows one.
- Describe what the code does; the verdict is mine, so verdict words such as "clean", "correct", "robust" or "good" stay out.
- What you assumed rather than read goes in the step's assumptions, not in its explanation.

## Checklist

- When the ticket or spec has acceptance criteria, record them as a checklist titled "Acceptance criteria", one item per criterion, linked to the steps that deliver it.
- Statuses: "met", "partly met" or "not shown".
- Add one last item, "Serves no criterion", linked to every step that delivers none of them.

## Reviewers and findings

- Run reviewers in a fresh context that sees only the change at the pinned head, the project and this policy.
- Run one reviewer for the project's own rules, which quotes the rule behind each finding, and one for each of these concerns: contracts, error handling, state, tests.
- A finding states a concrete failure: what input or state leads to what wrong result, at which file and lines.
- Give each finding to a second fresh-context agent, which confirms or refutes it against the code at the head.
- Pin each confirmed finding as a note labelled "Finding" on its lines.
- Pin the unconfirmed ones, and anything that is a matter of taste, with the low-priority flag.
- A finding that goes against a convention in the project's instructions is settled; leave it out.

## Drafts for colleagues

- Anything you draft to go out under my name, a comment or a reply, is one or two sentences.
- It starts with the marker "AI draft:", and keeps it after I edit the text; put the marker back if my edit dropped it.
- Pin each draft as a note labelled "Draft" on its lines.

## Actions

- A step: Approve, and Flag (asks for a note).
- A finding: Accept, and Reject (asks for a note with the reason).
- A draft: Post (lets me edit the text first), and Drop.
- The rest of the actions are listed with each kind of walkthrough below.

## Rejected findings become conventions

- When I reject a finding, my note is the reason.
- Turn it into a convention for the project's instructions for agents: a statement about the project ("Prices are whole cents"), rather than an instruction to reviewers.
- Place it under the instructions' existing conventions section, or under a new "Conventions" section.
- Show it to me on the page as a diff and ask Yes or No; write it to the working tree only on my yes, and leave it uncommitted.
- On a colleague's change, turn it into a draft suggestion for the colleague instead, and leave the project's files as they are.

## My own change

- Offer "Hand over fixes" on the whole walkthrough.
- Flagged steps and accepted findings go on a fix list: for each, the step, the file and lines, my note and the finding.
- When I take Hand over fixes, give me the fix list in the chat as one message, ready to paste into an author session.
- The author session makes the fixes; the walkthrough session's work ends at the fix list.

## A colleague's change

- Offer "Send my review" on the whole walkthrough.
- Turn each flagged step and accepted finding into a draft comment on its lines.
- When I take Send my review, put the posted drafts into one pending review on your code host, joining my existing pending review when there is one; I submit it myself.
- The colleague's branch and the change's description stay as they are.

## A review I received

- When I name my own change that has unanswered review threads, walk through it and pin each such thread as a note labelled "Thread" on its lines.
- A fresh-context agent checks whether each comment holds at the head; add its verdict and evidence to the thread's note.
- On each thread offer Accept (goes on the fix list) and Push back (you draft a reply).
- Offer "Hand over fixes" and "Send my replies" on the whole walkthrough; replies go into a pending review on your code host that I submit myself.

## Replies to my review

- When I name a change I reviewed that has new replies, walk through the commits since my review: from the commit I reviewed to the head.
- Pin only the threads with new activity, each with a fresh-context agent's check of whether the replies or the new commits resolve my concern.
- On each thread offer Resolve, Reply (you draft one) and Still blocking (asks for a note).
- Offer "Send my replies" on the whole walkthrough; replies go into a pending review that I submit myself.
- Resolve the threads I marked Resolve on your code host only after you have confirmed there that my review was submitted.
