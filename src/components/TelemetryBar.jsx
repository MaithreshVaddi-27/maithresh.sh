export default function TelemetryBar({ onOpenConsole }) {
  return (
    <div className="top-telemetry-bar">
      <div className="telem-group">
        <span className="telem-dot" />
        <span className="telem-status">SYS_STATUS: NOMINAL</span>
        <span className="telem-sep">//</span>
        <span id="telemetry-ptr" className="telem-ptr">PTR: [X: ---, Y: ---]</span>
        <span className="telem-sep">//</span>
        <span className="telem-hi">11 SOLO SYSTEMS</span>
        <span className="telem-sep">//</span>
        <span className="telem-hi">13 PIPELINES</span>
      </div>
      <div className="telem-group telem-group--right">
        <span className="telem-dim">LOC: HYDERABAD</span>
        <span className="telem-sep">//</span>
        <button type="button" className="tbtn" onClick={onOpenConsole}>⌘K CONSOLE</button>
      </div>
    </div>
  )
}
