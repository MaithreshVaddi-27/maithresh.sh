import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { MORE_PROJECTS } from '../data/content'
import { reduceMotion } from '../hooks/useMotion'

// The featured schematics. Each is a one-off 60-line SVG, so it stays
// inline here rather than becoming data. `idPrefix` keeps the arrow marker ids
// unique when a project renders twice (row + sticky stage) — the vanilla build
// cloned innerHTML and then had to strip ids at runtime to dodge duplicates.
const TrustRag = ({ p }) => (
  <svg viewBox="0 0 260 500" role="img" aria-label="TrustRAG reliability pipeline: query goes through hybrid retrieval, grounded generation, and claim verification; if the reliability score fails threshold, one bounded recovery round runs before falling back to an explicit abstain.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="85" y="8" width="90" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="130" y="25" textAnchor="middle" className="pd-t pd-label">QUERY</text>
    <line x1="130" y1="34" x2="130" y2="56" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="58" width="220" height="54" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="80" textAnchor="middle" className="pd-t pd-label">ROUTE (NO LLM) → RETRIEVE</text>
    <text x="130" y="96" textAnchor="middle" className="pd-t pd-sub">BGE-small ONNX dense · BM25 · RRF</text>
    <line x1="130" y1="112" x2="130" y2="136" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="35" y="138" width="190" height="36" rx="8" fill="none" stroke="#334155" />
    <text x="130" y="160" textAnchor="middle" className="pd-t pd-label">GROUNDED GENERATION</text>
    <line x1="130" y1="174" x2="130" y2="198" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="14" y="200" width="232" height="60" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="221" textAnchor="middle" className="pd-t pd-label">CLAIM DECOMPOSITION + NLI</text>
    <text x="130" y="235" textAnchor="middle" className="pd-t pd-sub">supported · contradicted · neutral</text>
    <text x="130" y="250" textAnchor="middle" className="pd-t pd-tiny">SHA-256 · temporal-validity audit</text>
    <line x1="130" y1="260" x2="130" y2="284" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="130,286 206,320 130,354 54,320" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="130" y="317" textAnchor="middle" className="pd-t pd-label pd-sm">VERIFIED?</text>
    <text x="130" y="329" textAnchor="middle" className="pd-t pd-tiny">configurable threshold</text>

    <path d="M54,320 Q38,348 65,372" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="34" y="352" className="pd-t pd-tiny" fill="#f59e0b">no</text>
    <path d="M206,320 Q222,348 195,372" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="204" y="352" className="pd-t pd-tiny" fill="#10b981">yes</text>

    <rect x="10" y="374" width="110" height="52" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="65" y="393" textAnchor="middle" className="pd-t pd-label pd-sm">BOUNDED RECOVERY</text>
    <text x="65" y="406" textAnchor="middle" className="pd-t pd-tiny">failure classified, then fixed</text>
    <text x="65" y="418" textAnchor="middle" className="pd-t pd-tiny" fill="#f59e0b">capped at 2 attempts</text>

    <rect x="140" y="374" width="110" height="52" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="195" y="396" textAnchor="middle" className="pd-t pd-label pd-sm">GROUNDED ANSWER</text>
    <text x="195" y="410" textAnchor="middle" className="pd-t pd-tiny">inline [Segment N] citations</text>

    <path d="M120,388 C 242,388 242,86 230,86" fill="none" stroke="#475569" strokeDasharray="2.5 3" markerEnd={`url(#pdArrow${p})`} />
    <text x="242" y="240" textAnchor="middle" className="pd-t pd-tiny" transform="rotate(90 242 240)">2 attempts max</text>

    <line x1="65" y1="426" x2="65" y2="446" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="10" y="448" width="110" height="34" rx="8" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.1" />
    <text x="65" y="468" textAnchor="middle" className="pd-t pd-label pd-sm pd-bad">ABSTAIN</text>
    <text x="65" y="490" textAnchor="middle" className="pd-t pd-tiny">explicit — never guessed</text>
  </svg>
)

