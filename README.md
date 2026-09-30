# maithresh.sh — Cyber-Terminal Portfolio

[![Live](https://img.shields.io/badge/live-maithresh--sh.pages.dev-38BDF8?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Lighthouse Perf](https://img.shields.io/badge/lighthouse--mobile-85-10B981?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Lighthouse A11y](https://img.shields.io/badge/a11y-100-10B981?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Checks](https://img.shields.io/badge/verify-passing-10B981?style=flat-square)](./tests/verify.js)

Personal portfolio for **Maithresh Vaddi** — AI/ML Engineer & Agentic Systems Builder.

Live canvas dot-matrix hero, CRT-treated contribution heatmap with boot reveal,
scroll-driven motion (GSAP ScrollTrigger + Lenis), and content pulled directly
from real, verified projects — no filler.

## Stack

- **React 19 + Vite 8**, plain JavaScript (no TypeScript)
- CSS is **linked from `index.html`**, not imported from JS — the browser gets
  it in the initial HTML instead of waiting on the module graph
- [GSAP](https://gsap.com/) + ScrollTrigger and [Lenis](https://lenis.darkroom.engineering/) — installed from npm, bundled into their own chunk, synced to a single rAF clock
- Canvas 2D dot-matrix engine (`src/scene.js`) — proximity illumination, DPR-aware, pauses off-screen
- Vite handles minification, content hashing and asset caching headers
- `npm run build` runs the build **and** the verification gate, so a regression fails the build rather than shipping

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/ (minified, hashed) + verification gate
npm run preview    # serve the real build
npm run lint
npm run refresh:contrib  # regenerate the contribution snapshot (also weekly via Actions)
```

## Project structure

```
├── index.html                 # <head> only — meta, JSON-LD, fonts. Body is a React root.
├── vite.config.js             # base reads VITE_BASE so Cloudflare (/) and GH Pages (/maithresh.sh/) both work
├── _headers                   # immutable edge caching for hashed /assets/* (copied into dist/ by the build)
├── robots.txt / sitemap.xml   # copied into dist/ by the build
├── .github/workflows/         # deploy-pages.yml — builds with VITE_BASE, uploads dist/
├── src/
│   ├── main.jsx               # mount (no CSS import — see the <link>)
│   ├── App.jsx                # page composition
│   ├── styles.css             # design system — the single stylesheet
│   ├── scene.js               # hero canvas engine (mount fn + teardown)
│   ├── components/            # one component per section (+ ErrorBoundary.jsx, CommandConsole, Icon)
│   ├── data/                  # content.jsx, workbench.jsx, contributions.json snapshot
│   └── hooks/                 # useMotion (reveals), useChrome (scroll/spy), useInstrumentCursor
├── tests/
│   └── verify.js              # build gate (node tests/verify.js) — runs inside npm run build
├── scripts-refresh-contrib.mjs # regenerates the contribution snapshot (npm run refresh:contrib)
├── docs/
│   ├── free-deploy-options.md # deployment walkthrough
│   └── FINAL_POLISH_V4.md     # phased tracker (todo/done/should/status + history)
└── assets/                    # og-image + hero portrait SVG (copied into dist/ by the build)
```

Content rules: portfolio inventory counts are always stated as **N+**
(`11+` systems, `13+` automation workflows) so the page can't go stale as
new work ships. Architecture specs (8-stage pipeline, two-stage dedup,
3-agent crews) stay exact — they describe the design, not the inventory.
Full policy: N+ for public inventory, exact architecture specs (tracker: `docs/FINAL_POLISH_V4.md`; history: `docs/PORTFOLIO_REVAMP_V3.md`).

## How the interactive pieces work

- **Workbench** — the four pipeline visualizers share one geometry and one
  `Pipeline` component; each pane declares only its copy, palette and the two
  outcomes it can land on. A simulation is `{ step, mode }` state, and every
  node/connector colour is *derived* from that state. Re-clicking clears the
  pending timeouts, which is the entire serialization story — a stale outcome
  can't land after a newer one.
- **Projects** — the sticky stage renders the same detail component as the row,
  with schematic marker ids namespaced per location. Rows keep the
  visually-hidden wrapper so project descriptions stay in the accessibility tree
  on desktop while still rendering inline under 900px.
- **⌘K console** — React state plus `inert` on the page landmarks, so the dialog
  is genuinely modal for screen readers rather than only keyboard-trapped.
- **Contribution graph** — third-party API data renders as JSX, so it becomes
  text nodes. No `innerHTML`, no escaping helper.

## Responsive behaviour

The layout is verified from **320px to 2560px** with no horizontal page scroll
at any width. Two cases needed explicit handling, and both are now asserted in
`tests/verify.js` so they can't silently regress:

- **Workbench tabs** wrap instead of scrolling. They were a horizontal
  scroller on phones with `scrollbar-width: none`, which showed 1.2 of 4 tabs
  with no way to know more existed — and the wrap rule that was supposed to
  prevent exactly that was gated to `min-width: 900px`, i.e. desktop only.
- **The pipeline diagram** is a 940-unit `viewBox`. It cannot fit a phone, so
  below 720px it pans inside its card with a 700px floor (without it the 13px
  node titles scaled to 7.2px and sub-labels to 5.3px) plus a right-edge fade,
  because macOS and iOS scrollbars stay invisible until you actually scroll.

## Resilience & accessibility

- A render error in any section shows a recoverable panel instead of a blank
  page — the nav, telemetry bar and footer stay live so a visitor can leave.
- axe-core reports **0 violations**; the command console is a real modal
  (`inert` on the background landmarks, focus trapped and restored), the
  workbench tablist is a proper roving-tabindex tablist, and project
  descriptions stay in the accessibility tree on desktop.
- Verified on the production build: **CLS 0**, FCP ~230ms, ~93 KB gzipped JS.

## Deploy (Cloudflare Pages)

Live at **https://maithresh-sh.pages.dev/**

- **Dashboard (git-integrated):** Workers & Pages → Pages → Connect to Git →
  this repo → branch `main`, framework preset **None**, build command
  `npm run build`, output directory **`dist`**. Every push to `main` deploys.
- **CLI (direct upload):**
  ```bash
  npm run build
  npx wrangler pages project create    # name: maithresh-sh
  npm run deploy                      # wrangler pages deploy dist
  ```
- Full walkthrough: [docs/free-deploy-options.md](docs/free-deploy-options.md)

Vite content-hashes everything it emits into `dist/assets/`, so `_headers` can
serve that directory `immutable` for a year — no manual `?v=` cache-busting
strings to remember.

## License

Personal portfolio — content and code © Maithresh Vaddi.
