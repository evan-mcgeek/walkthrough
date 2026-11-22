# 16: Strip the rules out of the tool

**What to build:**
Everything specific leaves the code (ADR 0005).
The mechanical-file rules go: no lockfile list, header patterns, vendored folder names or manifest checks.
`walkthrough files` lists every changed file; the session decides what is folded and records a folded step with a reason per file and any problems it found.
Prune uses git only: a walkthrough goes when its branch is gone or its head is already merged into the target, and `walkthrough prune <id>` removes one on request.
`walkthrough guide` prints the current recording format so the skill reads it instead of carrying it.
The skill's grouping, ordering and folding rules move out of SKILL.md into the review policy template draft.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] No code, test fixture or skill text names a language, package manager, file name pattern, tracker or code host.
- [ ] The CLI accepts a folded step from the session with per-file reasons and problems, and still refuses a file in two steps or in none.
- [ ] Prune never calls anything but git; a gh failure path no longer exists.
- [ ] `walkthrough guide` prints the JSON shapes for every recording command and the skill uses it.
- [ ] AGENTS.md first rule holds; CLI and page tests updated, none dropped without a replacement.
