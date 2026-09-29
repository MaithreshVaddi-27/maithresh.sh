# maithresh.sh — Cyber-Terminal Portfolio

[![Live](https://img.shields.io/badge/live-maithresh--sh.pages.dev-38BDF8?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Lighthouse Perf](https://img.shields.io/badge/lighthouse--mobile-85-10B981?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Lighthouse A11y](https://img.shields.io/badge/a11y-100-10B981?style=flat-square)](https://maithresh-sh.pages.dev/)
[![Checks](https://img.shields.io/badge/verify-33%2F33-10B981?style=flat-square)](./tests/verify-redesign.js)

Personal portfolio for **Maithresh Vaddi** — AI/ML Engineer & Agentic Systems Builder.

Live canvas dot-matrix hero, CRT-treated contribution heatmap with boot reveal,
scroll-driven motion (GSAP ScrollTrigger + Lenis), and content pulled directly
from real, verified projects — no filler.

## Stack

- Vanilla HTML/CSS/JS — no build step, no bundler
- Canvas 2D dot-matrix engine (`js/scene.js`) — proximity illumination, DPR-aware, pauses off-screen
- [GSAP](https://gsap.com/) + ScrollTrigger (SRI-pinned) — scroll-linked animation
- [Lenis](https://lenis.darkroom.engineering/) (SRI-pinned) — smooth scroll, synced to GSAP's ticker
- Ship artifacts are minified (`clean-css-cli`, `terser`); sources stay readable

## Run locally

Serve over HTTP (ES modules + live API fetch need it — `file://` won't work):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
├── index.html
├── robots.txt
├── sitemap.xml
├── _headers                  # immutable edge caching (honored by Cloudflare Pages)
├── css/
│   ├── style.css             # source of truth — edit this
│   └── style.min.css         # ship artifact — regenerate, never hand-edit
├── js/
│   ├── main.js / scene.js    # sources
│   ├── main.min.js / scene.min.js  # ship artifacts
├── tests/
│   └── verify-redesign.js    # 33-check quality gate (node tests/verify-redesign.js)
├── docs/
│   └── free-deploy-options.md # deployment walkthrough (Cloudflare Pages + fallbacks)
└── assets/
    ├── og-image.jpg
    └── svg/       # hero portrait render — filename carries a content hash (see below)
```

## Cache-busting (read this before every deploy)

Deploys serve the `.min` files with a `?v=YYYYMMDD-n` query string
(current: `?v=20260926-5`). After editing any source, regenerate + bump:

```bash
npm run build   # minifies CSS + JS, then runs the 33-check verify gate
# then bump ?v= in index.html (css + both js) and commit
```

The hero portrait SVG under `assets/svg/` carries its hash directly in the
filename (`maithresh-terminal-portrait.<hash>.svg`). Editing its *content*
without renaming means the CDN edge keeps serving old bytes.

## Deploy (Cloudflare Pages)

Live at **https://maithresh-sh.pages.dev/** (static site — `npm run build`
just regenerates the minified artifacts and runs the verify gate).

- **Dashboard (git-integrated):** Workers & Pages → Create application →
  Pages tab → Connect to Git → pick this repo → Production branch `main`,
  Framework preset None, Build command `npm run build`, Build output
  directory `/`. Every push to `main` auto-deploys; other branches get
  preview URLs.
- **CLI (Direct Upload):**
  ```bash
  npm run build                        # refresh .min artifacts + verify gate
  npx wrangler login
  npx wrangler pages project create    # name: maithresh-sh, branch: main
  npx wrangler pages deploy .
  ```
- Full walkthrough, custom-domain, and caching details:
  [docs/free-deploy-options.md](docs/free-deploy-options.md#1-cloudflare-pages--recommended).

## License

Personal portfolio — content and code © Maithresh Vaddi.
