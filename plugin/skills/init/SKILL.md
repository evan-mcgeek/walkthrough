---
description: Set up Walkthrough before a first review, in a few short questions: the person's review policy, the code host's sign-in and the voice of the comments that go out. Use when the person runs /walkthrough:init or asks to set up Walkthrough or their review policy.
allowed-tools: Bash(walkthrough *)
---

# Setting up Walkthrough

The person sets up how they review, before a first walkthrough or whenever they want to go through it again.
Go through the steps below in order, one question at a time.
When a review skill sent you here, stop after step 3 and go on with its review.

## 1. The review policy

The person's policy lives outside every project, and starts as a copy of the template the plugin ships.
Run `walkthrough policy`; its first line names the policy's state and path.
When it is `yours`, say so in one line and offer to go through it again; when they say no, go on to step 2.
Otherwise, or when they say yes:

1. With no policy yet, run `walkthrough policy init` to copy the template there.
2. Read it with `walkthrough policy show`, and go through its sections in order.
   For each, sum up its defaults in a line and ask one short question about how they actually review that part.
   Before asking the next question, write the whole policy with that answer applied to a file in the inbox `walkthrough policy` printed, and save it with `walkthrough policy save --file <file>`; "keep" leaves the section as it is.
   The save uses up the file, so for the next answer write the whole policy again, from the version you last saved, to a new file.
3. The interview is done when every section is asked or they say enough; go on to step 2.

Never read or edit the policy file itself; the `walkthrough policy` commands are how you reach it.
Every policy change in the steps below goes through `walkthrough policy save --file <file>` the same way, writing the whole policy from `walkthrough policy show`.

## 2. The code host

Ask in one line whether they review pull requests in this repo; when they say no, go on to step 3.
When they say yes, check that the code host's command-line tool the policy names is signed in, with its read-only status command; when the policy names none, use the tool for the code host the repo's remote points to.
When it is not signed in, give its login command for the person to run with `!` in the prompt.
Never ask for a password or a token.

## 3. The voice of your comments

Offer this at most once, and skip it when the policy already has the line "Never offer the voice plugin." or a line about writing in their voice.

- When the person has a VOICE.md (the project root, then `~/.claude/VOICE.md`), ask one short question: write the comments that go out in that voice?
  Yes adds the voice line below to the policy's Comments section; no adds "Never offer the voice plugin.".
- Otherwise offer it in these words: "Your [AI] comments go out under your name; the voice plugin makes them read like you. Want it?"
- Yes: with the person's go, run `claude plugin marketplace add evan-mcgeek/skills` and `claude plugin install voice@evan-mcgeek-skills`, skipping what `claude plugin marketplace list` and `claude plugin list` show is there already.
  Tell them to run `/reload-plugins` and then `/voice:init` to build their VOICE.md, and add to the policy's Comments section: "Write the comments that go out in my voice, from my VOICE.md."
- No: add "Never offer the voice plugin." to the policy's Comments section, and say nothing more about it.

## 4. Done

Finish with one line: run `/walkthrough` for your branch, or `/walkthrough:pr <number or link>` for a pull request.
