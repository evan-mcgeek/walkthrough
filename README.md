# Walkthrough

Walkthrough is a Claude Code plugin for reviewing a code change on a local page, one step at a time.

Your own Claude Code session reads the change and records a walkthrough of it: steps in reading order with an explanation each, notes pinned to lines, a checklist, and the actions you can take.
The page opens in your browser and shows one step at a time.
Everything you do there (a question about a step or about selected lines, a reply, a decision with a note) goes straight back to the live session, which answers on the page while the chat stays free.

How the session reviews comes from your review policy and from the project's own instructions for agents.
The tool itself knows only git, its own state and the page, so it works for any language, team and code host.

## Install

You need Claude Code, git, and Node.js 22 or later.

### From the marketplace

The repo is also a plugin marketplace named `walkthrough`:

```sh
claude plugin marketplace add evan-mcgeek/walkthrough
claude plugin install walkthrough@walkthrough
```

The plugin installs from the `release` branch, which holds the built plugin; see [Release](#release).

### From a local clone

```sh
git clone https://github.com/evan-mcgeek/walkthrough.git
cd walkthrough
npm install
npm run build
claude --plugin-dir ./plugin
```

`--plugin-dir` loads the plugin for that session only.
Run it from the repo you want to review, with the path to the plugin folder of your clone.

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

The plugin's hook lets the session run the `walkthrough` commands and write the files it records from into the walkthrough's inbox without asking you, for the whole session.
Anything else the session does goes through your usual permissions; `export --out` asks, since it writes where it names.
If your settings turn hooks off, the session's writes to the inbox ask, and so do its `walkthrough` commands after the turn that started the walkthrough.

The page then opens and shows the session preparing.
Steps appear as soon as the session records them.
On the page, `j` and `k` or the right and left arrows move between steps.
To ask about lines, click a line number and Shift-click another, or from the keyboard press Enter on the first line number and Enter on the last (Shift+Enter for a single line); Escape cancels.
Uncommitted edits are left out of the walkthrough, with a warning, and nothing is ever checked out.

## Commands

The session runs the `walkthrough` CLI for you; you rarely type it yourself.
`walkthrough guide` prints the exact recording formats, and running `walkthrough` with no command prints the usage.

| Command | What it does |
| --- | --- |
| `start` | Starts or resumes a walkthrough of the current branch, or of `--base <rev> --head <rev> --label <text>`, and opens its page. |
| `files` | Lists the changed files. |
| `steps`, `note`, `checklist`, `actions` | Record what the session wrote, as JSON from a file in the walkthrough's inbox (`--file`) or on standard input. |
| `listen` | Waits in the background for what you do on the page. |
| `say` | Puts the session's answer, question or note on the page. |
| `policy` | Says whether your review policy is missing, the unchanged template or your own; `show`, `init` and `save --file` print, create and replace it. |
| `decisions` | Prints your latest decision on every item. |
| `export` | Writes the walkthrough to one read-only HTML file. |
| `list` | Opens a page of this repo's walkthroughs. |
| `stop` | Ends the page and the listener; `stop --list` ends the list page. |
| `prune` | Removes walkthroughs whose branch is gone or whose head is merged; it also runs at most once a day on `start`. `prune <branch>`, `prune <id>` with an id from the list page, or `prune` with a range's options removes that one. |

Every command but `guide`, `list` and `policy` takes the same `--target` or `--base`, `--head` and `--label` options that `start` was given.

When the change moves (you push fixes, or a range gets a new head), `start` goes on with the same walkthrough.
Steps whose diff is unchanged keep your decisions, changed steps reopen, and new files go into new steps.

## Token cost

Measured once, on 2026-11-23, with Claude Code 2.1.330 and Claude Opus 5.5, in a headless session (`claude -p`) on a range of this repo: 16 changed files, 496 lines added and 19 removed.
The session read the review policy template, the project's instructions, the ticket and the whole diff, then recorded six steps, a four-item checklist, three notes and the actions, and stopped the page, with no permission prompt.
It used about 908,000 input tokens, of which 856,000 were cache reads, and 10,400 output tokens, for 29 turns and about $0.79 at list price.

The measurement covers preparing and recording a walkthrough only.
Nobody acted on the page, so it includes no answers to questions or decisions, and it ran no reviewer agents.
Each reviewer agent your policy runs adds its own cost; in the interactive test runs, one fresh-context reviewer of a 10-file change used about 74,000 tokens.
Answering what you do on the page adds a short turn per action.

## Design

Nothing specific lives in the tool: every rule, tracker, code host, reviewer and workflow step belongs to your review policy or the project's instructions, and the session carries it out ([ADR 0005](docs/adr/0005-nothing-specific-in-the-tool.md)).

The other decisions are in [`docs/adr/`](docs/adr/), and the domain language in [`GLOSSARY.md`](GLOSSARY.md).

## Development

```sh
npm install
npx playwright install chromium firefox webkit
npm test                # builds, then runs the CLI tests (vitest) and the page tests (Playwright) in Chromium
npm run test:browsers   # the same, with the page tests in Chromium, Firefox and WebKit
npm run lint            # type check and ESLint
```

Use `npm test` while working, and `npm run test:browsers` once before a release.
Both run at most 4 test workers at a time; `PLAYWRIGHT_WORKERS` sets another number for the page tests.

Rules for working on the code are in [`AGENTS.md`](AGENTS.md).

### Release

The built plugin in `plugin/dist` is not committed on the development branches, so a marketplace install takes the plugin from the `release` branch instead.
`npm run release` builds the current commit and commits the result to the local `release` branch: the plugin folder with its built files, the marketplace manifest, `LICENSE` and this README.
It needs a clean working tree, never checks anything out or rewrites the development history, and does not push.
Each release is one commit on top of the previous one, made only when the built files changed.

To publish, push both branches:

```sh
git push origin <development branch> release
```

The marketplace manifest on the development branch points the plugin at `release`, and the copy on `release` points at the plugin folder beside it, so `evan-mcgeek/walkthrough` and `evan-mcgeek/walkthrough#release` both install it.
