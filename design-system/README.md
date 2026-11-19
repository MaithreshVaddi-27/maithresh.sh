# maithresh.sh Design System
## Cyber-Terminal · Translucent Liquid Glass · Apple Fluid Dynamics

**Version:** `2.0.0`  
**Substrate:** React 19 + Vite 8 SPA  
**Primary Language:** JetBrains Mono + Inter Humanist  
**Key Accent:** Terminal Cyan (`#38bdf8`), Flight Green (`#10b981`), Telemetry Amber (`#f59e0b`)

---

> **Source of truth:** the live tokens are defined in `src/styles.css` (`:root`).
> This document is the design reference; no separate token files are shipped.

## 1. Design Philosophy & Foundations

The `maithresh.sh` design system balances two aesthetics:
1. **The Tactical Cyber-Terminal:** Deep substrate (`#07090e`), monospace headers, prompt tokens (`$`, `//`, `▶`), CRT scanlines, procedural film grain, and HUD reticle viewfinders.
2. **Liquid Glass & Apple Fluid Dynamics:** 3-tier translucent glass elevation, spring physics (`cubic-bezier(.16, 1, .3, 1)`), tactile active press (`scale(0.97)`), and rigorous accessibility (WCAG 2.2 AA).

### Core Principles
- **No Decoration Without Function:** Every reticle, badge, and connector illustrates actual telemetry or real state.
- **Dark Substrate Continuity:** The 3D canvas dot-matrix engine (`src/scene.js`) acts as a persistent spatial substrate behind the content.
- **High-Contrast Legibility:** High-contrast text (`#f8fafc`) on glass backgrounds, paired with strict contrast-mode fallbacks (`prefers-contrast: more`).

---

## 2. Color Palette & Semantics

### Base Substrate & Neutral Surfaces
| Token | Hex / Value | Semantic Role |
| :--- | :--- | :--- |
| `--bg` | `#07090e` | Deep canvas substrate |
| `--bg-surface` | `#0d1117` | Tier 1 background surface |
| `--bg-surface-subtle` | `#111620` | Tier 2 elevated panels |
| `--bg-surface-hover` | `#161c27` | Interactive hover highlight |
| `--line` | `#1e293b` | Structural dividers |
| `--line-bold` | `#334155` | Active schematic connectors |

### Flight Telemetry & Status Accents
| Token | Hex | Role & System Meaning |
| :--- | :--- | :--- |
| `--accent` / `--accent-cyan` | `#38bdf8` | Terminal prompt, active focus, primary CTA |
| `--accent-bright` | `#7dd3fc` | Highlight glow and focus ring tint |
| `--green` | `#10b981` | Verification passed, grounded claims, cache hit |
| `--amber` | `#f59e0b` | Recovery loop engaged, circuit breaker fallback |
| `--red` | `#ef4444` | Claim contradicted, test failure, abstain state |

*Note: Retired violet/purple hex codes (`#a855f7`, `#8b5cf6`, `#7c3aed`) are permanently retired to maintain clean 3-accent clarity.*

---

## 3. Liquid Glass Elevation Hierarchy

Translucency uses heavy backdrop blur and high saturation rather than flat opacity.

```css
/* Tier 1: Embedded content cards (recedes) */
--elev-1-bg: rgba(var(--glass), 0.50);
--elev-1-blur: 20px;
--elev-1-sat: 165%;
--elev-1-border: var(--glass-rim-dim);

/* Tier 2: Standard interactive grid cards & workbench shells */
--elev-2-bg: rgba(var(--glass), 0.62);
--elev-2-blur: 28px;
--elev-2-sat: 180%;
--elev-2-border: var(--glass-rim-dim);

/* Tier 3: Floating chrome (navigation dock, command palette) */
--elev-3-bg: rgba(var(--glass), 0.70);
--elev-3-blur: 40px;
--elev-3-sat: 200%;
--elev-3-border: var(--glass-rim);
```

---

## 4. Typography

- **Display & Monospace (`JetBrains Mono`):** Display headers, telemetry metrics, code snippets, prompt tags, and HUD coordinate indicators.
- **Body Prose (`Inter`):** Paragraphs, descriptions, and rationales. Prevents fatigue caused by scanning long blocks of monospace text.

```css
--font-display: 'JetBrains Mono', ui-monospace, monospace;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
--font-body: 'Inter', sans-serif;
```

---

## 5. Motion & Tactile Feedback

- **Standard Fluid Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` (Apple fluid deceleration curve).
- **Tactile Response:** `:active { transform: scale(0.97); }` provides immediate visual weight.
- **Scroll Physics:** Lenis smooth scrolling with GSAP ScrollTrigger batch reveals.
- **Reduced Motion:** When `prefers-reduced-motion: reduce` is detected, animations collapse to instantaneous transitions.

---

## 6. Component Patterns

### 1. HUD Reticle Viewfinder (`.hud-viewfinder`)
Four precision corner reticles surrounding the ASCII terminal portrait:
- Top-Left: `M1 13V1H13`
- Top-Right: `M13 13V1H1`
- Bottom-Left: `M1 1V13H13`
- Bottom-Right: `M13 1V13H1`

### 2. Nested Action Button (`.btn-nested`)
Multi-layer pill button with an integrated status badge:
- `.btn-nested-primary`: Cyan accent border with subtle internal glow.
- `.btn-nested-secondary`: Translucent glass with neutral outline.
- `.btn-nested-badge`: Trailing symbol box (`↓`, `↗`, `⌘K`).

### 3. Interactive SVG Schematics
Precision architecture diagrams sharing a standard coordinate contract:
- **ViewBox:** `0 0 520 304`
- **Node Corner Radius:** `rx="10"`
- **Color Rules:** Blue/Cyan (`#38bdf8`) for ingress, Emerald (`#10b981`) for verification, Amber (`#f59e0b`) for recovery/failover.
- **Namespaced Markers:** `pdArrow${prefix}` to prevent cross-SVG DOM ID collision.

### 4. Command Console (`⌘K` Palette)
- Follows the **WAI-ARIA 1.2 Combobox** pattern.
- Automatic scroll-into-view on arrow-key navigation.
- Background landmarks receive `inert` while the modal is open.

---

## 7. Accessibility & System Overrides

- **`prefers-reduced-transparency: reduce`:** Swaps glass backdrop filters for solid `#14171b` surfaces and removes decorative scanlines.
- **`prefers-contrast: more`:** Increases border opacity to `rgba(255, 255, 255, 0.4)` and card borders to `0.5`.
- **Keyboard Navigation:** High-contrast focus rings (`outline: 2px solid var(--accent); outline-offset: 3px;`). Skip link immediately available on first Tab.
- **Touch Targets:** Minimum 44px hit areas on touchscreens, and 24px minimum inline targets (WCAG 2.2 Criterion 2.5.8).
