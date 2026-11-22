# 12: Colleague's PR: change walkthrough and pending review

**What to build:**
`/walkthrough <PR number>` runs a change walkthrough of a colleague's pull request, fetched as a ref without checking it out.
The person's flags become one pending GitHub review with line comments, created through gh, which they submit themselves; drafts are added to an existing pending review when there is one.
Drafted comments start with the AI marker (kept when edited), are one or two sentences unless the review policy says otherwise, and use the optional voice skill for tone only.
A rejected finding becomes a suggestion in the pending review instead of an AGENTS.md change.

**Blocked by:** 07 Findings and the finding gate, 10 Settled findings into AGENTS.md

**Status:** ready-for-agent

- [ ] The PR is fetched as a ref; nothing is checked out.
- [ ] Flags become line comments in one pending review; nothing is submitted.
- [ ] An existing pending review is added to rather than duplicated.
- [ ] Every agent-drafted comment starts with the AI marker, including after edits.
- [ ] Drafts respect the length rule; the voice skill changes tone only.
- [ ] A rejected finding becomes a suggestion in the review; the colleague's branch is never written to.
- [ ] Pull request descriptions are never touched.
- [ ] A CLI test covers the pending-review payload sent to the fake gh.
