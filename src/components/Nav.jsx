import { useState } from 'react'
import { NAV_LINKS } from '../data/content'
import { useScrollSpy } from '../hooks/useChrome'

const SECTIONS = NAV_LINKS.map(([href]) => href.slice(1))

export default function Nav({ onOpenConsole, scrolled }) {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(SECTIONS)
  const close = () => setOpen(false)

  return (
    <header className={scrolled ? 'is-scrolled' : ''}>
      <nav className="glass-dock" aria-label="Main Navigation">
        {/* aria-label is load-bearing, not decoration: .brand-word is
            display:none under 640px, which drops the link's only text from the
            accessibility tree and leaves an unnamed link (axe link-name). */}
        <a href="#top" className="logo" aria-label="maithresh.sh — home" onClick={close}>
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-word">maithresh<span className="brand-accent">.sh</span></span>
        </a>
        <ul className={`navlinks${open ? ' open' : ''}`} id="navLinks">
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <a href={href} className={active === href.slice(1) ? 'active' : ''} onClick={close}>
                {label}
              </a>
            </li>
          ))}
          <li className="nav-cta-mobile"><a href="#contact" onClick={close}>Contact ↗</a></li>
        </ul>
        <div className="nav-actions">
          <button
            type="button"
            className="btn-nested btn-nested-secondary btn-nested--sm"
            onClick={onOpenConsole}
            aria-label="Open Command Console"
          >
            <span>⌘K</span>
          </button>
          <a href="#contact" className="btn-nested btn-nested-primary btn-nested--connect">
            <span>CONNECT</span>
            <span className="btn-nested-badge">↗</span>
          </a>
          <button
            type="button"
            className={`nav-toggle${open ? ' open' : ''}`}
            id="navToggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
  )
}
