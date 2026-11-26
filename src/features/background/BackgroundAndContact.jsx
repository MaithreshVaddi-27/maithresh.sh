import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { CERTS, CONTACT_LINKS } from '../../data/sections'
import contribSnapshot from '../../data/contributions.json'

export default function BackgroundAndContact() {
  const contributions = contribSnapshot.contributions || []
  const firstDate = contributions[0]?.date || ''
  const lastDate = contributions.at(-1)?.date || contribSnapshot.fetchedAt

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

          <article className="ledger-entry" style={{ marginTop: '28px' }}>
            <HStack justify="between" align="start" wrap="wrap" gap={2}>
              <div>
                <Heading level={3} size="lg" className="editorial-heading">
                  Keshav Memorial Institute of Technology (KMIT)
                </Heading>
                <p style={{ marginTop: '6px', color: '#cbd5e1', fontSize: '15px' }}>
                  B.Tech, Computer Science and Engineering — <strong>CGPA 7.96/10</strong>
                </p>
                <p style={{ marginTop: '8px', color: '#9aa2b1', fontSize: '13px' }}>
                  Data Structures &amp; Algorithms · Operating Systems · DBMS · Computer Networks ·
                  Software Engineering · Cloud Computing (AWS) · Cyber Security
                </p>
              </div>
              <Badge variant="blue" label="Hyderabad, India · 2023–2027" />
            </HStack>
          </article>

          <div className="editorial-ledger-grid">
            {CERTS.map((cert) => (
              <article className="ledger-entry" key={cert.title}>
                <div>
                  <Heading level={3} size="base" className="editorial-heading">
                    {cert.title}
                  </Heading>
                  <p style={{ marginTop: '8px' }}>{cert.body}</p>
                </div>
                <div className="chip-row" style={{ marginTop: 0 }}>
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

      <section id="contact" className="mono-section" style={{ borderBottom: 'none' }}>
        <div className="monograph-container">
          <div className="section-header-row">
            <Heading level={2} className="section-title">
              Shipped Cadence &amp; Direct Links
            </Heading>
            <span className="section-index-meta tabular-metric">
              {contribSnapshot.total} CONTRIBUTIONS · {contribSnapshot.fetchedAt}
            </span>
          </div>
          <p className="section-subtitle">
            {contribSnapshot.total} contributions recorded in the local snapshot (as of{' '}
            {contribSnapshot.fetchedAt}). Open to AI/ML, GenAI, and backend engineering internships.
          </p>

          <div
            className="contrib-wrap"
            aria-label={`GitHub contribution graph showing ${contribSnapshot.total} contributions`}
          >
            <div className="contrib-header">
              <span>
                {firstDate} — {lastDate}
              </span>
              <span className="contrib-legend" aria-hidden="true">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                  <span key={lvl} className="contrib-cell" data-level={lvl} />
                ))}
                <span>More</span>
              </span>
            </div>

            <div className="contrib-grid">
              {contributions.map((day) => (
                <span
                  key={day.date}
                  className="contrib-cell"
                  data-level={day.level}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          </div>

          <HStack gap={2} wrap="wrap" style={{ marginTop: '28px' }}>
            {CONTACT_LINKS.map(([href, , label], idx) => (
              <Button
                key={label}
                label={label}
                variant={idx === 0 ? 'primary' : 'secondary'}
                size="md"
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              />
            ))}
          </HStack>
        </div>
      </section>

      <footer
        style={{
          borderTop: '1px solid var(--hairline)',
          paddingBlock: '28px',
          color: '#848d9c',
          fontSize: '13px',
        }}
      >
        <div className="monograph-container">
          <HStack justify="between" align="center" wrap="wrap" gap={2}>
            <span>Maithresh Vaddi · maithresh.sh · Systems Monograph</span>
            <HStack gap={3} align="center">
              <span>Built with React 19 + Astryx</span>
              <a href="#top" className="footer-top-link">
                Back to top ↑
              </a>
            </HStack>
          </HStack>
        </div>
      </footer>
    </>
  )
}
