import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { cpSync, mkdirSync } from 'node:fs'

const STATIC_ENTRIES = ['assets', '_headers', 'robots.txt', 'sitemap.xml', 'llms.txt', '.well-known']
const BASE = process.env.VITE_BASE || '/'

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    {
      name: 'copy-static-and-external-links',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const links = [
            `<link rel="ard" href="${BASE}.well-known/ard.json" type="application/json">`,
            `<link rel="author" href="${BASE}llms.txt" type="text/markdown">`,
            `<link rel="sitemap" type="application/xml" title="Sitemap" href="${BASE}sitemap.xml">`,
          ].join('\n')
          return html.replace('</head>', `${links}\n</head>`)
        },
      },
      closeBundle() {
        for (const entry of STATIC_ENTRIES) {
          if (entry === 'assets' || entry === '.well-known') {
            mkdirSync(`dist/${entry}`, { recursive: true })
            cpSync(entry, `dist/${entry}`, { recursive: true })
          } else {
            cpSync(entry, `dist/${entry}`)
          }
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
          if (id.includes('node_modules/@astryxdesign') || id.includes('node_modules/@stylexjs')) {
            return 'astryx-ui'
          }
        },
      },
    },
  },
})
