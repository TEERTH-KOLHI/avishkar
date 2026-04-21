/* ===========================
   NAV.JS — Navigation Interactions
   =========================== */

(function () {
  const nav = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');
  const overlayLinks = navOverlay ? navOverlay.querySelectorAll('a') : [];

  // ---- Scroll state ----
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Menu open/close ----
  function openMenu() {
    navOverlay.classList.add('open');
    menuBtn.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Stagger in links
    const items = navOverlay.querySelectorAll('.nav__overlay-links li');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      setTimeout(() => {
        el.style.transition = `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  function closeMenu() {
    navOverlay.classList.remove('open');
    menuBtn.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);
  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // ---- Custom cursor ----
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  document.body.appendChild(cursor);
  document.body.appendChild(trail);

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // Smooth trail
  function animateCursor() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const interactables = 'a, button, [data-hover]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactables)) {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      trail.style.width = '56px';
      trail.style.height = '56px';
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactables)) {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      trail.style.width = '36px';
      trail.style.height = '36px';
    }
  });

  // Click feedback
  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
  });
  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  // Hide default cursor visibility when mouse inside window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity = '0.5';
  });
})();
