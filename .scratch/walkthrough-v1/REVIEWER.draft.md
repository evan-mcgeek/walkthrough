# REVIEWER.md (draft, not final)

The review policy: one per person, at `~/.config/walkthrough/REVIEWER.md`, created on the first run.
It is not added to reviewed repos.
It is written for agents; the app never parses it.

It holds generic reviewing config and rules only; anything specific to one repo lives in that repo's AGENTS.md.

## Review with

<!-- Either "walkthrough default reviewers", or a redirect to an existing review agent, skill or workflow, which then only produces the findings. -->

walkthrough default reviewers

<!-- Example redirect: a reviewer agent you already run. -->

## Ticket

Ticket key from the branch name, else the PR title.
Read the description and the decision comments; a later comment overrides an earlier one.

## Reviewers

- Spec: map every AC of the ticket to the steps that deliver it.
- Rules: check the change against the reviewed repo's AGENTS.md and CLAUDE.md one rule at a time, quoting the rule.
- a reviewer agent, contracts.
- a reviewer agent, error handling.
- a reviewer agent, state.
- a reviewer agent, tests.

Off unless listed above: other installed review skills.

## Finding gate

- A finding names a concrete failure: what input or state leads to what wrong result.
- A second agent confirms it before it is shown.
- Unconfirmed findings stay behind a count; opinions are dropped.

## Drafted comments

- Length: one or two sentences, the failure and the fix. No preamble, no praise. The voice skill changes tone, never length.
- Voice skill: none.
- AI marker: `[AI]` on every comment an agent drafted; dropped only on comments you write yourself.
