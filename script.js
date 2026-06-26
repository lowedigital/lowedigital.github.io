/* ═══════════════════════════════════════════════════════
   Caleb Lowe Digital — script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ── NAV: scroll behaviour & mobile menu ─────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobileMenu');

  // Scroll-to-sticky
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth-scroll for ALL anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');

  const linkMap = {};
  navLinks.forEach(l => { linkMap[l.getAttribute('href').slice(1)] = l; });

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(l => l.classList.remove('active'));
    if (linkMap[current]) linkMap[current].classList.add('active');
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
})();


/* ── SCROLL-REVEAL animation ─────────────────────────── */
(function initReveal() {
  const fadeEls   = document.querySelectorAll('.fade-up, .reveal');
  if (!fadeEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => io.observe(el));
})();


/* ── CONTACT FORM ─────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn     = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const original = btnText.textContent;

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Sending…';
    btn.style.opacity = '0.75';

    // Simulate async send (replace with your real endpoint or Formspree)
    await new Promise(r => setTimeout(r, 1200));

    // Success state
    btn.style.display = 'none';
    success.classList.add('show');
    form.reset();

    // Reset after 6s
    setTimeout(() => {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.display = '';
      btnText.textContent = original;
      success.classList.remove('show');
    }, 6000);
  });
})();


/* ── CURSOR GLOW on service/project cards ────────────── */
(function initCardGlow() {
  const cards = document.querySelectorAll('.service-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.background = `
        radial-gradient(300px circle at ${x}px ${y}px, rgba(59,130,246,0.05) 0%, transparent 60%),
        var(--bg-card-h)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();


/* ── HERO PARALLAX (subtle) ───────────────────────────── */
(function initParallax() {
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  if (!orb1 || !orb2) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orb1.style.transform = `translate(${y * 0.04}px, ${y * -0.06}px)`;
        orb2.style.transform = `translate(${y * -0.03}px, ${y * 0.04}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ── NUMBER COUNTER animation in hero proof ──────────── */
(function initCounters() {
  const proofSection = document.querySelector('.hero__social-proof');
  if (!proofSection) return;

  const numbers = proofSection.querySelectorAll('.proof-number');
  const targets = ['15+', '100%', '48hr'];
  const finals  = [15, 100, 48];
  const suffixes = ['+', '%', 'hr'];
  let animated = false;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || animated) return;
    animated = true;

    numbers.forEach((el, i) => {
      const end = finals[i];
      const suffix = suffixes[i];
      let start = 0;
      const dur = 1200;
      const step = dur / end;

      const tick = () => {
        start++;
        el.textContent = start + suffix;
        if (start < end) setTimeout(tick, step);
        else el.textContent = targets[i];
      };
      setTimeout(tick, i * 120);
    });

    io.disconnect();
  }, { threshold: 0.5 });

  io.observe(proofSection);
})();


/* ── TILT effect on project cards ────────────────────── */
(function initTilt() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('.project-card');
  const MAX   = 5; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s, background 0.25s';
    });
  });
})();
