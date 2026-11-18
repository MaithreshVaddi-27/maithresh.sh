// Shared UI micro-components to eliminate cross-file markup duplication
// across featured systems, automations, credentials, and platform views.

export function TechStack({ items, className = 'proj-stack' }) {
  if (!items || !items.length) return null
  return (
    <div className={className}>
      {items.map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  )
}

export function TerminalHeader({ file }) {
  return (
    <div className="t-head-mini">
      <span />
      <span />
      <span />
      {file && <em>{file}</em>}
    </div>
  )
}
