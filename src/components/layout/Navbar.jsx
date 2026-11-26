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
  ['#systems', 'Systems', 'systems'],
  ['#workbench', 'Architecture', 'workbench'],
  ['#automations', 'Automations', 'automations'],
  ['#stack', 'Stack', 'stack'],
  ['#background', 'Background', 'background'],
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('#systems')

  useEffect(() => {
    let rafId = 0

    const updateActive = () => {
      rafId = 0
      const headerOffset = 140
      let current = LINKS[0][0]
      for (const [href] of LINKS) {
        const el = document.querySelector(href)
        if (el && el.getBoundingClientRect().top <= headerOffset) {
          current = href
        }
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48) {
        current = '#background'
      }
      setActiveHash((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateActive)
      }
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const mainEl = document.getElementById('main')
    const observer = mainEl ? new MutationObserver(updateActive) : null
    if (observer && mainEl) {
      observer.observe(mainEl, { childList: true, subtree: true })
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      observer?.disconnect()
    }
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
