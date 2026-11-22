# 21: Agent-defined actions and decisions

**What to build:**
The session defines actions on steps, notes, checklist items and the whole walkthrough: a label, whether a note is asked for, and whether the item's text can be edited first.
With none defined, a step offers Approve, Flag and Ask.
Taking an action records a decision in an append-only log and wakes the listener with it, including any note and edited text.
An undecided item stays undecided everywhere; read state is kept apart from decisions; deciding a step collapses it in the step list.

**Blocked by:** 19 Notes on steps and lines, 20 Checklist panel

**Status:** done

- [ ] Actions render per item exactly as the session defined them, plus walkthrough-level actions at the end.
- [ ] An action that asks for a note or allows editing collects it before sending.
- [ ] `listen` returns each decision with item, action, note and edited text.
- [ ] Decisions can be changed until the walkthrough ends; the log keeps every change.
- [ ] Undecided items are reported as undecided by every output, never as approved.
- [ ] Steps the page has shown are marked read separately from decided; decided steps collapse.
