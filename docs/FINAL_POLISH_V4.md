# maithresh.sh — Final Professional Polish Tracker (V4)

> Senior Designer + Senior Frontend pass. Design leads: **apple-design**
> (fluid motion, restraint, tactile response, translucent materials) +
> **ui-ux-pro-max** (a11y-first, touch targets, responsive discipline).
> Voice: hybrid — terminal eyebrows, human engineer-grade sentences.
> Numbers policy: inventory counts always **N+** publicly; architecture
> specs stay exact. Prior tracker (`PORTFOLIO_REVAMP_V3.md`) is history —
> its stale status lines were corrected in this round (see Phase 1).

## Status legend
- [ ] TODO · [~] IN PROGRESS · [x] DONE

## What to do
- [x] Phase 0 — deep manual audit: content truth, design system, a11y, workflows, folder hygiene
- [x] Phase 1 — ultra-premium detailing fixes (real bugs only, no reskin)
- [x] Phase 2 — README + docs refactor, professional folder structure check
- [x] Phase 3 — contribution workflow verification (evidence, not YAML-reading)
- [x] Phase 4 — verify / lint / build green, commit, push

## What has been done

- **Phase 0 — audit (2026-09-30, by hand, no scripts):**
  - Content re-read end to end (`content.jsx`, `workbench.jsx`, `About`, `Sections`,
    head meta/OG). Voice is already hybrid engineer-grade: constraints-first
    defenses, stated limitations (CareerOS-Pro in-memory limiter, MCP forced-tool-call
    gap), no inflated metrics. N+ counts consistent (`11+`/`13+` on telemetry bar,
    console, OG/Twitter, automation header). No rewrite needed.
  - Design system re-read (`styles.css` tokens, Apple spring curve, `:active scale(0.97)`,
    `backdrop-filter` hierarchy, reduced-motion/transparency/contrast fallbacks).
    Cyan-monochrome graph discipline intact; telemetry colors elsewhere are
    gate-required and untouched on purpose.
  - A11y re-traced: console `inert` + focus restore, overlay is `display:none` when
    closed (no hidden-focusable issue), pipeline card focusable with label, logo link
    named, single `<h1>`, no skipped levels. No change needed.
  - Folder hygiene: `git ls-files` confirms zero tracked junk (no `.DS_Store`,
    no `dist/`, no `node_modules`, no scratch dirs). Ignored-local items
    (`.DS_Store`, `dist/`, private `docs/Project_Portfolio.md`) correctly stay out
    of git. No pruning needed.
- **Phase 1 — fixes:**
  - `About.jsx` terminal double-prompt: input rows carried a literal `'$'`
    while the renderer also prefixes `<span className="t-prompt">$</span>` —
    printed `$ $ whoami --verbose`. Stripped the literal prefix from the four
    input rows (single prompt source; outputs untouched).
  - `PORTFOLIO_REVAMP_V3.md` staleness: two `Uncommitted — awaiting push approval`
    lines corrected (`main` in sync with `origin/main`), snapshot count updated
    (325 → 368 contributions as of 2026-09-30).
- **Phase 2 — docs:** this tracker created; `docs/README.md` index extended;
  root README tracker pointer moved V3 → V4. Structure already professional —
  no new folders, no renames.
- **Phase 3 — contribution workflow:** snapshot `fetchedAt 2026-09-30`, 368 entries
  (gate needs ≥350 ✅); weekly cron + manual dispatch + rebase + commit-only-on-change
  re-read in `refresh-contrib.yml` — hardened, no fix needed. Runtime upgrade path
  (live API over snapshot-first paint, 6s abort, AbortError guard) re-traced in
  `ContributionGraph.jsx` — correct.
- **Phase 4 — gates:** `verify` ✅ · `lint` ✅ · `build` ✅ (this round).

## What should be done (open, none blocking)
1. Fresh Chromium device-width sweep after the About-terminal fix (text-only change,
   layout-neutral — risk negligible; last full pass recorded in V3 appendix).
