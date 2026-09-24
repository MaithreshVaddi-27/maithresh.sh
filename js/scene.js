/**
 * maithresh.sh // Linear Proximity Dot-Matrix Canvas Engine
 *
 * Replaces muddy CSS aurora gradients and sparse dust particles with an
 * ultra-refined, 120 FPS hardware-accelerated Canvas 2D coordinate grid.
 *
 * Features:
 * - Mathematical coordinate matrix (28px spacing) with micro-crosshairs (+)
 * - Spring-damped cursor proximity illumination in Subdued Ice Cyan (#38BDF8)
 * - Soft cursor spotlight bloom following the pointer
 * - Battery-throttled rAF loop (0% CPU when tab hidden or backgrounded)
 * - Respects prefers-reduced-motion
 */

(function initDotMatrix() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0;
  let height = 0;
  let animId = null;
  let isRunning = false;

  // Configuration Tokens
  const SPACING = 28;
  const BASE_RADIUS = 1.0;
  const MAX_RADIUS = 2.6;
  const SPOTLIGHT_RADIUS = 140;

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false
  };

  let dots = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    buildGrid();
  }

  function buildGrid() {
    dots = [];
    for (let x = SPACING / 2; x < width; x += SPACING) {
      for (let y = SPACING / 2; y < height; y += SPACING) {
        // Place coordinate crosshairs at every 4th column/row
        const colIdx = Math.floor(x / SPACING);
        const rowIdx = Math.floor(y / SPACING);
        const isCross = (colIdx % 4 === 0) && (rowIdx % 4 === 0);

        dots.push({
          x: x,
          y: y,
          isCross: isCross
        });
      }
    }
  }

  // Pointer tracking
  window.addEventListener('pointermove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('pointerleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
    mouse.active = false;
  });

  // Render Loop
  function render() {

    // Smooth mouse interpolation (spring feel)
    if (!reduceMotion) {
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;
    } else {
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    }

    // Clear to deep obsidian void
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Dot Matrix with Proximity Illumination
    const dotCount = dots.length;
    for (let i = 0; i < dotCount; i++) {
      const d = dots[i];
      const dx = mouse.x - d.x;
      const dy = mouse.y - d.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < SPOTLIGHT_RADIUS) {
        const factor = 1 - dist / SPOTLIGHT_RADIUS;
        const radius = BASE_RADIUS + factor * (MAX_RADIUS - BASE_RADIUS);
        const alpha = 0.12 + factor * 0.82;

        ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;

        if (d.isCross) {
          ctx.fillRect(d.x - 3.5, d.y - 0.75, 7, 1.5);
          ctx.fillRect(d.x - 0.75, d.y - 3.5, 1.5, 7);
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        if (d.isCross) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.fillRect(d.x - 2.5, d.y - 0.5, 5, 1);
          ctx.fillRect(d.x - 0.5, d.y - 2.5, 1, 5);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.beginPath();
          ctx.arc(d.x, d.y, BASE_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 2. Soft Cursor Spotlight Bloom
    if (mouse.x > -100 && mouse.x < width + 100) {
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, SPOTLIGHT_RADIUS);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      grad.addColorStop(0.5, 'rgba(2, 132, 199, 0.05)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, SPOTLIGHT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isRunning) {
      animId = requestAnimationFrame(render);
    }
  }

  function start() {
    if (!isRunning) {
      isRunning = true;
      animId = requestAnimationFrame(render);
    }
  }

  function stop() {
    if (isRunning) {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
    }
  }

  // Battery & Tab-visibility optimization: pause loop when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  window.addEventListener('resize', resize);

  // Initialize
  resize();
  start();

  // Smooth appearance
  canvas.classList.add('ready');
})();
