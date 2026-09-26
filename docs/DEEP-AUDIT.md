# maithresh.sh — Deep Audit (Senior Designer · Senior Frontend Developer · Senior Security Engineer)

**Date:** 2026-09-26 · **Scope:** `index.html` (1,423 lines), `css/style.css`
(2,072 lines), `js/main.js` (1,332 lines), `js/scene.js` (222 lines),
`assets/`, `robots.txt`, `sitemap.xml`, live origin
`https://maithreshvaddi-27.github.io/maithresh.sh/` (HTTP 200, ~110 KB).
**Skills applied:** `code-review` (4-phase: context → analysis → prioritization
→ structured output), `security-audit` (OWASP-mapped, severity + CWE +
remediation), `ui-ux-pro-max` (portfolio/dark-OLED checklist: no-emoji icons,
hover stability, contrast, responsive, reduced-motion), `apple-design`
(fluid interfaces: press feedback, interruptibility, materials, typography,
craft), `accessibility-audit` (WCAG 2.2 AA triage: keyboard, semantics,
contrast, motion).
**Method:** full source read (no sampling) + deterministic probes
(`node --check`, HTML-parser nesting scan, duplicate-ID scan, class/token
coverage diffs, `var()`-reference audit, `getElementById`-target existence,
JSON-LD parse, live HTTP check).

Severity scale: **Critical** (exploitable / invisible page) ·
**High** (broken UI / exclusionary a11y) · **Medium** (wrong behavior,
validity, measurable perf/SEO) · **Low** (hygiene, hardening, micro-perf).

Prior phases (1–5) live in `docs/AUDIT.md` — already fixed, verified, and
re-confirmed during this pass. This file records **only new findings**.

---

## Phase 6 — Fix now (all implemented this pass)

| # | Finding | Severity / CWE | Location | Fix |
|---|---------|----------------|----------|-----|
| 13 | Simulation timeout race: the 4 workbench sims stage outcome writes on fixed 400/800/1200 ms `setTimeout`s with no invalidation. Rapidly clicking HIGH-CONFIDENCE then RECOVERY lets the first invocation's late timeout land last — panel shows the wrong system's outcome | Medium (correctness) | `js/main.js:661-709, 744-796, 831-879, 914-963` | Per-sim generation token (`nextSimToken`), same pattern as the existing `fillStage.token` guard; stale timeouts return early |
| 14 | Runtime duplicate IDs: `fillStage()` clones `.proj-row-detail` HTML into the desktop stage, duplicating `id="pdArrow…"`, node/link IDs. Source scan is clean; the live DOM is not (invalid HTML, AT confusion) | Medium (validity/a11y) | `js/main.js:276` | Strip `id` attributes from the clone — `url(#…)` marker refs still resolve to the row originals; sims query pane-level IDs, unaffected |
| 15 | Decorative hero canvas exposed to assistive tech | Medium (WCAG 4.1.2) | `index.html:133` | `aria-hidden="true"` on `#hero-canvas` |
| 16 | Open ⌘K modal leaves background (`header/main/footer`) in the accessibility tree — focus trap covers Tab but SR users can wander behind the dialog | Medium (WCAG 2.4.3) | `js/main.js:1050-1068` | Toggle `inert` on background landmarks in `open/closeCommandPalette` |
| 17 | Dead render-blocking request: `lenis.css` from unpkg — none of its `html.lenis*` helper classes are used anywhere; Lenis runs entirely from `lenis.min.js` | Medium (perf) | `index.html:56` | Stylesheet link removed; `preconnect` kept for the JS |
| 18 | Meta description 204 chars — truncated in SERPs (~155–160 budget); also still said "10+" against the reconciled 11 | Low (SEO) | `index.html:7` | Rewritten to ~150 chars, "11 solo" aligned |
| 19 | Stale pre-redesign "Doppelrand" naming survives in a CSS section header + JS comment (classes were retired to `wb-shell` in Phase 0) | Low (hygiene) | `css/style.css:1035`, `js/main.js:1170` | Reworded to workbench-shell terminology |
| 20 | `escapeHtml()` omits single-quote escaping — safe today (only double-quoted attrs + text nodes), one bypass primitive away from mattering | Low · CWE-79 (defense in depth) | `js/main.js:23-27` | Added `'` → `&#39;` |
| 21 | `Math.sqrt` executed for every dot every frame (~2–6k dots) just to compare against a radius — only illuminated dots need the true distance | Low (perf) | `js/scene.js:113` | Squared-distance comparison; `sqrt` only inside the spotlight branch |

---

## Phase 7 — Accepted risks (documented, no change)

