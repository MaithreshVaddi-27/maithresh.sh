import Icon from './Icon'
import ContributionGraph from './ContributionGraph'
import { AUTOMATIONS, GROUP_PROJECTS, CERTS, CONTACT_LINKS } from '../data/content'

const Stack = ({ items }) => <div className="proj-stack">{items.map((t) => <span key={t}>{t}</span>)}</div>

const THead = ({ file }) => (
  <div className="t-head-mini"><span /><span /><span /><em>{file}</em></div>
)

export function Automation() {
  return (
    <section id="automation">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="bolt" />
            <span>$ ls automation/</span>
          </div>
          <h2>Automation &amp; workflow engineering</h2>
          <p className="section-sub">13+ automation workflows live across n8n, Make.com, and RPA — three platforms chosen on purpose, so each does the job it’s actually best at.</p>
        </div>
        <div className="auto-list reveal">
          {AUTOMATIONS.map((item) => (
            <div className="auto-item" key={item.title}>
              <div className={item.live ? 'auto-status is-live' : 'auto-status'}>{item.status}</div>
              <div>
                <h3>
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{item.title}</a>
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

export function GroupPlatforms() {
  return (
    <section id="group">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="users" />
            <span>$ ls team/</span>
          </div>
          <h2>Group AI platforms</h2>
          <p className="section-sub">Team builds where I owned the ML layer — one where I trained the model, one where I integrated it. I keep that distinction sharp.</p>
        </div>
        <div className="group-grid">
          {GROUP_PROJECTS.map((card) => (
            <div className="group-card reveal" key={card.title}>
              <THead file={card.file} />
              <div className="proj-top">
                <h3 className="proj-title proj-title--sm">{card.title}</h3>
                <a className="proj-link" href={card.href} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
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

export function Education() {
  return (
    <section id="education">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="cap" />
            <span>$ cat education.md</span>
          </div>
          <h2>Education</h2>
        </div>
        <div className="reveal">
          <div className="ed-row">
            <Icon name="cap" width={1.7} className="ed-icon" />
            <div className="ed-left">
              <h3>Keshav Memorial Institute of Technology (KMIT)</h3>
              <span>B.Tech, Computer Science and Engineering — CGPA 7.96/10</span>
              <span className="ed-meta">
                Data Structures &amp; Algorithms · Operating Systems · DBMS · Computer Networks ·
                Software Engineering · Cloud Computing (AWS) · Cyber Security
              </span>
            </div>
            <div className="ed-right">Hyderabad, India<br />2023 — 2027</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Certifications() {
  return (
    <section id="certifications">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="badge" />
            <span>$ cat certifications.md</span>
          </div>
          <h2>Certifications &amp; training</h2>
          <p className="section-sub">Applied training behind the builds above. Each one maps to something shipped — not a certificate for its own sake.</p>
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

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="wrap">
        <div className="reveal">
          <div className="section-eyebrow section-eyebrow--center">
            <Icon name="mail" />
            <span>$ ./contact.sh</span>
          </div>
          <h2>Let’s build something that ships.</h2>
          <p className="section-sub">
            Open to AI/ML, GenAI, agentic-AI, and automation internships — backend or
            platform heavy. Send a repo, a JD, or a problem statement. Based in
            Hyderabad, happy to work remote.
          </p>
          <p className="contact-note">
            <b>● Available now</b><span>·</span><span>Hyderabad / Remote</span><span>·</span>
            <span>Replies within 48 hours</span>
          </p>
          <ContributionGraph />
          <div className="contact-links">
            {CONTACT_LINKS.map(([href, icon, label]) => (
              <a key={href} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}>
                <Icon name={icon} width={1.7} className="contact-icon" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <span><span className="foot-dot" aria-hidden="true" />maithresh.sh // Maithresh Vaddi — Hyderabad, Telangana</span>
        <span>
          Designed &amp; engineered solo · React 19 + Vite · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
