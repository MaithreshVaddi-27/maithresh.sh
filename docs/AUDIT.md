# maithresh.sh — Senior Audit Record

**Date:** 2026-09-26 · **Auditors (roles):** Senior Professional Designer,
Senior Professional Frontend Developer, Senior Security Engineer ·
**Skills applied:** `code-review` (4-phase methodology),
`security-audit` (OWASP-mapped, severity + CWE + remediation),
`ui-ux-pro-max` (portfolio / dark-OLED / developer-mono / landing),
`apple-design` (fluid interfaces, materials, typography, craft).
**Scope:** `index.html` (~1,400 lines), `css/style.css` (~2,100 lines),
`js/main.js` (~1,100 lines), `js/scene.js`, `assets/`, `tests/`,
`robots.txt`, `sitemap.xml`, live origin
`https://maithreshvaddi-27.github.io/maithresh.sh/`.
**Method:** static analysis (`rg`, HTML-balance parser, duplicate-ID
check, class-coverage diff, `node --check`), live HTTP verification
(status / size / MIME / marker grep), OWASP Top-10 mapping for a static
site, ui-ux-pro-max delivery checklist, Apple HIG motion audit.

Severity scale: **Critical** (exploitable / data-corrupting / invisible
page) · **High** (broken UI / exclusionary a11y) · **Medium** (degraded
UX, compat, perf) · **Low** (hygiene, polish).

---

## Phase 0 — Fixed in this pass (committed, pushed)

| # | Finding | Severity / CWE | Location | Fix |
|---|---------|----------------|----------|-----|
| 1 | `window.open(url, '_blank')` without `noopener` — reverse tabnabbing: opened GitHub/resume pages could redirect the portfolio tab via `window.opener` | High · CWE-1022 | `js/main.js:1121,1124` | Added `'noopener'` to both calls |
| 2 | Third-party API payload interpolated into `innerHTML` unescaped (`d.date`, `d.count`, month labels) — malformed upstream record could break markup / inject attributes (OWASP A03 Injection) | High · CWE-79 | `js/main.js` contrib renderer | Added `escapeHtml()` on every interpolated field; numeric coercion for `level`/`count` |
| 3 | Stats summation `sum + d.count` would string-concatenate on non-numeric payloads (e.g. `"0"+"5"="05"`) — wrong readout | High (data integrity) | `js/main.js` stats block | Coerced `counts` array via `Number() \|\| 0` once, reused everywhere |
| 4 | `.activity-stats[hidden]` overridden by `.activity-stats{display:flex}` — "—" placeholders flashed before data landed | Medium (visual bug) | `css/style.css` activity block | Added `.activity-stats[hidden]{display:none}` |
| 5 | `AbortSignal.timeout` absent on older engines → synchronous throw → fetch never runs, `.catch` fallback never fires, card stuck on "Loading…" | Medium (compat) | `js/main.js` fetch | `fetchTimeoutSignal()` with manual `AbortController` fallback |
| 6 | Canvas dot density fixed at load — rotating to a narrow window kept desktop density (perf) | Low | `js/scene.js` | `SPACING` re-evaluated inside `resize()` |

Verification evidence: `node --check` clean on both JS files,
`tests/verify-redesign.js` 22/22 pass, HTML balance parser clean,
duplicate-ID check clean, class-coverage diff clean.

## Phase 3 — Fixed in this pass (2026-09-26, uncommitted)

External-linking hardening + Phase-2 backlog burn-down. All asset
references are external files; the document carries **zero** inline
`<script>` blocks and exactly **one** inline `<style>` (the `noscript`
preloader/`reveal` fallback, which cannot be externalized by definition).

