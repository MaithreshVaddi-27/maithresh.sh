import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Card grids that get the index-staggered reveal pass. Module scope, not an
// inline literal: a bare `[` after a `})` line is parsed as member access.
const GRID_SELECTORS = ['.proj-list', '.group-grid', '.stack-groups', '.cert-grid']

// One shared flag for the whole page: motion preference can't change mid-session
// without a reload, so this reads once at module load instead of per-component.
export const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lenis owns the scroll physics; GSAP's ticker drives its rAF loop so easing and
// ScrollTrigger updates stay on one clock instead of fighting across two loops
// (the standard darkroom.engineering/GSAP pairing).
export function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion) return
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}

// Hero scrub, section reveals, per-grid stagger, terminal boot — all scoped to
// one gsap.context so `revert()` kills every ScrollTrigger on unmount.
export function useReveals(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      if (!reduceMotion) {
        // Hero content scrubs up and out as the hero leaves the viewport, tied
        // to scroll position rather than a fixed-duration tween.
        gsap.to('.hero-inner', {
          y: 140,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        })
      }

      // Grid cards are excluded here and get the index-staggered pass below, so
      // they aren't animated twice.
      const REVEAL = '.reveal:not(.proj-row):not(.group-card):not(.stack-card):not(.cert-card)'
      gsap.utils.toArray(REVEAL).forEach((el) => {
        if (reduceMotion) {
          gsap.set(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' })
          return
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.92, filter: 'blur(6px)' },
          {
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            duration: 1.0, ease: 'back.out(1.4)',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
          }
        )
      })

      GRID_SELECTORS.forEach((sel) => {
        const grid = root.querySelector(sel)
        if (!grid) return
        Array.from(grid.children).forEach((child, i) => {
          if (!child.classList.contains('reveal') || reduceMotion) return
          gsap.fromTo(
            child,
            { opacity: 0, y: 50, scale: 0.92, filter: 'blur(6px)' },
            {
              opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
              duration: 1.0, ease: 'back.out(1.4)', delay: i * 0.08,
              scrollTrigger: { trigger: child, start: 'top 90%', toggleActions: 'play none none none' },
              overwrite: true,
            }
          )
        })
      })

      // Terminal lines step in as the block scrolls into view rather than
      // appearing all at once with the rest of the section.
      const lines = gsap.utils.toArray('.terminal .t-line')
      if (lines.length) {
        if (reduceMotion) {
          gsap.set(lines, { opacity: 1, x: 0 })
        } else {
          gsap.set(lines, { opacity: 0, x: -8 })
          ScrollTrigger.create({
            trigger: '.terminal', start: 'top 82%', once: true,
            onEnter: () => gsap.to(lines, { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: 'power2.out' }),
          })
        }
      }
    }, root)

    return () => ctx.revert()
  }, [rootRef])
}
