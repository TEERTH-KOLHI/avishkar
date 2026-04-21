/* ===========================
   STATS.JS — Animated Counters
   Counts up numbers when scrolled into view
   =========================== */

(function () {
  const cards = document.querySelectorAll('.stats__card');
  let triggered = false;

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el, target, prefix, suffix, duration) {
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = (prefix || '') + value + (suffix || '');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function startCounters() {
    if (triggered) return;
    triggered = true;

    // Stat 1: $50B+
    const s1 = document.getElementById('stat1');
    if (s1) animateCounter(s1, 50, '$', 'B+', 2000);

    // Stat 2: 10M+
    const s2 = document.getElementById('stat2');
    if (s2) animateCounter(s2, 10, '', 'M+', 2000);

    // Stat 3: 50+
    const s3 = document.getElementById('stat3');
    if (s3) animateCounter(s3, 50, '', '+', 1800);
  }

  // Use IntersectionObserver on the stats section
  const statsSection = document.querySelector('.stats');
  if (!statsSection) return;

  const obs = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        startCounters();
        obs.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  obs.observe(statsSection);
})();
