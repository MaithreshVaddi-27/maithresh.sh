# maithresh.sh — Contribution Mosaic · usage & handover

**Chosen direction:** the only concept built from a component the site actually ships (the contribution graph). Flat, modular, ownable, and regenerable from real data. No borrowed sci-fi language, no glow, no gradients, no effects.

---

## 1. The idea

A 9 × 7 contribution lattice — the visual grammar of the portfolio's GitHub-style graph — with 19 cells lit to resolve into a squared lowercase **m**. Two endpoints carry green and amber, the centre carries bright cyan; the rest is terminal cyan. The lattice stays visible as quiet `#1e293b` cells, so the mark reads as "signal inside noise."

## 2. Construction grid

| Parameter | Value |
| :--- | :--- |
| Canvas | `480 × 480` |
| Columns × rows | `9 × 7` |
| Cell | `28 × 28` |
| Pitch | `40` (12-unit gutter) |
| Grid origin | `x=60, y=104` |
| Lit cells | row 1: cols 1–7; rows 2–5: cols 1, 4, 7 |
| Endpoint accents | top-left `#10b981`, top-centre `#7dd3fc`, top-right `#f59e0b` |

The master is **data-driven**: one `<rect id="cell">` defines the geometry, the dormant lattice is a single editable `<pattern>`, and the 19 lit cells are `<use>` instances. Change the cell once and the whole mark follows. Audit complexity went from 420 anchors to 10 with no visual change.

## 3. Colour

| Role | Hex | Where |
| :--- | :--- | :--- |
| Substrate | `#07090e` | Required behind the full-colour mark |
| Terminal cyan | `#38bdf8` | The mark |
| Bright cyan | `#7dd3fc` | Centre endpoint |
| Flight green | `#10b981` | Left endpoint |
| Telemetry amber | `#f59e0b` | Right endpoint |
| Dormant cell | `#1e293b` @ 50% | Lattice |

All from the v2 design system. No violet or purple (retired). One-colour, black and white masters are supplied for contexts that can't carry the three accents.

## 4. Files

| File | Use |
| :--- | :--- |
| `mosaic-symbol.svg` | **Master.** Full colour with substrate. Use at ≥ 120 px. |
| `mosaic-symbol-transparent.svg` | Master without substrate, for variant export and light backgrounds. |
| `dist/mosaic-mono-38bdf8.svg` | Single cyan. Dark backgrounds. |
| `dist/mosaic-black.svg` | Single black. Light backgrounds / print. |
| `dist/mosaic-white.svg` | Single white. Dark backgrounds. |
| `dist/mosaic-square.svg` | Centred square master for avatars and social. |
| `mosaic-small.svg` | **Small-size cut.** Solid merged m, no lattice. 16–48 px. |
| `dist/favicon.svg`, `favicon-16/32/48.png`, `favicon.ico` | Browser tabs. Hand-tuned padding. |
| `dist/mosaic-app-icon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png` | PWA / iOS / Android. |
| `dist/site.webmanifest`, `dist/head-snippet.html` | Drop-in web metadata. |
| `mosaic-horizontal.svg` | Symbol + wordmark, side by side. |
| `mosaic-stacked.svg` | Symbol above wordmark. |
| `preview.html` | The full test sheet — sizes, backgrounds, mono, mirror, contexts. |

## 5. Rules

- **Clear space:** at least one pitch (`40` units, ~8% of canvas) on all sides.
- **Minimum sizes:** full mosaic ≥ 120 px wide; below that use `mosaic-small.svg` / the favicon master. The 9 × 7 lattice stops resolving around 64 px.
- **Backgrounds:** full colour requires `#07090e`. On anything else use mono, black or white.
- **No effects:** never add glow, shadow or gradients to the mark — the lattice is the texture.
- **Dynamic use:** you can re-light cells from live contribution data, but keep the 19-cell m silhouette intact and keep the three endpoint colours — those are the identity.
- **Lockups:** the wordmark is live `<text>` in JetBrains Mono 700 with `.sh` in `#38bdf8`. **Convert it to outlines in a vector editor before production use**, otherwise the lockup depends on an installed font. The symbol-only files have no such dependency.

## 6. Implementation

Inline the SVG (recommended — all `<use>` references are internal, so it works in `<img>`, CSS background and inline):

```jsx
import mosaic from './assets/logos/concepts/mosaic-kit/mosaic-symbol.svg'
<img src={mosaic} width="160" height="160" alt="maithresh.sh" />
```

For the favicon, copy `dist/favicon.ico` to `public/` and paste `dist/head-snippet.html` into `<head>`.

## 7. Open items

- Trademark clearance — not checked; run a search before commercial use.
- Outline the lockup wordmarks before print or embedded use.
- A presentation board with portfolio/dev-tool mockups can be added on request.
