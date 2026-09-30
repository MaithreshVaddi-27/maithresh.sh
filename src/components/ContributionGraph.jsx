import { useEffect, useRef, useState } from 'react'
import { GITHUB } from '../data/content'
import snapshot from '../data/contributions.json'
import { reduceMotion } from '../hooks/useMotion'

// Palette aligned with the Flight Telemetry ice-cyan tokens. One continuous
// ramp, deepest sea → pale ice, so the peak tier reads as the brightest cyan
// rather than a detached white square. Level 0 is a visible outline rather
// than a 5%-white fill — at 8% density a near-invisible empty cell made the
// grid read as broken instead of sparse.
const LEVEL_COLOR = ['transparent', '#0c4a6e', '#0369a1', '#0284c7', '#38bdf8']
const HOT = '#bae6fd'
const EATEN_FILL = 'transparent'
const EATEN_STROKE = 'rgba(125,211,252,0.04)'
const CELL_STROKE = 'rgba(56,189,248,0.10)'
const CELL = 11, GAP = 3, LEFT_PAD = 28, TOP_PAD = 20
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// A month boundary can land 3 days after the previous one (the window starts
// 2025-09-28), which printed "Sep" and "Oct" on top of each other. Require this
// many columns between labels so they can never collide.
const MONTH_MIN_GAP = 3
const API = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'

const MODES = [
  { id: 'pacman', label: 'ᗧ PAC-MAN' },
  { id: 'breakout', label: '◉ BREAKOUT' },
]

export default function ContributionGraph() {
  // Paint from the committed snapshot on the first frame. The live endpoint is a
  // free third-party service that takes 1-3s and can vanish without notice;
  // making the primary conversion section wait on it — or collapse to a bare
  // text link when it does — is not a risk worth taking for a decorative graph.
  // The fetch still runs and upgrades the data when it succeeds.
  const [data, setData] = useState(snapshot)
  const [live, setLive] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 6000)
    fetch(API, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json() })
      .then((json) => {
        if (!json?.contributions?.length) throw new Error('no data')
        setData({ contributions: json.contributions, fetchedAt: new Date().toISOString().slice(0, 10) })
        setLive(true)
      })
      .catch((err) => {
        // A cleanup-triggered abort is not a failure. Without this guard
        // StrictMode's double-mount turns its own cleanup into a permanent
        // "couldn't reach the API" fallback even though the retry succeeds.
        if (err.name !== 'AbortError') setFailed(true)
      })
      .finally(() => clearTimeout(timer))
    return () => ctrl.abort()
  }, [])

  if (failed && !data?.contributions?.length) {
    return (
      <div className="activity-card">
        <p className="activity-fallback">
          Live GitHub activity — <a href={GITHUB} target="_blank" rel="noopener noreferrer">view on GitHub →</a>
        </p>
      </div>
    )
  }
  return <ActivityCard days={data.contributions} live={live} fetchedAt={data.fetchedAt} failed={failed} />
}

