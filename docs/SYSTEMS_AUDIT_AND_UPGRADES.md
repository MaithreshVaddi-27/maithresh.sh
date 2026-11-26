# Systems Monograph Portfolio — Senior Engineering & Design Audit

**Branch:** `feat/independent-ai-portfolio`  
**Audit Date:** 2026-11-26  
**Audited Target:** `http://localhost:4179/` (production `dist/` build) + repository source  
**Skills Applied:** `impeccable` (`audit`, `critique`, `craft-floor`), `ui-review`, `ui-a11y`, `code-reviewer`, `seo-audit`, `fixing-motion-performance`, `astryx`, `logo-design`

---

## 1. Audit Scorecard & Observed Baseline

| Dimension | Score | Observed Evidence |
|---|---:|---|
| **Accessibility (WCAG 2.2 AA)** | **3 / 4** | Lighthouse Accessibility **96/100**. Clean `H1→H4` hierarchy, zero ARIA role errors, and zero console errors. Blocked from 100 by **3.67:1** button contrast (`#ffffff` on `#3b82f6`) and two links under 24px height (`maithresh.sh` `22px`, `Back to top ↑` `18px`). |
| **Performance** | **3 / 4** | Brave Trace: **LCP 574 ms** (24 ms TTFB, 550 ms render delay), **CLS 0.00**, zero third-party network requests. Held back by a single **623 KB** JS chunk, **356 KB** CSS bundle (unused `gothic` fonts), and **1,146** DOM nodes. |
| **Design System & Theming** | **3 / 4** | Cohesive **Systems Monograph** palette, **Newsreader Variable** optical serif loaded cleanly, `design-system/tokens.json` & `USAGE.md` present. Drift: `monograph.css` duplicates several hex values instead of consuming `monographTheme.js` CSS variables everywhere. |
| **Responsive Design** | **4 / 4** | Zero horizontal overflow verified at `320px`, `390px`, and `1440px`; mobile drawer and badge fallback work cleanly. Minor touch-target polish needed (`< 44px` height on nav/sm buttons). |
| **SEO & Agentic Discovery** | **3.5 / 4** | Lighthouse SEO **100/100** & Best Practices **100/100**. **Agentic Browsing 50/100** due to missing `/llms.txt` and `/.well-known/ard.json`; `assets/og-image.jpg` is still from the legacy v2 theme. |
| **Code & Architecture** | **3.5 / 4** | `oxlint src` reports **0 errors / 0 warnings**; `astryx doctor --built dist` passes **25/25**. Unused legacy dependencies (`gsap`, `lenis`), dead data files (`console.jsx`, `navigation.jsx`), and inline `style={{}}` objects remain. |

---

## 2. Prioritized Upgrades, Fixes & Refactors

### P1 — Fix Before Production Merge

#### 1. Primary Button WCAG AA Contrast Failure (3.67:1 -> >= 5.17:1)
- **Evidence:** Brave DevTools `lighthouse_audit` flagged `color-contrast` on `.astryx-button` primary controls (`"Inspect Systems"` in `src/features/hero/HeroSection.jsx:39`, `"maithreshvaddi16@gmail.com"` in `src/features/background/BackgroundAndContact.jsx:104`). `#ffffff` on `#3b82f6` yields **3.67:1** (< 4.5:1 required for 16px normal text).
- **Change:** Update `--color-accent` in `src/theme/monographTheme.js:21`, `design-system/tokens.json`, and `design-system/README.md` from `#3b82f6` to **`#2563eb`** (`5.17:1` with `#ffffff`) or **`#1d4ed8`** (`6.70:1`), and regenerate `maithresh-mark-mono-2563eb.svg` to match.