| # | Finding | Severity | Location | Fix |
|---|---------|----------|----------|-----|
| 7 | 5 duplicated SVG-internal `<style>` blocks (TrustRAG, DocuChat, Resume Crew, CareerOS-Pro, MCP Suite diagrams) — repeated typography rules inline in markup, CSP-unfriendly | Medium | `index.html` (5 sites) | Hoisted into shared `css/style.css` rules (`.proj-diagram svg .pd-t/.pd-label/.pd-sub/.pd-tiny`); blocks deleted |
| 8 | Palette `data-action="resume"` handler existed in JS but no palette item triggered it; `assets/maithresh_vaddi_resume.pdf` 404'd | Medium | `js/main.js:1142`, palette list | Copied `docs/CV_9-1.pdf` → `assets/maithresh_vaddi_resume.pdf` (96 KB); added "Download Résumé (PDF)" palette item |
| 9 | JetBrains Mono loaded 5 weights (400–800) | Low (perf) | `index.html` font URL | Subset to 400/600/700 (Inter already lean at 3 weights); `?v=` bumped to `20260926` on css + both js |
| 10 | `og-image.jpg` 78 KB | Low (perf) | `assets/og-image.jpg` | Re-encoded progressive q72 → 37 KB, 1200×630 preserved |

Phase-2 backlog status after this pass:

- Item 1 (dead domain, was High): **FIXED** — canonical, `og:url`,
  `og:image`, `twitter:image`, JSON-LD `url`, `sitemap.xml <loc>`,
  `robots.txt` Sitemap all repointed to
  `https://maithreshvaddi-27.github.io/maithresh.sh/`
  (verified: 0 remaining `href="/content="` links to `maithresh.sh/`;
  brand text untouched). Revert to `maithresh.sh` the day DNS resolves.
- Item 2 (untracked tests, was Medium): **FIXED** — `tests/` removed
  from `.gitignore`, suite extended to 26 checks; scratch
  `test_ai_content.{md,txt}` deleted (ignore patterns kept for future scratch).
- Item 3 (resume 404, was Medium): **FIXED** — see #8 above.
- Item 5 (cache headers, was Low): **FIXED** — `_headers` (Cloudflare
  Pages) + `netlify.toml` ship `immutable` 1-year caching for
  `/css/*`, `/js/*`, `/assets/*`; both ignored harmlessly on GH Pages.
- Item 6 (weight cuts, was Low): **PARTIAL** — fonts + OG image done;
  `style.css` minification deferred (keep source readable; `?v=`
  versioning already edge-safe).
- Item 7 (`<lastmod>`, was Low): confirmed `2026-09-26` (this pass).
- Item 4 (testimonials): still blocked — never fabricate (no change).
- Item 8 (Lighthouse): live origin returns 200 (`text/html`, ~110 KB);
  on-device LCP + mid-range Android run still owner-side.

Verification evidence (this pass): `node --check` clean ×2,
suite **26/26 pass** (22 carried + 4 new gates: single-`<style>`,
github.io canonical, resume asset, immutable headers), balance CLEAN,
duplicate-ID CLEAN, `style=""` 0 / `onclick=` 0 / `<h1>` 1,
class-coverage on all touched classes (`pd-*`, palette) clean,
Phase-0 guards re-confirmed (`noopener` ×3, `escapeHtml` on API fields,
`Number() || 0` counts, `[hidden]` stats, `fetchTimeoutSignal`,
`SPACING` in `resize()`).

## Phase 4 — Blend pass (2026-09-26, uncommitted)

Palette + content + a11y consistency sweep so every addition from
earlier phases reads as native to the instrument-panel design language.

| # | Finding | Severity | Location | Fix |
|---|---------|----------|----------|-----|
| 11 | Solo-system count read "ten"/"10" in 3 spots vs reconciled 11 shipped in telemetry, hero stat, palette | Medium (credibility) | `index.html:177,228,247` | Aligned to eleven/11 (11 = 10 listed repos + live PodEase pipeline, per Phase-1 reconciliation; no new claims) |
| 12 | 4 decorative HUD viewfinder corner brackets exposed to assistive tech (their 5 arrow siblings were already hidden via parent `aria-hidden`) | Low (a11y) | `index.html` reticle spans | `aria-hidden="true"` on all 4 reticle spans |

Palette audit (43 unique hex, all in-family): ink grounds
(`#07090e` + 11 near-black steps), slate text scale
(`#334155 → #f8fafc`), accent quartet cyan `#38bdf8` / green
`#10b981` / amber `#f59e0b` / red `#ef4444` + purple `#a855f7`,
each with its deep-tint glass ground (`#0d223a`, `#0c271c`,
`#291d09`, `#2d1214`, `#261238`). Out-of-family suspects cleared:
`#14171b` = glass-dock no-`backdrop-filter` fallback (neutral dark,
blends); `#000` = mask-luminance only, never painted; `#fff/#ccc`
= `@media print` block only. Zero foreign hues on screen.

