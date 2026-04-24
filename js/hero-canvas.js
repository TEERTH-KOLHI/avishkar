/* ===========================
   HERO-CANVAS.JS — 3D Rotating Data Sphere (ASCII)
   A dynamic, abstract representation of AI/Data core
   =========================== */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CHARS = '0123456789ABCDEFabcdef$#@!%&*+=-/\\|<>{}[]()';
  const FONT_SIZE = 11;
  const LINE_H = 13;

  let w, h;
  let points = [];
  let animId;
  let mouse = { x: -1000, y: -1000 };
  let angle = 0;

  // Configuration
  const SPHERE_RADIUS = 220;
  const POINT_COUNT = 450;

  function build() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    points = [];
    // Generate points on a sphere using Fibonacci lattice for even distribution
    const phi = Math.PI * (3 - Math.sqrt(5)); 

    for (let i = 0; i < POINT_COUNT; i++) {
      const y = 1 - (i / (POINT_COUNT - 1)) * 2; // -1 to 1
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      points.push({
        x_orig: x,
        y_orig: y,
        z_orig: z,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        isOrange: Math.random() < 0.3,
        flickerOffset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.002
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${FONT_SIZE}px 'Space Mono', monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    angle += 0.003; // Auto rotation speed

    // Center of the canvas (offset to the right as per hero design)
    const cx = w * 0.5;
    const cy = h * 0.35; // Moved further up from 0.42

    // Sort points by Z (depth) for better layering, though ASCII is flat
    // We'll use alpha for depth
    const sortedPoints = points.map(p => {
      // Rotation on Y axis
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      
      let x = p.x_orig * cosA - p.z_orig * sinA;
      let z = p.x_orig * sinA + p.z_orig * cosA;
      let y = p.y_orig;

      // Projection
      const fov = 600;
      const perspective = fov / (fov + z * SPHERE_RADIUS);
      const px = cx + x * SPHERE_RADIUS * perspective;
      const py = cy + y * SPHERE_RADIUS * perspective;

      return { ...p, px, py, z, perspective };
    }).sort((a, b) => b.z - a.z);

    for (const p of sortedPoints) {
      // Interaction
      const dx = mouse.x - p.px;
      const dy = mouse.y - p.py;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const forceRange = 120;
      
      let offsetX = 0;
      let offsetY = 0;
      
      if (dist < forceRange) {
        const force = (forceRange - dist) / forceRange;
        offsetX = -dx * force * 0.3;
        offsetY = -dy * force * 0.3;
      }

      // Visuals
      const flicker = 0.5 + 0.5 * Math.sin(t * p.speed * 60 + p.flickerOffset);
      // Depth-based alpha
      const depthAlpha = (p.z + 1.2) / 2.4; 
      let alpha = depthAlpha * (0.4 + 0.6 * flicker);
      
      if (dist < forceRange) alpha = Math.min(1, alpha + 0.4);

      if (p.isOrange) {
        ctx.fillStyle = `rgba(232,77,28,${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.5})`;
      }

      if (Math.random() < 0.005) {
        p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      ctx.fillText(p.char, p.px + offsetX, p.py + offsetY);
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    build();
    cancelAnimationFrame(animId);
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  const ro = new ResizeObserver(init);
  ro.observe(canvas.parentElement || document.body);

  init();
})();
