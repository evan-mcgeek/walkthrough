# A Claude Code session drives the app

The walkthrough app has no agents of its own: a Claude Code session started by the person records everything the page shows and answers what the person does on it.
That keeps every reviewer, skill, tool and access the person already has available to the walkthrough, without the app carrying copies of them, and runs on the person's own Claude subscription.

## Considered Options

- The app runs agents itself through the Claude Agent SDK: standalone, but it would need its own copies of skills and integrations that drift from the person's setup, and bill per API call.
