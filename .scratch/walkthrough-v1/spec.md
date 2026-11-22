# Spec: Walkthrough v1

Status: ready-for-agent

## Problem Statement

Code review with agents is noisy and incomplete at the same time.
Review skills pass along findings that are only opinions, and the person spends their time arguing with them.
At the same time real gaps slip through: an AC was missed on a branch whose author session had started from the ticket, while a colleague's fresh agent caught it.
Rules in a repo's AGENTS.md are broken in the person's own pull requests and nothing catches it.
A raw diff gives no order to read a change in, so it is hard to understand what an agent actually built and what is still outstanding.
The same is true when reviewing a colleague's pull request, and again when review comments come back on either side.

## Solution

Walkthrough is a Claude Code plugin with a local page that takes a person through code one step at a time.
A change walkthrough starts from the ticket's ACs, walks the change in an order that tells its story, explains each step and which AC it serves, and ends with the outstanding list.
A thread walkthrough takes the person through the threads of a pull request where the other side has moved: a review they received, or replies to a review they left.
Reviewers run in a fresh context and see only the ticket, the change and the repo.
Only confirmed findings that state a concrete failure are shown, each at the step it belongs to.
The person makes every decision; the walkthrough never edits code and never posts anything on its own.
Its outputs are a fix list for the person's own branch, and a pending GitHub review for colleagues.

## User Stories

### Starting and setup

1. As a developer, I want to start a walkthrough with one command, so that I don't have to remember several entry points.
2. As a developer, I want `/walkthrough` with no argument to review my current branch, so that the pre-review check is the shortest command.
3. As a developer, I want `/walkthrough <PR number>` to pick the kind of walkthrough itself, so that I don't have to think about which mode applies.
4. As a developer, I want a flag that forces the kind of walkthrough, so that I can override a wrong guess.
5. As a developer running it for the first time, I want a short setup that asks which reviewers to use, which voice skill to use if any, and the AI marker text, so that my review policy exists before the first review.
6. As a developer, I want setup to list the review agents and skills it finds installed, so that I can redirect to one I already use, such as a reviewer agent.
7. As a developer, I want my review policy in one file in my home config, so that it applies to every repo without touching team repos.
8. As a developer, I want the review policy to hold only generic rules, so that repo-specific knowledge stays with the repo.
9. As a developer, I want the page to open in my browser when the walkthrough is ready, so that I can start reading immediately.

### The change and the ticket

10. As a developer, I want the change to be everything from the merge-base with the target branch to my head commit, so that I review exactly what the pull request will contain.
11. As a developer, I want uncommitted edits left out with a visible warning, so that I know the walkthrough does not cover them.
12. As a developer, I want every decision pinned to a commit, so that the change cannot shift under me mid-walkthrough.
13. As a developer, I want nothing checked out to run a walkthrough, so that my working copy and any author session still typing are never disturbed.
14. As a developer, I want a colleague's pull request reviewed without checking out their branch, so that I don't have to switch branches.
15. As a developer, I want the ticket found from the ticket key in the branch name, else in the pull request title, so that I don't have to paste it.
16. As a developer, I want to override the ticket key, so that a badly named branch still works.
17. As a developer, I want the ticket's decision comments read as well as its description, with a later comment overriding an earlier one, so that the AC map reflects what was actually agreed.
18. As a developer, I want the walkthrough to still run with no ticket and let me paste ACs, so that untracked work can be reviewed too.

### Change walkthrough

19. As a developer, I want to see every AC of the ticket first, each linked to the steps that deliver it or marked as not found, so that a missed AC is the first thing I see.
20. As a developer, I want the change split into steps, each one logical piece that may span files, so that I read ideas rather than files.
21. As a developer, I want steps in dependency order (data, logic, API, UI), so that each step builds on what I have already read.
22. As a developer, I want each step to say what changed, why, and which AC it serves, so that I understand it without reading every line first.
23. As a developer, I want tests shown inside the step whose behaviour they prove, so that an untested step is visible.
24. As a developer, I want lockfiles, generated code, snapshots and vendored files collapsed into one mechanical step at the end, so that they don't bury the real change.
25. As a developer, I want the mechanical step checked for consistency (for example a lockfile matching its manifest) rather than line by line, so that it is not reviewed blindly either.
26. As a developer, I want a changed `.gitignore` reviewed like any other code, so that hidden files can't slip through as "mechanical".
27. As a developer, I want a real diff view for each step, so that I can read the code as comfortably as on GitHub.
28. As a developer, I want to approve a step, so that I can move on.
29. As a developer, I want to flag a step with my own note, so that it goes on the fix list or into my review.
30. As a developer, I want to ask a question about a step and get the answer on the page, without changing my decision, so that I can understand before I decide.
31. As a developer, I want to see how many steps are decided and how many are left, so that I know where I am.
32. As a developer, I want the outstanding list at the end, with ACs no step delivers, broken repo rules, and code that serves no AC, so that I know what the change still owes.
33. As a developer, I want code that serves no AC called out, so that I notice scope creep or an AC nobody wrote down.

