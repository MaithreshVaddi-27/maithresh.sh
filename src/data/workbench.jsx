// Four pipelines that were 4× near-identical SVG blocks + 4× near-identical
// imperative sim functions in the vanilla build. The geometry is identical
// across all of them (same viewBox, same node x/width, same three connector
// spans), so it lives here once; each pane only declares its own copy,
// palette, and the two outcomes it can land on.
//
// Copy rule: no number appears here unless the portfolio source doc backs it
// (local-only reference, kept out of git).
// Diagrams illustrate architecture, not benchmark claims.

const IDLE = { stroke: '#223046', fill: '#0c121e' }
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
    tab: 'TrustRAG',
    name: 'Reliability pipeline telemetry',
    sub: '// 8_STAGES · LOCAL_INFERENCE',
    svgId: 'pipelineSvg',
    ariaLabel: 'Interactive TrustRAG Pipeline Flow Diagram',
    base: { stroke: '#38bdf8', fill: '#0d223a' },
    nodes: [
      node('STAGE 01-02 // ROUTE + RETRIEVE', 'Deterministic Route → Hybrid RRF', 'BGE-small ONNX dense + BM25', 'Cross-encoder rerank optional'),
      node('STAGE 03-05 // GENERATE + VERIFY', 'Cited Generation → Claim Decomposition', 'Atomic claims + NLI verdicts', 'SHA-256 + temporal audit'),
      node('STAGE 06-08 // RECOVER + ANSWER', 'Budget-Aware → LangGraph Loop', 'rewrite → retrieve → answer', '≤2 attempts, else ABSTAIN'),
    ],
    sims: [
      ['valid', '▶ Simulate high-confidence query', '✓'],
      ['fail', '▶ Simulate unverified-claim recovery', '↺'],
    ],
    // step 2 (node 3) always base; step 3 is the outcome
    step2: () => null,
    outcomes: {
      valid: { ...GREEN, label: 'OUTCOME', title: 'Grounded Answer', sub: 'All claims SUPPORTED ✓', titleColor: '#34d399' },
      fail: { ...AMBER, label: 'OUTCOME', title: 'Bounded Recovery', sub: 'Failure classified, fixed', titleColor: '#fbbf24' },
    },
    defense: {
      tone: 'cyan',
      title: 'Trade-off I can defend: where the LLM is allowed to be',
      paras: [
        <>
          <strong>Route without a model:</strong> stage 1 is deterministic on purpose. If request
          routing needs an LLM call to decide <i>which</i> pipeline to run, the router becomes a
          latency floor and a new failure mode. Classification rules handle the routing decision;
          the model stays out of it.
        </>,
        <>
          <strong>Decompose, then verify, then abstain:</strong> generation is never trusted because
          it <i>looked</i> fluent. Each atomic claim gets an NLI verdict — supported, contradicted,
          or neutral — and the SHA-256 + temporal-validity audit makes the evidence checkable after
          the fact. If the threshold isn't met after the recovery budget, the pipeline returns
          <span className="idef-bad">ABSTAIN</span> rather than a plausible-sounding answer. A wrong
          answer with citations is the failure mode I care about most, because it survives review.
        </>,
        <>
          <strong>Local inference changes the deployment story:</strong> Ollama / llama.cpp / MLX
          with ONNX Runtime embeddings means the default path needs no API key and no data egress.
          Gemini and NVIDIA NIM exist as optional fallbacks, not requirements.
        </>,
      ],
    },
  },
  {
    id: 'docuchat',
    index: '02',
    dot: 'green',
    tab: 'DocuChat',
    name: 'MCP tool routing telemetry',
    sub: '// PROVIDER_AGNOSTIC_DISPATCH',
    svgId: 'docuchatSvg',
    ariaLabel: 'Interactive DocuChat MCP Router Diagram',
    base: { stroke: '#10b981', fill: '#0c271c' },
    nodes: [
      node('STAGE 01 // INGEST + MEMORY', 'Content-Hash Ingestion', 'PyPDFLoader recursive split', 'ChromaDB: cached embeddings'),
      node('STAGE 02 // PROVIDER', 'Swappable Inference', 'Gemini · Ollama · llama.cpp', 'Readiness check per provider'),
      node('STAGE 03 // DISPATCH', 'Tool Routing (MCP)', 'Composio toolkits or direct', 'One retrieval pass, reused'),
    ],
    sims: [
      ['tool', '▶ Simulate MCP web dispatch (Tavily)', '↗'],
      ['local', '▶ Simulate local ChromaDB cache hit', '»'],
    ],
    // The only pane whose stage-3 color depends on the outcome chosen: a live
    // web dispatch turns the gateway blue, a local cache hit stays green.
    step2: (mode) => (mode === 'tool' || mode === 'mcp' ? CYAN : GREEN),
    outcomes: {
      tool: { ...CYAN, label: 'OUTCOME', title: 'Live Web Grounding', sub: 'Tavily via Composio MCP ✓', titleColor: '#38bdf8' },
      local: { ...GREEN, label: 'OUTCOME', title: 'Local Vector Answer', sub: 'Cached content-hash hits ✓', titleColor: '#34d399' },
    },
    defense: {
      tone: 'green',
      title: 'Trade-off I can defend: one agent, not a swarm',
      paras: [
        <>
          <strong>Why I cut the multi-agent version:</strong> an early build split the work across a
          planner, a retriever, and a synthesizer. The coordination cost grew faster than the answer
          quality did, so I collapsed it into a single agent with dynamic tool routing. I kept the CLI
          entry point with <code>retrieve_multi</code> and <code>calculate</code> tools because those
          genuinely earn their place.
        </>,
        <>
          <strong>Provider routing is a cost decision:</strong> Gemini always takes the tool-calling
          agent path. Local models only do when <code>COMPOSIO_TOOLKITS</code> is configured —
          otherwise they take a direct-grounded streaming path, which is faster and cheaper.
        </>,
        <>
          <strong>Grounding check with a repair pass:</strong> any answer that ships without
          citations gets re-run before it's shown. One retrieval pass feeds both the generation
          context and the sources panel, so the user can verify the same evidence the model used.
        </>,
      ],
    },
  },
  {
    id: 'resumecrew',
    index: '03',
    dot: 'amber',
    tab: 'Resume Crew',
    name: 'Evidence matcher telemetry',
    sub: '// DETERMINISTIC_SCORE + LLM_ANALYSIS',
    svgId: 'resumecrewSvg',
    ariaLabel: 'Interactive Resume Crew Matcher Diagram',
    base: { stroke: '#f59e0b', fill: '#291d09' },
    nodes: [
      node('STAGE 01 // PARSER', 'Multi-Format Ingest', 'PDF / DOCX / TXT / MD', 'Six-module pytest coverage'),
      node('STAGE 02 // SCORING', 'Deterministic → Keyword Pass', 'JD requirements as checklist', 'Grounds the LLM analysis'),
      node('STAGE 03 // REPORT', 'Six-Part Evidence Report', 'Match · profile · gaps · bullets', 'Interview prep, no invention'),
    ],
    sims: [
      ['match', '▶ Simulate high-alignment match', '✓'],
      ['gap', '▶ Simulate skill-gap rejection', '✕'],
    ],
    step2: () => null,
    outcomes: {
      match: { ...GREEN, label: 'OUTCOME', title: 'Grounded Match', sub: 'Evidence-backed, exportable', titleColor: '#34d399' },
      gap: { ...RED, label: 'OUTCOME', title: 'Skill-Gap Flag', sub: 'Missing requirements named', titleColor: '#f87171' },
    },
    defense: {
      tone: 'amber',
      title: 'Trade-off I can defend: no generative bullet rewriting',
      paras: [
        <>
          <strong>The failure mode I'm designing against:</strong> most AI resume tools prompt a model
          to "improve your bullets," and the model helpfully invents a framework you never used.
          Resume Crew extracts the JD's requirements as an explicit checklist and scores against
          verified spans of the actual CV, then lets the LLM explain — never to fabricate.
        </>,
        <>
          <strong>Deterministic first, LLM second:</strong> keyword scoring is code, so it's
          reproducible and testable. The LLM's job is interpretation — how to close a gap, what to
          say in interview — grounded in that score.
        </>,
        <>
          <strong>Privacy is a design constraint, not a setting:</strong> resumes are PII, so CrewAI
          tracing and telemetry ship <b>disabled</b>, embeddings and inference run locally via Ollama
          with Metal / CUDA / CPU auto-detection, and the public ngrok share is optional and
          password-protected.
        </>,
      ],
    },
  },
  {
    id: 'careeros',
    index: '04',
    dot: 'green',
    tab: 'CareerOS-Pro',
    name: 'AGENT MESH & RESILIENCE TELEMETRY',
    sub: '// NO_LLM_IN_THE_PARSING_PATH',
    svgId: 'careerosSvg',
    ariaLabel: 'Interactive CareerOS agent mesh diagram',
    base: { stroke: '#10b981', fill: '#0c271c' },
    nodes: [
      node('STAGE 01 // INGEST', '5 Job APIs + Scraper', 'JSearch · Adzuna · RemoteOK', 'Async scraper w/ semaphores'),
      node('STAGE 02 // NORMALIZE + DEDUP', 'Pure Logic, No Model', 'Location, remote, salary + FX', 'url_hash exact → content_hash'),
      node('STAGE 03 // VERIFY + EXPLAIN', 'Two-Stage Verification', 'HTTP HEAD → Firecrawl scrape', 'LangGraph explain + Qdrant'),
    ],
    sims: [
      ['dedup', '▶ Simulate 2-stage deduplication', '»'],
      ['resilient', '▶ Simulate source-failure circuit breaker', '◈'],
    ],
    step2: () => null,
    outcomes: {
      dedup: { ...GREEN, label: 'OUTCOME', title: 'Deduped Corpus', sub: 'O(1) exact, then content hash', titleColor: '#34d399' },
      resilient: { ...AMBER, label: 'OUTCOME', title: 'Source Degraded', sub: 'Other adapters keep serving', titleColor: '#fbbf24' },
    },
    defense: {
      tone: 'green',
      title: 'Trade-off I can defend: keeping the model out of the parse path',
      paras: [
        <>
          <strong>Why naive string dedup fails across boards:</strong> the same role appears as{' '}
          <i>“Sr. Backend Engineer”</i> on one board and <i>“Senior Backend Developer”</i> on
          another, with a different posted date and description. Exact-match keys miss all of it.
          CareerOS-Pro dedups in two stages — <code>url_hash</code> for the O(1) exact case, then a
          <code>content_hash</code> fallback for the same job re-posted with edits.
        </>,
        <>
          <strong>Eligibility filters are never negotiable:</strong> location, remote status,
          employment type, experience level, and salary parsing are pure logic. The LLM never gets to
          override a hard filter, because a model asked to judge eligibility will eventually talk
          itself into a yes. The LLM explains <i>why</i> a listing matches — it doesn't decide.
        </>,
        <>
          <strong>Verification before surfacing:</strong> nothing reaches the user on a model's word.
          A cheap HTTP HEAD confirms the link, then a Firecrawl scrape confirms the content still
          exists. Agents fail independently behind{' '}
          <code>GET /agents/health</code> — call counts, failure rate, latency, status.
        </>,
        <>
          <strong>Stated limitation, not a footnote:</strong> the health registry and rate limiter are
          per-process and in-memory today — they reset on restart and don't span workers. Redis is
          the documented next step for multi-worker production, and it isn't built yet.
        </>,
      ],
    },
  },
]

// Geometry is shared: 4 boxes on one 940×180 rail, joined by three connectors.
// Slot 3 is the outcome box (w: 215). All three stage boxes are identically
// 195 units wide, and all three connectors span identically 40 units with 10-unit
// symmetric outer margins (10 + 195 + 40 + 195 + 40 + 195 + 40 + 215 + 10 = 940).
export const NODES = [
  { x: 10, w: 195, tx: 20 },
  { x: 245, w: 195, tx: 20 },
  { x: 480, w: 195, tx: 20 },
  { x: 715, w: 215, tx: 20 },
]

export const LINKS = [
  { x1: 205, x2: 245 },
  { x1: 440, x2: 480 },
  { x1: 675, x2: 715 },
]

export { IDLE, LINK_IDLE }
