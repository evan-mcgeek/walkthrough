# Nothing specific in the tool

The CLI and the page know only git, their own state and the page: they serve the change, store what the session records and pass the person's decisions back.
Every rule, analyzer, tracker, code host, reviewer and workflow step lives in the person's review policy or the project's instructions and is carried out by the session, so the tool works for any language, team and process and can be shared as it is.
A rule hardcoded in the tool (a lockfile list, a header pattern, a call to one code host) only ever fits some projects and grows without end, which is what this decision forbids.
