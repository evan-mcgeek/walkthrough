# Spec: Walkthrough v1

Status: ready-for-agent

This spec replaces the first version after the re-scope of 2026-11-22: the tool is universal and has nothing specific in it (ADR 0005).
Prior art and the ideas borrowed from it: `~/development/projects/docs/investigations/2026-11-22-walkthrough-prior-art-investigation.md` (ideas I01-I17).

## Problem Statement

A person who lets agents write code, or who reviews colleagues' pull requests, has to understand changes they did not write.
A raw diff gives no order to read a change in and no explanation of why each part exists.
Agent reviewers add noise and miss things, and their findings arrive as a list detached from the code.
When the person does want to comment, ask or send something back, they switch between the diff, the chat and the code host.
Existing tools each cover part of this, but either generate the explanation in a separate agent job instead of the person's own session, return feedback only once at the end, or hardcode a code host, a tracker or review rules that fit only some teams.

## Solution

Walkthrough is a Claude Code plugin with a local page.
The person's own Claude Code session records a walkthrough of a change: ordered steps with explanations, notes pinned to lines, a checklist, and the actions the person can take.
The page shows it one step at a time; every decision, question or note the person makes goes straight back to the live session, which answers on the page.
What the session does (how it splits the change, which reviewers it runs, what the checklist lists, where comments get posted) comes only from the person's review policy and the project's instructions.
The tool itself knows only git, its own state and the page, so it works for any language, team and code host and can be shared as it is.

## User Stories

### Starting

