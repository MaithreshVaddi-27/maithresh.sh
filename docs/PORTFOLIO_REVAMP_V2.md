# maithresh.sh — Professional Content + Ultra-Premium Detailing Tracker (V2)

> Design leads: **apple-design** (fluid motion, restraint, craft) + **ui-ux-pro-max** (accessibility, hierarchy).
> Strategy: **hybrid** — keep cyber-terminal soul (differentiator), every line recruiter-readable in 30s and engineer-defensible in interview.
> Source of truth: `docs/Project_Portfolio.md`. Numbers policy: only numbers present there may appear on site.
> Prior tracker: `docs/PORTFOLIO_REVAMP.md` (Phases 0–4, complete 2026-09-29). This file tracks V2 continuation.

## Status legend
- [ ] TODO · [~] IN PROGRESS · [x] DONE

## Phase 1 — Professional humanized rewrite (per Project_Portfolio.md) [x] DONE (carried over, verified live)
- [x] `src/data/content.jsx` PROJECTS: 5 flagships in engineering register — architecture → constraint → limitation. No invented metrics (no 6.8s→1.9s, no −62% latency, no 74% dedup).
- [x] CareerOS tag: `5 APIs + scraper`, never `10`. SkillMap: `live job search`, never `India-filtered` (Portfolio.md marks it UNCONFIRMED).
- [x] TrustRAG test counts / k6 p95 deliberately absent (Portfolio.md: predate local-first, do not quote).
- [x] `omniroute` never described anywhere (Portfolio.md open question).
- [x] CrimeSleuth (trained 14-class `.pth`) vs SignatureSense (integrated pre-trained `.h5`) distinction explicit.
- [x] Hero STATS `8-stage / 5 + 1 / 13+`; About "constraints before code" + honest Redis gap; CERTS include NxtWave GenAI/MCP, Outskill, LeetCode SQL-26.
- [x] index.html meta/OG/Twitter/JSON-LD in recruiter-plain voice, SERP ≤160 chars.

## Phase 2 — Ultra-premium detailing (apple-design + ui-ux-pro-max) [x] DONE (carried over, verified live)
- [x] One memorable element only: hero viewfinder/HUD. Everything else quiet.
- [x] Translucent `backdrop-filter` materials, `:focus-visible` rings, 44px targets, `prefers-reduced-motion/transparency/contrast`, skip link, print stylesheet.
- [x] Typography: 68ch measure + `text-wrap: pretty`; display uses `balance`.
- [x] Motion answers action only (false hover affordance on `.auto-item`/`.more-item` removed).

## Phase 3 — Recruiter-friendly hybrid polish [x] DONE (carried over)
- [x] Above fold: name → role → availability → 3 proof stats → 2 CTAs.
- [x] Terminal eyebrows kept (`$ inspect --systems`); human subheads carry meaning.
- [x] Console entries in plain-English job phrasing; print CSS expands details + inline URLs.

## Phase 4 — V2 fixes (this session) [x] DONE
- [x] Fix stale `github.io` origin in `index.html` (canonical, `og:url`, `og:image`, `twitter:image` → `https://maithresh-sh.pages.dev/`) — was failing `npm run verify`.
- [x] `npm run verify` ✅ · `npm run build` ✅ · `npm run lint` ✅.

## Phase 5 — Full manual audit, every phase re-checked (2026-09-30) [x] DONE
Read every component, both data files, both hooks, `scene.js`, `styles.css` (2280 lines), `verify.js`, sitemap/robots/headers line by line.
- Phase 1 truth-check: grepped `src/` for inflated metrics (`6.8s`, `−62%`, `74%`, `10 solo`, `India`-filter, `omniroute`) — zero hits (one false positive: `Hyderabad, India` address line). Counts `11+`/`13+` consistent across telemetry bar, console, Projects, OG/Twitter. TrustRAG counts/k6 absent as required. PASS, no change.
- Phase 2 detailing: `.auto-item`/`.more-item` correctly excluded from pointer affordance; console overlay is `display:none` when closed (no focus leak); scene + cursor hooks both fully torn down; all 5 schematic marker ids namespaced. PASS with 2 fixes (below).
- Phase 3 hybrid: 30s scan order intact; console placeholder promises (`trustrag`, `docuchat`, `workbench`) all resolve via keywords; print CSS expands row detail + inlines URLs; sitemap/robots on live origin. PASS with 1 fix (below).

