import Icon from '../Icon'
import { GROUP_PROJECTS } from '../../data/content'

const Stack = ({ items }) => (
  <div className="proj-stack">
    {items.map((t) => (
      <span key={t}>{t}</span>
    ))}
  </div>
)

const THead = ({ file }) => (
  <div className="t-head-mini">
    <span />
    <span />
    <span />
    <em>{file}</em>
  </div>
)

export default function GroupPlatformsSection() {
  return (
    <section id="group">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="users" />
            <span>$ ls team/</span>
          </div>
          <h2>Group AI platforms</h2>
          <p className="section-sub">
            Team builds where I owned the ML layer — one where I trained the model, one where I integrated it. I keep that distinction sharp.
          </p>
        </div>
        <div className="group-grid">
          {GROUP_PROJECTS.map((card) => (
            <div className="group-card reveal" key={card.title}>
              <THead file={card.file} />
              <div className="proj-top">
                <h3 className="proj-title proj-title--sm">{card.title}</h3>
                <a className="proj-link" href={card.href} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              </div>
              <span className="proj-tag">{card.tag}</span>
              <p>{card.body}</p>
              <div className="scope">{card.scope}</div>
              <Stack items={card.stack} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
