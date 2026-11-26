# maithresh.sh — Brand Mark Usage & Handover

**Mark:** Verified Monolith (Concept A)
**Construction:** 256×256 geometric grid; Bone (`#f4f2ed`) 60° M-chevron separated by a 20-unit verification channel from the Cobalt (`#60a5fa`) anchor pillar. All lockups use pure outlined paths with zero live `<text>` dependencies.

---

## 1. Color Specification

| Role | Hex | Usage |
| :--- | :--- | :--- |
| Substrate | `#0b0d11` | Primary obsidian tile and dark lockups |
| Bone Ink | `#f4f2ed` | M-chevron and `MAITHRESH` wordmark |
| Cobalt Highlight | `#60a5fa` | Anchor pillar, `.SH` wordmark, and bright mono variant |
| Cobalt Primary | `#3b82f6` | Solid brand mono variant |
| Reversed | `#ffffff` | Dark backgrounds when full color cannot be used |
| Black | `#000000` | Light print and monochrome documents |

---

## 2. File Inventory

### Production Icons (`assets/brand/`)
- `maithresh-mark.svg` — Primary two-tone symbol (`Navbar.jsx`)
- `favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png` — Browser tabs (built from the small-size cut)
- `apple-touch-icon.png` (180×180), `icon-192.png`, `icon-512.png`, `maskable-512.png` — iOS and PWA manifest icons (`assets/site.webmanifest`)

### Masters & Lockups (`assets/brand/maithresh-mark-kit/`)
- `maithresh-mark-color.svg` — Full-color master symbol
- `favicon-master.svg` — Small-size cut (`24`-unit channel for 16–48px clarity)
- `maithresh-mark-black.svg`, `maithresh-mark-white.svg` — Single-color masters
- `maithresh-mark-mono-3b82f6.svg`, `maithresh-mark-mono-60a5fa.svg` — Cobalt monochrome masters
- `maithresh-mark-square.svg`, `maithresh-mark-favicon.svg`, `maithresh-mark-app-icon.svg` — Containerized cuts
- `maithresh-mark-horizontal.svg`, `maithresh-mark-stacked.svg` — Outlined combination lockups

---

## 3. Rules

- **Clear space:** Maintain at least `28` units (~11% of the 256px canvas) on all sides.
- **Minimum sizes:** Standard mark ≥ 24px; below 24px (favicons), use `favicon-master.svg` / `favicon.svg`.
- **No effects:** Keep flat fills; never add drop shadows, outer glows, or gradients.
- **Manifest paths:** Keep `assets/site.webmanifest` paths relative (`./brand/icon-192.png`, `start_url: "../"`) so both `/` and `/maithresh.sh/` deployments resolve.
