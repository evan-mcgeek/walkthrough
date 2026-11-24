# 56: Round 5 session data and the copy deck

**What to build:**
Copy the round 5 design into `docs/design/` (HANDOFF.md, PRODUCT.md, COPY-round-5.md, CLAUDE-CODE-HANDOVER.md, screens.html, prototype.html as they are; DESIGN.md three-way merged with the repo's copy, which holds round 4 lines the designer's copy lacks).
Actions gain three optional fields the session records from the person's policy: `consequence` (at most 8 words, where it goes or what it costs), `outcome` (at most 3 words, past tense, shown after deciding) and `primary` (at most one per item; its consequence shows under the buttons).
`asks_reason` is the existing `note: true` (already optional); a note's kind is its label; a note needs a decision when it has actions.
The guide prints the fields; the policy template gives each action its consequence and outcome and takes DESIGN.md's Words caps and slot shapes; ship its hash.
Apply COPY-round-5.md to every page string ("remove" goes), within the caps.

**Blocked by:** release 0.0.2

**Design:** docs/design/HANDOFF.md (Round 5, section 4), DESIGN.md (Words), COPY-round-5.md

- [ ] Design files in docs/design/, DESIGN.md merged
- [ ] consequence, outcome, primary recorded, validated and served to the page
- [ ] Guide and template updated, template hash shipped
- [ ] Every COPY-round-5.md change applied; no string over its cap

**Status:** ready-for-agent
