/* ── Elements ── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const bgVideo     = document.getElementById('bgVideo');
const soundBtn    = document.getElementById('soundBtn');
const iconMuted   = document.getElementById('iconMuted');
const iconUnmuted = document.getElementById('iconUnmuted');

/* ── Auto-play muted first (browser requirement) ── */
bgVideo.muted = true;
bgVideo.volume = 1;
bgVideo.play().catch(() => {});

/* ── Unmute on first user interaction ── */
let soundUnlocked = false;

function unlockSound(e) {
  if (soundUnlocked) return;
  soundUnlocked = true;

  bgVideo.muted = false;
  bgVideo.volume = 1;

  // Must call play() synchronously inside the user gesture on iOS
  const p = bgVideo.play();
  if (p !== undefined) p.catch(() => {});

  iconMuted.style.display   = 'none';
  iconUnmuted.style.display = 'block';
  soundBtn.setAttribute('aria-label', 'Mute video');

  ['click','touchstart','touchend','keydown'].forEach(ev =>
    document.removeEventListener(ev, unlockSound, true)
  );
}

// Use capture:true so it fires before any other handler on mobile
['click','touchstart','touchend','keydown'].forEach(ev =>
  document.addEventListener(ev, unlockSound, { capture: true, passive: true })
);

/* ── Mute / Unmute button ── */
soundBtn.addEventListener('click', e => {
  e.stopPropagation(); // prevent triggering unlockSound again
  const muted = bgVideo.muted = !bgVideo.muted;
  iconMuted.style.display   = muted ? 'block' : 'none';
  iconUnmuted.style.display = muted ? 'none'  : 'block';
  soundBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
});

  /* ── Navbar scroll shrink + active link ── */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
});

/* ── Hamburger ── */
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});
function closeMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
}
document.addEventListener('click', e => { if (!navbar.contains(e.target)) closeMenu(); });

/* ── Gallery filter ── */
const tabs  = document.querySelectorAll('.tab');
const items = document.querySelectorAll('.g-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    items.forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.cat !== filter);
    });
  });
});

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

let visibleImgs = [], lbIndex = 0;

function openLightbox(img) {
  visibleImgs = [...document.querySelectorAll('.g-item:not(.hidden) img')];
  lbIndex = visibleImgs.indexOf(img);
  lbImg.src = visibleImgs[lbIndex].src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function showSlide(dir) {
  lbIndex = (lbIndex + dir + visibleImgs.length) % visibleImgs.length;
  lbImg.src = visibleImgs[lbIndex].src;
}

items.forEach(item => item.querySelector('img').addEventListener('click', e => openLightbox(e.target)));
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click',  () => showSlide(-1));
lbNext.addEventListener('click',  () => showSlide( 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'ArrowLeft')  showSlide(-1);
  if (e.key === 'ArrowRight') showSlide( 1);
  if (e.key === 'Escape')     closeLightbox();
});

/* ── Contact form ── */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you! Your enquiry has been sent.\nBhushan will get back to you shortly. ✦');
  e.target.reset();
});
