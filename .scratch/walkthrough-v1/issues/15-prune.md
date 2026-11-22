# 15: Prune

**What to build:**
Saved walkthroughs are removed once their pull request is merged or closed, or their branch no longer exists.
This runs at most once a day when a walkthrough starts, and on demand with `walkthrough prune`.

**Blocked by:** 01 Walking skeleton

**Status:** ready-for-agent

- [ ] Prune removes walkthroughs whose PR is merged or closed, or whose branch is gone.
- [ ] Automatic prune runs at most once a day.
- [ ] `walkthrough prune` runs it on demand.
- [ ] CLI tests cover each removal rule and the once-a-day limit using the fake gh.
