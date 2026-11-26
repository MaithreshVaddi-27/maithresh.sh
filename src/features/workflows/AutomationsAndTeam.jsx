import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { Divider } from '@astryxdesign/core/Divider'
import { AUTOMATIONS, GROUP_PROJECTS } from '../../data/sections'

export default function AutomationsAndTeam() {
  return (
    <section id="automations" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Automation Suites &amp; Team Platforms
          </Heading>
          <span className="section-index-meta">13+ WORKFLOWS · SCOPED ML</span>
        </div>
        <p className="section-subtitle">
          Production and experimental workflows across n8n, Make.com, and RPA, alongside team
          platforms where I owned the ML training or inference integration layer.
        </p>

        <div className="editorial-ledger-grid">
          {AUTOMATIONS.map((item) => (
            <article className="ledger-entry" key={item.title}>
              <div>
                <HStack justify="between" align="center" style={{ marginBottom: '10px' }}>
                  <Badge
                    variant={item.live ? 'blue' : 'neutral'}
                    label={item.status}
                  />
                  <Button
                    label="Inspect ↗"
                    variant="ghost"
                    size="sm"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </HStack>
                <Heading level={3} size="base" className="editorial-heading">
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

        <div style={{ marginBlock: '44px 28px' }}>
          <Divider variant="subtle" />
        </div>

        <Heading level={3} size="lg" className="editorial-heading">
          Team Platforms (Scoped ML Ownership)
        </Heading>
        <div className="editorial-ledger-grid" style={{ marginTop: '20px' }}>
          {GROUP_PROJECTS.map((proj) => (
            <article className="ledger-entry" key={proj.title}>
              <div>
                <HStack justify="between" align="center" style={{ marginBottom: '10px' }}>
                  <Badge variant="info" label={proj.tag} />
                  <Button
                    label="Repo ↗"
                    variant="ghost"
                    size="sm"
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </HStack>
                <Heading level={4} size="base" className="editorial-heading">
                  {proj.title}
                </Heading>
                <p style={{ marginTop: '8px' }}>{proj.body}</p>
                <p style={{ marginTop: '10px', color: '#cbd5e1' }}>{proj.scope}</p>
              </div>

              <div className="chip-row" style={{ marginTop: 0 }}>
                {proj.stack.map((tech) => (
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
  )
}
