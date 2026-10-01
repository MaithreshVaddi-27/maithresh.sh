import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduceMotion } from './useMotion'

// Thin instrument readout of document position. Exempt from reduced-motion: it's
// a direct status correlate of where the user already is, same category as a
// native progress bar, not an independent animation.
export function useScrollProgress() {
  useEffect(() => {
    const fill = document.getElementById('scrollProgressFill')
    if (!fill) return
    if (reduceMotion) return
    const tween = gsap.fromTo(
      fill,
      { width: '0%' },
      {
        width: '100%', ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
      }
    )
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [])
}

// Header condenses and the back-to-top pill appears past their thresholds.
export function useScrollChrome() {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 24)
        setShowTop(window.scrollY > 900)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return { scrolled, showTop }
}

// Highlights the nav link for whichever section occupies the reading band —
// a horizontal slice near the top, matching "as it becomes primary" rather
// than "as soon as its top pixel is visible". IntersectionObserver, no scroll
// listener, so it costs nothing between crossings.
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [ids])
  return active
}

// Live pointer telemetry readout in the top strip + specular highlight
// coordinates on the hovered workbench card. One passive listener, throttled
// to ~30fps for the text node.
export function usePointerTelemetry() {
  useEffect(() => {
    const el = document.getElementById('telemetry-ptr')
    let last = 0
    const onMove = (e) => {
      const now = performance.now()
      if (el && now - last > 33) {
        last = now
        el.textContent = `PTR: [X: ${String(Math.round(e.clientX)).padStart(4, '0')}, Y: ${String(Math.round(e.clientY)).padStart(4, '0')}]`
      }
      const shell = e.target.closest?.('.wb-shell')
      if (shell) {
        const r = shell.getBoundingClientRect()
        shell.style.setProperty('--mouse-x', `${Math.round(e.clientX - r.left)}px`)
        shell.style.setProperty('--mouse-y', `${Math.round(e.clientY - r.top)}px`)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

// Numerals ease from 0 to their authored value on first viewport entry,
// suffixes preserved. Skipped under reduced-motion.
export function useCountUp() {
  useEffect(() => {
    if (reduceMotion) return
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)
    const nodes = document.querySelectorAll('.hero-stat-n')
    if (!nodes.length) return
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          obs.unobserve(entry.target)
          const el = entry.target
          // Only pure numerals (optional single trailing '+') animate.
          // Anything else ('5 + 1', '8-stage') would tween through nonsense
          // intermediates ('0 + 1' … '3-stage'), so leave it static.
          const match = el.textContent.trim().match(/^(\d+)(\+)?$/)
          if (!match) return
          const target = parseInt(match[1], 10)
          const suffix = match[2] || ''
          const dur = 1100
          const t0 = performance.now()
          const step = (now) => {
            const p = Math.min((now - t0) / dur, 1)
            el.textContent = Math.round(target * easeOut(p)) + suffix
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        })
      },
      { threshold: 0.5 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])
}

export { ScrollTrigger }
