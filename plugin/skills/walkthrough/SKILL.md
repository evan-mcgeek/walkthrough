---
name: walkthrough
description: Walk through your own change, the current branch or any base and head, on a local page, one step at a time. Use when the person runs /walkthrough or asks to walk through or review their own branch or change.
allowed-tools: Bash(walkthrough *)
---

# Walkthrough of your own change

The person reviews their own change, the current branch unless they name another, before colleagues see it.
When they ask instead to review a change someone else asked them to review, `/walkthrough:pr` is the procedure for that.

1. Find the review policy and read it, as "Review policy" below says; follow its "Shared rules" and "My change" parts, and leave the other part out.
   Read the project's instructions for agents (its CLAUDE.md, AGENTS.md and the files they point to).
2. Run `walkthrough start` in the repo.
   With no options it walks through the current branch; if the person names the branch their change targets, add `--target <branch>`.
   For a range of commits, add `--base <rev> --head <rev>` and a short `--label` to name it.
3. Unless start printed "Already reviewed at this head" or "Last reviewed at", or counted steps already recorded, ask the person in the chat how well they know the feature, with your question tool so they pick rather than type, offering the policy's four answers, from "I know it well" to "It's new to me", and saying they may skip.
   Read the change while they answer; their answer sets how much your explanations say, as the policy says.
4. Go on as "Walking through" says, until the walkthrough stops.
   The page ends in Send to agent: the person's comments and yours go back as a fix list, as the policy's "My change" part says.

