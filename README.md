# maithresh.sh — Systems Monograph Portfolio

Personal portfolio for **Maithresh Vaddi** — AI/ML Engineer, Agentic Systems Builder, and Backend Developer.

Built with **React 19**, **Vite 8**, and the **Astryx Design System**, styled in the **Systems Monograph** direction (Newsreader Variable optical serif, Inter body, JetBrains Mono specs, and a Cobalt Blue palette on warm obsidian).

## Run locally

```bash
npm install
npm run dev        # local dev server
npm run build      # vite build + node tests/verify.js gate
npm run preview    # serve production dist/
npm run lint       # oxlint src
npx astryx doctor --built dist
```

## Architecture

```
├── index.html                  # SEO meta, OpenGraph, JSON-LD Person schema
├── vite.config.js              # Vite 8 build + static asset copy + chunking
├── design-system/
│   ├── README.md               # Systems Monograph v3.0 specification
│   └── tokens.json             # Machine-readable design tokens
├── src/
│   ├── app/                    # App.jsx (Astryx Theme root) & main.jsx
│   ├── theme/                  # monographTheme.js (Astryx defineTheme)
│   ├── styles/                 # monograph.css (grid, motion, browser surfaces)
│   ├── components/
│   │   ├── layout/             # Navbar.jsx (IntersectionObserver spy + progress)
│   │   └── common/             # ErrorBoundary.jsx
│   ├── features/
│   │   ├── hero/               # HeroSection.jsx + SPEC // MV-2027 card
│   │   ├── architecture/       # ArchitectureWorkbench.jsx (interactive trace)
│   │   ├── systems/            # FeaturedSystems.jsx (SYS-01..05 + filterable archive)
│   │   ├── stack/              # StackMatrix.jsx
│   │   ├── workflows/          # AutomationsAndTeam.jsx
│   │   └── background/         # BackgroundAndContact.jsx (education, heatmap, links)
│   ├── data/                   # Verified project, stack, workflow, and contribution data
│   └── fonts/                  # Self-hosted Inter & JetBrains Mono WOFF2
└── tests/
    └── verify.js               # Automated structure, SEO, a11y, and asset gate
```

## Content & Inventory Policy

Public inventory counts are stated as **N+** (`11+` solo systems, `13+` automation workflows), while architectural specifications (`8-stage pipeline`, `two-stage dedup`, `3-agent crews`) reflect exact repository implementations.

## Deployment (Cloudflare Pages)

Build command: `npm run build` · Output directory: `dist` · Direct CLI: `npm run deploy`.

## License

Personal portfolio — content and code © Maithresh Vaddi.
