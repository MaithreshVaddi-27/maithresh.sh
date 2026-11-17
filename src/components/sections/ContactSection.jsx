import Icon from '../Icon'
import ContributionGraph from '../ContributionGraph'
import { CONTACT_LINKS } from '../../data/content'

export default function ContactSection() {
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
            <b>● Available now</b>
            <span>·</span>
            <span>Hyderabad / Remote</span>
            <span>·</span>
            <span>Replies within 48 hours</span>
          </p>
          <ContributionGraph />
          <div className="contact-links">
            {CONTACT_LINKS.map(([href, icon, label]) => (
              <a
                key={href}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
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
