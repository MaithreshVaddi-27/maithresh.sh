import { useState } from 'react'
import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { PROJECTS, MORE_PROJECTS } from '../../data/projects'

const ARCHIVE_FILTERS = [
  ['all', 'All'],
  ['crewai', 'CrewAI'],
  ['mcp', 'MCP'],
  ['systems', 'Systems & Voice'],
]

function matchesFilter(item, filter) {
  if (filter === 'all') return true
  const tag = item.tag.toLowerCase()
  if (filter === 'crewai') return tag.includes('crewai')
  if (filter === 'mcp') return tag.includes('mcp')
  return !tag.includes('crewai') && !tag.includes('mcp')
}

export default function FeaturedSystems() {
  const [showArchive, setShowArchive] = useState(false)
  const [archiveFilter, setArchiveFilter] = useState('all')

  const filteredArchive = MORE_PROJECTS.filter((item) => matchesFilter(item, archiveFilter))

  return (
    <section id="systems" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Featured AI &amp; Agentic Systems
          </Heading>
          <span className="section-index-meta">
            SYS 01–0{PROJECTS.length} · ORDERED BY WEIGHT
          </span>
        </div>
        <p className="section-subtitle">
          Solo-built repositories with test suites, documented failure modes, and known caveats.
        </p>

        <div className="systems-ledger">
          {PROJECTS.map((project, index) => (
            <article className="system-row" key={project.title}>
              <div className="system-row-inner">
                <div className="system-top">
                  <div className="system-id-row">
                    <img
                      src={project.icon}
                      alt=""
                      className="system-icon"
                      width="38"
                      height="38"
                      loading="lazy"
                    />
                    <div>
                      <div className="stage-code">
                        SYS-0{index + 1} · {project.tag}
                      </div>
                      <Heading level={3} size="xl" className="editorial-heading" style={{ marginTop: '2px' }}>
                        {project.title}
                      </Heading>
                    </div>
                  </div>

                  <Button
                    label="Source Repo ↗"
                    variant="secondary"
                    size="sm"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </div>

                <div className="system-metrics">
                  {project.metrics.map(([val, label]) => (
                    <div className="metric-box" key={val + label}>
                      <div className="metric-val tabular-metric">{val}</div>
                      <div className="metric-desc">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="system-prose">
                  <p>{project.desc}</p>
                  <p>{project.highlight}</p>
                </div>

                <div className="chip-row">
                  {project.stack.map((item, i) => (
                    <span key={item} className={`tech-chip${i < 2 ? ' is-primary' : ''}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '40px' }}>
          <HStack justify="between" align="center" wrap="wrap" gap={2}>
            <div>
              <Heading level={3} size="lg" className="editorial-heading">
                Extended Systems Archive ({MORE_PROJECTS.length} additional builds)
              </Heading>
              <p className="section-subtitle" style={{ marginTop: '4px' }}>
                Multi-agent CrewAI pipelines, Composio MCP CLI agents, voice AI, and ApplyOS.
              </p>
            </div>
            <Button
              label={showArchive ? 'Collapse Archive' : 'Expand Archive'}
              variant="secondary"
              size="sm"
              onClick={() => setShowArchive((prev) => !prev)}
              aria-expanded={showArchive}
            />
          </HStack>

          {showArchive && (
            <div className="archive-reveal" style={{ marginTop: '20px' }}>
              <HStack gap={1.5} wrap="wrap" role="group" aria-label="Filter archive by category">
                {ARCHIVE_FILTERS.map(([key, label]) => (
                  <Button
                    key={key}
                    label={label}
                    variant={archiveFilter === key ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setArchiveFilter(key)}
                  />
                ))}
              </HStack>

              <div className="editorial-ledger-grid">
                {filteredArchive.map((item) => (
                  <article className="ledger-entry" key={item.title}>
                    <div>
                      <HStack justify="between" align="center" gap={2} style={{ marginBottom: '10px' }}>
                        <HStack align="center" gap={2}>
                          <img
                            src={item.icon}
                            alt=""
                            width="24"
                            height="24"
                            loading="lazy"
                            style={{ borderRadius: '4px' }}
                          />
                          <Badge variant="neutral" label={item.tag} />
                        </HStack>
                        <Button
                          label="Repo ↗"
                          variant="ghost"
                          size="sm"
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </HStack>
                      <Heading level={4} size="base" className="editorial-heading">
                        {item.title}
                      </Heading>
                      <p style={{ marginTop: '8px' }}>{item.body}</p>
                    </div>

                    <div className="chip-row" style={{ marginTop: 0 }}>
                      {item.stack.map((tech) => (
                        <span className="tech-chip" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
