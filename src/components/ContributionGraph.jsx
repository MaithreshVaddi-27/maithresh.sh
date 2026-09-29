import { useEffect, useState } from 'react'
import { GITHUB } from '../data/content'
import { reduceMotion } from '../hooks/useMotion'

// Palette aligned with the Flight Telemetry ice-cyan tokens.
const LEVEL_COLOR = ['rgba(255,255,255,0.05)', '#0369a1', '#0284c7', '#38bdf8', '#7dd3fc']
const CELL_STROKE = 'rgba(255,255,255,0.05)'
const CELL = 11, GAP = 3, LEFT_PAD = 28, TOP_PAD = 18
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const API = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'
const CACHE = 'contrib-cache-v1'

export default function ContributionGraph() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE)
    if (cached) {
      try { return setData(JSON.parse(cached)) } catch { sessionStorage.removeItem(CACHE) }
    }
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)
    fetch(API, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error('bad response'); return r.json() })
      .then((json) => {
        if (!json?.contributions?.length) throw new Error('no data')
        sessionStorage.setItem(CACHE, JSON.stringify(json))
        setData(json)
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

  if (failed) {
    return (
      <div className="activity-card">
        <p className="activity-fallback">
          Live GitHub activity — <a href={GITHUB} target="_blank" rel="noopener">view on GitHub →</a>
        </p>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="activity-card">
        <p className="activity-fallback">Loading activity…</p>
      </div>
    )
  }
  return <ActivityCard days={data.contributions} />
}

// Third-party payload used to be spliced in with innerHTML, which is why the
// vanilla build needed an escapeHtml() and a bespoke SVG-string builder. Here it
// renders as real JSX — third-party strings become text nodes, so there is
// nothing to escape and nothing to strip.
function ActivityCard({ days }) {
  const [head, setHead] = useState(-1)
  useSnake(setHead)

  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const padded = Array.from({ length: firstDow }, () => null).concat(days)
  const weeks = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  const width = LEFT_PAD + weeks.length * (CELL + GAP)
  const height = TOP_PAD + 7 * (CELL + GAP)

  // Cells in document order — the snake walks this list, and each cell carries
  // its index so "is this the head" is a comparison, not a DOM lookup.
  const flat = []
  const grid = weeks.map((week, wi) => week.map((d, di) => {
    if (!d) return null
    const count = Number(d.count) || 0
    const cell = {
      order: flat.length,
      x: LEFT_PAD + wi * (CELL + GAP),
      y: TOP_PAD + di * (CELL + GAP),
      color: LEVEL_COLOR[Number(d.level) | 0] || LEVEL_COLOR[0],
      title: `${count} contribution${count === 1 ? '' : 's'} on ${d.date}`,
    }
    flat.push(cell)
    return cell
  }))

  const counts = days.map((d) => Number(d.count) || 0)
  const active = counts.filter((c) => c > 0)
  let streak = 0
  for (let i = counts.length - 1; i >= 0; i--) {
    if (counts[i] > 0) streak++
    else break
  }
  const total = active.reduce((sum, c) => sum + c, 0)

  // Month label at the first column that opens a new month.
  const monthLabels = []
  let lastMonth = -1
  weeks.forEach((week, wi) => {
    const firstReal = week.find(Boolean)
    if (!firstReal) return
    const d = new Date(`${firstReal.date}T00:00:00Z`)
    if (d.getUTCMonth() === lastMonth) return
    lastMonth = d.getUTCMonth()
    monthLabels.push(
      <text key={`m${wi}`} className="clab" x={LEFT_PAD + wi * (CELL + GAP)} y="10">
        {MONTHS[d.getUTCMonth() + 1]}
      </text>
    )
  })

  return (
    <div className="activity-card">
      <p className="activity-caption">
        $ git log --author=maithresh --all --oneline | wc -l <span>· live, last 12 months</span>
      </p>
      <div className="activity-stats">
        <span className="activity-stat"><b>{total}</b>contributions</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{active.length}</b>active days</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{streak}</b>day streak</span>
      </div>
      <div className={`activity-graph-frame${reduceMotion ? '' : ' boot'}`}>
        <a href={GITHUB} target="_blank" rel="noopener" aria-label="View full GitHub activity for MaithreshVaddi-27">
          <div role="img" aria-label="Maithresh Vaddi's live GitHub contribution graph">
            <svg viewBox={`0 0 ${width} ${height}`}>
              {monthLabels}
              {DAYS.map((l, i) => l && (
                <text key={l} className="clab" x="0" y={TOP_PAD + i * (CELL + GAP) + 9}>{l}</text>
              ))}
              {/* One <g class="cweek"> per calendar week so the boot reveal can
                  stagger columns left→right (see .activity-graph-frame.boot). */}
              {grid.map((week, wi) => (
                <g className="cweek" key={wi} style={{ '--rd': `${wi * 70}ms` }}>
                  {week.map((cell, di) => cell && (
                    <rect
                      key={di}
                      x={cell.x} y={cell.y} width={CELL} height={CELL} rx="2"
                      fill={cell.order === head ? '#7dd3fc' : cell.color}
                      stroke={cell.order === head ? '#7dd3fc' : CELL_STROKE}
                      strokeWidth="1"
                    >
                      <title>{cell.title}</title>
                    </rect>
                  ))}
                </g>
              ))}
              {head >= 0 && flat[head] && (
                <circle cx={flat[head].x} cy={flat[head].y} r="7" className="snake-head" />
              )}
            </svg>
          </div>
        </a>
        <div className="contrib-legend" aria-hidden="true">
          <span>Less</span>
          <span className="legend-cells">{LEVEL_COLOR.map((c, i) => <span key={i} />)}</span>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}

// Cyan sensor-snake loops the heatmap cell by cell. Decorative: skipped under
// reduced-motion, parked while the card is off-screen or the tab is hidden.
function useSnake(setHead) {
  useEffect(() => {
    const frame = document.querySelector('.activity-graph-frame')
    const count = frame?.querySelectorAll('.cweek rect').length ?? 0
    if (reduceMotion || count < 8) return
    let idx = 0, rest = 0, onScreen = true
    const STEP_MS = 90, REST_TICKS = 45
    const observer = frame
      ? new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting }, { threshold: 0 })
      : null
    if (observer) observer.observe(frame)
    const timer = setInterval(() => {
      if (document.hidden || !onScreen) return
      if (rest > 0) { rest--; return }
      setHead(idx)
      if (++idx >= count) { idx = 0; rest = REST_TICKS; setHead(-1) }
    }, STEP_MS)
    return () => { clearInterval(timer); observer?.disconnect() }
  }, [setHead])
}
