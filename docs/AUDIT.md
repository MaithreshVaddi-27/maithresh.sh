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

## Phase 2 — Suggested, not yet done (ordered)

1. **Custom domain dead (High).** `maithresh.sh` returns NXDOMAIN on
   Google DNS and the sandbox resolver; canonical + OG URLs point at a
   non-resolving host (SEO split + shared-link breakage). Either configure
   DNS per `docs/free-deploy-options.md` or repoint canonical/OG to the
   github.io URL. Owner decision required.
2. **`tests/` untracked (Medium).** `.gitignore` excludes the 22-check
   suite, so the quality gate runs on one machine only. Recommend tracking
   it (tiny, secret-free) for shared/CI use.
3. **`docs/CV_9-1.pdf` untracked + unlinked (Medium).** Rename to the
   resume and wire the download button (palette already carries a dormant
   `resume` action → `assets/maithresh_vaddi_resume.pdf`, which 404s
   today), or delete.
4. **Real testimonials (Medium).** The one missing landing-pattern element
   (Hero → Problem → Solution → Testimonials → CTA). Blocked on 2 genuine
   quotes — never fabricate.
5. **Immutable cache headers (Low).** `netlify.toml` / `_headers` /
   Cloudflare rules for `/css/*`, `/js/*`, `/assets/*`; `?v=` versioning
   already supports it.
6. **Weight cuts (Low).** Minify `style.css` for deploy; compress
   `og-image.jpg` (~78 KB → ~40 KB); subset fonts to 400/600/700.
7. **`sitemap.xml <lastmod>` (Low).** Stamp after each content pass.
8. **Lighthouse on live URL (Low).** Confirm LCP + mid-range Android check.
9. **Accepted risks (documented, no action):** no CSP headers possible on
   GitHub Pages (mitigated: zero inline handlers/styles); `.reveal`
   invisible if `main.js` itself 404s (same-origin, negligible);
   Lenis + native smooth-scroll coexistence (currently synced, stable).

## Removed / retired this audit

- `doppelrand-*` naming (→ `wb-shell`/`wb-core`); stale
  `tests/verify-redesign.js` assertions updated + 6 new production gates.
- Dead Three.js importmap, dead SVGs, dead tokens/rules, FoodMunch,
  Outskill card, fake telemetry, Journey section (per owner).
