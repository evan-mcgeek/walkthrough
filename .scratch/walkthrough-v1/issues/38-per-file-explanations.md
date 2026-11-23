# 38: Per-file explanations

**What to build:**
1. The session can record a short explanation per file in a step (optional), shown above that file's diff; the step explanation stays on top as the overview.
2. Recording shape in `walkthrough guide`; the skill and template say when to use it.

Design: extend DESIGN.md's existing tokens and components.

**Blocked by:** 36 Two flows, two commands

**Status:** done

- [x] A step's file may be given as `{"path": path, "explanation": string}`; the page shows that explanation in Prose under the file's header, above its diff and preview, with the step explanation on top as the overview.
- [x] The explanation shows in every layout (in "Explanation beside code" with its file in the code pane) and in the export.
- [x] `walkthrough guide` prints the shape and its example uses it; both skills and the review policy template say when to give one: short, about that file alone, never repeating the overview.
- [x] The shipped template-hash list in `src/policy.ts` has the new template.

## Seams under test

- The CLI: `walkthrough steps` records file explanations by path and refuses a file without a path or with an empty explanation; `walkthrough guide` prints the shape and an example that records as it is.
- The page: the explanation sits between the file's header and its diff, also in "Explanation beside code" and in the export.
