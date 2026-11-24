---
description: Review a change someone asked you to review, such as a pull request named by its number or link, on a local page, one step at a time. Use when the person runs /walkthrough:pr or asks to review a colleague's pull request or merge request.
argument-hint: <number or link>
allowed-tools: Bash(walkthrough *)
---

# Walkthrough of a review request

The person reviews a change someone asked them to review: $ARGUMENTS
Without a number or link there, ask them in the chat which change it is before anything else.
For their own change, `/walkthrough` is the procedure instead.

1. Find the review policy and read it, as "Review policy" below says; follow its "Shared rules" and "Someone else's change" parts, and leave the other part out.
   Read the project's instructions for agents (its CLAUDE.md, AGENTS.md and the files they point to).
2. Fetch the change as the policy's "Someone else's change" part says, into a local ref, never checking it out; the person approves those commands as usual.
3. Run `walkthrough start --kind requested --base <rev> --head <rev> --label <label>` in the repo, with a short label naming the change, such as its number.
   Give the same label whenever the person opens this change again, so the walkthrough goes on with their decisions; fetch its head again first.
   Add `--comments` with a few words saying what becomes of the person's own line comments under the policy's "Someone else's change" part, such as `--comments 'Posted with your review'`.
4. Go on as "Walking through" says, until the walkthrough stops.
   Your comments are drafts marked "[AI]" that the person edits or drops on the page, apart from the person's own comments, which are never marked; every draft they keep goes out together with their own comments, as the policy's "Someone else's change" part says, and nothing goes out before they take the action for it.

## Walking through

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself, except in the inbox it prints.
Everything you record goes through a file: write it with your file tool into the inbox, then pass its path with `--file`, as `walkthrough guide` says.
The plugin lets the `walkthrough` commands and those writes run without asking the person; never pass JSON or Markdown through a heredoc, a pipe or `$(...)`, which ask.
Run each `walkthrough` command on its own, never chained with `;`, `&&` or `|`, which also asks.
Every judgement in a walkthrough (how to split, order and fold the change, what to write, what to do with what the person sends) follows the person's review policy and the project's own instructions for agents.
Run any reviewer in a fresh context, and never treat the author session's own summary of the change as evidence (ADR 0002).

1. Pass the options you gave `walkthrough start`, all but `--kind`, to every later `walkthrough` command; they find the walkthrough by them.
2. Tell the person, in one or two lines, what the output of `walkthrough start` says: the change, the pinned base and head, and any warning.
   Keep the inbox it prints for the files you record from.
   A warning about uncommitted changes means those edits are not in the walkthrough; say so plainly.
   The page is already open and shows you preparing; the steps appear on it as soon as you record them.
3. Run `walkthrough guide` and follow the formats it prints; they are the CLI's own and replace anything you remember.
4. Record the steps, as below.
5. The page is open in their browser; they review and decide there.
   Running `walkthrough start` again on the same head reopens the walkthrough with their decisions intact.
   On a new head (the branch moved, or the same label on a new range) it goes on with the walkthrough: steps whose diff is unchanged keep their decisions, changed ones are reopened, and it names the changed files in no step yet.
   Record the steps again with those files in new steps, and tell the person in one line what reopened.
6. Listen for the page, as below, until the walkthrough stops.
7. When the person asks you in the chat to stop, run `walkthrough stop`.
8. When the person asks to share or keep the walkthrough, run `walkthrough export`, with `--out <file>` when they name a place (the person approves that one, since it writes where it names), and tell them the path it prints.
9. When the person asks which walkthroughs they have open or wants to find one they left, run `walkthrough list`; `walkthrough stop --list` ends that page.

## Review policy

The person's policy lives outside every project, and starts as a copy of the template the plugin ships.
It has a part of shared rules and a part for each kind of walkthrough; follow the shared rules and the part this skill names.
Run `walkthrough policy`; its first line names the policy's state and path:

- `yours`: the policy is the person's own; read it with `walkthrough policy show` and go on.
- `template`: the policy is still the unchanged template; offer the interview.
- `none`: the person has none; offer the template and the interview.

Offer in one or two lines: the template's defaults apply until they make the policy theirs, and a short interview does that now.
When they say later, follow the template, which `walkthrough policy show` prints, for this walkthrough; the offer comes again next time.
When they say now:

1. With no policy yet, run `walkthrough policy init` to copy the template there.
2. Read it with `walkthrough policy show`, and go through its sections in order.
   For each, sum up its defaults in a line and ask one short question about how they actually review that part.
   Before asking the next question, write the whole policy with that answer applied to a file in the inbox `walkthrough policy` printed, and save it with `walkthrough policy save --file <file>`; "keep" leaves the section as it is.
   The save uses up the file, so for the next answer write the whole policy again, from the version you last saved, to a new file.
3. The interview is done when every section is asked or they say enough; go on with `walkthrough start`.
Never read or edit the policy file itself; the `walkthrough policy` commands are how you reach it.

## Steps

Run `walkthrough files` for the changed files.
Read the change from git only, between the pinned base and head: `git diff <base> <head>`, `git show <head>:<path>`, `git log`, and `git grep -n <pattern> <head> -- <paths>` to search.
Keep to these: other git commands, such as `git ls-tree`, and flags such as `git grep -A`, ask the person.
Never check anything out.