### Reviewers and findings

34. As a developer, I want reviewers to run in a fresh context that never sees the author session, so that they don't share its blind spots.
35. As a developer, I want a spec reviewer to build the AC map, so that completeness is checked against the ticket.
36. As a developer, I want a rules reviewer to check the change against the repo's AGENTS.md and CLAUDE.md one rule at a time, quoting the rule, so that ignored instructions are caught.
37. As a developer, I want a reviewer agent to run once per concern (contracts, error handling, state, tests), so that each concern gets a focused look.
38. As a developer, I want other installed review skills off by default, so that their debatable findings don't come back.
39. As a developer, I want my review policy to redirect to another review agent, skill or workflow, so that I can reuse a reviewer I already trust.
40. As a developer, I want a redirect to replace only who produces findings, so that I still get the AC map, the steps and the page.
41. As a developer, I want findings from a redirect that don't fit the finding shape shown raw as unparsed, so that nothing is silently lost.
42. As a developer, I want a finding shown only when it states a concrete failure, so that opinions never reach me.
43. As a developer, I want every finding confirmed by a second agent before it is shown, so that I don't waste time on false alarms.
44. As a developer, I want unconfirmed findings behind an "N unconfirmed" count, so that I can still look if I choose to.
45. As a developer, I want each finding shown at the step it belongs to, so that I judge it with the code in front of me.
46. As a developer, I want to reject a finding with a one-line reason, so that the reason is kept.
47. As a developer, I want a rejected finding turned into a proposed convention line for the repo's AGENTS.md, so that neither reviewers nor author agents raise or repeat it again.
48. As a developer, I want that convention written as a statement about the repo (for example "Debug-only screens are not localized"), not as "don't flag X", so that author agents can follow it too.
49. As a developer, I want the convention placed in the repo's existing conventions section, or a new Conventions section, so that AGENTS.md stays organised.
50. As a developer, I want to see the AGENTS.md diff and say yes before it is written, and have it left uncommitted, so that I stay in control of the team's file.
51. As a developer reviewing a colleague's pull request, I want a rejected finding to become a suggestion in my pending review instead, so that their branch is never written to.

### Thread walkthrough

52. As a developer whose pull request was reviewed, I want a walkthrough of my colleague's comments, each thread placed at the step it touches, so that I read them in context.
53. As a developer, I want a fresh agent to check each received comment against the code at head and say whether it holds, with evidence, so that I know which ones are right.
54. As a developer, I want to accept a received comment and have it go on my fix list, so that it gets fixed.
55. As a developer, I want to push back on a received comment and get a drafted reply, so that I answer quickly and briefly.
56. As a developer, I want to ask about a received comment, so that I understand it before I decide.
57. As a developer who reviewed a colleague's pull request, I want to see only threads with new replies and the commits since my review, so that I don't re-read what is settled.
58. As a developer, I want a fresh agent to check at the new head whether each reply or commit resolves my concern, so that I don't have to verify every claim myself.
59. As a developer, I want to resolve, reply to, or keep blocking each thread, so that my follow-up review is complete.
60. As a developer, I want threads resolved on GitHub only when I submit my review, so that nothing changes on GitHub before I say so.

### Outputs

61. As a developer reviewing my own branch, I want the walkthrough to end with a fix list file (step, location, my note, the finding), so that the fixes are concrete.
62. As a developer, I want a one-line prompt copied that points at the fix list, so that I can hand it to an author session or a new one.
63. As a developer, I want the walkthrough never to fix code itself, so that reviewing and authoring stay separate.
64. As a developer reviewing a colleague's pull request, I want my flags turned into one pending GitHub review with comments on the lines, so that I submit it myself in GitHub.
65. As a developer, I want the walkthrough never to submit a review or post a comment on its own, so that nothing goes out under my name without me.
66. As a developer, I want drafted comments and replies limited to one or two sentences, the failure and the fix, with no preamble and no praise, so that colleagues read them quickly.
67. As a developer, I want that length set in my review policy, so that I can change it.
68. As a developer, I want an optional voice skill to change the tone of drafts but never their length, so that drafts sound like me without getting longer.
69. As a colleague, I want every comment an agent drafted to start with the AI marker, so that I know it was not written by the person.
70. As a developer, I want a draft I edited to keep the AI marker, and only comments I write from scratch to have none, so that the marker stays honest.
71. As a developer, I want the walkthrough to leave pull request descriptions alone, so that it stays a review tool.

