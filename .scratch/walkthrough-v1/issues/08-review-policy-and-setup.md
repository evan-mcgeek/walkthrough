# 08: Review policy and first-run setup

**What to build:**
The first `/walkthrough` runs setup before anything else and writes the person's review policy (`REVIEWER.md` in their walkthrough config folder).
It asks three things: default reviewers or a redirect to an installed review agent or skill (listing the ones it finds), a voice skill or none, and the AI marker text.
A redirect replaces only who produces findings; output that does not fit the finding shape is shown raw as unparsed.

**Blocked by:** 07 Findings and the finding gate

**Status:** ready-for-agent

- [ ] First run asks the three questions and writes the review policy from the draft in this folder; later runs skip setup.
- [ ] Setup lists installed review agents and skills it finds.
- [ ] The review policy holds only generic rules and is never written into reviewed repos.
- [ ] With a redirect, the AC map, steps, gate and page still work.
- [ ] Redirect output that is not file:line plus failure is shown under unparsed.
- [ ] A CLI test covers the policy file existing in the temporary config folder after setup.
