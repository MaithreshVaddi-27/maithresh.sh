import { useEffect, useRef, useState } from 'react'
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
  const [hidden, setHidden] = useState(false)
  // Read through a ref, not state: this effect owns the rAF loop and the two
  // cursor nodes, so depending on hover state tore both down and rebuilt them
  // on every pointerover — which also reset the lerp to -100 and made the
  // reticle visibly jump to the corner each time you crossed a link.
  const overPressable = useRef(false)

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
      const half = overPressable.current ? RING_ACTIVE : RING
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
      if (e.target.closest?.(PRESSABLE)) {
        overPressable.current = true
        ring.classList.add('is-active')
      }
      if (e.target.closest?.(TEXT_ENTRY)) setHidden(true)
    }
    const onOut = (e) => {
      if (e.target.closest?.(PRESSABLE)) {
        overPressable.current = false
        ring.classList.remove('is-active')
      }
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
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cursor-hidden', hidden)
  }, [hidden])
}
