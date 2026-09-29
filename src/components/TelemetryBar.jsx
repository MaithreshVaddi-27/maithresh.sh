export default function TelemetryBar({ onOpenConsole }) {
  return (
    // Top-level <aside>: this bar is a sibling of <header>/<main>/<footer>, so
    // as bare divs its readout text sat outside every landmark (axe `region`).
    // A complementary landmark is the honest role for a status strip, and
    // being top-level keeps it clear of `landmark-…-is-top-level`.
    <aside className="top-telemetry-bar" aria-label="Session telemetry">
      <div className="telem-group">
        <span className="telem-dot" />
        <span className="telem-status">SYS_STATUS: NOMINAL</span>
        <span className="telem-sep">//</span>
        <span id="telemetry-ptr" className="telem-ptr">PTR: [X: ---, Y: ---]</span>
        <span className="telem-sep">//</span>
        <span className="telem-hi">11+ SOLO SYSTEMS</span>
        <span className="telem-sep">//</span>
        <span className="telem-hi">13+ PIPELINES</span>
      </div>
      <div className="telem-group telem-group--right">
        <span className="telem-dim">LOC: HYDERABAD</span>
        <span className="telem-sep">//</span>
        <button type="button" className="tbtn" onClick={onOpenConsole}>⌘K CONSOLE</button>
      </div>
    </aside>
  )
}
