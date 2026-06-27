/* ═══════════════════════════════════════════════════════
   Caleb Lowe Digital — script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ── NAV ──────────────────────────────────────────────── */
(function initNav() {
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a[href^="#"]');
  const linkMap   = {};
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


/* ── FLOATING CTA ─────────────────────────────────────── */
(function initFloatingCta() {
  const btn = document.getElementById('floatingCta');
  if (!btn) return;
  let shown = false;

  window.addEventListener('scroll', () => {
    const show = window.scrollY > window.innerHeight * 0.6;
    if (show === shown) return;
    shown = show;
    btn.classList.toggle('visible', show);
  }, { passive: true });
})();


/* ── SCROLL-REVEAL ────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.fade-up, .reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ── FAQ ACCORDION ────────────────────────────────────── */
(function initFaq() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn    = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-item__answer').classList.remove('open');
      });

      // Toggle this one
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
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

    btn.disabled = true;
    btnText.textContent = 'Sending…';
    btn.style.opacity = '0.75';

    // Replace with Formspree / Netlify Forms endpoint for production
    await new Promise(r => setTimeout(r, 1200));

    btn.style.display = 'none';
    success.classList.add('show');
    form.reset();

    setTimeout(() => {
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.display = '';
      btnText.textContent = original;
      success.classList.remove('show');
    }, 7000);
  });
})();


/* ── CARD GLOW (cursor-track) ─────────────────────────── */
(function initCardGlow() {
  const cards = document.querySelectorAll('.service-card, .project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(59,130,246,0.05) 0%, transparent 60%), var(--bg-card-h)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
})();


/* ── HERO PARALLAX ────────────────────────────────────── */
(function initParallax() {
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  if (!orb1 || !orb2) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      orb1.style.transform = `translate(${y * 0.04}px, ${y * -0.06}px)`;
      orb2.style.transform = `translate(${y * -0.03}px, ${y * 0.04}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ── COUNTER ANIMATION ────────────────────────────────── */
(function initCounters() {
  const proof = document.querySelector('.hero__social-proof');
  if (!proof) return;
  const numbers  = proof.querySelectorAll('.proof-number');
  const finals   = [15, 100, 48];
  const suffixes = ['+', '%', 'hr'];
  const targets  = ['15+', '100%', '48hr'];
  let animated   = false;

  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || animated) return;
    animated = true;
    numbers.forEach((el, i) => {
      let n = 0;
      const step = 1200 / finals[i];
      const tick = () => {
        n++;
        el.textContent = n + suffixes[i];
        if (n < finals[i]) setTimeout(tick, step);
        else el.textContent = targets[i];
      };
      setTimeout(tick, i * 120);
    });
  }, { threshold: 0.5 }).observe(proof);
})();


/* ── PROJECT CARD TILT ────────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const MAX = 4;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s, background 0.25s';
    });
  });
})();