Link/asset consistency: `target="_blank"` without `rel` = 0;
`http://` hits = 2, both `xmlns` namespace identifiers (favicon
data-URI, inline SVG) — no mixed content; single `<img>` ships
`alt` + `width` + `height`; every `<button>` labelled; informative
SVGs carry `role="img"` + `aria-label`, decorative ones `aria-hidden`.

Remaining backlog disposition: `style.css` minification **declined
by design** — no build step on this static host; hand-editing minified
CSS would rot the source of truth (`?v=` + immutable caching already
makes it edge-safe). Testimonials still blocked (never fabricate).
Lighthouse LCP + mid-range Android still owner-side. Disk hygiene:
stale `assets/.DS_Store`, `docs/.DS_Store` removed (git-ignored anyway).

Verification evidence (this pass): suite **28/28 pass** (+2 gates:
eleven-consistency, reticle `aria-hidden`), `HTMLParser` mis-nesting scan: 0 errors / 0 unclosed, duplicate-ID CLEAN,
`style=""` 0 / `onclick=` 0 / single `<style>` (noscript) / single `<h1>`.

## Phase 5 — Dead-code purge (2026-09-26, uncommitted)

Usage-proven deletion only: every candidate cross-checked against
`index.html` class/id attributes **plus** JS-injected classes
(`className=`, `classList.*`, `setAttribute('class',…)`,
`querySelector`, `getElementById`, `dataset.target`). State classes
(`open/active/done/swapping/…`), JS-created nodes (`chips-toggle`,
`cursor-dot/ring`, `snake-head`), and `set(id)`-wrapped stat IDs all
verified live and kept. Zero JS functions dead (all ≥2 references).

Removed from `css/style.css` (−83 lines, 2155 → 2072):

- Legacy pre-redesign systems, fully superseded: `.btn` block +
  `::before` sweep + `.btn-primary/.btn-ghost` (→ `.btn-nested`
  system), `.term-bar/.dots/.path` titlebar (→ `.t-head-mini`),
  `.frame-corner/.fc-tl/.fc-tr/.fc-bl/.fc-br` (→ `.hud-reticle-*`),
  `.nav-cta` block + mobile hide rule (→ `.btn-nested--connect`),
  `.tab-index` (→ `.tab-status-dot`), `.pipeline-link`,
  `.hero-stat-icon`.
- Dead names stripped from 5 live groups (`:active` press system,
  contrast-mode border rule, radius unification) — group rules kept.
- 13 dead `:root`/scoped tokens (0 `var()` refs repo-wide):
  `--surface` (dup of `--bg-soft`), `--accent-cyan-glow`,
  `--accent-mint/mint-glow`, `--accent-amber/amber-glow`,
  `--accent-coral`, `--green-dim`, `--amber-dim`, `--specular-rim`,
  `--proj-line` ×4 scoped. Live code already used `--green`,
  `--amber`, `--red`, `--accent` — rendering identical by construction.

Duplicates: `docs/CV_9-1.pdf` deleted (byte-identical 96 KB twin of
the wired `assets/maithresh_vaddi_resume.pdf`; assets copy canonical).
Stale `.DS_Store` previously cleared.

Error hunt (all clean, no fix needed): 46/46 `getElementById` targets
exist; `--mouse-x/--mouse-y` have `50%` fallbacks + per-element JS
setters (legitimate pattern); `http://` hits are `xmlns` identifiers
only; all `@keyframes` consumed; all section IDs reachable.

Verification evidence: suite **29/29 pass** (+Check 29: zero dead
tokens, legacy selectors stay retired), `node --check` ×2 clean,
parser scan 0 errors, palette re-audited at 32 hex — every value
previously cleared in Phase 4.

## Phase 6 — Deep audit (2026-09-26, uncommitted)

