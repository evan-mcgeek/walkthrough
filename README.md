<p align="center"><img src="docs/images/icon.png" alt="" width="96"></p>

# Walkthrough

A pull request review page on your laptop, made better by AI.
It's a Claude Code plugin.

You get what you know from your code host: files, diffs, Viewed, comments, threads and one review at the end.
As well, your Claude Code session walks you through the change step by step, says what to look at in each step, comments where it matters and answers your questions in threads.

I use it for two things:

1. reviewing what my agent wrote, before colleagues see it
2. reviewing a colleague's pull request

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/main-dark.png">
  <img alt="A walkthrough: the steps on the left, the open step with its explanation and diff on the right" src="docs/images/main-light.png">
</picture>

## Install

You need Claude Code, git and Node.js 22 or later.

```sh
claude plugin marketplace add evan-mcgeek/walkthrough
claude plugin install walkthrough@walkthrough
```

To run it from a clone:

```sh
git clone https://github.com/evan-mcgeek/walkthrough.git
cd walkthrough && npm install && npm run build
cd /path/to/the/repo/to/review
claude --plugin-dir /path/to/walkthrough/plugin
```

## Use

```text
/walkthrough          your current branch
/walkthrough:pr 123   a pull request, by number or link
```

For another branch or a range of commits, just say so in the chat.
Nothing is ever checked out, and uncommitted edits are left out with a warning.

1. The session asks how well you know the feature, from "I know it well" to "It's new to me", and explains only as much as you need.
2. The page opens and the steps appear: each with "Look at:" links to the lines that matter and a sentence or two of explanation.
3. The AI reviews against the ticket and leaves its comments on the lines, marked `[AI]`. Colleagues' threads show on their lines as well.
4. You read, mark files Viewed, comment, edit or delete the AI's comments, reply and resolve.
   For a question, use Ask AI in a thread; the answer stays on the page and never goes out.
5. The Summary shows every comment that will go out, the threads and files left, and the acceptance criteria as the AI checked them.
   Pick Comment, Approve or Request changes and submit.

On a pull request, Submit review posts one review with your summary and comments.
On your own change, Send to agent hands your comments back to the agent as a fix list.
So, nothing leaves before you submit.

When new commits arrive, the same walkthrough goes on, and a file you viewed opens again as "Changed since last view".
It works on a phone as well.

<img alt="A walkthrough at 390px wide" src="docs/images/phone.png" width="300">

Ask the session to export a walkthrough and you get one read-only HTML file, or ask which walkthroughs you have open and you get a list.

![An exported walkthrough](docs/images/export.png)

![The list of walkthroughs](docs/images/list.png)

## Your rules

How it reviews comes from two places:

1. **Your review policy**, `~/.config/walkthrough/REVIEW.md`, outside every project.
   It starts as a copy of [the template](plugin/skills/walkthrough/REVIEW.md), and on the first run the session offers a short interview to make it yours.
   It covers how much to explain, how to split the steps, which reviewers run, when to comment and where the review goes.
2. **The project's instructions for agents**: `CLAUDE.md`, `AGENTS.md` and the files they point to.

The tool itself has no rules: nothing about your language, tracker, code host or team is hardcoded ([ADR 0005](docs/adr/0005-nothing-specific-in-the-tool.md)).

## How it works

The session drives the `walkthrough` CLI; you rarely type it yourself.
It writes what it records to files in the walkthrough's inbox and passes them with `--file`.
`walkthrough listen` waits in the background, so the chat stays free, and only Ask AI and the submitted review wake it ([ADR 0004](docs/adr/0004-no-mcp.md)).

The plugin's hook approves only `walkthrough` commands and the session's writes to its inbox; everything else goes through your usual permissions ([ADR 0006](docs/adr/0006-a-plugin-hook-approves-the-cli.md)).

| Command | What it does |
| --- | --- |
| `start` | Starts or resumes a walkthrough and opens its page; `--pr <number>` makes it a pull request. |
| `files` | Lists the changed files. |
| `steps`, `comment`, `threads`, `criteria` | Record the steps, the AI's comments, colleagues' threads and the acceptance criteria. |
| `reviewing` | Records the steps the AI is still reviewing. |
| `listen`, `say` | Wait for Ask AI and the submit; answer in the thread. |
| `comments`, `posted` | Print what goes out; record that it went out, and where. |
| `policy` | Shows, creates or saves your review policy. |
| `export`, `list` | Write a read-only HTML file; open the list of walkthroughs. |
| `stop`, `prune` | End the page; remove old walkthroughs. |

`walkthrough guide` prints the exact formats.

## Cost

Preparing a 16-file change (steps and comments, no reviewer agents) took about $0.79 at list price with Claude Opus 5.5, measured once before the page was rebuilt.
Each reviewer agent your policy runs adds its own cost, around 74,000 tokens for a 10-file change in my runs.

## Development

```sh
npm install
npx playwright install chromium
npm test        # CLI and page tests, Chromium, 4 workers
npm run lint    # type check and ESLint
```

`npm run test:browsers` runs Firefox and WebKit as well, only when needed.
Rules for working on the code are in [`AGENTS.md`](AGENTS.md), the design in [`docs/design/`](docs/design/), the decisions in [`docs/adr/`](docs/adr/).

To release, label a pull request to `main` with `release`.
When it merges, CI runs the tests, builds the plugin and pushes it to the `release` branch, which is what the marketplace installs.

## License

[MIT](LICENSE)
