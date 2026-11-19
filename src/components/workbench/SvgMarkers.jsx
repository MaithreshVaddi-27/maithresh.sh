// Shared marker defs — one source, every connector references these by id.
const Marker = ({ id, fill }) => (
  <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M 0 1 L 10 5 L 0 9 z" fill={fill} />
  </marker>
)

export function SvgMarkers() {
  return (
    <svg className="svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <Marker id="arrow" fill="#475569" />
        <Marker id="arrowActive" fill="#38bdf8" />
        <Marker id="arrowSuccess" fill="#10b981" />
        <Marker id="arrowWarn" fill="#f59e0b" />
      </defs>
    </svg>
  )
}
