// tests/verify.js — build gate.
//
// The pre-React gate string-matched index.html for literal ids and js/main.js
// for function names. That whole class of check is dead now: the markup is JSX
// and the behaviour is hooks. What survives is the intent behind each check —
// the invariants that were expensive to lose — expressed against the new files.
//
// Run: npm run verify  (and automatically as part of npm run build)

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const errors = []

const need = (cond, msg) => { if (!cond) errors.push(msg) }

console.log('🧪 Starting Verification Suite (React/Vite)…')

// ── Structure ───────────────────────────────────────────────────────────
const required = [
  'index.html', 'package.json', 'vite.config.js',
  'src/main.jsx', 'src/App.jsx', 'src/styles.css', 'src/scene.js',
  'src/components/Workbench.jsx', 'src/components/Projects.jsx',
  'src/components/CommandConsole.jsx', 'src/data/content.jsx',
  'src/hooks/useMotion.js', 'src/hooks/useChrome.js',
]
required.forEach((f) => need(existsSync(join(root, f)), `Missing ${f}`))
if (errors.length) {
  console.error('❌ Critical files missing:')
  errors.forEach((e) => console.error('  - ' + e))
  process.exit(1)
}

const html = read('index.html')
const css = read('src/styles.css')
const pkg = JSON.parse(read('package.json'))
const projects = read('src/components/Projects.jsx')
const workbench = read('src/components/Workbench.jsx')
const workbenchData = read('src/data/workbench.jsx')
const content = read('src/data/content.jsx')
const consoleSrc = read('src/components/CommandConsole.jsx')
const scene = read('src/scene.js')
const motion = read('src/hooks/useMotion.js')
const app = read('src/App.jsx')
const main = read('src/main.jsx')
// Every source file under src/ — not just the required subset. A gate that
// only inspects the files it happens to name is blind to the rest of the app.
const srcFiles = []
;(function walk(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name)
    if (entry.isDirectory()) walk(rel)
    else if (/\.(jsx?|css)$/.test(entry.name)) srcFiles.push(rel)
  }
})('src')
const source = srcFiles.map(read).join('\n')
// Comments are allowed to *mention* the APIs the app no longer uses; only real
// call sites count.
const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
const allJsx = srcFiles.filter((f) => f.endsWith('.jsx')).map(read).join('\n')

// ── Build contract ──────────────────────────────────────────────────────
need(pkg.type === 'module', 'package.json must set "type": "module"')
need(pkg.scripts?.build?.includes('vite build'), 'npm run build must invoke vite build')
need(pkg.scripts?.verify, 'npm run verify must exist')
need(pkg.scripts?.deploy?.includes('dist'), 'deploy must target dist/, not the repo root')
for (const dep of ['react', 'react-dom', 'gsap', 'lenis']) {
  need(pkg.dependencies?.[dep], `react/vite build needs ${dep} in dependencies`)
}
need(!pkg.dependencies?.['clean-css-cli'] && !pkg.dependencies?.terser,
  'clean-css-cli/terser are dead now that Vite minifies — drop them')

// ── Head / meta (lives in index.html, not a component) ──────────────────
need(html.includes('maithresh.sh'), 'index.html must carry the "maithresh.sh" brand')
need(html.includes('application/ld+json'), 'JSON-LD Person schema must ship')
need(html.includes('https://maithresh-sh.pages.dev/'), 'canonical/OG must point at the live origin')
need(!html.includes('maithreshvaddi-27.github.io'), 'stale github.io origin must stay retired')
const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || ''
need(desc.length > 0 && desc.length <= 160, `meta description must fit the SERP budget (found ${desc.length} chars)`)
need((html.match(/<h1[\s>]/g) || []).length === 0, 'no <h1> may live in index.html — it is a React root')

// ── Design system ───────────────────────────────────────────────────────
need(css.includes('--accent-cyan') && css.includes('#38bdf8'), 'css must define --accent-cyan as #38bdf8')
need(css.includes('.wb-shell') && css.includes('.wb-core'), 'css must define .wb-shell and .wb-core')
need(css.includes('.btn-nested') && css.includes('.btn-nested-badge'), 'css must define .btn-nested family')
need(!css.includes('.doppelrand'), 'doppelrand naming must stay fully retired')
for (const sel of ['.term-bar', '.frame-corner', '.btn-primary', '.btn-ghost', '.tab-index', '.pipeline-link']) {
  need(!css.includes(sel), `css must not resurrect retired legacy selector ${sel}`)
}
// Every declared token has to be consumed, or the palette drifts.
const deadTokens = [...new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))]
  .filter((t) => !css.includes(`var(${t})`))
