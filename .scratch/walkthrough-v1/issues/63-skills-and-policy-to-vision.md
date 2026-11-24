# 63: Skills and the policy template for the new page

**What to build:**
Rewrite both skills and the REVIEW.md template to the new commands: steps with Look at, AI comments, criteria, colleague threads, Ask AI answers in threads, and Submit review posting one finished review (pull request) or a fix list for the agent (own change).
Drop every rule about actions, tones, findings, decisions and session messages; keep the four-answer familiarity question.
Add the template's hash to `src/policy.ts`; then update the person's policy with them through `walkthrough policy save`.

**Blocked by:** 60

**Design:** VISION.md, docs/design/HANDOFF.md

- [ ] No skill or template line names a removed command or concept
- [ ] The person's policy is updated with them

**Status:** ready-for-agent
