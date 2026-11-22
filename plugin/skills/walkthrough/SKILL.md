---
name: walkthrough
description: Walk through a change, the current branch or any base and head, on a local page, one step at a time. Use when the person runs /walkthrough or asks to walk through or review their branch or a change.
allowed-tools: Bash(walkthrough *) Bash(cmp *)
---

# Walkthrough

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself.
Every judgement in a walkthrough (how to split, order and fold the change, what to write, what to do with what the person sends) follows the person's review policy and the project's own instructions for agents.
Before step 1, find the review policy as below, read it, and read the project's instructions for agents (its CLAUDE.md, AGENTS.md and the files they point to).
Run any reviewer in a fresh context, and never treat the author session's own summary of the change as evidence (ADR 0002).

1. Run `walkthrough start` in the repo.
   With no options it walks through the current branch; if the person names the branch their change targets, pass `--target <branch>`.
   For any other change (a range of commits, a colleague's change you fetched as the policy says), pass `--base <rev> --head <rev>` and a short `--label` to name it.
   Pass the same options to every later `walkthrough` command; they find the walkthrough by them.
2. Tell the person, in one or two lines, what the output says: the branch, the pinned base and head, and any warning.
   A warning about uncommitted changes means those edits are not in the walkthrough; say so plainly.
   The page is already open and shows you preparing; the steps appear on it as soon as you record them.
3. Run `walkthrough guide` and follow the formats it prints; they are the CLI's own and replace anything you remember.
4. Record the steps, as below.
5. The page is open in their browser; they review and decide there.
   Running `walkthrough start` again on the same head reopens the walkthrough with their decisions intact.
6. Listen for the page, as below, until the walkthrough stops.
7. When the person asks you in the chat to stop, run `walkthrough stop`.

## Review policy

The person's policy lives at `${XDG_CONFIG_HOME:-$HOME/.config}/walkthrough/REVIEWER.md`, outside every project; the template is `${CLAUDE_SKILL_DIR}/REVIEWER.md`.
Compare them with `cmp "${CLAUDE_SKILL_DIR}/REVIEWER.md" "${XDG_CONFIG_HOME:-$HOME/.config}/walkthrough/REVIEWER.md"`:

- Exit 1, the files differ: the policy is the person's own; read it and go on.
- Exit 0, silent: the policy is still the unchanged template; offer the interview.
- Exit 2 naming the policy: the person has none; offer the template and the interview.

Offer in one or two lines: the template's defaults apply until they make the policy theirs, and a short interview does that now.
When they say later, follow the template for this walkthrough; the offer comes again next time.
When they say now:

1. With no policy yet, copy the template there: `mkdir -p "${XDG_CONFIG_HOME:-$HOME/.config}/walkthrough" && cp "${CLAUDE_SKILL_DIR}/REVIEWER.md" "${XDG_CONFIG_HOME:-$HOME/.config}/walkthrough/REVIEWER.md"`.
2. Go through the policy's sections in order.
   For each, sum up its defaults in a line and ask one short question about how they actually review that part.
   Edit their copy to match the answer before asking the next question; "keep" leaves the section as it is.
3. The interview is done when every section is asked or they say enough; read their policy and go on with `walkthrough start`.

## Steps

Run `walkthrough files` for the changed files.
Read the change from git only, between the pinned base and head: `git diff <base> <head>` and `git show <head>:<path>`.
Never check anything out.

Split the change into steps, order them, and fold the files not worth reading line by line, as the review policy and the project's instructions say.
Record them with `walkthrough steps` in the shape `walkthrough guide` prints.
The CLI only checks that every changed file is in exactly one step; when it refuses, it names every problem, so fix them and record again.
Recording again replaces the steps; a step keeps the person's decision only while its id and diff stay the same, so record before they start deciding.

## Checklist

When the review policy asks for a checklist, record it after the steps with `walkthrough checklist` in the shape `walkthrough guide` prints; what it lists and the statuses it uses come from the policy.
Its links name step ids, so record it again after recording the steps again.

## Notes

Pin what the person should see in place (findings, risks, anything the review policy names) with `walkthrough note` in the shape `walkthrough guide` prints, on a step or on lines of a file in it.
Labels, what counts as low priority, and what to note at all come from the review policy.
Notes name step ids, so record them after the steps.

## Actions

Record the actions the page offers on steps, notes, checklist items and the whole walkthrough with `walkthrough actions` in the shape `walkthrough guide` prints, after the items they are on.
Which actions to offer, their labels, and which ask for a note or let the person edit the text first come from the review policy; a step with none recorded offers Approve and Flag.
Recording the steps or the checklist again drops the actions on them, so record those actions again too.
`walkthrough decisions` prints every item with the person's latest decision, or null while undecided; use it after a restart instead of guessing.

## Listening for the page

The page reaches you only while `walkthrough listen` runs, and the chat stays free while it does.

1. Run `walkthrough listen` in the repo with the Bash tool's `run_in_background: true` and `timeout: 7200000`.
   Never run it in the foreground: it blocks until the person acts on the page.
2. When it exits you are woken with its output, one JSON line per thing the person sent, in the shapes `walkthrough guide` prints.
   - An ask: answer it from the change at the pinned head with `walkthrough say --answer <id> "<answer>"`.
     An ask with a file and lines is about those lines, and the answer shows on them.
     An answer never decides the step for the person.
     For text with quotes or several lines, pass it as `"$(cat <<'EOF' ... EOF)"`.
   - A reply: the person's reply to a question you asked or to a note; act on it, then say what you did with `walkthrough say --answer <id> "<what you did>"`.
   - A decision: the action the person took on an item, with any note and edited text; act on it as the review policy says, then say what you did with `walkthrough say --answer <id> "<what you did>"`.
     A later decision on the same item replaces the earlier one.
   - Stopped: tell the person in one line and do not listen again.
3. Start listening again right after answering, every time, before you end your turn.
4. Exit code 3 means another `walkthrough listen` took over; do not listen again from this session.

To ask the person something on the page, run `walkthrough say --question "<question>"` and listen; their reply comes back as a reply line.
When the question has a few likely answers, offer each with `--choice "<answer>"`; the page shows them as buttons.
The page shows you as working until you have answered everything listen handed you, and as gone when you stop listening and do not come back.
