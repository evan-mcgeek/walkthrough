# 36: Two flows, two commands

**What to build:**
Two skills over the same CLI, one for each kind of walkthrough.

1. `/walkthrough`: your own change (the current branch), ending with a fix list handed to an author session; a step defaults to Approve and Flag.
2. `/walkthrough:pr <number or link>`: a review request; the session fetches the change as the policy says, and ends with your comments as `[AI]`-marked drafts you accept, edit or drop, posted as one pending review; reopening after the author replied shows only the changed threads.
3. The `REVIEWER.md` template gets two clear sections, "My change" and "Someone else's change", plus shared rules; each command reads only its own section and the shared one.
4. The CLI stores the kind as an opaque label the session gives on `start` ("own" or "requested"); the page header and the list page show it quietly, and `walkthrough guide` documents it.
5. README and GLOSSARY describe the two kinds of walkthrough.

**Blocked by:** none

**Status:** ready-for-agent

- [ ] `/walkthrough` and `/walkthrough:pr` each state their own procedure and share the listen loop and inbox rules.
- [ ] Each skill reads only its own section of the policy and the shared rules.
- [ ] `walkthrough start --kind <label>` stores the label; the page header and the list page show it; the hook still approves only plain `walkthrough` commands.
- [ ] The shipped template-hash list in `src/policy.ts` has the new template.

## Skill naming, from Claude Code's docs

Checked on 2026-11-23 against Claude Code 2.1.330.

1. A plugin skill at `skills/<dir>/SKILL.md` is invoked as `/<plugin>:<dir>`, or `/<plugin>:<name>` when its frontmatter sets `name` ([Skills: How a skill gets its command name](https://code.claude.com/docs/en/skills#how-a-skill-gets-its-command-name), [Plugin components: Skills](https://code.claude.com/docs/en/plugins/components#skills)).
   So `plugin/skills/pr/SKILL.md` in the `walkthrough` plugin is `/walkthrough:pr`.
2. "The bare `/fancy` also invokes the skill unless another command already uses that name": a plugin skill whose frontmatter sets `name` also answers to that bare name.
   The existing skill sets `name: walkthrough`, so the bare `/walkthrough` keeps working however many skills the plugin has.
   The new skill sets no `name`, so it never takes a bare `/pr` from another command.
3. Arguments reach a skill through `$ARGUMENTS` (and `$0`, `$1`, ... by position); with no placeholder in the skill, Claude Code appends `ARGUMENTS: <value>`; `argument-hint` shows the expected arguments in autocomplete ([Skills: Pass arguments to skills](https://code.claude.com/docs/en/skills#pass-arguments-to-skills)).
4. A skill may link supporting files ([Skills: Add supporting files](https://code.claude.com/docs/en/skills#add-supporting-files)), but Claude reads them with the Read tool, and a read outside the working directories asks the person ([Permissions](https://code.claude.com/docs/en/permissions#working-directories)).
   An injected `` !`command` `` aborts the whole skill when it fails or is not allowed ([Skills: Inject dynamic context](https://code.claude.com/docs/en/skills#inject-dynamic-context)).

Verified in a headless run (`claude -p --setting-sources project`) of a throwaway plugin shaped like this one: the bare name and `/<plugin>:<name>` both ran the first skill, `/<plugin>:pr 123` ran the second with `123` as `$ARGUMENTS`, a bare `/pr` did not reach it, and a Read of a file in the plugin, even in the skill's own folder, was refused without approval.

With the built plugin, in the same kind of run, `/walkthrough` went from `walkthrough policy` to `walkthrough start --kind own`, and `/walkthrough:pr 123` began with `walkthrough policy` and the project's instructions.

So the shared procedure cannot live in one file both skills read without a permission prompt each walkthrough; both skills carry the shared sections word for word, and a test keeps them identical.

## Seams under test

- The CLI: `start --kind` and what `data/walkthrough.json` and `data/list.json` then serve.
- The page: the header and the list page show the kind.
- The hook: `walkthrough start --kind ...` is approved like any plain command.
- The policy: the current template is in the shipped hash list; an unchanged copy of the previous template still counts as the template.
- The skills: their shared sections are identical.
