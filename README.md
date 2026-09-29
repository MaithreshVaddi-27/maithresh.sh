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
```

## Project structure

```
├── index.html                 # <head> only — meta, JSON-LD, fonts. Body is a React root.
├── vite.config.js
├── _headers                   # immutable edge caching for hashed /assets/*
├── src/
│   ├── main.jsx               # mount
│   ├── App.jsx                # page composition
│   ├── styles.css             # design system — the single stylesheet
│   ├── scene.js               # hero canvas engine (mount fn + teardown)
│   ├── components/            # one component per section
│   ├── data/                  # repeated content + the workbench pane model
│   └── hooks/                 # motion, chrome, cursor
├── tests/
│   └── verify.js              # build gate (node tests/verify.js)
├── docs/
│   └── free-deploy-options.md # deployment walkthrough
└── assets/                    # og-image + hero portrait SVG
```

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