1. As a person, I want to start a walkthrough with one command, so that reviewing a change is one step away.
2. As a person, I want `/walkthrough` with no argument to walk through my current branch against its target, so that the common case is the shortest.
3. As a person, I want to walk through any base and head I or my rules name (a colleague's pull request, a range of commits), so that the tool is not tied to one source of changes.
4. As a person, I want the page to open right away and show that the session is preparing steps, so that I am not staring at a terminal.
5. As a person, I want steps to appear on the open page as soon as the session records them, so that I can start reading early.
6. As a person, I want uncommitted edits left out with a visible warning, so that I know what the walkthrough covers.
7. As a person, I want nothing checked out, so that my working copy and any session still editing it are never disturbed.
8. As a person, I want a walkthrough I left halfway to resume where I stopped, so that a long change can be reviewed over several sittings.
9. As a person, I want a page listing my open walkthroughs, so that I can find one I left.

### My rules

10. As a person, I want one review policy file of my own, outside any project, so that my way of reviewing applies everywhere.
11. As a person, I want the first walkthrough to offer a template review policy and interview me about how I actually review, so that my policy reflects my process instead of someone else's defaults.
12. As a person, I want that offer repeated on later runs while my policy is still the unchanged template, so that I don't forget to make it mine.
13. As a person, I want the session to read the project's own agent instructions on every walkthrough, so that project rules are applied where they belong.
14. As a person, I want the template to carry sensible, editable defaults (step order, writing style, how findings are checked, how drafts are written), so that I start from something good.
15. As a person, I want nothing about reviewing hardcoded in the tool, so that I can change any rule by editing text.

### Reading the change

16. As a person, I want the change split into steps the session chose, each with a title, an explanation and its files, so that I read ideas rather than files.
17. As a person, I want each step's diff rendered properly, so that I read code as comfortably as on a code host.
18. As a person, I want a step to list what the session assumed rather than read, apart from its explanation, so that I know which claims to check.
19. As a person, I want files the session judged not worth reading line by line in a folded step, each with the session's reason, so that they don't bury the real change.
20. As a person, I want a changed Markdown or image file to have a preview as well as its diff, so that I can judge docs and assets as they look.
21. As a person, I want to see which steps I have read apart from which I have decided, so that progress never implies approval.
22. As a person, I want decided steps to collapse in the step list, so that only what is left stands out.
23. As a person, I want to move between steps with the keyboard and the browser's back and forward, so that reading is fast.

### Notes, checklist and asking

24. As a person, I want notes from the session pinned to a step or to lines in its diff, so that I judge them with the code in front of me.
25. As a person, I want each note labelled by the session (a finding, an answer, a thread), so that I know what kind of note it is.
26. As a person, I want notes the session marks as low priority grouped behind a count, so that they don't crowd the step.
27. As a person, I want replies on a note shown as a thread, so that a conversation stays in one place.
28. As a person, I want a checklist beside the steps, titled and filled by the session, with links to steps, so that whatever my rules track (acceptance criteria, open questions) is visible.
29. As a person, I want to ask about a step or about lines I selected, and get the session's answer in place, so that I understand before I decide.

### Deciding

30. As a person, I want the actions on each step, note, checklist item and the whole walkthrough to be the ones the session offers, so that my rules decide what I can do.
31. As a person, I want Approve, Flag and Ask on a step when the session offers nothing else, so that a walkthrough works without a custom policy.
32. As a person, I want an action to ask me for a note when the session says so, so that my reasoning travels with my decision.
33. As a person, I want to edit a draft the session wrote (for example a comment for a colleague) before accepting it, so that what goes out under my name is mine.
34. As a person, I want every decision to reach the live session at once, so that it can act while I keep reading.
35. As a person, I want to change a decision until the walkthrough ends, so that I can correct myself.
36. As a person, I want an undecided step to stay undecided everywhere, including after the page closes or the session stops, so that silence is never read as approval.

### The session

37. As a person, I want to see whether the session is listening, working, waiting for me, or gone, judged from evidence, so that I know whether anything is happening.
38. As a person, I want the chat with the session to stay usable while the page waits, so that I can talk to it at the same time.
39. As a person, I want the session to answer questions it asks me on the page with buttons, so that I can reply without switching to the chat.

### When the change moves

40. As a person who pushed fixes, I want decisions kept on steps whose files did not change, so that I don't review them twice.
41. As a person, I want steps whose files changed to reopen, so that fixes are checked.
42. As a person, I want new files to appear in new steps, so that nothing added later is skipped.
43. As a person, I want notes and asks on steps that no longer exist kept visible rather than lost, so that nothing I wrote disappears.

### Ending and sharing

44. As a person, I want whole-walkthrough actions at the end (whatever my rules offer, such as posting my comments), so that finishing is one click.
45. As a person, I want to export a walkthrough as one read-only HTML file, so that I can hand it to someone without hosting anything.
46. As a person, I want a stop command and a Stop button that end the listener and the server, so that nothing keeps running.
47. As a person, I want the server to stop by itself when no page has been open for a while, so that forgotten servers don't pile up.
48. As a person, I want old walkthroughs removed once their branch is gone or their head is merged into the target, at most once a day, and by command for anything else, so that state doesn't grow forever.
49. As a person, I want the page reachable only from my machine through a private link, so that nothing else can drive it.

### For anyone adopting it

50. As anyone, I want to install walkthrough as a Claude Code plugin from a public repo, so that it is easy to try.
51. As anyone, I want the README to state what a typical walkthrough costs in tokens, so that I know before I start.
52. As a maintainer, I want the session to learn the recording format from the CLI itself, so that the skill never drifts from the CLI version.

## Implementation Decisions

### Principles

- A Claude Code session drives everything; the app has no agents of its own (ADR 0001).
- Reviewers the policy names run in a fresh context, never in the author session (ADR 0002).
- The page is the tool's own app (ADR 0003).
- No MCP: the page reaches the session through a background `walkthrough listen`, and the session answers with `walkthrough say` (ADR 0004).
- Nothing specific in the tool (ADR 0005): the CLI and page know only git, their own state and the page.
  No language, package manager, file name pattern, tracker, code host, reviewer or workflow appears in code.
  The CLI checks structure only and stores what the session records.

### Modules

- **Skill**: a thin procedure.
  It reads the review policy and the project's instructions, resolves the change, runs `walkthrough guide` for the recording format, records steps, notes, checklist and actions, then runs the listen and answer loop.
  Every judgement (grouping, order, what is folded and why, reviewers, checklist content, actions offered, what to do with a decision) comes from the policy and instructions, never from the skill's own rules.
  First-run setup offers the policy template and interviews the person to fill it, and offers again on later runs while the policy is unchanged from the template.
- **CLI**: the deep module and the only writer of state.
  Commands decided: `start`, `stop`, `listen`, `say`, `guide`, `prune`, `list`, `export`.
  Recording commands (steps, notes, checklist, actions) are left to the builder, all taking JSON on standard input in the shape `guide` prints.
- **Server**: plain `node:http`, localhost only, private URL token, host and origin check, JSON-only POST bodies, strict CSP.
- **Page**: plain TypeScript and the DOM, no framework, bundled with esbuild, diffs by diff2html in line-by-line mode; each region is redrawn from state by one render function; it polls for state.
- **Review policy template**: a Markdown file shipped with the plugin, written for agents, naming no specific agent, plugin, tracker or code host.
  It carries the defaults, all editable:
  - step order (what others depend on first) and writing rules (short sentences, no verdict words, one idea per step, the why and the rejected alternative);
  - reviewers run in a fresh context, and a finding is shown only when it states a concrete failure and a second agent confirmed it; the rest are low priority;
  - drafts for colleagues are one or two sentences and start with an agent-written marker, kept even when edited;
  - a rejected finding is proposed as a convention in the project's agent instructions, shown as a diff and written only on the person's yes, left uncommitted;
  - on the person's own change, flagged items become a fix list handed to an author session; the walkthrough session never edits code;
  - for a review the person received, and for replies to a review they left, the session walks the threads and drafts replies; threads are resolved on the code host only after the person's review is confirmed submitted;
  - which actions to offer on each kind of item.

### The change

- `start` with no range uses the current branch against its target branch (merge-base to head); with a base and head it uses those revisions and an optional label.
- Getting a colleague's change into the repo (fetching a pull request ref, for example) is the session's job, following the policy.
- Uncommitted edits are excluded and reported as a warning.
- Nothing is checked out; diffs and file contents are read from git objects at the pinned commits.

### State

- One folder per walkthrough under the state folder, keyed by the repo's identity (its name plus a short hash of its git directory path, so two repos with the same name never share state) and by the walkthrough's range or label.
- Steps, notes, checklist, actions and decisions are stored per walkthrough, pinned to base and head.
- Decisions are an append-only log, so the session can resume after a restart; "no decision" is a state of its own and never reads as approval.
- Read state (which steps the page has shown) is kept apart from decisions.
- Writes go only through CLI commands, with locked JSON writes.

### Steps

- A step is a title, the session's Markdown explanation, an optional list of assumptions, and whole files.
- The CLI refuses a set of steps unless every changed file is in exactly one step, and names every problem at once.
- A folded step is an ordinary step the session marks as folded, with a reason per file and any problems it found; the CLI never decides what is folded.
- A changed Markdown or image file gets a preview switch on the page.

### Notes and checklist

- A note is pinned to a step, or to a line range of a file in that step, with a session-chosen label, Markdown text, a low-priority flag, replies and actions.
- An ask from the page can be pinned to a selected line range; the session's answer becomes a note on the same range.
- The checklist has a session-chosen title and items with a session-chosen status, text, links to steps and actions.
- Markdown from the session is rendered safely (no raw HTML), under the strict CSP.

### Actions and decisions

- The session defines actions on steps, notes, checklist items and the whole walkthrough: an id, a label, whether a note is asked for, and whether the item's text can be edited first.
- With no actions defined, a step offers Approve, Flag and Ask.
- Taking an action records a decision and wakes the listener with it, including any note and edited text.
- Deciding a step collapses it in the step list.

### When the head moves

- Re-recording steps or starting at a new head keeps a decision on a step whose files and their content are unchanged, reopens a step whose files changed, and puts new files in new steps.
- Notes and asks whose step or lines no longer exist are kept and shown as detached rather than dropped.

### Session presence

- Listening, Working, Needs you and Gone are judged from evidence: a live listener process, requests handed over and not yet answered, an unanswered question from the session, and a listener that has not come back.
- Gone is never inferred from age alone.

### Lifecycle

- `stop` and the Stop button end the listener and the server; the server stops itself after a period with no page open.
- `prune` runs at most once a day on `start`, and on demand; it removes walkthroughs whose branch is gone or whose head is already merged into the target, using git only, and by id on request.
- `list` serves a page of open walkthroughs; `export` writes one self-contained, read-only HTML file of a walkthrough.

### Theme

- Light and dark, following the system setting.

## Testing Decisions

- A good test drives walkthrough from the outside and checks what the person or the session would observe: CLI output, saved state, what the page shows.
- **Seam 1, the CLI**: the built CLI against a throwaway git repo with a temporary state and config folder.
  Covers start (branch and explicit range), warnings, step validation, folded steps as recorded, notes, checklist, actions, decisions log, read state, moved heads, guide output, listen and say, stop, idle stop, prune rules and once-a-day limit, list and export.
- **Seam 2, the page**: Playwright against the served page with prepared state.
  Covers preparing state, steps appearing live, navigation, notes on lines and the low-priority group, asks on a selection, checklist, agent-defined actions with notes and edits, collapse on decide, read versus decided, presence states, Stop, and the token gate.
- Prior art: the existing suites in `test/` and `e2e/`.
- Session behaviour (how it follows a policy) is not unit tested; it is checked by real walkthroughs on real branches and pull requests, which also measure token cost.
- No test or fixture may introduce a rule specific to a language, package manager, tracker or code host into the tool.

## Out of Scope

- Any built-in tracker, code host, reviewer, analyzer or language rule.
- Posting to a code host from the tool; the session does it when the policy says so.
- Fixing code from the walkthrough; the session hands work over per the policy.
- A hosted or multi-user walkthrough; export is the only sharing.
- An MCP server, a UI framework, worktrees or checkouts.
- Length limits on step text (I15) and handed/done states for fix actions (I14).

## Further Notes

- Domain language: `GLOSSARY.md`; decisions: ADRs 0001-0005.
- Shared build notes for implementers: `~/development/projects/docs/investigations/2026-11-22-walkthrough-build-notes-investigation.md`.
- The page design is being drawn in a separate design round; build with plain styling until it lands, then apply it.
- Publishing target: the person's own public repo and personal plugin marketplace (account to be named before publishing).
