# 02: Diff library spike

**What to build:**
A throwaway page renders real diffs from a real branch in plain TypeScript without a UI framework, comparing diff2html against at least one alternative.
The result picks the library the page will use and records why.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] A throwaway page renders a multi-file diff from a real repo with each candidate.
- [ ] Side-by-side and unified views, syntax highlighting, and long-line handling are compared.
- [ ] The pick and the reason are recorded (an ADR if the choice is surprising, otherwise a note in this ticket).
- [ ] The spike code is kept on a prototype branch, not merged.
