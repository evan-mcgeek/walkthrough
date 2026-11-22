# 03: Real diff view

**What to build:**
Every step on the page shows its diff with the library chosen in the spike instead of plain text.

**Blocked by:** 01 Walking skeleton, 02 Diff library spike

**Status:** ready-for-agent

- [ ] Steps render with the chosen diff library, bundled by esbuild.
- [ ] The page region is redrawn from state by its render function, not patched.
- [ ] A Playwright test checks a step's diff renders its files and changed lines.
