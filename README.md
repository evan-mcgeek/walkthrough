# Walkthrough

Walkthrough is a Claude Code plugin for reviewing a code change on a local page, one step at a time.

Your own Claude Code session reads the change and records a walkthrough of it: steps in reading order with an explanation each, notes pinned to lines, a checklist, and the actions you can take.
The page opens in your browser and shows one step at a time.
Everything you do there (a question about a step or about selected lines, a reply, a decision with a note) goes straight back to the live session, which answers on the page while the chat stays free.

How the session reviews comes from your review policy and from the project's own instructions for agents.
The tool itself knows only git, its own state and the page, so it works for any language, team and code host.

## Install

You need Claude Code, git, and Node.js 22 or later.

### From a local clone

```sh
git clone <this repo> walkthrough
cd walkthrough
npm install
npm run build
claude --plugin-dir ./plugin
```

`--plugin-dir` loads the plugin for that session only.
Run it from the repo you want to review, with the path to the plugin folder of your clone.

### From a marketplace

The repo root is also a plugin marketplace named `walkthrough`:

```sh
claude plugin marketplace add <owner>/<repo>
claude plugin install walkthrough@walkthrough
```

Use the account and repo name the plugin is published under, or a local path to a clone.
The plugin runs from its built files in `plugin/dist`, so the published copy must include them.

## First run

In the repo with the change, start Claude Code with the plugin and run:

```text
/walkthrough
```

With no argument it walks through your current branch against the remote's default branch.
Name another target branch, a range of commits, or a colleague's change in plain words, and the session passes the matching options to the CLI.

The first time, the session finds no review policy and offers one.
The policy lives at `${XDG_CONFIG_HOME:-~/.config}/walkthrough/REVIEWER.md`, outside every project, and starts as a copy of the template in `plugin/skills/walkthrough/REVIEWER.md`.
Say "later" and the template's defaults apply to this walkthrough.
Say "now" and a short interview goes through the policy section by section: the session sums up each section's defaults, asks how you actually review that part, and edits your copy to match.
While your policy is still the unchanged template, the offer comes again on later runs.

The template covers how to split and order steps, how to write explanations, what the checklist tracks, which reviewers run and how their findings are checked, how drafts for colleagues are written, and which actions each kind of walkthrough offers.
Every rule in it is a default you can edit.

Claude Code asks you to approve the session's reads of your policy, which lives outside the project, and the commands that pass JSON to the CLI.

The page then opens and shows the session preparing.
Steps appear as soon as the session records them.
Uncommitted edits are left out of the walkthrough, with a warning, and nothing is ever checked out.

## Commands

The session runs the `walkthrough` CLI for you; you rarely type it yourself.
`walkthrough guide` prints the exact recording formats, and running `walkthrough` with no command prints the usage.

| Command | What it does |
| --- | --- |
| `start` | Starts or resumes a walkthrough of the current branch, or of `--base <rev> --head <rev> --label <text>`, and opens its page. |
| `files` | Lists the changed files. |
| `steps`, `note`, `checklist`, `actions` | Record what the session wrote, as JSON on standard input. |
| `listen` | Waits in the background for what you do on the page. |
| `say` | Puts the session's answer, question or note on the page. |
| `decisions` | Prints your latest decision on every item. |
| `export` | Writes the walkthrough to one read-only HTML file. |
| `list` | Opens a page of this repo's walkthroughs. |
| `stop` | Ends the page and the listener; `stop --list` ends the list page. |
| `prune` | Removes walkthroughs whose branch is gone or whose head is merged; it also runs at most once a day on `start`. |

Every command but `guide` and `list` takes the same `--target` or `--base`, `--head` and `--label` options that `start` was given.

When the change moves (you push fixes, or a range gets a new head), `start` goes on with the same walkthrough.
Steps whose diff is unchanged keep your decisions, changed steps reopen, and new files go into new steps.

## Token cost

Measured once, on 2026-11-22, with Claude Code 2.1.330 and Claude Opus 5.5, in a headless session (`claude -p`) on a range of this repo: 16 changed files, 496 lines added and 19 removed.
The session read the review policy template, the project's instructions, the ticket and the whole diff, and prepared six steps, a four-item checklist and four notes, without reviewer agents and without the page.
It used 1.28 million input tokens, of which 1.22 million were cache reads, and 17,500 output tokens, for 32 turns and about $1.02 at list price.

That run could not record its steps, because the headless session had no way to approve the commands that pass JSON to the CLI, so a complete walkthrough costs somewhat more.
Each reviewer agent your policy runs adds its own cost; in the interactive test runs, one fresh-context reviewer of a 10-file change used about 74,000 tokens.
Answering what you do on the page adds a short turn per action.

## Design

Nothing specific lives in the tool: every rule, tracker, code host, reviewer and workflow step belongs to your review policy or the project's instructions, and the session carries it out ([ADR 0005](docs/adr/0005-nothing-specific-in-the-tool.md)).

The other decisions are in [`docs/adr/`](docs/adr/), and the domain language in [`GLOSSARY.md`](GLOSSARY.md).

## Development

```sh
npm install
npx playwright install chromium
npm test       # builds, then runs the CLI tests (vitest) and the page tests (Playwright)
npm run lint   # type check and ESLint
```

Rules for working on the code are in [`AGENTS.md`](AGENTS.md).
