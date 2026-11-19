import { Arrow } from './Arrow'
import { DiagramFrame } from './DiagramFrame'

// Featured-system schematic. `p` namespaces the arrow marker id.
export const ResumeCrew = ({ p, order = 1 }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="Resume Crew architecture: deterministic parsing, hardware acceleration detection, claim matching against JD requirements, and evidence-grounded audit report.">
    <DiagramFrame label={`${String(order).padStart(2, '0')} / EVIDENCE MATCH`}>

    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">CV + JD</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="128" y="48" textAnchor="middle" className="pd-t pd-label">PARSE +</text>
    <text x="128" y="66" textAnchor="middle" className="pd-t pd-label">VALIDATE</text>
    <text x="128" y="84" textAnchor="middle" className="pd-t pd-sub">PDF·DOCX·MD</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="rgba(15,23,42,0.6)" stroke="#334155" strokeWidth="1.1" />
    <text x="238" y="48" textAnchor="middle" className="pd-t pd-label">KEYWORD</text>
    <text x="238" y="66" textAnchor="middle" className="pd-t pd-label">SCORE</text>
    <text x="238" y="84" textAnchor="middle" className="pd-t pd-sub">checklist</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="348" y="48" textAnchor="middle" className="pd-t pd-label">GAP</text>
    <text x="348" y="66" textAnchor="middle" className="pd-t pd-label">ANALYSIS</text>
    <text x="348" y="84" textAnchor="middle" className="pd-t pd-sub">verified spans</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.2" />
    <text x="456" y="58" textAnchor="middle" className="pd-t pd-sm">MATCH?</text>
    <text x="456" y="73" textAnchor="middle" className="pd-t pd-tiny">criteria</text>

    <path d="M456,94 L440,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="452" y="124" className="pd-t pd-tiny" fill="#10b981">yes</text>
    <path d="M412,60 Q380,105 342,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="372" y="110" className="pd-t pd-tiny" fill="#ef4444">no</text>

    <rect x="216" y="150" width="140" height="62" rx="10" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.1" />
    <text x="286" y="172" textAnchor="middle" className="pd-t pd-label">GAPS</text>
    <text x="286" y="190" textAnchor="middle" className="pd-t pd-label">NAMED</text>
    <text x="286" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#ef4444">how to fix</text>

    <rect x="368" y="150" width="140" height="62" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="438" y="172" textAnchor="middle" className="pd-t pd-label">ALIGN</text>
    <text x="438" y="190" textAnchor="middle" className="pd-t pd-label">REPORT</text>
    <text x="438" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#10b981">nothing added</text>

    <line x1="286" y1="212" x2="286" y2="236" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <path d="M438,212 L330,236" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="186" y="236" width="200" height="52" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="286" y="258" textAnchor="middle" className="pd-t pd-label">6-PART REPORT</text>
    <text x="286" y="274" textAnchor="middle" className="pd-t pd-tiny">PDF · prep</text>
    </DiagramFrame>
  </svg>
)