// Third-party payload used to be spliced in with innerHTML, which is why the
// vanilla build needed an escapeHtml() and a bespoke SVG-string builder. Here it
// renders as real JSX — third-party strings become text nodes, so there is
// nothing to escape and nothing to strip.
function ActivityCard({ days, live, fetchedAt, failed }) {
  const frameRef = useRef(null)
  const [mode, setMode] = useState('pacman')
  // hit: document-order index of the struck cell (identical to its index in
  // `flat`, which is built in document order), or -1 when nothing is struck.
  // The loops must report this order — never the day-index into `days` — or
  // strikes flash the wrong cell once inactive days intervene.
  const [hit, setHit] = useState(-1)
  const [cleared, setCleared] = useState(false)
  // Declared before the game hooks consume the setters below: referencing
  // `setEaten`/`setCleared` in a hook call above their `const` would throw a
  // TDZ ReferenceError and white-screen the whole section.
  // Session score: unique eaten/struck orders, summed by their real
  // contribution counts. Orders are document-order and stable, so the set
  // survives re-renders; it resets when the dataset itself changes.
  const [eaten, setEaten] = useState(() => new Set())
  useEffect(() => { setEaten(new Set()) }, [days])
  usePacman(frameRef, days, mode, setHit, setEaten, setCleared)
  useBreakout(frameRef, days, mode, setHit)

  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const padded = Array.from({ length: firstDow }, () => null).concat(days)
  const weeks = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  const width = LEFT_PAD + weeks.length * (CELL + GAP)
  const height = TOP_PAD + 7 * (CELL + GAP)

  // Cells in document order — each carries its index so "is this the one just
  // eaten/struck" is a comparison, not a DOM lookup.
  const flat = []
  const grid = weeks.map((week, wi) => week.map((d, di) => {
    if (!d) return null
    const count = Number(d.count) || 0
    const cell = {
      order: flat.length,
      x: LEFT_PAD + wi * (CELL + GAP),
      y: TOP_PAD + di * (CELL + GAP),
      color: LEVEL_COLOR[Number(d.level) | 0] || LEVEL_COLOR[0],
      count,
      title: `${count} contribution${count === 1 ? '' : 's'} on ${d.date}`,
    }
    flat.push(cell)
    return cell
  }))

  const eatenSum = flat.reduce((sum, c) => sum + (eaten.has(c.order) ? c.count : 0), 0)

  const counts = days.map((d) => Number(d.count) || 0)
  const active = counts.filter((c) => c > 0)
  const total = active.reduce((sum, c) => sum + c, 0)
  // Top quartile by volume: these days render in pale ice cyan — the
  // brightest point on the ramp, never a second hue.
  const hotFrom = active.toSorted((a, b) => a - b)[Math.floor(active.length * 0.75)] ?? Infinity
  // Best day, for the stats row: peak count plus a short human date.
  // A trailing "0 day streak" reads as failure on an honest sparse calendar;
  // the best day is informative on every calendar, sparse or dense.
  let best = { count: 0, label: '—' }
  days.forEach((d) => {
    const count = Number(d.count) || 0
    if (count > best.count) {
      const t = new Date(`${d.date}T00:00:00Z`)
      best = {
        count,
        label: `${MONTHS[t.getUTCMonth() + 1]} ${t.getUTCDate()}`,
      }
    }
  })

  const selectMode = (id) => {
    if (id === mode) return
    setMode(id)
    setHit(-1)
    setCleared(false)
    setEaten(new Set())
  }

  // Month label at the first column that opens a new month, spaced far enough
  // apart that adjacent labels can't overlap.
  const monthLabels = []
  let lastMonth = -1, lastCol = -MONTH_MIN_GAP
  weeks.forEach((week, wi) => {
    const firstReal = week.find(Boolean)
    if (!firstReal) return
    const d = new Date(`${firstReal.date}T00:00:00Z`)
    if (d.getUTCMonth() === lastMonth) return
    if (wi - lastCol < MONTH_MIN_GAP) return
    lastMonth = d.getUTCMonth()
    lastCol = wi
    monthLabels.push(
      <text key={`m${wi}`} className="clab" x={LEFT_PAD + wi * (CELL + GAP)} y="11">
        {MONTHS[d.getUTCMonth() + 1]}
      </text>
    )
  })

  const struck = hit >= 0 ? flat[hit] : null
  // Power-brick moment: strikes on top-quartile days erupt larger, in pale ice.
  const struckHot = !!struck && struck.count >= hotFrom
  // Top-row strikes would push the count plate above the viewBox (and into
  // the month labels) — clamp it inside.
  const plateTop = struck ? Math.max(struck.y - CELL - 10, 1) : 0

  return (
    <div className="activity-card">
      {/* The caption names the honest source: a committed snapshot, upgraded
          to live data when the fetch succeeds. The EATEN score is omitted
          under reduced-motion where no game runs — a permanent 0/total
          would read as broken. */}
      <p className="activity-caption">
        $ git log --author=maithresh --all --date=short{' '}
        <span>
          · {live ? 'live' : `snapshot ${fetchedAt}`}, last 12 months
          {failed && !live ? ' · live feed unreachable' : ''}
        </span>
        {!reduceMotion && <span> · EATEN {eatenSum}/{total}</span>}
        {cleared && <span> · COURSE CLEAR ↺ REPLAY</span>}
      </p>
      <div className="activity-stats">
        <span className="activity-stat"><b>{total}</b>contributions</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{active.length}</b>active days</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{best.count}</b>best day · {best.label}</span>
      </div>
      <div className="arcade-select" role="group" aria-label="Arcade game mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`arcade-btn${mode === m.id ? ' active' : ''}`}
            aria-pressed={mode === m.id}
            onClick={() => selectMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div ref={frameRef} className={`activity-graph-frame${reduceMotion ? '' : ' boot'}`}>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="View full GitHub activity for MaithreshVaddi-27">
          <div role="img" aria-label={`Maithresh Vaddi's live GitHub activity: ${total} contributions across ${active.length} active days in the last 12 months, peak ${Math.max(0, ...counts)} in one day.`}>
            <svg viewBox={`0 0 ${width} ${height}`}>
              {monthLabels}
              {DAYS.map((l, i) => l && (
                <text key={l} className="clab" x="0" y={TOP_PAD + i * (CELL + GAP) + 9}>{l}</text>
              ))}
              {grid.map((week, wi) => (
                <g className="cweek" key={wi} style={{ '--rd': `${wi * 40}ms` }}>
                  {week.map((cell, di) => cell && (
                    <rect
                      key={di}
                      x={cell.x} y={cell.y} width={CELL} height={CELL} rx="2"
                      fill={eaten.has(cell.order) ? EATEN_FILL : (cell.count >= hotFrom ? HOT : cell.color)}
                      stroke={eaten.has(cell.order) ? EATEN_STROKE : (cell.count > 0 ? CELL_STROKE : 'rgba(125,211,252,0.07)')}
                      strokeWidth="1"
                      opacity={struck && struck.order === cell.order ? 1 : undefined}
                    >
                      <title>{cell.title}</title>
                    </rect>
                  ))}
                </g>
              ))}
              {/* Impact readout: the one thing a static heatmap cannot do — tell
                  you what a specific day actually held, while it is being eaten. */}
              {struck && (
                <g className="brick-hit" pointerEvents="none">
                  {struckHot && (
                    <circle
                      cx={struck.x + CELL / 2} cy={struck.y + CELL / 2} r={CELL * 1.6}
                      fill="none" stroke={HOT} strokeWidth="1" opacity="0.45"
                    />
                  )}
                  <circle
                    cx={struck.x + CELL / 2} cy={struck.y + CELL / 2}
                    r={struckHot ? CELL * 1.15 : CELL * 0.85}
                    fill="none" stroke={struck.count >= hotFrom ? HOT : '#7dd3fc'}
                    strokeWidth={struckHot ? 2 : 1.5}
                  />
                  {/* Backing plate: the row above is often another active day, and a
                      bare number there was unreadable against the brick. */}
                  <rect
                    x={struck.x + CELL / 2 - 7} y={plateTop} width="14" height="11"
                    rx="2" fill="#0d1015" stroke="rgba(125,211,252,.35)" strokeWidth=".5"
                  />
                  <text
                    className="brick-hit-n" x={struck.x + CELL / 2}
                    y={plateTop + 8.5}
                  >{struck.count}</text>
                  {/* Brick-break shards: five ice-cyan sparks on fixed
                      golden-angle bearings from the strike point. Deterministic
                      per cell (seeded by order) — no RNG, stable across renders. */}
                  {[0, 1, 2, 3, 4].map((k) => {
                    const a = ((struck.order * 137 + k * 72) * Math.PI) / 180
                    const dist = CELL * (1.4 + (k % 3) * 0.5)
                    return (
                      <circle
                        key={k}
                        className="brick-shard"
                        cx={struck.x + CELL / 2} cy={struck.y + CELL / 2} r={1.4}
                        style={{
                          '--dx': `${(Math.cos(a) * dist).toFixed(1)}px`,
                          '--dy': `${(Math.sin(a) * dist).toFixed(1)}px`,
                        }}
                      />
                    )
                  })}
                </g>
              )}
            </svg>
          </div>
        </a>
        <div className="contrib-legend" aria-hidden="true">
          <span>Less</span>
          {/* One continuous ramp, deep sea → pale ice: the peak tier is the
              brightest stop on the same strip, never a detached swatch. */}
          <span className="legend-cells">{[...LEVEL_COLOR.slice(1), HOT].map((c, i) => <span key={i} style={{ background: c }} />)}</span>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

// Brick centres in rendered pixels, active days only — the only ground either
// game spends time on. Shared by both loops so the pathing math lives once.
function computeBricks(svg, days) {
  const box = svg.getBoundingClientRect()
  if (!box.width) return null
  const k = box.width / (svg.viewBox.baseVal.width || 1)
  const cellPx = CELL * k, gapPx = GAP * k
  const padX = LEFT_PAD * k, padY = TOP_PAD * k
  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const bricks = []
  days.forEach((d, i) => {
    if (Number(d.count) <= 0) return
    const p = i + firstDow
    bricks.push({
      // Flat-index of this day: `flat` is built from the padded array
      // ([firstDow nulls, ...days]) chunked in order, so day i sits at
      // flat[firstDow + i]. Reporting anything else (e.g. the active-only
      // rank) makes strikes flash the wrong cell — typically a zero-count
      // day, which is exactly the stuck "EATEN 0" symptom.
      order: firstDow + i,
      x: padX + Math.floor(p / 7) * (cellPx + gapPx) + cellPx / 2,
      y: padY + (p % 7) * (cellPx + gapPx) + cellPx / 2,
    })
  })
  return bricks.length >= 4 ? { bricks, cellPx, W: box.width, H: box.height, padX, padY } : null
}

// PAC-MAN: an ice-cyan chomper pathfinds the active bricks nearest-first,
// eats each one (flash + count plate + EATEN score), then the course restores
// and the loop replays — the reference arcade behaviour, non-destructive so
// the real history is never lost. Two SVG attributes per frame (group
// transform + mouth path), zero filters, parked off-screen and on tab-hide.
function usePacman(frameRef, days, mode, setHit, setEatenApi, setCleared) {
  const api = useRef({ setHit, setEatenApi, setCleared })
  api.current = { setHit, setEatenApi, setCleared }

  useEffect(() => {
    const frame = frameRef.current
    if (mode !== 'pacman' || reduceMotion || !frame || days.length < 4) return
    const svg = frame.querySelector('svg')
    if (!svg) return
    const geo = computeBricks(svg, days)
    if (!geo) return
    const { bricks, cellPx } = geo

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
    const eye = document.createElementNS(ns, 'circle')
    eye.setAttribute('r', String(Math.max(1, cellPx * 0.09)))
    eye.setAttribute('fill', '#0d1015')
    g.append(body, eye)
    svg.append(g)

    const R = Math.max(4, cellPx * 0.62)
    const SPEED = Math.max(60, cellPx * 7)   // rendered px per second
    let px = bricks[tour[0]].x - cellPx * 3, py = bricks[tour[0]].y
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
          px = bricks[tour[0]].x - cellPx * 3
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
      const facing = Math.atan2(dy, dx)
      chomp += dt * Math.PI * 2 * 7
      if (dist < 2.5) {
        eat(target)
        leg = (leg + 1) % tour.length
      } else {
        const stepLen = Math.min(dist, SPEED * dt)
        px += (dx / dist) * stepLen
        py += (dy / dist) * stepLen
      }
      draw(dist < 2.5 ? facing : Math.atan2(target.y - py, target.x - px))
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      clearTimeout(dwellTimer)
      clearTimeout(clearTimer)
      g.remove()
    }
  }, [frameRef, days.length, mode])
}

// BREAKOUT: a probe beam ricochets through the year and pulses each day it
// strikes. Non-destructive — a brick lights and reports its count, then
// returns to rest — because erasing your own contribution history on a loop
// is a strange thing for a portfolio to do.
//
// Performance budget: two plain SVG circles (core + halo, zero filters — the
// old drop-shadow glow repainted every frame) moved via cx/cy attributes, one
// rAF loop with fixed 60Hz substeps, parked off-screen and on tab-hide. Strike
// state is the only React traffic, and only on strike change.
function useBreakout(frameRef, days, mode, setHit) {
  const setHitRef = useRef(setHit)
  setHitRef.current = setHit

  useEffect(() => {
    const frame = frameRef.current
    if (mode !== 'breakout' || reduceMotion || !frame || days.length < 4) return
    const svg = frame.querySelector('svg')
    if (!svg) return
    const geo = computeBricks(svg, days)
    if (!geo) return
    const { bricks, cellPx, W, H, padX, padY } = geo

    const R = Math.max(3, cellPx * 0.28)
    let px = W * 0.5, py = padY + cellPx
    let vx = 0.31, vy = 0.17
    const m = Math.hypot(vx, vy); vx = (vx / m) * 0.36; vy = (vy / m) * 0.36
    let holding = -1, dwell = 0
    // Coverage memory + steering: the set remembers struck bricks so the beam
    // can lean toward ground it hasn't covered yet. It lives in this closure
    // (not state) because the loop reads it 60×/s and must never re-render.
    const seen = new Set()
    let sinceNudge = 0

    const STEP = 1000 / 60
    const reach = cellPx * 0.95
    const cool = new Int16Array(bricks.length)   // frames until a brick can be struck again
    let acc = 0, prev = performance.now(), onScreen = true, raf = 0
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { threshold: 0 })
    io.observe(frame)
    const onVis = () => { prev = performance.now() }   // don't bank time while hidden
    document.addEventListener('visibilitychange', onVis)

    const step = () => {
      // Coverage steering, ~every 4s (240 substeps): blend 15% of the
      // velocity toward the nearest unstruck brick. The ricochet feel
      // survives — the beam just stops re-sweeping covered ground, so
      // coverage reads as intentional rather than random drift.
      if (++sinceNudge >= 240) {
        sinceNudge = 0
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
          const sp = Math.hypot(vx, vy) || 0.36
          vx = vx * 0.85 + ((b.x - px) / d) * sp * 0.15
          vy = vy * 0.85 + ((b.y - py) / d) * sp * 0.15
          const s2 = Math.hypot(vx, vy) || 1
          vx = (vx / s2) * sp; vy = (vy / s2) * sp
        }
      }
      px += vx; py += vy
      if (px < padX + R) { px = padX + R; vx = Math.abs(vx) }
      if (px > W - R) { px = W - R; vx = -Math.abs(vx) }
      if (py < padY + R) { py = padY + R; vy = Math.abs(vy) }
      if (py > H - R) { py = H - R; vy = -Math.abs(vy) }
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
        vx = (vx / s2) * 0.36; vy = (vy / s2) * 0.36
        px = b.x + nx * reach; py = b.y + ny * reach
        cool[i] = 10
        seen.add(i)
        holding = b.order; dwell = 20
        break
      }
      if (dwell > 0) { dwell--; setHitRef.current(holding) }
      else if (holding !== -1) { holding = -1; setHitRef.current(-1) }
    }

    const ns = 'http://www.w3.org/2000/svg'
    const beam = document.createElementNS(ns, 'circle')
    beam.setAttribute('class', 'probe-beam')
    beam.setAttribute('r', String(Math.max(3.5, cellPx * 0.34)))
    const halo = document.createElementNS(ns, 'circle')
    halo.setAttribute('class', 'probe-beam-halo')
    halo.setAttribute('r', String(Math.max(6, cellPx * 0.62)))
    svg.append(halo, beam)

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
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      beam.remove(); halo.remove()
    }
  }, [frameRef, days.length, mode])
}
