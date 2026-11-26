import { useState } from 'react'
import { Heading } from '@astryxdesign/core/Heading'
import { TabList, Tab } from '@astryxdesign/core/TabList'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { HStack } from '@astryxdesign/core/HStack'
import { Divider } from '@astryxdesign/core/Divider'
import { PANES } from '../../data/workbench'

export default function ArchitectureWorkbench() {
  const [activeId, setActiveId] = useState(PANES[0].id)
  const [simMode, setSimMode] = useState(null)

  const pane = PANES.find((p) => p.id === activeId) || PANES[0]
  const activeOutcome = simMode ? pane.outcomes[simMode] : null
  const isDanger = activeOutcome?.titleColor === '#f87171'
  const isWarn = activeOutcome?.titleColor === '#fbbf24'

  const handleTabChange = (nextId) => {
    setActiveId(nextId)
    setSimMode(null)
  }

  return (
    <section id="workbench" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Execution Paths &amp; Defensible Trade-offs
          </Heading>
          <span className="section-index-meta">FIG 01 · INTERACTIVE PIPELINE TRACE</span>
        </div>
        <p className="section-subtitle">
          Pick a system to trace its pipeline stages, test nominal vs. recovery paths, and review
          the design trade-offs.
        </p>

        <div className="workbench-frame">
          <TabList value={activeId} onChange={handleTabChange} hasDivider overflow="auto">
            {PANES.map((p) => (
              <Tab key={p.id} value={p.id} label={`${p.index} · ${p.tab}`} />
            ))}
          </TabList>

          <div className="workbench-body" key={pane.id}>
            <HStack justify="between" align="center" wrap="wrap" gap={2}>
              <div>
                <div className="stage-code">{pane.sub}</div>
                <Heading level={3} size="lg" className="editorial-heading" style={{ marginTop: '4px' }}>
                  {pane.name}
                </Heading>
              </div>

              <HStack gap={2} wrap="wrap">
                {pane.sims.map(([modeKey, label]) => (
                  <Button
                    key={modeKey}
                    label={label.replace(/^▶\s*/, '')}
                    variant={simMode === modeKey ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSimMode((prev) => (prev === modeKey ? null : modeKey))}
                  />
                ))}
                {simMode && (
                  <Button
                    label="Reset"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSimMode(null)}
                  />
                )}
              </HStack>
            </HStack>

            <div className="signal-conduit" aria-hidden="true">
              <svg className="signal-svg" viewBox="0 0 1000 18" preserveAspectRatio="none">
                <path className="signal-track" d="M 12 9 L 988 9" />
                <path
                  key={`${pane.id}-${simMode || 'idle'}`}
                  className={`signal-pulse${simMode ? ' is-tracing' : ''}${
                    isWarn ? ' is-warn' : isDanger ? ' is-danger' : ''
                  }`}
                  d="M 12 9 L 988 9"
                />
              </svg>
            </div>

            <div className="pipeline-rail" role="region" aria-label={pane.ariaLabel}>
              {pane.nodes.map((n, idx) => {
                const isLit = Boolean(simMode)
                const isStep3Warn = idx === 2 && pane.step2(simMode)?.stroke === '#38bdf8'
                return (
                  <div
                    key={n.stage}
                    style={{ '--stage-delay': isLit ? `${idx * 110}ms` : '0ms' }}
                    className={`stage-node${isLit ? (isStep3Warn ? ' is-warn' : ' is-active') : ''}`}
                  >
                    <div className="stage-code">{n.stage}</div>
                    <div className="stage-title">{n.title}</div>
                    <div className="stage-sub">{n.sub}</div>
                    <div className="stage-tiny">{n.tiny}</div>
                  </div>
                )
              })}

              <div
                aria-live="polite"
                style={{ '--stage-delay': simMode ? '330ms' : '0ms' }}
                className={`stage-node${
                  activeOutcome
                    ? isWarn
                      ? ' is-warn'
                      : isDanger
                        ? ' is-danger'
                        : ' is-active'
                    : ''
                }`}
              >
                <div className="stage-code">
                  {activeOutcome ? activeOutcome.label : 'STAGE 04 // VERDICT'}
                </div>
                <div
                  className="stage-title"
                  style={{
                    color: !activeOutcome
                      ? undefined
                      : isDanger
                        ? '#ef4444'
                        : isWarn
                          ? '#fbbf24'
                          : '#60a5fa',
                  }}
                >
                  {activeOutcome ? activeOutcome.title : 'Run a simulation'}
                </div>
                <div className="stage-sub">
                  {activeOutcome
                    ? activeOutcome.sub
                    : 'Choose an execution path above to trace verification.'}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Badge
                    variant={
                      !activeOutcome
                        ? 'neutral'
                        : isWarn
                          ? 'warning'
                          : isDanger
                            ? 'error'
                            : 'blue'
                    }
                    label={activeOutcome ? 'TRACED' : 'IDLE'}
                  />
                </div>
              </div>
            </div>

            <Divider variant="subtle" />

            <div className="defense-panel" style={{ borderTop: 'none', paddingTop: 0 }}>
              <Heading level={4} size="base" className="editorial-heading">
                {pane.defense.title}
              </Heading>
              {pane.defense.paras.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
