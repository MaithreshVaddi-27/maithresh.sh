import { Heading } from '@astryxdesign/core/Heading'
import { Badge } from '@astryxdesign/core/Badge'
import { HStack } from '@astryxdesign/core/HStack'
import { STACK } from '../../data/stack'

export default function StackMatrix() {
  return (
    <section id="stack" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Engineering Stack &amp; Build Method
          </Heading>
          <span className="section-index-meta">4 DOMAINS · LOCAL + CLOUD</span>
        </div>
        <p className="section-subtitle">
          Tools used across shipped repositories, local inference runtimes, and backend services.
        </p>

        <div className="editorial-ledger-grid">
          {STACK.map((group) => (
            <article className="ledger-entry" key={group.file}>
              <div>
                <HStack justify="between" align="center" style={{ marginBottom: '12px' }}>
                  <Heading level={3} size="lg" className="editorial-heading">
                    {group.title}
                  </Heading>
                  <Badge variant="neutral" label={group.file} />
                </HStack>

                <div className="chip-row" style={{ marginTop: 0 }}>
                  {group.chips.map((chip) => (
                    <span
                      key={chip}
                      className={`tech-chip${group.accent?.includes(chip) ? ' is-primary' : ''}`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {group.note && (
                <p style={{ fontSize: '13px', color: '#9aa2b1' }}>
                  {group.note}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