| # | Item | Rationale |
|---|------|-----------|
| A | No SRI on GSAP/Lenis CDN scripts | Hashes cannot be verified offline; a wrong hash breaks the page harder than the supply-chain risk it mitigates. Mitigated: version-pinned URLs, `hasGSAP` fallback renders content visible without them |
| B | `scroll-behavior: smooth` coexists with Lenis | Stable in practice per prior audit; anchor jumps route through Lenis-owned physics, no observed conflict |
| C | `.reveal` invisible if `main.js` itself 404s | Same-origin negligible; `noscript` fallback covers no-JS |
| D | No CSP headers possible on GitHub Pages | Mitigated: zero inline handlers, zero inline styles (except `noscript`), all dynamic markup escaped |
| E | Filter-based (`blur`) one-shot reveals | Non-compositor but fire-once; no scroll-linked filter animation, no jank surface |

---

## Explicitly checked and cleared (no finding)

- **XSS/A03:** all `innerHTML` sinks traced — API fields escaped, stats via
  `textContent`, legend/stage clones from same-origin authored DOM, palette
  filter uses `display` toggles only. `window.open` ×2 already `noopener`.
- **Failure paths:** malformed API payload throws inside `.then` → `.catch`
  fallback card; `AbortSignal.timeout` fallback; preloader 3.5 s force-done;
  GSAP-absent fallback unhides `.reveal`; portrait `error` + `naturalWidth`
  guard; `reduceMotion` short-circuits preloader/Lenis/reveals/snake/cursor/
  count-up/canvas loop (single static frame).
- **IDs:** 46/46 `getElementById` targets exist (incl. `set()`-wrapped stat
  IDs and `dataset.target` section IDs); panes `display:none` when inactive;
  tabs roving-`tabindex` + arrows/Home/End; prompt `$`/`>` glyphs are text,
  not emoji; marquee duplicated + `aria-hidden`.
- **Design system:** press feedback on pointerdown (`:active` scale),
  critically-damped house curve, glass material hierarchy, size-specific
  tracking/leading, `text-wrap: balance`, `tabular-nums`, print + contrast +
  reduced-transparency + reduced-motion blocks all present.
- **SEO:** JSON-LD parses; title 53 chars; canonical/OG/sitemap/robots all
  on the resolving github.io origin; OG image 37 KB at 1200×630.
- **JS inventory:** zero dead functions (all ≥2 references); no `eval` /
  `document.write` / unsanitized URLs.

## Verification evidence

`node --check` clean ×2 · suite **30/30** (+Check 30: no sim-timeout
without token guard, stage clone strips IDs, canvas `aria-hidden`, modal
`inert`, no `lenis.css`) · parser nesting scan 0 errors · duplicate-ID
source scan clean · `style=""` 0 / `onclick=` 0 / single `<style>`
(noscript) / single `<h1>`.

## Phase 8 — Nav order, headings, anchor offset (2026-09-26, uncommitted)

| # | Finding | Severity | Location | Fix |
|---|---------|----------|----------|-----|
| 22 | Nav order contradicted page flow: Systems(#projects) listed before Workbench, but the workbench section precedes projects in the document | Low (UX/order) | `index.html:99-100` | Swapped to Workbench → Systems, mirroring page order (mobile menu + scrollspy inherit) |
| 23 | Heading hierarchy skipped levels: 5 featured titles + 2 group titles were `div`s, 12 sub-titles were `h4` under `h2`s — invisible to heading navigation | Medium (WCAG 1.3.1) | `index.html` rows/cards | All promoted to `h3` (outline now strictly h1→h2→h3); zero CSS restyle needed — class hooks unchanged |
| 24 | Conflicting duplicate `scroll-margin-top` (100px vs 120px, later won) — anchor offset ambiguous to future editors | Low (formatting) | `css/style.css:560,1447` | Removed the dead 100px declaration; single 120px offset stands |
| 25 | Heading tag swap without margin guards would regress spacing (`h3` UA margins ≠ `div`/`h4` margins) | Low (formatting) | `css/style.css` title rules | `margin:0` / `margin-top:0` pinned on all retagged selectors — pixel-identical rendering, verified by rule audit |

Navbar architecture reviewed, no change: sticky `header` in normal flow
(correct — never overlaps the telemetry strip), dock elevation on
`.is-scrolled`, 44px touch targets, `aria-expanded` sync, scroll-margin
preserved for native + `scrollIntoView` jumps. Label↔section mapping
(Systems→Featured projects, Academic→Education,
Credentials→Certifications) kept as terse-nav-label convention.

## Verification evidence (Phase 8)

Suite **31/31** (+Check 31: nav order, no-`h4`/no-div-titles, single
scroll-margin) · `?v=` bumped to `20260926-3` (HTML+CSS changed) ·
nesting 0 errors · dup IDs clean · palette steady at 32 in-family hex.
