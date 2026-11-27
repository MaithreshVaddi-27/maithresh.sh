import { Heading } from '@astryxdesign/core/Heading'
import { STACK } from '../../data/stack'

export default function StackMatrix() {
  return (
    <section id="stack" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Engineering Stack &amp; Build Method
          </Heading>
          <span className="section-index-meta">4 domains · local + cloud</span>
        </div>
        <p className="section-subtitle">
          Tools used across shipped repositories, local inference runtimes, and backend services.
        </p>

        <div className="editorial-ledger-grid">
          {STACK.map((group) => (
            <article className="ledger-entry" key={group.title}>
              <div>
                <div className="ledger-head--stack">
                  <Heading level={3} size="lg" className="editorial-heading">
                    {group.title}
                  </Heading>
                </div>

                <div className="chip-row chip-row--flush">
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

              {group.note && <p className="stack-note">{group.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
