# Working on Walkthrough

## First rule: nothing specific in the tool

The CLI and the page know only git, their own state and the page (ADR 0005).
Never put a rule about a language, package manager, file name pattern, tracker, code host, reviewer or workflow into the code.
Judgement about code belongs to the session, guided by the review policy and the project's instructions; the CLI only checks structure (for example that every changed file is in exactly one step) and stores what the session records.
If a feature seems to need such a rule, it belongs in the skill or the review policy template instead.
The review policy is the person's, not the tool's state: the CLI only compares it with the template and copies it, byte for byte, and never reads its rules.

## Testing on a laptop

This is a local tool built on a laptop, so tests stay light.
While building, run `npm test` (Chromium, 4 workers); run `npm run test:browsers` once before a release.
Only one agent runs browser tests at a time.
Never use `--repeat-each`, stress runs or synthetic load (`yes` loops, CPU burners); fix a flake from its trace and the race in the code.

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles, each label named after its role. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
