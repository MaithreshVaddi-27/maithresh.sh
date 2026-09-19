# Terminal HUD Redesign (`maithresh.sh`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `Maithresh.dev` into **`maithresh.sh`**, an ultra-premium, dark-mode terminal HUD portfolio engineered with Apple Fluid Design principles, Doppelrand double-bezel enclosures, subdued ice-cyan telemetry, interactive architectural SVGs, and interview defense tradeoff callouts.

**Architecture:** A static, zero-build modern web application structured into modular CSS custom properties, Apple-grade Doppelrand component primitives, semantic HTML5 section architecture, and lightweight ES6 modules for interactive SVG pipeline simulation and `⌘K` command console interactions.

**Tech Stack:** Vanilla HTML5, Modern CSS3 (Grid, Flexbox, Backdrop-Filter, Concentric Radii, Custom Cubic Beziers), SVG Vector Graphics, ES6+ JavaScript. 100% GitHub Pages static hosting compatible.

**Spec:** `docs/superpowers/specs/2026-09-19-terminal-hud-redesign.md`

## Global Constraints

- **Brand Naming:** Must prominently use `maithresh.sh` as primary identity with alias `maithresh.ai` and prompt `~/ai-systems`.
- **Color Palette Limits:** No raw 100%-saturation neon cyan. Primary accent must use subdued Ice Cyan (`#38BDF8`) paired with deep cyber azure (`#0284C7`), obsidian void (`#07090E`), quantum mint (`#10B981`), and solar amber (`#F59E0B`).
- **Apple UI/UX Mandate:** All major cards must use Doppelrand nested enclosures (outer shell `p-2 rounded-[20px]`, inner core `rounded-[12px]` with inset specular glow). All buttons must use button-in-button nested trailing icon badges and spring active states (`:active { transform: scale(0.97); }`).
- **Data Integrity:** Preserve all 10 verified candidate agent systems, 13 automation pipelines, KMIT education, and GitHub commit heatmap data.
- **Zero Build Step:** Keep code 100% runnable directly in any browser and GitHub Pages without npm/webpack/vite build steps.

---

## File Map & Responsibilities

- **`css/style.css`**: Master design system containing refined CSS custom properties, Doppelrand hardware containers, liquid glass island nav, button-in-button pills, biometric viewfinder styling, interactive SVG pipeline animations, and `⌘K` modal styles.
- **`index.html`**: Master page markup organizing the live telemetry bar, floating island nav, hero command center with animated terminal portrait SVG, TrustRAG interactive architectural SVG workbench, Doppelrand project showcase, interview defense callouts, automations grid, education, and `⌘K` modal.
- **`js/main.js`**: Interactive runtime handling the TrustRAG SVG simulation states, keyboard shortcut (`⌘K` / `Ctrl+K`), command console filter/execution, smooth scroll navigation, and active telemetry stats.
- **`tests/verify-redesign.js`**: Node.js automated verification test script checking DOM element presence, CSS variable validity, brand name adherence, and SVG integration.

---

### Task 1: Automated Validation Test Suite

**Files:**
- Create: `tests/verify-redesign.js`

**Interfaces:**
- Consumes: `index.html`, `css/style.css`, `js/main.js`
- Produces: CLI verification test script returning exit code 0 when all redesign requirements pass.

- [ ] **Step 1: Write the failing test script**

```javascript
// tests/verify-redesign.js
const fs = require('fs');
const path = require('path');

function runChecks() {
  console.log('🧪 Starting Redesign Verification Suite...');
  let errors = [];

  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');

  // Check 1: Brand name maithresh.sh
  if (!html.includes('maithresh.sh')) {
    errors.push('index.html must include new brand "maithresh.sh"');
  }

  // Check 2: Refined Subdued Cyan variable in CSS
  if (!css.includes('--accent-cyan') || !css.includes('#38bdf8')) {
    errors.push('css/style.css must define --accent-cyan as #38bdf8 (subdued ice cyan)');
  }

  // Check 3: Doppelrand double-bezel CSS classes
  if (!css.includes('.doppelrand-shell') || !css.includes('.doppelrand-core')) {
    errors.push('css/style.css must define .doppelrand-shell and .doppelrand-core');
  }

  // Check 4: Button-in-button nested class
  if (!css.includes('.btn-nested') || !css.includes('.btn-nested-badge')) {
    errors.push('css/style.css must define .btn-nested and .btn-nested-badge');
  }

  // Check 5: TrustRAG interactive SVG pipeline visualizer in HTML
  if (!html.includes('id="trustrag-pipeline-svg"') && !html.includes('id="pipelineSvg"')) {
    errors.push('index.html must contain TrustRAG interactive SVG pipeline element');
  }

  // Check 6: Interactive simulation function in js/main.js
  if (!js.includes('runTrustRagSim')) {
    errors.push('js/main.js must contain runTrustRagSim function');
  }

  // Check 7: Command Console ⌘K listener in js/main.js
  if (!js.includes('initCommandConsole') && !js.includes('openCommandPalette')) {
    errors.push('js/main.js must contain Command Console initialization logic');
  }

  // Check 8: Terminal portrait SVG reference
  if (!html.includes('maithresh-terminal-portrait.59fb7aed.svg')) {
    errors.push('index.html must reference maithresh-terminal-portrait.59fb7aed.svg');
  }

  if (errors.length > 0) {
    console.error('❌ Verification Failed with errors:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  } else {
    console.log('✅ All Redesign Verification Checks Passed Successfully!');
  }
}

runChecks();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-redesign.js`
Expected: FAIL with errors listing missing classes and brand updates.

