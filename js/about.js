// ============================================
//  BRANDIFY - About page scroll animations + team carousel
//  Uses IntersectionObserver + CSS transitions (.is-in) so it
//  works with or without GSAP and never conflicts with main.js.
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal a group of children one-by-one when their container scrolls in.
  // `stagger` = ms between each child. Direction/offset handled by CSS.
  function revealGroup(containerSel, childSel, stagger, opts = {}) {
    const container = document.querySelector(containerSel);
    if (!container) return;
    const children = container.querySelectorAll(childSel);
    if (!children.length) return;

    if (reduceMotion) {
      children.forEach(c => c.classList.add('is-in'));
      if (opts.onReveal) opts.onReveal();
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('is-in'), i * stagger);
        });
        if (opts.onReveal) opts.onReveal();
        io.unobserve(entry.target);
      });
    }, { threshold: opts.threshold || 0.2 });

    io.observe(container);
  }

  // --- 2. YOU MATTER TO US: text lines fade-up one-by-one (0.2s apart) ---
  revealGroup('.ab-matter-text', '.ab-reveal', 200, { threshold: 0.25 });
  // Images: come in one-by-one (each from its own direction, per data-anim) ---
  revealGroup('.ab-matter-images', '.ab-img', 260, { threshold: 0.2 });

  // --- 3. MISSION card fades up (neon image stays in place) ---
  revealGroup('.ab-mission', '.ab-reveal-up', 0, { threshold: 0.3 });

  // --- 4. VALUES fade-up one-by-one ---
  revealGroup('.ab-values-grid', '.ab-reveal-up', 130, { threshold: 0.2 });

  // --- 5. FOUNDER slider cards reveal is handled by the slider module below ---

  // --- 6. COUNTER: fade-up + count-up numbers ---
  revealGroup('.ab-counter-grid', '.ab-reveal-up', 120, {
    threshold: 0.3,
    onReveal: () => document.querySelectorAll('.ab-stat-num[data-target]').forEach(countUp)
  });

  // --- 7. CTA panels fade-up one-by-one ---
  revealGroup('.ab-cta-split', '.ab-reveal-up', 180, { threshold: 0.25 });

  // ---- count-up helper ----
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    }
    requestAnimationFrame(tick);
  }

  // ============================================
  //  FOUNDER TEAM — infinite image slider
  //  (ported from the reference Feature-Cards slider:
  //   cloned edges for seamless looping, arrows, dots, swipe,
  //   snap-on-scroll, and eased programmatic scrolling)
  // ============================================
  (function () {
    var root    = document.getElementById('abFsRoot');
    var track   = document.getElementById('abFsTrack');
    var prevBtn = document.getElementById('abFsPrev');
    var nextBtn = document.getElementById('abFsNext');
    var dotsW   = document.getElementById('abFsDots');
    if (!track || !root) return;

    var spacer = track.querySelector('.ab-fslider__spacer');

    // Build one card + one dot per filename in window.BRANDIFY_FOUNDERS.
    // Only as many cards as photos listed are created.
    var files = (window.BRANDIFY_FOUNDERS || []).filter(function (f) { return f && f.trim(); });
    (function buildCards() {
      files.forEach(function (file, i) {
        var card = document.createElement('div');
        card.className = 'ab-fslider__card ab-fslider__real';
        card.setAttribute('data-i', i);
        card.style.transitionDelay = (i * 110) + 'ms';
        card.innerHTML =
          '<div class="ab-fslider__media">' +
            '<div class="ab-fslider__ph"><i class="fa fa-user"></i></div>' +
            '<img alt="" loading="lazy" onerror="this.style.display=\'none\'">' +
          '</div>' +
          '<div class="ab-fslider__caption">' +
            '<h4 class="ab-fslider__name"></h4>' +
            '<span class="ab-fslider__role"></span>' +
          '</div>';
        card.querySelector('img').setAttribute('src', file);
        track.appendChild(card);

        if (dotsW) {
          var dot = document.createElement('button');
          dot.className = 'ab-fslider__dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('data-dot', i);
          dot.setAttribute('aria-label', 'Slide ' + (i + 1));
          dotsW.appendChild(dot);
        }
      });
    })();

    var realCards = Array.prototype.slice.call(track.querySelectorAll('.ab-fslider__real'));
    var dots      = dotsW ? Array.prototype.slice.call(dotsW.querySelectorAll('.ab-fslider__dot')) : [];
    var n = realCards.length;
    if (n === 0) return;

    var currentSlot = n;
    var animating   = false;
    var ANIM_MS     = 480;

    // Fill each card's name/role from its image filename.
    // "founder1(Keval D-Founder).jpg" -> name "Keval D", role "Founder".
    // Split on the FIRST "-" so roles like "Co-Founder" stay intact.
    function fillCaptionsFromFilenames() {
      realCards.forEach(function (card) {
        var img  = card.querySelector('img');
        var nameEl = card.querySelector('.ab-fslider__name');
        var roleEl = card.querySelector('.ab-fslider__role');
        if (!img || !nameEl) return;
        var src = decodeURIComponent(img.getAttribute('src') || '');
        var m = src.match(/\(([^)]*)\)/);
        if (!m) return;
        var inside = m[1];
        var dash = inside.indexOf('-');
        if (dash >= 0) {
          nameEl.textContent = inside.slice(0, dash).trim();
          if (roleEl) roleEl.textContent = inside.slice(dash + 1).trim();
        } else {
          nameEl.textContent = inside.trim();
        }
      });
    }

    // reveal cards (fade-up) when the section scrolls into view
    function setupReveal() {
      if ('IntersectionObserver' in window && !reduceMotion) {
        var obs = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          realCards.forEach(function (c) { c.classList.add('is-visible'); });
          obs.disconnect();
        }, { threshold: 0.12 });
        obs.observe(root);
      } else {
        realCards.forEach(function (c) { c.classList.add('is-visible'); });
      }
    }

    // ── geometry helpers (measure the real DOM — robust for any card count) ──
    function pad() {                       // matches the .ab-fslider__spacer width
      var w = window.innerWidth;
      return w <= 768 ? 20 : (w <= 1024 ? 60 : 90);
    }
    function endReached() {
      return track.scrollLeft >= (track.scrollWidth - track.clientWidth) - 2;
    }
    // absolute scrollLeft that brings card i to the left content margin
    function targetFor(i) {
      var aim = track.getBoundingClientRect().left + pad();
      return Math.max(0, track.scrollLeft + (realCards[i].getBoundingClientRect().left - aim));
    }
    // index of the card currently nearest the left margin (used for navigation)
    function nearestIndex() {
      var aim = track.getBoundingClientRect().left + pad();
      var best = 0, bd = Infinity;
      realCards.forEach(function (c, i) {
        var d = Math.abs(c.getBoundingClientRect().left - aim);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    }
    function syncDots() {
      // highlight the last dot once we're pinned to the end, else the nearest card
      var idx = endReached() ? n - 1 : nearestIndex();
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    }
    // browser clamps scrollTo to [0, maxScroll], so ends can never overshoot
    function scrollToCard(i) {
      i = Math.max(0, Math.min(i, n - 1));
      track.scrollTo({ left: targetFor(i), behavior: 'smooth' });
    }

    // captions are needed in both static + slider modes
    fillCaptionsFromFilenames();

    // ── 1–3 photos: static, centered row (no slider / controls) ──
    if (n <= 3) {
      root.classList.add('is-static');
      setupReveal();
      return;
    }

    // ── 4+ photos: finite slider (stops at both ends, no wrap-around) ──
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollToCard(nearestIndex() + 1); });
    if (prevBtn) prevBtn.addEventListener('click', function () { scrollToCard(nearestIndex() - 1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { scrollToCard(parseInt(this.dataset.dot, 10)); });
    });

    // touch swipe (mobile)
    var tx0 = 0, ty0 = 0;
    track.addEventListener('touchstart', function (e) {
      tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = tx0 - e.changedTouches[0].clientX;
      var dy = ty0 - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) scrollToCard(nearestIndex() + (dx > 0 ? 1 : -1));
    }, { passive: true });

    // mouse / pointer drag (desktop swipe)
    var isDown = false, dragStartX = 0, dragStartScroll = 0, dragMoved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;   // touch handled above
      isDown = true; dragMoved = false;
      dragStartX = e.clientX; dragStartScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      try { track.setPointerCapture(e.pointerId); } catch (_) {}
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 3) dragMoved = true;
      track.scrollLeft = dragStartScroll - dx;   // browser clamps to [0, maxScroll]
    });
    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      scrollToCard(nearestIndex());              // settle to the nearest card
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    // swallow the click that follows a real drag (so it doesn't feel jumpy)
    track.addEventListener('click', function (e) {
      if (dragMoved) { e.preventDefault(); e.stopPropagation(); dragMoved = false; }
    }, true);

    // keep the active dot in sync while the user scrolls (wheel / trackpad / momentum)
    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncDots, 80);
    }, { passive: true });

    setupReveal();
    syncDots();
    window.addEventListener('resize', syncDots);
  })();
});
