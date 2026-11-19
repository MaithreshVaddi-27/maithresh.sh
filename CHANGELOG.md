# Changelog

All notable changes to `maithresh.sh` are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Consolidated design assets into `assets/brand/`; removed rejected logo concepts and generated previews from version control.
- Replaced the nav's decorative dot and the inline circle favicon with the Contribution Mosaic brand mark.

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

[Unreleased]: https://github.com/MaithreshVaddi-27/maithresh.sh/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/MaithreshVaddi-27/maithresh.sh/releases/tag/v2.0.0
