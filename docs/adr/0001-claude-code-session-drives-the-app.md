# A Claude Code session drives the app

The walkthrough app has no agents of its own: a Claude Code session started by the user runs the reviewers and answers what the user does on the page, the way another local tool's canvas works.
This keeps the reviewers identical to the agents the team already runs (its skills, a reviewer agent, tracker access, AGENTS.md, memory) and runs on the user's Claude subscription.

## Considered Options

- The app runs agents itself through the Claude Agent SDK: standalone, but it would carry its own copies of skills and tracker access that drift from the team's setup, and bill per API call.
