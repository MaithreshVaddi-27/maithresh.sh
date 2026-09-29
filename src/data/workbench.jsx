// Four pipelines that were 4× near-identical SVG blocks + 4× near-identical
// imperative sim functions in the vanilla build. The geometry is identical
// across all of them (same viewBox, same node x/width, same three connector
// spans), so it lives here once; each pane only declares its own copy,
// palette, and the two outcomes it can land on.

const IDLE = { stroke: '#1e293b', fill: '#0d1424' }
const LINK_IDLE = { stroke: '#334155', marker: 'arrow' }

const GREEN = { stroke: '#10b981', fill: '#0c271c', marker: 'arrowSuccess' }
const CYAN = { stroke: '#38bdf8', fill: '#0d223a', marker: 'arrowActive' }
const AMBER = { stroke: '#f59e0b', fill: '#291d09', marker: 'arrowWarn' }
const RED = { stroke: '#ef4444', fill: '#2d1214', marker: 'arrowWarn' }

const node = (stage, title, sub, tiny) => ({ stage, title, sub, tiny })

export const PANES = [
  {
    id: 'trustrag',
    index: '01',
    dot: 'cyan',
    tab: 'TrustRAG (Recovery Loop)',
    name: 'VECTOR PIPELINE TELEMETRY',
    sub: '// LOCAL_INFERENCE_OLLAMA_7B',
    svgId: 'pipelineSvg',
    ariaLabel: 'Interactive TrustRAG Pipeline Flow Diagram',
    base: { stroke: '#38bdf8', fill: '#0d223a' },
    nodes: [
      node('STAGE 01 // INGEST', 'Query Embedding', 'Dense BGE-small-en-v1.5', '384-dim semantic vector'),
      node('STAGE 02 // RETRIEVAL', 'Hybrid RRF Fusion', 'Qdrant Vector + BM25 Lexical', 'Top-k=5 deduplicated chunks'),
      node('STAGE 03 // VERIFICATION', 'Fused Claim + NLI', 'Single-call prompt schema', 'SHA-256 evidence hashing'),
    ],
    sims: [
      ['valid', '▶ SIMULATE HIGH-CONFIDENCE QUERY', '✓'],
      ['fail', '▶ SIMULATE UNVERIFIED CLAIM RECOVERY', '↺'],
    ],
    // step 2 (node 3) always base; step 3 is the outcome
    step2: () => null,
    outcomes: {
      valid: { ...GREEN, label: 'OUTCOME', title: 'Grounded Output', sub: 'Claim score: 0.94 ✓' },
      fail: { ...AMBER, label: 'OUTCOME', title: 'Bounded Recovery', sub: 'Query rewrite (1/1)', titleColor: '#34d399' },
    },
    defense: {
      tone: 'cyan',
      title: 'STAFF INTERVIEW DEFENSE: ARCHITECTURAL TRADEOFFS',
      paras: [
        <>
          <strong>Single-Pass Fused NLI vs. Multi-Pass Overhead:</strong> Traditional RAG reliability
          splits claim extraction and NLI entailment scoring into separate sequential LLM calls, adding
          1,200ms–2,000ms latency. TrustRAG fuses extraction and strict citation scoring into a single
          constrained JSON output schema, slashing verification latency by <strong>~62%</strong> on local
          7B models.
        </>,
        <>
          <strong>Bounded LangGraph recovery (2 attempts max):</strong> Rather than entering
          nondeterministic agentic retry loops, TrustRAG classifies verification failures (Missing
          Context vs. Unsupported Claim) and executes a budget-aware recovery sequence (rewrite →
          re-retrieve → regenerate), capped at <strong>2 attempts</strong>. If the reliability threshold
          (<span className="idef-hi">τ ≥ 0.75</span>) remains unreached, it returns an explicit{' '}
          <span className="idef-bad">ABSTAIN</span> token instead of a plausible hallucination.
        </>,
      ],
    },
  },
  {
    id: 'docuchat',
    index: '02',
    dot: 'green',
    tab: 'DocuChat (MCP Tool Router)',
    name: 'MCP TOOL ROUTING TELEMETRY',
    sub: '// LANGGRAPH_REACT_MACHINE',
    svgId: 'docuchatSvg',
    ariaLabel: 'Interactive DocuChat MCP Router Diagram',
    base: { stroke: '#10b981', fill: '#0c271c' },
    nodes: [
      node('STAGE 01 // QUERY', 'User Query + Context', 'SQLite conversation buffer', 'Multi-turn session state'),
      node('STAGE 02 // INTENT ROUTER', 'ReAct State Machine', 'Autonomous tool selector', 'Zero-swarm single agent'),
      node('STAGE 03 // MCP DISPATCH', 'Tool Protocol Gateway', 'Composio MCP + Tavily Live', 'Or ChromaDB PDF vectors'),
    ],
    sims: [
      ['tool', '▶ SIMULATE MCP WEB DISPATCH (TAVILY)', '↗'],
      ['local', '▶ SIMULATE LOCAL CHROMADB CACHE HIT', '»'],
    ],
    // The only pane whose stage-3 color depends on the outcome chosen: a live
    // web dispatch turns the gateway blue, a local cache hit stays green.
    step2: (mode) => (mode === 'tool' || mode === 'mcp' ? CYAN : GREEN),
    outcomes: {
      tool: { ...CYAN, label: 'OUTCOME', title: 'MCP Web Radar', sub: 'Tavily JSON-RPC 2.0 ✓' },
      local: { ...GREEN, label: 'OUTCOME', title: 'Local Vector Hit', sub: 'ChromaDB cache (1.9s) ✓', titleColor: '#34d399' },
    },
    defense: {
      tone: 'green',
      title: 'STAFF INTERVIEW DEFENSE: SINGLE AGENT VS. SWARM INFLATION',
      paras: [
        <>
          <strong>Why I Killed the 3-Agent Swarm:</strong> An early prototype utilized three discrete
          agents (Query Planner, Document Retriever, and Answer Synthesizer). Production profiling
          revealed a <strong>350% token inflation</strong> and 4.9s added latency purely from
          conversational serialization. By collapsing into a single LangGraph state machine with dynamic
          MCP tool routing, latency dropped from <strong>6.8s to 1.9s</strong> with zero quality
          degradation.
        </>,
        <>
          <strong>Standardized MCP Protocol:</strong> Decoupled tool execution from proprietary LLM
          vendor schemas by standardizing on Model Context Protocol (MCP) JSON-RPC 2.0 endpoints. This
          allows live web retrieval tools (Tavily via Composio) and local document parsers to swap
          transparently without rewriting prompt topologies.
        </>,
      ],
    },
  },
  {
    id: 'resumecrew',
    index: '03',
    dot: 'amber',
    tab: 'Resume Crew (ATS Matcher)',
    name: 'ATS EVIDENCE MATCHER TELEMETRY',
    sub: '// METAL_MPS_AUTO_OFFLOAD',
    svgId: 'resumecrewSvg',
    ariaLabel: 'Interactive Resume Crew Matcher Diagram',
    base: { stroke: '#f59e0b', fill: '#291d09' },
    nodes: [
      node('STAGE 01 // PARSER', 'Multi-Format Ingest', 'PDF / DOCX / TXT / MD', 'Clean AST token extraction'),
      node('STAGE 02 // RUNTIME', 'Hardware Acceleration', 'Apple Metal MPS / CUDA', 'Ollama offline inference'),
      node('STAGE 03 // MATCHER', 'Deterministic ATS Fit', 'JD keyword extraction', 'Zero-hallucination ground truth'),
    ],
    sims: [
      ['match', '▶ SIMULATE HIGH-ALIGNMENT ATS MATCH', '✓'],
      ['gap', '▶ SIMULATE SKILL GAP REJECTION', '✕'],
    ],
    step2: () => null,
    outcomes: {
      match: { ...GREEN, label: 'OUTCOME', title: 'Aligned Match', sub: 'Score: 92% verified ✓', titleColor: '#34d399' },
      gap: { ...RED, label: 'OUTCOME', title: 'Skill Gap Alert', sub: 'Missing 2 mandatory reqs', titleColor: '#f87171' },
    },
    defense: {
      tone: 'amber',
      title: 'STAFF INTERVIEW DEFENSE: DETERMINISTIC MATCHING VS. LLM EMBELLISHMENT',
      paras: [
        <>
          <strong>Why I Refuse Creative Generative Rewriting:</strong> Most AI resume tools prompt
          LLMs to “rewrite bullets to pass ATS”, frequently hallucinating unverified tools and
          fabricated metrics. Resume Crew operates strictly on deterministic claim verification: it
          extracts job requirements as an explicit checklist and matches each line item against verified
          textual spans in the user’s CV with citation bounds.
        </>,
        <>
          <strong>Zero-Telemetry Offline Privacy:</strong> Resumes contain personally identifiable
          information (PII). By default, all telemetry is disabled, network calls are isolated, and the
          entire matching pipeline executes locally via Ollama with automated Metal / CUDA GPU
          detection.
        </>,
      ],
    },
  },
  {
    id: 'careeros',
    index: '04',
    dot: 'purple',
    tab: 'CareerOS-Pro (2-Stage Dedup)',
    name: '2-STAGE DEDUP & AGENT MESH TELEMETRY',
    sub: '// LANGGRAPH_RESILIENT_CIRCUIT',
    svgId: 'careerosSvg',
    ariaLabel: 'Interactive CareerOS 2-Stage Dedup Diagram',
    base: { stroke: '#a855f7', fill: '#261238' },
    nodes: [
      node('STAGE 01 // CRAWL', '6 Multi-Source Ingest', 'JSearch / Adzuna / Remotive', 'Raw polymorphic payload'),
      node('STAGE 02 // HASH FILTER', 'Canonical MD5 Hashing', 'Normalized Title+Company', 'Instant O(1) exact dedup'),
      node('STAGE 03 // VECTOR DEDUP', 'ChromaDB Cosine Filter', 'Dense semantic clustering', 'Prunes cross-board variants'),
    ],
    sims: [
      ['dedup', '▶ SIMULATE 2-STAGE DEDUPLICATION', '»'],
      ['resilient', '▶ SIMULATE SOURCE FAILURE CIRCUIT BREAKER', '◈'],
    ],
    step2: () => null,
    outcomes: {
      dedup: { ...GREEN, label: 'OUTCOME', title: 'Dedup Cleaned', sub: '74% duplicate pruned ✓', titleColor: '#34d399' },
      resilient: { ...AMBER, label: 'OUTCOME', title: 'Circuit Breaker', sub: 'Isolated source retry', titleColor: '#fbbf24' },
    },
    defense: {
      tone: 'purple',
      title: 'STAFF INTERVIEW DEFENSE: TWO-STAGE DEDUP & RESILIENT MESH',
      paras: [
        <>
          <strong>Why Naive SQL Unique Keys Fail:</strong> Across multi-board job aggregators,
          identical positions appear with subtle variances (e.g. <i>“Sr. Backend Engineer”</i> vs{' '}
          <i>“Senior Backend Developer”</i>). CareerOS-Pro implements a 2-stage filter: first,
          deterministic canonical normalization (lowercase, stripped punctuation, geo-bucketed)
          eliminates 70% of exact duplicates without vector computation. Second, remaining candidates
          pass through a high-threshold ChromaDB cosine similarity cluster before reaching database
          ingestion.
        </>,
        <>
          <strong>Fault-Tolerant Circuit Breakers:</strong> Every adapter operates in an isolated
          LangGraph node with stateful circuit breaking. If Adzuna or Remotive encounters HTTP 429 rate
          limits or network degradation, the health monitor degrades the pipeline gracefully without
          halting downstream matching.
        </>,
      ],
    },
  },
]

// Geometry is shared: 4 boxes on one 940×180 rail, joined by three connectors.
export const NODES = [
  { x: 10, w: 180, tx: 20 },
  { x: 260, w: 200, tx: 20 },
  { x: 530, w: 200, tx: 20 },
  { x: 800, w: 130, tx: 14 },
]

export const LINKS = [
  { x1: 190, x2: 260 },
  { x1: 460, x2: 530 },
  { x1: 730, x2: 800 },
]

export { IDLE, LINK_IDLE }
