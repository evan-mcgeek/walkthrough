# 02: Diff library spike

**What to build:**
A throwaway page renders real diffs from a real branch in plain TypeScript without a UI framework, comparing diff2html against at least one alternative.
The result picks the library the page will use and records why.

**Blocked by:** None (can start immediately)

**Status:** done

- [ ] A throwaway page renders a multi-file diff from a real repo with each candidate.
- [ ] Side-by-side and unified views, syntax highlighting, and long-line handling are compared.
- [ ] The pick and the reason are recorded (an ADR if the choice is surprising, otherwise a note in this ticket).
- [ ] The spike code is kept on a prototype branch, not merged.

## Outcome

Pick: diff2html 3.4.56 (`Diff2HtmlUI` from `diff2html/lib-esm/ui/js/diff2html-ui-slim`), as the spec assumed.
Compared against @pierre/diffs 1.6.4 on real git diffs (698 lines in 23 files, and 2548 lines in 46 files) under the page's CSP (`script-src 'self'`, no `unsafe-eval`), in Chromium via Playwright.

- Both render side-by-side and unified with syntax highlighting, under the CSP with no violation; a `new Function` control was reported, so the check works.
- Both take a step as a filter on their parsed model: diff2html `parse()` then keep chosen files and `blocks`; @pierre/diffs `parsePatchFiles()` then keep chosen `hunks`. Line numbers stay right in both.
- Both show the 2.5k-line diff fully highlighted within about 1 s of page load (diff2html 0.4 s, @pierre/diffs 0.9 s), with no page-wide horizontal scroll.
- diff2html wins on fit: one synchronous `draw()` into light DOM matches "one render function redraws the region", one 261 KB chunk plus 18 KB CSS.
- @pierre/diffs loses on fit: one stateful component per file in shadow DOM, highlighting finishes asynchronously, and Shiki splits into about 490 lazy chunks (11 MB built; about 900 KB fetched for JS/TS).
- @pierre/diffs is nicer on long lines (a `wrap` option, word diffs on long lines) and has line annotation slots; reconsider it if inline line comments become a need.
- diff2html has no wrap: each side-by-side pane scrolls horizontally, kept in sync by `synchronisedScroll`.
- @git-diff-view (no vanilla renderer) and Monaco (101 MB, workers) were ruled out by the build notes and not prototyped.

Prototype: branch `prototype/diff-library`, folder `prototypes/diff-library` (`npm i && npm start`, then `node probe.mjs`; screenshots in `shots/`).
