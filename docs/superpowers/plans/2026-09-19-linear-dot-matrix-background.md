# Linear Proximity Dot-Matrix Background & UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the background of `maithresh.sh` by replacing muddy CSS aurora gradient blobs with a high-performance, 120 FPS Linear/Raycast proximity dot-matrix canvas background with coordinate crosshairs in `#38BDF8`, and apply 6 critical UX polish fixes (matte noise overlay, card spotlight glow, live telemetry pointer coordinates, mobile SVG scaling, and ⌘K keyboard traversal).

**Architecture:** A lightweight HTML5 2D Canvas background engine with spring-damped proximity illumination and battery-throttling (`requestAnimationFrame` gated by `document.hidden` and scroll position), paired with an inline SVG noise texture overlay and pointer event telemetry.

**Tech Stack:** Vanilla HTML5, Modern CSS3, Canvas 2D API, SVG Vector Filters, ES6+ JavaScript. 100% GitHub Pages static hosting compatible.

**Spec:** `docs/superpowers/specs/2026-09-19-terminal-hud-redesign.md`

## Global Constraints

- **Brand Naming:** Must preserve `maithresh.sh` identity, `~/ai-systems` prompt, and `maithresh.ai` alias.
- **Color Palette Limits:** Primary accent must strictly adhere to Subdued Ice Cyan (`#38BDF8`) paired with deep cyber azure (`#0284C7`), obsidian void (`#07090E`), quantum mint (`#10B981`), and solar amber (`#F59E0B`).
- **Contrast & Legibility:** Maintain AAA contrast ratio against text and Doppelrand cards. Zero muddy gradient color pooling behind text.
- **Performance & Battery:** The canvas background must pause execution when the tab is hidden (`document.hidden`) and respect `prefers-reduced-motion`.
- **Zero Build Step:** Keep code 100% runnable directly in any browser and GitHub Pages without npm/webpack/vite build steps.

---

### Task 1: Update Test Suite for Background Modernization & UX Polish

**Files:**
- Modify: `tests/verify-redesign.js`

**Interfaces:**
- Consumes: Existing verification checks.
- Produces: 4 new assertions testing the removal of `.bg-aurora`, implementation of the dot-matrix engine, tactile noise overlay, and live pointer telemetry.

- [ ] **Step 1: Write new failing test checks in `tests/verify-redesign.js`**

```javascript
  // Check 9: Purge muddy aurora divs
  if (html.includes('class="bg-aurora"')) {
    errors.push('index.html must not contain muddy .bg-aurora gradient divs');
  }

  // Check 10: Dot Matrix canvas engine in js/scene.js
  const sceneJs = fs.readFileSync(path.join(__dirname, '../js/scene.js'), 'utf8');
  if (!sceneJs.includes('dot-matrix') && !sceneJs.includes('SPACING') && !sceneJs.includes('linear-dot-matrix')) {
    errors.push('js/scene.js must implement the Linear proximity dot-matrix canvas engine');
  }

  // Check 11: Tactile matte noise overlay
  if (!html.includes('noise-overlay') && !css.includes('noise-overlay')) {
    errors.push('index.html or css/style.css must include tactile matte noise-overlay');
  }

  // Check 12: Live telemetry pointer coordinates in js/main.js
  if (!js.includes('updatePointerTelemetry') && !js.includes('PTR:')) {
    errors.push('js/main.js must implement live pointer telemetry tracking');
  }
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/verify-redesign.js`
Expected: FAIL with errors listing missing dot-matrix engine and presence of `.bg-aurora`.

---

### Task 2: Linear Proximity Dot-Matrix Canvas Engine (`js/scene.js`)

**Files:**
- Modify: `js/scene.js`

**Interfaces:**
- Consumes: Pointer coordinates from `pointermove` events, window resize events.
- Produces: 120 FPS Canvas 2D dot matrix with `#38BDF8` proximity illumination, coordinate crosshairs, floating agent node anchors, and battery throttling.

- [ ] **Step 1: Implement the Linear Dot-Matrix & Coordinate Grid in `js/scene.js`**

Replace Three.js particle drift with Canvas 2D engine:
- Grid spacing: 28px.
- Base dot radius: 1px at 6% opacity (`rgba(255, 255, 255, 0.06)`).
- Crosshairs (`+`) at every 4th interval for coordinate feel (`rgba(56, 189, 248, 0.2)`).
- Proximity spotlight: 140px radius around cursor; dots scale up to 2.6px with ice-cyan glow (`rgba(56, 189, 248, 0.85)`).
- 4 subtle drifting Agentic Anchor Nodes (TrustRAG, LangGraph, LocalLLM, MCP) with faint tethering lines when the cursor approaches.
- Pause loop on `document.hidden` and `prefers-reduced-motion`.

- [ ] **Step 2: Verify `js/scene.js` syntax and absence of runtime errors**

Run: `node -c js/scene.js`
Expected: Syntax OK.

---

### Task 3: CSS Cleanup & Polish (`css/style.css`)

**Files:**
- Modify: `css/style.css`

**Interfaces:**
- Consumes: Design tokens in `:root`.
- Produces: Purged `.bg-aurora` classes, `.noise-overlay` styling, `.doppelrand-shell` cursor spotlight hover, and responsive SVG pipeline rules.

- [ ] **Step 1: Remove `.bg-aurora` CSS rules**
- [ ] **Step 2: Add `.noise-overlay` fixed SVG grain styles**
- [ ] **Step 3: Add interactive mouse spotlight hover on `.doppelrand-shell`**
- [ ] **Step 4: Add mobile responsive rules for `#pipelineSvg`**

---

### Task 4: HTML Integration & Telemetry HUD (`index.html`)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Canvas element `#hero-canvas`, telemetry bar.
- Produces: Cleaned markup without `.bg-aurora`, embedded noise texture overlay, and live telemetry element `#telemetry-ptr`.

- [ ] **Step 1: Remove `<div class="bg-aurora">` from `index.html`**
- [ ] **Step 2: Embed inline SVG noise overlay element with `feTurbulence`**
- [ ] **Step 3: Update top telemetry bar with `#telemetry-ptr` (`PTR: [X: ---, Y: ---]`**)

---

### Task 5: Interactive Runtime Enhancements (`js/main.js`)

**Files:**
- Modify: `js/main.js`

**Interfaces:**
- Consumes: Global `pointermove` and `keydown` events.
- Produces: `updatePointerTelemetry(e)` streaming coordinates to `#telemetry-ptr`, and keyboard arrow navigation (`ArrowUp`, `ArrowDown`, `Enter`) in `initCommandConsole()`.

- [ ] **Step 1: Implement `updatePointerTelemetry` in `js/main.js`**
- [ ] **Step 2: Add keyboard arrow traversal to `initCommandConsole`**

---

### Task 6: End-to-End Automated Verification & Visual Polish

**Files:**
- Test: `tests/verify-redesign.js`

- [ ] **Step 1: Run automated verification test suite**

Run: `node tests/verify-redesign.js`
Expected: Output `✅ All Redesign Verification Checks Passed Successfully!` (All 12 checks pass).

- [ ] **Step 2: Validate in local browser**
Verify:
1. Muddy aurora blobs are completely gone.
2. Background renders crisp coordinate dot matrix with smooth cyan cursor proximity spotlight.
3. Live telemetry displays active cursor coordinates in real time.
4. Cards have interactive specular highlights on hover.
5. Command Console allows seamless keyboard navigation.
