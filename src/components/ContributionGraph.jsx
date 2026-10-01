import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { GITHUB } from '../data/content'
import snapshot from '../data/contributions.json'
import { reduceMotion } from '../hooks/useMotion'
import { CELL, GAP, LEFT_PAD, TOP_PAD } from './contribGeometry'

// Arcade loops load after first paint (nothing to show meanwhile, so the
// fallback is null) and never load under STILL — the heatmap is the content
// there. Static geometry import keeps working without the loop chunk.
const ArcadeActors = lazy(() => import('./ArcadeActors'))

// Palette aligned with the Flight Telemetry ice-cyan tokens. One continuous
// ramp, deepest sea → pale ice, so the peak tier reads as the brightest cyan
// rather than a detached white square. Level 0 is a visible outline rather
// than a 5%-white fill — at 8% density a near-invisible empty cell made the
// grid read as broken instead of sparse.
const LEVEL_COLOR = ['transparent', '#0c4a6e', '#0369a1', '#0284c7', '#38bdf8']
const HOT = '#bae6fd'
// Eaten bricks don't vanish — they fall back to a ghost tint so the grid keeps
// its structure and the eaten trail reads as a consumed path, not holes.
// The ghost must stay clearly BRIGHTER than a never-contributed day: at 0.06/0.07
// these matched the empty-cell stroke exactly, so a consumed cell looked identical
// to a blank one and the heatmap read as empty within seconds of play. The beam
// scores ~94% of the calendar in ~12s, so the trail is the main thing on screen.
const EATEN_FILL = 'rgba(56,189,248,0.15)'
const EATEN_STROKE = 'rgba(125,211,252,0.22)'
const CELL_STROKE = 'rgba(56,189,248,0.10)'
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// A month boundary can land 3 days after the previous one (the window starts
// 2025-09-28), which printed "Sep" and "Oct" on top of each other. Require this
// many columns between labels so they can never collide.
const MONTH_MIN_GAP = 3
const API = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'
// Data-Saver degrade: snapshot paints, live fetch and both game loops stay
// off — no metered bytes, no rAF cost. Same still-heatmap path reduced motion
// already takes.
const SAVE_DATA = typeof window !== 'undefined'
  && (window.matchMedia('(prefers-reduced-data: reduce)').matches
    || navigator.connection?.saveData === true);
const STILL = reduceMotion || SAVE_DATA;

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
    if (SAVE_DATA) return
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

  // Breakout scores through strikes: pacman feeds `eaten` directly in eat(),
  // the beam only ever reports `hit` — so this effect converts beam strikes
  // into score. Idempotent: re-adding an order returns the set unchanged, so
  // pacman's own hit flashes can safely pass through it too.
  useEffect(() => {
    if (mode !== 'breakout' || hit < 0) return
    const cell = flat[hit]
    if (!cell) return
    setEaten((prevSet) => {
      if (prevSet.has(cell.order)) return prevSet
      const next = new Set(prevSet)
      next.add(cell.order)
      return next
    })
  }, [hit, mode])

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
      {/* Game loops mount here once their chunk arrives — null fallback, and
          never fetched under STILL (reduced-motion / Data Saver). */}
      {!STILL && (
        <Suspense fallback={null}>
          <ArcadeActors
            frameRef={frameRef}
            days={days}
            mode={mode}
            onHit={setHit}
            onEat={setEaten}
            onClear={setCleared}
          />
        </Suspense>
      )}
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
        {!STILL && <span> · EATEN {eatenSum}/{total}</span>}
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
      <div ref={frameRef} className={`activity-graph-frame${STILL ? '' : ' boot'}`}>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="View full GitHub activity for MaithreshVaddi-27">
          <div role="img" aria-label={`Maithresh Vaddi's live GitHub activity: ${total} contributions across ${active.length} active days in the last 12 months, peak ${Math.max(0, ...counts)} in one day.`}>
            <svg viewBox={`0 0 ${width} ${height}`}>
              <defs>
                {/* White-hot core fading to ice edge: a premium glow look with
                    a flat fill — gradients don't repaint per frame the way
                    drop-shadow filters do. */}
                <radialGradient id="beamCore">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#bae6fd" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </radialGradient>
              </defs>
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
