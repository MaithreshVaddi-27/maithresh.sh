// ── Live GitHub activity graph — rendered client-side from raw data ──
// Earlier version embedded ghchart.rshah.org's pre-rendered image.
// Confirmed stale in practice (missing weeks of real activity, cache
// TTL not under our control or even documented). Fixed properly: fetch
// the raw contribution data ourselves from jogruber's API (no token
// needed, browser-fetchable — the same data source libraries like
// react-github-calendar use directly) and draw the heatmap as SVG in
// our own Nord colors. No third-party rendering cache in the loop at
// all, so it's exactly as fresh as GitHub's own data, on every load.
(function () {
  const container = document.getElementById('contribGraph');
  if (!container) return;

  // Status feedback while the fetch is in flight — previously the card
  // sat visibly empty until the request resolved (or silently failed).
  // Apple's "feedback" principle: expose ongoing status, don't just
  // jump-cut from nothing to something.
  container.innerHTML = '<p class="activity-fallback">Loading activity…</p>';

  // Third-party payload is rendered via innerHTML below — escape every
  // interpolated field so a malformed upstream record can never break
  // markup or inject attributes.
  const escapeHtml = (v) => String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Contribution activity heatmap palette aligned with Flight Telemetry Ice Cyan tokens
  const LEVEL_COLOR = ['rgba(255,255,255,0.05)', '#0369a1', '#0284c7', '#38bdf8', '#7dd3fc'];
  const CELL_STROKE = 'rgba(255,255,255,0.05)';
  const CELL = 11, GAP = 3, LEFT_PAD = 28, TOP_PAD = 18;

  // AbortSignal.timeout is absent on older engines — fall back to a
  // manual controller so the request (and its .catch fallback) still runs.
  function fetchTimeoutSignal(ms) {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      return AbortSignal.timeout(ms);
    }
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), ms);
    return ctrl.signal;
  }

  fetch('https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last', { signal: fetchTimeoutSignal(8000) })
    .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json(); })
    .then((data) => {
      const days = data && data.contributions;
      if (!days || !days.length) throw new Error('no contribution data');

      const firstDow = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
      const padded = new Array(firstDow).fill(null).concat(days);
      const weeks = [];
      for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

      const width = LEFT_PAD + weeks.length * (CELL + GAP);
      const height = TOP_PAD + 7 * (CELL + GAP);

      let monthLabels = '';
      let lastMonth = -1;
      weeks.forEach((week, wi) => {
        const firstReal = week.find((d) => d);
        if (!firstReal) return;
        const d = new Date(firstReal.date + 'T00:00:00Z');
        const m = d.getUTCMonth();
        if (m === lastMonth) return;
        lastMonth = m;
        const x = LEFT_PAD + wi * (CELL + GAP);
        const label = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        monthLabels += `<text x="${x}" y="10" font-size="10" fill="#94a3b8" font-family="'JetBrains Mono',monospace">${escapeHtml(label)}</text>`;
      });

      const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
      const dayLabelSvg = dayLabels.map((l, i) => l
        ? `<text x="0" y="${TOP_PAD + i * (CELL + GAP) + 9}" font-size="10" fill="#94a3b8" font-family="'JetBrains Mono',monospace">${l}</text>`
        : '').join('');

      let rects = '';
      weeks.forEach((week, wi) => {
        week.forEach((d, di) => {
          if (!d) return;
          const x = LEFT_PAD + wi * (CELL + GAP);
          const y = TOP_PAD + di * (CELL + GAP);
          const color = LEVEL_COLOR[Number(d.level) | 0] || LEVEL_COLOR[0];
          const count = Number(d.count) || 0;
          const label = `${count} contribution${count === 1 ? '' : 's'} on ${escapeHtml(d.date)}`;
          rects += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" fill="${color}" stroke="${CELL_STROKE}" stroke-width="1"><title>${label}</title></rect>`;
        });
      });

      container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="GitHub contribution graph, last 12 months">${monthLabels}${dayLabelSvg}${rects}</svg>`;
      startContribSnake(container.querySelector('svg'));

      // Instrument readouts: total, active days, current streak
      const counts = days.map((d) => Number(d.count) || 0);
      const active = counts.filter((c) => c > 0);
      let streak = 0;
      for (let i = counts.length - 1; i >= 0; i--) {
        if (counts[i] > 0) streak++;
        else break;
      }
      const total = active.reduce((sum, c) => sum + c, 0);
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };
      set('statTotal', total);
      set('statActive', active.length);
      set('statStreak', streak);
      const stats = document.getElementById('contribStats');
      if (stats) stats.hidden = false;

      // Less → More legend swatches (colors live in .legend-cells CSS)
      const legend = document.getElementById('legendCells');
      if (legend) {
        legend.innerHTML = LEVEL_COLOR.map(() => '<span></span>').join('');
      }
    })
    .catch(() => {
      const card = container.closest('.activity-card');
      if (card) {
        card.innerHTML = '<p class="activity-fallback">Live GitHub activity — <a href="https://github.com/MaithreshVaddi-27" target="_blank" rel="noopener">view on GitHub →</a></p>';
      }
    });
})();

// ── Mobile nav toggle ──────────────────────────────────────────
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ── Shared motion-preference flag ─────────────────────────────
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

// ── Preloader ────────────────────────────────────────────────
(function () {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  if (!preloader) return;

  if (reduceMotion) {
    preloader.classList.add('done');
    return;
  }

  let progress = 0;
  const tick = setInterval(() => {
    progress += (90 - progress) * 0.08 + 0.4;
    if (progress > 90) progress = 90;
    fill.style.width = progress + '%';
    pct.textContent = String(Math.floor(progress)).padStart(2, '0') + '%';
  }, 90);

  window.addEventListener('load', () => {
    clearInterval(tick);
    fill.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => preloader.classList.add('done'), 320);
  });

  setTimeout(() => preloader.classList.add('done'), 3500);
})();

// ── Lenis smooth scroll, synced to GSAP's ticker ──────────────
// This is the standard darkroom.engineering/GSAP pairing: Lenis owns
// the actual scroll physics, GSAP's ticker drives Lenis's rAF loop so
// everything (Lenis easing + ScrollTrigger-driven tweens) stays on the
// same clock instead of fighting each other across two rAF loops.
let lenis = null;
if (!reduceMotion && typeof window.Lenis !== 'undefined' && hasGSAP) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ── Cut for restraint ─────────────────────────────────────────
// Removed: custom cursor (dot/ring/orbit-label + its own rAF loop),
// mouse-parallax aurora, magnetic buttons, and per-frame 3D card tilt.
// Five competing mouse-tracked effects running simultaneously reads as
// "showing off the toolkit," not premium — the top-tier reference
// sites (Stripe/Linear/Vercel) win on restraint: 2–3 signature
// interactions, executed precisely, not eight. What's kept: the hero
// 3D particle/bloom scene (js/scene.js) and the project pipeline-
// diagram draw-in below — both content-tied, not generic chrome. Cards
// and buttons keep full hover feedback (lift, glow, border, sheen) —
// see the shared :hover rule in css/style.css — just via plain CSS
// instead of a mousemove listener per element.

// ── Project row: sticky detail stage + diagram draw-in ────────
// The title and arrow get their hover motion from plain CSS now (see
// .proj-row:hover .proj-row-title / .proj-row-arrow in style.css) —
// no letter-splitting DOM, no per-row mousemove listener. What's left
// here is genuinely content-tied: which project's detail is showing,
// and the pipeline diagram tracing itself in.
(function () {
  // ── Sticky detail stage (desktop only, see css/style.css) ──────
  // Populates from each row's own .proj-row-detail — single source of
  // truth, so mobile (which shows that block inline) and desktop (which
  // shows it in the stage) never drift out of sync with each other.
  const stage = document.getElementById('projStage');
  const stageInner = document.getElementById('projStageInner');
  const rows = document.querySelectorAll('.proj-row');

  // ── Pipeline diagram draw-in ────────────────────────────────
  // The connector lines/arrows in the TrustRAG schematic trace
  // themselves in (stroke-dashoffset 0 → length), rather than
  // appearing with the rest of the diagram — reads as "data moving
  // through the pipeline", the one animation on this page tied
  // directly to what the project actually does. Boxes and the
  // decision diamond stay static; only flow connectors (line/path)
  // draw. getTotalLength() is measured fresh each call since the
  // stage clones fresh nodes on every hover swap.
  function animateDiagram(root) {
    if (reduceMotion) return;
    const svg = root.querySelector('.proj-diagram svg');
    if (!svg) return;
    // getTotalLength() throws on a non-rendered element — happens when
    // this runs against the desktop stage panel while the viewport is
    // actually mobile (.proj-stage is display:none under 900px, but
    // fillStage() still populates it on init regardless of viewport).
    // getClientRects().length is the cheap way to ask "is this actually
    // laid out right now" without try/catch around every measurement.
    if (svg.getClientRects().length === 0) return;
    const connectors = Array.from(svg.querySelectorAll('line, path')).filter(
      (el) => typeof el.getTotalLength === 'function'
    );
    if (!connectors.length) return;
    connectors.forEach((el) => {
      const len = el.getTotalLength();
      el.style.transition = 'none';
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        connectors.forEach((el, i) => {
          el.style.transition = `stroke-dashoffset 0.65s cubic-bezier(.16,1,.3,1) ${i * 0.06}s`;
          el.style.strokeDashoffset = '0';
        });
      });
    });
  }

  function fillStage(row) {
    const detail = row.querySelector('.proj-row-detail');
    if (!stageInner || !detail) return;
    // Carry the row's accent onto the stage frame so the panel border,
    // highlight rule, and schematic inset all re-tint per project.
    if (stage && row.dataset.accent) stage.dataset.accent = row.dataset.accent;
    // Generation token guards against a rapid hover across multiple
    // rows resolving out of order — without this, quickly moving the
    // mouse row1 → row2 → row3 could let row1's delayed swap land last,
    // showing the wrong project's details while hovering row3.
    const myToken = ++fillStage.token;
    const swap = () => {
      stageInner.innerHTML = detail.innerHTML;
      // The detail carries SVG marker/node IDs — cloning them would
      // duplicate IDs in the live DOM. Strip them from the clone:
      // url(#…) marker refs still resolve to the row originals, and the
      // sim runners query pane-level IDs, never stage internals.
      stageInner.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
      animateDiagram(stageInner);
    };
    if (reduceMotion || !stageInner.childNodes.length) {
      swap();
      return;
    }
    stageInner.classList.add('swapping');
    setTimeout(() => {
      if (myToken !== fillStage.token) return; // a newer hover has already superseded this one
      swap();
      stageInner.classList.remove('swapping');
    }, 180);
  }
  fillStage.token = 0;

  if (stage && stageInner && rows.length) {
    fillStage(rows[0]); // default to the first project so the panel isn't empty on load
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => fillStage(row));
      row.addEventListener('focus', () => fillStage(row));
    });
  }

  if (reduceMotion) return;

  // Mobile/narrow layout shows .proj-diagram inline (static, not
  // cloned into a stage — see the max-width:899px rule in
  // css/style.css), so it needs its own visibility trigger instead of
  // riding along with fillStage's swap.
  if (window.matchMedia('(max-width: 899px)').matches && 'IntersectionObserver' in window) {
    const mobileDiagrams = document.querySelectorAll('.proj-row-detail .proj-diagram');
    const dObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateDiagram(entry.target.closest('.proj-row-detail'));
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    mobileDiagrams.forEach((el) => dObserver.observe(el));
  }
})();

// ── Scroll-driven motion (GSAP ScrollTrigger) ─────────────────
// Replaces the old manual `scroll` listener + IntersectionObserver
// pair with the actual standard: precise trigger points, scrubbed
// values tied directly to scroll position, and one shared clock with
// Lenis instead of a second independent rAF loop.
if (hasGSAP) {
  // Hero content: scrub-fades and drifts up as the hero scrolls past —
  // tied to scroll position (scrub) rather than a fixed-duration tween.
  if (!reduceMotion) {
    gsap.to('.hero-inner', {
      y: 140,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // Expose hero scroll progress (0 → 1) for the 3D scene to react to —
    // the pipeline graph recedes/dollies as you scroll from hero into About.
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => { window.__heroScrollProgress = self.progress; },
    });
  }

  // Section reveals: fade + rise + un-blur, staggered per grid, each
  // firing once as it enters the viewport. Grid cards (proj/group/stack/
  // cert) are excluded here — they get the index-staggered pass below
  // instead, so they aren't animated twice.
  const revealTargets = gsap.utils.toArray(
    '.reveal:not(.proj-row):not(.group-card):not(.stack-card):not(.cert-card)'
  );
  revealTargets.forEach((el) => {
    if (reduceMotion) { gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }); return; }
    gsap.fromTo(
      el,
      { opacity: 0, y: 50, scale: 0.92, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
        duration: 1.0, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      }
    );
  });

  // Stagger cards within each grid — index-based delay per grid so
  // siblings don't all pop in at once.
  ['.proj-list', '.group-grid', '.stack-groups', '.cert-grid'].forEach((sel) => {
    const grid = document.querySelector(sel);
    if (!grid) return;
    Array.from(grid.children).forEach((child, i) => {
      if (!child.classList.contains('reveal') || reduceMotion) return;
      gsap.fromTo(
        child,
        { opacity: 0, y: 50, scale: 0.92, filter: 'blur(6px)' },
        {
          opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.0, ease: 'back.out(1.4)', delay: i * 0.08,
          scrollTrigger: { trigger: child, start: 'top 90%', toggleActions: 'play none none none' },
          overwrite: true,
        }
      );
    });
  });

  // Terminal "boot sequence" — lines step in as the block scrolls into
  // view, instead of appearing all at once with the rest of the section.
  const terminalLines = gsap.utils.toArray('.terminal .t-line');
  if (terminalLines.length) {
    if (reduceMotion) {
      gsap.set(terminalLines, { opacity: 1, x: 0 });
    } else {
      gsap.set(terminalLines, { opacity: 0, x: -8 });
      ScrollTrigger.create({
        trigger: '.terminal',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(terminalLines, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' });
        },
      });
    }
  }
} else {
  // GSAP failed to load (CDN blocked) — fall back to instantly visible
  // content rather than a page permanently stuck at opacity:0.
  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.opacity = '1'; el.style.transform = 'none'; el.style.filter = 'none';
  });
}

// ── Scroll progress ──────────────────────────────────────────
// A thin instrument-panel readout of position in the document, driven
// 1:1 off scroll (via GSAP+ScrollTrigger when available, a plain
// scroll listener otherwise). This is exempt from reduced-motion: it's
// a direct status correlate of where the user already is, the same
// category as a native progress bar, not an independent animation.
(function () {
  const fill = document.getElementById('scrollProgressFill');
  if (!fill) return;
  if (hasGSAP) {
    gsap.set(fill, { width: '0%' });
    gsap.to(fill, {
      width: '100%', ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
  } else {
    const update = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100;
      fill.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();

// ── Hero stat count-up ───────────────────────────────────────
// Implemented once, at the end of this file: numerals ease from 0 on
// first viewport entry with suffixes (like %) preserved, and skipped
// under prefers-reduced-motion. (An earlier on-load duplicate was
// removed — it dropped suffixes and double-drove the same nodes.)

// ── Nav scrollspy ─────────────────────────────────────────────
// Highlights the nav link for whichever section currently occupies
// the reading band (a horizontal slice near the top of the viewport,
// not the full viewport — matching a section "as it becomes primary"
// rather than "as soon as its top pixel is visible"). Plain
// IntersectionObserver, no scroll listener, so it costs nothing on
// the main thread between crossings.
(function () {
  const navLinks = Array.from(document.querySelectorAll('.navlinks a[href^="#"]'));
  if (!navLinks.length) return;
  const map = new Map();
  navLinks.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) map.set(section, a);
  });
  if (!map.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );
  map.forEach((_, section) => observer.observe(section));
})();

// ── "More projects" toggle ──────────────────────────────────
const moreToggle = document.getElementById('moreToggle');
const moreBody = document.getElementById('moreBody');
const moreArrow = document.getElementById('moreArrow');

if (moreToggle && moreBody && moreArrow) {
  moreToggle.addEventListener('click', () => {
    const open = moreBody.classList.toggle('open');
    moreToggle.setAttribute('aria-expanded', open);
    moreArrow.textContent = open ? '− hide' : '+ show 5 more';
    if (hasGSAP) ScrollTrigger.refresh(); // layout height changed
  });
}

// ── Multi-System Architecture Workbench Controls ───────────────
window.switchWorkbenchTab = function(tabId) {
  // Update tabs
  const tabs = document.querySelectorAll('.workbench-tab');
  tabs.forEach(tab => {
    const isTarget = tab.id === `tab-${tabId}`;
    tab.classList.toggle('active', isTarget);
    tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // Update panes
  const panes = document.querySelectorAll('.workbench-pane');
  panes.forEach(pane => {
    const isTarget = pane.id === `pane-${tabId}`;
    pane.classList.toggle('active', isTarget);
  });
};

// ── Delegated UI actions (no inline onclick in production markup) ─
// All [data-wbtab], [data-sim] and [data-action] controls route through
// here — keeps index.html free of inline handlers (CSP-friendly) and
// externalizes every behavior into js/main.js.
(function () {
  const SIM_LABELS = {
    'trustrag:valid': 'TrustRAG high-confidence query',
    'trustrag:fail': 'TrustRAG unverified-claim recovery',
    'docuchat:tool': 'DocuChat MCP web dispatch',
    'docuchat:local': 'DocuChat local ChromaDB cache hit',
    'resumecrew:match': 'Resume Crew high-alignment match',
    'resumecrew:gap': 'Resume Crew skill-gap rejection',
    'careeros:dedup': 'CareerOS-Pro two-stage deduplication',
    'careeros:resilient': 'CareerOS-Pro source-failure circuit breaker',
  };
  const SIM_RUNNERS = {
    trustrag: (m) => window.runTrustRagSim && window.runTrustRagSim(m),
    docuchat: (m) => window.runDocuChatSim && window.runDocuChatSim(m),
    resumecrew: (m) => window.runResumeCrewSim && window.runResumeCrewSim(m),
    careeros: (m) => window.runCareerOSSim && window.runCareerOSSim(m),
  };
  function announce(text) {
    const live = document.getElementById('simLive');
    if (live) live.textContent = text;
  }

  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-wbtab]');
    if (tabBtn) {
      activateWorkbenchTab(tabBtn.dataset.wbtab, false);
      return;
    }
    const simBtn = e.target.closest('[data-sim]');
    if (simBtn) {
      const [system, mode] = (simBtn.dataset.sim || '').split(':');
      if (SIM_RUNNERS[system]) SIM_RUNNERS[system](mode);
      if (SIM_LABELS[simBtn.dataset.sim]) announce('Running simulation: ' + SIM_LABELS[simBtn.dataset.sim] + '.');
      return;
    }
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === 'palette' && window.openCommandPalette) window.openCommandPalette();
      else if (action === 'close-palette' && window.closeCommandPalette) window.closeCommandPalette();
    }
  });

  // ── Workbench tabs: roving tabindex + arrow-key navigation ──
  const tablist = document.querySelector('.workbench-tabs[role="tablist"]');
  const tabs = tablist ? Array.from(tablist.querySelectorAll('[data-wbtab]')) : [];
  window.activateWorkbenchTab = function (tabId, focusTab) {
    if (window.switchWorkbenchTab) window.switchWorkbenchTab(tabId);
    tabs.forEach((t) => t.setAttribute('tabindex', t.dataset.wbtab === tabId ? '0' : '-1'));
    if (focusTab) {
      const target = tabs.find((t) => t.dataset.wbtab === tabId);
      if (target) target.focus();
    }
  };
  if (tablist) {
    tablist.addEventListener('keydown', (e) => {
      const current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next !== -1) {
        e.preventDefault();
        window.activateWorkbenchTab(tabs[next].dataset.wbtab, true);
      }
    });
  }

  // ── Command palette focus trap (Tab cycles inside the modal) ──
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('cmd-console-modal');
    if (!modal || !modal.classList.contains('active')) return;
    const focusables = Array.from(
      modal.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ── Stack chip progressive disclosure ──
  // Long chip walls collapse past 8 with an inline toggle — keeps the
  // honest inventory (nothing removed from the DOM) while restoring scan.
  document.querySelectorAll('.stack-card .chips').forEach((box) => {
    const chips = box.querySelectorAll('.chip');
    if (chips.length <= 8) return;
    box.classList.add('is-collapsed');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chips-toggle';
    const update = () => {
      const collapsed = box.classList.contains('is-collapsed');
      btn.textContent = collapsed ? `+ show ${chips.length - 8} more` : '− show less';
      btn.setAttribute('aria-expanded', String(!collapsed));
    };
    btn.addEventListener('click', () => {
      box.classList.toggle('is-collapsed');
      update();
      if (hasGSAP && window.ScrollTrigger) ScrollTrigger.refresh();
    });
    update();
    box.after(btn);
  });
})();

// ── Simulation serialization ─────────────────────────────────
// The workbench sims stage their outcome writes on fixed timeouts.
// Without invalidation, a rapid re-click lets the FIRST invocation's
// late timeout land last and display the wrong outcome. Each sim takes
// a generation token on entry; every staged write bails unless its
// token is still current — the same guard fillStage() already uses.
function nextSimToken(fn) {
  fn._token = (fn._token || 0) + 1;
  return fn._token;
}

// ── Interactive TrustRAG SVG Pipeline Simulation ─────────────
window.runTrustRagSim = function(mode) {
  const myToken = nextSimToken(window.runTrustRagSim);
  const n1 = document.querySelector('#svgNode1 rect');
  const n2 = document.querySelector('#svgNode2 rect');
  const n3 = document.querySelector('#svgNode3 rect');
  const n4 = document.querySelector('#svgNode4 rect');
  const l1 = document.getElementById('link1');
  const l2 = document.getElementById('link2');
  const l3 = document.getElementById('link3');
  const n4T = document.getElementById('node4TitleSvg');
  const n4S = document.getElementById('node4SubSvg');
  const n4L = document.getElementById('node4Label');

  if (!n1 || !n2 || !n3 || !n4) return;

  // Reset to idle
  [n1, n2, n3, n4].forEach(n => {
    n.setAttribute('stroke', '#1e293b');
    n.setAttribute('fill', '#0d1424');
  });
  [l1, l2, l3].forEach(l => {
    if (l) {
      l.setAttribute('stroke', '#334155');
      l.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  // Step 1: Query Embedding
  n1.setAttribute('stroke', '#38bdf8');
  n1.setAttribute('fill', '#0d223a');

  // Step 2: Hybrid Retrieval (400ms)
  setTimeout(() => {
    if (myToken !== window.runTrustRagSim._token) return;
    if (l1) {
      l1.setAttribute('stroke', '#38bdf8');
      l1.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n2.setAttribute('stroke', '#38bdf8');
    n2.setAttribute('fill', '#0d223a');
  }, 400);

  // Step 3: Fused Claim NLI Verification (800ms)
  setTimeout(() => {
    if (myToken !== window.runTrustRagSim._token) return;
    if (l2) {
      l2.setAttribute('stroke', '#38bdf8');
      l2.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n3.setAttribute('stroke', '#38bdf8');
    n3.setAttribute('fill', '#0d223a');
  }, 800);

  // Step 4: Outcome Branch (1200ms)
  setTimeout(() => {
    if (myToken !== window.runTrustRagSim._token) return;
    if (mode === 'valid') {
      if (l3) {
        l3.setAttribute('stroke', '#10b981');
        l3.setAttribute('marker-end', 'url(#arrowSuccess)');
      }
      n4.setAttribute('stroke', '#10b981');
      n4.setAttribute('fill', '#0c271c');
      if (n4L) n4L.setAttribute('fill', '#10b981');
      if (n4T) {
        n4T.setAttribute('fill', '#34d399');
        n4T.textContent = 'Grounded Output';
      }
      if (n4S) n4S.textContent = 'Claim score: 0.94 ✓';
    } else {
      if (l3) {
        l3.setAttribute('stroke', '#f59e0b');
        l3.setAttribute('marker-end', 'url(#arrowWarn)');
      }
      n4.setAttribute('stroke', '#f59e0b');
      n4.setAttribute('fill', '#291d09');
      if (n4L) n4L.setAttribute('fill', '#f59e0b');
      if (n4T) {
        n4T.setAttribute('fill', '#fbbf24');
        n4T.textContent = 'Bounded Recovery';
      }
      if (n4S) n4S.textContent = 'Query rewrite (1/1)';
    }
  }, 1200);
};

// ── Interactive Agentic DocuChat Pipeline Simulation ─────────
window.runDocuChatSim = function(mode) {
  const myToken = nextSimToken(window.runDocuChatSim);
  const n1 = document.querySelector('#dcNode1 rect');
  const n2 = document.querySelector('#dcNode2 rect');
  const n3 = document.querySelector('#dcNode3 rect');
  const n4 = document.querySelector('#dcNode4 rect');
  const l1 = document.getElementById('dcLink1');
  const l2 = document.getElementById('dcLink2');
  const l3 = document.getElementById('dcLink3');
  const n4T = document.getElementById('dcNode4Title');
  const n4S = document.getElementById('dcNode4Sub');
  const n4L = document.getElementById('dcNode4Label');

  if (!n1 || !n2 || !n3 || !n4) return;

  // Reset to idle
  [n1, n2, n3, n4].forEach(n => {
    n.setAttribute('stroke', '#1e293b');
    n.setAttribute('fill', '#0d1424');
  });
  [l1, l2, l3].forEach(l => {
    if (l) {
      l.setAttribute('stroke', '#334155');
      l.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  // Step 1: Query Context Buffer
  n1.setAttribute('stroke', '#10b981');
  n1.setAttribute('fill', '#0c271c');

  // Step 2: LangGraph ReAct Router (400ms)
  setTimeout(() => {
    if (myToken !== window.runDocuChatSim._token) return;
    if (l1) {
      l1.setAttribute('stroke', '#10b981');
      l1.setAttribute('marker-end', 'url(#arrowSuccess)');
    }
    n2.setAttribute('stroke', '#10b981');
    n2.setAttribute('fill', '#0c271c');
  }, 400);

  // Step 3: MCP Tool Dispatch (800ms)
  setTimeout(() => {
    if (myToken !== window.runDocuChatSim._token) return;
    const isTool = (mode === 'tool' || mode === 'mcp');
    const color = isTool ? '#38bdf8' : '#10b981';
    const fill = isTool ? '#0d223a' : '#0c271c';
    if (l2) {
      l2.setAttribute('stroke', color);
      l2.setAttribute('marker-end', isTool ? 'url(#arrowActive)' : 'url(#arrowSuccess)');
    }
    n3.setAttribute('stroke', color);
    n3.setAttribute('fill', fill);
  }, 800);

  // Step 4: Outcome (1200ms)
  setTimeout(() => {
    if (myToken !== window.runDocuChatSim._token) return;
    const isTool = (mode === 'tool' || mode === 'mcp');
    if (isTool) {
      if (l3) {
        l3.setAttribute('stroke', '#38bdf8');
        l3.setAttribute('marker-end', 'url(#arrowActive)');
      }
      n4.setAttribute('stroke', '#38bdf8');
      n4.setAttribute('fill', '#0d223a');
      if (n4L) n4L.setAttribute('fill', '#38bdf8');
      if (n4T) {
        n4T.setAttribute('fill', '#38bdf8');
        n4T.textContent = 'MCP Web Radar';
      }
      if (n4S) n4S.textContent = 'Tavily JSON-RPC 2.0 ✓';
    } else {
      if (l3) {
        l3.setAttribute('stroke', '#10b981');
        l3.setAttribute('marker-end', 'url(#arrowSuccess)');
      }
      n4.setAttribute('stroke', '#10b981');
      n4.setAttribute('fill', '#0c271c');
      if (n4L) n4L.setAttribute('fill', '#10b981');
      if (n4T) {
        n4T.setAttribute('fill', '#34d399');
        n4T.textContent = 'Local Vector Hit';
      }
      if (n4S) n4S.textContent = 'ChromaDB cache (1.9s) ✓';
    }
  }, 1200);
};

// ── Interactive Resume Crew Pipeline Simulation ──────────────
window.runResumeCrewSim = function(mode) {
  const myToken = nextSimToken(window.runResumeCrewSim);
  const n1 = document.querySelector('#rcNode1 rect');
  const n2 = document.querySelector('#rcNode2 rect');
  const n3 = document.querySelector('#rcNode3 rect');
  const n4 = document.querySelector('#rcNode4 rect');
  const l1 = document.getElementById('rcLink1');
  const l2 = document.getElementById('rcLink2');
  const l3 = document.getElementById('rcLink3');
  const n4T = document.getElementById('rcNode4Title');
  const n4S = document.getElementById('rcNode4Sub');
  const n4L = document.getElementById('rcNode4Label');

  if (!n1 || !n2 || !n3 || !n4) return;

  // Reset to idle
  [n1, n2, n3, n4].forEach(n => {
    n.setAttribute('stroke', '#1e293b');
    n.setAttribute('fill', '#0d1424');
  });
  [l1, l2, l3].forEach(l => {
    if (l) {
      l.setAttribute('stroke', '#334155');
      l.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  // Step 1: Parser Ingest
  n1.setAttribute('stroke', '#f59e0b');
  n1.setAttribute('fill', '#291d09');

  // Step 2: Hardware Acceleration (400ms)
  setTimeout(() => {
    if (myToken !== window.runResumeCrewSim._token) return;
    if (l1) {
      l1.setAttribute('stroke', '#f59e0b');
      l1.setAttribute('marker-end', 'url(#arrowWarn)');
    }
    n2.setAttribute('stroke', '#f59e0b');
    n2.setAttribute('fill', '#291d09');
  }, 400);

  // Step 3: AST Claim Matcher (800ms)
  setTimeout(() => {
    if (myToken !== window.runResumeCrewSim._token) return;
    if (l2) {
      l2.setAttribute('stroke', '#f59e0b');
      l2.setAttribute('marker-end', 'url(#arrowWarn)');
    }
    n3.setAttribute('stroke', '#f59e0b');
    n3.setAttribute('fill', '#291d09');
  }, 800);

  // Step 4: Outcome (1200ms)
  setTimeout(() => {
    if (myToken !== window.runResumeCrewSim._token) return;
    if (mode === 'match' || mode === 'pass') {
      if (l3) {
        l3.setAttribute('stroke', '#10b981');
        l3.setAttribute('marker-end', 'url(#arrowSuccess)');
      }
      n4.setAttribute('stroke', '#10b981');
      n4.setAttribute('fill', '#0c271c');
      if (n4L) n4L.setAttribute('fill', '#10b981');
      if (n4T) {
        n4T.setAttribute('fill', '#34d399');
        n4T.textContent = 'Aligned Match';
      }
      if (n4S) n4S.textContent = 'Score: 92% verified ✓';
    } else {
      if (l3) {
        l3.setAttribute('stroke', '#ef4444');
        l3.setAttribute('marker-end', 'url(#arrowWarn)');
      }
      n4.setAttribute('stroke', '#ef4444');
      n4.setAttribute('fill', '#2d1214');
      if (n4L) n4L.setAttribute('fill', '#ef4444');
      if (n4T) {
        n4T.setAttribute('fill', '#f87171');
        n4T.textContent = 'Skill Gap Alert';
      }
      if (n4S) n4S.textContent = 'Missing 2 mandatory reqs';
    }
  }, 1200);
};

// ── Interactive CareerOS-Pro Pipeline Simulation ─────────────
window.runCareerOSSim = function(mode) {
  const myToken = nextSimToken(window.runCareerOSSim);
  const n1 = document.querySelector('#coNode1 rect');
  const n2 = document.querySelector('#coNode2 rect');
  const n3 = document.querySelector('#coNode3 rect');
  const n4 = document.querySelector('#coNode4 rect');
  const l1 = document.getElementById('coLink1');
  const l2 = document.getElementById('coLink2');
  const l3 = document.getElementById('coLink3');
  const n4T = document.getElementById('coNode4Title');
  const n4S = document.getElementById('coNode4Sub');
  const n4L = document.getElementById('coNode4Label');

  if (!n1 || !n2 || !n3 || !n4) return;

  // Reset to idle
  [n1, n2, n3, n4].forEach(n => {
    n.setAttribute('stroke', '#1e293b');
    n.setAttribute('fill', '#0d1424');
  });
  [l1, l2, l3].forEach(l => {
    if (l) {
      l.setAttribute('stroke', '#334155');
      l.setAttribute('marker-end', 'url(#arrow)');
    }
  });

  // Step 1: Multi-Source Crawl
  n1.setAttribute('stroke', '#a855f7');
  n1.setAttribute('fill', '#261238');

  // Step 2: Stage 1 Hash Dedup (400ms)
  setTimeout(() => {
    if (myToken !== window.runCareerOSSim._token) return;
    if (l1) {
      l1.setAttribute('stroke', '#a855f7');
      l1.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n2.setAttribute('stroke', '#a855f7');
    n2.setAttribute('fill', '#261238');
  }, 400);

  // Step 3: Stage 2 Vector Dedup (800ms)
  setTimeout(() => {
    if (myToken !== window.runCareerOSSim._token) return;
    if (l2) {
      l2.setAttribute('stroke', '#a855f7');
      l2.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n3.setAttribute('stroke', '#a855f7');
    n3.setAttribute('fill', '#261238');
  }, 800);

  // Step 4: Outcome (1200ms)
  setTimeout(() => {
    if (myToken !== window.runCareerOSSim._token) return;
    if (mode === 'dedup' || mode === 'normal') {
      if (l3) {
        l3.setAttribute('stroke', '#10b981');
        l3.setAttribute('marker-end', 'url(#arrowSuccess)');
      }
      n4.setAttribute('stroke', '#10b981');
      n4.setAttribute('fill', '#0c271c');
      if (n4L) n4L.setAttribute('fill', '#10b981');
      if (n4T) {
        n4T.setAttribute('fill', '#34d399');
        n4T.textContent = 'Dedup Cleaned';
      }
      if (n4S) n4S.textContent = '74% duplicate pruned ✓';
    } else {
      if (l3) {
        l3.setAttribute('stroke', '#f59e0b');
        l3.setAttribute('marker-end', 'url(#arrowWarn)');
      }
      n4.setAttribute('stroke', '#f59e0b');
      n4.setAttribute('fill', '#291d09');
      if (n4L) n4L.setAttribute('fill', '#f59e0b');
      if (n4T) {
        n4T.setAttribute('fill', '#fbbf24');
        n4T.textContent = 'Circuit Breaker';
      }
      if (n4S) n4S.textContent = 'Isolated source retry';
    }
  }, 1200);
};

// ── Contribution snake ─────────────────────────────────────
// A cyan sensor-snake loops the heatmap column by column, flashing the
// cells it eats. Decorative: skipped under reduced-motion, parked while
// the graph is off-screen or the tab hidden. One interval, a handful of
// attribute writes per tick — negligible cost.
function startContribSnake(svg) {
  if (!svg || reduceMotion) return;
  const cells = Array.from(svg.querySelectorAll('rect')).map((el) => ({
    el,
    x: parseFloat(el.getAttribute('x')) + 5.5,
    y: parseFloat(el.getAttribute('y')) + 5.5,
  }));
  if (cells.length < 8) return;

  const NS = 'http://www.w3.org/2000/svg';
  const head = document.createElementNS(NS, 'circle');
  head.setAttribute('r', '7');
  head.setAttribute('class', 'snake-head');
  head.setAttribute('aria-hidden', 'true');
  svg.appendChild(head);

  let idx = 0, visible = true, restTicks = 0;
  const STEP_MS = 90, REST_TICKS = 45;

  function eat(cell) {
    const el = cell.el;
    if (!el.dataset.origFill) el.dataset.origFill = el.getAttribute('fill');
    el.setAttribute('fill', '#7dd3fc');
    el.setAttribute('stroke', '#7dd3fc');
    setTimeout(() => {
      el.setAttribute('fill', el.dataset.origFill || '');
      el.setAttribute('stroke', 'rgba(255,255,255,0.05)');
    }, 650);
  }

  function tick() {
    if (document.hidden || !visible) return;
    if (restTicks > 0) { restTicks--; return; }
    const cell = cells[idx];
    head.setAttribute('cx', cell.x);
    head.setAttribute('cy', cell.y);
    eat(cell);
    idx++;
    if (idx >= cells.length) {
      idx = 0;
      restTicks = REST_TICKS;
      head.setAttribute('cx', -50);
      head.setAttribute('cy', -50);
    }
  }

  // Eaten cells flash bright, then cool back to their level color
  setInterval(tick, STEP_MS);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => { visible = entries.some((e) => e.isIntersecting); },
      { threshold: 0 }
    ).observe(svg);
  }
}

// ── Command Console Dialog Modal (⌘K) ─────────────────────────
window.initCommandConsole = function() {
  const modal = document.getElementById('cmd-console-modal');
  const input = document.getElementById('cmd-console-input');
  const list = document.getElementById('cmd-console-list');
  if (!modal || !input) return;

  let selectedIndex = 0;

  function getVisibleItems() {
    if (!list) return [];
    return Array.from(list.querySelectorAll('.cmd-console-item')).filter(
      item => item.style.display !== 'none'
    );
  }

  function updateSelection() {
    const visible = getVisibleItems();
    visible.forEach((item, idx) => {
      item.classList.toggle('selected', idx === selectedIndex);
    });
  }

  window.openCommandPalette = function() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    // Park background landmarks outside the accessibility tree while the
    // dialog owns interaction (the Tab trap covers keyboards; inert
    // covers screen-reader browsing).
    document.querySelectorAll('header, main, footer').forEach((el) => { el.inert = true; });
    window.__paletteTrigger = document.activeElement;
    input.focus();
    input.value = '';
    filterItems('');
    selectedIndex = 0;
    updateSelection();
  };

  window.closeCommandPalette = function() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('header, main, footer').forEach((el) => { el.inert = false; });
    if (window.__paletteTrigger && window.__paletteTrigger.focus) {
      window.__paletteTrigger.focus();
      window.__paletteTrigger = null;
    }
  };

  function filterItems(query) {
    if (!list) return;
    const items = list.querySelectorAll('.cmd-console-item');
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
    selectedIndex = 0;
    updateSelection();
  }

  input.addEventListener('input', (e) => {
    filterItems(e.target.value);
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
      return;
    }

    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
        return;
      }

      const visible = getVisibleItems();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (visible.length > 0) {
          selectedIndex = (selectedIndex + 1) % visible.length;
          updateSelection();
          visible[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (visible.length > 0) {
          selectedIndex = (selectedIndex - 1 + visible.length) % visible.length;
          updateSelection();
          visible[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (visible[selectedIndex]) {
          visible[selectedIndex].click();
        }
      }
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCommandPalette();
  });

  if (list) {
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-console-item');
      if (!item) return;
      const target = item.dataset.target;
      const action = item.dataset.action;
      if (target) {
        closeCommandPalette();
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'resume') {
        window.open('assets/maithresh_vaddi_resume.pdf', '_blank', 'noopener');
        closeCommandPalette();
      } else if (action === 'github') {
        window.open('https://github.com/MaithreshVaddi-27', '_blank', 'noopener');
        closeCommandPalette();
      }
    });
  }
};

// ── Live Pointer Telemetry HUD & Specular Card Tracking ───────
let telemetryPtrEl = null;
let lastTelemetryThrottle = 0;

window.updatePointerTelemetry = function(e) {
  if (!telemetryPtrEl) {
    telemetryPtrEl = document.getElementById('telemetry-ptr');
  }

  const now = performance.now();
  if (telemetryPtrEl && (now - lastTelemetryThrottle > 33)) {
    lastTelemetryThrottle = now;
    const x = String(Math.round(e.clientX)).padStart(4, '0');
    const y = String(Math.round(e.clientY)).padStart(4, '0');
    telemetryPtrEl.textContent = `PTR: [X: ${x}, Y: ${y}]`;
  }

  // Workbench card specular highlight coordinate tracking
  const targetShell = e.target && e.target.closest ? e.target.closest('.wb-shell') : null;
  if (targetShell) {
    const rect = targetShell.getBoundingClientRect();
    const relX = Math.round(e.clientX - rect.left);
    const relY = Math.round(e.clientY - rect.top);
    targetShell.style.setProperty('--mouse-x', `${relX}px`);
    targetShell.style.setProperty('--mouse-y', `${relY}px`);
  }
};

window.addEventListener('pointermove', window.updatePointerTelemetry, { passive: true });

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.initCommandConsole) window.initCommandConsole();
  });
} else {
  if (window.initCommandConsole) window.initCommandConsole();
}


// Back-to-top — floating glass pill (ultra-premium pass)
(function () {
  const btn = document.getElementById('toTop');
  const header = document.querySelector('header');
  if (!btn) return;
  const onScroll = () => {
    btn.classList.toggle('show', window.scrollY > 900);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Footer year — never ships a stale copyright
(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

// Portrait failure guard — the hero card never renders as an empty void
(function () {
  const card = document.querySelector('.ascii-card--hero');
  const img = card ? card.querySelector('img') : null;
  if (!card || !img) return;
  const check = () => {
    if (img.complete && img.naturalWidth === 0) card.classList.add('is-broken');
  };
  img.addEventListener('error', () => card.classList.add('is-broken'));
  check();
})();

// ── Personalized instrument cursor ──────────────────────────
// Cyan sensor dot (1:1 with the pointer) + a lerped reticle ring that
// widens over anything pressable. One rAF loop, transform-only,
// parked while the tab is hidden. Never enabled for touch pointers,
// reduced-motion users, or text entry (native I-beam preserved).
(function () {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || reduceMotion) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  let shown = false, running = false, raf = 0;
  const HALF_DOT = 3, HALF_RING = 15, HALF_RING_ACTIVE = 23;

  function place() {
    dot.style.transform = `translate(${mx - HALF_DOT}px, ${my - HALF_DOT}px)`;
    rx += (mx - rx) * 0.2;
    ry += (my - ry) * 0.2;
    const half = ring.classList.contains('is-active') ? HALF_RING_ACTIVE : HALF_RING;
    ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`;
    if (running) raf = requestAnimationFrame(place);
  }
  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(place);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
  }

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!shown) {
      shown = true;
      document.body.classList.add('cursor-on');
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      start();
    }
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    document.body.classList.add('cursor-hidden');
  });
  document.documentElement.addEventListener('pointerenter', () => {
    document.body.classList.remove('cursor-hidden');
  });

  // Reticle widens over pressables; custom chrome steps aside for text entry
  const PRESSABLE = 'a, button, [role="tab"], [role="button"], .cmd-console-item, input[type="checkbox"], input[type="radio"], summary';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest && e.target.closest(PRESSABLE)) ring.classList.add('is-active');
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) {
      document.body.classList.add('cursor-hidden');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest && e.target.closest(PRESSABLE)) ring.classList.remove('is-active');
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) {
      document.body.classList.remove('cursor-hidden');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (shown) start();
  });
})();

// ── Hero stat count-up ──
// Numerals ease from 0 to their authored value the first time they
// enter the viewport; suffixes (like %) are preserved. Skipped under
// prefers-reduced-motion, where the final value simply stands.
(function () {
  const nums = document.querySelectorAll('.hero-stat-n');
  if (!nums.length || reduceMotion) return;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);
      const match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2];
      const dur = 1100;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * easeOut(p)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  nums.forEach((el) => io.observe(el));
})();
