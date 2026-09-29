# maithresh.sh — Cyber-Terminal Portfolio Revamp Tracker

> Design leads: Apple-design (fluid motion, craft, restraint) + UI-UX-Pro-Max (accessibility, hierarchy) + Frontend-design (distinctive voice).
> Strategy: **hybrid** — keep cyber-terminal soul (differentiator), make every line recruiter-readable in 30 seconds.
> Source of truth: `docs/Project_Portfolio.md`. Never quote numbers not present there.

## Status legend
- [ ] TODO · [~] IN PROGRESS · [x] DONE

## Phase 0 — Audit (DONE)
- [x] Read Project_Portfolio.md (182 lines), App.jsx, content.jsx, Hero, About, Sections, index.html
- [x] Pulled UI-UX-Pro-Max design system: Dark OLED (#020617/#0F172A), Inter, minimal glow, visible focus, reduced-motion
- [x] Found integrity risks (unverified claims currently live on site):
  - DocuChat `6.8s → 1.9s / −68% token cost` — NOT in Portfolio.md → must remove
  - TrustRAG `−62% verification latency` — NOT in Portfolio.md → must remove
  - CareerOS `74% duplicates pruned` — NOT in Portfolio.md → must remove
  - SkillMap `live India job search` — Portfolio.md flags India-filtering as UNCONFIRMED → soften to `live job search`
  - CareerOS source count — Portfolio.md says confirm 5 APIs + scraper vs old 10-claim → use `5 job-board APIs + career-page scraper`, never `10`
  - TrustRAG test counts / k6 p95 — Portfolio.md says predate local-first, do NOT quote → already absent, keep absent

## Phase 1 — Professional humanized content rewrite (DONE)
Goal: every project defensible in interview, warm professional voice, no inflated metrics.
- [x] `src/data/content.jsx` — PROJECTS rewritten to engineering register: architecture, constraints, security hardening, disclosed limitations. Unverified numbers removed.
- [x] `src/data/content.jsx` — MORE_PROJECTS, AUTOMATIONS, GROUP_PROJECTS, CERTS. Added NxtWave GenAI/MCP, Outskill, LeetCode SQL-26 to CERTS. CrimeSleuth vs SignatureSense train-vs-integrate distinction made explicit.
- [x] `src/components/Hero.jsx` — STATS now `8-stage` / `5 + 1` / `13`; desc names the actual engineering practice.
- [x] `src/components/About.jsx` — "constraints before code" framing, debugging-as-the-job, current work + honest gap (Redis rate limiter), 4 principles, terminal `whoami` block.
- [x] `src/components/Sections.jsx` + `index.html` — recruiter-plain subheads; title/description/OG/Twitter/JSON-LD rewritten (description under 160-char SERP budget).
- [x] `src/data/workbench.jsx` — defense panels retitled "TRADE-OFF I CAN DEFEND" (was "STAFF INTERVIEW DEFENSE"), all invented benchmarks removed.
- [x] `src/components/Projects.jsx` — 5 inline SVG schematics de-claimed: no τ 0.75, no "74% deduplicated", no 6-source, no "Indian tech hiring", no ChromaDB cosine, no MD5.
- [x] Verify: `npm run verify` ✅ · `npm run lint` ✅ (also removed a dead `hero` variable in tests/verify.js that was failing oxlint)

## Phase 2 — Ultra-premium detailing (DONE)
Apple-design + UI-UX-Pro-Max, minimal diff, keep terminal identity.
- [x] Audit confirmed already in place: `backdrop-filter` materials with scroll-edge fade, `:focus-visible` rings, 44px touch targets, `prefers-reduced-motion` / `prefers-reduced-transparency` / `prefers-contrast`, skip link, print stylesheet.
- [x] Fixed a real affordance bug: `.auto-item` / `.more-item` are informational rows but had `cursor:pointer` + a `-2px/-3px` hover lift. Removed the false affordance; hover feedback now sits on the actual title link. (apple-design: motion that answers an action.)
- [x] Typography: 68ch measure + `text-wrap: pretty` on all prose, `text-wrap: balance` retained for display; centered subheads re-balanced.
- [x] Contrast: `--text-mute #cbd5e1` / `--text-dim #94a3b8` on `#05070c` clear 4.5:1 — verified, no change needed.
- [x] Hero primary CTA got an `sr-only` label so the terminal glyph isn't the only accessible name.
- [x] One memorable element preserved: the hero viewfinder/HUD. Everything else stays quiet.

## Phase 3 — Recruiter-friendly hybrid polish (DONE)
- [x] 30-second scan: name → role → availability → 3 proof stats → two CTAs, all above the fold.
- [x] Hybrid voice: terminal eyebrows kept (`$ inspect --systems`), human subheads now say what the thing is ("Five solo-built systems. Each one states the engineering problem, the constraint that shaped the design, and the limitation I haven't solved yet").
- [x] Command console entries rewritten to plain-English job-relevant phrasing.
- [x] Print stylesheet upgraded: hover-revealed project detail now prints expanded, URLs printed inline after external links, decorative canvas/scanlines/grain suppressed.
- [x] Final: `npm run build` ✅ (42 modules, 140ms) · verify ✅ · lint ✅

## What has been done
- 2026-09-29: All three phases complete. 9 files changed, +333/-244. Build and both gates green.

## What should be done next
Nothing required for the revamp. Open items are all documentation-side and tracked in `docs/Project_Portfolio.md` §"Open items":
1. CareerOS-Pro source count (5 APIs + scraper is what's live and is now what the site says).
2. SkillMap geographic filtering — removed from the site as unconfirmed.
3. NxtWave program title + enrollment dates for the CV.
4. TrustRAG "omniroute" — never described anywhere on the site.
5. TrustRAG test counts / k6 p95 — deliberately absent from the site.
6. Rotate any leftover automation-platform API keys (portfolio hygiene, not a site change).

## Phase 4 — Browser verification pass (DONE) — 7 real bugs found & fixed
Driven with the Playwright CLI against `npm run dev` at 320 / 375 / 768 / 1024 / 1440 px, plus
`prefers-reduced-motion: reduce` and `emulateMedia('print')`. Screenshots in `output/playwright/`.

**Bugs fixed (all pre-existing except where noted):**
1. **CRASH — entire app white-screens.** `Preloader.jsx`: `finish()` referenced `timer` via `clearInterval(timer)`, but `const timer` was declared *below* it. When React mounted after `document.readyState === 'complete'` (fast load, any HMR reload), `finish()` ran synchronously into the TDZ and threw `ReferenceError: Cannot access 'timer' before initialization`. Nothing rendered. Fixed by hoisting `let timer` above `finish`.
2. **Preloader outside the error boundary.** It was a sibling of `<main>`, so any throw killed the whole page instead of degrading. Moved inside `<ErrorBoundary>`.
3. **Workbench "OUTCOME" box had never rendered — ever.** `Workbench.jsx` drew the outcome inside the node loop under an `i === 3` branch, but `pane.nodes` only ever has 3 entries. Every `outcomes: {...}` block in `workbench.jsx` was dead code. The outcome is now its own fourth node, and the SVG geometry was re-laid-out so outcome titles fit (they were overrunning a 130-unit box).
4. **Reduced-motion users saw nothing.** `useReveals` bailed out of the grid-stagger pass when `reduceMotion` was true, but `.reveal` base style is `opacity: 0` — so every project row, stack card, group card, and cert card stayed permanently invisible. Reduced motion now sets them visible statically. Verified: 15 hidden elements → 0.
5. **No wordmark on phones.** `.glass-dock .logo span:last-child { display: none }` (meant to drop the `.sh` suffix) actually matched `.brand-word` itself, since it *is* the last child of `.logo`. Below 480px the site showed an 8px dot and no name. Retargeted to `.brand-accent`.
6. **Print was unreadable.** Near-white text tokens on a white background, and `.proj-row-detail` (a 1px screen-clipped block) expanded to **2889px per project row** — a 20-page mess. Added a print text-ramp inversion and a compact print layout. Row height 2995px → 409px.
7. **Touch targets below WCAG 2.2 (2.5.8) 24px.** `.tbtn` (19px), `.chips-toggle` (22px), `.proj-link` (18px), `.auto-item h3 a` (20px), `.logo` (22px). All padded to ≥24px with negative margins so the visual box is unchanged. Verified: 11 small targets → 0.

**Regressions from my own Phase 1 copy, caught and fixed:**
8. Project tags collapsed to 0-8px — `.proj-row-tag` was a sibling flex item with `flex: 0 6 auto`, starved by long titles. Moved the tag *inside* `.proj-row-main` under the title as a block, so it gets full column width and wraps. Also shortened all five tags.
9. Trade-off callout wrapped nonsensically — `.interview-defense-box` was `display:flex; flex-wrap:wrap` and only read correctly with exactly 2 paragraphs. My 3-paragraph version sent the first paragraph to a right-hand column. Now a stacked block.

**Design corrections:**
10. Hero hierarchy was inverted — the role line was 64px vs the name's 44px, and wrapped to 4 ragged lines, with a gradient on one phrase (the "accents a single phrase" tell). Name is now the headline (`clamp(2.1rem, 4.2vw, 3.6rem)`), role line is a statement below it, flat accent.
11. Section `h2` at 3.6rem mono ragged to 3 lines on "Automation & workflow engineering". Capped to 2.9rem with a 22ch measure; the About sentence-led headline got its own wider/lower treatment.
12. Removed the false hover affordance on `.auto-item` / `.more-item` (informational rows with `cursor:pointer` + a lift).
13. `hero-lead span { white-space: nowrap }` overflowed at 320px — dropped below 420px.

**Verified clean:** no horizontal overflow at 320/375/768/1024/1440 · one `<h1>` · 9 `<h2>` · 0 images without alt · 0 unnamed buttons/links · all 4 workbench sims land a visible outcome · ⌘K console opens with correct items · tab order is skip-link → console → logo → nav · focus ring is 2px cyan at 3px offset · 0 console errors in both motion modes.

## Optional future polish (not started, deliberately)
- [ ] Contrast audit of the dimmest mono labels (`--text-dim` on glass surfaces) with a real checker — verified by eye against the palette, not measured.
- [ ] Real-device pass (iOS Safari, Android Chrome). Chromium only here.
- [ ] Consider an `/resume.pdf` route; the removed-résumé gate in `tests/verify.js` currently forbids it.
- [x] `output/playwright/` is already gitignored — scratch stays local.

## Decisions log
- Keep cyber-terminal aesthetic (brief pins it) — do NOT reskin to generic SaaS cards (frontend-design rule).
- Hybrid readability: terminal commands stay as eyebrows; human sentences carry meaning.
- Numbers policy: only numbers present in Project_Portfolio.md may appear on site.
- Diagrams illustrate architecture, never benchmarks. All five SVG schematics previously carried invented figures; they now describe real stage names only.
- Disclose limitations on the page (Redis rate limiter, in-memory memory saver, prompted-not-forced tool use). Portfolio.md treats these as interview assets, and on a portfolio, stated gaps read as engineering maturity rather than weakness.
- `verify.js` has hard content gates (SERP budget ≤160 chars, "11 SOLO SYSTEMS" reconciliation, no HTML entities in workbench data). Treat it as the contract — run it before claiming anything works.
