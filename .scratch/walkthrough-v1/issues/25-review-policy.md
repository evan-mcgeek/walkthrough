# 25: Review policy: template, interview, skill

**What to build:**
The plugin ships a review policy template with editable defaults and no names of agents, plugins, trackers or code hosts.
On first run, and on later runs while the person's policy is still the unchanged template, the skill offers it and interviews the person about how they actually review, then writes their answers into their policy.
The skill reads the policy and the project's instructions on every walkthrough and records steps, notes, checklist and actions as they say.

**Blocked by:** 21 Agent-defined actions and decisions

**Status:** ready-for-agent

- [ ] The template carries every default listed under "Review policy template" in the spec, including settled findings as conventions, the fix-list hand-over, and received-review and reply walkthroughs.
- [ ] First run offers the template and an interview; an unchanged template is offered again later.
- [ ] SKILL.md holds no review rule of its own; every judgement points at the policy or project instructions.
- [ ] The CLI never reads the policy.

## Rules that left SKILL.md in ticket 16

Ticket 16 removed these from the skill; the template should carry them as editable defaults.

- A step is one idea rather than one file and may span several files.
- A test goes into the step whose behaviour it proves, never into a step of its own; a step without tests says so in its explanation.
- Steps are ordered by dependency, so each builds on what the person has already read; within a layer, what is called comes before what calls it.
- Files nobody writes by hand (regenerated, copied in from elsewhere, recorded test output) are folded, each with the reason it was folded, and checked against the files they come from; any mismatch is recorded as a problem of the folded step.
- A file that only looks generated but is written by hand stays in the step it serves.
- An explanation says what changed and why, from the code and the ticket, never from the author session's own summary.
