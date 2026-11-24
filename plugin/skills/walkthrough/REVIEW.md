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

- Before recording anything, read the ticket or spec the change is for, from your tracker or from wherever the branch name, the commits, the change's description or I point.

### Comments already on the change

- Before recording the steps, find the change's open pull request on your code host, if it has one, and read its review threads.
- Pin each unresolved thread from someone else as a note labelled "Thread" on its lines, never flagged as a finding, with the reviewer's check of whether it still holds at the head.

### Steps

- A step is one idea rather than one file, and may span several files.
- Steps are ordered by dependency, so each builds on what I have already read; within a layer, what is called comes before what calls it.
- A test goes into the step whose behaviour it proves, never into a step of its own; a step without tests says so in its explanation.
- Files nobody writes by hand (regenerated, copied in from elsewhere, recorded test output) are folded, each with the reason it was folded.
  Check each folded file against the files it comes from, and record any mismatch as a problem of the folded step.
- A file that only looks generated but is written by hand stays in the step it serves.

### Explanations

- An explanation says what changed and why, from the code and the ticket; the author session's own summary of the change is never a source.
- Short sentences, one idea per step.
- Give the why, and the alternative the change rejected when the code or the ticket shows one.
- Describe what the code does; the verdict is mine, so verdict words such as "clean", "correct", "robust" or "good" stay out.
- What you assumed rather than read goes in the step's assumptions, not in its explanation.
- The step's explanation is the overview; give a file its own explanation only when it needs a word the overview does not give, such as its part in the step or what to look at in it.
  Keep it to a sentence or two about that file alone, and never repeat the overview.

### Checklist

- When the ticket or spec has acceptance criteria, record them as a checklist titled "Acceptance criteria", one item per criterion, linked to the steps that deliver it.
- Statuses: "met", "partly met" or "not shown", marked "met", "partly" and "not-met".
- An item's text is the criterion as the ticket words it, never its evidence; the reason for its status follows the status word in at most eight words, such as "partly met: the added segment counts as started".
- Add one last item, "Serves no criterion", linked to every step that delivers none of them.

### Reviewers and findings

#### Who reviews

- Reviewer agent: none.
  To hand the reviewing to your own agent, write its name here and the runs it needs, and the rest of "Who reviews" no longer applies.
- Run reviewers in a fresh context that sees only the change at the pinned head, the project and this policy.
- Run one reviewer for the project's own rules, which quotes the rule behind each finding, and one for each of these concerns: contracts, error handling, state, tests.
- For a change of fewer than 300 changed lines, run one reviewer that covers the project's rules and all four concerns.
- A finding states a concrete failure: what input or state leads to what wrong result, at which file and lines.
- Give all the findings at once to a second fresh-context agent, which confirms or refutes each against the code at the head.
- A finding that goes against a convention in the project's instructions is settled; leave it out.
- "The reviewer" in this policy is the reviewer agent when one is named, and a fresh-context agent otherwise.

#### What happens to findings

- Pin each confirmed finding as a note labelled "Finding" on its lines, flagged as a finding, unless the part for this walkthrough says otherwise.
- Pin the unconfirmed ones, and anything the reviewer calls a matter of taste or judgement, with the low-priority flag.
- When the reviewer reports each acceptance criterion as met, partly met or not shown, use that for the checklist.
- Check the steps in reading order: run the reviewers over the whole change, then confirm and pin each step's findings before the next, and keep every step marked as being checked until its findings are pinned with their actions.

### My own comments

- My line comments are mine: never mark them "[AI]", never reword them, and follow my edits and deletions.

### Drafts

- Anything you draft to go out under my name, a comment or a reply, is one or two sentences.
- It starts with the marker "[AI]", and keeps it after I edit the text; put the marker back if my edit dropped it.
- Pin each draft as a note labelled "Draft" on its lines, never flagged as a finding, since it is not waiting for me.

### Actions

