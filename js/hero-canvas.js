/* ===========================
   HERO-CANVAS.JS — ASCII/Particle Art Canvas
   Renders a human figure silhouette made of
   orange and white random characters
   =========================== */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = '0123456789ABCDEFabcdef$#@!%&*+=-/\\|<>{}[]()';
  const FONT_SIZE = 11;
  const LINE_H = 13;

  let cols, rows, w, h;
  let particles = [];
  let animId;

  /* ---- Silhouette mask (simple head+body shape) ---- */
  function inSilhouette(x, y, W, H) {
    // Normalise
    const nx = (x / W) * 2 - 1;  // -1..1
    const ny = (y / H) * 2 - 1;  // -1..1

    // Head ellipse centered at (0, -0.45)
    const headRx = 0.28, headRy = 0.22;
    const headCy = -0.37;
    if (((nx * nx) / (headRx * headRx) + ((ny - headCy) * (ny - headCy)) / (headRy * headRy)) < 1) {
      return true;
    }

    // Body trapezoid
    const bodyTop = -0.15, bodyBot = 0.85;
    if (ny >= bodyTop && ny <= bodyBot) {
      const progress = (ny - bodyTop) / (bodyBot - bodyTop);
      const halfW = 0.22 + progress * 0.28;
      if (Math.abs(nx) < halfW) return true;
    }

    return false;
  }

  function build() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    cols = Math.floor(w / FONT_SIZE);
    rows = Math.floor(h / LINE_H);
    particles = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * FONT_SIZE;
        const y = r * LINE_H;
        if (inSilhouette(x, y, w, h)) {
          particles.push({
            x, y,
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            alpha: Math.random() * 0.5 + 0.3,
            speed: Math.random() * 0.015 + 0.002,
            isOrange: Math.random() < 0.3,
            flickerOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${FONT_SIZE}px 'Space Mono', monospace`;
    ctx.textBaseline = 'top';

    for (const p of particles) {
      const flicker = 0.5 + 0.5 * Math.sin(t * p.speed * 60 + p.flickerOffset);
      const alpha = p.alpha * (0.6 + 0.4 * flicker);

      if (p.isOrange) {
        ctx.fillStyle = `rgba(232,77,28,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
      }

      // Slowly randomize char
      if (Math.random() < 0.003) {
        p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      ctx.fillText(p.char, p.x, p.y);
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    build();
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(draw);
  }

  // Resize observer
  const ro = new ResizeObserver(init);
  ro.observe(canvas.parentElement);

  init();
})();
