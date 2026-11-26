import { useEffect, useState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { VStack } from '@astryxdesign/core/VStack'
import { GITHUB } from '../../data/content'
import brandMarkUrl from '../../../assets/brand/maithresh-mark.svg?url'

const LINKS = [
  ['#workbench', 'Architecture'],
  ['#systems', 'Systems'],
  ['#stack', 'Stack'],
  ['#automations', 'Automations'],
  ['#background', 'Background'],
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('#workbench')

  useEffect(() => {
    const sections = LINKS.map(([href]) => document.querySelector(href)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .toSorted((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) {
          setActiveHash(`#${visible.target.id}`)
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.4] }
    )

    sections.forEach((sec) => observer.observe(sec))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="monograph-container">
        <nav className="nav-row" aria-label="Primary navigation">
          <a href="#top" className="brand-mark">
            <img
              src={brandMarkUrl}
              alt=""
              aria-hidden="true"
              className="brand-glyph"
              width="22"
              height="22"
            />
            <span>
              maithresh<span className="brand-tld">.sh</span>
            </span>
          </a>

          <ul className="nav-links">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link${activeHash === href ? ' is-current' : ''}`}
                  aria-current={activeHash === href ? 'location' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <span className="nav-availability">
              <Badge variant="blue" label="Open to AI/ML Internships" />
            </span>
            <Button
              label="GitHub"
              variant="secondary"
              size="sm"
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
            />
            <span className="mobile-toggle">
              <Button
                label={menuOpen ? 'Close' : 'Menu'}
                variant="ghost"
                size="sm"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              />
            </span>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-drawer">
            <VStack gap={2} paddingBlock={3}>
              <div>
                <Badge variant="blue" label="Open to AI/ML Internships" />
              </div>
              {LINKS.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className={`mobile-nav-link${activeHash === href ? ' is-current' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </VStack>
          </div>
        )}
      </div>
      <div className="header-progress" aria-hidden="true" />
    </header>
  )
}
