# No MCP between the page and the session

The page reaches the session through `walkthrough listen`, a background command that exits when the user acts on the page and so wakes the session; the session answers with `walkthrough say`, which the page picks up by polling.
There is no MCP, although another local tool ships one: its MCP `wait` watches app health, its page requests travel through a background listen command exactly like this, and a blocking MCP call would freeze the chat while the user reads the page.