**Bugs found & fixed (5):**
1. Workbench opened on the wrong tab — default `activeId` was `'docuchat'` while tabs list TrustRAG (flagship) as `01`. First paint contradicted the tab order. → default `'trustrag'` (`Workbench.jsx`).
2. False pointer affordance on `.chip` — plain spans, not clickable, but carried `cursor:pointer` (same bug class as the fixed `.auto-item` lift). → dropped from the selector (`styles.css`).
3. Duplicated comment block above `.auto-item h3 a` (same 2 lines twice). → collapsed to one.
4. Dead `.workbench` selector in the print hide-list (section uses `id`, so it matched nothing). → removed; defense content keeps printing.
5. Write-only session cache in `ContributionGraph.jsx` (`CACHE` written, never read — the committed snapshot already covers first paint). → removed the write, 2 lines.
- Final: `npm run verify` ✅ · `npm run lint` ✅ · `npm run build` ✅ (113ms, verify re-run inside build ✅).
- [ ] No content reskin: content.jsx / Hero / About already meet the engineer-friendly, non-generic bar — no rewrite for its own sake.

## What has been done (V2)
- 2026-09-30: origin fix (4 URLs, 1 file). Content audit: rewrite already compliant — kept diff minimal per ladder (reuse > rewrite).

## What should be done next (only if you want it)
1. CareerOS source count, SkillMap geo-filter, NxtWave dates, omniroute, TrustRAG counts — all documentation-side, tracked in `Project_Portfolio.md` §Open items. No site change needed.
2. Optional: real-device pass (iOS Safari / Android Chrome); contrast-meter check of dimmest mono labels; consider `/resume.pdf` route (currently forbidden by `tests/verify.js` résumé gate).
3. Rotate any leftover automation-platform API keys (hygiene, not a site change).

## Status
- Build gate: was ❌ (`stale github.io origin must stay retired`), fix applied — re-verifying.
- Design debt: none open. Docs debt: 5 open items in `Project_Portfolio.md`, none blocking.

## Phase 6 — N+ counts everywhere + structure + docs (2026-09-30) [x] DONE
Rule applied: portfolio **inventory** counts are always N+ (`11+`, `13+`, `26+`) so copy
can't go stale; **architecture specs** stay exact (8-stage pipeline, two-stage dedup/verify,
3-agent crews, 14-class model, six-part report) — they describe the design, not the inventory.
- Copy fixes: Hero stat → `13+ automation workflows shipped`; Hero sr-only + console + Projects
  sub drop the bare `Five`; About → `13+ automation workflows and team platforms` (was `two team
  platforms`); Automation sub → `13+ automation workflows live across…`; Group sub drops
  `Two four-person`; CERTS + stack note `26` → `26+`; OG/Twitter `13+ shipped automations` →
  `13+ automation workflows` (both, byte-identical per gate); schematic code comment de-numbered.
- Left exact on purpose: `Project_Portfolio.md` inventories (it's the precision reference, not
  public copy), dynamic `+ show N more` toggle (self-updating), `5 APIs + scraper` site copy
  (settled per revamp; source-count dispute tracked in Portfolio.md open items).
- Structure: removed empty dead dirs `public/` and `src/lib/`; `.gitignore` scratch rule
  broadened `output/playwright/` → `output/` (kept `.playwright-cli/` ignored).
- Docs: `free-deploy-options.md` fixed 2 real errors — Vercel said empty build + `.` output
  (would serve raw source; now `npm run build` → `dist`), GitHub Pages said branch-folder
  publishing (repo uses the Actions workflow; rewrote steps + dropped stale `.nojekyll` notes).
  `README.md` tree refreshed to match the real layout + N+ content policy documented.
- Checks: `verify` ✅ · `lint` ✅ · `build` ✅ · manual anchor audit (every `#href` resolves) ✅.
  (No browser-skill pass in this environment — no Playwright MCP/CLI wired here; last full
  Chromium pass is recorded in `PORTFOLIO_REVAMP.md` Phase 4.)

## Phase 7 — Breakout evolution: EATEN ticker, power bricks, coverage steering (2026-09-30) [x] DONE
Decision: keep Breakout (best palette/theme blend — instrument, not mascot), evolve it.
All in `src/components/ContributionGraph.jsx`, palette tokens only, no new dependency.
- **Bug fix:** strike readout used the day-index into `days` but looked it up in active-cell
  order (`flat`), so strikes could flash the wrong cell or none after inactive days. Loop now
  reports document-order; readout is exact.
- **EATEN ticker:** caption gains live `EATEN n/total` coverage (unique struck cells summed by
  real counts, resets on dataset change, hidden under reduced-motion where the beam never runs).
- **Power-brick eruption:** strikes on top-quartile days render larger with an outer amber ring.
- **Coverage steering:** every ~4s the beam blends 15% velocity toward the nearest unstruck
  brick (speed preserved) — coverage reads intentional, ricochet feel intact. Memory lives in
  the loop closure (60 reads/s, zero re-renders).
- Checks: `verify` ✅ · `lint` ✅ · `build` ✅. Uncommitted — awaiting push approval.