const DocuChat = ({ p }) => (
  <svg viewBox="0 0 260 500" role="img" aria-label="Agentic DocuChat architecture: query routing through single-agent LangGraph ReAct machine, dynamic Composio MCP tool dispatch, and streamed synthesis.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="70" y="8" width="120" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="130" y="25" textAnchor="middle" className="pd-t pd-label">QUERY + CONTEXT</text>
    <line x1="130" y1="34" x2="130" y2="56" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="58" width="220" height="54" rx="10" fill="rgba(16,185,129,0.10)" stroke="#10b981" strokeWidth="1.1" />
    <text x="130" y="80" textAnchor="middle" className="pd-t pd-label">SINGLE-AGENT ROUTER</text>
    <text x="130" y="96" textAnchor="middle" className="pd-t pd-sub">provider choice per question</text>
    <line x1="130" y1="112" x2="130" y2="136" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="130,138 206,172 130,206 54,172" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="130" y="169" textAnchor="middle" className="pd-t pd-label pd-sm">NEEDS EXTERNAL TOOL?</text>
    <text x="130" y="181" textAnchor="middle" className="pd-t pd-tiny">tool policy evaluation</text>

    <path d="M54,172 Q38,200 65,224" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="34" y="204" className="pd-t pd-tiny" fill="#10b981">no</text>
    <rect x="10" y="226" width="110" height="56" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="65" y="246" textAnchor="middle" className="pd-t pd-label pd-sm">CHROMADB VECTORS</text>
    <text x="65" y="260" textAnchor="middle" className="pd-t pd-tiny">local document chunks</text>
    <text x="65" y="272" textAnchor="middle" className="pd-t pd-tiny" fill="#94a3b8">content-hash IDs · no re-embed</text>

    <path d="M206,172 Q222,200 195,224" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="204" y="204" className="pd-t pd-tiny" fill="#38bdf8">yes</text>
    <rect x="140" y="226" width="110" height="56" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="195" y="246" textAnchor="middle" className="pd-t pd-label pd-sm">COMPOSIO MCP HUB</text>
    <text x="195" y="260" textAnchor="middle" className="pd-t pd-tiny">live web radar</text>
    <text x="195" y="272" textAnchor="middle" className="pd-t pd-tiny" fill="#38bdf8">Tavily JSON-RPC 2.0</text>

    <line x1="65" y1="282" x2="105" y2="318" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <line x1="195" y1="282" x2="155" y2="318" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="14" y="320" width="232" height="56" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="342" textAnchor="middle" className="pd-t pd-label">GROUNDED SYNTHESIS + REPAIR PASS</text>
    <text x="130" y="356" textAnchor="middle" className="pd-t pd-sub">uncited answers are re-run, not shipped</text>
    <text x="130" y="368" textAnchor="middle" className="pd-t pd-tiny">Ollama / llama.cpp / Gemini — readiness-checked</text>

    <path d="M14,348 C 2,348 2,86 18,86" fill="none" stroke="#475569" strokeDasharray="2.5 3" markerEnd={`url(#pdArrow${p})`} />
    <text x="6" y="210" textAnchor="middle" className="pd-t pd-tiny" transform="rotate(-90 6 210)">SQLite conversation memory</text>

    <line x1="130" y1="376" x2="130" y2="408" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="20" y="410" width="220" height="46" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="130" y="432" textAnchor="middle" className="pd-t pd-label">STREAMED ANSWER + SOURCES</text>
    <text x="130" y="446" textAnchor="middle" className="pd-t pd-tiny">Gradio UI · CLI entry point preserved</text>
  </svg>
)

