// Arcade loops for the contribution heatmap, split into their own async chunk
// after first paint (Suspense null in the renderer — nothing to show while
// arcade physics loads). The renderer never imports this file statically;
// geometry + brick pathing come from contribGeometry.js so the split holds.
//
// This chunk only ever loads when the renderer decided to play (!STILL), so
// the STILL guards below are belt-and-braces for a mid-session change, not
// the primary gate.

import { useEffect, useRef } from 'react'
import { reduceMotion } from '../hooks/useMotion'
import { CELL, LEFT_PAD, TOP_PAD, computeBricks } from './contribGeometry'

const SAVE_DATA = typeof window !== 'undefined'
  && (window.matchMedia('(prefers-reduced-data: reduce)').matches
    || navigator.connection?.saveData === true)
const STILL = reduceMotion || SAVE_DATA

export default function ArcadeActors({ frameRef, days, mode, onHit, onEat, onClear }) {
  usePacman(frameRef, days, mode, onHit, onEat, onClear)
  useBreakout(frameRef, days, mode, onHit)
  return null
}

// PAC-MAN: an ice-cyan chomper pathfinds the active bricks nearest-first,
// eats each one (flash + count plate + EATEN score), then the course restores
// and the loop replays — the reference arcade behaviour, non-destructive so
// the real history is never lost. Per frame: one group transform, one mouth
// path, one eye position, six trail coordinates — zero filters, parked
// off-screen and on tab-hide.
function usePacman(frameRef, days, mode, setHit, setEatenApi, setCleared) {
  const api = useRef({ setHit, setEatenApi, setCleared })
  api.current = { setHit, setEatenApi, setCleared }

  useEffect(() => {
    const frame = frameRef.current
    if (mode !== 'pacman' || STILL || !frame || days.length < 4) return
    const svg = frame.querySelector('svg')
    if (!svg) return
    const bricks = computeBricks(days)
    if (!bricks) return

    // Greedy nearest-neighbour tour from the leftmost brick — the
    // "opportunistic player" style: always chase the closest uneaten dot.
    const tour = []
    const remaining = new Set(bricks.map((_, i) => i))
    let cursor = bricks.reduce((a, b) => (a.x < b.x ? a : b))
    while (remaining.size) {
      let best = -1, bestD = Infinity
      for (const i of remaining) {
        const dx = bricks[i].x - cursor.x, dy = bricks[i].y - cursor.y
        const d = dx * dx + dy * dy
        if (d < bestD) { bestD = d; best = i }
      }
      remaining.delete(best)
      cursor = bricks[best]
      tour.push(best)
    }

    const ns = 'http://www.w3.org/2000/svg'
    const g = document.createElementNS(ns, 'g')
    g.setAttribute('class', 'pac-man')
    const body = document.createElementNS(ns, 'path')
    body.setAttribute('fill', '#bae6fd')
    body.setAttribute('opacity', '0.95')
    // Thin dark rim: lifts the chomper off the dark frame so it reads as a
    // character, not a pale blob, at any size.
    body.setAttribute('stroke', 'rgba(6,18,31,0.9)')
    body.setAttribute('stroke-width', '1')
    const eye = document.createElementNS(ns, 'circle')
    eye.setAttribute('r', String(CELL * 0.09))
    eye.setAttribute('fill', '#0d1015')
    g.append(body, eye)
    // Motion trail: three fading dots on the recent path. Same loop, six
    // attribute writes, zero filters — readability without the old cost.
    const trail = []
    for (let t = 0; t < 3; t++) {
      const c = document.createElementNS(ns, 'circle')
      c.setAttribute('r', String(CELL * (0.30 - t * 0.07)))
      c.setAttribute('fill', '#38bdf8')
      c.setAttribute('opacity', String([0.30, 0.18, 0.09][t]))
      trail.push(c)
    }
    const hist = []
    svg.append(...trail, g)

    const R = CELL * 0.72
    // Unrushed patrol pace (~2.4 cells/s): the chomper reads as grazing the
    // grid, not racing it — sprint legs still hurry across empty stretches.
    const BASE_SPEED = CELL * 2.4   // viewBox units per second
    let px = bricks[tour[0]].x - CELL * 3, py = bricks[tour[0]].y
    let heading = 0
    let leg = 0, chomp = 0, dwellTimer = 0, clearTimer = 0
    let eatenCount = 0, done = false
    let raf = 0, prev = performance.now(), onScreen = true
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0 })
    io.observe(frame)
    const onVis = () => { prev = performance.now() }
    document.addEventListener('visibilitychange', onVis)

    const eat = (b) => {
      api.current.setEatenApi((prevSet) => {
        if (prevSet.has(b.order)) return prevSet
        const next = new Set(prevSet)
        next.add(b.order)
        return next
      })
      api.current.setHit(b.order)
      clearTimeout(dwellTimer)
      dwellTimer = setTimeout(() => api.current.setHit(-1), 450)
      eatenCount++
      if (eatenCount >= bricks.length && !done) {
        done = true
        api.current.setCleared(true)
        clearTimer = setTimeout(() => {
          api.current.setEatenApi(new Set())
          api.current.setCleared(false)
          leg = 0
          eatenCount = 0
          done = false
          heading = 0
          px = bricks[tour[0]].x - CELL * 3
          py = bricks[tour[0]].y
        }, 1800)
      }
    }

    const draw = (facing) => {
      // Mouth half-angle oscillates 4°→30° at ~7Hz; the eye sits above the
      // facing axis so it reads at any rotation.
      const a = ((0.5 - 0.5 * Math.cos(chomp)) * 26 + 4) * Math.PI / 180
      const x1 = (R * Math.cos(a)).toFixed(2), y1 = (-R * Math.sin(a)).toFixed(2)
      const x2 = (R * Math.cos(a)).toFixed(2), y2 = (R * Math.sin(a)).toFixed(2)
      body.setAttribute('d', `M 0 0 L ${x1} ${y1} A ${R.toFixed(1)} ${R.toFixed(1)} 0 1 1 ${x2} ${y2} Z`)
      eye.setAttribute('cx', (R * 0.1).toFixed(2))
      eye.setAttribute('cy', (-R * 0.45).toFixed(2))
      g.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${(facing * 180 / Math.PI).toFixed(1)})`)
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - prev) / 1000, 0.1)
      prev = now
      if (!onScreen || document.hidden || done) return
      const target = bricks[tour[leg]]
      const dx = target.x - px, dy = target.y - py
      const dist = Math.hypot(dx, dy)
      chomp += dt * Math.PI * 2 * 7
      if (dist < 0.6) {
        eat(target)
        leg = (leg + 1) % tour.length
      } else {
        // Sprint long empty legs (up to 2.5×) so sparse crossings stay lively;
        // ease the heading toward the target instead of snapping, so turns
        // carve curves rather than corners.
        const speed = BASE_SPEED * (1 + Math.min(dist / 140, 1.5))
        const want = Math.atan2(dy, dx)
        let diff = want - heading
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        // Close in: stop carving and head straight, so the eased turn can
        // never orbit a brick it has almost reached.
        heading = dist < CELL * 0.6 ? want : heading + diff * Math.min(1, dt * 10)
        const stepLen = Math.min(dist, speed * dt)
        px += Math.cos(heading) * stepLen
        py += Math.sin(heading) * stepLen
      }
      draw(heading)
      hist.unshift({ x: px, y: py })
      if (hist.length > 12) hist.pop()
      trail.forEach((c, t) => {
        const p = hist[(t + 1) * 3] || hist[hist.length - 1]
        if (!p) return
        c.setAttribute('cx', p.x.toFixed(1))
        c.setAttribute('cy', p.y.toFixed(1))
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      clearTimeout(dwellTimer)
      clearTimeout(clearTimer)
      trail.forEach((c) => c.remove())
      g.remove()
    }
  }, [frameRef, days.length, mode])
}

// BREAKOUT: a probe beam ricochets through the year and pulses each day it
// strikes. Non-destructive — a brick lights and reports its count, then
// returns to rest — because erasing your own contribution history on a loop
// is a strange thing for a portfolio to do.
//
// Performance budget: beam core (gradient fill, zero filters) + halo + a
// three-dot trail moved via attributes, one rAF loop with fixed 60Hz
// substeps, parked off-screen and on tab-hide. Strike state is the only React
// traffic, and only on strike change.
function useBreakout(frameRef, days, mode, setHit) {
  const setHitRef = useRef(setHit)
  setHitRef.current = setHit

  useEffect(() => {
    const frame = frameRef.current
    if (mode !== 'breakout' || STILL || !frame || days.length < 4) return
    const svg = frame.querySelector('svg')
    if (!svg) return
    const bricks = computeBricks(days)
    if (!bricks) return
    // ViewBox-unit arena straight from the svg: same traversal rate on every
    // screen size, walls exactly at the frame edges.
    const W = svg.viewBox.baseVal.width || 1
    const H = svg.viewBox.baseVal.height || 1
    const padX = LEFT_PAD, padY = TOP_PAD

    const R = CELL * 0.28
    // Start on top of the hottest day, already moving into the densest
    // cluster — opening crossings of empty grid read as a stuck game.
    const home = bricks.reduce((a, b) => (b.count > a.count ? b : a), bricks[0])
    let px = home.x, py = home.y - CELL * 4
    let vx = 8.4, vy = 4.6
    // ~11 viewBox units/s (~0.8 cells/s): a calm drift across the year, not a
    // chase — the beam is ambience with strike reports, and at full pace it
    // crossed sparse stretches too urgently. Same rate on every screen width,
    // since viewBox units scale with the frame.
    const SPEED = CELL * 0.8
    const m = Math.hypot(vx, vy); vx = (vx / m) * SPEED; vy = (vy / m) * SPEED
    let holding = -1, dwell = 0
    // Coverage memory + steering: the set remembers struck bricks so the beam
    // can lean toward ground it hasn't covered yet. It lives in this closure
    // (not state) because the loop reads it 60×/s and must never re-render.
    const seen = new Set()
    let sinceNudge = 0

    const STEP = 1000 / 60
    // Generous reach (~1.6 cells): on a sparse calendar a strict radius can go
    // many seconds without a strike, which reads as a frozen game. The ring
    // still lands on the actual nearest brick, so strikes stay truthful.
    const reach = CELL * 1.6
    const cool = new Int16Array(bricks.length)   // frames until a brick can be struck again
    let acc = 0, prev = performance.now(), onScreen = true, raf = 0
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0 })
    io.observe(frame)
    const onVis = () => { prev = performance.now() }   // don't bank time while hidden
    document.addEventListener('visibilitychange', onVis)

    // Keep the beam inside the arena, flipping the velocity off whichever wall
    // it hit. Extracted so it can run after the step's displacement is pinned
    // (a bounce repositions the beam, which can nudge it past an edge).
    const walls = () => {
      if (px < padX + R) { px = padX + R; vx = Math.abs(vx) }
      if (px > W - R) { px = W - R; vx = -Math.abs(vx) }
      if (py < padY + R) { py = padY + R; vy = Math.abs(vy) }
      if (py > H - R) { py = H - R; vy = -Math.abs(vy) }
    }

    const step = () => {
      // Origin of this substep, so the frame's net displacement can be pinned
      // to SPEED at the tail.
      const ox = px, oy = py
      // Hungry steering, ~every 1s (60 substeps): blend half the velocity
      // toward the nearest unstruck brick. On a sparse calendar pure ricochet
      // can wander minutes of empty grid between strikes, which reads as a
      // frozen game — so the beam actively hunts. Contact physics is untouched
      // (it still bounces off whatever it hits), and once every brick has
      // been struck the memory clears and the hunt replays.
      if (++sinceNudge >= 60) {
        sinceNudge = 0
        if (seen.size >= bricks.length) seen.clear()
        let best = -1, bestD = Infinity
        for (let i = 0; i < bricks.length; i++) {
          if (seen.has(i)) continue
          const b = bricks[i]
          const dx = b.x - px, dy = b.y - py
          const d = dx * dx + dy * dy
          if (d < bestD) { bestD = d; best = i }
        }
        if (best >= 0 && bestD > 1) {
          const b = bricks[best]
          const d = Math.sqrt(bestD)
          const sp = Math.hypot(vx, vy) || SPEED
          vx = vx * 0.5 + ((b.x - px) / d) * sp * 0.5
          vy = vy * 0.5 + ((b.y - py) / d) * sp * 0.5
          const s2 = Math.hypot(vx, vy) || 1
          vx = (vx / s2) * sp; vy = (vy / s2) * sp
        }
      }
      px += vx; py += vy
      walls()
      for (let i = 0; i < bricks.length; i++) {
        if (cool[i] > 0) { cool[i]--; continue }
        const b = bricks[i]
        const dx = b.x - px, dy = b.y - py
        const dist = Math.hypot(dx, dy)
        if (dist > reach) continue
        const nx = dx / (dist || 1), ny = dy / (dist || 1)
        let dot = vx * nx + vy * ny
        // Grazing hit: the reflection barely turns the beam, so it would
        // re-collide next substep and vibrate. Force a real bounce.
        if (Math.abs(dot) < 0.22) { vx += nx * 0.3; vy += ny * 0.3; dot = vx * nx + vy * ny }
        vx -= 2 * dot * nx; vy -= 2 * dot * ny
        const s2 = Math.hypot(vx, vy) || 1
        vx = (vx / s2) * SPEED; vy = (vy / s2) * SPEED
        px = b.x + nx * reach; py = b.y + ny * reach
        cool[i] = 10
        seen.add(i)
        holding = b.order; dwell = 20
        break
      }
      // Constant speed. The collision handler snaps the beam to a fixed `reach`
      // from the brick, so before this the net per-frame move swung from ~0
      // (stalled) to ~3.7× SPEED (teleport) depending on the approach angle —
      // the "laggy, then suddenly very fast" feel. Rescale the frame's
      // displacement to exactly SPEED so a bounce only changes direction.
      const dx = px - ox, dy = py - oy
      const d = Math.hypot(dx, dy) || 1
      px = ox + (dx / d) * SPEED
      py = oy + (dy / d) * SPEED
      walls()
      if (dwell > 0) { dwell--; setHitRef.current(holding) }
      else if (holding !== -1) { holding = -1; setHitRef.current(-1) }
    }

    const ns = 'http://www.w3.org/2000/svg'
    const beam = document.createElementNS(ns, 'circle')
    beam.setAttribute('class', 'probe-beam')
    beam.setAttribute('fill', 'url(#beamCore)')
    beam.setAttribute('r', String(CELL * 0.34))
    const halo = document.createElementNS(ns, 'circle')
    halo.setAttribute('class', 'probe-beam-halo')
    halo.setAttribute('r', String(CELL * 0.62))
    // Motion trail: three fading dots on the recent path. Same loop, six
    // attribute writes, zero filters — readability without the old cost.
    const trail = []
    for (let t = 0; t < 3; t++) {
      const c = document.createElementNS(ns, 'circle')
      c.setAttribute('r', String(CELL * (0.26 - t * 0.06)))
      c.setAttribute('fill', '#7dd3fc')
      c.setAttribute('opacity', String([0.30, 0.18, 0.09][t]))
      trail.push(c)
    }
    const hist = []
    svg.append(...trail, halo, beam)

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      acc += Math.min(now - prev, 100)
      prev = now
      if (!onScreen || document.hidden) return
      while (acc >= STEP) { acc -= STEP; step() }
      beam.setAttribute('cx', px.toFixed(1))
      beam.setAttribute('cy', py.toFixed(1))
      halo.setAttribute('cx', px.toFixed(1))
      halo.setAttribute('cy', py.toFixed(1))
      hist.unshift({ x: px, y: py })
      if (hist.length > 12) hist.pop()
      trail.forEach((c, t) => {
        const p = hist[(t + 1) * 3] || hist[hist.length - 1]
        if (!p) return
        c.setAttribute('cx', p.x.toFixed(1))
        c.setAttribute('cy', p.y.toFixed(1))
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      trail.forEach((c) => c.remove())
      beam.remove(); halo.remove()
    }
  }, [frameRef, days.length, mode])
}
