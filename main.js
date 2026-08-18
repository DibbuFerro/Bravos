/* ═══════════════════════════════════════════════
   BRAVOS — main.js
   Animations: parallax, scroll reveal, counters,
   nav scroll, form submit, ticker pause
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Reduced-motion guard ──────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Nav scroll ────────────────────────────── */
  const nav = document.getElementById('mainNav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── Smooth-scroll for anchor links ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 8 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu
      const bsCollapse = document.getElementById('navMenu');
      if (bsCollapse && bsCollapse.classList.contains('show')) {
        const toggler = document.getElementById || document.querySelector('.bv-toggler');
        bootstrap.Collapse.getInstance(bsCollapse)?.hide();
      }
    });
  });

  /* ── Scroll reveal ──────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ── Parallax ───────────────────────────────── */
  if (!prefersReducedMotion) {
    const parallaxTargets = [
      { wrap: document.getElementById('heroParallax'),    img: document.querySelector('#heroParallax .bv-hero-img'), speed: 0.35 },
      { wrap: document.getElementById('numerosParallax'), img: document.querySelector('#numerosParallax .bv-numeros-img'), speed: 0.25 },
      { wrap: document.getElementById('ctaParallax'),     img: document.getElementById('ctaParallax'), speed: 0.28 },
    ].filter(t => t.wrap && t.img);

    function applyParallax() {
      parallaxTargets.forEach(({ wrap, img, speed }) => {
        const rect = wrap.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        img.style.transform = `translateY(${center * speed}px)`;
      });
    }

    window.addEventListener('scroll', applyParallax, { passive: true });
    applyParallax();
  }

  /* ── Counter animation ──────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.bv-stat-num[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ── Ticker pause on hover ──────────────────── */
  const ticker = document.querySelector('.bv-ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ── Form submit ────────────────────────────── */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.querySelectorAll(':invalid').forEach(field => {
          field.classList.add('is-invalid');
          field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
        });
        form.querySelector(':invalid')?.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="bv-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
        Enviando...
      `;

      setTimeout(() => {
        form.querySelectorAll('input, select').forEach(f => f.value = '');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Solicitar información gratuita <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { successEl.hidden = true; }, 6000);
      }, 1600);
    });
  }

  /* ── Spinner keyframes (injected) ────────────── */
  const style = document.createElement('style');
  style.textContent = `
    .bv-spin { animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);

})();
