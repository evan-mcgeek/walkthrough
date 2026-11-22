# 07: Findings and the finding gate

**What to build:**
Reviewers run in a fresh context and their findings appear at the steps they belong to.
The default lineup is a rules reviewer (AGENTS.md and CLAUDE.md, one rule at a time, quoting the rule) and a reviewer agent once per concern (contracts, error handling, state, tests).
A second agent confirms each finding; only confirmed findings stating a concrete failure are shown, the rest sit behind an "N unconfirmed" count.
The person can flag a step with a note.

**Blocked by:** 05 Steps

**Status:** wontfix

Superseded by the re-scope of 2026-11-22 (ADR 0005): see tickets 16-27.

- [ ] Reviewers run as fresh-context subagents and read the change only from git at the pinned SHAs.
- [ ] Rules findings quote the rule they cite.
- [ ] Every shown finding states what input or state leads to what wrong result, and was confirmed by a second agent.
- [ ] Opinions are dropped; unconfirmed findings are reachable through the "N unconfirmed" count.
- [ ] Findings appear at their step.
- [ ] Flag with a note is saved.
- [ ] CLI tests cover recording findings and decisions; a Playwright test covers the count and Flag.
