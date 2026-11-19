# maithresh.sh — brand mark: usage & handover

**Direction:** Contribution Mosaic. A 9 × 7 contribution lattice — the visual grammar the portfolio already ships — with 19 cells lit into a squared lowercase **m**. Flat, modular, ownable, and regenerable from real data. No borrowed sci-fi language, glow, or gradients.

---

## 1. Concept history (why this one)

Five directions were explored in the v2 round; only the chosen mark's sources are kept in this repo.

| Direction | Idea | Outcome |
|---|---|---|
| Neon Stripped | Curved neon m with a terminal dot | Rejected — closest to the old glass mark |
| Brutalist Mark | Unequal legs, cyan centre breaking the header | Runner-up — clean typography, but no portfolio-specific story |
| Glass Tiers | The three `elev-*` surfaces as a flat stack | Rejected — too abstract at small sizes |
| Signal Pulse | Oscilloscope trace resolving into an M | Strong runner-up — most instantly readable, most motion-friendly |
| **Contribution Mosaic** | Contribution lattice resolving into m | **Chosen** — the only mark built from a component the site actually ships |

Earlier rounds included a HUD reticle and a particle constellation; both were dropped as category clichés before v2.

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

The lattice master is parametric: one `<rect id="cell">` defines the geometry, dormant cells are a single `<pattern>`, and the 19 lit cells are `<use>` instances. Audit complexity is 10 anchors (down from 420 in the first draft) with no visual change.

## 3. Colour

| Role | Hex | Where |
| :--- | :--- | :--- |
| Substrate | `#07090e` | Required behind the full-colour mark |
| Terminal cyan | `#38bdf8` | The mark |
| Bright cyan | `#7dd3fc` | Centre endpoint |
| Flight green | `#10b981` | Left endpoint |
| Telemetry amber | `#f59e0b` | Right endpoint |
| Dormant cell | `#1e293b` @ 50% | Lattice |

All from the v2 design system. Violet/purple are retired. Single-colour, black and white masters are in `assets/brand/` for contexts that can't carry three accents.

## 4. Files

| File | Use |
| :--- | :--- |
| `assets/brand/maithresh-mark.svg` | Production small cut — nav lockup and favicon source |
| `assets/brand/favicon.svg`, `favicon.ico`, `favicon-16/32/48.png` | Browser tabs |
| `assets/brand/apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png` | iOS / PWA |
| `assets/site.webmanifest` | Web app manifest (at `assets/` root so Vite rebases it correctly) |
| `maithresh-mark-lattice.svg` | Full-colour master on substrate, ≥ 120 px |
| `maithresh-mark-lattice-transparent.svg` | Master without substrate, for light backgrounds and exports |
| `maithresh-mark-compact.svg` | Small-size cut, 16–48 px (no lattice) |
| `favicon-master.svg` | Hand-tuned 256 grid favicon source |
| `maithresh-mark-horizontal.svg` | Symbol + wordmark, side by side |
| `maithresh-mark-stacked.svg` | Symbol above wordmark |
| `previews/*.png` | Rendered references |

## 5. Rules

- **Clear space:** at least one pitch (`40` units, ~8% of canvas) on all sides.
- **Minimum sizes:** full lattice ≥ 120 px; below that use the compact cut. The 9 × 7 lattice stops resolving around 64 px.
- **Backgrounds:** full colour requires `#07090e`. Otherwise use mono, black or white.
- **No effects:** never add glow, shadow or gradients — the lattice is the texture.
- **Dynamic use:** cells may be re-lit from live contribution data, but keep the 19-cell m silhouette and the three endpoint colours.
- **Lockups:** wordmark is live `<text>` in JetBrains Mono 700 with `.sh` in `#38bdf8`. **Convert to outlines before production use.** The symbol files have no font dependency.

## 6. Implementation

The nav already imports the production mark:

```jsx
import brandMark from '../../assets/brand/maithresh-mark.svg?url'
<img className="brand-mark" src={brandMark} alt="" aria-hidden="true" width="20" height="20" />
```

`vite.config.js` copies `assets/` into `dist/assets/`, so no `public/` folder is used.

**Manifest paths must stay relative to the manifest URL** (`./brand/icon-192.png`, `start_url: "../"`). The site deploys at both `/` (Cloudflare Pages) and `/maithresh.sh/` (GitHub Pages via `VITE_BASE`); Vite rebases HTML asset URLs but does not rewrite JSON, so root-absolute paths would 404 on the subpath. `tests/verify.js` guards this.

## 7. Open items

- Trademark clearance — not checked; run a search before commercial use.
- Outline the lockup wordmarks before print or embedded use.