---

### Task 2: Refined CSS Design System & Apple Doppelrand Tokens

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: Spec color tokens and Apple design guidelines
- Produces: CSS custom properties (`--bg-void`, `--accent-cyan: #38bdf8`, `--specular-rim`), `.doppelrand-shell`, `.doppelrand-core`, `.glass-dock`, `.btn-nested`, spring active transitions.

- [ ] **Step 1: Update design tokens in `css/style.css`**

Add root variables:
```css
:root {
  --bg-void: #07090e;
  --bg-surface-glass: rgba(13, 19, 32, 0.72);
  --bg-surface-core: #0c101a;
  --bg-surface-subtle: #080b12;
  --accent-cyan: #38bdf8;
  --accent-cyan-deep: #0284c7;
  --accent-cyan-glow: rgba(56, 189, 248, 0.15);
  --accent-mint: #10b981;
  --accent-mint-glow: rgba(16, 185, 129, 0.15);
  --accent-amber: #f59e0b;
  --accent-amber-glow: rgba(245, 158, 11, 0.15);
  --accent-coral: #ef4444;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-glass: rgba(255, 255, 255, 0.12);
  --specular-rim: rgba(255, 255, 255, 0.14);
  --inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.12);
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
  --spring-snap: cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: Add Apple Doppelrand & Button-in-Button Component Classes**

```css
/* Doppelrand (Double-Bezel) Nested Architecture */
.doppelrand-shell {
  background: var(--bg-surface-glass);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid var(--border-glass);
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  transition: border-color 0.3s ease, transform 0.3s var(--spring-snap);
}

.doppelrand-shell:hover {
  border-color: rgba(56, 189, 248, 0.3);
}

.doppelrand-core {
  background: var(--bg-surface-core);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--inner-glow);
  position: relative;
  overflow: hidden;
}

/* Button-in-Button Nested CTA Architecture */
.btn-nested {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 6px 6px 18px;
  border-radius: 9999px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: transform 0.2s var(--spring-snap), background 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
}

.btn-nested:active {
  transform: scale(0.97);
}

.btn-nested-primary {
  background: var(--accent-cyan);
  color: #04070e;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}

.btn-nested-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
}

.btn-nested-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #04070e;
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s var(--spring-snap);
}

.btn-nested:hover .btn-nested-badge {
  transform: translate(2px, -2px) scale(1.05);
}

/* Detached Liquid Glass Dock */
.glass-dock {
  position: sticky;
  top: 16px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-surface-glass);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border: 1px solid var(--border-glass);
  border-radius: 9999px;
  padding: 8px 24px;
  max-width: 1160px;
  margin: 0 auto 36px auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 3: Add SVG Viewfinder & Pipeline Simulator Styles**

```css
/* Biometric HUD Viewfinder */
.hud-viewfinder {
  position: relative;
  background: var(--bg-surface-subtle);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 20px;
  padding: 18px;
}

.hud-reticle {
  position: absolute;
  pointer-events: none;
}

.hud-reticle-tl { top: 6px; left: 6px; }
.hud-reticle-tr { top: 6px; right: 6px; }
.hud-reticle-bl { bottom: 6px; left: 6px; }
.hud-reticle-br { bottom: 6px; right: 6px; }

/* Interactive SVG Pipeline Visualizer */
.pipeline-container {
  background: #06090e;
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  margin: 18px 0;
}

.pipeline-node {
  transition: stroke 0.3s ease, fill 0.3s ease, filter 0.3s ease;
}

.pipeline-link {
  transition: stroke 0.3s ease, stroke-width 0.3s ease;
}

/* Interview Defense Callouts */
.interview-defense-box {
  background: rgba(56, 189, 248, 0.04);
  border-left: 3px solid var(--accent-cyan);
  border-radius: 0 12px 12px 0;
  padding: 16px 20px;
  margin-top: 18px;
  font-family: var(--font-mono);
}
```

