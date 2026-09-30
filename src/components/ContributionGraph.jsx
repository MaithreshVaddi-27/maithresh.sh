import { useEffect, useState } from 'react'
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
const CELL_STROKE = 'rgba(56,189,248,0.10)'
const CELL = 11, GAP = 3, LEFT_PAD = 28, TOP_PAD = 20
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// A month boundary can land 3 days after the previous one (the window starts
// 2025-09-28), which printed "Sep" and "Oct" on top of each other. Require this
// many columns between labels so they can never collide.
const MONTH_MIN_GAP = 3
const API = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'

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
  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const padded = Array.from({ length: firstDow }, () => null).concat(days)
  const weeks = []
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7))

  const width = LEFT_PAD + weeks.length * (CELL + GAP)
  const height = TOP_PAD + 7 * (CELL + GAP)

  // Cells render straight from the week grid; hover tooltips come from the
  // native <title> inside each rect — no JS loop, no per-frame DOM writes.
  const grid = weeks.map((week, wi) => week.map((d, di) => {
    if (!d) return null
    const count = Number(d.count) || 0
    const cell = {
      x: LEFT_PAD + wi * (CELL + GAP),
      y: TOP_PAD + di * (CELL + GAP),
      color: LEVEL_COLOR[Number(d.level) | 0] || LEVEL_COLOR[0],
      count,
      title: `${count} contribution${count === 1 ? '' : 's'} on ${d.date}`,
    }
    return cell
  }))

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

  return (
    <div className="activity-card">
      {/* The caption names the honest source: a committed snapshot, upgraded
          to live data when the fetch succeeds. The stats row reads
          total / active days / best day — no streak that punishes an
          honest sparse calendar. */}
      <p className="activity-caption">
        $ git log --author=maithresh --all --date=short{' '}
        <span>
          · {live ? 'live' : `snapshot ${fetchedAt}`}, last 12 months
          {failed && !live ? ' · live feed unreachable' : ''}
        </span>
      </p>
      <div className="activity-stats">
        <span className="activity-stat"><b>{total}</b>contributions</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{active.length}</b>active days</span>
        <span className="telem-sep">//</span>
        <span className="activity-stat"><b>{best.count}</b>best day · {best.label}</span>
      </div>
      <div className={`activity-graph-frame${reduceMotion ? '' : ' boot'}`}>
        {/* Ambient sheen sweep — CSS-only, transform on one layer, no JS loop.
            The .boot hook (motion-safe only) plus the reduced-motion guard in
            CSS decide whether it ever paints. */}
        <span className="graph-sheen" aria-hidden="true" />
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
                      fill={cell.count >= hotFrom ? HOT : cell.color}
                      stroke={cell.count > 0 ? CELL_STROKE : 'rgba(125,211,252,0.07)'}
                      strokeWidth="1"
                    >
                      <title>{cell.title}</title>
                    </rect>
                  ))}
                </g>
              ))}
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

