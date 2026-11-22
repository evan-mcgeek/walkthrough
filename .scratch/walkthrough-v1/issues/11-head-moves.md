# 11: When the head moves

**What to build:**
After fixes are pushed, the next walkthrough of the same branch picks up the new head incrementally.
Steps whose code did not change keep their decisions, changed steps reopen and are reviewed again, new code becomes new steps, and reviewers re-run only on changed steps.
The re-review runs in a fresh session.

**Blocked by:** 07 Findings and the finding gate

**Status:** ready-for-agent

- [ ] Unchanged steps keep their decisions at the new head.
- [ ] Changed steps reopen and get fresh findings.
- [ ] New code appears as new steps.
- [ ] Reviewers run only on changed and new steps.
- [ ] CLI tests cover kept, reopened and new steps across two commits.
