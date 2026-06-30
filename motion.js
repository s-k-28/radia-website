/* Radia — shared motion engine
 * GSAP + ScrollTrigger (scroll-linked reveals, scrubbed parallax, count-ups)
 * + Lenis (smooth scroll). Feature-detected: if a CDN fails, falls back to a
 * plain IntersectionObserver reveal. Fully honors prefers-reduced-motion.
 * ponytail: CDN + one shared file, no build step — the site is static. */
(function () {
  'use strict';

  var hdr = document.getElementById('hdr');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav blur on scroll — cheap, always on.
  if (hdr) {
    var navScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 12); };
    window.addEventListener('scroll', navScroll, { passive: true });
    navScroll();
  }

  // Reduced motion: show everything immediately, run nothing else.
  if (reduce) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var hasLenis = !!window.Lenis;

  // ---- Reveal fallback when GSAP didn't load ----
  if (!hasGSAP) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    return;
  }

  document.documentElement.classList.add('gsap-motion'); // kills the CSS .reveal transition
  gsap.registerPlugin(ScrollTrigger);

  // ---- Lenis smooth scroll, synced to GSAP ----
  var lenis = null;
  if (hasLenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // expo-out
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links glide through Lenis.
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -80 }); }
      });
    });
  }

  // ---- Scroll-linked staggered reveals (replaces all-or-nothing fades) ----
  gsap.set('.reveal', { opacity: 0, y: 26 });
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // ---- Hero glow: GSAP owns it fully (idle pulse + cursor follow + scroll parallax) ----
  // ponytail: CSS `breathe` keyframe also drives transform, so we hand the whole
  // element to GSAP (motion.css sets animation:none under .gsap-motion).
  var hero = document.querySelector('.hero');
  var heroGlow = document.querySelector('.hero-glow');
  if (hero && heroGlow) {
    gsap.set(heroGlow, { xPercent: -50 });                              // stay centered
    gsap.to(heroGlow, { scale: 1.07, opacity: 1, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      gsap.to(heroGlow, {
        x: (e.clientX - r.left - r.width / 2) * 0.10,
        y: (e.clientY - r.top - r.height / 2) * 0.12,
        duration: 1.2, ease: 'power3.out'
      });
    });
    gsap.to(heroGlow, {
      yPercent: 16, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // ---- Live scan-line loop on the hero scan phone (the "scanning" beat) ----
  // ponytail: animates `top`+opacity only, so it never fights any CSS transform.
  document.querySelectorAll('.scan-phone .scanline').forEach(function (scan) {
    gsap.fromTo(scan,
      { top: '8%' },
      { top: '86%', opacity: 1, duration: 2.1, ease: 'sine.inOut', repeat: -1, yoyo: true });
  });

  // ---- Per-feature phone parallax (Apple-ish drift) ----
  gsap.utils.toArray('.feature .f-visual .phone').forEach(function (ph) {
    gsap.fromTo(ph, { y: 38 }, {
      y: -38, ease: 'none',
      scrollTrigger: { trigger: ph.closest('.feature'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // ---- Count-up: [data-count] springs from 0 when it enters view ----
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var n = { v: 0 };
    el.textContent = prefix + '0' + suffix;
    gsap.to(n, {
      v: target, duration: 1.7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: function () { el.textContent = prefix + Math.round(n.v) + suffix; }
    });
  });

  // ---- Magnetic primary buttons ----
  document.querySelectorAll('.btn-primary, .magnetic').forEach(function (btn) {
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.5, ease: 'power3.out' });
    });
    btn.addEventListener('pointerleave', function () {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // Recalc once everything (fonts, images) settles.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