const ResumeCrew = ({ p }) => (
  <svg viewBox="0 0 260 500" role="img" aria-label="Resume Crew architecture: deterministic parsing, hardware acceleration detection, claim matching against JD requirements, and evidence-grounded audit report.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="60" y="8" width="140" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="130" y="25" textAnchor="middle" className="pd-t pd-label">RESUME + JD INGEST</text>
    <line x1="130" y1="34" x2="130" y2="56" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="58" width="220" height="54" rx="10" fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="130" y="80" textAnchor="middle" className="pd-t pd-label">PARSE + VALIDATE</text>
    <text x="130" y="96" textAnchor="middle" className="pd-t pd-sub">PDF / DOCX / TXT / MD · pytest-covered</text>
    <line x1="130" y1="112" x2="130" y2="136" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="14" y="138" width="232" height="54" rx="10" fill="none" stroke="#334155" />
    <text x="130" y="160" textAnchor="middle" className="pd-t pd-label">DETERMINISTIC KEYWORD SCORE</text>
    <text x="130" y="176" textAnchor="middle" className="pd-t pd-sub">JD requirements as an explicit checklist</text>
    <line x1="130" y1="192" x2="130" y2="218" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="130,220 206,254 130,288 54,254" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="130" y="251" textAnchor="middle" className="pd-t pd-label pd-sm">MATCH ≥ CRITERIA?</text>
    <text x="130" y="263" textAnchor="middle" className="pd-t pd-tiny">strict evidence scoring</text>

    <path d="M54,254 Q38,282 65,308" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="34" y="284" className="pd-t pd-tiny" fill="#10b981">yes</text>
    <rect x="10" y="310" width="110" height="56" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="65" y="330" textAnchor="middle" className="pd-t pd-label pd-sm">ALIGNMENT REPORTED</text>
    <text x="65" y="344" textAnchor="middle" className="pd-t pd-tiny">cites verified CV spans</text>
    <text x="65" y="356" textAnchor="middle" className="pd-t pd-tiny" fill="#10b981">nothing invented</text>

    <path d="M206,254 Q222,282 195,308" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="204" y="284" className="pd-t pd-tiny" fill="#ef4444">no</text>
    <rect x="140" y="310" width="110" height="56" rx="10" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.1" />
    <text x="195" y="330" textAnchor="middle" className="pd-t pd-label pd-sm">GAPS NAMED</text>
    <text x="195" y="344" textAnchor="middle" className="pd-t pd-tiny">missing requirements listed</text>
    <text x="195" y="356" textAnchor="middle" className="pd-t pd-tiny" fill="#ef4444">plus how to close them</text>

    <line x1="65" y1="366" x2="105" y2="398" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <line x1="195" y1="366" x2="155" y2="398" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="400" width="220" height="52" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="130" y="422" textAnchor="middle" className="pd-t pd-label">6-PART REPORT + INTERVIEW PREP</text>
    <text x="130" y="438" textAnchor="middle" className="pd-t pd-tiny">offline via Ollama · telemetry off by default</text>
  </svg>
)