#### 2. Eliminate Unused Astryx `gothic` Font Bloat & Split Main Bundle
- **Evidence:** `dist/assets/index-*.js` is **623 KB** (`199.5 KB` gzip, triggering Vite's >500 KB warning) and `index-*.css` is **356 KB** (`LCP` render delay: **550 ms**). `src/astryx-themes.js` imports `@astryxdesign/theme-gothic/fonts.css`, bundling 4 unused fonts (`UnifrakturMaguntia`, `Manufacturing Consent`, `Fustat`, and duplicate `JetBrains Mono` subsets — ~250 KB of unused WOFF2/CSS).
- **Changes:**
  1. Remove unused `gsap` and `lenis` from `package.json:22-23` and `vite.config.js:46`.
  2. Eject or author a local Astryx theme module via `astryx theme build` that omits `@astryxdesign/theme-gothic/fonts.css`, loading only `Newsreader Variable`, `Inter`, and `JetBrains Mono`.
  3. Add `React.lazy` + `Suspense` around below-the-fold sections (`ArchitectureWorkbench`, `FeaturedSystems`, `BackgroundAndContact`) in `src/app/App.jsx` and configure `manualChunks` in `vite.config.js` for `react-vendor` and `astryx-core`.

---

### P2 — Structural, Accessibility & SEO Upgrades

#### 3. Pointer Target Sizing (`>= 24px` AA Floor & `44px` Touch Goal)
- **Evidence:** `evaluate_script` measured `maithresh.sh` (`129×22px`) and `Back to top ↑` (`94×18px`) below WCAG 2.2 SC 2.5.8 (`24×24px`), plus 36 links/small buttons under `44px` height (`nav-link` `28px`, `Button size="sm"` `32px`).
- **Change:** Add vertical padding (`min-height: 36px; display: inline-flex; align-items: center;`) on `.brand-mark` and `.footer-top-link`, and enforce `min-height: 44px` on navigation links and action buttons inside `@media (pointer: coarse)` in `src/styles/monograph.css`.

#### 4. Add `/llms.txt` & `/.well-known/ard.json` + Refresh `assets/og-image.jpg`
- **Evidence:** Lighthouse `agentic-browsing` scored **50/100** (`llms-txt` and `ard-schema` failed). `assets/og-image.jpg` (`102 KB`) still displays the retired v2 Cyber-Terminal design.
- **Changes:**
  1. Add root `llms.txt` (copied into `dist/` via `STATIC_FILES` in `vite.config.js:9`) with an H1 heading, concise bio, verified project links (`TrustRAG`, `CareerOS-Pro`, `ApplyOS`, `DocuChat`, `Resume Crew`), and contact details.
  2. Add `.well-known/ard.json` if deploying as an agent-discoverable site, or document the exemption if static-only.
  3. Regenerate `assets/og-image.jpg` (`1200×630`) in the **Systems Monograph** Cobalt Blue + Newsreader + Verified Monolith visual language.

#### 5. Clean Up Dead Data Exports & Retire Legacy Docs
- **Evidence:** `src/data/console.jsx`, `src/data/navigation.jsx`, and lines 2 & 6 of `src/data/content.jsx` export `CONSOLE_ITEMS`, `SIM_LABELS`, `NAV_LINKS`, and `MARQUEE`, which have zero consumers in `src/`. `docs/FINAL_POLISH_V4.md` and `docs/README.md` describe the retired v2 architecture.
- **Changes:** Delete `src/data/console.jsx` and `src/data/navigation.jsx`, trim `src/data/content.jsx`, and archive or replace `docs/FINAL_POLISH_V4.md` with a current v3 tracker.

#### 6. Refactor Contribution Mosaic from 366 DOM Nodes to Single `<svg>`
- **Evidence:** `evaluate_script` counted **1,146** total DOM nodes; `src/features/background/BackgroundAndContact.jsx:75-84` emits ~366 individual `<span>` elements.
- **Changes:**
  1. Render the 53×7 contribution calendar as a single accessible `<svg>` with `<rect>` cells (or `<title>` per active day), reducing total DOM nodes by ~30%.
  2. Restore the progressive live GitHub contribution refresh (with `AbortController` timeout and `navigator.connection?.saveData` guard) so counts update past `2026-11-23` while painting instantly from `contributions.json`.

#### 7. Remove Inline `style={{}}` & Raw Layout `<div>` Wrappers
- **Evidence:** Inline `style={{}}` objects appear in `HeroSection.jsx:38`, `ArchitectureWorkbench.jsx:49,105,134`, `FeaturedSystems.jsx:90,104,119,138`, `StackMatrix.jsx:20,25,36`, `AutomationsAndTeam.jsx:20,40,46,66`, and `BackgroundAndContact.jsx:21-33,57,91`. `App.jsx:15` and `FeaturedSystems.jsx`/`HeroSection.jsx` still use raw layout `<div>`s (`hero-grid`, `hero-ledger`, `ledger-cell`, `system-metrics`, `metric-box`).
- **Change:** Move spacing/typography styles into semantic CSS classes in `src/styles/monograph.css`, convert `hero-ledger` and `system-metrics` to semantic `<dl>`/`<dt>`/`<dd>` lists or Astryx `Grid`, and keep `App.jsx` free of raw layout `<div>`s per `AGENTS.md`.

---

### P3 — Design System, Motion & Craft Polish

#### 8. Single Source of Truth Between `monographTheme.js` and `monograph.css`
- **Evidence:** `src/styles/monograph.css:24-39` re-declares `#0b0d11`, `#11141b`, `#202634`, `#f4f2ed` in `:root` instead of referencing Astryx's `--color-background-body`, `--color-background-surface`, `--color-border`, and `--color-text-primary` directly.
- **Change:** Map `.monograph-*` classes in `monograph.css` to Astryx semantic tokens (`var(--color-background-surface)`, `var(--color-text-primary)`, `var(--color-border)`) with fallback values so theme edits in `monographTheme.js` propagate automatically.

#### 9. Brand Lockup Geometric Precision (`maithresh-mark-horizontal.svg` & `stacked.svg`)
- **Evidence:** `svg_audit.py` scored `maithresh-mark.svg` **100/100**, while `maithresh-mark-horizontal.svg` (`91/100`) and `maithresh-mark-stacked.svg` (`83/100`) flagged a `74.1°` near-miss angle (`->75°`) on the `A` in `MAITHRESH` and a `10×10` period in the stacked lockup.
- **Change:** Adjust the `A` path coordinates in both lockups to snap the leg angle to exact `75°`, and enlarge the `.` square in `maithresh-mark-stacked.svg` to `12×12` so both lockups clear **95+/100**.

#### 10. High-Contrast Mode, Pipeline Anchors & Contact Copy Feedback
- **Evidence:** `design-system/README.md` previously documented `prefers-contrast: more`, which is not yet present in `src/styles/monograph.css`; `.signal-conduit` in `ArchitectureWorkbench.jsx` is a continuous line without node markers aligned to the 4 stage cards.
- **Changes:**
  1. Add `@media (prefers-contrast: more)` rules in `monograph.css` boosting hairline contrast (`#475569`) and secondary text (`#cbd5e1`).
  2. Add 4 circular stage-node stops on `.signal-svg` at `x = 125, 375, 625, 875` that light up sequentially as the pulse passes each stage.
  3. Add a subtle copy-to-clipboard button beside `maithreshvaddi16@gmail.com` in `#contact` with an inline `"Copied"` state confirmation (no modal or toast library).
