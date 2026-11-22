# No MCP between the page and the session

The page reaches the session through `walkthrough listen`, a background command that exits when the person acts on the page and so wakes the session; the session answers with `walkthrough say`, which the page picks up by polling.
There is no MCP: a blocking MCP call would freeze the chat while the person reads the page, and a background command needs nothing installed beyond the plugin.
