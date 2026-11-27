import { useEffect, useMemo, useRef, useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { Divider } from '@astryxdesign/core/Divider'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { Link } from '@astryxdesign/core/Link'
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl'
import { Spinner } from '@astryxdesign/core/Spinner'
import { StatusDot } from '@astryxdesign/core/StatusDot'
import { Mail } from 'lucide-react'
import { CERTS, CONTACT_LINKS } from '../../data/sections'
import contribSnapshot from '../../data/contributions.json'
import {
  buildHeatmapGrid,
  computeContributionStats,
  formatContributionDate,
} from '../../utils/contribStats'
import { runViewTransition } from '../../utils/viewTransition'

const CONTRIB_ENDPOINT = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'
const EMAIL_ADDRESS = 'maithreshvaddi16@gmail.com'
const WEEKDAY_LABELS = [
  [1, 'Mon'],
  [3, 'Wed'],
  [5, 'Fri'],
]
const LEVEL_LABELS = ['No commits', 'Light', 'Moderate', 'High', 'Peak sprint']

export default function BackgroundAndContact() {
  const [contribState, setContribState] = useState(() => ({
    total: contribSnapshot.total,
    fetchedAt: contribSnapshot.fetchedAt,
    contributions: contribSnapshot.contributions || [],
    isLive: false,
  }))
  const [isSyncingLive, setIsSyncingLive] = useState(
    () => typeof navigator === 'undefined' || !navigator.connection?.saveData
  )
  const [viewMode, setViewMode] = useState('12m')
  const [hoveredDay, setHoveredDay] = useState(null)
  const [hoveredMonth, setHoveredMonth] = useState(null)
  const [hoverLevel, setHoverLevel] = useState(null)
  const [lockedLevel, setLockedLevel] = useState(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const copyTimerRef = useRef(null)
  const contribWrapRef = useRef(null)
  const [stageAnimateRef] = useAutoAnimate({ duration: 220 })

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) {
      return undefined
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 6000)

    fetch(CONTRIB_ENDPOINT, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !Array.isArray(data.contributions) || data.contributions.length < 300) {
          return
        }
        const total =
          typeof data.total?.lastYear === 'number'
            ? data.total.lastYear
            : data.contributions.reduce((sum, item) => sum + (item.count || 0), 0)
        const lastDate = data.contributions.at(-1)?.date || contribSnapshot.fetchedAt
        setContribState({
          total,
          fetchedAt: lastDate,
          contributions: data.contributions,
          isLive: true,
        })
      })
      .catch(() => {
        // Keep bundled snapshot silently when offline or timed out
      })
      .finally(() => {
        window.clearTimeout(timeoutId)
        setIsSyncingLive(false)
      })

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const node = contribWrapRef.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.14 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current)
      }
    }
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS)
      setCopiedEmail(true)
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current)
      }
      copyTimerRef.current = window.setTimeout(() => setCopiedEmail(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL_ADDRESS}`
    }
  }

  const handleViewChange = (nextMode) => {
    runViewTransition(() => {
      setViewMode(nextMode)
      setHoveredDay(null)
      setHoveredMonth(null)
    })
  }

  const { contributions, total, fetchedAt, isLive } = contribState
  const stats = useMemo(() => computeContributionStats(contributions), [contributions])
  const heatmapMode = viewMode === '90d' ? '90d' : '12m'
  const grid = useMemo(
    () => buildHeatmapGrid(contributions, heatmapMode),
    [contributions, heatmapMode]
  )

  const activeLevel = hoverLevel !== null ? hoverLevel : lockedLevel
  const is90d = viewMode === '90d'
  const windowTotal = is90d ? stats.recent90Total : total
  const windowDaysCount = is90d ? grid.days.length : contributions.length
  const windowActiveDays = is90d ? stats.recent90ActiveDays : stats.activeDays
  const activeRatio = windowDaysCount > 0 ? Math.round((windowActiveDays / windowDaysCount) * 100) : 0

  const step = is90d ? 16 : 13
  const cellSize = is90d ? 12 : 10
  const gutterX = 28
  const topAxisY = 16
  const svgWidth = gutterX + grid.totalCols * step - (step - cellSize)
  const svgHeight = topAxisY + 7 * step - (step - cellSize)

  let readoutText = `Peak: ${stats.peakDay.count} commits on ${formatContributionDate(
    stats.peakDay.date
  )} · Last 30d: ${stats.recent30Total} · Hover cells or swatches to inspect`
  let readoutLevel = 4

  if (hoveredDay) {
    const noun = hoveredDay.count === 1 ? 'contribution' : 'contributions'
    const lvlDesc = LEVEL_LABELS[hoveredDay.level] || LEVEL_LABELS[0]
    readoutText = `${formatContributionDate(hoveredDay.date)} · ${hoveredDay.count} ${noun} · ${lvlDesc}`
    readoutLevel = hoveredDay.level
  } else if (hoveredMonth) {
    const noun = hoveredMonth.count === 1 ? 'contribution' : 'contributions'
    readoutText = `${hoveredMonth.label} ${hoveredMonth.year} · ${hoveredMonth.count} ${noun} across ${hoveredMonth.activeDays} active days`
    let monthLvl = 3
    if (hoveredMonth.count === 0) monthLvl = 0
    else if (hoveredMonth.count >= 80) monthLvl = 4
    readoutLevel = monthLvl
  } else if (activeLevel !== null) {
    const matchingDays = grid.days.filter((d) => d.level === activeLevel).length
    readoutText = `Intensity ${activeLevel}/4 (${LEVEL_LABELS[activeLevel]}) · ${matchingDays} days highlighted`
    readoutLevel = activeLevel
  }

  return (
    <>
      <section id="background" className="mono-section">
        <div className="monograph-container">
          <div className="section-header-row">
            <Heading level={2} className="section-title">
              Education &amp; Applied Training
            </Heading>
            <span className="section-index-meta">KMIT 2023–2027 · 3 CREDENTIALS</span>
          </div>

          <article className="ledger-entry ledger-entry--spaced">
            <div className="edu-header">
              <div className="edu-main">
                <Heading level={3} size="lg" className="editorial-heading">
                  Keshav Memorial Institute of Technology (KMIT)
                </Heading>
                <p className="edu-degree">
                  B.Tech, Computer Science and Engineering — <strong>CGPA 7.96/10</strong>
                </p>
                <p className="edu-courses">
                  Data Structures &amp; Algorithms · Operating Systems · DBMS · Computer Networks ·
                  Software Engineering · Cloud Computing (AWS) · Cyber Security
                </p>
              </div>
              <Badge variant="blue" label="Hyderabad, India · 2023–2027" />
            </div>
          </article>

          <div className="editorial-ledger-grid editorial-ledger-grid--three">
            {CERTS.map((cert) => (
              <article className="ledger-entry" key={cert.title}>
                <div>
                  <Heading level={3} size="base" className="editorial-heading">
                    {cert.title}
                  </Heading>
                  <p className="ledger-body-copy">{cert.body}</p>
                </div>
                <div className="chip-row chip-row--flush">
                  {cert.stack.map((tech) => (
                    <span className="tech-chip" key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mono-section mono-section--last">
        <div className="monograph-container">
          <div className="section-header-row">
            <Heading level={2} className="section-title">
              Shipped Cadence &amp; Direct Links
            </Heading>
            <HStack gap={1.5} align="center">
              {isSyncingLive ? (
                <Spinner size="sm" aria-label="Syncing live GitHub contribution cadence" />
              ) : (
                <StatusDot
                  variant={isLive ? 'accent' : 'neutral'}
                  isPulsing={isLive}
                  label={isLive ? 'Live GitHub data' : 'Local contribution snapshot'}
                />
              )}
              <span className="section-index-meta tabular-metric">
                {total} CONTRIBUTIONS · {fetchedAt}
              </span>
            </HStack>
          </div>
          <p className="section-subtitle">
            {total} contributions {isLive ? 'loaded live from GitHub' : 'in the local snapshot'} (as
            of {fetchedAt}). Open to AI/ML, GenAI, and backend engineering internships.
          </p>

          <div
            ref={contribWrapRef}
            className={`contrib-wrap${isRevealed ? ' is-revealed' : ''}${
              activeLevel !== null ? ' is-filtering' : ''
            }`}
            aria-label={`GitHub contribution telemetry showing ${total} contributions`}
          >
            <div className="contrib-toolbar">
              <div className="contrib-inspector" aria-live="polite">
                <span className="contrib-inspector-dot" data-level={readoutLevel} aria-hidden="true" />
                <span className="contrib-inspector-text">{readoutText}</span>
              </div>

              <SegmentedControl
                value={viewMode}
                onChange={handleViewChange}
                label="Contribution telemetry view"
                size="sm"
              >
                <SegmentedControlItem value="12m" label="12M Matrix" />
                <SegmentedControlItem value="90d" label="90D Zoom" />
                <SegmentedControlItem value="monthly" label="Monthly" />
              </SegmentedControl>
            </div>

            <dl className="contrib-metrics dl-reset" aria-label="GitHub contribution summary">
              <div className="contrib-metric-tile">
                <dt className="contrib-metric-label">{is90d ? '90D TOTAL' : '12M TOTAL'}</dt>
                <dd className="contrib-metric-value tabular-metric">{windowTotal}</dd>
                <dd className="contrib-metric-sub">
                  {is90d ? 'Last 13 weeks' : `${grid.firstDate.slice(0, 7)} → ${grid.lastDate.slice(0, 7)}`}
                </dd>
              </div>
              <div className="contrib-metric-tile">
                <dt className="contrib-metric-label">ACTIVE DAYS</dt>
                <dd className="contrib-metric-value tabular-metric">{windowActiveDays}d</dd>
                <dd className="contrib-metric-sub">{activeRatio}% shipping cadence</dd>
              </div>
              <div className="contrib-metric-tile">
                <dt className="contrib-metric-label">LONGEST STREAK</dt>
                <dd className="contrib-metric-value tabular-metric">{stats.longestStreak}d</dd>
                <dd className="contrib-metric-sub">{stats.recent30Total} commits in last 30d</dd>
              </div>
              <button
                type="button"
                className="contrib-metric-tile contrib-metric-tile--interactive"
                onMouseEnter={() => setHoveredDay(stats.peakDay)}
                onMouseLeave={() => setHoveredDay(null)}
                onFocus={() => setHoveredDay(stats.peakDay)}
                onBlur={() => setHoveredDay(null)}
                onClick={() =>
                  setHoveredDay((prev) =>
                    prev?.date === stats.peakDay.date ? null : stats.peakDay
                  )
                }
              >
                <span className="contrib-metric-label">PEAK DAY</span>
                <span className="contrib-metric-value tabular-metric">{stats.peakDay.count}</span>
                <span className="contrib-metric-sub">
                  {formatContributionDate(stats.peakDay.date)}
                </span>
              </button>
            </dl>

            <Divider variant="subtle" />

            <div className="contrib-stage" ref={stageAnimateRef}>
              {viewMode === 'monthly' ? (
                <div
                  className="contrib-bars"
                  role="img"
                  aria-label="12-month GitHub contribution bar chart"
                >
                  {stats.monthlyTotals.map((month, idx) => {
                    const heightPct =
                      month.count === 0
                        ? 4
                        : Math.max(10, Math.round((month.count / stats.peakMonthCount) * 100))
                    const isPeakMonth = month.count === stats.peakMonthCount && month.count > 0
                    const isActiveBar = hoveredMonth?.key === month.key
                    return (
                      <button
                        key={month.key}
                        type="button"
                        className={`contrib-bar-col${isPeakMonth ? ' is-peak' : ''}${
                          isActiveBar ? ' is-selected' : ''
                        }`}
                        style={{ '--bar': idx }}
                        onMouseEnter={() => setHoveredMonth(month)}
                        onMouseLeave={() => setHoveredMonth(null)}
                        onFocus={() => setHoveredMonth(month)}
                        onBlur={() => setHoveredMonth(null)}
                        aria-label={`${month.label} ${month.year}: ${month.count} contributions`}
                      >
                        <span className="contrib-bar-count tabular-metric">{month.count}</span>
                        <span className="contrib-bar-track">
                          <span
                            className="contrib-bar-fill"
                            style={{ height: `${heightPct}%` }}
                          />
                        </span>
                        <span className="contrib-bar-label">{month.label}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="contrib-svg-scroll">
                  <svg
                    className={`contrib-svg${is90d ? ' is-zoom' : ''}`}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    role="img"
                    aria-label={`${is90d ? '13-week' : '52-week'} GitHub commit matrix with ${windowTotal} contributions between ${grid.firstDate} and ${grid.lastDate}`}
                  >
                    {grid.monthLabels.map((m) => (
                      <text
                        key={`${m.col}-${m.label}`}
                        x={gutterX + m.col * step}
                        y={11}
                        className="contrib-axis-label"
                      >
                        {m.label}
                      </text>
                    ))}

                    {WEEKDAY_LABELS.map(([rowIdx, dayLabel]) => (
                      <text
                        key={dayLabel}
                        x={0}
                        y={topAxisY + rowIdx * step + cellSize - 1}
                        className="contrib-axis-label"
                      >
                        {dayLabel}
                      </text>
                    ))}

                    {grid.cells.map((day) => {
                      const isDayActive = hoveredDay?.date === day.date
                      const isLevelMatch = activeLevel !== null && day.level === activeLevel
                      const isDimmed = activeLevel !== null && day.level !== activeLevel
                      return (
                        <rect
                          key={day.date}
                          x={gutterX + day.col * step}
                          y={topAxisY + day.row * step}
                          width={cellSize}
                          height={cellSize}
                          rx={2.5}
                          data-level={day.level}
                          style={{ '--col': day.col }}
                          className={`contrib-cell${
                            isDayActive || isLevelMatch ? ' is-highlighted' : ''
                          }${isDimmed ? ' is-dimmed' : ''}`}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={() =>
                            setHoveredDay((prev) => (prev?.date === day.date ? null : day))
                          }
                        >
                          <title>{`${day.date}: ${day.count} contributions`}</title>
                        </rect>
                      )
                    })}
                  </svg>
                </div>
              )}
            </div>

            <div className="contrib-footer">
              <span>
                {grid.firstDate} → {grid.lastDate} · Last active:{' '}
                {formatContributionDate(stats.lastActiveDay.date)} ({stats.lastActiveDay.count})
              </span>
              <span className="contrib-legend" role="group" aria-label="Filter by contribution intensity">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`contrib-legend-swatch${
                      lockedLevel === lvl ? ' is-locked' : ''
                    }`}
                    data-level={lvl}
                    aria-label={`Highlight intensity ${lvl} (${LEVEL_LABELS[lvl]})`}
                    aria-pressed={lockedLevel === lvl}
                    onMouseEnter={() => setHoverLevel(lvl)}
                    onMouseLeave={() => setHoverLevel(null)}
                    onClick={() => setLockedLevel((prev) => (prev === lvl ? null : lvl))}
                  />
                ))}
                <span>More</span>
              </span>
            </div>
          </div>

          <HStack gap={2} wrap="wrap" className="contact-actions">
            {CONTACT_LINKS.map(([href, , label], idx) => {
              const isMail = href.startsWith('mailto:')
              return (
                <Button
                  key={label}
                  label={label}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  size="md"
                  icon={isMail ? <Icon icon={Mail} size="sm" /> : undefined}
                  endContent={isMail ? undefined : <Icon icon="externalLink" size="sm" />}
                  href={href}
                  target={isMail ? undefined : '_blank'}
                  rel={isMail ? undefined : 'noopener noreferrer'}
                />
              )
            })}
            <Button
              label={copiedEmail ? 'Email copied' : 'Copy email'}
              variant="ghost"
              size="md"
              icon={<Icon icon={copiedEmail ? 'checkDouble' : 'copy'} size="sm" />}
              onClick={handleCopyEmail}
              title={`Copy ${EMAIL_ADDRESS} to clipboard`}
            />
          </HStack>
        </div>
      </section>

      <footer className="site-footer">
        <div className="monograph-container">
          <HStack justify="between" align="center" wrap="wrap" gap={2}>
            <span>Maithresh Vaddi · ~/maithresh · Systems Monograph</span>
            <HStack gap={3} align="center">
              <span>Built with React 19 + Astryx</span>
              <Link href="#top" color="accent" type="code" size="sm">
                <HStack gap={1} align="center">
                  <span>Back to top</span>
                  <Icon icon="arrowUp" size="sm" />
                </HStack>
              </Link>
            </HStack>
          </HStack>
        </div>
      </footer>
    </>
  )
}
