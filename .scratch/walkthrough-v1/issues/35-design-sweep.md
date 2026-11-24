# 35: Design sweep across every state

**What to build:**
Render every state from the boards in the built page, in light and dark, at desktop and 390px, in Chromium, Firefox and WebKit, compare with the boards, and fix every difference; measure text contrast on every background against WCAG 2.2 AA and fix what misses.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 31, 32, 33, 34

**Status:** done

- [x] A screenshot of each board state from the built page sits beside the board in a review page saved under the docs folder named by the person's global rules, light and dark.
- [x] Every contrast pair meets AA, or the miss is reported with its measured ratio.
- [x] All tests green in all three browsers.
