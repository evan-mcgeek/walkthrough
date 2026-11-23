# 28: Design foundation: tokens, fonts, icons, header and controls

**What to build:**
The page takes the approved design's foundation: the semantic colour tokens for light and dark (switched by the system setting), the type scale, the 4px spacing scale, radii, the one float shadow, a drawn 16px SVG line-icon set, and self-hosted JetBrains Mono bundled with the page.
Base controls follow the design: primary, secondary, ghost, session-offer (dashed) and small buttons, inputs, textareas and selects with the drawn chevron, tags (undecided, decided, reopened), counters, file chips, notices (neutral, attention), the session question box and the detached box.
The header is the design's: logo, mono walkthrough label, segmented progress bar with a tabular count, a slot for the layout switch, session status (dot and label per state) and Stop.

Design source: `docs/design/DESIGN.md` (tokens, rules, components, motion), `docs/design/PRODUCT.md`, and the boards `docs/design/screens.html` (every state, light and dark) and `docs/design/prototype.html` (motion). The boards are references: rebuild them in the page's own code under the strict CSP (no inline styles), never embed them.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Every colour comes from a semantic token defined once per theme; no inline styles; the strict CSP is unchanged and no font or asset loads from a CDN.
- [ ] JetBrains Mono is self-hosted from a mature package and used only for code, paths, identifiers and the session label.
- [ ] Controls have hover, focus-visible (2px indigo, 2px offset) and disabled states as specified; decided states are neutral grey, never green.
- [ ] The header matches the board's header in light and dark, including the segmented progress bar coloured by step state.
- [ ] Existing page tests stay green; new e2e checks cover the progress segments and status states.