## Walking through

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself, except in the inbox it prints.
Everything you record goes through a file: write it with your file tool into the inbox, then pass its path with `--file`, as `walkthrough guide` says.
The plugin lets the `walkthrough` commands and those writes run without asking the person; never pass JSON or Markdown through a heredoc, a pipe or `$(...)`, which ask.
Run each `walkthrough` command on its own, never chained with `;`, `&&` or `|`, which also asks.
Every judgement in a walkthrough (how to split, order and fold the change, what to comment on, how much to write) follows the person's review policy and the project's own instructions for agents.
Run any reviewer in a fresh context, and never treat the author session's own summary of the change as evidence (ADR 0002).
Your working notes (evidence, reviewers' verdicts, plans) stay in the chat; the page gets only steps, comments, criteria and answers.

1. Pass the source options you gave `walkthrough start`, all but `--pr` and `--title`, to every later `walkthrough` command; they find the walkthrough by them.
2. Tell the person, in one or two lines, what the output of `walkthrough start` says: the change, the pinned base and head, and any warning.
   Keep the inbox it prints for the files you record from.
   A warning about uncommitted changes means those edits are not in the walkthrough; say so plainly.
   The page is not open yet; tell the person it opens when the review is nearly done.
   When start prints "Already reviewed at this head", the walkthrough is ready from an earlier session: record no steps and do not review it again.
   Tell the person in one line what that line says, run `walkthrough open`, and start listening for the page, as "Listening for the page" says.
   If start also warned about uncommitted changes, add one line: commit them for the AI to review what changed.
   If the person asks in the chat to review it again, read `walkthrough comments --all` first, then review as "Reviewing" says without repeating a comment already there.
   When start counts steps already recorded but prints neither "Already reviewed at this head" nor "Last reviewed at", an earlier session stopped before the review was done: keep its steps, read its comments with `walkthrough comments --all`, and finish the review without repeating a comment.
   Whenever start finds an earlier walkthrough, tell the person in one line what it already holds: its steps, and the comments pending or sent.
3. Run `walkthrough guide` and follow the formats it prints; they are the CLI's own and replace anything you remember.
4. Record the steps, as "Steps" below says, then start listening for the page, as "Listening for the page" says; while you review, the page takes a running listen as the sign that you are still at work.
5. Review the change, as "Reviewing" says.
6. Once the walkthrough is ready, the person reads, marks files Viewed, comments and submits on the page.
   Running `walkthrough start` again on the same head resumes the walkthrough as they left it; run `walkthrough open` if they need the page again.
   On a new head (the branch moved, or the same label on a new range) the walkthrough is not ready again, each step keeps the files that still change, and start names the files in no step yet.
   When start also prints "Last reviewed at <head>", ask the person with your question tool what to review, before anything else:
   - "What changed" (recommended): the commits since that head, and whether each comment was addressed.
   - "The whole change": everything again, as in the first review.
   For what changed, read `git log` and `git diff` from that head to the new one, record the steps again with the files start named, and review only those commits as "Reviewing" says, measuring them rather than the whole change; check each comment in `walkthrough comments --all` against them.
   For the whole change, review as "Reviewing" says, without repeating a comment already there.
   Either way, skip `walkthrough open` while their page is still open, and for each of your comments the new code fixes run `walkthrough resolve <id>`, without a reply.
   Tell the person in one line what is new, and which of their comments the new code addresses; they resolve those themselves.
7. When the person asks you in the chat to stop, run `walkthrough stop`.
8. When the person asks to share or keep the walkthrough, run `walkthrough export`, with `--out <file>` when they name a place (the person approves that one, since it writes where it names), and tell them the path it prints.
9. When the person asks which walkthroughs they have open or wants to find one they left, run `walkthrough list`; `walkthrough stop --list` ends that page.

## Review policy

The person's policy lives outside every project, and starts as a copy of the template the plugin ships.
It has a part of shared rules and a part for each kind of walkthrough; follow the shared rules and the part this skill names.
Run `walkthrough policy`; its first line names the policy's state and path:

- `yours`: the policy is the person's own; read it with `walkthrough policy show` and go on.
- `template`: the policy is still the unchanged template.
- `none`: the person has none, so the template applies.

While it is `none` or `template`, ask one question before the review, with your question tool: the template's defaults apply; set it up now, in a few short questions, or later.
Now: invoke `/walkthrough:init` with your skill tool and follow its steps 1 to 3, then read the policy with `walkthrough policy show` and go on with this review.
Later: follow the template, which `walkthrough policy show` prints, for this walkthrough; the question comes again next time.
Never read or edit the policy file itself; the `walkthrough policy` commands are how you reach it.

## Steps

Run `walkthrough files` for the changed files.
Read the change from git only, between the pinned base and head: `git diff <base> <head>`, `git show <head>:<path>`, `git log`, and `git grep -n <pattern> <head> -- <paths>` to search.
Keep to these: other git commands, such as `git ls-tree`, and flags such as `git grep -A`, ask the person.
Never check anything out.

Read the ticket and its acceptance criteria as the policy says, then split the change into steps, order them, and fold the files not worth reading line by line.
Give each step a title, one or two Look at pointers to what to read first, and a short explanation whose first paragraph shows and whose rest waits behind More; the person's answer to the familiarity question sets how much it says.
Write them to a file in the inbox in the shape `walkthrough guide` prints, and record them with `walkthrough steps --file <file>`.
The CLI only checks that every changed file is in exactly one step; when it refuses, it names every problem, so fix them and record again.
Recording again replaces the steps and prints their ids; a step keeps its id while it keeps most of its files, and the person's Viewed marks and comments with it.

## Reviewing

Until you run `walkthrough ready`, the page shows the AI at work and the changed files, not the steps; on ready it shows the whole walkthrough at once.

1. Review the change against the ticket and its acceptance criteria, as the policy says, with the reviewers it names.
   Before any reviewer starts, measure the change as the policy says and tell the person the size and the runs the policy names for it, such as "173 changed lines: one reviewer, then one check of its findings, as the policy says"; run exactly those.
   While you review, tell the person how it goes in a line or two in the chat, such as which reviewers run and when they report.
2. Once the reviewers have reported, or your own review is done when the policy names none, run `walkthrough open`; the page opens on the AI at work while you record the rest.
   When the person asks to see the page before that, run it at once.
3. Step by step, in reading order, record your comments on that step's lines with `walkthrough comment --file <file>`, only where the policy says a comment is worth it.
   A comment about a file as a whole leaves out its lines and sits on the file.
   Write a comment's body without the `[AI]` mark; the page adds it.
   When the policy asks for the person's voice, read their VOICE.md (the project root, then `~/.claude/VOICE.md`) before writing the comments that go out; with none, write as the policy says.
   Each comment is pending: it goes out with the review unless the person edits or deletes it.
4. When the policy has you read the threads already on the change, record them with `walkthrough threads --file <file>`.
5. Record the acceptance criteria as you checked them with `walkthrough criteria --file <file>`, after your comments: one partly or not met links the comment that closes its gap, as the policy says.
6. Run `walkthrough ready` once every comment, thread and criterion is recorded; it opens the page too if it was never opened.
   A comment you record after that lands on the page while the person reads.

## Listening for the page

The page reaches you only while `walkthrough listen` runs, and the chat stays free while it does.
Keep listening until the walkthrough stops.

1. Run `walkthrough listen` in the repo with the Bash tool's `run_in_background: true` and `timeout: 7200000`.
   Never run it in the foreground: it blocks until the person acts on the page.
2. When it exits you are woken with its output, one JSON line per thing the person sent, in the shapes `walkthrough guide` prints.
   - An ask: the person asked you about their picked lines or in a thread, which comes with what the thread said before.
     Answer from the change at the pinned head with `walkthrough say --answer <id> '<answer>'`; the answer is a reply in that thread, stays on the page and never goes out.
     Pass short text in single quotes, writing a single quote in it as `'\''`; for longer text, write it to a file in the inbox and pass `--file <file>` in place of the text.
   - A submit: the person finished their review, with its summary, and on a pull request its type.
     Read what goes out with `walkthrough comments`: their comments as they are now, yours with the `[AI] ` mark at the start, their replies and the threads they resolved.
     On a pull request, post it as one finished review on the code host, as the policy's part for this walkthrough says: the chosen type, the summary, every comment, the replies in their threads, and the resolved threads resolved; then run `walkthrough posted --address <the review's address>`.
     A comment with `"subject": "file"` has no lines: post it as a comment on that file.
     A resolve line with `"by": "ai"` is one you resolved: resolve that thread on the code host too, finding it by the file, lines (or subject) and body the line gives.
     On the person's own change, hand the comments to the agent as the policy's part for this walkthrough says, as a fix list in the chat, then run `walkthrough posted`.
     End the fix list with the line "Once these are fixed and committed, run /walkthrough:update.", so the agent that fixes them asks for the next review; when you make the fixes yourself, invoke `/walkthrough:update` with your skill tool once they are committed.
     How to post comes from the policy; when something could not go out, tell the person in the chat, and run `walkthrough posted` only once the review is out.
     Then, when the policy asks you to learn from the review, read `walkthrough comments --all`: a comment of yours with "deleted" was deleted, and one with "wrote" was reworded from what you wrote; save a policy change the person agrees to with `walkthrough policy save --file <file>`, writing the whole policy from `walkthrough policy show`.
     When the comments they reworded differ mostly in tone rather than content, and the policy has no line about their voice and no "Never offer the voice plugin.", suggest `/walkthrough:init`'s voice offer in one line instead of a policy line.
   - Stopped: tell the person in one line and do not listen again.
3. Start listening again right after handling what woke you, every time, before you end your turn.
4. Exit code 3 means another `walkthrough listen` took over; do not listen again from this session.

Answer only an ask; never reply to anything else on the page.
The person's comments, replies, edits, deletions, Resolve and Viewed never wake you and need no answer.
Their comments are their words, never yours: never mark them `[AI]` and never reword them; post or hand them on exactly as `walkthrough comments` prints them.
