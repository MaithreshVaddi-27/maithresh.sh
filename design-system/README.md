# maithresh.sh Design System — Systems Monograph

**Version:** `3.1.0`
**Foundation:** React 19 + Astryx (`@astryxdesign/core@0.7.17`, `@astryxdesign/theme-neutral@0.7.17`) + Vite 8
**Typography:** Newsreader Variable (optical editorial serif) · Inter · JetBrains Mono
**Primary Palette:** Warm Obsidian (`#0b0d11`), Bone Ink (`#f4f2ed`), Cobalt Blue (`#2563eb` / `#60a5fa`)

> **Live Sources:** Astryx theme overrides live in `src/theme/monographTheme.js`, layout and motion rules live in `src/styles/monograph.css`, and machine-readable tokens are stored in `design-system/tokens.json`.

---

## 1. Design Philosophy

Systems Monograph combines two complementary disciplines:

1. **Editorial Monograph Hierarchy:** Optical serif headings (`Newsreader Variable`), asymmetric hero framing, generous measure (`58ch–78ch`), and 1px hairline-divided ledgers instead of monotonous card grids.
2. **Systems Engineering Rigor:** Numbered repository specifications (`SYS-01` through `SYS-05`), tabular numerals for metrics, and an interactive pipeline trace (`FIG 01`) showing real execution paths and trade-offs.

---

## 2. Color & Contrast System

All accent surfaces use Cobalt Blue rather than green, pink, purple, or violet. Semantic amber (`#fbbf24`) and red (`#ef4444`) remain strictly reserved for warning, recovery, and abstain/error states.

| Token | Value | Role |
| :--- | :--- | :--- |
| `--obsidian` | `#0b0d11` | Primary page canvas |
| `--surface` | `#11141b` | Workbench, specimen panel, ledger cells |
| `--surface-elevated` | `#141821` | Interactive chips and secondary controls |
| `--ink-primary` | `#f4f2ed` | Primary headings and copy (>16:1 on canvas) |
| `--ink-secondary` | `#a1a8b5` | Subtitles and secondary prose (>7.5:1 on canvas) |
| `--cobalt-500` | `#2563eb` | Primary button fill (`#ffffff` foreground, 5.17:1 AA contrast) |
| `--cobalt-400` | `#60a5fa` | Active pipeline stages, metrics, links, focus ring |
| `--hairline` | `#202634` | Structural dividers and grid borders |

---

## 3. Typography & Browser Surfaces

- **Headings:** `'Newsreader Variable', Georgia, serif` with `font-optical-sizing: auto`, `font-weight: 400`, and `-0.025em` tracking.
- **Prose:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` (self-hosted WOFF2).
- **Specs & Metrics:** `'JetBrains Mono', ui-monospace, monospace` with `font-variant-numeric: tabular-nums`.
- **Browser Surfaces:** Custom `::selection` (`rgba(59, 130, 246, 0.34)`), `caret-color: #60a5fa`, thin scrollbars, `text-underline-offset: 4px`, and `2px solid #60a5fa` `:focus-visible` rings.

---

## 4. Astryx Integration & External Stylesheets

External styles load in explicit order:

1. `src/styles/tokens.css` (linked directly from `index.html` for instant obsidian substrate, `@font-face`, and CSS custom properties)
2. `@astryxdesign/core/reset.css` (in `src/app/main.jsx`)
3. `@astryxdesign/core/astryx.css` (in `src/app/main.jsx`)
4. `@fontsource-variable/newsreader/opsz.css` & `opsz-italic.css` (in `src/app/main.jsx`)
5. `src/styles/monograph.css` (component and layout overrides after Astryx base rules)

UI primitives (`Theme`, `Heading`, `Text`, `Button`, `Badge`, `TabList`, `Tab`, `HStack`, `VStack`, `Divider`) are imported per component from `@astryxdesign/core/*`.

---

## 5. Motion & Accessibility

- **Focal Trace:** Selecting a simulation in `ArchitectureWorkbench` animates an SVG signal conduit (`620ms`) and cascades across 4 stages (`110ms` steps) using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Scroll Progress:** CSS `animation-timeline: scroll()` drives a 2px Cobalt progress hairline beneath the sticky header without JavaScript scroll polling.
- **Pointer-Safe Hover:** Outer hitboxes stay stationary; only inner rows (`translateX(4px)`) or borders respond.
- **Reduced Motion & High Contrast:** `@media (prefers-reduced-motion: reduce)` removes transforms, keyframe entrances, and stagger delays while keeping opacity and color state changes intact; `@media (prefers-contrast: more)` raises divider and border opacity cleanly.
- **Data Visualizations & Discovery:** Contribution matrix renders via a single accessible `<svg>` grid with optional live GitHub refresh (`AbortController`, `saveData` check), while `/llms.txt` and `/.well-known/ard.json` provide machine-readable portfolio indexing.

---

## 6. Brand Mark — Verified Monolith

- **Symbol (`assets/brand/maithresh-mark.svg`):** 256×256 pure-path letterform (`#f4f2ed` 60° M-chevron + 20-unit verification channel + `#60a5fa` Cobalt anchor pillar).
- **Small-Size Cut (`assets/brand/maithresh-mark-kit/favicon-master.svg`):** Widened 24-unit channel for 16–48px browser tabs and favicons.
- **Full Kit (`assets/brand/maithresh-mark-kit/`):** Includes outlined horizontal and stacked lockups (`maithresh-mark-horizontal.svg`, `maithresh-mark-stacked.svg`), black, white/reversed, and Cobalt monochrome (`#2563eb`, `#60a5fa`) masters, plus PWA and favicon outputs in `assets/brand/`. See `assets/brand/maithresh-mark-kit/USAGE.md`.

