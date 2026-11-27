import { useState } from 'react'
import { Heading } from '@astryxdesign/core/Heading'
import { TabList, Tab } from '@astryxdesign/core/TabList'
import { Button } from '@astryxdesign/core/Button'
import { Badge } from '@astryxdesign/core/Badge'
import { HStack } from '@astryxdesign/core/HStack'
import { Divider } from '@astryxdesign/core/Divider'
import { Icon } from '@astryxdesign/core/Icon'
import { StatusDot } from '@astryxdesign/core/StatusDot'
import { Play, RotateCcw } from 'lucide-react'
import { PANES } from '../../data/workbench'
import { runViewTransition } from '../../utils/viewTransition'

const STOP_XS = [125, 375, 625, 875]

export default function ArchitectureWorkbench() {
  const [activeId, setActiveId] = useState(PANES[0].id)
  const [simMode, setSimMode] = useState(null)

  const pane = PANES.find((p) => p.id === activeId) || PANES[0]
  const activeOutcome = simMode ? pane.outcomes[simMode] : null
  const isDanger = activeOutcome?.tone === 'danger'
  const isWarn = activeOutcome?.tone === 'warn'
  const statusVariant = !activeOutcome
    ? 'neutral'
    : isDanger
      ? 'error'
      : isWarn
        ? 'warning'
        : 'accent'

  const handleTabChange = (nextId) => {
    runViewTransition(() => {
      setActiveId(nextId)
      setSimMode(null)
    })
  }

  return (
    <section id="workbench" className="mono-section">
      <div className="monograph-container">
        <div className="section-header-row">
          <Heading level={2} className="section-title">
            Execution Paths &amp; Defensible Trade-offs
          </Heading>
          <span className="section-index-meta">Interactive pipeline trace</span>
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
                <div className="workbench-heading">
                  <Heading level={3} size="lg" className="editorial-heading">
                    {pane.name}
                  </Heading>
                </div>
              </div>

              <HStack gap={2} wrap="wrap">
                {pane.sims.map(([modeKey, label]) => (
                  <Button
                    key={modeKey}
                    label={label}
                    variant={simMode === modeKey ? 'primary' : 'secondary'}
                    size="sm"
                    icon={<Icon icon={Play} size="sm" />}
                    onClick={() => setSimMode((prev) => (prev === modeKey ? null : modeKey))}
                  />
                ))}
                {simMode && (
                  <Button
                    label="Reset"
                    variant="ghost"
                    size="sm"
                    icon={<Icon icon={RotateCcw} size="sm" />}
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
                {STOP_XS.map((cx, idx) => {
                  const toneClass = !simMode
                    ? ''
                    : idx === 3 && isDanger
                      ? ' is-danger'
                      : (idx === 3 && isWarn) || (idx === 2 && pane.step2Tone(simMode) === 'warn')
                        ? ' is-warn'
                        : ' is-active'
                  return (
                    <circle
                      key={cx}
                      cx={cx}
                      cy="9"
                      r="4"
                      style={{ '--stage-delay': simMode ? `${idx * 110}ms` : '0ms' }}
                      className={`signal-stop${toneClass}`}
                    />
                  )
                })}
              </svg>
            </div>

            <div className="pipeline-rail" role="region" aria-label={pane.ariaLabel}>
              {pane.nodes.map((n, idx) => {
                const isLit = Boolean(simMode)
                const isStep3Warn = idx === 2 && pane.step2Tone(simMode) === 'warn'
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
                  className={`stage-title${
                    !activeOutcome
                      ? ''
                      : isDanger
                        ? ' stage-title--danger'
                        : isWarn
                          ? ' stage-title--warn'
                          : ' stage-title--ok'
                  }`}
                >
                  {activeOutcome ? activeOutcome.title : 'Run a simulation'}
                </div>
                <div className="stage-sub">
                  {activeOutcome
                    ? activeOutcome.sub
                    : 'Choose an execution path above to trace verification.'}
                </div>
                <div className="workbench-verdict-badge">
                  <HStack gap={1.5} align="center">
                    <StatusDot
                      variant={statusVariant}
                      isPulsing={Boolean(simMode)}
                      label={activeOutcome ? `Simulation active: ${activeOutcome.title}` : 'Simulation idle'}
                    />
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
                  </HStack>
                </div>
              </div>
            </div>

            <Divider variant="subtle" />

            <div className="defense-panel">
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
