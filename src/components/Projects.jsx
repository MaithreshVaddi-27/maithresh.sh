import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { DetailBody } from './projects/ProjectDetail'
import { MoreProjects } from './projects/MoreProjects'
import { reduceMotion } from '../hooks/useMotion'

export default function Projects({ projects }) {
  const [active, setActive] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const panelRef = useRef(null)
  const timer = useRef(0)

  // Crossfade the panel on swap. Hovering fast can't land a stale panel because
  // the token guard is the timer itself: each new hover restarts the single
  // pending timeout, so only the last one resolves.
  const select = (i) => {
    if (i === active) return
    if (reduceMotion) return setActive(i)
    setSwapping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setActive(i)
      setSwapping(false)
    }, 180)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  const step = (dir) => select((active + dir + projects.length) % projects.length)

  // Tab labels stay short: the panel title carries the full name, the navbar
  // only needs to disambiguate five systems at a glance.
  const SHORT = ['TrustRAG', 'CareerOS', 'DocuChat', 'Resume Crew', 'MCP Suite']

  // Roving tabindex, mirrored from the workbench tablist: one tab stop for
  // the whole navbar, arrows/Home/End move within it.
  const tabRefs = useRef({})
  const onTablistKey = (e) => {
    const last = projects.length - 1
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % projects.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active === 0 ? last : active - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
  }

  // Connectors trace themselves in rather than appearing with the rest of the
  // schematic — reads as "data moving through the pipeline". Boxes and the
  // decision diamond stay static; only flow connectors draw.
  useEffect(() => {
    const svg = panelRef.current?.querySelector('.proj-diagram svg')
    if (!svg || reduceMotion || svg.getClientRects().length === 0) return
    const connectors = Array.from(svg.querySelectorAll('line, path')).filter(
      (el) => typeof el.getTotalLength === 'function' && !el.closest('defs')
    )
    if (!connectors.length) return
    connectors.forEach((el) => {
      const len = el.getTotalLength()
      el.style.transition = 'none'
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      connectors.forEach((el, i) => {
        el.style.transition = `stroke-dashoffset 0.65s cubic-bezier(.16,1,.3,1) ${i * 0.06}s`
        el.style.strokeDashoffset = '0'
      })
    }))
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <section id="projects">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="folder" />
            <span>$ ls projects/ --featured</span>
          </div>
          <h2>Featured systems</h2>
          <p className="section-sub">
            Highlights from 11+ solo-built systems. Each states the engineering problem, the constraint that
            shaped the design, and the limitation I haven't solved yet — switch systems in the bar to
            inspect each architecture end to end.
          </p>
        </div>

        <div className="proj-layout">
          {/* Sub-top navbar: one pill tab per system. Selecting previews the
              full-width panel below — tabs never navigate, so touch users get
              the same case study desktop hover users do. */}
          <div className="proj-tabs reveal" role="tablist" aria-label="Featured systems" onKeyDown={onTablistKey}>
            {projects.map((project, i) => (
              <button
                key={project.title}
                type="button"
                id={`proj-tab-${i}`}
                ref={(el) => { tabRefs.current[i] = el }}
                role="tab"
                className={`proj-tab${i === active ? ' active' : ''}`}
                data-accent={project.accent}
                aria-selected={i === active}
                aria-controls="proj-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
              >
                <span className="proj-tab-dot" aria-hidden="true" />
                <span>{SHORT[i]}</span>
              </button>
            ))}
          </div>

          {/* Full-width case-study panel: schematic beside prose on desktop,
              stacked on mobile. One system at a time, everything about it —
              diagram, problem, trade-off, metrics, stack, repository exit. */}
          <div
            className="proj-panel reveal"
            role="tabpanel"
            id="proj-panel"
            data-accent={projects[active].accent}
            aria-labelledby={`proj-tab-${active}`}
            tabIndex="0"
          >
            <div className="proj-panel-head">
              <img className="proj-panel-icon" src={projects[active].icon} alt="" aria-hidden="true" width="32" height="32" />
              <span className="proj-tag">{projects[active].tag}</span>
              <span className="proj-panel-count" aria-hidden="true">
                {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="proj-panel-nav">
                <button type="button" aria-label="Previous system" onClick={() => step(-1)}>←</button>
                <button type="button" aria-label="Next system" onClick={() => step(1)}>→</button>
              </div>
            </div>
            <h3 className="proj-panel-title">{projects[active].title}</h3>
            <div ref={panelRef} className={`proj-panel-inner${swapping ? ' swapping' : ''}`}>
              <div className="proj-panel-grid">
                <DetailBody project={projects[active]} idPrefix="Panel" order={active + 1} />
              </div>
            </div>
          </div>
        </div>

        <MoreProjects open={showMore} onToggle={() => setShowMore((v) => !v)} />
      </div>
    </section>
  )
}
