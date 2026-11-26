import { useEffect, useState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { StatusDot } from '@astryxdesign/core/StatusDot'
import { VStack } from '@astryxdesign/core/VStack'
import { GITHUB } from '../../data/content'
import { prefetchSection } from '../../utils/sectionLoaders'
import brandMarkUrl from '../../../assets/brand/maithresh-mark.svg?url'

const LINKS = [
  ['#workbench', 'Architecture', 'workbench'],
  ['#systems', 'Systems', 'systems'],
  ['#stack', 'Stack', 'stack'],
  ['#automations', 'Automations', 'automations'],
  ['#background', 'Background', 'background'],
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
            {LINKS.map(([href, label, loaderKey]) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link${activeHash === href ? ' is-current' : ''}`}
                  aria-current={activeHash === href ? 'location' : undefined}
                  onMouseEnter={() => prefetchSection(loaderKey)}
                  onFocus={() => prefetchSection(loaderKey)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <span className="nav-availability">
              <HStack gap={1.5} align="center">
                <StatusDot variant="accent" isPulsing label="Available for AI/ML internships" />
                <Badge variant="blue" label="Open to AI/ML Internships" />
              </HStack>
            </span>
            <Button
              label="GitHub"
              variant="secondary"
              size="sm"
              endContent={<Icon icon="externalLink" size="sm" />}
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
            />
            <span className="mobile-toggle">
              <Button
                label={menuOpen ? 'Close' : 'Menu'}
                variant="ghost"
                size="sm"
                icon={<Icon icon={menuOpen ? 'close' : 'menu'} size="sm" />}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              />
            </span>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-drawer">
            <VStack gap={2} paddingBlock={3}>
              <HStack gap={1.5} align="center">
                <StatusDot variant="accent" isPulsing label="Available for AI/ML internships" />
                <Badge variant="blue" label="Open to AI/ML Internships" />
              </HStack>
              {LINKS.map(([href, label, loaderKey]) => (
                <a
                  key={href}
                  href={href}
                  className={`mobile-nav-link${activeHash === href ? ' is-current' : ''}`}
                  onMouseEnter={() => prefetchSection(loaderKey)}
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
