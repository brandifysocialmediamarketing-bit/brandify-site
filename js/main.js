// ============================================
//  BRANDIFY - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. STICKY NAVBAR ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // --- 2. HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // --- 3. HERO CAROUSEL ---
  const heroTrack = document.getElementById('heroTrack');
  const heroDots  = document.querySelectorAll('.hero-dot');
  const heroSlides = heroTrack ? heroTrack.querySelectorAll('.hero-slide') : [];
  let heroCurrent = 0;
  let heroAutoTimer = null;

  function heroGoTo(idx) {
    heroCurrent = (idx + heroSlides.length) % heroSlides.length;

    if (typeof gsap !== 'undefined') {
      // Smoother and slightly longer transition
      gsap.to(heroTrack, { xPercent: -100 * heroCurrent, duration: 1.2, ease: 'power3.inOut' });
    } else {
      heroTrack.style.transform = `translateX(-${heroCurrent * 100}%)`;
    }
    
    heroDots.forEach((d, i) => d.classList.toggle('active', i === heroCurrent));

    // Handle slide flip animation class
    heroSlides.forEach((slide, i) => {
      if (i === heroCurrent) {
        slide.classList.add('slide-active');
      } else {
        setTimeout(() => slide.classList.remove('slide-active'), 1200); 
      }
    });
  }

  function startHeroAuto() {
    // Slower auto-scroll speed as requested (10000ms = 10s)
    heroAutoTimer = setInterval(() => heroGoTo(heroCurrent + 1), 10000);
  }

  function resetHeroAuto() {
    clearInterval(heroAutoTimer);
    startHeroAuto();
  }

  document.getElementById('heroPrev')?.addEventListener('click', () => { heroGoTo(heroCurrent - 1); resetHeroAuto(); });
  document.getElementById('heroNext')?.addEventListener('click', () => { heroGoTo(heroCurrent + 1); resetHeroAuto(); });
  heroDots.forEach((d, i) => d.addEventListener('click', () => { heroGoTo(i); resetHeroAuto(); }));

  // Touch/swipe support for hero carousel
  if (heroTrack) {
    let heroTouchStartX = 0;
    heroTrack.addEventListener('touchstart', e => { heroTouchStartX = e.touches[0].clientX; }, { passive: true });
    heroTrack.addEventListener('touchend', e => {
      const diff = heroTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { heroGoTo(diff > 0 ? heroCurrent + 1 : heroCurrent - 1); resetHeroAuto(); }
    });
  }

  startHeroAuto();

  // --- 4. SOLUTIONS SLIDER ---
  const track  = document.getElementById('sliderTrack');
  const dots   = document.querySelectorAll('.dot-item');
  const slides = track ? track.querySelectorAll('.slide') : [];
  let current  = 0;

  // Makes the mini bar-chart inside a slide "draw itself" upward (0 -> real height)
  function animateChartBars(slideEl) {
    if (!slideEl) return;
    const bars = slideEl.querySelectorAll('.chart-bar');
    if (!bars.length) return;
    bars.forEach(bar => {
      if (!bar.dataset.targetHeight) bar.dataset.targetHeight = bar.style.height || '60%';
      bar.style.transition = 'none';  // avoid CSS transition fighting the GSAP tween
      bar.style.height = '0%';
    });
    if (typeof gsap !== 'undefined') {
      gsap.to(bars, {
        height: (i, el) => el.dataset.targetHeight,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        onComplete: () => bars.forEach(bar => { bar.style.transition = ''; })
      });
    } else {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'height .8s ease';
          bar.style.height = bar.dataset.targetHeight;
        }, i * 90);
      });
    }
  }

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    animateChartBars(slides[current]);
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 5000);

  // --- 6. WHATSAPP PLAN REDIRECT ---
  const WA_NUMBER = '918140924369';
  document.querySelectorAll('.wa-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.dataset.plan || btn.closest('[data-plan]')?.dataset.plan || 'a plan';
      const note = `Hi Brandify Socialmedia! \n\nI'm interested in the *${planName}*.\n\nNote: Please share more details about this plan - pricing, inclusions, and how we can get started.\n\nLooking forward to hearing from you!`;
      const encoded = encodeURIComponent(note);
      window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
    });
  });

  // --- 7. SCROLL REVEAL ANIMATION (GSAP-powered, vanilla fallback) ---
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  // Removed .service-card and .trust-item from generic fade since they have custom GSAP
  const fadeEls = document.querySelectorAll(
    '.plan-card, .meta-plan-card, .why-card, .stat-card, .section-title, .section-sub'
  );

  if (hasGSAP) {
    fadeEls.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });

    // Custom Animation for Trust/Badge Bar
    gsap.fromTo('.trust-item', 
      { opacity: 0, y: 40, rotationX: 45, scale: 0.9 }, 
      { 
        opacity: 1, y: 0, rotationX: 0, scale: 1, 
        duration: 1, 
        stagger: 0.15, 
        ease: 'back.out(1.5)', 
        scrollTrigger: { trigger: '.trust-bar', start: 'top 85%', once: true } 
      }
    );

    // Custom Animation for Contact Info Bar (Inquiry / Address / E-mail / Sales Team)
    gsap.fromTo('.contact-info-item',
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-info-bar', start: 'top 88%', once: true }
      }
    );

    // Custom Animation for What We Offer (.service-card)
    gsap.fromTo('.service-card', 
      { opacity: 0, y: 60, rotationY: 30, scale: 0.9 }, 
      { 
        opacity: 1, y: 0, rotationY: 0, scale: 1, 
        duration: 0.85, 
        stagger: 0.2, 
        ease: 'power3.out', 
        scrollTrigger: { trigger: '.services-grid', start: 'top 85%', once: true } 
      }
    );

    // Stagger plan cards specifically
    [['.plans .plan-card'], ['.meta-plan-card']].forEach(([sel]) => {
      const items = gsap.utils.toArray(sel);
      if (!items.length) return;
      gsap.fromTo(items,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: items[0].closest('section'), start: 'top 85%', once: true }
        }
      );
    });

    // Testimonials header + marquee block entrance
    document.querySelectorAll('.testimonials').forEach(sec => {
      const header = sec.querySelector('.testi-header');
      const marquee = sec.querySelector('.marquee-wrap');

      gsap.fromTo([header, marquee],
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: sec, start: 'top 85%', once: true }
        }
      );
    });

    // ============================================
    //  NEW: 3D SCROLL ANIMATIONS (per-section pack)
    // ============================================
    const reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth <= 768;

    if (reduceMotion) {
      // Accessibility: skip motion entirely, just make sure everything is visible
      gsap.set(
        '.reel-card, .reels-nav-btn, .why-icon, .cta-banner h2, .cta-banner p, .cta-btns a, .footer, .footer-logo, .footer-col h4, .footer-col ul li, .footer-desc, .social-links a',
        { opacity: 1, clearProps: 'all' }
      );
    } else {

      // --- NAVBAR: drop-in once on page load (not scroll-tied) ---
      gsap.fromTo('.navbar',
        { y: -90, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
      );

      // --- TRUST BAR: count-up numbers (35+, 90%, 3.5x) using data-target/data-suffix/data-decimal ---
      function animateCountFlexible(el) {
        if (!el || el.dataset.counted) return;
        el.dataset.counted = '1';
        const target = parseFloat(el.dataset.target);
        if (isNaN(target)) return;
        const suffix   = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const duration = 1400;
        const startTime = performance.now();
        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toFixed(decimals) + suffix;
        }
        requestAnimationFrame(tick);
      }
      ScrollTrigger.create({
        trigger: '.trust-bar',
        start: 'top 85%',
        once: true,
        onEnter: () => document.querySelectorAll('.trust-num[data-target]').forEach(animateCountFlexible)
      });

      // --- WHY SECTION: icon 3D flip-in (rotationY + perspective) ---
      gsap.fromTo('.why-icon',
        { opacity: 0, rotationY: 100, scale: 0.5, transformPerspective: 600 },
        {
          opacity: 1, rotationY: 0, scale: 1,
          duration: 0.75, stagger: 0.13, ease: 'back.out(1.6)', clearProps: 'all',
          scrollTrigger: { trigger: '.why-grid', start: 'top 85%', once: true }
        }
      );

      // --- REELS: cards 3D tilt-in (desktop) / fade-up (mobile) + nav arrows fade in ---
      gsap.fromTo('.reel-card',
        isSmallScreen
          ? { opacity: 0, y: 24 }
          : { opacity: 0, x: 60, rotationY: 18, transformPerspective: 900 },
        {
          opacity: 1, x: 0, y: 0, rotationY: 0,
          duration: isSmallScreen ? 0.5 : 0.7,
          stagger: 0.1, ease: 'power3.out', clearProps: 'all',
          scrollTrigger: { trigger: '.reels-section', start: 'top 80%', once: true }
        }
      );
      gsap.fromTo('.reels-nav-btn',
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, clearProps: 'opacity',
          scrollTrigger: { trigger: '.reels-section', start: 'top 80%', once: true }
        }
      );

      // --- SOLUTIONS: chart bars draw themselves + slide content reveal (uses slides/current from section 4) ---
      ScrollTrigger.create({
        trigger: '.solutions',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const activeSlide = slides[current];
          if (!activeSlide) return;
          animateChartBars(activeSlide);
          gsap.fromTo(activeSlide.querySelectorAll('.slide-content > *'),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }
          );
          gsap.fromTo(activeSlide.querySelectorAll('.slide-list li'),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.25, ease: 'power2.out', clearProps: 'all' }
          );
        }
      });

      // --- CTA BANNER: heading 3D pop + sub-text + buttons bounce-in ---
      gsap.timeline({ scrollTrigger: { trigger: '.cta-banner', start: 'top 85%', once: true } })
        .fromTo('.cta-banner h2',
          { opacity: 0, scale: 0.9, rotationX: -15, transformPerspective: 600 },
          { opacity: 1, scale: 1, rotationX: 0, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' })
        .fromTo('.cta-banner p',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }, '-=0.35')
        .fromTo('.cta-btns a',
          { opacity: 0, y: 24, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(1.6)', clearProps: 'all' }, '-=0.25');

      // --- FOOTER: block rises in, then column headings, then list items/social icons ---
      gsap.timeline({ scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true } })
        .fromTo('.footer',
          { opacity: 0, y: 40, rotationX: 6, transformPerspective: 1000 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' })
        .fromTo('.footer-logo, .footer-col h4',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' }, '-=0.35')
        .fromTo('.footer-desc, .footer-col ul li, .social-links a',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out', clearProps: 'all' }, '-=0.2');
    }
    // ============================================
    //  END NEW 3D SCROLL ANIMATIONS PACK
    // ============================================

  } else {
    // --- Vanilla fallback (no GSAP) ---
    fadeEls.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.10 });

    fadeEls.forEach(el => observer.observe(el));

    document.querySelectorAll('.plans .plan-card').forEach((c, i) => { c.style.transitionDelay = `${i * 0.08}s`; });
    document.querySelectorAll('.meta-plan-card').forEach((c, i) => { c.style.transitionDelay = `${i * 0.08}s`; });

    const planSectionObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.plan-card, .meta-plan-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 90);
          });
          planSectionObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.plans, .meta-plans').forEach(sec => planSectionObserver.observe(sec));

    const testiSectionObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('testi-visible');
          testiSectionObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.testimonials').forEach(sec => testiSectionObserver.observe(sec));

    document.querySelectorAll('.contact-info-item').forEach((item, i) => {
      item.classList.add('fade-in');
      item.style.transitionDelay = `${i * 0.1}s`;
    });
    const contactInfoObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.contact-info-item').forEach(item => item.classList.add('visible'));
          contactInfoObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.contact-info-bar').forEach(bar => contactInfoObserver.observe(bar));
  }

  // --- 8. COUNTER ANIMATION ---
  function animateCount(el, target, prefix = '', suffix = '') {
    if (!el) return;
    let start = 0;
    const step = target / (2000 / 16);
    const update = () => {
      start = Math.min(start + step, target);
      el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      if (start < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Updated to 99% and 98% per request
        animateCount(document.querySelectorAll('.stat-num')[0], 99, '', '%');
        animateCount(document.querySelectorAll('.stat-num')[1], 98, '', '%');
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const firstSlide = document.querySelector('.hero-slide');
  if (firstSlide) heroObserver.observe(firstSlide);

  // --- 9. CUSTOM MAGNETIC CURSOR ---
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    // Track the real cursor position only - no style writes here.
    // Writing style.transform straight inside the mousemove handler forces
    // a style recalc on every raw pointer event (can fire 100+ times/sec),
    // which was competing with the browser's click/mouseup handling and is
    // why a fast click right as the dot landed on a button could get eaten.
    // Both dot and ring are now painted together, once per animation frame.
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Single rAF loop drives both elements - dot snaps instantly to the
    // real cursor position every frame (zero added lag, so a click always
    // lands exactly where the dot visually is), ring eases toward it for
    // the magnetic trailing effect. Neither element ever blocks clicks -
    // both are pointer-events:none - so the button underneath always
    // receives the click the instant the real cursor (== the dot) is over it.
    function animateCursor() {
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      // lower factor = more delay / heavier magnetic pull
      const ease = 0.10;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Magnetic hover-grow on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .plan-card, .meta-plan-card, .testi-card, .service-card, .hero-nav-btn, .slider-btn'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('cursor-hover');
        cursorRing.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('cursor-hover');
        cursorRing.classList.remove('cursor-hover');
      });
    });

    // Fade cursor out when it leaves the window
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  } else if (cursorDot && cursorRing) {
    // Touch device - don't render the custom cursor at all
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  // --- 10. REELS CAROUSEL + POPUP ---
  /* -- DATA for each reel -- */
  const reelData = {
    1: {
      platform: '<i class="fab fa-instagram"></i> Reels',
      bgClass: 'reel-bg-1',
      title: 'Brand Launch Campaign',
      category: 'Lifestyle & Fashion',
      views: '2.4M Views',
      likes: '48K',
      desc: 'A high-energy brand launch reel crafted for maximum impact. Cinematic transitions + trend-forward audio to drive massive engagement.',
      tags: ['#BrandLaunch', '#Viral', '#Fashion'],
      viral: '⚡ Viral',
      videoUrl: 'https://res.cloudinary.com/ds1hxigmo/video/upload/q_auto,f_auto,w_500/v1781777215/IMG_4517.MOV_jc03rm.mp4' 
    },
    2: {
      platform: '<i class="fab fa-youtube"></i> Shorts',
      bgClass: 'reel-bg-2',
      title: 'Product Reveal Video',
      category: 'Tech & Gadgets',
      views: '1.8M Views',
      likes: '32K',
      desc: 'A sleek product reveal short optimised for YouTube Shorts. Bold cuts and dynamic text bring tech launches to life instantly.',
      tags: ['#TechReview', '#ProductLaunch', '#Shorts'],
      viral: '🔥 Trending',
      videoUrl: 'videos/GOA 2.mp4'
    },
    3: {
      platform: '<i class="fab fa-tiktok"></i> TikTok',
      bgClass: 'reel-bg-3',
      title: 'Restaurant Promo Reel',
      category: 'Food & Beverage',
      views: '3.1M Views',
      likes: '71K',
      desc: 'A mouth-watering food reel that drove 3x table bookings in the first week. Shot with professional food styling and vibrant colour grading.',
      tags: ['#FoodReel', '#Restaurant', '#Foodie'],
      viral: '⭐ Top Performer',
      videoUrl: 'videos/JISHA 1(2).mp4'
    },
    4: {
      platform: '<i class="fab fa-instagram"></i> Reels',
      bgClass: 'reel-bg-4',
      title: 'Real Estate Showcase',
      category: 'Property & Interiors',
      views: '980K Views',
      likes: '19K',
      desc: 'A luxury property walkthrough reel using drone shots and smooth transitions. Helped the client sell 2 units within 48 hours of posting.',
      tags: ['#RealEstate', '#PropertyTour', '#LuxuryLiving'],
      viral: '🏅 Best in Category',
      videoUrl: 'videos/lv_0_20260103220636.mp4'
    },
    5: {
      platform: '<i class="fab fa-youtube"></i> Shorts',
      bgClass: 'reel-bg-5',
      title: 'Fitness Brand Story',
      category: 'Health & Wellness',
      views: '1.2M Views',
      likes: '27K',
      desc: 'An inspiring transformation story that became the brand\'s most-watched piece of content. Authentic storytelling with high-energy music and tight editing.',
      tags: ['#FitnessMotivation', '#HealthyLifestyle', '#Wellness'],
      viral: '🚀 Most Shared',
      videoUrl: 'videos/4(1).mp4'
    },
    6: {
      platform: '<i class="fab fa-instagram"></i> Reels',
      bgClass: 'reel-bg-6',
      title: 'Jewellery Campaign',
      category: 'Luxury & Lifestyle',
      views: '4.5M Views',
      likes: '94K',
      desc: 'A stunning jewellery campaign reel with cinematic close-ups and glam transitions. Became our highest-performing reel of the year with 4.5M organic views.',
      tags: ['#JewelleryReel', '#LuxuryFashion', '#ViralContent'],
      viral: '👑 #1 Viral',
      videoUrl: 'videos/01.mp4'
    }
  };

  /* -- Inject Videos into Home Page Cards -- */
  const reelsTrack    = document.getElementById('reelsTrack');
  const reelsDots     = document.querySelectorAll('.reels-dot');
  const reelCards     = reelsTrack ? reelsTrack.querySelectorAll('.reel-card') : [];

  // Perf: don't download the 6 reel videos on page load — inject them only
  // when the reels section is about to enter the viewport. Cuts a big chunk
  // of initial network + CPU on first paint.
  function injectReelVideos() {
    reelCards.forEach(card => {
      const id = card.dataset.reel;
      const data = reelData[id];
      if (!data || !data.videoUrl || card.querySelector('video')) return;

      const thumbWrap = card.querySelector('.reel-thumb');
      const bgVideo = document.createElement('video');
      bgVideo.src = data.videoUrl;
      bgVideo.autoplay = true;
      bgVideo.loop = true;
      bgVideo.muted = true; // Auto-play thava mate video muted hovo jaruri chhe
      bgVideo.playsInline = true;
      bgVideo.preload = 'auto';

      bgVideo.style.position = 'absolute';
      bgVideo.style.top = '0';
      bgVideo.style.left = '0';
      bgVideo.style.width = '100%';
      bgVideo.style.height = '100%';
      bgVideo.style.objectFit = 'cover';
      bgVideo.style.zIndex = '1'; // Gradient ni upar, overlay ni niche

      thumbWrap.appendChild(bgVideo);
    });
  }

  const reelsSection = document.querySelector('.reels-section');
  if (reelsSection && 'IntersectionObserver' in window) {
    const vObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { injectReelVideos(); vObs.disconnect(); }
    }, { rootMargin: '300px 0px' });
    vObs.observe(reelsSection);
  } else {
    injectReelVideos();
  }

  /* -- Carousel logic -- */
  let reelsCurrent    = 0;
  let reelsAutoTimer  = null;
  let reelsPerView    = 4;

  function getReelsPerView() {
    const w = window.innerWidth;
    if (w <= 480) return 1.5;
    if (w <= 768) return 2.5; 
    if (w <= 1024) return 3;
    return 4;
  }

  function reelsGoTo(idx) {
    const gap = 20;
    const viewportWidth = document.getElementById('reelsViewport').offsetWidth;
    // measure the real (fixed-size) card so paging matches the CSS exactly
    const cardWidth = reelCards[0] ? reelCards[0].getBoundingClientRect().width : 410;
    const perView = Math.max(1, Math.floor((viewportWidth + gap) / (cardWidth + gap)));
    const maxIdx = Math.max(0, reelCards.length - perView);

    // Endless Loop Logic (Wrap Around)
    if (idx > maxIdx) {
      reelsCurrent = 0; // chhelli reel aave tya thi first reel aavi jase
    } else if (idx < 0) {
      reelsCurrent = maxIdx; // prev dabavvathi chhelli reel aavse
    } else {
      reelsCurrent = idx;
    }

    const offset = reelsCurrent * (cardWidth + gap);
    reelsTrack.style.transform = `translateX(-${offset}px)`;

    reelsDots.forEach((d, i) => {
        if(d) d.classList.toggle('active', i === reelsCurrent);
    });
  }

  function startReelsAuto() {
    reelsAutoTimer = setInterval(() => {
      reelsGoTo(reelsCurrent + 1); // automatically wrap thase
    }, 3500);
  }

  function resetReelsAuto() {
    clearInterval(reelsAutoTimer);
    startReelsAuto();
  }

  document.getElementById('reelsPrev')?.addEventListener('click', () => { reelsGoTo(reelsCurrent - 1); resetReelsAuto(); });
  document.getElementById('reelsNext')?.addEventListener('click', () => { reelsGoTo(reelsCurrent + 1); resetReelsAuto(); });

  reelsDots.forEach((d, i) => d.addEventListener('click', () => { reelsGoTo(i); resetReelsAuto(); }));

  if (reelsTrack) {
    let reelsTouchStartX = 0;
    reelsTrack.addEventListener('touchstart', e => { reelsTouchStartX = e.touches[0].clientX; }, { passive: true });
    reelsTrack.addEventListener('touchend', e => {
      const diff = reelsTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { reelsGoTo(diff > 0 ? reelsCurrent + 1 : reelsCurrent - 1); resetReelsAuto(); }
    });
  }

  window.addEventListener('resize', () => reelsGoTo(reelsCurrent));
  startReelsAuto();

  /* -- Popup logic -- */
  const overlay      = document.getElementById('reelPopupOverlay');
  const popup        = document.getElementById('reelPopup');
  const closeBtn     = document.getElementById('reelPopupClose');
  let popupCloseTimer = null;

  function openReelPopup(reelId) {
    const data = reelData[reelId];
    if (!data) return;

    document.getElementById('popupPlatform').innerHTML  = data.platform;
    document.getElementById('popupBg').className        = 'reel-popup-bg ' + data.bgClass;
    document.getElementById('popupTitle').textContent   = data.title;
    document.getElementById('popupCategory').textContent = data.category;
    document.getElementById('popupViews').textContent   = data.views;
    document.getElementById('popupLikes').textContent   = data.likes;
    document.getElementById('popupViralScore').textContent = data.viral;
    document.getElementById('popupInfoTitle').textContent = data.title;
    document.getElementById('popupInfoDesc').textContent  = data.desc;

    const tagsEl = document.getElementById('popupTags');
    tagsEl.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');

    const fill = document.getElementById('popupProgressFill');
    fill.style.animation = 'none';
    fill.offsetHeight; 
    fill.style.animation = '';
    
    const videoEl = document.getElementById('popupVideo');
    if (videoEl) {
      if (data.videoUrl) {
        videoEl.src = data.videoUrl;
        videoEl.style.display = 'block';
        videoEl.muted = false; // Popup ma sound sathe play thase
        videoEl.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        videoEl.style.display = 'none';
      }
    }

    document.getElementById('reelPlayPauseIcon').className = 'fa fa-pause';
    fill.style.animationPlayState = 'running';

    overlay.classList.remove('closing');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeReelPopup() {
    const videoEl = document.getElementById('popupVideo');
    if (videoEl) {
      videoEl.pause();
      videoEl.src = ""; 
    }

    overlay.classList.add('closing');
    clearTimeout(popupCloseTimer);
    popupCloseTimer = setTimeout(() => {
      overlay.classList.remove('open', 'closing');
      document.body.style.overflow = '';
    }, 420);
  }

  reelCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.reel;
      clearInterval(reelsAutoTimer); 
      openReelPopup(id);
    });
  });

  closeBtn?.addEventListener('click', () => {
    closeReelPopup();
    startReelsAuto();
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeReelPopup();
      startReelsAuto();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('open')) {
      closeReelPopup();
      startReelsAuto();
    }
  });

  document.querySelector('.reel-popup-play-ring')?.addEventListener('click', () => {
    const icon = document.getElementById('reelPlayPauseIcon');
    const fill = document.getElementById('popupProgressFill');
    const videoEl = document.getElementById('popupVideo');
    
    if (icon.classList.contains('fa-pause')) {
      icon.className = 'fa fa-play';
      fill.style.animationPlayState = 'paused';
      if(videoEl) videoEl.pause();
    } else {
      icon.className = 'fa fa-pause';
      fill.style.animationPlayState = 'running';
      if(videoEl) videoEl.play();
    }
  });

  if (closeBtn && typeof cursorDot !== 'undefined' && cursorDot) {
    closeBtn.addEventListener('mouseenter', () => {
      cursorDot.classList.add('cursor-hover');
      cursorRing.classList.add('cursor-hover');
    });
    closeBtn.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('cursor-hover');
      cursorRing.classList.remove('cursor-hover');
    });
  }

  // --- 11. TESTIMONIALS AUTO + MANUAL SCROLL ---
  const marqueeRows = document.querySelectorAll('.marquee-row');

  marqueeRows.forEach((row) => {
    const track = row.querySelector('.marquee-track');
    let isDown = false;
    let startX;
    let scrollLeft;
    let isAutoScrolling = true;

    // Right-to-left (+0.5) and Left-to-right (-0.5) ni speed
    let scrollSpeed = row.classList.contains('marquee-rtl') ? 0.5 : -0.5;

    // Smooth infinite loop mate content duplicate karvu
    track.innerHTML += track.innerHTML;

    // --- Mouse Drag (Manual Scroll) Events ---
    row.addEventListener('mousedown', (e) => {
      isDown = true;
      isAutoScrolling = false; // Drag karo tyare auto-scroll stop thay
      startX = e.pageX - row.offsetLeft;
      scrollLeft = row.scrollLeft;
      row.style.cursor = 'grabbing';
    });

    row.addEventListener('mouseleave', () => {
      isDown = false;
      isAutoScrolling = true; // Drag puru thay etale pachu chalu thay
      row.style.cursor = 'grab';
    });

    row.addEventListener('mouseup', () => {
      isDown = false;
      isAutoScrolling = true; // Drag puru thay etale pachu chalu thay
      row.style.cursor = 'grab';
    });

    row.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - row.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      row.scrollLeft = scrollLeft - walk;
    });

    // --- Mobile Swipe (Touch) Events ---
    row.addEventListener('touchstart', () => {
      isAutoScrolling = false; // Touch karo tyare auto-scroll stop thay
    }, { passive: true });

    row.addEventListener('touchend', () => {
      isAutoScrolling = true; // Touch chute etale auto-scroll start thay
    });

    // --- Auto Scroll Animation Loop ---
    function autoScroll() {
      if (isAutoScrolling) {
        row.scrollLeft += scrollSpeed;

        // Infinite Loop logic
        if (scrollSpeed > 0) { // Right to Left
          if (row.scrollLeft >= track.scrollWidth / 2) {
            row.scrollLeft = 0; // End aave tyare pachu start ma jay
          }
        } else { // Left to Right
          if (row.scrollLeft <= 0) {
            row.scrollLeft = track.scrollWidth / 2; // Start aave tyare pachu end ma jay
          }
        }
      }
      requestAnimationFrame(autoScroll);
    }

    // Left-to-Right row mate initial position set karvi
    if (scrollSpeed < 0) {
      row.scrollLeft = track.scrollWidth / 2;
    }
    
    autoScroll();
  });

  // --- 12. PLAN COMPARISON MODAL ---
  const compareModal   = document.getElementById('compareModal');
  const compareTrigger = document.getElementById('comparePlansBtn');
  const compareClose   = document.getElementById('compareClose');

  function openCompare() {
    compareModal.classList.add('active');
    compareModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCompare() {
    compareModal.classList.remove('active');
    compareModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  compareTrigger?.addEventListener('click', openCompare);
  compareClose?.addEventListener('click', closeCompare);

  compareModal?.addEventListener('click', (e) => {
    if (e.target === compareModal) closeCompare();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCompare();
  });

});