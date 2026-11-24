# 60: CLI and state: comments, Look at, criteria, threads, one submit

**What to build:**
Remove `actions`, `decisions`, `checklist`, `checking`, `say --question`, note kinds and labels, and every action field (`tone`, `label`, `consequence`, `outcome`, `asks_reason`, `primary`, `needs_decision`).
Add, recorded by the session through inbox files: a step's Look at pointers (`{file, start, end, label}`, one or two), a folded file's one-line reason, the AI's pending line comments, read-only acceptance criteria (Met, Partly met, Not met, Not checked), colleagues' threads with replies, and a reviewing flag per step.
The page sends: comments (add, edit, delete, on any pending comment, yours or the AI's), replies, Resolve, Ask AI, Viewed, and one submit (type, summary).
`listen` hands the session only Ask AI and the submit; the session answers an Ask AI as a reply in its thread, and records where a submitted review went (one line and an address).
Viewed keeps resetting when a file's diff changes, and the view says which files changed since they were viewed.

**Blocked by:** 59

**Design:** docs/design/HANDOFF.md (founder decisions, section 2), PRODUCT.md

- [ ] No removed command, field or state is left in `src/`
- [ ] `walkthrough guide` prints only the new formats
- [ ] Only Ask AI and the submit wake `listen`

**Status:** ready-for-agent
