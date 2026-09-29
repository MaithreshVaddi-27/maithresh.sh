import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { cpSync, mkdirSync } from 'node:fs'

// Cloudflare Pages serves dist/. The og-image and the ASCII portrait are
// referenced by absolute path from meta tags and the hero <img>, and Vite only
// processes assets it can statically resolve — so copy them across after build
// rather than duplicating them into public/.
const STATIC_FILES = ['assets', '_headers', 'robots.txt', 'sitemap.xml']

// Vite's default base is '/', which is correct for Cloudflare Pages (root
// domain) but wrong for a GitHub Pages *project* site, which is served from
// /<repo>/. Under a subpath every emitted /assets/* URL 404s and the page
// renders as a blank shell. Cloudflare builds set nothing and keep '/'; the
// GitHub Pages workflow sets VITE_BASE=/maithresh.sh/. The dev server also
// stays on '/' so `npm run dev` isn't tucked under a subpath.
const BASE = process.env.VITE_BASE || '/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    {
      name: 'copy-static-to-dist',
      closeBundle() {
        for (const entry of STATIC_FILES) {
          if (entry === 'assets') {
            mkdirSync('dist/assets', { recursive: true })
            cpSync('assets', 'dist/assets', { recursive: true })
          } else {
            cpSync(entry, `dist/${entry}`)
          }
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        // Keep the GSAP/ScrollTrigger pair and Lenis in their own chunk so a
        // content-only edit doesn't invalidate the animation vendor bundle.
        // Function form works on both rollup and rolldown (Vite 8).
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
        },
      },
    },
  },
})
