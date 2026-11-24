# 34: List page and read-only export restyled

**What to build:**
The list page and the read-only export follow their boards in light and dark, using the same tokens, fonts and icons; the export stays a single self-contained file (fonts inlined) that opens offline under its own CSP.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** 28 Design foundation

**Status:** done

- [x] The list and the export match their boards.
- [x] The export opens offline from one file with the self-hosted font inlined and no network request.