2. Real-device pass (iOS Safari / Android Chrome) + contrast-meter check of dimmest labels.
3. Keep N+ counts honest as inventory grows; architecture specs stay exact.

## Status
- `verify` ✅ · `lint` ✅ · `build` ✅ (this round)
- Skills applied: apple-design, ui-ux-pro-max
- Tree clean, `main` in sync with `origin/main` — pushed.

## Phase 19 — Screenshot triage: nav bleed, dead void, stuck EATEN (2026-09-30) [x] DONE
Live github.io screenshot showed three defects, all fixed with evidence:
- **Ghost text through the nav:** the dock relied on backdrop-blur over 0.72
  alpha, which no-filter compositing (or contrasty text behind) ghosts straight
  through. `header.is-scrolled .glass-dock` now solidifies to 0.94 alpha —
  legibility can never depend on backdrop-filter alone. Proven live: dock
  reports `rgba(9,13,22,0.94)` with `is-scrolled` set after scrolling.
- **Dead void above contact:** the sparse certifications→contact boundary wore
  the full 108+108 joint rhythm as empty black. Contact keeps full bottom
  measure; top tightened to 72px.
- **EATEN 0/325 was TWO stacked bugs, not timing:**
  1. A leftover `padY` reference (removed from its destructure during the
     viewBox rewrite) threw `ReferenceError` on EVERY breakout substep —
     hundreds of uncaught exceptions, loop dead on arrival. Lint/build can't
     see runtime throws; the CDP exception listener caught it.
  2. With the loop alive but scoreless, instrumentation showed strikes
     flashing (`hits: 1`) while EATEN never moved: the Phase 16 rewrite
     dropped the hit→eaten scoring effect (pacman feeds `eaten` directly, the
     beam only reports `hit`). Restored as a mode-gated idempotent effect.
  3. Bonus hardening while inside: beam now opens on the hottest day with
     hungry 1s/50% homing steering (sparse grids starved the old 4s/15%
     steering into minute-long dry spells), generous near-miss reach, order
     mapping corrected to the day-index scheme `flat` actually builds.
- **Checked:** `verify` ✅ · `lint` ✅ · root + subpath builds ✅, zero page
  errors, EATEN 285/325 after 14s of breakout on the exact `/maithresh.sh/`
  build GitHub Pages serves, screenshot showing strike ring + count plate +
  gradient beam + trail + consumed ghost trail rendering together.

## Phase 18 — Snapshot refreshes on every commit (2026-09-30) [x] DONE
Request: is the graph data fresh on every commit, or only weekly?
Answer was weekly-only — now every push refreshes, via GitHub Actions:
- `deploy-pages.yml` regenerates `contributions.json` right after `npm ci`
  (best-effort with `continue-on-error`: a down API can never fail the
  deploy — the build falls back to the committed snapshot) and commits the
  fresh file back after the artifact upload (commit-only-on-change +
  rebase, same hardened pattern as the cron job).
- Permissions `read` → `write`, documented inline; pushes made with
  `GITHUB_TOKEN` never trigger new runs, so the commit-back cannot self-loop.
- `refresh-contrib.yml` stays as the weekly backstop for stretches with no
  pushes; its header comment now says so instead of claiming redeploys.
- **Checked:** both workflow YAMLs parse, `verify` ✅ (gate only asserts the
  deploy workflow exists — untouched).

## Phase 13 — Contribution graph refactor: calm instrument, not arcade (2026-09-30) [x] DONE
Screenshot review verdict: the Breakout layer (probe beam, halo, trail, strike
rings, shards, EATEN ticker) was the toy-like signal, and its 60Hz rAF loop
with per-frame DOM writes + a `drop-shadow`-filtered beam + a full-card
React re-render per strike was the lag source. Removed as designer + engineer:
- **Designer:** graph is now a calm instrument. Peak tier re-tinted `#e0f2fe` →
  `#bae6fd` (pale ice that keeps its blue hue instead of reading white-gray);
  ramp deepened (`#0c4a6e` new L1) so mid-tones separate; legend is one
  continuous 5-stop Less→More strip instead of a detached gray "More" swatch.
  Stats read `total // active days // best day · date` — the trailing
  "0 day streak" punished an honest sparse calendar; best day is informative
  on every calendar. Caption drops the EATEN ticker. Kept: snapshot-first
  paint, live upgrade, CRT texture, boot reveal, native hover tooltips.
