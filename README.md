# Body Mapping: Finding Ease in Your Voice — local preview

A small static site: a password page, a home page, the full class replay (four parts with chapters) and three practice pages.

## Open it

Double-click `index.html` (or drag it into Safari or Chrome). Password: `VOICE`.

No server is needed. The recordings are in `media/` and publish with the site.

## Files

| File | What it is |
|---|---|
| `index.html` | The page shell. |
| `styles.css` | Evolving Ground palette (light and dark follow the device), Lato, motion. |
| `app.js` | Screens, navigation, player (remembers each recording's spot), password page. |
| `icon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Browser tab and home-screen icons. |
| `artwork.png` | Lock-screen and Control Center artwork while a recording plays. |
| `og.png` | Image in the link preview when the address is texted or shared. |
| `content.js` | All page copy and chapter times (seconds). Generated from the package's `class-content.json`. |
| `media.config.js` | Where each recording lives. The only file to change when the media moves. |
| `media/` | The four class recordings, byte-identical copies of the reviewed files. |
| `build/make_content.py` | Regenerates `content.js`: `python3 build/make_content.py "<package>/class-content.json" content.js` |

## Times

Full-replay chapters use `replay_seconds`; practice chapters use `standalone_chapters[].practice_seconds`, straight from the JSON.

## Before this goes on GitHub Pages

- **Media hosting:** the recordings live in `media/` in this repository (about 120 MB; each file is under GitHub's 100 MB limit). A free GitHub account publishes Pages only from a public repository, so the files can be downloaded from the repository too. To move them later (for example to Cloudflare R2), set `base` in `media.config.js`.
- **Access:** the password page is a light gate only. On a static host, anyone with the page source or the media addresses can still reach the files. If access needs to be real, it has to come from the hosting (a protected media host or an access-controlled site).
- **Fonts:** Lato loads from Google Fonts; without a connection the system font is used.
