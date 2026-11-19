import { Arrow } from './Arrow'

// Featured-system schematic. `p` namespaces the arrow marker id.
export const DocuChat = ({ p }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="Agentic DocuChat architecture: query routing through single-agent LangGraph ReAct machine, dynamic Composio MCP tool dispatch, and streamed synthesis.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">QUERY</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(16,185,129,0.10)" stroke="#10b981" strokeWidth="1.1" />
    <text x="128" y="48" textAnchor="middle" className="pd-t pd-label">INGEST</text>
    <text x="128" y="66" textAnchor="middle" className="pd-t pd-label">HASHED</text>
    <text x="128" y="84" textAnchor="middle" className="pd-t pd-sub">ChromaDB</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="rgba(16,185,129,0.10)" stroke="#10b981" strokeWidth="1.1" />
    <text x="238" y="48" textAnchor="middle" className="pd-t pd-label">ROUTER</text>
    <text x="238" y="66" textAnchor="middle" className="pd-t pd-label">1 AGENT</text>
    <text x="238" y="84" textAnchor="middle" className="pd-t pd-sub">provider pick</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="348" y="48" textAnchor="middle" className="pd-t pd-label">DISPATCH</text>
    <text x="348" y="66" textAnchor="middle" className="pd-t pd-label">MCP</text>
    <text x="348" y="84" textAnchor="middle" className="pd-t pd-sub">Composio</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(16,185,129,0.06)" stroke="#10b981" strokeWidth="1.2" />
    <text x="456" y="58" textAnchor="middle" className="pd-t pd-sm">TOOL?</text>
    <text x="456" y="73" textAnchor="middle" className="pd-t pd-tiny">policy</text>

    <path d="M456,94 L440,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="452" y="124" className="pd-t pd-tiny" fill="#38bdf8">yes</text>
    <path d="M412,60 Q380,105 342,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="372" y="110" className="pd-t pd-tiny" fill="#10b981">no</text>

    <rect x="216" y="150" width="140" height="62" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="286" y="172" textAnchor="middle" className="pd-t pd-label">LOCAL</text>
    <text x="286" y="190" textAnchor="middle" className="pd-t pd-label">VECTORS</text>
    <text x="286" y="205" textAnchor="middle" className="pd-t pd-sub">cached chunks</text>

    <rect x="368" y="150" width="140" height="62" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="438" y="172" textAnchor="middle" className="pd-t pd-label">LIVE WEB</text>
    <text x="438" y="190" textAnchor="middle" className="pd-t pd-label">TAVILY</text>
    <text x="438" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#38bdf8">JSON-RPC 2.0</text>

    <line x1="286" y1="212" x2="286" y2="236" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <path d="M438,212 L330,236" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="186" y="236" width="200" height="52" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="286" y="258" textAnchor="middle" className="pd-t pd-label">STREAMED ANSWER</text>
    <text x="286" y="274" textAnchor="middle" className="pd-t pd-tiny">Gradio · CLI</text>
  </svg>
)