- **Engineer:** zero JS after mount besides the fetch — no rAF loop, no
  per-frame writes, no strike re-renders. Hover is one CSS rule
  (`brightness(1.4)` + brighter stroke, single element, no filter chains);
  cells use the default cursor (only the frame links to GitHub); the frame-link
  hover scale was dropped (per-hover repaint of a 368-node SVG for 0.4% scale).
  Dead CSS retired (beam/halo/trail/strike/shard/legend-hot rules); two stale
  comments corrected to match snapshot-first reality.
- **Checked:** `verify` ✅ · `lint` ✅ · `build` ✅, plus live Chromium
  screenshots of the production build (contact section scrolled into view):
  stats, continuous legend, calm grid, and contact links all render correctly.

## Phase 14 — Graph idle animation: ambient sheen sweep (2026-09-30) [x] DONE
Request: the calm graph needed motion. Deliberately not the old beam loop —
one translucent stripe drifts left→right every 8s (2.8s sweep, then rest, so
it reads as ambience rather than a loading state). Transform-only on a single
compositor layer: no layout, no filters, no JS. Gated by the `.boot` hook
(motion-safe only) plus a `prefers-reduced-motion` force-off.
- **Checked:** `verify` ✅ · `lint` ✅ · `build` ✅, plus CDP-driven Chromium
  probes against the production build — animation present and `running`,
  transform traverses (−577px → +526px across the sweep), and under emulated
  `prefers-reduced-motion` the sheen reports `display: none`.
- **Superseded by Phase 15** — the sheen was retired when the full Breakout
  beam returned; one continuous animation, not two competing ones.

## Phase 15 — Breakout beam restored, lag-free (2026-09-30) [x] DONE
Request: continuous snake/Breakout-preview-style animation on the graph.
Restored the probe beam (ricochet loop, strike rings, count plates, shards,
EATEN ticker) on top of the Phase 13 color system — with the lag causes
designed out rather than back in:
- Beam is a plain bright core + dim halo ring: **zero SVG filters** (the old
  `drop-shadow` repainting every frame was the biggest GPU cost).
- **Trail deleted** (3 fewer DOM writes per frame; beam + halo only).
- Strike state is the only React traffic, on strike change alone; the 60Hz
  loop otherwise touches only two `cx/cy` attributes, parked off-screen and
  on tab-hide via IntersectionObserver + visibility handler.
- Kept from the calm era: continuous 5-stop legend, best-day stat, deep-sea
  ramp, CSS hover, snapshot-first paint.
- **Checked:** `verify` ✅ · `lint` ✅ · `build` ✅, plus CDP-driven Chromium
  probes — beam present and moving (cx 560.3 → 579.0), EATEN ticking (23/325),
  and a screenshot showing the strike ring, count plate, beam, ticker, legend,
  and stats all rendering together.

## Phase 16 — Pac-Man eater + game select (2026-09-30) [x] DONE
Request: live continuous animation like the snake / pacman-contribution-graph
reference (Pac-Man pathfinds the grid eating dots, score ticks, course clears
and replays). Built as a native live loop, not a pre-rendered SVG:
- **ᗧ PAC-MAN (default):** an ice-cyan chomper (~7Hz mouth, eye, faces travel
  direction) runs a greedy nearest-neighbour tour of the active bricks,
  eating each one — strike flash + count plate + EATEN score, cell dims to
  empty. All bricks eaten → `COURSE CLEAR ↺ REPLAY` → course restores, loop
  replays. Non-destructive: the real history always comes back.
