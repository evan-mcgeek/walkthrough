# 10: Settled findings into AGENTS.md

**What to build:**
Rejecting a finding asks for a one-line reason and turns it into a proposed convention for the reviewed repo's AGENTS.md, phrased as a statement about the repo, placed under its existing conventions section or a new Conventions section.
The person sees the diff; on yes it is written to the working tree and left uncommitted.

**Blocked by:** 07 Findings and the finding gate

**Status:** ready-for-agent

- [ ] Reject requires a one-line reason.
- [ ] The proposal is phrased as a convention, not as "don't flag X".
- [ ] It goes under the repo's existing conventions section, or a new Conventions section.
- [ ] Nothing is written until the person says yes; the change stays uncommitted.
- [ ] A CLI test covers the proposed and written AGENTS.md against a throwaway repo.
