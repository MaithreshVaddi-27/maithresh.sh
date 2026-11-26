# maithresh.sh — Systems Monograph Portfolio

Engineering portfolio for **Maithresh Vaddi** (AI/ML Engineer, Agentic Systems Builder, Backend Developer).

Built with **React 19**, **Vite 8**, and the **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@formkit/auto-animate`, `lucide-react`) in the **Systems Monograph** visual system: Newsreader Variable optical serif headings, self-hosted Inter & JetBrains Mono, and Cobalt Blue accents (`#2563eb` / `#60a5fa`) on warm obsidian (`#0b0d11`).

## Branches

- `systems-monograph` — Current React 19 + Astryx Systems Monograph edition (verified light-payload bundle, Verified Monolith brand kit, WCAG AA contrast, ARD discovery).
- `cyber-terminal` — Archived v2 cyber-terminal portfolio snapshot (`main` parity).

## Quick Start

```bash
npm install
npm run dev                   # Local development server
npm run lint                  # Static analysis (oxlint src)
npm run build                 # Production build (dist/) + verification suite
npm run preview               # Preview built production output locally
npx astryx doctor --built dist
npm run refresh:contributions # Refresh bundled GitHub contribution snapshot
```

## Project Structure

```text
├── index.html                        # HTML shell with external CSS/JS, icons, ARD, SEO & JSON-LD
├── llms.txt                          # Agent-readable portfolio summary
├── robots.txt & sitemap.xml          # Crawler directives and canonical sitemap
├── _headers                          # Cloudflare Pages CSP (script-src 'self', object-src 'none'), COOP/CORP & caching
├── vite.config.js                    # Vite 8 chunking & static asset copy into dist/
├── .well-known/
│   └── ard.json                      # Agentic Resource Discovery (ARD) manifest
├── assets/
│   ├── brand/                        # Verified Monolith icons, favicons, PWA icons, brand kit
│   ├── illustrations/                # Hero terminal portrait SVG
│   ├── project-icons/                # System and archive SVG badges
│   ├── og-image.jpg                  # OpenGraph & Twitter share card (1200x630)
│   └── site.webmanifest              # PWA manifest
├── design-system/
│   ├── README.md                     # Systems Monograph v3.3 design specification
│   └── tokens.json                   # Design tokens (palette, typography, radii, motion)
├── docs/
│   ├── README.md                     # Documentation index
│   ├── SYSTEMS_AUDIT_AND_UPGRADES.md # Design, UX, performance, and accessibility audit report
│   └── free-deploy-options.md        # Cloudflare Pages & static deployment notes
├── scripts/
│   └── refresh-contributions.mjs     # CLI job to update src/data/contributions.json
├── src/
│   ├── app/                          # App.jsx (idle-prefetched per-section Suspense) & main.jsx
│   ├── components/
│   │   ├── common/                   # ErrorBoundary.jsx & SectionSkeleton.jsx
│   │   └── layout/                   # Navbar.jsx (IntersectionObserver spy, hover prefetch, StatusDot)
│   ├── data/                         # Verified projects, architecture simulation, stack & metrics
│   ├── features/
│   │   ├── architecture/             # ArchitectureWorkbench.jsx (View Transitions + StatusDot trace)
│   │   ├── background/               # BackgroundAndContact.jsx (Spinner sync, SVG heatmap, Link, Icon)
│   │   ├── hero/                     # HeroSection.jsx + SPEC // MV-2027 card
│   │   ├── stack/                    # StackMatrix.jsx
│   │   ├── systems/                  # FeaturedSystems.jsx (AutoAnimate filtering + external icons)
│   │   └── workflows/                # AutomationsAndTeam.jsx
│   ├── fonts/                        # Self-hosted Inter & JetBrains Mono WOFF2
│   ├── styles/
│   │   ├── tokens.css                # External head stylesheet: @font-face, tokens, obsidian ground
│   │   └── monograph.css             # External component, View Transition & scroll-driven motion rules
│   └── theme/
│       └── monographTheme.js         # Astryx defineTheme overrides (crisp motion + Cobalt tokens)
└── tests/
    └── verify.js                     # Automated structure, CSP, SEO, and dist/ verification gate
```

## Content & Inventory Policy

Public inventory counts are stated as **N+** (`11+` solo systems, `13+` automation workflows), while architectural specifications (`8-stage pipeline`, `two-stage dedup`, `3-agent crews`) reflect exact repository implementations.

## Deployment

- **Cloudflare Pages:** Build command `npm run build`, output directory `dist` (or direct CLI via `npm run deploy`). Security and immutable `/assets/*` headers are configured in [`_headers`](./_headers).
- **GitHub Pages:** Automated via [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) with `VITE_BASE=/maithresh.sh/`.

## License

Personal portfolio — code and content copyright Maithresh Vaddi.
