/* ==========================================================================
   MikeB — site behaviour.
   Renders the catalog from data.js, then wires the player, filters, view
   switch, carousels, nav, drawer, contact form, counters and scroll reveals.
   ========================================================================== */

(function () {
  'use strict';

  var D = window.MIKEB;
  if (!D) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // Every player on the page registers a stop() here, so starting one source
  // silences the others.
  var stops = [];
  var stopAll = function () {
    stops.forEach(function (fn) { try { fn(); } catch (e) { /* keep going */ } });
  };

  var ICON_PLAY = '<svg class="ic-play" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var ICON_PAUSE = '<svg class="ic-pause" width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="currentColor" style="display:none" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
  var icons = function (size) {
    return ICON_PLAY.replace(/SIZE/g, size) + ICON_PAUSE.replace(/SIZE/g, size);
  };

  /* ---------- render ---------- */

  function renderSkills() {
    var host = $('#sk-scroll');
    if (!host) return;
    host.innerHTML = D.producerSkills.map(function (s) {
      return '<article class="card sk-card">' +
        '<div class="sk-top">' +
          '<span class="disp sk-num">' + esc(s.num) + '</span>' +
          '<span class="sk-tag">' + esc(s.tag) + '</span>' +
        '</div>' +
        '<div class="sk-body">' +
          '<h3 class="disp">' + esc(s.title) + '</h3>' +
          '<p>' + esc(s.desc) + '</p>' +
          '<div class="sk-tools"><i>▸</i>' + esc(s.tools) + '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderGenres() {
    var host = $('#sg-scroll');
    if (!host) return;
    host.innerHTML = D.soundGenres.map(function (g) {
      return '<article class="card sg-card">' +
        '<div class="disp sg-num">' + esc(g.num) + '</div>' +
        '<div class="sg-body">' +
          '<h3 class="disp">' + esc(g.title) + '</h3>' +
          '<p>' + esc(g.desc) + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderReels() {
    var host = $('#vid-grid');
    if (!host) return;
    host.innerHTML = D.reels.map(function (r) {
      // The cover is optional: drop <id>.jpg into assets/img/reels/ and it
      // replaces the fallback texture automatically.
      return '<a class="vid" href="' + esc(D.instaUrl) + '" target="_blank" rel="noopener">' +
        '<div class="vid-fallback"></div>' +
        '<img src="assets/img/reels/' + esc(r.id) + '.jpg" alt="" loading="lazy" decoding="async" ' +
          'onerror="this.remove()">' +
        '<div class="vid-shade"></div>' +
        '<div class="vid-play"><svg width="20" height="20" viewBox="0 0 24 24" fill="#0B0B0A" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></div>' +
        '<div class="vid-foot">' +
          '<div class="disp">' + esc(r.title) + '</div>' +
          '<span class="vid-link">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' +
            'Watch ↗' +
          '</span>' +
        '</div>' +
      '</a>';
    }).join('');
  }

  function renderTracks() {
    var host = $('#track-list');
    if (!host) return;
    host.innerHTML = D.beats.map(function (b) {
      return '<div class="track-row" role="button" tabindex="0" ' +
        'data-genre="' + esc(b.genres) + '" data-id="' + esc(b.id) + '" data-src="' + esc(b.src) + '" ' +
        'data-fallback="' + esc(b.fallback) + '" data-title="' + esc(b.title) + '" data-bpm="' + esc(b.bpm) + '" ' +
        'data-key="' + esc(b.key) + '" data-tag="' + esc(b.tag) + '" data-color="' + esc(b.color) + '" ' +
        'data-mailto="' + esc(b.mailto) + '" aria-label="Play ' + esc(b.title) + '">' +
        '<span class="t-idx disp">' + esc(b.num) + '</span>' +
        '<span class="t-play" aria-hidden="true">' + icons(13) + '</span>' +
        '<div class="t-main">' +
          '<div class="disp t-title">' + esc(b.title) + '</div>' +
          '<div class="t-sub">' +
            '<span class="t-chip" data-color="' + esc(b.color) + '">' + esc(b.tag) + '</span>' +
            '<span>' + esc(b.bpm) + ' BPM</span>' +
            (b.key ? '<span>· ' + esc(b.key) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<span class="t-eq" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '<span class="t-dur">0:00</span>' +
        '<a class="t-req" href="' + esc(b.mailto) + '">Request →</a>' +
      '</div>';
    }).join('');
  }

  function renderLoops() {
    var host = $('#loop-grid');
    if (!host) return;
    host.innerHTML = D.loops.map(function (l) {
      return '<article class="loop-card" data-genre="' + esc(l.genres) + '" data-src="' + esc(l.src) + '" ' +
        'data-fallback="' + esc(l.fallback) + '" data-color="' + esc(l.color) + '">' +
        '<div class="loop-top">' +
          '<span class="t-chip" data-color="' + esc(l.color) + '">' + esc(l.tag) + '</span>' +
          '<span class="disp loop-num">' + esc(l.num) + '</span>' +
        '</div>' +
        '<div>' +
          '<div class="disp loop-title">' + esc(l.title) + '</div>' +
          '<div class="loop-meta">' + esc(l.bpm) + ' BPM · ' + esc(l.key) + '</div>' +
          (l.instr ? '<div class="loop-instr">' + esc(l.instr) + '</div>' : '') +
        '</div>' +
        '<div class="loop-foot">' +
          '<button class="loop-play" aria-label="Play ' + esc(l.title) + '">' + icons(14) + '</button>' +
          '<a class="loop-req" href="' + esc(l.mailto) + '">Request loop →</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function renderContact() {
    var set = function (sel, txt) { var el = $(sel); if (el) el.textContent = txt; };
    set('#txt-email', D.email);
    set('#txt-insta', D.instagram);
    set('#txt-insta-2', D.instagram);
    set('#year', String(new Date().getFullYear()));
    var mail = $('#link-email');
    if (mail) mail.href = D.mailtoPlain;
    var insta = $('#link-insta');
    if (insta) insta.href = D.instaUrl;
    var cb = $('#count-beats');
    if (cb) cb.textContent = String(D.beats.length);
    var cl = $('#count-loops');
    if (cl) cl.textContent = String(D.loops.length);
  }

  function colorChips() {
    $$('.t-chip').forEach(function (t) {
      var c = t.getAttribute('data-color');
      if (c) { t.style.background = c + '24'; t.style.color = c; }
    });
  }

  /* ---------- shared audio helper ---------- */

  // Creates an <audio> that falls back to the demo URL the first time the real
  // file 404s, so the player keeps working before the MP3s are uploaded.
  function makeAudio(src, fallback) {
    var a = new Audio(src);
    a.preload = 'none';
    if (fallback) {
      a.addEventListener('error', function onErr() {
        if (a.dataset.fellBack) return;
        a.dataset.fellBack = '1';
        a.src = fallback;
        a.load();
        if (a.dataset.wanted === '1') a.play().catch(function () {});
      });
    }
    return a;
  }

  /* ---------- now-playing player ---------- */

  function initAudio() {
    var rows = $$('.track-row');
    if (!rows.length) return;

    var np = {
      chip: $('.np-chip'),
      title: $('.np-title'),
      meta: $('.np-meta'),
      btn: $('.np-play'),
      fill: $('.np-fill'),
      time: $('.np-time'),
      wave: $('.np-wave'),
      track: $('.np-track'),
      disc: $('.np-disc'),
      req: $('.np-req'),
      ic1: $('.np-play .ic-play'),
      ic2: $('.np-play .ic-pause')
    };

    var fmt = function (s) {
      if (!s || isNaN(s)) return '0:00';
      var m = Math.floor(s / 60), ss = Math.floor(s % 60);
      return m + ':' + (ss < 10 ? '0' : '') + ss;
    };

    // static waveform bars — same pseudo-random shape as the prototype
    var wh = '';
    for (var i = 0; i < 88; i++) {
      var h = 14 + Math.abs(Math.sin(i * 0.6) * Math.cos(i * 0.27)) * 80 + (i % 3) * 6;
      wh += '<span style="height:' + Math.min(100, h) + '%"></span>';
    }
    np.wave.innerHTML = wh;
    var waveBars = $$('span', np.wave);

    var state = { audio: null, row: null };

    var setBars = function (on) {
      np.wave.classList.toggle('is-playing', !!on);
      waveBars.forEach(function (b, i) {
        b.style.animation = on ? 'mkz-wave ' + (0.6 + (i % 7) * 0.11) + 's ease-in-out ' + (i * 0.01) + 's infinite' : '';
      });
    };

    var setEq = function (row, on) {
      if (!row) return;
      $$('.t-eq span', row).forEach(function (b, i) {
        b.style.animation = on ? 'mkz-eq ' + (0.5 + i * 0.18) + 's ease-in-out infinite' : '';
        if (!on) b.style.height = '30%';
      });
    };

    var rowIcons = function (row, on) {
      if (!row) return;
      var p = $('.ic-play', row), q = $('.ic-pause', row);
      if (p) p.style.display = on ? 'none' : '';
      if (q) q.style.display = on ? '' : 'none';
    };

    var setIcons = function (on) {
      np.ic1.style.display = on ? 'none' : '';
      np.ic2.style.display = on ? '' : 'none';
      rowIcons(state.row, on);
      np.disc.classList.toggle('is-spinning', !!on);
    };

    var highlight = function (row) {
      rows.forEach(function (r) { r.classList.remove('is-current'); });
      if (row) row.classList.add('is-current');
    };

    var tick = function () {
      if (state.audio && state.row) {
        var a = state.audio;
        var pct = a.duration ? (a.currentTime / a.duration) * 100 : 0;
        np.fill.style.width = pct + '%';
        np.track.setAttribute('aria-valuenow', Math.round(pct));
        np.time.textContent = fmt(a.duration ? a.duration - a.currentTime : 0);
        var dur = $('.t-dur', state.row);
        if (a.duration && dur) dur.textContent = fmt(a.duration);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    var pause = function () {
      if (state.audio) { state.audio.dataset.wanted = '0'; state.audio.pause(); }
      setIcons(false); setBars(false); setEq(state.row, false);
    };
    stops.push(pause);

    var resume = function () {
      if (!state.audio) return;
      state.audio.dataset.wanted = '1';
      state.audio.play().catch(function () {});
      setIcons(true); setBars(true); setEq(state.row, true);
    };

    var load = function (row, autoplay) {
      var d = row.dataset;
      np.title.textContent = d.title;
      np.meta.textContent = d.bpm + ' BPM' + (d.key ? '  ·  ' + d.key : '');
      np.chip.textContent = d.tag;
      np.chip.style.background = d.color + '24';
      np.chip.style.color = d.color;
      np.req.href = d.mailto;

      if (state.audio) {
        state.audio.pause();
        setEq(state.row, false);
        rowIcons(state.row, false);
      }

      var a = makeAudio(d.src, d.fallback);
      a.addEventListener('ended', function () {
        setIcons(false); setBars(false); setEq(row, false);
        // Rewind rather than only zeroing the bar: tick() redraws the fill
        // from currentTime every frame and would put it straight back at 100%.
        a.currentTime = 0;
      });
      a.addEventListener('loadedmetadata', function () {
        var dur = $('.t-dur', row);
        if (dur) dur.textContent = fmt(a.duration);
      });

      state.audio = a;
      state.row = row;
      highlight(row);
      np.fill.style.width = '0%';
      if (autoplay) resume();
    };

    var toggleRow = function (row) {
      if (state.row === row && state.audio) {
        if (state.audio.paused) resume(); else pause();
      } else {
        stopAll();
        load(row, true);
      }
    };

    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('.t-req')) return;
        toggleRow(row);
      });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); toggleRow(row); }
      });
    });

    np.btn.addEventListener('click', function () {
      if (!state.row) { if (rows[0]) { stopAll(); load(rows[0], true); } return; }
      if (state.audio && state.audio.paused) { stopAll(); resume(); } else pause();
    });

    var seek = function (clientX) {
      if (!state.audio || !state.audio.duration) return;
      var r = np.track.getBoundingClientRect();
      var ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      state.audio.currentTime = ratio * state.audio.duration;
    };
    np.track.addEventListener('click', function (e) { seek(e.clientX); });
    np.track.addEventListener('keydown', function (e) {
      if (!state.audio || !state.audio.duration) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); state.audio.currentTime += 5; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); state.audio.currentTime -= 5; }
    });

    if (rows[0]) load(rows[0], false);

    window.addEventListener('keydown', function (e) {
      var t = document.activeElement ? document.activeElement.tagName : '';
      if (e.code === 'Space' && state.audio && t !== 'INPUT' && t !== 'TEXTAREA' && t !== 'SELECT') {
        e.preventDefault();
        if (state.audio.paused) { stopAll(); resume(); } else pause();
      }
    });
  }

  /* ---------- loops (independent single-instance player) ---------- */

  function initLoops() {
    var cards = $$('.loop-card');
    if (!cards.length) return;

    var state = { audio: null, card: null };

    var paint = function (card, on) {
      var p = $('.ic-play', card), q = $('.ic-pause', card);
      if (p) p.style.display = on ? 'none' : '';
      if (q) q.style.display = on ? '' : 'none';
      card.style.borderColor = on ? (card.getAttribute('data-color') || 'var(--accent)') : '';
    };

    var stop = function () {
      if (state.audio) { state.audio.dataset.wanted = '0'; state.audio.pause(); }
      if (state.card) paint(state.card, false);
      state.audio = null;
      state.card = null;
    };
    stops.push(stop);

    cards.forEach(function (card) {
      var btn = $('.loop-play', card);
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (state.card === card && state.audio && !state.audio.paused) { stop(); return; }
        stopAll();
        var a = makeAudio(card.getAttribute('data-src'), card.getAttribute('data-fallback'));
        a.dataset.wanted = '1';
        a.addEventListener('ended', stop);
        a.play().catch(function () {});
        state.audio = a;
        state.card = card;
        paint(card, true);
      });
    });

    filterPills('.lpill', cards, $('#loop-noresults'));
  }

  /* ---------- filters ---------- */

  function filterPills(pillSel, items, noneEl) {
    var pills = $$(pillSel);
    if (!pills.length) return;
    pills.forEach(function (p) {
      p.addEventListener('click', function () {
        pills.forEach(function (o) { o.classList.toggle('is-on', o === p); });
        var f = p.getAttribute('data-f');
        var shown = 0;
        items.forEach(function (c) {
          var match = f === 'all' || (' ' + c.getAttribute('data-genre') + ' ').indexOf(' ' + f + ' ') > -1;
          c.style.display = match ? '' : 'none';
          if (match) {
            shown++;
            if (window.gsap) window.gsap.fromTo(c, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
          }
        });
        if (noneEl) noneEl.classList.toggle('is-on', shown === 0);
      });
    });
  }

  /* ---------- beats / loops view switch ---------- */

  function initViews() {
    var pills = $$('.vpill');
    if (!pills.length) return;
    var views = { beats: $('#view-beats'), loops: $('#view-loops') };
    var word = $('.cat-word');

    var show = function (v) {
      stopAll();
      pills.forEach(function (p) { p.classList.toggle('is-on', p.getAttribute('data-v') === v); });
      Object.keys(views).forEach(function (k) {
        if (views[k]) views[k].style.display = k === v ? '' : 'none';
      });
      if (word) word.textContent = v === 'loops' ? 'Loops' : 'Beats';
      if (window.gsap && views[v]) {
        window.gsap.fromTo(views[v], { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    pills.forEach(function (p) {
      p.addEventListener('click', function () { show(p.getAttribute('data-v')); });
    });
    $$('[data-goto]').forEach(function (a) {
      a.addEventListener('click', function () { show(a.getAttribute('data-goto')); });
    });
    show('beats');
  }

  /* ---------- carousels ---------- */

  function carousel(scrollSel, cardSel, prevSel, nextSel) {
    var scroller = $(scrollSel);
    if (!scroller) return;
    var prev = $(prevSel), next = $(nextSel);
    var step = function () {
      var c = $(cardSel, scroller);
      return c ? c.getBoundingClientRect().width + 20 : 340;
    };
    if (next) next.addEventListener('click', function () { scroller.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { scroller.scrollBy({ left: -step(), behavior: 'smooth' }); });

    var down = false, sx = 0, sl = 0, moved = false;
    scroller.addEventListener('pointerdown', function (e) {
      down = true; moved = false; sx = e.clientX; sl = scroller.scrollLeft;
      scroller.classList.add('is-dragging');
    });
    scroller.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      scroller.scrollLeft = sl - dx;
    });
    var end = function () { down = false; scroller.classList.remove('is-dragging'); };
    scroller.addEventListener('pointerup', end);
    scroller.addEventListener('pointerleave', end);
    scroller.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ---------- nav ---------- */

  function initNav() {
    var nav = $('#nav'), prog = $('#nav-prog');
    if (!nav) return;
    var onScroll = function () {
      var y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 100);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- drawer ---------- */

  function initDrawer() {
    var burger = $('#burger'), drawer = $('#drawer'), close = $('#drawer-close'), scrim = $('#drawer-scrim');
    if (!burger || !drawer) return;

    var open = function () {
      drawer.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      if (scrim) { scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add('is-open'); }); }
    };
    var shut = function () {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      if (scrim) {
        scrim.classList.remove('is-open');
        setTimeout(function () { scrim.hidden = true; }, 350);
      }
    };

    burger.addEventListener('click', open);
    if (close) close.addEventListener('click', shut);
    if (scrim) scrim.addEventListener('click', shut);
    $$('.drawer-link').forEach(function (l) { l.addEventListener('click', shut); });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });
  }

  /* ---------- contact form ---------- */

  function initForm() {
    var form = $('#ar-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { var el = $('#' + id); return el ? el.value : ''; };
      var type = g('f-type');
      var body = 'Name: ' + g('f-name') +
        '\nEmail: ' + g('f-email') +
        '\nLabel/Company: ' + g('f-label') +
        '\nRequest type: ' + type +
        '\n\n' + g('f-msg');
      window.location.href = 'mailto:' + D.email +
        '?subject=' + encodeURIComponent('[' + type + '] A&R Request – MikeB') +
        '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- counters ---------- */

  function initCounters() {
    var els = $$('.stat-num');
    if (!els.length) return;

    var run = function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suf = el.getAttribute('data-suffix') || '';
      var t0 = performance.now(), dur = 1400;
      var step = function (now) {
        var p = Math.min(1, (now - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- reveals ---------- */

  function showAllReveals() {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  function initReveals() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gsap = window.gsap;

    if (reduce || !gsap) { showAllReveals(); return; }
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    showAllReveals();

    gsap.set('.hero-letter', { opacity: 1 });
    gsap.fromTo('.hero-badge', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power2.out', clearProps: 'transform' });
    gsap.fromTo('.hero-letter', { yPercent: 115, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: 0.2, clearProps: 'transform' });
    gsap.fromTo('.hero-sub', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.95, ease: 'power2.out', clearProps: 'transform' });
    gsap.fromTo('.hero-cta', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, delay: 1.15, stagger: 0.1, ease: 'power2.out', clearProps: 'transform' });
    gsap.to('.scroll-arrow', { y: 12, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' });

    if (!window.ScrollTrigger) return;

    $$('.reveal').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 72, rotationX: -22, transformPerspective: 1000, transformOrigin: 'center top' },
        {
          opacity: 1, y: 0, rotationX: 0, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 8%', toggleActions: 'play reverse play reverse' }
        });
    });
    gsap.from('.track-row', { opacity: 0, y: 24, duration: 0.5, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: '.track-list', start: 'top 84%' } });
    gsap.from('.sg-card', { opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out', scrollTrigger: { trigger: '.sg-scroll', start: 'top 85%' } });
  }

  /* ---------- boot ---------- */

  function boot() {
    renderSkills();
    renderGenres();
    renderReels();
    renderTracks();
    renderLoops();
    renderContact();
    colorChips();

    initAudio();
    filterPills('.fpill', $$('.track-row'), $('#noresults'));
    initLoops();
    initViews();
    initNav();
    initDrawer();
    initForm();
    initCounters();
    carousel('#sk-scroll', '.sk-card', '.sk-prev', '.sk-next');
    carousel('#sg-scroll', '.sg-card', '.sg-prev', '.sg-next');

    // GSAP is deferred like this script but may still be parsing.
    if (window.gsap) initReveals();
    else window.addEventListener('load', initReveals);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
