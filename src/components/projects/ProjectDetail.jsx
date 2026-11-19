import { TechStack as Stack } from '../Common'
import { DIAGRAMS, repoSlug } from './schematics'

// Shared body for the selected case study: schematic, prose, metrics, stack, exit.
export function DetailBody({ project, idPrefix }) {
  const Diagram = DIAGRAMS[repoSlug(project.href)]
  return (
    <>
      {Diagram && <div className="proj-diagram"><Diagram p={idPrefix} /></div>}
      <div className="proj-panel-prose">
        <p className="proj-desc">{project.desc}</p>
        <div className="proj-highlight">{project.highlight}</div>
        <div className="proj-metrics">
          {project.metrics.map(([value, label]) => (
            <span className="proj-metric" key={value}><b>{value}</b> {label}</span>
          ))}
        </div>
        <Stack items={project.stack} />
        {/* Explicit exit: tabs select a system but never navigate, so the
          repository link lives here — no bare URL hunt. */}
        <div className="proj-actions">
          <a
            className="btn-nested btn-nested-primary btn-nested--sm"
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View repository</span>
            <span className="btn-nested-badge">↗</span>
          </a>
        </div>
      </div>
    </>
  )
}
