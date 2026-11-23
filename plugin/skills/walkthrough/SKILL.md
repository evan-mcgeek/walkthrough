---
name: walkthrough
description: Walk through a change, the current branch or any base and head, on a local page, one step at a time. Use when the person runs /walkthrough or asks to walk through or review their branch or a change.
allowed-tools: Bash(walkthrough *)
---

# Walkthrough

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself, except in the inbox it prints.
Everything you record goes through a file: write it with your file tool into the inbox, then pass its path with `--file`, as `walkthrough guide` says.
The plugin lets the `walkthrough` commands and those writes run without asking the person; never pass JSON or Markdown through a heredoc, a pipe or `$(...)`, which ask.
Run each `walkthrough` command on its own, never chained with `;`, `&&` or `|`, which also asks.
Every judgement in a walkthrough (how to split, order and fold the change, what to write, what to do with what the person sends) follows the person's review policy and the project's own instructions for agents.
Before step 1, find the review policy as below, read it, and read the project's instructions for agents (its CLAUDE.md, AGENTS.md and the files they point to).
Run any reviewer in a fresh context, and never treat the author session's own summary of the change as evidence (ADR 0002).

1. Run `walkthrough start` in the repo.
   With no options it walks through the current branch; if the person names the branch their change targets, pass `--target <branch>`.
   For any other change (a range of commits, a colleague's change you fetched as the policy says), pass `--base <rev> --head <rev>` and a short `--label` to name it.
   Pass the same options to every later `walkthrough` command; they find the walkthrough by them.
2. Tell the person, in one or two lines, what the output says: the branch, the pinned base and head, and any warning.
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
3. The interview is done when every section is asked or they say enough; go on with `walkthrough start`.
Never read or edit the policy file itself; the `walkthrough policy` commands are how you reach it.

## Steps

Run `walkthrough files` for the changed files.
Read the change from git only, between the pinned base and head: `git diff <base> <head>` and `git show <head>:<path>`.
Never check anything out.

Split the change into steps, order them, and fold the files not worth reading line by line, as the review policy and the project's instructions say.
Write them to a file in the inbox in the shape `walkthrough guide` prints, and record them with `walkthrough steps --file <file>`.
The CLI only checks that every changed file is in exactly one step; when it refuses, it names every problem, so fix them and record again.
Recording again replaces the steps and prints their ids; a step keeps its id by its files, and the person's decision while its diff is unchanged.

## Checklist

When the review policy asks for a checklist, record it after the steps with `walkthrough checklist --file <file>` in the shape `walkthrough guide` prints; what it lists and the statuses it uses come from the policy.
Its links name the step ids `walkthrough steps` printed; a link to a step that is gone shows as gone, so record the checklist again when you merge or drop steps.
An item keeps its id, and the person's decision, while its text is the same; when you reword an item, give it its id so its decision reopens instead of being lost.

## Notes

Pin what the person should see in place (findings, risks, anything the review policy names) with `walkthrough note --file <file>` in the shape `walkthrough guide` prints, on a step or on lines of a file in it.
Labels, what counts as low priority, and what to note at all come from the review policy.
Notes name step ids, so record them after the steps.
A note whose step or lines leave the change, or whose lines change, stays on the page as detached.

## Actions

Record the actions the page offers on steps, notes, checklist items and the whole walkthrough with `walkthrough actions --file <file>` in the shape `walkthrough guide` prints, after the items they are on.
Which actions to offer, their labels, and which ask for a note or let the person edit the text first come from the review policy; a step with none recorded offers Approve and Flag.
A step or checklist item that is gone takes its actions with it, so record actions on new ones.
`walkthrough decisions` prints every item with the person's latest decision, or null while undecided; use it after a restart instead of guessing.

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
     A later decision on the same item replaces the earlier one.
   - Stopped: tell the person in one line and do not listen again.
3. Start listening again right after answering, every time, before you end your turn.
4. Exit code 3 means another `walkthrough listen` took over; do not listen again from this session.

To ask the person something on the page, run `walkthrough say --question '<question>'` and listen; their reply comes back as a reply line.
When the question has a few likely answers, offer each with `--choice '<answer>'`; the page shows them as buttons.
The page shows you as working until you have answered everything listen handed you, and as gone when you stop listening and do not come back.