---

### Task 3: Interactive Runtime Logic (`js/main.js`)

**Files:**
- Modify: `js/main.js`

**Interfaces:**
- Consumes: User click events and keyboard shortcuts
- Produces: `runTrustRagSim(mode)` simulation updates and `initCommandConsole()` palette control.

- [ ] **Step 1: Implement `runTrustRagSim` in `js/main.js`**

```javascript
window.runTrustRagSim = function(mode) {
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
    if (l1) {
      l1.setAttribute('stroke', '#38bdf8');
      l1.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n2.setAttribute('stroke', '#38bdf8');
    n2.setAttribute('fill', '#0d223a');
  }, 400);

  // Step 3: Fused Claim NLI Verification (800ms)
  setTimeout(() => {
    if (l2) {
      l2.setAttribute('stroke', '#38bdf8');
      l2.setAttribute('marker-end', 'url(#arrowActive)');
    }
    n3.setAttribute('stroke', '#38bdf8');
    n3.setAttribute('fill', '#0d223a');
  }, 800);

  // Step 4: Outcome Branch (1200ms)
  setTimeout(() => {
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
```

- [ ] **Step 2: Implement `initCommandConsole` in `js/main.js`**

```javascript
window.initCommandConsole = function() {
  const modal = document.getElementById('cmd-console-modal');
  const input = document.getElementById('cmd-console-input');
  if (!modal || !input) return;

  window.openCommandPalette = function() {
    modal.classList.add('active');
    input.focus();
    input.value = '';
  };

  window.closeCommandPalette = function() {
    modal.classList.remove('active');
  };

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeCommandPalette();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCommandPalette();
  });
};
```

---

### Task 4: Complete HTML Markup Redesign (`index.html`)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: All verified candidate data, SVG assets, and CSS classes
- Produces: Complete semantic HTML5 page with `maithresh.sh` branding, live telemetry, hero viewfinder, TrustRAG SVG workbench, Doppelrand project showcase, and `⌘K` modal.

- [ ] **Step 1: Update Document Meta, Title, and Brand Navigation**
  - Set `<title>maithresh.sh // AI Systems & Agent Runtimes</title>`
  - Implement top telemetry strip (`SYS_STATUS: NOMINAL // 10 SOLO AGENTS // 13 PIPELINES`)
  - Implement Detached Liquid Glass Island Nav with `maithresh.sh` branding and `⌘K` trigger.

- [ ] **Step 2: Implement Hero Command Center & Biometric HUD Viewfinder**
  - Left column: Headline "Deterministic Agent Runtimes & RAG Reliability", subtext, dual nested CTAs.
  - Right column: HUD Viewfinder with vector reticles and `<img src="assets/svg/maithresh-terminal-portrait.59fb7aed.svg">`.

- [ ] **Step 3: Implement Interactive TrustRAG SVG Workbench**
  - Vector flow graph (`<svg id="pipelineSvg">`) with nodes 1-4, markers `#arrow`, `#arrowActive`, `#arrowSuccess`, `#arrowWarn`.
  - Action buttons calling `runTrustRagSim('valid')` and `runTrustRagSim('fail')`.
  - Interview Defense Callout explaining fused claim decomposition + NLI.

- [ ] **Step 4: Implement Doppelrand Systems Grid with Interview Defense Callouts**
  - Feature 1: TrustRAG
  - Feature 2: Agentic DocuChat
  - Feature 3: Resume Crew
  - Feature 4: CareerOS-Pro
  - Feature 5: MCP Agents Suite
  - Secondary Systems & 13 Automation Workflows.

- [ ] **Step 5: Implement Academic & Verified Commits Section**
  - KMIT Hyderabad B.Tech profile.
  - GitHub commit heatmap.

- [ ] **Step 6: Embed `⌘K` Command Console Dialog**
  - Overlay modal with interactive command filtering and quick navigation actions.

---

### Task 5: End-to-End Verification & Polish

**Files:**
- Test: `tests/verify-redesign.js`

- [ ] **Step 1: Execute automated verification test**

Run: `node tests/verify-redesign.js`
Expected: Output `✅ All Redesign Verification Checks Passed Successfully!`

- [ ] **Step 2: Inspect visual output in local browser companion**

Verify:
1. Subdued Ice Cyan (`#38BDF8`) eliminates glare.
2. Apple Doppelrand double-bezel cards render with concentric border radii and inner highlights.
3. TrustRAG SVG pipeline interactive buttons execute animated node state transitions.
4. Button-in-button nested icons animate on hover and scale down smoothly on `:active`.
5. `⌘K` command console opens smoothly and responds to keyboard commands.

---