- An action's tone is the colour my decision shows in on the page: positive is green, attention is amber, and none is grey; an action I give no tone here has none.
- A step: Approve, positive, and Flag, attention (asks for a note).
- A finding on my change: Accept, positive, Reject (asks for a note with the reason, which I may leave out), and Ignore, with no tone.
- A checklist item: Met, positive, and Not met, attention (asks for a note).
- A draft: Edit (lets me edit the text first), and Drop; a draft I leave alone goes out as drafted, and drafts go out together, never one by one.
- The rest of the actions are in the part for this walkthrough.
- When I reject a finding, my note is the reason; the part for this walkthrough says what becomes of it.
- When I ignore a finding, do nothing with it and do not raise it again in this walkthrough.
- When I mark a checklist item Met or Not met, record the checklist again with my mark as its status.
- When I undo a decision, take back what you did for it, such as a fix list entry or a draft, and tell me when something already went out and cannot be taken back.

## My change

### The change

- With no other word from me, walk through my current branch.
- When I name another target branch or a range of commits, walk through that instead.

### Fix list

- Offer my verdict on the verdict, "Ready for colleagues", positive, or "Needs fixes", attention, with the hint "Shown to colleagues with the fix list."
- Offer "Send the fix list to the session" first on the whole walkthrough, with a hint saying it gives me the fix list in the chat.
- Flagged steps, accepted findings and my own line comments go on a fix list: for each, the step, the file and lines, my note, the finding or my comment.
- When I take Send the fix list to the session, give me the fix list in the chat as one message, ready to paste into an author session, headed by my verdict.
- The author session makes the fixes; the walkthrough session's work ends at the fix list.

### Rejected findings become conventions

- Turn a rejected finding into a convention for the project's instructions for agents: a statement about the project ("Prices are whole cents"), rather than an instruction to reviewers.
- Place it under the instructions' existing conventions section, or under a new "Conventions" section.
- Show it to me on the page as a diff and ask Yes or No; write it to the working tree only on my yes, and leave it uncommitted.

### A review I received

- The threads pinned as "Comments already on the change" says are the review I received.
- On each thread offer Accept (goes on the fix list) and Push back (you draft a reply).
- Offer "Send my replies" on the whole walkthrough as well; replies go into a pending review on your code host that I submit myself.

## Someone else's change

### The change

- I name the change by its number or link on your code host.
- Fetch its head from your code host into a local ref, without checking it out, and walk from its base to that ref with a label naming it, such as "PR 123".
- Read the change's description and discussion as well as its ticket.

### How much to explain

- Right after starting, ask me how well I know the feature this change belongs to, offering these answers, and say I may skip:
  "I know it well", "I know most of it", "I know a little", "It's new to me".
- "I know it well": each step's explanation says only what changed, in one sentence; no background, no terms explained.
- "I know most of it": a sentence or two per step, with background only for what this change adds to the feature.
- "I know a little": open the first step's explanation with two or three sentences on what the feature does and why, then explain as the shared rules say.
- "It's new to me": as "I know a little", and explain each of the feature's own terms the first time it appears.
- When I skip, explain as for "I know a little".

### My review

- Pin each confirmed finding as a draft comment on its lines, worded for the author, in place of a "Finding" note: there is nothing to accept first, and a draft I leave alone goes out.
- Pin the unconfirmed ones and matters of taste as low-priority notes with no actions; I write my own comment when I want one to go out.
- Turn each flagged step into a draft comment on its lines.
- My own line comments go into the review as line comments, as I wrote them.
- Offer my verdict on the verdict, "Approve", positive, "Request changes", attention, or "Comment", with no tone, with the hint "Sent with the review."
- Offer "Send my review" first on the whole walkthrough, with a hint saying it sends every draft I kept and my own comments at once, as a pending review I submit myself.
- When I take Send my review, put every draft I did not drop, as drafted or as I edited it, and my own comments into one pending review on your code host, joining my existing pending review when there is one; I submit it myself, with my verdict, which you name in the chat.
- The author's branch and the change's description stay as they are.

### Dropped drafts

- A draft I drop is gone; do not raise it again in this walkthrough, and leave the project's files as they are.

### Replies to my review

- When I open a change I reviewed again after its author replied or pushed, fetch its new head and go on with the same walkthrough, under the same label: steps whose diff is unchanged keep my decisions, and changed ones reopen.
- Pin only the threads with new activity, each with the reviewer's check of whether the replies or the new commits resolve my concern.
- On each thread offer Resolve, Reply (you draft one) and Still blocking (asks for a note).
- Offer "Send my replies" on the whole walkthrough; replies go into a pending review that I submit myself.
- Resolve the threads I marked Resolve on your code host only after you have confirmed there that my review was submitted.