### When the head moves

72. As a developer who pushed fixes, I want steps whose code did not change to keep my decisions, so that I don't review them twice.
73. As a developer, I want changed steps to reopen and be reviewed again, so that fixes are checked.
74. As a developer, I want new code to appear as new steps, so that nothing added after the first pass is skipped.
75. As a developer, I want reviewers to re-run only on changed steps, so that a second pass is fast.
76. As a developer, I want the re-review to run in a fresh session, so that the session that handed over the fix list does not judge the fixes.

### Talking to the session

77. As a developer, I want my actions on the page to reach the Claude Code session that drives the walkthrough, so that answers and new findings come back while I read.
78. As a developer, I want the chat to stay usable while the page waits for me, so that I can talk to the session at the same time.
79. As a developer, I want to see on the page whether the session is listening, working, waiting for me, or quiet, so that I know whether anything is happening.

### Lifecycle and housekeeping

80. As a developer, I want a stop command and a Stop button on the page that end the listener and the server, so that nothing keeps running.
81. As a developer, I want the listener to stop by itself when a walkthrough is finished, so that I don't have to remember.
82. As a developer, I want the server to stop by itself when no page has been connected for a while, so that forgotten servers don't pile up.
83. As a developer, I want saved walkthroughs deleted once their pull request is merged or closed, or their branch is gone, at most once a day, so that state doesn't grow forever without slowing every start.
84. As a developer, I want a prune command, so that I can clear old state on demand.
85. As a developer, I want a walkthrough I left halfway to resume where I stopped, so that a long change can be reviewed over several sittings.
86. As a developer, I want the page reachable only from my machine with a private link, so that other local processes or sites can't drive it.

### Sharing with the team

87. As a team, we want walkthrough distributed as a Claude Code plugin, so that colleagues can install it like our other plugins.
88. As a developer, I want nothing about walkthrough added to reviewed repos except conventions I approved, so that adopting it costs the team nothing.

## Implementation Decisions

### Architecture

- A Claude Code session drives everything (ADR 0001); the app has no agents of its own and no Agent SDK.
- Reviewers always run as fresh-context subagents that see only the ticket, the change and the repo (ADR 0002).
- The page is walkthrough's own app, not lavish (ADR 0003).
- There is no MCP (ADR 0004).
  The page reaches the session through a background `walkthrough listen` command that exits when the person acts on the page, which wakes the session.
  The session answers with `walkthrough say`, which the page picks up by polling.
  This is the pattern another local tool's canvas and lavish both use.