need(deadTokens.length === 0, `css ships dead tokens never consumed via var(): ${deadTokens.join(', ')}`)
// Apple-style interaction standards the redesign established.
need(css.includes(':active') && css.includes('scale(0.97)'), 'css must keep the :active scale(0.97) tactile response')
need(/cubic-bezier\(\.?16\s*,\s*1\s*,\s*\.?3\s*,\s*1\)/.test(css), 'css must keep the Apple spring curve')
need(css.includes('backdrop-filter: blur(20px) saturate(180%)'), 'css must keep the Apple translucent materials hierarchy')
need(css.includes('@supports not'), 'gradient text needs its @supports fallback')
need(css.includes('.portrait-fallback'), 'portrait must ship a branded fallback')
need(css.includes('.activity-graph-frame::after') && css.includes('repeating-linear-gradient'),
  'CRT scanline treatment must ship in css')
need(css.includes('@keyframes cweekIn') && css.includes('.activity-graph-frame.boot'),
  'heatmap boot reveal needs both the keyframes and the .boot hook')

// ── React correctness invariants ────────────────────────────────────────
// No hooks after a conditional return: the contribution graph's fetch shell and
// its renderer are separate components for exactly this reason.
// Scope to the fetch shell's own body — its renderer is a separate component,
// which is the whole point. A hook after a return inside one function is the bug.
const contrib = read('src/components/ContributionGraph.jsx')
const shellBody = contrib.slice(contrib.indexOf('export default function'),
                                contrib.indexOf('function ActivityCard'))
need(!/^\s*(if \(failed\)|if \(!data\))/.test(shellBody.slice(shellBody.lastIndexOf('useEffect'))),
  'ContributionGraph: no hook may follow a conditional return inside one component')
need(contrib.includes("err.name !== 'AbortError'"),
  'a cleanup-triggered abort must not be reported as a fetch failure (StrictMode double-mount)')

// Sim serialization: re-clicking must cancel the previous run's staged writes.
need(/clearTimeout/.test(workbench), 'Workbench must cancel pending sim timeouts on re-run')
need(/clearTimeout\(timer\.current\)/.test(projects), 'Projects stage swap must clear its pending timer')
need(!workbench.includes('nextSimToken') && !projects.includes('fillStage'),
  'imperative sim-token / innerHTML-clone plumbing must stay deleted')

// GSAP must be scoped so unmount can revert every ScrollTrigger.
need(motion.includes('gsap.context(') && motion.includes('ctx.revert()'),
  'useReveals must scope GSAP in a context and revert it on unmount')
