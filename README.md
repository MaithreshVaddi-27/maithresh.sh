# ~/maithresh — Systems Monograph Portfolio

Engineering portfolio for **Maithresh Vaddi** (AI/ML Engineer, Agentic Systems Builder, Backend Developer) — live target at **[`https://maithresh.pages.dev/`](https://maithresh.pages.dev/)**.

Built with **React 19**, **Vite 8**, and the **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@formkit/auto-animate`, `lucide-react`) in the **Systems Monograph** visual system: Newsreader Variable optical serif headings, self-hosted Inter & JetBrains Mono, and Cobalt Blue accents (`#2563eb` / `#60a5fa`) on warm obsidian (`#0b0d11`).

## Highlights

- **Hero & Specimen (`HeroSection.jsx`):** Asymmetric editorial hero paired with `SPEC // MV-2027` hardware-spec profile card and Verified Monolith SVG mark.
- **Featured AI & Agentic Systems (`FeaturedSystems.jsx`):** Six deep-dive systems (`TrustRAG`, `CareerOS-Pro`, `ApplyOS`, `Agentic DocuChat`, `Resume Crew`, `MCP Agents Suite`) plus an 8-item Extended Systems Archive with `@formkit/auto-animate` category filtering.
- **Interactive Architecture Workbench (`ArchitectureWorkbench.jsx`):** 4-tab execution simulator (`TrustRAG`, `CareerOS-Pro`, `ApplyOS`, `Agentic DocuChat`) with progressive `document.startViewTransition`, animated SVG signal conduit, and stage-by-stage nominal/recovery trace.
- **Workflow Automations & Scoped Team ML (`AutomationsAndTeam.jsx`):** Production webhook pipelines across n8n, Make.com, and RPA alongside team systems (`CrimeSleuth`, `SignatureSense`).
- **Engineering Stack Matrix (`StackMatrix.jsx`):** Four-domain tooling breakdown (`llm.sh`, `automation.sh`, `backend.sh`, `cloud.sh`) with transparent self-audit notes.
- **GitHub Contribution Telemetry & Contact (`BackgroundAndContact.jsx`):** Redesigned telemetry dashboard with Astryx `SegmentedControl` view switcher (`12M Matrix`, `90D Zoom`, `Monthly`), dynamic KPI strip (total, active days, longest streak, peak day), month/weekday axes, interactive cell/bar inspector, legend intensity spotlight, scroll-triggered SVG column cascades, and instant offline-safe baseline + live API refresh.
- **Discovery & Security:** Machine-readable `/llms.txt` and `/.well-known/ard.json` (ARD manifest), JSON-LD `Person` schema, `robots.txt` + `sitemap.xml`, and Cloudflare `_headers` (`script-src 'self'`, `object-src 'none'`, COOP/CORP, immutable `/assets/*` caching).

## Branches

- `systems-monograph` — Active React 19 + Astryx Systems Monograph edition.
- `cyber-terminal` — Archived v2 cyber-terminal snapshot (`main` parity).

## Quick Start

```bash
npm install
npm run dev                   # Local development server
npm run lint                  # Static analysis (oxlint src)
npm run build                 # Production build (dist/) + verification suite
npm run deploy:check          # Lint + production build + Astryx doctor gate
npm run deploy                # Preflight check + deploy dist/ via Wrangler
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
├── .node-version                     # Pins Node >= 22.13.0 for Cloudflare/Vercel/Netlify CI
├── wrangler.toml                     # Cloudflare Pages config (name = "maithresh", dist/)
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
│   ├── README.md                     # Systems Monograph v3.4 design specification
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
│   │   └── layout/                   # Navbar.jsx (scroll spy, hover prefetch, ~/maithresh brand)
│   ├── data/                         # Verified projects, architecture simulation, stack, contributions
│   ├── features/
│   │   ├── architecture/             # ArchitectureWorkbench.jsx (View Transitions + StatusDot trace)
│   │   ├── background/               # BackgroundAndContact.jsx (Telemetry heatmap, monthly bars, inspector)
│   │   ├── hero/                     # HeroSection.jsx + SPEC // MV-2027 card
│   │   ├── stack/                    # StackMatrix.jsx
│   │   ├── systems/                  # FeaturedSystems.jsx (AutoAnimate filtering + external icons)
│   │   └── workflows/                # AutomationsAndTeam.jsx
│   ├── fonts/                        # Self-hosted Inter & JetBrains Mono WOFF2
│   ├── styles/
│   │   ├── tokens.css                # External head stylesheet: @font-face, tokens, obsidian ground
│   │   └── monograph.css             # External component, telemetry & scroll-driven motion rules
│   ├── theme/
│   │   └── monographTheme.js         # Astryx defineTheme overrides (crisp motion + Cobalt tokens)
│   └── utils/                        # sectionLoaders.js, viewTransition.js, contribStats.js
└── tests/
    └── verify.js                     # Automated structure, CSP, SEO, and dist/ verification gate
```

## Content & Inventory Policy

Public inventory counts are stated as **N+** (`13+` solo AI/agentic systems, `13+` automation workflows), while architectural specifications (`8-stage pipeline`, `url_hash + content_hash dedup`, `3-agent crews`) reflect exact repository implementations.

## Deployment

- **Cloudflare Pages (Recommended):** Project name `maithresh` (`https://maithresh.pages.dev/`), production branch `systems-monograph`, build command `npm run deploy:check`, output directory `dist` (or CLI via `npm run deploy`). Security and immutable `/assets/*` headers are configured in [`_headers`](./_headers).
- **GitHub Pages:** Automated via [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) with `VITE_BASE=/maithresh.sh/`.

## License

Personal portfolio — code and content copyright Maithresh Vaddi.
