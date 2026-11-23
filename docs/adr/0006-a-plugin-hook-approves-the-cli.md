# A plugin hook approves the CLI's own commands

The plugin ships a PreToolUse hook that approves, for the whole session, a `walkthrough` command that runs nothing but itself and the session's writes to a walkthrough's inbox, where it puts what it records for `--file`.
A skill's `allowed-tools` grant ends when the next turn starts, and a wake-up from `walkthrough listen` starts one, so every answer on the page would ask the person; Claude Code's Bash safety check also refuses JSON passed through a heredoc even when an allow rule matches.
The hook decides from the command's words alone and leaves anything the shell would expand or run, and `export --out`, which writes where it names, to the person's own permissions.

## Considered Options

- Only `allowed-tools`: covers the first turn, then every recording and answer asks.
- An allow rule the person adds to their settings: works, but every person has to write it and it is wider than the plugin needs.
- A hook that also approves heredocs on standard input: proving a heredoc literal is more shell parsing than proving a file path is in an inbox.
