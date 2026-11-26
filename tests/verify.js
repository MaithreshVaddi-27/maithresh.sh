import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(root, p), 'utf8')
const errors = []
const need = (cond, msg) => {
  if (!cond) errors.push(msg)
}

console.log('🧪 Verifying Systems Monograph Portfolio (Cobalt Blue + Editorial Serif)…')

const required = [
  'index.html',
  'package.json',
  'vite.config.js',
  'src/app/main.jsx',
  'src/app/App.jsx',
  'src/theme/monographTheme.js',
  'src/styles/tokens.css',
  'src/styles/monograph.css',
  'scripts/refresh-contributions.mjs',
  'assets/illustrations/terminal-portrait.svg',
  'src/components/layout/Navbar.jsx',
  'src/components/common/ErrorBoundary.jsx',
  'src/components/common/SectionSkeleton.jsx',
  'src/utils/sectionLoaders.js',
  'src/utils/viewTransition.js',
  'src/features/hero/HeroSection.jsx',
  'src/features/architecture/ArchitectureWorkbench.jsx',
  'src/features/systems/FeaturedSystems.jsx',
  'src/features/stack/StackMatrix.jsx',
  'src/features/workflows/AutomationsAndTeam.jsx',
  'src/features/background/BackgroundAndContact.jsx',
  'src/data/content.jsx',
]
required.forEach((f) => need(existsSync(join(root, f)), `Missing ${f}`))

const pkg = JSON.parse(read('package.json'))
for (const dep of [
  'react',
  'react-dom',
  '@astryxdesign/core',
  '@astryxdesign/theme-neutral',
  '@formkit/auto-animate',
  'lucide-react',
]) {
  need(Boolean(pkg.dependencies?.[dep]), `Missing dependency: ${dep}`)
}
need(!pkg.dependencies?.['@astryxdesign/theme-gothic'], 'Remove unused @astryxdesign/theme-gothic dependency')
need(!pkg.dependencies?.gsap && !pkg.dependencies?.lenis, 'Remove unused gsap/lenis dependencies')

const html = read('index.html')
need(html.includes('application/ld+json'), 'Missing JSON-LD structured data in index.html')
need(html.includes('rel="canonical"'), 'Missing canonical link in index.html')
need(html.includes('rel="stylesheet" href="/src/styles/tokens.css"'), 'Missing external tokens.css link in index.html')
need(html.includes('src="/src/app/main.jsx"'), 'Missing external main.jsx module script in index.html')
need(html.includes('property="og:title"'), 'Missing og:title in index.html')
need(html.includes('property="og:description"'), 'Missing og:description in index.html')
need(html.includes('name="twitter:description"'), 'Missing twitter:description in index.html')

const headers = read('_headers')
need(
  headers.includes("script-src 'self';") && headers.includes("object-src 'none';"),
  "_headers CSP must enforce script-src 'self' and object-src 'none'"
)
need(
  headers.includes('Cross-Origin-Opener-Policy: same-origin'),
  'Missing Cross-Origin-Opener-Policy header in _headers'
)

const css = read('src/styles/monograph.css')
need(css.includes('prefers-reduced-motion'), 'Missing prefers-reduced-motion support in monograph.css')

const srcFiles = []
;(function walk(dir) {
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name)
    if (entry.isDirectory()) walk(rel)
    else if (/\.(jsx?|css)$/.test(entry.name)) srcFiles.push(rel)
  }
})('src')

const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
for (const rel of srcFiles) {
  const body = stripComments(read(rel))
  need(!/["'`]\/assets\//.test(body), `${rel} hardcodes "/assets/..." — import assets via Vite`)
}

need(existsSync(join(root, 'dist/index.html')), 'Missing dist/index.html — run vite build first')
const distHtml = read('dist/index.html')
need(distHtml.includes('rel="ard"'), 'Missing ARD discovery link in dist/index.html')
need(distHtml.includes('rel="author"'), 'Missing author llms.txt link in dist/index.html')
need(distHtml.includes('rel="sitemap"'), 'Missing sitemap link in dist/index.html')
need(!distHtml.includes('data:application/') && !distHtml.includes('data:text/'), 'Unexpected inlined data URI in dist/index.html')
need(existsSync(join(root, 'dist/robots.txt')), 'Missing dist/robots.txt')
need(existsSync(join(root, 'dist/sitemap.xml')), 'Missing dist/sitemap.xml')
need(existsSync(join(root, 'dist/llms.txt')), 'Missing dist/llms.txt')
need(existsSync(join(root, 'dist/.well-known/ard.json')), 'Missing dist/.well-known/ard.json')
need(existsSync(join(root, 'dist/assets/brand/favicon.svg')), 'Missing dist/assets/brand/favicon.svg')

if (errors.length) {
  console.error('❌ Verification failed:')
  errors.forEach((e) => console.error('  - ' + e))
  process.exit(1)
}

console.log('✅ All verification checks passed.')
