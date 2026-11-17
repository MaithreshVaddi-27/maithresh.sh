import Icon from '../Icon'
import { CERTS } from '../../data/content'

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

export default function CertificationsSection() {
  return (
    <section id="certifications">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="badge" />
            <span>$ cat certifications.md</span>
          </div>
          <h2>Certifications &amp; training</h2>
          <p className="section-sub">
            Applied training behind the builds above. Each one maps to something shipped — not a certificate for its own sake.
          </p>
        </div>
        <div className="cert-grid">
          {CERTS.map((cert) => (
            <div className="cert-card reveal" key={cert.title}>
              <THead file={cert.file} />
              <h3>{cert.title}</h3>
              <p>{cert.body}</p>
              <Stack items={cert.stack} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