const CareerOS = ({ p }) => (
  <svg viewBox="0 0 260 500" role="img" aria-label="CareerOS-Pro architecture: multi-source crawler, 2-stage hash and vector deduplication, isolated fault-domain circuit breakers, and application queue.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="60" y="8" width="140" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="130" y="25" textAnchor="middle" className="pd-t pd-label">5 APIs + CAREER-PAGE SCRAPER</text>
    <line x1="130" y1="34" x2="130" y2="56" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="58" width="220" height="54" rx="10" fill="rgba(168,85,247,0.10)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="130" y="80" textAnchor="middle" className="pd-t pd-label">STAGE 1 // DETERMINISTIC NORMALIZE</text>
    <text x="130" y="96" textAnchor="middle" className="pd-t pd-sub">remote · employment · exp level · salary + FX</text>
    <line x1="130" y1="112" x2="130" y2="136" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="14" y="138" width="232" height="54" rx="10" fill="rgba(168,85,247,0.10)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="130" y="160" textAnchor="middle" className="pd-t pd-label">STAGE 2 // 2-STAGE DEDUP</text>
    <text x="130" y="176" textAnchor="middle" className="pd-t pd-sub">url_hash exact → content_hash fallback</text>
    <line x1="130" y1="192" x2="130" y2="218" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="130,220 206,254 130,288 54,254" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="130" y="251" textAnchor="middle" className="pd-t pd-label pd-sm">SOURCE HEALTHY?</text>
    <text x="130" y="263" textAnchor="middle" className="pd-t pd-tiny">per-agent /agents/health</text>

    <path d="M54,254 Q38,282 65,308" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="34" y="284" className="pd-t pd-tiny" fill="#f59e0b">fail</text>
    <rect x="10" y="310" width="110" height="56" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="65" y="330" textAnchor="middle" className="pd-t pd-label pd-sm">CIRCUIT BREAKER</text>
    <text x="65" y="344" textAnchor="middle" className="pd-t pd-tiny">isolated retry queue</text>
    <text x="65" y="356" textAnchor="middle" className="pd-t pd-tiny" fill="#f59e0b">zero pipeline halt</text>

    <path d="M206,254 Q222,282 195,308" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="204" y="284" className="pd-t pd-tiny" fill="#10b981">pass</text>
    <rect x="140" y="310" width="110" height="56" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="195" y="330" textAnchor="middle" className="pd-t pd-label pd-sm">VERIFIED LISTING</text>
    <text x="195" y="344" textAnchor="middle" className="pd-t pd-tiny">HEAD check → Firecrawl</text>
    <text x="195" y="356" textAnchor="middle" className="pd-t pd-tiny" fill="#10b981">LLM only explains the match</text>

    <line x1="65" y1="366" x2="105" y2="398" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <line x1="195" y1="366" x2="155" y2="398" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="400" width="220" height="52" rx="10" fill="rgba(168,85,247,0.08)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="130" y="422" textAnchor="middle" className="pd-t pd-label">FALLBACK-CHAINED MATCH EXPLAINER</text>
    <text x="130" y="438" textAnchor="middle" className="pd-t pd-tiny">FastAPI · LangGraph · React 19 · Qdrant</text>
  </svg>
)

const Arrow = ({ id }) => (
  <marker id={id} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
  </marker>
)

const CareerMesh = ({ p }) => (
  <svg viewBox="0 0 260 500" role="img" aria-label="MCP Agents Suite architecture: LangChain orchestrator with InMemorySaver, unified JSON-RPC 2.0 Composio MCP hub, and live market tool integrations.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="60" y="8" width="140" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="130" y="25" textAnchor="middle" className="pd-t pd-label">CAREER INQUIRY PROMPT</text>
    <line x1="130" y1="34" x2="130" y2="56" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="58" width="220" height="54" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="80" textAnchor="middle" className="pd-t pd-label">LANGGRAPH AGENT</text>
    <text x="130" y="96" textAnchor="middle" className="pd-t pd-sub">thread_id checkpointing · multi-turn</text>
    <line x1="130" y1="112" x2="130" y2="136" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="14" y="138" width="232" height="54" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="160" textAnchor="middle" className="pd-t pd-label">UNIFIED COMPOSIO MCP GATEWAY</text>
    <text x="130" y="176" textAnchor="middle" className="pd-t pd-sub">standard JSON-RPC 2.0 protocol · zero client keys</text>
    <line x1="130" y1="192" x2="70" y2="228" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <line x1="130" y1="192" x2="190" y2="228" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="10" y="230" width="110" height="60" rx="10" fill="rgba(255,255,255,0.02)" stroke="#334155" strokeWidth="1.1" />
    <text x="65" y="252" textAnchor="middle" className="pd-t pd-label pd-sm">JSEARCH API</text>
    <text x="65" y="266" textAnchor="middle" className="pd-t pd-tiny">live job search</text>
    <text x="65" y="278" textAnchor="middle" className="pd-t pd-tiny" fill="#38bdf8">skill → career map</text>

    <rect x="140" y="230" width="110" height="60" rx="10" fill="rgba(255,255,255,0.02)" stroke="#334155" strokeWidth="1.1" />
    <text x="195" y="252" textAnchor="middle" className="pd-t pd-label pd-sm">FIRECRAWL</text>
    <text x="195" y="266" textAnchor="middle" className="pd-t pd-tiny">Glassdoor · Levels.fyi</text>
    <text x="195" y="278" textAnchor="middle" className="pd-t pd-tiny" fill="#38bdf8">salary bands</text>

    <line x1="65" y1="290" x2="105" y2="328" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <line x1="195" y1="290" x2="155" y2="328" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="20" y="330" width="220" height="56" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="130" y="352" textAnchor="middle" className="pd-t pd-label">GROUNDED CAREER ANSWER</text>
    <text x="130" y="366" textAnchor="middle" className="pd-t pd-sub">targets + salary context, tool-sourced</text>
    <text x="130" y="378" textAnchor="middle" className="pd-t pd-tiny">known limitation: tool use is prompted, not forced</text>
  </svg>
)

