import { useEffect, useRef, useState } from 'react'
import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { Link } from '@astryxdesign/core/Link'
import { Spinner } from '@astryxdesign/core/Spinner'
import { StatusDot } from '@astryxdesign/core/StatusDot'
import { Mail } from 'lucide-react'
import { CERTS, CONTACT_LINKS } from '../../data/sections'
import contribSnapshot from '../../data/contributions.json'

const CONTRIB_LEVELS = ['#171c26', '#172554', '#1e40af', '#2563eb', '#60a5fa']
const CONTRIB_ENDPOINT = 'https://github-contributions-api.jogruber.de/v4/MaithreshVaddi-27?y=last'
const EMAIL_ADDRESS = 'maithreshvaddi16@gmail.com'

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
  const [copiedEmail, setCopiedEmail] = useState(false)
  const copyTimerRef = useRef(null)

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

  const { contributions, total, fetchedAt, isLive } = contribState
  const firstDate = contributions[0]?.date || ''
  const lastDate = contributions.at(-1)?.date || fetchedAt
  const startDayOffset = firstDate ? new Date(`${firstDate}T00:00:00Z`).getUTCDay() : 0
  const totalCols = Math.max(1, Math.ceil((contributions.length + startDayOffset) / 7))
  const svgWidth = totalCols * 13 - 3
  const svgHeight = 7 * 13 - 3

  return (
    <>
      <section id="background" className="mono-section">
        <div className="monograph-container">
          <div className="section-header-row">
            <Heading level={2} className="section-title">
              Education &amp; Applied Training
            </Heading>
            <span className="section-index-meta">KMIT 2023–2027 · CREDENTIALS</span>
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

          <div className="editorial-ledger-grid">
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
            className="contrib-wrap"
            aria-label={`GitHub contribution graph showing ${total} contributions`}
          >
            <div className="contrib-header">
              <span>
                {firstDate} — {lastDate}
              </span>
              <span className="contrib-legend" aria-hidden="true">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span key={lvl} className="contrib-legend-swatch" data-level={lvl} />
                ))}
                <span>More</span>
              </span>
            </div>

            <svg
              className="contrib-svg"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              role="img"
              aria-label={`52-week GitHub commit matrix with ${total} contributions between ${firstDate} and ${lastDate}`}
            >
              {contributions.map((day, idx) => {
                const slot = idx + startDayOffset
                const col = Math.floor(slot / 7)
                const row = slot % 7
                const fill = CONTRIB_LEVELS[day.level] || CONTRIB_LEVELS[0]
                return (
                  <rect
                    key={day.date}
                    x={col * 13}
                    y={row * 13}
                    width={10}
                    height={10}
                    rx={2}
                    fill={fill}
                  >
                    <title>{`${day.date}: ${day.count} contributions`}</title>
                  </rect>
                )
              })}
            </svg>
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
            <span>Maithresh Vaddi · maithresh.sh · Systems Monograph</span>
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