// An inline `[` right after a `})` line is an ASI hazard (it parses as member
// access) — the grid selectors must live in a module-level constant.
need(!/\}\)\s*\[\s*'\./.test(motion), 'useReveals: array literal directly after a call is an ASI hazard')
need(motion.includes('GRID_SELECTORS'), 'grid selector list must be a module-level constant')

// Accessibility: the console must park the page behind it, not just trap Tab.
need(/el\.inert = open/.test(consoleSrc), 'command console must toggle inert on background landmarks')
need(consoleSrc.includes("role=\"dialog\"") && consoleSrc.includes('aria-modal'),
  'command console must be a modal dialog')
need(consoleSrc.includes('keyboard'), 'console placeholder must not promise searches it cannot resolve')
need(content.includes('keywords:'), 'console items must carry keywords for the searches the placeholder suggests')
need(content.includes('cmd-console-empty') || consoleSrc.includes('cmd-console-empty'),
  'console needs an empty state so a no-match filter does not look broken')

// The sticky stage renders the detail body bare; the row keeps the visually
// hidden wrapper that stays in the accessibility tree.
need(projects.includes('proj-row-detail') && projects.includes('DetailBody'),
  'Projects must keep the a11y-visible row detail and a separate stage body')
need(!/innerHTML|insertAdjacentHTML|dangerouslySetInnerHTML/.test(code),
  'no innerHTML / dangerouslySetInnerHTML anywhere — third-party data must render as text nodes')
need(!/&(amp|#\d+|#x[0-9a-f]+);/.test(read('src/data/workbench.jsx')),
  'HTML entities in JS string data render literally — use plain characters')

// ── Content invariants ──────────────────────────────────────────────────
// Counts are stated as "N+" (11+ solo systems, 13+ workflows) so the page can't
// go stale as projects land. Both surfaces must still name the floor.
need(source.includes('11+ SOLO SYSTEMS') && source.includes('11+ solo-built agent repositories'),
  'telemetry bar + console must both state the reconciled 11+ solo systems')
need(source.includes('13+ PIPELINES') && content.includes('13+'),
  'automation counts must be stated as 13+ across telemetry and console')
for (const stale of ['ten solo-built systems', 'Ten of those are solo builds', '10 solo-built']) {
  need(!content.includes(stale), `stale count "${stale}" contradicts the reconciled 11 solo systems`)
}
need(!content.includes('data-action="resume"') && !existsSync(join(root, 'assets/maithresh_vaddi_resume.pdf')),
  'the removed résumé feature must stay removed')

// Workbench: all 4 tabs, all 8 simulations, all 4 schematics.
for (const id of ['trustrag', 'docuchat', 'resumecrew', 'careeros']) {
  need(workbenchData.includes(`id: '${id}'`), `workbench must define the ${id} pane`)
}
for (const s of ['valid', 'fail', 'tool', 'local', 'match', 'gap', 'dedup', 'resilient']) {
  need(new RegExp(`\\[?'${s}'`).test(workbenchData), `workbench must define the "${s}" simulation outcome`)
}
need(content.includes('trustrag:valid') && content.includes('careeros:resilient'),
  'all 8 sims need a screen-reader label in SIM_LABELS')
for (const color of ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#a855f7']) {
  need(projects.includes(color) || workbenchData.includes(color), `flight telemetry colour ${color} must be used`)
}

// Projects: 5 schematics, 5 rows, unique marker ids.
need((projects.match(/viewBox="0 0 260 500"/g) || []).length === 5,
  'all 5 featured projects must ship a precision SVG schematic')
const projectsBlock = content.slice(content.indexOf('export const PROJECTS'))
need((projectsBlock.match(/href: 'https:\/\/github\.com\/MaithreshVaddi-27\//g) || []).length === 5,
  'all 5 featured projects must link a repo')
need(projects.includes('idPrefix'), 'schematic marker ids must be namespaced (row + stage render the same SVG twice)')

// Heading hierarchy: exactly one h1, no skipped levels, real headings not divs.
need((allJsx.match(/<h1[\s>]/g) || []).length === 1, 'exactly one <h1> must exist across the app')
need((allJsx.match(/<h4[\s>]/g) || []).length === 0, 'heading hierarchy must not skip to <h4>')
need(!/className="proj-row-title"/.test(projects) || projects.includes('<h3 className="proj-row-title"'),
  'card titles must be real headings')

// ── Canvas scene ────────────────────────────────────────────────────────
need(scene.includes('dot-matrix') || scene.includes('SPACING'), 'scene.js must keep the dot-matrix engine')
need(scene.includes('export function startHeroScene'), 'scene.js must export a mount function, not self-execute')
need(scene.includes('return () => {'), 'scene.js must return a teardown so React can unmount it')
need(/removeEventListener\('pointermove'/.test(scene), 'scene.js must remove its pointermove listener on teardown')

// ── Static-asset caching ────────────────────────────────────────────────
const headers = read('_headers')
need(headers.includes('immutable'), '_headers must define immutable caching for hashed assets')
need(headers.includes('/assets/*'), '_headers must cover the Vite /assets/* output path')

// ── Responsive: no hidden-scroll traps ─────────────────────────────────
// Both of these shipped as "infinite" horizontal scrollers on phones with the
// scrollbar suppressed, so content was simply absent with no way to know. The
// tab rule in particular was gated to min-width:900px while its own comment
// described a *mobile* problem. A selector audit can't catch this class — it
// needs the layout rule itself asserted.
need(!/\.workbench-tabs-container\{[^}]*overflow-x:\s*auto/.test(css),
  'workbench tabs must not be a hidden horizontal scroller (scrollbar is suppressed)')
// Gating the tab layout behind a min-width query is the regression itself, so
// assert the absence of that shape rather than one exact ordering of it: no
// min-width media query anywhere may mention the tab bar. A targeted regex
// for "@media(min-width:900px){.workbench-tabs" passed while the bug was
// present, because it only matched one particular brace/whitespace layout.
const minWidthBlocks = [...css.matchAll(/@media\s*\(\s*min-width[^)]*\)\s*\{/g)].map((m) => {
  let i = m.index + m[0].length
  let depth = 1
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') depth--
    i++
  }
  return css.slice(m.index, i)
})
need(!minWidthBlocks.some((b) => b.includes('.workbench-tabs')),
  'the tab layout must not be gated behind a min-width breakpoint — that hides tabs on phones')
need(/\.workbench-tabs\{[^}]*flex-wrap:\s*wrap/.test(css),
  'workbench tabs must wrap so all four are reachable without scrolling')

// The pipeline is a 940-unit viewBox. Below ~700px of rendered width the 13px
// node titles scale under ~10px and the sub-labels under ~7.5px, which is
// present-but-unreadable on a phone. Floor the width and signal that it pans.
const pipeFloor = css.match(/@media\s*\(max-width:\s*720px\)\{[\s\S]*?\.pipeline-card svg\{[^}]*min-width:\s*(\d+)px/)
need(!!pipeFloor, 'pipeline diagram must declare a min-width on narrow screens')
need(pipeFloor && +pipeFloor[1] >= 640,
  `pipeline min-width must keep node titles legible (got ${pipeFloor?.[1]}px; under ~640 the 13px titles render under 10px)`)
need(/\.pipeline-card\{[\s\S]*?mask-image/.test(css),
  'the panning pipeline needs an edge affordance — macOS/iOS scrollbars are invisible until you scroll')

// ── External CSS link ───────────────────────────────────────────────────
// styles.css used to be imported from main.jsx, so dev served it by JS
// injection and the document had no stylesheet link at all.
need(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']\/src\/styles\.css["']/.test(html),
  'index.html must link styles.css externally, not import it from JS')
need(!/import\s+['"]\.\/styles\.css['"]/.test(main),
  'main.jsx must not import the stylesheet — that defers CSS to the module graph')
need(!/import\s+['"]\.\/styles\.css['"]/.test(app),
  'no component may import the stylesheet; it belongs on the <link>')

// ── Mobile-only a11y traps ──────────────────────────────────────────────
// Both of these only appear below 640/720px, so they are invisible to a
// desktop-only audit and invisible in a desktop screenshot.
const nav = read('src/components/Nav.jsx')
need(/className="logo"[^>]*aria-label=/.test(nav),
  'the logo link needs an explicit aria-label: .brand-word is display:none under 640px, which leaves the link unnamed (axe link-name)')
need(/className="brand-dot"[^>]*aria-hidden/.test(nav),
  'the brand dot is decorative and must be aria-hidden')
need(/className="pipeline-card"[^>]*tabIndex=\{0\}/.test(workbench),
  'the pipeline card pans below 720px, so it must be keyboard-focusable (WCAG 2.1.1 / axe scrollable-region-focusable)')
need(/className="pipeline-card"[^>]*aria-label=/.test(workbench),
  'the focusable pipeline scroll region needs an accessible name')

// ── Resilience ──────────────────────────────────────────────────────────
// One render throw used to blank the entire page. The boundary must wrap the
// content, not sit inside it, and must keep the chrome reachable.
need(app.includes("import ErrorBoundary"), 'App must import the error boundary')
need(/<ErrorBoundary>[\s\S]*<Hero \/>[\s\S]*<Contact \/>[\s\S]*<\/ErrorBoundary>/.test(app),
  'ErrorBoundary must wrap the whole <main> content, hero through contact')
need(read('src/components/ErrorBoundary.jsx').includes('componentDidCatch'),
  'the error boundary must implement componentDidCatch to log the real stack')

// ── Dead CSS / vanilla leftovers ────────────────────────────────────────
// Every one of these shipped as a live-looking rule that matched nothing.
need(!css.includes('#contribGraph'),
  '#contribGraph is a dead id — the container is .activity-graph-frame')
need(!/\bh1 span\b/.test(css),
  'h1 span rules are dead: the name has not been split into spans')
need(!css.includes('.reveal.in'),
  '.reveal.in is dead — GSAP writes inline styles, it never adds the class')
need(!/\.more-item:hover h4/.test(css),
  '.more-item:hover must target h3 (the markup heading), not h4')
for (const stale of ['js/main.js', 'js/scene.js', 'style.min', 'main.min']) {
  need(!css.includes(stale) && !app.includes(stale),
    `no source may reference the deleted vanilla file "${stale}"`)
}

// ── Repo hygiene ────────────────────────────────────────────────────────
// The deploy docs survived the vanilla→Vite move with a pre-bundled css/ + js/
// layout and a "no build step" premise in three of five targets. A stale
// publish directory is the kind of thing that only fails after a deploy.
const gitignore = read('.gitignore')
need(/^dist\/$/m.test(gitignore), '.gitignore must ignore the build output')
need(/\.freebuff\//.test(gitignore),
  '.freebuff/ must be in .gitignore — it was only in .git/info/exclude, which is local to one clone')

const deployDoc = read('docs/free-deploy-options.md')
need(!/for = "\/css\/\*"/.test(deployDoc) && !deployDoc.includes('folder `/ (root)`'),
  'deploy doc must not still describe the pre-Vite css/ + js/ layout or a repo-root publish folder')
need(deployDoc.includes('Build output directory: `dist`'),
  'deploy doc must state `dist` as the Cloudflare build output directory')
need(!/no-build site/.test(deployDoc),
  'deploy doc must not still call this a no-build site')

const readme = read('README.md')
need(readme.includes('Responsive behaviour') && readme.includes('ErrorBoundary.jsx'),
  'README must document the responsive guarantees and the error boundary')

// ── Report ──────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`❌ Verification failed with ${errors.length} error(s):`)
  errors.forEach((e) => console.error('  - ' + e))
  process.exit(1)
}
console.log('✅ All verification checks passed.')
