import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Card grids that get the index-staggered reveal pass. Module scope, not an
// inline literal: a bare `[` after a `})` line is parsed as member access.
const GRID_SELECTORS = ['.proj-tabs', '.group-grid', '.stack-groups', '.cert-grid']

// One shared flag for the whole page: motion preference can't change mid-session
// without a reload, so this reads once at module load instead of per-component.
export const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lenis owns the scroll physics on fine-pointer desktops; on touch the native
// momentum scroll already wins and a second smoothing loop fights it (rubber-
// band lag, scroll-hijack feel). GSAP's ticker drives its rAF loop so easing
// and ScrollTrigger updates stay on one clock instead of fighting across two
// loops (the standard darkroom.engineering/GSAP pairing).
export function useSmoothScroll() {
  useEffect(() => {
    if (reduceMotion) return
    if (window.matchMedia('(pointer: coarse)').matches) return
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
//
// Re-runnable by design: below-fold sections arrive later via React.lazy, and
// the scan only ever processes unmarked elements (dataset.rv), so a re-scan
// picks up the newcomers without replaying what already played. The hero
// scrub is once-only for the same reason.
export function useReveals(rootRef, epoch = 0) {
  const ctxRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {}, root)
    ctxRef.current = ctx
    return () => {
      ctx.revert()
      ctxRef.current = null
    }
  }, [rootRef])

  useEffect(() => {
    const root = rootRef.current
    const ctx = ctxRef.current
    if (!root || !ctx) return
    ctx.add(() => {
      if (!reduceMotion) {
        // Hero content scrubs up and out as the hero leaves the viewport, tied
        // to scroll position rather than a fixed-duration tween.
        const heroInner = root.querySelector('.hero-inner')
        if (heroInner && !heroInner.dataset.rvHero) {
          heroInner.dataset.rvHero = '1'
          gsap.to('.hero-inner', {
            y: 140,
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      }

      // Grid cards are excluded here and get the index-staggered pass below, so
      // they aren't animated twice.
      const REVEAL = '.reveal:not(.group-card):not(.stack-card):not(.cert-card)'
      gsap.utils.toArray(REVEAL).forEach((el) => {
        if (el.dataset.rv) return
        el.dataset.rv = '1'
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
          if (!child.classList.contains('reveal')) return
          if (child.dataset.rv) return
          child.dataset.rv = '1'
          // Reduced motion means no animation — NOT "no reveal". The `.reveal`
          // base style is opacity:0, so bailing out here left every project row,
          // stack card, group card, and cert card permanently invisible for
          // anyone with the setting on. Show them statically instead.
          if (reduceMotion) {
            gsap.set(child, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' })
            return
          }
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
      const term = root.querySelector('.terminal')
      if (term && !term.dataset.rv) {
        term.dataset.rv = '1'
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
      }
    })
  }, [rootRef, epoch])
}
