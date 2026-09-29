import { useEffect, useRef } from 'react'
import Icon from './Icon'
import { MARQUEE } from '../data/content'
import { startHeroScene } from '../scene'

const STATS = [
  ['11', 'solo-built agent systems'],
  ['13', 'production automations'],
  ['74%', 'duplicate postings pruned pre-LLM'],
]

export function Hero() {
  const canvasRef = useRef(null)
  useEffect(() => startHeroScene(canvasRef.current), [])

  return (
    <section className="hero">
      <svg className="noise-overlay" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
      <canvas id="hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="hero-fade" />
      <div className="hero-inner">
        <div className="hero-grid">
          <div className="hero-portrait reveal">
            <div className="hud-viewfinder">
              {['hud-reticle-tl', 'hud-reticle-tr', 'hud-reticle-bl', 'hud-reticle-br'].map((pos) => (
                <span key={pos} aria-hidden="true" className={`hud-reticle ${pos}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d={RETICLE_PATHS[pos]} stroke="#38bdf8" strokeWidth="2" />
                  </svg>
                </span>
              ))}
              <div className="hud-meta">
                <span>TARGET // MAITHRESH_VADDI</span>
                <span className="hud-ok">SYNCED ●</span>
              </div>
              <div className="ascii-card ascii-card--hero">
                <img
                  src="/assets/svg/maithresh-terminal-portrait.59fb7aed.svg"
                  alt="whoami --ascii render of Maithresh Vaddi"
                  width="840"
                  height="875"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => e.currentTarget.closest('.ascii-card--hero')?.classList.add('is-broken')}
                />
                <div className="portrait-fallback" aria-hidden="true"><span>maithresh<em>.sh</em></span></div>
              </div>
              <div className="hud-meta-row">
                <span>LOC: KMIT HYDERABAD</span>
                <span>ROLE: AI_SYSTEMS_ENG</span>
              </div>
            </div>
          </div>

          <div className="hero-text">
            <div className="eyebrow eyebrow--hero">
              <Icon name="user" className="eyebrow-icon" />
              $ whoami --role // maithresh.sh<span className="cursor" />
            </div>
            <div className="hero-availability">
              <span className="avail-dot" aria-hidden="true" />
              <span>Open to AI/ML internships · Hyderabad / Remote</span>
            </div>
            <h1 className="hero-name">Maithresh Vaddi</h1>
            <p className="hero-lead">AI/ML Engineer &amp; <span>Agentic Systems Builder.</span></p>
            <p className="hero-desc-sub">Production RAG · Local-First Inference · MCP Orchestration</p>
            <p className="hero-desc">
              Final-year B.Tech CSE undergrad at KMIT Hyderabad. I architect production-grade agentic
              runtimes, multi-agent pipelines, and local-first MCP orchestration networks: eleven
              solo-built systems, local-first wherever the architecture allows.
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn-nested btn-nested-primary">
                <span>$ inspect --systems</span>
                <span className="btn-nested-badge">↓</span>
              </a>
              <a href="#contact" className="btn-nested btn-nested-secondary">
                <span>$ ./contact.sh</span>
                <span className="btn-nested-badge">↗</span>
              </a>
            </div>
            <div className="hero-stats">
              {STATS.map(([n, label]) => (
                <div className="hero-stat" key={label}>
                  <span className="hero-stat-n">{n}</span>
                  <span className="hero-stat-l">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-hint"><span>scroll</span><span className="line" /></div>
    </section>
  )
}

const RETICLE_PATHS = {
  'hud-reticle-tl': 'M1 13V1H13',
  'hud-reticle-tr': 'M13 13V1H1',
  'hud-reticle-bl': 'M1 1V13H13',
  'hud-reticle-br': 'M13 1V13H1',
}

export function Marquee() {
  // The track holds two identical runs and CSS translates it to exactly -50%,
  // so the loop is seamless without any JS. No wrapper element — the CSS
  // styles .marquee-track > span directly, so an extra node would shift the
  // padding and the loop math.
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((run) => MARQUEE.map((item) => <span key={`${run}-${item}`}>{item}</span>))}
      </div>
    </div>
  )
}
