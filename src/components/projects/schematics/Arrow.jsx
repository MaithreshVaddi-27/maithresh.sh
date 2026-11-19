// Shared arrow marker. id must be namespaced by the caller (row + stage render the same SVG twice).
export const Arrow = ({ id, fill = '#94a3b8' }) => (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill={fill} />
    </marker>
)
