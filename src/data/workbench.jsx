// Interactive pipeline trace specifications (Stages 01-03 + Verdict).
// Diagrams illustrate system routing and trade-offs.

const node = (stage, title, sub, tiny) => ({ stage, title, sub, tiny })

export const PANES = [
  {
    id: 'trustrag',
    index: '01',
    tab: 'TrustRAG',
    name: 'Reliability pipeline telemetry',
    sub: '// 8_STAGES · LOCAL_INFERENCE',
    ariaLabel: 'Interactive TrustRAG Pipeline Flow Diagram',
    nodes: [
      node('STAGE 01-02 // ROUTE + RETRIEVE', 'Deterministic Route → Hybrid RRF', 'BGE-small ONNX dense + BM25', 'Cross-encoder rerank optional'),
      node('STAGE 03-05 // GENERATE + VERIFY', 'Cited Generation → Claim Decomposition', 'Atomic claims + NLI verdicts', 'SHA-256 + temporal audit'),
      node('STAGE 06-08 // RECOVER + ANSWER', 'Budget-Aware → LangGraph Loop', 'rewrite → retrieve → answer', '≤2 attempts, else ABSTAIN'),
    ],
    sims: [
      ['valid', 'Simulate high-confidence query'],
      ['fail', 'Simulate unverified-claim recovery'],
    ],
    step2Tone: () => null,
    outcomes: {
      valid: { tone: 'cobalt', label: 'OUTCOME', title: 'Grounded Answer', sub: 'All claims SUPPORTED' },
      fail: { tone: 'warn', label: 'OUTCOME', title: 'Bounded Recovery', sub: 'Failure classified, repaired' },
    },
    defense: {
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
          the fact. If the threshold is not met after the recovery budget, the pipeline returns{' '}
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
    tab: 'DocuChat',
    name: 'MCP tool routing telemetry',
    sub: '// PROVIDER_AGNOSTIC_DISPATCH',
    ariaLabel: 'Interactive DocuChat MCP Router Diagram',
    nodes: [
      node('STAGE 01 // INGEST + MEMORY', 'Content-Hash Ingestion', 'PyPDFLoader recursive split', 'ChromaDB: cached embeddings'),
      node('STAGE 02 // PROVIDER', 'Swappable Inference', 'Gemini · Ollama · llama.cpp', 'Readiness check per provider'),
      node('STAGE 03 // DISPATCH', 'Tool Routing (MCP)', 'Composio toolkits or direct', 'One retrieval pass, reused'),
    ],
    sims: [
      ['tool', 'Simulate MCP web dispatch (Tavily)'],
      ['local', 'Simulate local ChromaDB cache hit'],
    ],
    step2Tone: (mode) => (mode === 'tool' || mode === 'mcp' ? 'warn' : 'cobalt'),
    outcomes: {
      tool: { tone: 'warn', label: 'OUTCOME', title: 'Live Web Grounding', sub: 'Tavily via Composio MCP' },
      local: { tone: 'cobalt', label: 'OUTCOME', title: 'Local Vector Answer', sub: 'Cached content-hash hits' },
    },
    defense: {
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
          citations gets re-run before it is shown. One retrieval pass feeds both the generation
          context and the sources panel, so the user can verify the same evidence the model used.
        </>,
      ],
    },
  },
  {
    id: 'resumecrew',
    index: '03',
    tab: 'Resume Crew',
    name: 'Evidence matcher telemetry',
    sub: '// DETERMINISTIC_SCORE + LLM_ANALYSIS',
    ariaLabel: 'Interactive Resume Crew Matcher Diagram',
    nodes: [
      node('STAGE 01 // PARSER', 'Multi-Format Ingest', 'PDF / DOCX / TXT / MD', 'Six-module pytest coverage'),
      node('STAGE 02 // SCORING', 'Deterministic → Keyword Pass', 'JD requirements as checklist', 'Grounds the LLM analysis'),
      node('STAGE 03 // REPORT', 'Six-Part Evidence Report', 'Match · profile · gaps · bullets', 'Interview prep, no invention'),
    ],
    sims: [
      ['match', 'Simulate high-alignment match'],
      ['gap', 'Simulate skill-gap rejection'],
    ],
    step2Tone: () => null,
    outcomes: {
      match: { tone: 'cobalt', label: 'OUTCOME', title: 'Grounded Match', sub: 'Evidence-backed, exportable' },
      gap: { tone: 'danger', label: 'OUTCOME', title: 'Skill-Gap Flag', sub: 'Missing requirements named' },
    },
    defense: {
      title: 'Trade-off I can defend: no generative bullet rewriting',
      paras: [
        <>
          <strong>The failure mode I am designing against:</strong> most AI resume tools prompt a model
          to "improve your bullets," and the model helpfully invents a framework you never used.
          Resume Crew extracts the JD requirements as an explicit checklist and scores against
          verified spans of the actual CV, then lets the LLM explain — never to fabricate.
        </>,
        <>
          <strong>Deterministic first, LLM second:</strong> keyword scoring is code, so it is
          reproducible and testable. The LLM job is interpretation — how to close a gap, what to
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
    tab: 'CareerOS-Pro',
    name: 'Agent mesh & resilience telemetry',
    sub: '// NO_LLM_IN_THE_PARSING_PATH',
    ariaLabel: 'Interactive CareerOS agent mesh diagram',
    nodes: [
      node('STAGE 01 // INGEST', '5 Job APIs + Scraper', 'JSearch · Adzuna · RemoteOK', 'Async scraper w/ semaphores'),
      node('STAGE 02 // NORMALIZE + DEDUP', 'Pure Logic, No Model', 'Location, remote, salary + FX', 'url_hash exact → content_hash'),
      node('STAGE 03 // VERIFY + EXPLAIN', 'Two-Stage Verification', 'HTTP HEAD → Firecrawl scrape', 'LangGraph explain + Qdrant'),
    ],
    sims: [
      ['dedup', 'Simulate 2-stage deduplication'],
      ['resilient', 'Simulate source-failure circuit breaker'],
    ],
    step2Tone: () => null,
    outcomes: {
      dedup: { tone: 'cobalt', label: 'OUTCOME', title: 'Deduped Corpus', sub: 'O(1) exact, then content hash' },
      resilient: { tone: 'warn', label: 'OUTCOME', title: 'Source Degraded', sub: 'Other adapters keep serving' },
    },
    defense: {
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
          itself into a yes. The LLM explains <i>why</i> a listing matches — it does not decide.
        </>,
        <>
          <strong>Verification before surfacing:</strong> nothing reaches the user on a model word.
          A cheap HTTP HEAD confirms the link, then a Firecrawl scrape confirms the content still
          exists. Agents fail independently behind{' '}
          <code>GET /agents/health</code> — call counts, failure rate, latency, status.
        </>,
        <>
          <strong>Stated limitation, not a footnote:</strong> the health registry and rate limiter are
          per-process and in-memory today — they reset on restart and do not span workers. Redis is
          the documented next step for multi-worker production, and it is not built yet.
        </>,
      ],
    },
  },
]
