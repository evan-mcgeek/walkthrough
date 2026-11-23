# 42: Panels instead of fixed layouts

**What to build:**
Replaces the four fixed layouts (ticket 31) with panels the person shows or hides independently.
1. Toggles in the header for each panel: "What's left" queue, Checklist (side column with whole-walkthrough actions), Explanation column (explanation beside the code instead of above it), Tool panel (tabs under the step).
2. Default: two columns, the queue on the left and the step (explanation above its diffs) on the right; the other panels hidden.
3. Any combination works and keeps every function; hiding a panel never hides its content for good: the checklist and session messages stay reachable from the queue (or the Summary step) when their panels are off.
4. The choice is remembered per viewer in browser storage, with a safe fallback to the default.
5. At 390px the toggles live in the More menu, as the layout switch does today; panels stack.
6. Update DESIGN.md (Layout and Navigation sections), the README's Layouts section and its screenshots; remove the four-layout switch and its tests in favour of panel tests.

Design: follow the round 2 boards on the design canvas (BRIEF-round-2.md) once they land; until then, extend DESIGN.md's existing tokens and components.

**Blocked by:** 36 Two flows, two commands

**Status:** ready-for-agent