const Stack = ({ items }) => <div className="proj-stack">{items.map((t) => <span key={t}>{t}</span>)}</div>

// PROJECTS carries the copy; the schematic for each is the component defined
// above. Keyed by the GitHub repo slug so the two can't drift out of order.
const DIAGRAMS = {
  TrustRAG: TrustRag,
  MCP_Agentic_DocuChat: DocuChat,
  Resume_Crew: ResumeCrew,
  'CareerOS-Pro': CareerOS,
  MCP_SkillMap_Agent: CareerMesh,
}

const repoSlug = (href) => href.split('/').pop()

function DetailBody({ project, idPrefix }) {
  const Diagram = DIAGRAMS[repoSlug(project.href)]
  return (
    <>
      {Diagram && <div className="proj-diagram"><Diagram p={idPrefix} /></div>}
      <p className="proj-desc">{project.desc}</p>
      <div className="proj-highlight">{project.highlight}</div>
      <div className="proj-metrics">
        {project.metrics.map(([value, label]) => (
          <span className="proj-metric" key={value}><b>{value}</b> {label}</span>
        ))}
      </div>
      <Stack items={project.stack} />
      {/* Explicit exit: rows select a preview but never navigate, so the
          repository link lives here — in both the row (mobile inline) and
          the stage (desktop panel), never a bare URL hunt. */}
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
    </>
  )
}

// Inside a row the detail sits in a visually-hidden wrapper: it stays in the
// accessibility tree (display:none would drop every project description from a
// linear screen-reader pass) but renders inline under 900px. Inside the sticky
// stage the wrapper would inherit that hiding, so the stage renders the body
// bare — same markup, no innerHTML cloning.
const Detail = ({ project }) => (
  <div className="proj-row-detail">
    <DetailBody project={project} idPrefix="Row" />
  </div>
)

