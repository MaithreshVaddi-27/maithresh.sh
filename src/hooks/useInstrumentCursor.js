import { useEffect, useState } from 'react'
import { reduceMotion } from './useMotion'

const DOT = 3
const RING = 15
const RING_ACTIVE = 23
const PRESSABLE =
  'a, button, [role="tab"], [role="button"], .cmd-console-item, input[type="checkbox"], input[type="radio"], summary'
const TEXT_ENTRY = 'input, textarea, select, [contenteditable]'

// Instrument cursor: a sensor dot tracking the pointer 1:1 plus a lerped
// reticle that widens over anything pressable. One rAF loop, transform-only,
// parked while the tab is hidden. Never on touch pointers, reduced-motion, or
// during text entry (the native I-beam is preserved).
export function useInstrumentCursor() {
  const [overPressable, setOverPressable] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || reduceMotion) return

    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    dot.setAttribute('aria-hidden', 'true')
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    ring.setAttribute('aria-hidden', 'true')
    document.body.append(dot, ring)

    let mx = -100, my = -100, rx = -100, ry = -100
    let shown = false, running = false, raf = 0

    const place = () => {
      dot.style.transform = `translate(${mx - DOT}px, ${my - DOT}px)`
      rx += (mx - rx) * 0.2
      ry += (my - ry) * 0.2
      const half = overPressable ? RING_ACTIVE : RING
      ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`
      if (running) raf = requestAnimationFrame(place)
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(place)
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (shown) return
      shown = true
      document.body.classList.add('cursor-on')
      dot.style.opacity = '1'
      ring.style.opacity = '1'
      start()
    }
    const onOver = (e) => {
      if (e.target.closest?.(PRESSABLE)) setOverPressable(true)
      if (e.target.closest?.(TEXT_ENTRY)) setHidden(true)
    }
    const onOut = (e) => {
      if (e.target.closest?.(PRESSABLE)) setOverPressable(false)
      if (e.target.closest?.(TEXT_ENTRY)) setHidden(false)
    }
    const onVisibility = () => (document.hidden ? stop() : shown && start())
    const onLeave = () => setHidden(true)
    const onEnter = () => setHidden(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    document.addEventListener('visibilitychange', onVisibility)
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerenter', onEnter)

    return () => {
      stop()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('visibilitychange', onVisibility)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerenter', onEnter)
      dot.remove()
      ring.remove()
    }
  }, [overPressable])

  useEffect(() => {
    document.body.classList.toggle('cursor-hidden', hidden)
  }, [hidden])
}
