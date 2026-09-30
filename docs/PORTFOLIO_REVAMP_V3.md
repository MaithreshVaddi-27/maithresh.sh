# maithresh.sh — Senior Design + Frontend Revamp Tracker (V3)

> Design leads: **apple-design** (fluid motion, restraint, craft) + **ui-ux-pro-max**
> (Dark OLED + JetBrains Mono + minimal glow + visible focus — skill dataset confirms
> current direction, no reskin). Hybrid voice: terminal eyebrows, human sentences.
> Source of truth: local-only portfolio reference (untracked, not in git). Numbers policy: inventory counts always
> **N+** on public surfaces; architecture specs stay exact. Prior trackers
> (`PORTFOLIO_REVAMP.md`, `PORTFOLIO_REVAMP_V2.md`) are history.

## Status legend
- [ ] TODO · [~] IN PROGRESS · [x] DONE

## What to do (Phase 0 audit → scoped list)
- [x] Content truth re-check vs the portfolio source doc (no inflated metrics anywhere)
- [x] Humanized professional voice pass (hybrid, engineer-not-generic, attractor-friendly)
- [x] Ultra-premium detailing: full palette-token audit of `styles.css`
- [x] Contribution workflow check (refresh Action + snapshot evidence)
- [x] README + docs refactor, professional folder structure
- [x] Verify / lint / build green

## What has been done
- **Phase 1 — content:** HUD `TARGET //` → `PROFILE //` (hostile → human);
  workbench sub drops `staff-level` (title claim a 2027 undergrad can't defend —
  conflicts with the page's own no-inflation ethos); automation statuses normalized
  to one vocabulary (`live ↗` / `live` / `rpa`). Everything else already truth-clean.
- **Phase 2 — detailing:** 34 unique hexes audited — all palette tokens or documented
  exceptions (print grays/teal ramp, reduced-transparency solid fallbacks, button-ink
  contrast pairings). No strays, no changes needed.
- **Phase 3 — contribution workflow:** verified by production evidence, not just reading
  the YAML — the Action ran and committed `da341bd` (`fetchedAt 2026-09-30`, 325 total).
  Weekly cron + manual dispatch + commit-only-on-change all confirmed working. No fix needed.
- **Phase 4 — docs/structure:** new `docs/README.md` index; README run-block gains
  `refresh:contrib`; folder structure already professional (dead dirs removed last round,
  scratch properly gitignored) — no further pruning.

## What should be done (open, none blocking)
1. Portfolio source-doc §Open items (source-count dispute, SkillMap geo-filter, NxtWave
   dates, omniroute, TrustRAG counts) — documentation-side, unchanged.
2. Fresh Chromium device-width sweep after the Breakout evolution (no browser tooling in
   this environment; last full pass recorded in `PORTFOLIO_REVAMP.md` Phase 4).
3. Real-device pass (iOS Safari / Android Chrome) + contrast-meter check of dimmest labels.

## Status
- `verify` ✅ · `lint` ✅ · `build` ✅ (this round — run in Phase 5)
- Skills applied: apple-design, ui-ux-pro-max (dataset-grounded design-system check)
- Uncommitted — awaiting push approval.

## Appendix — history folded in from retired trackers (V1 + V2 deleted this round)
- **Revamp Phases 0–3 (2026-09-29):** content rewritten to engineering register
  (architecture → constraint → limitation; no invented metrics; `5 APIs + scraper`;
  CrimeSleuth-trained vs SignatureSense-integrated distinction); ultra-premium detailing
  (translucent materials, focus rings, 44px targets, reduced-motion/transparency/contrast,
  skip link, print stylesheet, 68ch measure); hybrid polish (30s scan order, plain-English
  console, expanded print).
- **Phase 4 (browser pass):** preloader TDZ crash, preloader outside error boundary, dead
  workbench outcome branch, reduced-motion invisibility, missing phone wordmark, unreadable
  print, sub-24px touch targets, starved project tags, flex-wrap defense box, inverted hero
  hierarchy, oversized section heads, false hover affordances, 320px nowrap overflow — all fixed.
- **V2 origin fix:** retired `github.io` URLs in head meta → `pages.dev` (was failing verify).
- **Manual audit (5 bugs):** workbench default tab → `trustrag`; `.chip` pointer removed;
  duplicate CSS comment collapsed; dead print selector removed; write-only session cache removed.
- **N+ policy:** inventory counts always N+ publicly; architecture specs stay exact.
- **Breakout evolution:** EATEN ticker, power-brick eruption (amber at the time, cyan since
  Phase 9), coverage steering, strike index-mismatch fix, EATEN-stuck-at-0 fix (flat-index mapping).

## Phase 9 — Breakout restyle: cyan-monochrome graph (2026-09-30) [x] DONE
Mandate: Breakout-preview look, dark theme, **only cyan shades**.
- Peak tier amber → pale cyan `#e0f2fe` (brightest ramp point, never a second hue);
  legend swatch + strike eruption follow.
- Caption readout green → `var(--accent-bright)`; empty-cell strokes white → faint cyan.
- Month/day labels (previously no fill rule — browser-dependent) now deterministic
  dim-cyan tint, hierarchy preserved.
- Breakout ball trail: 3 fading cyan echoes from a 12-point history, transform-only
  (cx/cy), no glow filters (frame-cost discipline), full teardown with the loop.
- Untouched on purpose: telemetry colors elsewhere (verify gate requires them),
  snapshot-first paint, tooltips, counts, reduced-motion.
- Checks: `verify` ✅ · `lint` ✅ · `build` ✅. Uncommitted — awaiting push approval.

## Phase 10 — Cleanup: trackers, dead code, manual full re-check (2026-09-30) [x] DONE
- Deleted `docs/PORTFOLIO_REVAMP.md` + `docs/PORTFOLIO_REVAMP_V2.md` (history folded into
  the V3 appendix); `docs/` is now index + source of truth + deploy guide + current tracker.
- Dead code removed: unused `shieldHex` icon entry; stale `` `solid` `` clause in the Icon
  weight comment (no such prop exists). Verified every icon name resolves; no commented-out
  code anywhere; all exports/hooks/assets/workflows live (oxlint confirms no unused vars).
- Stale graph comment fixed (`in amber` → `in pale cyan`).
- Manual re-check (no scripts): strike-index mapping re-traced on paper; remaining
  amber/green usages all belong to non-graph systems (gate-required); subs/meta/OG copy
  re-read; workflow YAMLs re-read (refresh Action already hardened with rebase+timeout).

## Phase 11 — Breakout shatter polish from live screenshot (2026-09-30) [x] DONE
Screenshot showed ticker climbing (120/325), true plate counts, pale peaks — the missing
Breakout-preview feel was brick-break particles. Added 5 cyan shards per strike on fixed
golden-angle bearings (seeded by cell order, deterministic, no RNG), flying out + fading
inside one strike dwell via per-spark `--dx/--dy` custom properties. No glow filters on
shards (frame-cost discipline); reduced-motion safe (strikes never fire without the loop).
- Checks: `verify` ✅ · `lint` ✅ · `build` ✅.
