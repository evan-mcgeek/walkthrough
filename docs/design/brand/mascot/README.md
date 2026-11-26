# Walky, the Walkthrough mascot

The AI, drawn as itself: the ink rounded square from its comments, given eyes, an antenna, a body and a desk. Its name, Walky, comes from Walkthrough.

See it all on one page in `mascot.html`. The README and social banners (Walky and the name) are in `../banner/`.

## Files

Each drawing comes three ways:

- `name.svg`: follows the viewer's light or dark setting (tokens inside the file). Use this on the web and in READMEs.
- `light/name.svg` and `dark/name.svg`: fixed colours, for design tools and slides that ignore the setting.
- `png/`: the figure at 512px and each head at 256px, light and dark, transparent background.

The scenes and `mascot-wave.svg` carry their own CSS motion; under reduced motion they are still pictures.

| File | What | Where it is used |
|---|---|---|
| `mascot.svg` | The mascot, standing | Hero, docs, empty states |
| `mascot-wave.svg` | Standing, waving once | Hello and goodbye |
| `head-neutral.svg` | Head: Awake | Default; the favicon while a session runs |
| `head-reading.svg` | Head: Reading | The Opening, eyes on the code |
| `head-surprised.svg` | Head: Surprised | Spots a problem: “Wait, what?!” |
| `head-thinking.svg` | Head: Thinking | Leans in: “Hmm…” |
| `head-happy.svg` | Head: Happy | Approves; sent; the farewell |
| `head-wink.svg` | Head: Wink | Review submitted |
| `head-confused.svg` | Head: Confused | The Opening failed |
| `head-asleep.svg` | Head: Asleep | The session isn’t running |
| `favicon-awake.svg` | Favicon: awake | A session is running |
| `favicon-reading.svg` | Favicon: reading | The Opening (review not ready) |
| `favicon-asleep.svg` | Favicon: asleep | The session isn't running |
| `favicon-done.svg` | Favicon: done | Review submitted or sent |
| `scene-reading.svg` | Scene: reading (24s story) | The Opening |
| `scene-farewell.svg` | Scene: farewell | Session ended, something went out |
| `scene-farewell-nothing-sent.svg` | Scene: farewell, nothing sent | Session ended, nothing went out |
| `scene-asleep.svg` | Scene: asleep | The session isn't running |

## Construction

- Head 72 × 60, corners 17; antenna 11 with a 3.6 ball; eye pills 9 × 13, 20 apart.
- 48px and up: full head with antenna. 32px and below: the favicon head, no antenna, eyes drawn larger. Never below 16.
- Colours: ink (`--tx`) for the body, canvas (`--bg`) for the face. Desk and monitor in secondary ink and rules; diff green and red only on its screen.

## Rules

Do: use it where the page waits, recovers or ends; keep it ink and canvas; one expression per moment with words beside it; aria-hidden when the words already say it; stop motion under reduced motion and offscreen.

Don't: put it next to code being read, in threads or in the step list; colour it with the accent or a status colour; add props, outfits, gradients or shadows; let it speak the AI's findings; loop it where nothing is waiting.
