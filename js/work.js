/* ===========================
   WORK.JS — Featured Work Slider
   Thumbnail click switches the main showcase
   =========================== */

(function () {
  const thumbs = document.querySelectorAll('.work__thumb');
  const slides = document.querySelectorAll('.work__slide');

  if (!thumbs.length) return;

  function switchTo(idx) {
    thumbs.forEach(t => t.classList.remove('active'));
    slides.forEach(s => s.classList.remove('active'));

    thumbs[idx].classList.add('active');
    slides[idx].classList.add('active');
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => switchTo(i));
  });

  // Auto-cycle every 4 seconds
  let current = 0;
  setInterval(() => {
    current = (current + 1) % thumbs.length;
    switchTo(current);
  }, 4000);
})();
