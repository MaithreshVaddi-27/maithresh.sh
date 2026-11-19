// Shared chrome for the five featured schematics: a quiet measurement grid,
// corner ticks and a stage label. The viewBox stays on each diagram so every
// file remains a standalone, inspectable SVG.
export function DiagramFrame({ label, children }) {
  return (
    <g className="pd-frame" aria-hidden="true">
      <g stroke="#1e293b" strokeOpacity="0.45" strokeWidth="1">
        <path d="M80 8 V296 M160 8 V296 M240 8 V296 M320 8 V296 M400 8 V296 M480 8 V296" />
        <path d="M8 76 H512 M8 152 H512 M8 228 H512" />
      </g>
      <rect x="4" y="4" width="512" height="296" rx="12" fill="none" stroke="#334155" strokeOpacity="0.6" />
      <path d="M4 28 V4 H28 M492 4 H516 V28 M516 276 V300 H492 M28 300 H4 V276"
            fill="none" stroke="#38bdf8" strokeOpacity="0.45" strokeWidth="2" />
      <text x="18" y="20" className="pd-t pd-stage">$ pipeline --trace {label}</text>
      <text x="502" y="294" textAnchor="end" className="pd-t pd-stage">MAITHRESH.SH // SYSTEMS</text>
      {children}
    </g>
  )
}
