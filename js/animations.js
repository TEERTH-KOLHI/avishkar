/* ===========================
   ANIMATIONS.JS — Scroll-Reveal & Hero Text
   =========================== */

(function () {
  // ---- Hero headline line-by-line reveal ----
  const lines = document.querySelectorAll('.hero__line');
  lines.forEach(line => {
    // Wrap text in inner span
    const text = line.textContent;
    line.innerHTML = `<span class="hero__line-inner">${text}</span>`;
  });

  // Trigger hero headline after short delay
  setTimeout(() => {
    document.querySelectorAll('.hero__line-inner').forEach(span => {
      span.classList.add('in');
    });
  }, 300);

  // ---- Intersection Observer for [data-reveal] ----
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- Marquee / scrolling text if needed ----
  // (Placeholder for future horizontal scroll marquees)

  // ---- Parallax subtle shift on scroll ----
  function parallax() {
    const scrollY = window.scrollY;

    // Hero canvas subtle vertical float
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
      canvas.style.transform = `translateY(${scrollY * 0.1}px)`;
    }
  }

  window.addEventListener('scroll', parallax, { passive: true });
})();
