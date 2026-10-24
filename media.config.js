// Where the recordings live. This is the only file to change when the media moves.
//
// `base` is put in front of every file name below. The recordings are kept in
// this site's own media/ folder, so they publish with it on GitHub Pages.
// To host them elsewhere later (for example Cloudflare R2), set `base` to that
// address, or give any single entry a full https:// URL of its own.

window.MEDIA_CONFIG = {
  base: 'media/',
  files: {
    'replay-audio': 'full-class-replay.m4a',
    'settling-breath': 'settling-and-sensing-breath.m4a',
    'sounding-resonance': 'sounding-and-resonance.m4a',
    'haiku-play': 'haiku-exploration.m4a'
  }
};
