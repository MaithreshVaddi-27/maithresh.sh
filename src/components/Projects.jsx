import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { MORE_PROJECTS } from '../data/content'
import { reduceMotion } from '../hooks/useMotion'

// The featured schematics. Each is a one-off 60-line SVG, so it stays
// inline here rather than becoming data. `idPrefix` keeps the arrow marker ids
// unique when a project renders twice (row + sticky stage) — the vanilla build
// cloned innerHTML and then had to strip ids at runtime to dodge duplicates.
const TrustRag = ({ p }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="TrustRAG reliability pipeline: query goes through hybrid retrieval, grounded generation, and claim verification; if the reliability score fails threshold, one bounded recovery round runs before falling back to an explicit abstain.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">QUERY</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="128" y="48" textAnchor="middle" className="pd-t pd-label">ROUTE →</text>
    <text x="128" y="66" textAnchor="middle" className="pd-t pd-label">RETRIEVE</text>
    <text x="128" y="84" textAnchor="middle" className="pd-t pd-sub">BGE · BM25</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="none" stroke="#334155" />
    <text x="238" y="48" textAnchor="middle" className="pd-t pd-label">GROUNDED</text>
    <text x="238" y="66" textAnchor="middle" className="pd-t pd-label">GEN</text>
    <text x="238" y="84" textAnchor="middle" className="pd-t pd-sub">[Segment N]</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="348" y="48" textAnchor="middle" className="pd-t pd-label">CLAIM</text>
    <text x="348" y="66" textAnchor="middle" className="pd-t pd-label">+ NLI</text>
    <text x="348" y="84" textAnchor="middle" className="pd-t pd-sub">3 verdicts</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="456" y="58" textAnchor="middle" className="pd-t pd-sm">VERIFIED?</text>
    <text x="456" y="73" textAnchor="middle" className="pd-t pd-tiny">threshold</text>

    <path d="M456,94 L440,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="452" y="124" className="pd-t pd-tiny" fill="#10b981">yes</text>
    <path d="M412,60 Q380,105 342,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="372" y="110" className="pd-t pd-tiny" fill="#f59e0b">no</text>

    <rect x="216" y="150" width="140" height="62" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="286" y="172" textAnchor="middle" className="pd-t pd-label">BOUNDED</text>
    <text x="286" y="190" textAnchor="middle" className="pd-t pd-label">RECOVERY</text>
    <text x="286" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#f59e0b">≤2 tries</text>

    <rect x="368" y="150" width="140" height="62" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="438" y="172" textAnchor="middle" className="pd-t pd-label">GROUNDED</text>
    <text x="438" y="190" textAnchor="middle" className="pd-t pd-label">ANSWER</text>
    <text x="438" y="205" textAnchor="middle" className="pd-t pd-sub">cited or bust</text>

    <line x1="286" y1="212" x2="286" y2="236" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="186" y="236" width="200" height="52" rx="10" fill="rgba(239,68,68,0.08)" stroke="#ef4444" strokeWidth="1.1" />
    <text x="286" y="258" textAnchor="middle" className="pd-t pd-label pd-bad">ABSTAIN</text>
    <text x="286" y="274" textAnchor="middle" className="pd-t pd-tiny">never guessed</text>
  </svg>
)

