import Icon from '../Icon'
import { AUTOMATIONS } from '../../data/content'

const Stack = ({ items }) => (
  <div className="proj-stack">
    {items.map((t) => (
      <span key={t}>{t}</span>
    ))}
  </div>
)

export default function AutomationSection() {
  return (
    <section id="automation">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="bolt" />
            <span>$ ls automation/</span>
          </div>
          <h2>Automation &amp; workflow engineering</h2>
          <p className="section-sub">
            13+ automation workflows live across n8n, Make.com, and RPA — three platforms chosen on purpose, so each does the job it’s actually best at.
          </p>
        </div>
        <div className="auto-list reveal">
          {AUTOMATIONS.map((item) => (
            <div className="auto-item" key={item.title}>
              <div className={item.live ? 'auto-status is-live' : 'auto-status'}>{item.status}</div>
              <div>
                <h3>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p>{item.body}</p>
                <Stack items={item.stack} />
              </div>
              <Icon name={item.icon} width={1.6} className="auto-icon" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
