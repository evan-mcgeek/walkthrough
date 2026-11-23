# 17: Any change, any repo

**What to build:**
`walkthrough start` works for the current branch against its target, or for any base and head the session passes, with a label that names the change, since two changes fetched to the same name, such as FETCH_HEAD, would otherwise share one walkthrough.
State is keyed by the repo's identity (name plus a short hash of its git directory path) and by the walkthrough's branch or range, so two repos with the same name never share state.
`stop`, `listen`, `say` and the recording commands find the same walkthrough the same way.

**Blocked by:** 16 Strip the rules out of the tool

**Status:** done

- [ ] `start --base <rev> --head <rev> --label <text>` creates a walkthrough of that range without checking anything out.
- [ ] Two repos with the same folder name keep separate walkthroughs.
- [ ] Every command resolves the walkthrough the same way as `start` for the same arguments.
- [ ] Prune still finds and removes walkthroughs under the new layout.
