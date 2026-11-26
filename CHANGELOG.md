# Changelog

All notable changes to `maithresh.sh` are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] — 2026-11-27

### Added

- **Design system:** Migrated to the **Astryx Design System** (`@astryxdesign/core`, `@astryxdesign/theme-neutral`) and the **Systems Monograph** direction (Newsreader Variable serif headings, self-hosted Inter & JetBrains Mono, `#0b0d11` Obsidian ground, `#f4f2ed` Bone Ink, and WCAG AA Cobalt `#2563eb` / `#60a5fa`).
- **Brand kit:** Introduced Concept A (**Verified Monolith**) symbol, small-size favicon cut, and outlined lockups in `assets/brand/maithresh-mark-kit/`, plus matching OpenGraph social card (`assets/og-image.jpg`).
- **Loading & micro-interactions:** Added per-section `<Suspense>` boundaries with Astryx `<Skeleton>` fallbacks, idle + hover chunk prefetching, `<StatusDot>` and `<Spinner>` telemetry states, `@formkit/auto-animate` archive filtering, and reduced-motion-safe `document.startViewTransition` tab switching.
- **Discovery & deploy config:** Added `/llms.txt`, `/.well-known/ard.json` (ARD manifest), external `<link>` discovery headers, strict CSP (`script-src 'self'`, `object-src 'none'`, COOP/CORP in `_headers`), and `wrangler.toml`.

### Changed

- Reordered page sections for recruiter-first scanning (`Hero -> Featured Systems -> Architecture Workbench -> Workflows & Team ML -> Stack Matrix -> Education & Contact`).
- Harmonized hero terminal portrait SVG (`assets/illustrations/terminal-portrait.svg`) and all 14 `assets/project-icons/*.svg` assets to the Systems Monograph Cobalt & Bone palette.
- Converted GitHub contribution heatmap to an accessible single `<svg>` matrix with progressive live refresh, and removed `gsap`, `lenis`, and `@astryxdesign/theme-gothic`.

## [2.0.0] — 2026-11-19

### Added

- **Brand:** Contribution Mosaic logo system — parametric lattice master, transparent and compact cuts, horizontal/stacked lockups, favicon and PWA icon set, and a usage guide in `assets/brand/maithresh-mark-kit/`.
- **Deploy:** base-relative webmanifest paths, verified against both Cloudflare Pages root and the GitHub Pages `/maithresh.sh/` subpath.

### Changed

- **Architecture:** React 19 + Vite 8 SPA with GSAP/Lenis motion, modular section components, and an externalized stylesheet.
- **Design system:** cyber-terminal substrate with three accent colours (cyan, green, amber); violet and purple retired.
- **Accessibility:** labelled logo link, keyboard-reachable scroll regions, reduced-motion and high-contrast fallbacks.

### Fixed

- Webmanifest icon paths no longer 404 on the GitHub Pages subpath.

[Unreleased]: https://github.com/MaithreshVaddi-27/maithresh.sh/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/MaithreshVaddi-27/maithresh.sh/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/MaithreshVaddi-27/maithresh.sh/releases/tag/v2.0.0
