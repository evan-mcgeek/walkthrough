# 22: When the change moves

**What to build:**
Re-recording steps or starting at a new head keeps decisions on steps whose files and their content are unchanged, reopens steps whose files changed, and puts new files into new steps.
Notes and asks whose step or lines no longer exist are kept and shown as detached.

**Blocked by:** 17 Any change, any repo, 21 Agent-defined actions and decisions

**Status:** ready-for-agent

- [ ] An unchanged step keeps its decision across a new head or a re-recording.
- [ ] A step whose files changed is reopened.
- [ ] New files appear in new steps.
- [ ] Notes and asks that lost their anchor show as detached, not dropped.