Split the change into steps, order them, and fold the files not worth reading line by line, as the review policy and the project's instructions say.
Write them to a file in the inbox in the shape `walkthrough guide` prints, and record them with `walkthrough steps --file <file>`.
A step's explanation is its overview, at the top of the step; a file in it can carry a short explanation of its own, shown just above its diff, for what only that file needs, never repeating the overview.
Whether a file gets one comes from the review policy.
The CLI only checks that every changed file is in exactly one step; when it refuses, it names every problem, so fix them and record again.
Recording again replaces the steps and prints their ids; a step keeps its id by its files, and the person's decision while its diff is unchanged.

## Checklist

When the review policy asks for a checklist, record it after the steps with `walkthrough checklist --file <file>` in the shape `walkthrough guide` prints; what it lists and the statuses it uses come from the policy.
Its links name the step ids `walkthrough steps` printed; a link to a step that is gone shows as gone, so record the checklist again when you merge or drop steps.
An item keeps its id, and the person's decision, while its text is the same; when you reword an item, give it its id so its decision reopens instead of being lost.

## Notes

Pin what the person should see in place (findings, risks, anything the review policy names) with `walkthrough note --file <file>` in the shape `walkthrough guide` prints, on a step or on lines of a file in it.
Labels, what counts as low priority, and what to note at all come from the review policy.
Flag each note the review policy calls a finding with `"finding": true`; the flag, never the label's words, is what the page marks as a finding and counts as open until the person decides it.
Notes name step ids, so record them after the steps.
A note whose step or lines leave the change, or whose lines change, stays on the page as detached.

## Actions

Record the actions the page offers on steps, notes, checklist items, the verdict and the whole walkthrough with `walkthrough actions --file <file>` in the shape `walkthrough guide` prints, after the items they are on.
Which actions to offer, their labels, and which ask for a note or let the person edit the text first come from the review policy, and so does each action's `tone`, the colour its decision shows in: `"positive"` green, `"attention"` amber, or `"none"` grey, the same as leaving it out.
A step with none recorded offers Approve, positive, and Flag, attention.
The page ends with a Summary, where the person chooses their verdict on the whole walkthrough and takes its finishing action.
Offer the verdict's choices on the verdict and the finishing action first on the whole walkthrough, as the review policy names them, each with a short hint saying where it goes; the finishing action waits for a verdict.
A step or checklist item that is gone takes its actions with it, so record actions on new ones.
`walkthrough decisions` prints every item with the person's latest decision, or null while undecided; use it after a restart instead of guessing.

## Checking steps

When the review policy has you check the steps after recording them, such as with its reviewers, mark every step you will check with `walkthrough checking <step id>...` right after `walkthrough steps`.
The page then holds those steps' actions, so the person cannot decide a step before its findings are on it.
As you finish each step, in reading order, pin that step's notes and record their actions, then run `walkthrough checking` again with the steps still left, and with no ids once the last one is done.
A note pinned on a step after it was cleared is still allowed; the page warns the person.

## Listening for the page

The page reaches you only while `walkthrough listen` runs, and the chat stays free while it does.

1. Run `walkthrough listen` in the repo with the Bash tool's `run_in_background: true` and `timeout: 7200000`.
   Never run it in the foreground: it blocks until the person acts on the page.
2. When it exits you are woken with its output, one JSON line per thing the person sent, in the shapes `walkthrough guide` prints.
   - An ask: answer it from the change at the pinned head with `walkthrough say --answer <id> '<answer>'`.
     An ask with a file and lines is about those lines, and the answer is a note on them, labelled with `--as "<label>"` as the review policy names it ("Answer" without one); `say` prints its id, so you can record actions on it.
     An answer never decides the step for the person.
     Pass short text in single quotes, writing a single quote in it as `'\''`; for longer text, write it to a file in the inbox and pass `--file <file>` in place of the text.
   - A reply: the person's reply to a question you asked or to a note, which comes with the note's label and text; act on it, then say what you did with `walkthrough say --answer <id> '<what you did>'`.
   - A decision: the action the person took on an item, with any note and edited text; act on it as the review policy says, then say what you did with `walkthrough say --answer <id> '<what you did>'`.
     A decision on the verdict is the person's verdict on the whole walkthrough; keep it for the finishing action, which carries it as the review policy says.
     A later decision on the same item replaces the earlier one.
     A decision with `"clear": true` is the person taking theirs back with Undo: the item is undecided again; act on it as the review policy says, then answer it the same way.
   - A comment: the person's own words on lines, with its id; never mark it "[AI]" and never reword it.
     Act on it as the review policy says, such as putting it on the fix list or into the review to post, then say what you did with `walkthrough say --answer <id> '<what you did>'`.
     An `edit-comment` or `delete-comment` changes or takes back the comment it names; follow it the same way and answer it.
     Once comments have gone out as the policy says, run `walkthrough posted <comment id>...`, so the page stops offering to edit or delete them; `walkthrough comments` lists them as they are now, such as after a restart.
   - Stopped: tell the person in one line and do not listen again.
3. Start listening again right after answering, every time, before you end your turn.
4. Exit code 3 means another `walkthrough listen` took over; do not listen again from this session.

To ask the person something on the page, run `walkthrough say --question '<question>'` and listen; their reply comes back as a reply line.
When the question has a few likely answers, offer each with `--choice '<answer>'`; the page shows them as buttons.
The page shows you as working until you have answered everything listen handed you, and as gone when you stop listening and do not come back.