- **◉ BREAKOUT:** the Phase 15 ricochet beam, unchanged. Segmented switch
  under the stats resets score + hit state on change; both loops park
  off-screen, on tab-hide, and under reduced-motion (shared `computeBricks`
  helper, two DOM attributes per frame each, zero filters).
- Caught + fixed in verification: a TDZ white-screen (`setEaten` referenced
  in a hook call above its `const` — ErrorBoundary blanked the section in
  the live build while lint/build stayed green). State now declared before
  the game hooks consume it.
- **Checked:** `verify` ✅ · `lint` ✅ · `build` ✅, plus CDP-driven Chromium
  probes — pacman present and moving with EATEN 28/325, breakout switch tears
  the chomper down cleanly with the score reset to 0/325, and screenshots show
  the eaten trail, mode pills, ticker, and legend rendering together.

## Phase 17 — Both loops: alignment fix + attractiveness pass (2026-09-30) [x] DONE
Request: both game animations smoother and more attractive.
- **Real bug found — travelers were misaligned:** both loops simulated in
  rendered pixels but wrote positions as viewBox units, so on wide screens
  the beam/chomper drifted up to ~1.37× off the cells they were hitting
  (visible in screenshots: ring on the brick, beam far away). All motion math
  is now in viewBox units — resolution-independent, no scale factor, nothing
  to rebuild on resize. Proven live: pacman max-x inside the 770-unit viewBox
  while eating (25/325), beam likewise bounded.
- **Pac-Man:** eased turning (heading lerps, snaps straight when close so it
  can never orbit a brick), sprint legs (up to 2.5× across empty space),
  larger body with a dark rim for definition, 3-dot motion trail.
- **Breakout beam:** white-hot radial-gradient core (flat fill, still zero
  per-frame filters), 3-dot trail, same traversal pace in viewBox units.
- **Eaten cells** fall back to a ghost tint instead of vanishing, so the grid
  keeps its structure and the eaten path reads as a trail.
- **Checked:** `verify` ✅ · `lint` ✅ · `build` ✅, zero page errors, plus
  CDP screenshots of both modes showing rings, plates, trails, pills, ticker,
  and legend rendering together on the cells.

## Second pass — full-file detailing (2026-09-30, nothing skipped) [x] DONE
Every source file re-read individually (`Workbench`, `Projects` full 420 lines,
`ContributionGraph`, `CommandConsole`, `Hero`, `About`, `Sections`, `Stack`,
`Nav`, `TelemetryBar`, `Preloader`, `Icon`, `ErrorBoundary`, all 3 hooks,
`scene.js`, `content.jsx`, `workbench.jsx`, `App.jsx`, `main.jsx`, `index.html`,
`styles.css` token/keyframe sweep, both workflows, refresh script, deploy doc).
- `scene.js`: `pointerleave` moved from `window` to `document.documentElement`
  (the event never fires on `window` — the cursor spotlight could stick when
  the pointer exited to browser chrome). Teardown updated to match.
- `Stack.jsx`: chips toggle gains `aria-controls` + container id (same pattern
  as the MoreProjects toggle; `aria-expanded` alone names no controlled element).
- External links: `rel="noopener"` → `rel="noopener noreferrer"` (Projects rows,
  automation/group cards, contribution graph); mailto link drops the dead `rel`
  (no `target`, so the attribute did nothing).
- `index.html`: `color-scheme: dark` (dark scrollbars/form controls) +
  `og:image:alt` for link-preview accessibility.
- `sitemap.xml`: `lastmod` bumped to ship date.
- `README.md`: new Design language section (facts only — theme, type pairing,
  motion tokens, glass tiers, graph discipline, all verifiable in `styles.css`).
- Deliberately untouched: copy voice (already hybrid engineer-grade throughout),
  stylesheet keyframes/tokens (all wired, zero dead rules found), deploy doc
  (accurate, gate-checked), folder structure (`git ls-files` clean, scratch
  properly ignored).
