import { defineTheme } from '@astryxdesign/core/theme'
import { themes, defaultThemeSlug } from '../astryx-themes'

const baseTheme = themes[defaultThemeSlug]

/**
 * Systems Monograph (Cobalt Blue + Newsreader Editorial Serif) theme.
 * Extends Astryx's dark gothic foundation with warm obsidian surfaces,
 * bone-white editorial ink, Cobalt Blue accents, and optical Newsreader headings.
 */
export const monographTheme = defineTheme({
  name: 'systems-monograph-cobalt',
  extends: baseTheme,
  tokens: {
    '--color-background-body': ['#0b0d11', '#0b0d11'],
    '--color-background-surface': ['#11141b', '#11141b'],
    '--color-background-card': ['#141821', '#141821'],
    '--color-background-muted': ['#181d28', '#181d28'],
    '--color-text-primary': ['#f4f2ed', '#f4f2ed'],
    '--color-text-secondary': ['#a1a8b5', '#a1a8b5'],
    '--color-text-accent': ['#60a5fa', '#60a5fa'],
    '--color-accent': ['#3b82f6', '#3b82f6'],
    '--color-on-accent': ['#ffffff', '#ffffff'],
    '--color-border': ['#202634', '#202634'],
    '--color-border-emphasized': ['#334155', '#334155'],
    '--color-success': ['#60a5fa', '#60a5fa'],
    '--color-warning': ['#fbbf24', '#fbbf24'],
    '--color-error': ['#ef4444', '#ef4444'],
    '--color-info': ['#60a5fa', '#60a5fa'],
    '--font-family-body': "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    '--font-family-heading': "'Newsreader Variable', Georgia, serif",
    '--font-family-code': "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
    '--radius-inner': '6px',
    '--radius-element': '8px',
    '--radius-container': '12px',
  },
})
