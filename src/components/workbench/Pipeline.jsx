import { LINKS, NODES, IDLE, LINK_IDLE } from '../../data/workbench'
import { OUTCOME_STEP } from './config'

// One pipeline diagram + one sim, for all four systems. Every visual is derived
// from (pane, mode, step) — no imperative attribute writes, no generation tokens.
export function Pipeline({ pane, sim }) {
  const step = sim?.step ?? -1
  const mode = sim?.mode
  const settled = step === OUTCOME_STEP
  const outcome = settled ? pane.outcomes[mode] : null
  const override = !settled && step === 2 ? pane.step2(mode) : null

  const tone = (i) => {
    if (i > step) return IDLE
    if (i === 2 && override) return override
    return pane.base
  }

  return (
    /* Focusable because it scrolls on narrow screens: a scroll container a
       keyboard can't reach is a WCAG 2.1.1 failure, and the diagram pans. */
    <div className="pipeline-card" tabIndex={0} role="group" aria-label={`${pane.name} pipeline diagram`}>
      <svg id={pane.svgId} viewBox="0 0 940 180" width="100%" height="180" role="img" aria-label={pane.ariaLabel}>
        {LINKS.map((l, i) => {
          const lit = i < step
          const t = lit ? (settled && i === 2 ? outcome : i === 1 && override ? override : pane.base) : LINK_IDLE
          return (
            <line
              key={i}
              x1={l.x1} y1="90" x2={l.x2} y2="90"
              stroke={t.stroke} strokeWidth="2" markerEnd={`url(#${t.marker})`}
              className={lit && !settled ? 'link-live' : undefined}
            />
          )
        })}
        {pane.nodes.map((n, i) => {
          const t = tone(i)
          const isCurrent = !settled && i === step
          const titleLines = n.title.includes(' → ')
            ? [n.title.split(' → ')[0], `→ ${n.title.split(' → ')[1]}`]
            : [n.title]
          return (
            <g key={n.title} className={`pipeline-node${isCurrent ? ' is-active' : ''}`} transform={`translate(${NODES[i].x}, 30)`}>
              <rect width={NODES[i].w} height="120" rx="12" fill={t.fill} stroke={t.stroke} strokeWidth="1.5" />
              <text x={NODES[i].tx} y="28" fontSize="9.5" fill={i <= step ? t.stroke : '#64748b'} fontWeight="700">{n.stage}</text>
              {titleLines.length === 2 ? (
                <>
                  <text x={NODES[i].tx} y="48" fontSize="12" fill="#f8fafc" fontWeight="600">{titleLines[0]}</text>
                  <text x={NODES[i].tx} y="64" fontSize="12" fill={t.stroke} fontWeight="600">{titleLines[1]}</text>
                </>
              ) : (
                <text x={NODES[i].tx} y="56" fontSize="12.5" fill="#f8fafc" fontWeight="600">{titleLines[0]}</text>
              )}
              <text x={NODES[i].tx} y="84" fontSize="10" fill="#94a3b8">{n.sub}</text>
              <text x={NODES[i].tx} y="102" fontSize="9.5" fill="#64748b">{n.tiny}</text>
            </g>
          )
        })}
        {/* The outcome is a FOURTH box, not a mutation of the third. It used
            to be drawn by the loop above under an `i === 3` branch — but
            pane.nodes only ever has 3 entries, so that branch was unreachable
            and every "OUTCOME" label in the data file was dead code that had
            never rendered once. Kept as its own node so the settled result of
            a simulation is actually visible. */}
        {settled && (
          <g className="pipeline-node pipeline-node--outcome" transform={`translate(${NODES[OUTCOME_STEP].x}, 30)`}>
            <rect
              width={NODES[OUTCOME_STEP].w} height="120" rx="12"
              fill={outcome.fill} stroke={outcome.stroke} strokeWidth="1.5"
            />
            <text x={NODES[OUTCOME_STEP].tx} y="32" fontSize="10" fill={outcome.stroke} fontWeight="700">
              {outcome.label}
            </text>
            <text
              x={NODES[OUTCOME_STEP].tx} y="62" fontSize="12"
              fill={outcome.titleColor || '#f8fafc'} fontWeight="600"
            >
              {outcome.title}
            </text>
            <text x={NODES[OUTCOME_STEP].tx} y="86" fontSize="9.5" fill="#64748b">{outcome.sub}</text>
          </g>
        )}
      </svg>
    </div>
  )
}
