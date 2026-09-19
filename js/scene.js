/**
 * maithresh.sh // Linear Proximity Dot-Matrix Canvas Engine
 *
 * Replaces muddy CSS aurora gradients and sparse dust particles with an
 * ultra-refined, 120 FPS hardware-accelerated Canvas 2D coordinate grid.
 *
 * Features:
 * - Mathematical coordinate matrix (28px spacing) with micro-crosshairs (+)
 * - Spring-damped cursor proximity illumination in Subdued Ice Cyan (#38BDF8)
 * - 4 subtle floating Agentic Nodes (TrustRAG, LangGraph, LocalLLM, MCP)
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
  let agentNodes = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    buildGrid();
    buildAgentNodes();
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

  function buildAgentNodes() {
    agentNodes = [
      {
        x: width * 0.18,
        y: height * 0.28,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        label: 'TrustRAG :: NLI',
        color: '#38bdf8'
      },
      {
        x: width * 0.82,
        y: height * 0.32,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        label: 'LangGraph // Recovery',
        color: '#10b981'
      },
      {
        x: width * 0.25,
        y: height * 0.76,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        label: 'Local GGUF Runtime',
        color: '#38bdf8'
      },
      {
        x: width * 0.78,
        y: height * 0.72,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        label: 'MCP Agent Mesh',
        color: '#f59e0b'
      }
    ];
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
  let tick = 0;

  function render() {
    tick += 0.015;

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

    // 3. Draw & Animate Agentic Anchor Nodes
    if (!reduceMotion) {
      for (let i = 0; i < agentNodes.length; i++) {
        const n = agentNodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce gently off viewport edges
        if (n.x < 40 || n.x > width - 40) n.vx *= -1;
        if (n.y < 40 || n.y > height - 40) n.vy *= -1;

        // Interactive cursor tethering line
        const mDist = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (mDist < 160) {
          const tetherFactor = 1 - mDist / 160;
          ctx.strokeStyle = `rgba(56, 189, 248, ${tetherFactor * 0.45})`;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw node pulse
        const pulse = Math.sin(tick * 2 + i) * 1.5;
        ctx.fillStyle = n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + pulse * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Node halo
        ctx.fillStyle = `rgba(56, 189, 248, 0.12)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 10 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.fillStyle = 'rgba(148, 163, 184, 0.75)';
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText(n.label, n.x + 14, n.y + 3.5);
      }
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
