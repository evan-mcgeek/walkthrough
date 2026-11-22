---
name: walkthrough
description: Walk through the current branch's change on a local page, one step at a time, before it goes to colleagues. Use when the person runs /walkthrough or asks to walk through or review their branch.
allowed-tools: Bash(walkthrough *)
---

# Walkthrough

The `walkthrough` CLI owns all walkthrough state; never write files under its state folder yourself.

1. Run `walkthrough start` in the repo.
   If the person names the branch their change targets, pass `--target <branch>`.
2. Tell the person, in one or two lines, what the output says: the branch, the pinned base and head, and any warning.
   A warning about uncommitted changes means those edits are not in the walkthrough; say so plainly.
3. Split the change into steps (see below) and record them with `walkthrough steps`.
4. The page is open in their browser; they review and decide there.
   Running `walkthrough start` again on the same head reopens the walkthrough with their decisions intact.
5. Listen for the page, as below, until the walkthrough stops.
6. When the person asks you in the chat to stop, run `walkthrough stop`.

## Steps

Run `walkthrough files` to see the changed files to group, and the mechanical files walkthrough collapses into the last step itself.
Read the change from git only, between the pinned base and head: `git diff <base> <head>` and `git show <head>:<path>`.
Never check anything out.

Grouping:

- A step is one logical piece of the change, an idea rather than a file, and may span several files.
- Every file `walkthrough files` lists to group goes into exactly one step.
- A test file goes into `tests` of the step whose behaviour it proves, never into a step of its own.
  A step with no tests is shown as untested; do not hide that by moving tests around.
- Leave mechanical files out: lockfiles, files marked generated in `.gitattributes` or by a generated-file header, snapshots and vendored code.
  Walkthrough puts them in one collapsed last step and checks them for consistency, for example a lockfile against its manifest.
- A changed `.gitignore` is never mechanical; it goes into the step it serves like any other code.

Ordering:

- Order steps by dependency, so each builds on what the person has already read: data, then logic, then API, then UI.
- Within the same layer, put what other steps call before what calls it.

Each step has a short `title`, `what` changed in one or two sentences, and `why` it changed, from the code and the ticket, never from the author session's own summary.

Record the steps as a JSON array on standard input:

```sh
walkthrough steps <<'EOF'
[
  {
    "title": "Session store",
    "what": "Adds a sessions table and a store that reads and writes it.",
    "why": "Login needs somewhere to keep sessions.",
    "files": ["db/migrations/002_sessions.sql", "src/session-store.ts"],
    "tests": ["test/session-store.test.ts"]
  }
]
EOF
```

When it refuses the steps, it lists every file that is missing, repeated, mechanical or not in the change; fix the grouping and record again.
Recording again replaces the steps and their decisions, so do it before the person starts deciding.
Relay any `Consistency problem:` line to the person in one line each.

## Listening for the page

The page reaches you only while `walkthrough listen` runs, and the chat stays free while it does.

1. Run `walkthrough listen` in the repo with the Bash tool's `run_in_background: true` and `timeout: 7200000`.
   Never run it in the foreground: it blocks until the person acts on the page.
2. When it exits you are woken with its output: one JSON line per thing the person sent.
   - `{"kind":"ask","id":...,"step":...,"text":...}`: a question about a step.
     Answer it from the change at the pinned head, in a few sentences, with `walkthrough say --answer <id> "<answer>"`.
     An answer never decides the step for the person.
     For text with quotes or several lines, pass it as `"$(cat <<'EOF' ... EOF)"`.
   - `{"kind":"reply","id":...,"to":...,"text":...}`: the person's reply to a question you asked; act on it.
   - `{"kind":"stopped"}`: the page was stopped or closed; tell the person in one line and do not listen again.
3. Start listening again right after answering, every time, before you end your turn.
4. Exit code 3 means another `walkthrough listen` took over; do not listen again from this session.

To ask the person something on the page, run `walkthrough say --question "<question>"` and listen; their reply comes back as a `reply` line.
`walkthrough say "<text>"` without a flag puts a note on the page.
While you work on what they sent, the page shows you as working; it shows quiet when nobody listens.
