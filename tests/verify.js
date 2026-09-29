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
need(source.includes('11 SOLO SYSTEMS') && source.includes('11 solo-built agent repositories'),
  'telemetry bar + console must both state the reconciled 11 solo systems')
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

// ── Report ──────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`❌ Verification failed with ${errors.length} error(s):`)
  errors.forEach((e) => console.error('  - ' + e))
  process.exit(1)
}
console.log('✅ All verification checks passed.')
