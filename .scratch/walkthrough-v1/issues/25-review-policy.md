# 25: Review policy: template, interview, skill

**What to build:**
The plugin ships a review policy template with editable defaults and no names of agents, plugins, trackers or code hosts.
On first run, and on later runs while the person's policy is still the unchanged template, the skill offers it and interviews the person about how they actually review, then writes their answers into their policy.
The skill reads the policy and the project's instructions on every walkthrough and records steps, notes, checklist and actions as they say.

**Blocked by:** 21 Agent-defined actions and decisions

**Status:** ready-for-agent

- [ ] The template carries step order, writing rules, finding checks, low-priority rules, draft rules with an agent-written marker, and actions.
- [ ] First run offers the template and an interview; an unchanged template is offered again later.
- [ ] SKILL.md holds no review rule of its own; every judgement points at the policy or project instructions.
- [ ] The CLI never reads the policy.
