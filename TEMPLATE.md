# Adding the next Body Mapping class

Each class gets its own repository and its own GitHub Pages site, built from this one.
This class lives at `teleokinetic/finding-ease-in-your-voice`. The next one will be
`teleokinetic/<new-class-name>`, published at `https://teleokinetic.github.io/<new-class-name>/`.

## 1. Copy the folder

Copy `~/Sites/finding-ease-in-your-voice/` to `~/Sites/<new-class-name>/` (lowercase, hyphens).
Delete the old recordings from `media/` in the copy, not in the original.

## 2. Swap the media

- Put the new class's `.m4a` files in `media/`. Use short lowercase names, e.g. `full-class-replay.m4a`.
- Keep each file under 100 MB. GitHub refuses larger files.
- In `media.config.js`, list each file under its key. The replay's key is `replay-audio`;
  each practice's key is its `id` from the class JSON.

```js
files: {
  'replay-audio': 'full-class-replay.m4a',
  '<practice-id>': '<practice-file>.m4a'
}
```

## 3. Swap the content

1. Get the new class's `class-content.json` (same shape as this one: `title`, `class_date`,
   `replay_duration_seconds`, `parts[].chapters[]` with `replay_seconds`, and `practices[]` with
   `id`, `title`, `function`, `page_outline`, `standalone_duration_seconds`).
2. In `build/make_content.py`, change the two lines that are specific to this class:
   - `'title': 'Finding Ease in Your Voice'` → the new class title
   - `HAIKU = {...}` → `{}`, or the new class's text block if it has one
3. Rebuild:
   ```
   python3 build/make_content.py "<path to>/class-content.json" content.js
   ```
   It prints how many practices and replay chapters it wrote. Open `content.js` and read it through:
   everything in it is visible on the page.
4. In `index.html`, change the `<title>`.

## 4. Change the password

All class sites share one address (`teleokinetic.github.io`), so each class needs its own
remembered-password key, or unlocking one class unlocks them all. In `app.js`:

- `UNLOCK_KEY = 'feiyv-unlocked'` → a new key, e.g. `'<initials>-unlocked'`
- `PASS_HASH = '29e07099'` → the hash of the new password, in capitals. To get it, run:
  ```
  node -e "let h=0x811c9dc5;for(const c of process.argv[1].toUpperCase()){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}console.log(h.toString(16))" NEWPASSWORD
  ```

## 5. Check it, then publish

1. Double-click `index.html` and click through every page: password, home, replay chapters, each
   practice, Up next, All recordings.
2. On github.com, create a new **public, empty** repository named `<new-class-name>`.
3. Push the folder to it, then go to **Settings → Pages → Build and deployment → Deploy from a
   branch → `main` / root**. It goes live within a few minutes.
4. Open the live link on your iPhone and play, seek and lock the screen once before sharing it.

## Notes

- Never re-encode or trim the audio for the site. The files go up as they are.
- The password page is a light gate. Anyone with a file address can still download the recordings.
- `noindex` in `index.html` asks search engines not to list the site. Leave it in.
