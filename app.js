/* Body Mapping: Finding Ease in Your Voice — the whole site.
   Screens: password, home, and one page per recording (#/replay, #/<practice id>).
   Motion follows the design: home rises in once; opening a recording pushes it in,
   "All recordings" pops back; "Up next" swaps in place. */
(function () {
  'use strict';

  var C = window.CONTENT;
  var M = window.MEDIA_CONFIG;
  var app = document.getElementById('app');
  var ITEMS = [C.replay].concat(C.practices);

  /* ---------- password ----------
     A light gate only: it keeps casual visitors out of the page, but anyone who
     reads the source or knows the file addresses can still reach the media. */
  var PASS_HASH = '29e07099';
  var UNLOCK_KEY = 'feiyv-unlocked';
  function hash(s) {                      // FNV-1a, 32-bit
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16);
  }
  function unlocked() { try { return localStorage.getItem(UNLOCK_KEY) === PASS_HASH; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(UNLOCK_KEY, PASS_HASH); } catch (e) {} }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmt(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var ss = (s < 10 ? '0' : '') + s;
    return h ? h + ':' + (m < 10 ? '0' : '') + m + ':' + ss : m + ':' + ss;
  }
  function spoken(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ' minutes ' + s + ' seconds';
  }
  function mediaSrc(key) {
    var f = M.files[key];
    if (!f) return '';
    if (/^(https?:)?\/\//.test(f) || f.charAt(0) === '/') return f;
    return encodeURI(M.base + f);
  }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function byId(id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; }
  function routeOf(hash) { var id = (hash || '').replace(/^#\/?/, ''); return byId(id) ? id : ''; }

  var ICON = {
    chev: '<svg class="chev" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tri: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    rew: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 3.5v3.7h3.7"/><text x="12.2" y="15.2" text-anchor="middle" font-size="7.2" font-weight="700" stroke="none" fill="currentColor" font-family="-apple-system, sans-serif">15</text></svg>',
    fwd: '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M20 3.5v3.7h-3.7"/><text x="11.8" y="15.2" text-anchor="middle" font-size="7.2" font-weight="700" stroke="none" fill="currentColor" font-family="-apple-system, sans-serif">15</text></svg>',
    play: '<svg class="i-play" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" style="margin-left:3px"><path d="M7.5 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2c.6-.4.6-1.3 0-1.7L9.1 3.9c-.7-.4-1.6.1-1.6.9z" fill="currentColor"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor"/></svg>',
    fs: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    gankyil: '<svg viewBox="2 2 96 96" role="img" aria-label="Gankyil"><path class="g1" d="M46.0 53.2 L45.9 53.8 L45.8 54.5 L45.8 55.1 L45.9 55.8 L46.1 56.4 L46.4 57.1 L46.7 57.8 L47.1 58.5 L47.5 59.1 L48.1 59.7 L48.7 60.3 L49.4 60.9 L50.2 61.3 L51.0 61.8 L51.9 62.2 L52.9 62.5 L53.9 62.7 L54.9 62.8 L56.0 62.9 L57.2 62.9 L58.3 62.7 L59.5 62.5 L60.6 62.2 L61.8 61.8 L63.0 61.2 L64.1 60.6 L65.2 59.8 L66.3 59.0 L67.3 58.0 L68.3 56.9 L69.2 55.8 L70.0 54.5 L70.7 53.2 L71.4 51.8 L71.9 50.3 L72.4 48.7 L72.7 47.1 L72.9 45.4 L72.9 43.7 L72.9 42.0 L72.7 40.2 L72.4 38.4 L71.9 36.6 L71.3 34.9 L70.5 33.1 L69.6 31.4 L68.6 29.8 L67.4 28.2 L66.1 26.6 L64.6 25.2 L63.1 23.8 L61.4 22.5 L59.6 21.4 L57.7 20.4 L55.6 19.5 L53.5 18.7 L51.4 18.1 L49.1 17.7 L46.8 17.4 L44.5 17.2 L42.1 17.3 L39.7 17.5 L37.3 17.9 L34.9 18.5 L32.5 19.3 L30.2 20.2 L27.9 21.3 L25.6 22.6 L23.5 24.1 L21.4 25.8 L19.4 27.6 L17.6 29.6 L15.9 31.7 L14.3 33.9 L12.9 36.3 L11.6 38.9 L10.5 41.5 L9.6 44.2 L8.9 47.0 L8.4 49.9 L8.1 52.8 L8.0 55.8 L8.1 58.8 L8.4 61.9 L8.8 64.9 L9.5 68.0 L10.3 71.0 L11.5 74.1 L12.8 77.0 L14.4 79.9 L15.1 79.2 L13.6 76.4 L12.3 73.5 L11.2 70.6 L10.4 67.6 L9.7 64.6 L9.3 61.6 L9.2 58.6 L9.3 55.6 L9.7 52.7 L10.2 49.9 L11.0 47.2 L11.9 44.5 L13.0 42.0 L14.2 39.6 L15.6 37.4 L17.2 35.2 L18.8 33.3 L20.6 31.4 L22.4 29.8 L24.4 28.3 L26.4 27.0 L28.5 25.8 L30.6 24.8 L32.7 24.0 L34.8 23.4 L37.0 22.9 L39.1 22.6 L41.2 22.4 L43.3 22.4 L45.4 22.6 L47.3 22.9 L49.3 23.3 L51.1 23.9 L52.9 24.6 L54.6 25.3 L56.1 26.2 L57.6 27.2 L59.0 28.3 L60.3 29.4 L61.4 30.6 L62.5 31.9 L63.4 33.2 L64.2 34.6 L64.9 35.9 L65.5 37.3 L65.9 38.7 L66.3 40.1 L66.5 41.5 L66.6 42.8 L66.7 44.1 L66.6 45.5 L66.5 46.7 L66.2 47.9 L65.9 49.1 L65.5 50.2 L65.0 51.2 L64.5 52.2 L63.9 53.1 L63.2 54.0 L62.6 54.8 L61.8 55.5 L61.1 56.1 L60.3 56.6 L59.5 57.1 L58.7 57.5 L57.9 57.9 L57.1 58.1 L56.3 58.3 L55.5 58.5 L54.7 58.5 L54.0 58.5 L53.3 58.5 L52.6 58.4 L51.9 58.2 L51.3 58.0 L50.7 57.8 L50.1 57.5 L49.6 57.2 L49.2 56.9 L48.7 56.5 L48.3 56.1 L48.0 55.7 L47.7 55.3 L47.5 54.9 L47.3 54.5 L47.1 54.1 L47.0 53.7 L46.9 53.3 L46.8 53.0 L46.8 52.6Z"/><path class="g2" d="M54.8 51.9 L55.4 51.7 L56.0 51.4 L56.5 51.0 L57.0 50.6 L57.5 50.1 L58.0 49.6 L58.4 49.0 L58.8 48.3 L59.1 47.6 L59.4 46.8 L59.6 46.0 L59.7 45.1 L59.7 44.2 L59.7 43.2 L59.6 42.3 L59.4 41.3 L59.0 40.3 L58.7 39.3 L58.2 38.3 L57.6 37.4 L56.9 36.4 L56.1 35.5 L55.2 34.7 L54.3 33.9 L53.2 33.2 L52.1 32.5 L50.9 31.9 L49.6 31.4 L48.3 31.0 L46.9 30.7 L45.4 30.5 L43.9 30.4 L42.4 30.5 L40.9 30.6 L39.3 30.9 L37.7 31.3 L36.1 31.8 L34.6 32.5 L33.1 33.3 L31.6 34.2 L30.2 35.2 L28.8 36.4 L27.5 37.7 L26.3 39.1 L25.1 40.7 L24.1 42.3 L23.2 44.0 L22.4 45.8 L21.7 47.8 L21.2 49.7 L20.8 51.8 L20.5 53.9 L20.4 56.0 L20.5 58.2 L20.7 60.4 L21.1 62.6 L21.7 64.8 L22.4 66.9 L23.3 69.1 L24.4 71.2 L25.6 73.2 L27.0 75.2 L28.6 77.1 L30.3 78.8 L32.1 80.5 L34.1 82.1 L36.3 83.5 L38.5 84.8 L40.9 85.9 L43.3 86.9 L45.9 87.7 L48.5 88.3 L51.2 88.7 L53.9 89.0 L56.7 89.0 L59.5 88.8 L62.4 88.5 L65.2 87.9 L68.0 87.1 L70.7 86.1 L73.4 84.9 L76.1 83.5 L78.6 81.9 L81.1 80.1 L83.5 78.2 L85.9 76.1 L88.1 73.8 L90.1 71.3 L92.0 68.7 L93.7 65.9 L92.8 65.6 L91.1 68.3 L89.2 70.9 L87.2 73.3 L85.1 75.5 L82.8 77.6 L80.4 79.4 L77.9 81.0 L75.2 82.4 L72.5 83.5 L69.8 84.5 L67.1 85.2 L64.3 85.7 L61.6 86.0 L58.9 86.2 L56.2 86.1 L53.6 85.8 L51.1 85.4 L48.6 84.8 L46.3 84.0 L44.0 83.0 L41.9 82.0 L39.8 80.8 L37.9 79.4 L36.2 78.0 L34.5 76.4 L33.0 74.8 L31.7 73.1 L30.5 71.4 L29.5 69.6 L28.6 67.7 L27.8 65.9 L27.3 64.0 L26.8 62.1 L26.5 60.2 L26.4 58.4 L26.4 56.6 L26.5 54.8 L26.7 53.1 L27.1 51.4 L27.5 49.8 L28.1 48.3 L28.8 46.8 L29.5 45.4 L30.4 44.2 L31.3 43.0 L32.2 41.9 L33.3 40.9 L34.3 40.0 L35.5 39.2 L36.6 38.5 L37.8 37.9 L38.9 37.4 L40.1 37.0 L41.3 36.7 L42.4 36.5 L43.6 36.4 L44.7 36.4 L45.8 36.4 L46.8 36.5 L47.9 36.7 L48.8 37.0 L49.7 37.4 L50.6 37.8 L51.4 38.2 L52.2 38.7 L52.9 39.2 L53.5 39.8 L54.1 40.4 L54.6 41.0 L55.0 41.6 L55.4 42.3 L55.7 42.9 L56.0 43.6 L56.2 44.2 L56.3 44.9 L56.4 45.5 L56.4 46.1 L56.4 46.7 L56.4 47.3 L56.3 47.8 L56.1 48.4 L56.0 48.9 L55.8 49.3 L55.5 49.7 L55.3 50.1 L55.0 50.5 L54.7 50.8 L54.4 51.0 L54.2 51.3 L53.9 51.5Z"/><path class="g3" d="M49.2 44.9 L48.7 44.5 L48.2 44.1 L47.7 43.8 L47.0 43.6 L46.4 43.4 L45.7 43.3 L44.9 43.2 L44.1 43.2 L43.3 43.3 L42.5 43.5 L41.7 43.7 L40.9 44.1 L40.1 44.5 L39.3 45.0 L38.5 45.6 L37.8 46.3 L37.1 47.0 L36.4 47.9 L35.8 48.8 L35.3 49.8 L34.8 50.8 L34.4 51.9 L34.1 53.1 L33.9 54.3 L33.8 55.6 L33.8 56.9 L33.9 58.3 L34.1 59.6 L34.4 61.0 L34.9 62.4 L35.4 63.7 L36.1 65.0 L36.9 66.4 L37.8 67.6 L38.8 68.8 L39.9 70.0 L41.2 71.1 L42.5 72.1 L44.0 73.0 L45.5 73.8 L47.1 74.6 L48.8 75.2 L50.6 75.6 L52.5 76.0 L54.3 76.2 L56.3 76.3 L58.2 76.2 L60.2 76.0 L62.2 75.6 L64.2 75.1 L66.1 74.4 L68.1 73.6 L70.0 72.6 L71.8 71.4 L73.6 70.1 L75.3 68.7 L76.9 67.1 L78.5 65.4 L79.9 63.6 L81.1 61.6 L82.3 59.5 L83.3 57.3 L84.1 55.0 L84.8 52.6 L85.4 50.2 L85.7 47.7 L85.9 45.2 L85.9 42.6 L85.7 40.0 L85.3 37.3 L84.7 34.7 L83.9 32.2 L82.9 29.6 L81.8 27.1 L80.4 24.7 L78.9 22.3 L77.1 20.1 L75.2 17.9 L73.1 15.9 L70.9 14.0 L68.5 12.3 L66.0 10.7 L63.3 9.3 L60.5 8.0 L57.7 6.8 L54.7 5.9 L51.6 5.1 L48.4 4.6 L45.2 4.3 L41.9 4.2 L42.1 5.2 L45.3 5.3 L48.5 5.6 L51.6 6.1 L54.6 6.9 L57.5 7.8 L60.3 9.0 L63.0 10.3 L65.5 12.0 L67.8 13.7 L70.0 15.6 L72.0 17.6 L73.8 19.7 L75.4 21.9 L76.9 24.2 L78.1 26.6 L79.2 28.9 L80.1 31.4 L80.8 33.8 L81.3 36.2 L81.6 38.7 L81.7 41.1 L81.7 43.4 L81.5 45.7 L81.1 48.0 L80.6 50.2 L80.0 52.3 L79.2 54.3 L78.2 56.2 L77.2 58.0 L76.1 59.7 L74.8 61.3 L73.5 62.7 L72.1 64.0 L70.6 65.2 L69.1 66.3 L67.5 67.2 L65.9 68.0 L64.3 68.6 L62.7 69.2 L61.1 69.6 L59.4 69.8 L57.8 70.0 L56.3 70.0 L54.8 69.9 L53.3 69.7 L51.8 69.4 L50.5 69.0 L49.1 68.6 L47.9 68.0 L46.7 67.4 L45.6 66.7 L44.6 65.9 L43.7 65.1 L42.8 64.2 L42.1 63.3 L41.4 62.4 L40.8 61.4 L40.3 60.4 L39.9 59.5 L39.6 58.5 L39.3 57.5 L39.2 56.5 L39.1 55.6 L39.1 54.7 L39.1 53.8 L39.2 52.9 L39.4 52.1 L39.6 51.3 L39.9 50.5 L40.3 49.8 L40.6 49.2 L41.0 48.6 L41.5 48.0 L41.9 47.5 L42.4 47.1 L42.9 46.7 L43.4 46.4 L44.0 46.1 L44.5 45.8 L45.0 45.6 L45.5 45.5 L46.0 45.4 L46.5 45.4 L47.0 45.3 L47.4 45.4 L47.9 45.4 L48.3 45.5 L48.7 45.6 L49.0 45.8 L49.4 45.9Z"/></svg>'
  };

  /* ---------- screens ---------- */
  function rowLink(href, badge, title, dur, badgeCls) {
    return '<a class="row" href="' + href + '">' +
      '<span class="badge' + (badgeCls ? ' ' + badgeCls : '') + '">' + badge + '</span>' +
      '<span class="rowbody"><span class="ttl">' + esc(title) + '</span>' +
      '<span class="num"><span class="vh">Length </span>' + fmt(dur) + '</span>' + ICON.chev + '</span></a>';
  }

  function homeHTML(first) {
    var r = function (cls) { return first ? ' class="rise' + (cls ? ' ' + cls : '') + '"' : ''; };
    var rows = C.practices.map(function (p) { return rowLink('#/' + p.id, p.n, p.title, p.duration); }).join('');
    return '<div class="scr home"><div class="wrap grid">' +
      '<div class="col1"><div' + r('') + '>' +
        '<p class="eb">' + esc(C.series) + '</p>' +
        '<h1 class="h1">' + esc(C.title) + '</h1>' +
        '<p class="sub">Class recording and practices<br>' + esc(C.date) + '</p>' +
      '</div></div>' +
      '<div class="col2">' +
        '<div' + r('d1') + '><p class="eb lab">Class</p><div class="card">' +
          rowLink('#/replay', ICON.tri, C.replay.title, C.replay.duration, 'pb') + '</div></div>' +
        '<div' + r('d2') + '><p class="eb lab sp">Practices</p><div class="card">' + rows + '</div></div>' +
      '</div>' +
      '<div class="gk' + (first ? ' rise d3' : '') + '">' + ICON.gankyil + '</div>' +
    '</div></div>';
  }

  function chapterRows(chapters) {
    return chapters.map(function (ch, i) {
      return '<button class="row chap" type="button" data-i="' + i + '" data-t="' + ch.t + '">' +
        '<span class="rowbody"><span class="num">' + fmt(ch.t) + '</span>' +
        '<span class="ttl">' + esc(ch.title) + '</span><span class="dot" aria-hidden="true"></span></span></button>';
    }).join('');
  }

  function recHTML(item) {
    var isReplay = item.id === 'replay';
    var idx = ITEMS.indexOf(item), next = ITEMS[idx + 1];
    var kind = isReplay ? item.kind : 'Practice ' + item.n + ' of ' + C.practices.length;
    var body = '';
    if (isReplay) {
      body = item.parts.map(function (p) {
        return '<p class="eb lab sp">Part ' + p.n + ' · ' + esc(p.title) + '</p><div class="card">' + chapterRows(p.chapters) + '</div>';
      }).join('');
    } else {
      body = '<p class="fn">' + esc(item.fn) + '</p>' +
        (item.haiku ? '<p class="eb lab next">Haiku used in class</p><div class="card haiku">' +
          item.haiku.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div>' : '') +
        '<p class="eb lab next">Outline</p><ul class="outline">' +
          item.outline.map(function (li) { return '<li>' + esc(li) + '</li>'; }).join('') + '</ul>';
    }
    var upNext = (next && !isReplay) ? '<p class="eb lab next">Up next</p><div class="card">' +
      rowLink('#/' + next.id, next.n, next.title, next.duration) + '</div>' : '';
    return '<div class="scr rec"><div class="wrap narrow">' +
      '<a class="back" href="#/">' + ICON.back + 'All recordings</a>' +
      '<p class="eb kind">' + esc(kind) + '</p>' +
      '<h1 class="h1 rech">' + esc(item.title) + '</h1>' +
      '<div class="player">' +
        '<input class="scrub" type="range" min="0" max="1000" step="1" value="0" aria-label="Playback position">' +
        '<div class="times"><span class="num t-el">0:00</span><span class="num t-rem">−' + fmt(item.duration) + '</span></div>' +
        '<div class="ctls">' +
          '<button class="skip k-rew" type="button" aria-label="Back 15 seconds">' + ICON.rew + '</button>' +
          '<div class="pw"><button class="play" type="button" aria-label="Play">' + ICON.play + ICON.pause + '</button></div>' +
          '<button class="skip k-fwd" type="button" aria-label="Forward 15 seconds">' + ICON.fwd + '</button>' +
        '</div>' +
        '<p class="err" role="status" hidden>This recording couldn’t be loaded.</p>' +
      '</div>' + body + upNext +
    '</div></div>';
  }

  function gateHTML() {
    return '<div class="scr home"><div class="wrap narrow gate rise">' +
      '<p class="eb">' + esc(C.series) + '</p>' +
      '<h1 class="h1">' + esc(C.title) + '</h1>' +
      '<p class="sub">Enter the password to listen.</p>' +
      '<form class="gateform card" autocomplete="on">' +
        '<label class="vh" for="pw">Password</label>' +
        '<input id="pw" name="password" type="password" placeholder="Password" autocomplete="current-password" autocapitalize="characters" autocorrect="off" spellcheck="false" required>' +
        '<button class="gobtn" type="submit">Enter</button>' +
      '</form>' +
      '<p class="gerr" role="alert" hidden>That password didn’t match.</p>' +
      '<div class="gk">' + ICON.gankyil + '</div>' +
    '</div></div>';
  }

  /* ---------- player ---------- */
  function Player(scr, item) {
    var self = this;
    this.item = item;
    this.dur = item.duration;
    this.mode = 'audio';
    this.pending = null;
    this.dragging = false;
    this.q = function (s) { return scr.querySelector(s); };
    this.playBtn = this.q('.play');
    this.scrub = this.q('.scrub');
    this.tEl = this.q('.t-el');
    this.tRem = this.q('.t-rem');
    this.err = this.q('.err');
    this.chaps = Array.prototype.slice.call(scr.querySelectorAll('.chap'));
    this.chapTimes = this.chaps.map(function (b) { return parseFloat(b.getAttribute('data-t')); });
    this.audio = this.makeMedia('audio', item.audio);
    this.video = null;
    scr.appendChild(this.audio);

    this.playBtn.addEventListener('click', function () { self.toggle(); });
    this.q('.k-rew').addEventListener('click', function () { self.nudge(-15); });
    this.q('.k-fwd').addEventListener('click', function () { self.nudge(15); });
    this.scrub.addEventListener('input', function () {
      self.dragging = true;
      self.seek(self.scrub.value / 1000 * self.dur, false);
      self.paint(self.scrub.value / 1000 * self.dur);
    });
    this.scrub.addEventListener('change', function () { self.dragging = false; });
    this.chaps.forEach(function (b) {
      b.addEventListener('click', function () { self.seek(parseFloat(b.getAttribute('data-t')), true); });
    });
    Array.prototype.forEach.call(scr.querySelectorAll('.seg button'), function (b) {
      b.addEventListener('click', function () { self.setMode(b.getAttribute('data-mode')); });
    });
    this.paint(0);
  }

  Player.prototype.makeMedia = function (tag, key) {
    var self = this, m = document.createElement(tag);
    m.preload = 'metadata';
    m.setAttribute('playsinline', '');
    if (tag === 'audio') m.hidden = true;
    m.src = mediaSrc(key);
    m.addEventListener('loadedmetadata', function () {
      if (m !== self.media()) return;
      if (isFinite(m.duration) && m.duration > 0) self.dur = m.duration;
      if (self.pending != null) { m.currentTime = self.pending; self.pending = null; }
      self.paint(m.currentTime);
    });
    m.addEventListener('timeupdate', function () { if (m === self.media() && !self.dragging) self.paint(m.currentTime); });
    m.addEventListener('play', function () { if (m === self.media()) self.setPlaying(true); });
    m.addEventListener('pause', function () { if (m === self.media()) self.setPlaying(false); });
    m.addEventListener('ended', function () { if (m === self.media()) self.setPlaying(false); });
    m.addEventListener('error', function () { if (m === self.media()) self.err.hidden = false; });
    m.addEventListener('playing', function () { if (m === self.media()) self.err.hidden = true; });
    return m;
  };
  Player.prototype.media = function () { return this.mode === 'video' && this.video ? this.video : this.audio; };
  Player.prototype.now = function () { var m = this.media(); return this.pending != null ? this.pending : m.currentTime; };
  Player.prototype.seek = function (t, autoplay) {
    var m = this.media();
    t = Math.min(Math.max(0, t), this.dur);
    if (m.readyState >= 1) m.currentTime = t; else this.pending = t;
    this.paint(t);
    if (autoplay && m.paused) this.play();
  };
  Player.prototype.nudge = function (d) { this.seek(this.now() + d, false); };
  Player.prototype.play = function () {
    var self = this, p = this.media().play();
    if (p && p.catch) p.catch(function (e) { if (e && e.name !== 'AbortError') self.err.hidden = false; });
  };
  Player.prototype.toggle = function () { if (this.media().paused) this.play(); else this.media().pause(); };
  Player.prototype.setPlaying = function (on) {
    var b = this.playBtn;
    b.classList.toggle('on', on);
    b.setAttribute('aria-label', on ? 'Pause' : 'Play');
    var icon = b.querySelector(on ? '.i-pause' : '.i-play');
    icon.classList.remove('pop'); void icon.offsetWidth; icon.classList.add('pop');
    if (on) {
      var halo = document.createElement('span');
      halo.className = 'halo';
      b.parentNode.insertBefore(halo, b);
      setTimeout(function () { halo.remove(); }, 1100);
      this.session();
    }
  };
  Player.prototype.paint = function (t) {
    var d = this.dur || 1, p = Math.min(100, Math.max(0, t / d * 100));
    if (!this.dragging) this.scrub.value = Math.round(p * 10);
    this.scrub.style.setProperty('--p', p + '%');
    this.scrub.setAttribute('aria-valuetext', spoken(t) + ' of ' + spoken(d));
    this.tEl.textContent = fmt(t);
    this.tRem.textContent = '−' + fmt(d - t);
    var cur = -1;
    for (var i = 0; i < this.chapTimes.length; i++) if (this.chapTimes[i] <= t + 0.25) cur = i;
    if (cur !== this.cur) {
      this.cur = cur;
      this.chaps.forEach(function (b, i) {
        b.classList.toggle('on', i === cur);
        if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
    }
  };
  Player.prototype.setMode = function (mode) {
    if (mode === this.mode) return;
    var self = this, from = this.media(), t = this.now(), wasPlaying = !from.paused;
    from.pause();
    if (mode === 'video' && !this.video) {
      this.video = this.makeMedia('video', this.item.video);
      var frame = el('<div class="vframe"><button class="fs" type="button" aria-label="Full screen">' + ICON.fs + '</button></div>');
      frame.insertBefore(this.video, frame.firstChild);
      frame.querySelector('.fs').addEventListener('click', function () {
        var v = self.video;
        if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
      });
      this.q('.vslot').appendChild(frame);
    }
    this.mode = mode;
    var frameEl = this.q('.vframe');
    if (frameEl) frameEl.hidden = mode !== 'video';
    Array.prototype.forEach.call(this.q('.seg').querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
    });
    this.err.hidden = true;
    var to = this.media();
    if (to.readyState >= 1) to.currentTime = t; else this.pending = t;
    this.setPlaying(false);
    this.playBtn.classList.remove('on');
    if (wasPlaying) this.play();
  };
  Player.prototype.session = function () {
    if (!('mediaSession' in navigator)) return;
    var self = this;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: this.item.title, artist: C.series + ': ' + C.title });
      navigator.mediaSession.setActionHandler('play', function () { self.play(); });
      navigator.mediaSession.setActionHandler('pause', function () { self.media().pause(); });
      navigator.mediaSession.setActionHandler('seekbackward', function () { self.nudge(-15); });
      navigator.mediaSession.setActionHandler('seekforward', function () { self.nudge(15); });
      navigator.mediaSession.setActionHandler('seekto', function (d) { if (d && d.seekTime != null) self.seek(d.seekTime, false); });
    } catch (e) {}
  };
  Player.prototype.destroy = function () {
    [this.audio, this.video].forEach(function (m) {
      if (!m) return;
      m.pause(); m.removeAttribute('src'); m.load();
    });
    // Clear the lock-screen entry so it doesn't keep pointing at a page that's gone.
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        ['play', 'pause', 'seekbackward', 'seekforward', 'seekto'].forEach(function (a) { navigator.mediaSession.setActionHandler(a, null); });
      } catch (e) {}
    }
  };

  /* ---------- navigation ---------- */
  var cur = { route: null, scr: null, player: null };
  var depth = 0;          // recordings opened from home in this visit, so Back can use history

  function build(route, first) {
    var item = route ? byId(route) : null;
    var scr = el(item ? recHTML(item) : homeHTML(first));
    var player = item ? new Player(scr, item) : null;
    document.title = item ? item.title + ' · ' + C.title : C.series + ': ' + C.title;
    return { route: route, scr: scr, player: player };
  }

  function show(route, dir) {
    var old = cur, next = build(route, dir === 'first');
    if (old.player) old.player.destroy();
    var y = window.scrollY || 0;
    var anim = { push: ['top pushin', 'ghost behind', 520], pop: ['home popin', 'ghost away', 460], swap: ['top swapin', 'ghost swapout', 420] }[dir];
    if (anim && old.scr) {
      next.scr.className += ' ' + anim[0];
      old.scr.className = old.scr.className.replace(/\b(top|home)\b/g, '') + ' ' + anim[1];
      old.scr.style.top = (-y) + 'px';
      app.appendChild(next.scr);
      window.scrollTo(0, 0);
      setTimeout(function () {
        old.scr.remove();
        next.scr.classList.remove('pushin', 'popin', 'swapin');
      }, anim[2]);
    } else {
      app.innerHTML = '';
      app.appendChild(next.scr);
      window.scrollTo(0, 0);
    }
    cur = next;
    var h = next.scr.querySelector('h1');
    if (h && dir !== 'first') { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }

  function onRoute() {
    var route = routeOf(location.hash);
    if (route === cur.route) return;
    var dir = cur.route === null ? 'first'
      : (cur.route === '' && route) ? 'push'
      : (!route) ? 'pop'
      : 'swap';
    if (dir === 'push') depth = 1;
    if (dir === 'pop') depth = 0;
    show(route, dir);
  }

  // In-page links: Back returns through history when we came from home; Up next replaces.
  app.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var to = routeOf(a.getAttribute('href'));
    if (a.classList.contains('back')) {
      e.preventDefault();
      if (depth > 0) history.back(); else location.replace('#/');
    } else if (cur.route && to) {
      e.preventDefault();
      location.replace('#/' + to);
    }
  });

  /* ---------- start ---------- */
  function start() {
    window.addEventListener('hashchange', onRoute);
    onRoute();
  }

  function gate() {
    var scr = el(gateHTML());
    app.appendChild(scr);
    document.title = C.series + ': ' + C.title;
    var form = scr.querySelector('form'), input = scr.querySelector('input'), msg = scr.querySelector('.gerr');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (hash(input.value.trim().toUpperCase()) === PASS_HASH) {
        remember();
        scr.classList.add('gate-out');
        setTimeout(function () { app.innerHTML = ''; start(); }, 260);
      } else {
        msg.hidden = false;
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
        input.select();
      }
    });
    input.addEventListener('input', function () { msg.hidden = true; });
    setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) {} }, 300);
  }

  if (unlocked()) start(); else gate();
})();
