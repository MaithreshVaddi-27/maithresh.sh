import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { SIM_LABELS } from '../data/content'
import { PANES, NODES, LINKS, IDLE, LINK_IDLE } from '../data/workbench'

const STEPS = [0, 400, 800, 1200]
const OUTCOME_STEP = 3

// One pipeline diagram + one sim, for all four systems. Every visual is derived
// from (pane, mode, step) — no imperative attribute writes, no generation tokens.
function Pipeline({ pane, sim }) {
  const step = sim?.step ?? -1
  const mode = sim?.mode
  const settled = step === OUTCOME_STEP
  const outcome = settled ? pane.outcomes[mode] : null
  const override = !settled && step === 2 ? pane.step2(mode) : null

  const tone = (i) => {
    if (i > step) return IDLE
    if (settled && i === 3) return outcome
    if (i === 2 && override) return override
    return pane.base
  }

  return (
    <div className="pipeline-card">
      <svg id={pane.svgId} viewBox="0 0 940 180" width="100%" height="180" role="img" aria-label={pane.ariaLabel}>
        {LINKS.map((l, i) => {
          const lit = i < step
          const t = lit ? (settled && i === 2 ? outcome : i === 1 && override ? override : pane.base) : LINK_IDLE
          return (
            <line
              key={i}
              x1={l.x1} y1="90" x2={l.x2} y2="90"
              stroke={t.stroke} strokeWidth="2" markerEnd={`url(#${t.marker})`}
            />
          )
        })}
        {pane.nodes.map((n, i) => {
          const t = tone(i)
          return (
            <g key={n.title} className="pipeline-node" transform={`translate(${NODES[i].x}, 30)`}>
              <rect width={NODES[i].w} height="120" rx="12" fill={t.fill} stroke={t.stroke} strokeWidth="1.5" />
              <text x={NODES[i].tx} y="32" fontSize="10" fill={t.stroke} fontWeight="700">{n.stage}</text>
              <text x={NODES[i].tx} y="58" fontSize={i === 3 ? 12 : 13} fill="#f8fafc" fontWeight="600">
                {i === 3 && settled ? outcome.title : n.title}
              </text>
              <text x={NODES[i].tx} y="80" fontSize={i === 3 ? 9.5 : 10} fill={i === 3 ? '#64748b' : '#64748b'}>
                {i === 3 && settled ? outcome.sub : n.sub}
              </text>
              {!settled && i < 3 && <text x={NODES[i].tx} y="98" fontSize="9.5" fill="#94a3b8">{n.tiny}</text>}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Workbench({ onAnnounce }) {
  const [activeId, setActiveId] = useState('docuchat')
  const [sims, setSims] = useState({})
  const timers = useRef({})

  // Cancelling the pending timeouts is the whole serialization story: a rapid
  // re-click drops the previous run's staged writes, so a stale outcome can never
  // land after a newer one. Strictly simpler than the vanilla generation token.
  const run = useCallback((pane, mode) => {
    timers.current[pane.id]?.forEach(clearTimeout)
    setSims((s) => ({ ...s, [pane.id]: { step: 0, mode } }))
    timers.current[pane.id] = STEPS.slice(1).map((ms, i) =>
      setTimeout(() => {
        setSims((s) => (s[pane.id] ? { ...s, [pane.id]: { ...s[pane.id], step: i + 1 } } : s))
      }, ms)
    )
  }, [])

  useEffect(() => () => Object.values(timers.current).forEach((list) => list.forEach(clearTimeout)), [])

  const onSim = (pane, mode) => {
    run(pane, mode)
    onAnnounce(`Running simulation: ${SIM_LABELS[`${pane.id}:${mode}`]}.`)
  }

  // Roving tabindex: one tab stop for the whole tablist, arrows/Home/End move.
  const onTablistKey = (e) => {
    const i = PANES.findIndex((p) => p.id === activeId)
    const last = PANES.length - 1
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % PANES.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i === 0 ? last : i - 1)
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setActiveId(PANES[next].id)
    document.getElementById(`tab-${PANES[next].id}`)?.focus()
  }

  return (
    <section id="workbench">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow section-eyebrow--panel">
            <Icon name="shield" />
            <span>$ run workbench --select-system</span>
          </div>
          <h2>Multi-System Architecture Workbench</h2>
          <p className="section-sub">
            Interactive execution pipelines, live tool dispatch simulations, and staff-level engineering
            trade-offs across my core systems.
          </p>
        </div>

        <SvgMarkers />

        <div className="workbench-tabs-container reveal">
          <div className="workbench-tabs" role="tablist" aria-label="Architecture workbench systems" onKeyDown={onTablistKey}>
            {PANES.map((pane) => (
              <button
                key={pane.id}
                type="button"
                id={`tab-${pane.id}`}
                role="tab"
                className={`workbench-tab${pane.id === activeId ? ' active' : ''}`}
                aria-selected={pane.id === activeId}
                aria-controls={`pane-${pane.id}`}
                tabIndex={pane.id === activeId ? 0 : -1}
                onClick={() => setActiveId(pane.id)}
              >
                <span className={`tab-status-dot tab-status-dot--${pane.dot}`} />
                <span>{pane.index} // {pane.tab}</span>
              </button>
            ))}
          </div>
        </div>

        {PANES.map((pane) => (
          <div
            key={pane.id}
            id={`pane-${pane.id}`}
            className={`workbench-pane${pane.id === activeId ? ' active' : ''}`}
            role="tabpanel"
            tabIndex="0"
            aria-labelledby={`tab-${pane.id}`}
          >
            <div className="wb-shell reveal">
              <div className="wb-core">
                <div className="pane-head">
                  <div className="pane-title">
                    <span className={`pane-dot pane-dot--${pane.dot}`} />
                    <span className="pane-name">{pane.name}</span>
                    <span className="pane-sub">{pane.sub}</span>
                  </div>
                  <div className="sim-controls">
                    {pane.sims.map(([mode, label, badge]) => (
                      <button
                        key={mode}
                        type="button"
                        className="btn-nested btn-nested-secondary btn-nested--sm"
                        onClick={() => onSim(pane, mode)}
                      >
                        <span>{label}</span>
                        <span className="btn-nested-badge">{badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Pipeline pane={pane} sim={sims[pane.id]} />

                <div className="interview-defense-box">
                  <div className="idef-head">
                    <span className={`idef-dot idef-dot--${pane.defense.tone}`} />
                    <strong className={`idef-title idef-title--${pane.defense.tone}`}>
                      {pane.defense.title}
                    </strong>
                  </div>
                  {pane.defense.paras.map((p, i) => <p className="idef-text" key={i}>{p}</p>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Shared marker defs — one source, every connector references these by id.
function SvgMarkers() {
  return (
    <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <Marker id="arrow" fill="#334155" />
        <Marker id="arrowActive" fill="#38bdf8" />
        <Marker id="arrowSuccess" fill="#10b981" />
        <Marker id="arrowWarn" fill="#f59e0b" />
      </defs>
    </svg>
  )
}

const Marker = ({ id, fill }) => (
  <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 1 L 10 5 L 0 9 z" fill={fill} />
  </marker>
)
