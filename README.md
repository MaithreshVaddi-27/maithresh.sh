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
- Type is **self-hosted** (`src/fonts/`, latin-subset woff2 via `@font-face`) —
  first paint makes zero third-party font requests and works fully offline
- [GSAP](https://gsap.com/) + ScrollTrigger and [Lenis](https://lenis.darkroom.engineering/) — installed from npm, bundled into their own chunk, synced to a single rAF clock (Lenis skips touch pointers, where native momentum owns scroll)
- Below-fold heavyweights split after first paint — `Workbench`,
  `Projects`, and the graph's arcade loops (`ArcadeActors`) load as async
  chunks behind `Suspense`; the reveal scanner is re-runnable and idempotent
  so late mounts animate without replaying what's played
- Canvas 2D dot-matrix engine (`src/scene.js`) — proximity illumination, DPR-aware (capped on phones), pauses off-screen; static frame under reduced-motion or Data Saver
- Vite handles minification, content hashing and asset caching headers
- `npm run build` runs the build **and** the verification gate, so a regression fails the build rather than shipping

## Run locally

```bash
npm install
npm run build      # → dist/ (minified, hashed) + verification gate
npm run dev        # http://localhost:5173
npm run lint       # oxlint
npm run preview    # serve the real build
npm run refresh:contrib  # regenerate the contribution snapshot (also weekly via Actions)
npm run verify     # standalone build gate (also runs inside build)
```

## Project structure

```
├── index.html                 # <head> only — meta, JSON-LD, no render-blocking font CSS (type is self-hosted)
├── vite.config.js             # base reads VITE_BASE so Cloudflare (/) and GH Pages (/maithresh.sh/) both work
├── _headers                   # immutable edge caching for hashed /assets/* (copied into dist/ by the build)
├── robots.txt / sitemap.xml   # copied into dist/ by the build
├── .github/workflows/         # deploy-pages.yml (subpath build + snapshot commit-back) + refresh-contrib.yml (weekly backstop)
├── src/
│   ├── main.jsx               # mount (no CSS import — see the <link>)
│   ├── App.jsx                # page composition + lazy chunk wiring (Workbench, Projects)
│   ├── styles.css             # design system — the single stylesheet (+ @font-face)
│   ├── scene.js               # hero canvas engine (mount fn + teardown)
│   ├── fonts/                 # self-hosted JetBrains Mono + Inter latin woff2 (Vite-hashed)
│   ├── components/            # one component per section (+ ErrorBoundary.jsx, CommandConsole, Icon)
│   │                          # ArcadeActors.jsx (async game loops) + contribGeometry.js (shared grid math)
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
Full policy: N+ for public inventory, exact architecture specs (tracker: `docs/FINAL_POLISH_V4.md`; superseded trackers live in git history, not on disk).

## How the interactive pieces work

- **Workbench** — the four pipeline visualizers share one geometry and one
  `Pipeline` component; each pane declares only its copy, palette and the two
  outcomes it can land on. A simulation is `{ step, mode }` state, and every
  node/connector colour is *derived* from that state. Lit-but-unsettled
  connectors march dashes while data is in flight and go solid on settle.
  Re-clicking clears the pending timeouts, which is the entire serialization
  story — a stale outcome can't land after a newer one.
- **Projects** — tab navbar (one pill per system, roving tabindex) selecting a
  full-width case-study panel: schematic beside prose on desktop, stacked on
  mobile. Tabs preview in place; the repository exit lives explicitly as a CTA
  in the panel body. Panel crossfades on swap; schematic connectors draw
  themselves in on selection.
- **⌘K console** — React state plus `inert` on the page landmarks, so the dialog
  is genuinely modal for screen readers rather than only keyboard-trapped.
  Enter and exit travel the same path (exit slightly faster); reopening
  mid-exit cancels cleanly.
- **Contribution graph** — third-party API data renders as JSX, so it becomes
  text nodes. No `innerHTML`, no escaping helper. Snapshot paints first; the
  live feed only upgrades it (6s abort, Data-Saver skip). Pac-Man + Breakout
  loops live in an async chunk and park off-screen, on tab-hide, and under
  reduced-motion.

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
- Verified on the production build: **CLS 0**, initial JS ~300KB (~95KB gz
  + ~49KB motion vendor, async chunks after paint), self-hosted type,
  zero third-party requests on first paint.

## Design language

- **Theme: Flight Telemetry** — mission-control instrument panel, not a generic
  dark portfolio. Red/amber/green stay reserved as semantic status; the brand
  voice is desaturated instrument blue with an ice-cyan accent (`#38bdf8`).
- **Type:** JetBrains Mono for display, chrome and terminal body; Inter for
  long-form prose (mono optimizes for scanning, not reading paragraphs).
- **Motion:** Apple fluid-interface tokens — response-based springs
  (`cubic-bezier(0.16, 1, 0.3, 1)`), `:active scale(0.97)` tactile response,
  one cursor spotlight shared by the shell and all cards, transform/opacity-only
  animation, full `prefers-reduced-motion` fallbacks.
- **Materials:** three-tier Liquid Glass elevation (translucent rim, no flat
  borders on glass surfaces) with solid fallbacks under
  `prefers-reduced-transparency`.
- **Graph discipline:** the contribution heatmap speaks only the ice-cyan ramp
  (peak tier is pale cyan, never a second hue); telemetry colors elsewhere are
  required by the verification gate and stay put.

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
