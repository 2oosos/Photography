/* ============================
   2oosos — Photography v2
   script.js
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });


  /* ── 2. HAMBURGER / MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobMenu   = document.getElementById('mobMenu');

  hamburger.addEventListener('click', () => {
    mobMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => mobMenu.classList.remove('open'));
  });

  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobMenu.contains(e.target)) {
      mobMenu.classList.remove('open');
    }
  });


  /* ── 3. SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 60,
        behavior: 'smooth'
      });
    });
  });


  /* ── 4. REVEAL on scroll ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));


  /* ── 5. LIGHTBOX ── */
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lbImg');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbCurrent = document.getElementById('lbCurrent');
  const lbTotal   = document.getElementById('lbTotal');
  const gItems    = [...document.querySelectorAll('.g-item')];

  let activeIdx = 0;

  // Build list of valid (non-empty) items
  const validItems = () => gItems.filter(el => !el.classList.contains('g-empty'));

  const openLb = (idx) => {
    const items = validItems();
    if (!items.length) return;
    activeIdx = idx;
    const img = items[activeIdx]?.querySelector('img');
    if (!img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTotal.textContent   = items.length;
    lbCurrent.textContent = activeIdx + 1;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  const navLb = (dir) => {
    const items = validItems();
    activeIdx = (activeIdx + dir + items.length) % items.length;
    openLb(activeIdx);
  };

  gItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const validIdx = validItems().indexOf(item);
      if (validIdx >= 0) openLb(validIdx);
    });
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click',  () => navLb(-1));
  lbNext.addEventListener('click',  () => navLb(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  navLb(-1);
    if (e.key === 'ArrowRight') navLb(1);
  });


  /* ── 6. BEFORE/AFTER SLIDER ── */
  document.querySelectorAll('.preset-card').forEach(card => {
    const range    = card.querySelector('.pc-range');
    const after    = card.querySelector('.pc-after');
    const divider  = card.querySelector('.pc-divider');
    const knob     = card.querySelector('.pc-knob');

    if (!range || !after) return;

    const update = (val) => {
      const pct = val + '%';
      after.style.clipPath   = `inset(0 ${100 - val}% 0 0)`;
      divider.style.left     = pct;
      knob.style.left        = pct;
    };

    // Initialise
    update(50);

    range.addEventListener('input', () => update(Number(range.value)));
  });
document.querySelector('.footer-copy').innerHTML = `&copy; ${new Date().getFullYear()} 2oosos. All rights reserved.`;
});

