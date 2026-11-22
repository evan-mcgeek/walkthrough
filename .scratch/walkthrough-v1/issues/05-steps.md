# 05: Steps

**What to build:**
The skill splits the change into steps: each one logical piece that may span files, ordered by dependency (data, logic, API, UI), with what changed and why.
Tests appear inside the step whose behaviour they prove.
Mechanical files are collapsed into one step at the end and checked only for consistency.
The page shows step navigation and how many steps are decided and left.

**Blocked by:** 01 Walking skeleton

**Status:** done

- [ ] A real branch produces several steps in dependency order, each with what changed and why.
- [ ] Test files are attached to the step whose behaviour they prove.
- [ ] Lockfiles, files marked generated in .gitattributes or by a generated-file header, snapshots and vendored code form one collapsed mechanical step.
- [ ] A changed .gitignore is never mechanical.
- [ ] The mechanical step reports consistency problems (for example a lockfile not matching its manifest).
- [ ] The page shows step progress and lets the person move between steps.
- [ ] CLI tests cover recording steps and mechanical classification; a Playwright test covers navigation and progress.