- The plugin has three parts: a skill (the agent's procedure), a CLI (the only thing that writes state), and the local page served by the CLI.

### Modules

- **Skill**: setup on first run; resolving the change and the ticket; running reviewers (or the redirect from the review policy) as fresh subagents; confirming findings with a second agent; grouping and ordering steps; answering asks; drafting replies; proposing conventions; writing the fix list; preparing the pending review.
  Step grouping and ordering are the agent's call within the rules in this spec.
- **CLI**: the deep module.
  It owns walkthrough state and its whole lifecycle behind a small set of commands.
  Decided command names: `listen`, `say`, `stop`, `prune`.
  The rest (creating a walkthrough, recording steps, findings and decisions, moving to a new head, exporting the pending review, proposing a convention) are left to the builder, as long as every state change goes through a command.
- **Server**: plain `node:http` started by the CLI, bound to localhost, with a private URL token, a host and origin check, JSON-only POST bodies and CSP headers, copied from another local tool's gate and token pieces.
- **Page**: plain TypeScript and the DOM, no UI framework, bundled with esbuild together with a mature diff library (diff2html is the candidate, confirmed by a short spike first).
  Each region of the page is redrawn from the current state by one render function, never patched piece by piece.
  It polls for state, as another local tool's canvas does.

### State

- Each walkthrough is stored under `~/.local/state/walkthrough/<repo>/<walkthrough>/`: the ticket snapshot, steps, findings and decisions, each pinned to the head SHA.
- State is written only through CLI commands and never edited by hand, with locked JSON writes copied from another local tool.
- Agent-to-page messages and page-to-agent requests are append-only files, like another local tool's prompts and messages.
- Session status (listening, working, waiting for the person, quiet) is computed from a listener marker the same way another local tool does.
- Prune runs at most once a day on start, and on demand.
  It removes walkthroughs whose pull request is merged or closed, or whose branch no longer exists.

### The change

- Base is the merge-base with `origin/<target>`; head is the current commit.
  Uncommitted edits are excluded and reported as a warning.
- Nothing is checked out and no worktree is used.
  Reviewers read the change through `git diff` between the two SHAs and file contents at the head SHA from git objects.
  A colleague's pull request is fetched as a ref.
- Mechanical files are lockfiles, files marked generated in `.gitattributes` or by a generated-file header, snapshots and vendored code.
  `.gitignore` is never mechanical.

### Kinds of walkthrough

- No argument: change walkthrough of the current branch.
- A PR number: thread walkthrough when it is the person's own pull request with unanswered threads, or a pull request they reviewed that has new replies; otherwise a change walkthrough.
  A flag forces the kind.

### Review policy

- One file per person at `~/.config/walkthrough/REVIEWER.md`, created by first-run setup and never added to reviewed repos.
- It is Markdown written for agents; the app never parses it.
- It holds: "Review with" (default reviewers or a redirect), the ticket rules, the reviewer lineup, the finding gate, drafted-comment rules (length, voice skill, AI marker).
- A draft lives next to this spec as `REVIEWER.draft.md`.

### Settled findings

- A rejected finding becomes a proposed convention in the reviewed repo's AGENTS.md, phrased as a statement about the repo, under its existing conventions section or a new Conventions section.
- The person sees the diff and says yes; it is written to the working tree and left uncommitted.
- On a colleague's pull request it becomes a suggestion in the pending review instead.

### Outputs and GitHub

- Own branch: a fix-list file in the walkthrough's state, plus a one-line prompt copied for the person to hand over.
- Colleague's pull request: one pending GitHub review with line comments, created through `gh`, which the person submits.
  GitHub allows one pending review per person per pull request, so when one already exists the drafts are added to it.
- Thread walkthroughs: pending replies, and thread resolutions that apply only when the person submits.
- Drafted text starts with the AI marker (default `[AI]`), keeps it when edited, and is one or two sentences unless the review policy says otherwise.
- Pull request descriptions are never touched.

### Ticket

- The tracker through the session's own access: key from the branch name, else the PR title, overridable.
- Description plus decision comments; a later comment overrides an earlier one.
- No ticket: the AC panel says so and accepts pasted ACs.

## Testing Decisions

- A good test drives walkthrough from the outside and checks what a user or the session would observe: CLI output, saved state, what the page shows, what reaches `gh`.
  It never reaches into internal functions or file layouts beyond the documented state.
- **Seam 1, the CLI**: tests run the built CLI against a throwaway git repo, with a temporary state and config folder and a fake `gh` on `PATH`.
  They cover creating a walkthrough, recording steps, findings and decisions, moving to a new head (kept, reopened and new steps), uncommitted-edit warnings, mechanical-file classification, `listen` exiting on a page request, `say` reaching the page state, `stop`, idle self-stop, prune rules and their once-a-day limit, the AGENTS.md convention proposal, the fix-list file, and the pending-review payload sent to the fake `gh`.
- **Seam 2, the page**: Playwright drives the page the CLI serves, against prepared state.
  It covers the AC panel with not-found ACs, step navigation and progress, approve, flag and ask, the "N unconfirmed" count, the session status chip, the Stop button, and the security gate refusing a request without the token.
- Prior art: another local tool's `node --test` suites that spawn its CLI, and its Playwright `e2e` suite against the canvas.
- Agent behaviour (step grouping, reviewer prompts, confirming findings, drafting) is not unit tested; it is checked by running real walkthroughs on real branches and pull requests.

## Out of Scope

- Figma designs as a source of ACs.
- A shared walkthrough several people open at once, or a hosted page; colleagues get involved only through GitHub.
- Writing or editing pull request descriptions.
- Fixing code from the walkthrough session.
- Submitting reviews, posting comments or resolving threads without the person submitting in GitHub.
- An MCP server.
- A UI framework for the page.
- Worktrees or checkouts of the reviewed code.
- Issue trackers other than the one the author uses, and code hosts other than GitHub.
- Publishing to a team marketplace (later; v1 is used by its author first).

## Further Notes

- Domain language is in `GLOSSARY.md`; decisions are in ADRs 0001 to 0004.
- Pieces of another local tool to copy (not share): its listener with lock and take-over, security gate, URL token and locked JSON writes.
  Its Svelte inbox and agent chip are rewritten small in plain TypeScript.
- Run the diff-library spike before building the page.
