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
      name: 'copy-static-to-dist',
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
    assetsInlineLimit: 2048,
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