const DocuChat = ({ p }) => (
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

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
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

const ResumeCrew = ({ p }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="Resume Crew architecture: deterministic parsing, hardware acceleration detection, claim matching against JD requirements, and evidence-grounded audit report.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">CV + JD</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="128" y="48" textAnchor="middle" className="pd-t pd-label">PARSE +</text>
    <text x="128" y="66" textAnchor="middle" className="pd-t pd-label">VALIDATE</text>
    <text x="128" y="84" textAnchor="middle" className="pd-t pd-sub">PDF·DOCX·MD</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="none" stroke="#334155" />
    <text x="238" y="48" textAnchor="middle" className="pd-t pd-label">KEYWORD</text>
    <text x="238" y="66" textAnchor="middle" className="pd-t pd-label">SCORE</text>
    <text x="238" y="84" textAnchor="middle" className="pd-t pd-sub">checklist</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(245,158,11,0.10)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="348" y="48" textAnchor="middle" className="pd-t pd-label">GAP</text>
    <text x="348" y="66" textAnchor="middle" className="pd-t pd-label">ANALYSIS</text>
    <text x="348" y="84" textAnchor="middle" className="pd-t pd-sub">verified spans</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
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
  </svg>
)

const CareerOS = ({ p }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="CareerOS-Pro architecture: multi-source crawler, 2-stage hash and vector deduplication, isolated fault-domain circuit breakers, and application queue.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">5 APIS</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(168,85,247,0.10)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="128" y="52" textAnchor="middle" className="pd-t pd-label">NORMALIZE</text>
    <text x="128" y="72" textAnchor="middle" className="pd-t pd-sub">hard filters</text>
    <text x="128" y="86" textAnchor="middle" className="pd-t pd-tiny">no LLM</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="rgba(168,85,247,0.10)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="238" y="52" textAnchor="middle" className="pd-t pd-label">DEDUP x2</text>
    <text x="238" y="72" textAnchor="middle" className="pd-t pd-sub">url→content</text>
    <text x="238" y="86" textAnchor="middle" className="pd-t pd-tiny">hash keys</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(168,85,247,0.10)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="348" y="52" textAnchor="middle" className="pd-t pd-label">VERIFY</text>
    <text x="348" y="72" textAnchor="middle" className="pd-t pd-sub">HEAD→scrape</text>
    <text x="348" y="86" textAnchor="middle" className="pd-t pd-tiny">Firecrawl</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="456" y="58" textAnchor="middle" className="pd-t pd-sm">HEALTHY?</text>
    <text x="456" y="73" textAnchor="middle" className="pd-t pd-tiny">/health</text>

    <path d="M456,94 L440,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="452" y="124" className="pd-t pd-tiny" fill="#10b981">pass</text>
    <path d="M412,60 Q380,105 342,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="372" y="110" className="pd-t pd-tiny" fill="#f59e0b">fail</text>

    <rect x="216" y="150" width="140" height="62" rx="10" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="1.1" />
    <text x="286" y="172" textAnchor="middle" className="pd-t pd-label">CIRCUIT</text>
    <text x="286" y="190" textAnchor="middle" className="pd-t pd-label">BREAKER</text>
    <text x="286" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#f59e0b">no halt</text>

    <rect x="368" y="150" width="140" height="62" rx="10" fill="rgba(16,185,129,0.08)" stroke="#10b981" strokeWidth="1.1" />
    <text x="438" y="172" textAnchor="middle" className="pd-t pd-label">VERIFIED</text>
    <text x="438" y="190" textAnchor="middle" className="pd-t pd-label">LISTING</text>
    <text x="438" y="205" textAnchor="middle" className="pd-t pd-tiny" fill="#10b981">LLM explains</text>

    <line x1="286" y1="212" x2="286" y2="236" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <path d="M438,212 L330,236" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="186" y="236" width="200" height="52" rx="10" fill="rgba(168,85,247,0.08)" stroke="#a855f7" strokeWidth="1.1" />
    <text x="286" y="258" textAnchor="middle" className="pd-t pd-label">MATCH EXPLAIN</text>
    <text x="286" y="274" textAnchor="middle" className="pd-t pd-tiny">fallback chain</text>
  </svg>
)

const Arrow = ({ id }) => (
  <marker id={id} viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
  </marker>
)

const CareerMesh = ({ p }) => (
  <svg viewBox="0 0 520 304" role="img" aria-label="MCP Agents Suite architecture: LangChain orchestrator with InMemorySaver, unified JSON-RPC 2.0 Composio MCP hub, and live market tool integrations.">
    <defs><Arrow id={`pdArrow${p}`} /></defs>
    <rect x="6" y="47" width="58" height="26" rx="13" fill="none" stroke="#334155" />
    <text x="35" y="64" textAnchor="middle" className="pd-t pd-tiny">QUERY</text>
    <line x1="64" y1="60" x2="78" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="78" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="128" y="52" textAnchor="middle" className="pd-t pd-label">LANGGRAPH</text>
    <text x="128" y="72" textAnchor="middle" className="pd-t pd-sub">thread_id</text>
    <text x="128" y="86" textAnchor="middle" className="pd-t pd-tiny">multi-turn</text>
    <line x1="178" y1="60" x2="188" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="188" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.12)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="238" y="48" textAnchor="middle" className="pd-t pd-label">MCP</text>
    <text x="238" y="66" textAnchor="middle" className="pd-t pd-label">GATEWAY</text>
    <text x="238" y="84" textAnchor="middle" className="pd-t pd-sub">JSON-RPC</text>
    <line x1="288" y1="60" x2="298" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <rect x="298" y="24" width="100" height="72" rx="10" fill="rgba(56,189,248,0.10)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="348" y="48" textAnchor="middle" className="pd-t pd-label">SEARCH +</text>
    <text x="348" y="66" textAnchor="middle" className="pd-t pd-label">SALARY</text>
    <text x="348" y="84" textAnchor="middle" className="pd-t pd-sub">live data</text>
    <line x1="398" y1="60" x2="408" y2="60" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />

    <polygon points="456,26 500,60 456,94 412,60" fill="rgba(255,255,255,0.03)" stroke="#475569" strokeWidth="1.1" />
    <text x="456" y="58" textAnchor="middle" className="pd-t pd-sm">GROUNDED?</text>
    <text x="456" y="73" textAnchor="middle" className="pd-t pd-tiny">or general?</text>

    <path d="M456,94 L440,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="452" y="124" className="pd-t pd-tiny" fill="#38bdf8">yes</text>
    <path d="M412,60 Q380,105 342,150" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <text x="372" y="110" className="pd-t pd-tiny" fill="#f59e0b">ish</text>

    <rect x="216" y="150" width="140" height="62" rx="10" fill="rgba(255,255,255,0.02)" stroke="#334155" strokeWidth="1.1" />
    <text x="286" y="172" textAnchor="middle" className="pd-t pd-label">TOOL</text>
    <text x="286" y="190" textAnchor="middle" className="pd-t pd-label">NUDGE</text>
    <text x="286" y="205" textAnchor="middle" className="pd-t pd-tiny">limitation</text>

    <rect x="368" y="150" width="140" height="62" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="438" y="172" textAnchor="middle" className="pd-t pd-label">CAREER</text>
    <text x="438" y="190" textAnchor="middle" className="pd-t pd-label">ANSWER</text>
    <text x="438" y="205" textAnchor="middle" className="pd-t pd-sub">tool-sourced</text>

    <line x1="286" y1="212" x2="286" y2="236" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <path d="M438,212 L330,236" fill="none" stroke="#334155" markerEnd={`url(#pdArrow${p})`} />
    <rect x="186" y="236" width="200" height="52" rx="10" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.1" />
    <text x="286" y="258" textAnchor="middle" className="pd-t pd-label">POLISHED CLI</text>
    <text x="286" y="274" textAnchor="middle" className="pd-t pd-tiny">clean errors</text>
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