export default function Projects({ projects }) {
  const [active, setActive] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const stageRef = useRef(null)
  const timer = useRef(0)

  // Crossfade the panel on swap. Hovering fast can't land a stale panel because
  // the token guard is the timer itself: each new hover restarts the single
  // pending timeout, so only the last one resolves.
  const select = (i) => {
    if (i === active) return
    if (reduceMotion) return setActive(i)
    setSwapping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setActive(i)
      setSwapping(false)
    }, 180)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  const step = (dir) => select((active + dir + projects.length) % projects.length)

  // Connectors trace themselves in rather than appearing with the rest of the
  // schematic — reads as "data moving through the pipeline". Boxes and the
  // decision diamond stay static; only flow connectors draw.
  useEffect(() => {
    const svg = stageRef.current?.querySelector('.proj-diagram svg')
    if (!svg || reduceMotion || svg.getClientRects().length === 0) return
    const connectors = Array.from(svg.querySelectorAll('line, path')).filter(
      (el) => typeof el.getTotalLength === 'function'
    )
    if (!connectors.length) return
    connectors.forEach((el) => {
      const len = el.getTotalLength()
      el.style.transition = 'none'
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => {
      connectors.forEach((el, i) => {
        el.style.transition = `stroke-dashoffset 0.65s cubic-bezier(.16,1,.3,1) ${i * 0.06}s`
        el.style.strokeDashoffset = '0'
      })
    }))
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <section id="projects">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="folder" />
            <span>$ ls projects/ --featured</span>
          </div>
          <h2>Featured systems</h2>
          <p className="section-sub">
            Highlights from 11+ solo-built systems. Each states the engineering problem, the constraint that
            shaped the design, and the limitation I haven't solved yet — select a system to inspect
            its architecture.
          </p>
        </div>

        <div className="proj-layout">
          <div className="proj-list" role="list" aria-label="Featured systems">
            {projects.map((project, i) => (
              // Rows select a preview but never navigate: on touch there is no
              // hover, so tapping must preview in place (stage on desktop,
              // inline detail on mobile) instead of yeeting the visitor to
              // GitHub. The repository exit lives explicitly in the detail.
              // The title button sits INSIDE the h3 — a heading inside a
              // button would break the parser and split the DOM.
              <div
                className={`proj-row reveal${i === active ? ' active' : ''}`}
                key={project.title}
                role="listitem"
                data-accent={project.accent}
                onMouseEnter={() => select(i)}
                onFocus={() => select(i)}
              >
                <span className="proj-row-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="proj-row-main">
                  <h3 className="proj-row-title">
                    <button
                      type="button"
                      className="proj-row-select"
                      aria-pressed={i === active}
                      aria-label={`Preview ${project.title} architecture`}
                      onClick={() => select(i)}
                    >
                      {project.title}
                    </button>
                  </h3>
                  <span className="proj-row-tag">{project.tag}</span>
                  <Detail project={project} />
                </div>
                <span className="proj-row-swatch" aria-hidden="true"><Icon name={project.swatch} width={1.6} /></span>
                <span className="proj-row-arrow" aria-hidden="true"><Icon name="chev" size={16} width={2} /></span>
              </div>
            ))}
          </div>

          {/* `div`, not `aside`: this sits inside <main>, and a complementary
              landmark nested in another landmark is an axe violation. It's a
              sticky visual stage, not page-level complementary content.
              No `.reveal` either — the stage is display:none until its section
              goes sticky, so a scroll reveal bound to it can never fire. */}
          <div
            className="proj-stage"
            id="projStage"
            data-accent={projects[active].accent}
            aria-live="polite"
          >
            <div className="proj-stage-bar">
              <span className="proj-stage-count" aria-hidden="true">
                {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="proj-stage-nav">
                <button type="button" aria-label="Previous system" onClick={() => step(-1)}>←</button>
                <button type="button" aria-label="Next system" onClick={() => step(1)}>→</button>
              </div>
            </div>
            <div ref={stageRef} className={`proj-stage-inner${swapping ? ' swapping' : ''}`}>
              <DetailBody project={projects[active]} idPrefix="Stage" />
            </div>
          </div>
        </div>

        <MoreProjects open={showMore} onToggle={() => setShowMore((v) => !v)} />
      </div>
    </section>
  )
}

function MoreProjects({ open, onToggle }) {
  const items = MORE_PROJECTS
  return (
    <div className="more-projects reveal">
      <button
        type="button"
        className="more-toggle"
        id="moreToggle"
        aria-expanded={open}
        aria-controls="moreBody"
        onClick={onToggle}
      >
        <span>$ ls projects/ --all</span>
        <span id="moreArrow">{open ? '− hide' : `+ show ${items.length} more`}</span>
      </button>
      <div className={`more-body${open ? ' open' : ''}`} id="moreBody">
        {items.map((item) => (
          <div className="more-item" key={item.title}>
            <span className="proj-tag">{item.tag}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <Stack items={item.stack} />
          </div>
        ))}
      </div>
    </div>
  )
}