Full senior-role pass (Designer · Frontend Developer · Security Engineer,
via `code-review`, `security-audit`, `ui-ux-pro-max`, `apple-design`,
`accessibility-audit` skills): every source file read end-to-end, no
sampling. Findings + phased plan in `docs/DEEP-AUDIT.md` (Phase 6 fixes,
Phase 7 accepted risks). Fixed: sim-timeout race (generation tokens),
runtime clone duplicate IDs, canvas `aria-hidden`, modal `inert`, dead
`lenis.css` removed, meta description → 153 chars, `escapeHtml` quote
coverage, squared-distance canvas check, stale naming retired.
Verification: suite 30/30, `node --check` ×2 clean, nesting/dup-ID scans
clean. See `docs/DEEP-AUDIT.md` for the evidence table.

## Phase 1 — Fixed in earlier passes (already live, re-verified)

- 194 inline `style=""` → external component classes; 14 inline `onclick`
  → delegated listeners (CSP posture, zero violations re-confirmed).
- Single `<h1>` owned by the name; trimmed title; `og:locale`;
  `knowsAbout` JSON-LD; portrait `fetchpriority`/`decoding`; `noscript`
  preloader fallback; `defer` on CDN scripts.
- Counts reconciled (11 solo systems); unverifiable "100%" claim replaced
  with the defensible 74% dedup stat; per-project metric chips.
- Workbench: roving-tabindex tablist + arrows/Home/End, `tabpanel` roles,
  single shared SVG marker defs, responsive pipeline scaling, `aria-live`
  simulation announcements.
- Removed: Outskill "vibe coding" card (replaced with AWS/K8s/Jenkins labs
  card, grounded in the stack section's own wording), FoodMunch dilution,
  fake `LATENCY: 12ms` / `AUTH: ED25519` telemetry, dead tokens
  (`--bg-void`, `--accent-cyan-deep`), dead SVGs, orphaned rules.
- Perf: API preconnect, portrait preload, dead Three.js importmap dropped,
  canvas pauses off-screen + sparser dots on phones + single static frame
  under reduced-motion, 8s fetch timeout.
- Portrait hardening: skeleton ground, branded broken-asset fallback,
  `@supports` guard for gradient text (root-caused the "blank card / dim
  headline" report: asset + markup verified 200 OK, so failure was
  client-side paint timing — now impossible to render as a void).
- Instrument cursor (fine-pointer only, I-beam preserved in fields,
  disabled for touch + reduced-motion); logo double-dot clash removed.
- Palette audit: all 31 unique hex values inside the instrument-panel
  family — zero foreign hues.

## Phase 2 — Suggested backlog (status as of Phase 6)

1. **Custom domain dead (High).** ✅ RESOLVED Phase 3 — canonical/OG/
   sitemap/robots repointed to the github.io origin. Revert if DNS resolves.
2. **`tests/` untracked (Medium).** ✅ RESOLVED Phase 3 — tracked, suite
   now 30 checks (was 22 at the time of writing).
3. **Resume untracked + unlinked (Medium).** ✅ RESOLVED Phase 3+5 —
   `assets/maithresh_vaddi_resume.pdf` wired to a palette item; duplicate
   `docs/CV_9-1.pdf` deleted.
4. **Real testimonials (Medium).** ⏸ BLOCKED — never fabricate.
5. **Immutable cache headers (Low).** ✅ RESOLVED Phase 3 — `_headers` +
   `netlify.toml` ship immutable 1-year caching.
6. **Weight cuts (Low).** ✅ PARTIAL — OG image 78→37 KB, fonts subset,
   `lenis.css` dropped (Phase 6); `style.css` minification declined by
   design (no build step; `?v=` + immutable caching is edge-safe).
7. **`sitemap.xml <lastmod>` (Low).** ✅ CURRENT — `2026-09-26`.
8. **Lighthouse on live URL (Low).** ⏸ OWNER-SIDE — needs a device +
   mid-range Android run.
9. **Accepted risks:** no CSP on GH Pages (mitigated); `.reveal` if
   `main.js` 404s (negligible); Lenis + smooth-scroll (stable); CDN SRI
   absent (hashes unverifiable offline; version-pinned + fallbacks).

## Removed / retired this audit

- `doppelrand-*` naming (→ `wb-shell`/`wb-core`); stale
  `tests/verify-redesign.js` assertions updated + 8 new production gates
  (checks 23–30 across Phases 3–6).
- Dead Three.js importmap, dead SVGs, dead tokens/rules, FoodMunch,
  Outskill card, fake telemetry, Journey section (per owner).
