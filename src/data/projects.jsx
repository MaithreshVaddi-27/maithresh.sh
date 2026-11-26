// Project marks are imported so Vite rebases them for both / and /maithresh.sh/.
const projectIcons = import.meta.glob('../../assets/project-icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})
const mark = (name) => projectIcons[`../../assets/project-icons/${name}.svg`]

export const MORE_PROJECTS = [
  {
    tag: 'solo · CrewAI · content',
    title: 'AI Blog Writing Crew',
    icon: mark('ai-blog-writing-crew'),
    href: 'https://github.com/MaithreshVaddi-27/Ai-Blog-Writer-Crew',
    body: 'Three sequential CrewAI agents (Content Strategist → Blog Writer → Editor) turn a topic into an edited markdown post. Supports --topic, custom output paths (-o), and model overrides via Gemini.',
    stack: ['CrewAI', 'Gemini', 'Python 3.10+'],
  },
  {
    tag: 'solo · CrewAI · Pygame WASM',
    title: 'AI Game Development Crew',
    icon: mark('ai-game-dev-crew'),
    href: 'https://github.com/MaithreshVaddi-27/AI-Game-Dev-Crew',
    body: 'Game Designer → Senior Python Developer → QA Reviewer turns a one-line idea into a playable 2D Pygame game, compiled to WebAssembly with pygbag (--ume_block 0 + template patch) and shared over ngrok. Auto-strips unterminated markdown code fences.',
    stack: ['CrewAI', 'Gemini', 'Pygame', 'pygbag', 'Serper'],
  },
  {
    tag: 'solo · LangChain · Composio MCP',
    title: 'Email Inbox Summarizer',
    icon: mark('email-inbox-summarizer'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_Email_Inbox_Summarizer',
    body: 'Reads unread Gmail, classifies messages into URGENT / NEEDS REPLY / FYI, and drafts replies through five Gmail MCP tools (fetch, draft, reply-to-thread, modify labels, list labels). Drafts only — never sends.',
    stack: ['LangChain', 'LangGraph', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · LangChain · Composio MCP',
    title: 'CourseFinder Agent',
    icon: mark('coursefinder-agent'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_CourseFinder_Agent',
    body: 'Tavily and YouTube tools behind Composio MCP turn a topic into learning roadmaps and curated video courses. Terminal chat loop with LangGraph checkpointing and automatic retry with backoff on transient errors.',
    stack: ['LangChain', 'LangGraph', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · Kaggle GPU · speech',
    title: 'F5-TTS Podcast Generator',
    icon: mark('f5-tts-podcast-generator'),
    href: 'https://github.com/MaithreshVaddi-27/F5-tts-podcast-generator',
    body: 'Reproducible six-step Kaggle T4 notebook for F5-TTS voice cloning with four reference emotion samples (normal, sad, anger, surprise), pinned PyTorch 2.4+cu121 / Transformers 4.44.2, and a Gradio UI.',
    stack: ['F5-TTS', 'Kaggle', 'PyTorch', 'Gradio'],
  },
  {
    tag: 'solo · Retell AI · voice agent',
    title: 'Home Credit LAP Voice Agent',
    icon: mark('home-credit-lap-voice-agent'),
    href: 'https://github.com/MaithreshVaddi-27/home-credit-lap-voice-agent',
    body: 'Bilingual Hindi/English Retell AI phone agent that screens pre-approved LAP offers up to ₹75 lakh across a 7-item checklist and 4 hard stops, with 7 documented test scenarios and raw transcripts. Final credit decisions stay with humans.',
    stack: ['Retell AI', 'Prompt engineering', 'RAG context'],
  },
  {
    tag: 'solo · early work',
    title: 'FoodMunch — Restaurant Landing Page',
    icon: mark('foodmunch'),
    href: 'https://github.com/MaithreshVaddi-27/FoodMunch',
    body: 'Responsive restaurant site with hero, menu categories, delivery and payment info, gift redemption, and footer — early structured frontend built with HTML5, CSS3, and Bootstrap 4.5.',
    stack: ['HTML5', 'CSS3', 'Bootstrap 4.5'],
  },
]

// Ordered by engineering weight based on verified repositories in projects-github/.
export const PROJECTS = [
  {
    tag: 'solo · verification · local-first',
    title: 'TrustRAG — Local-First RAG Reliability Workbench',
    icon: mark('trustrag'),
    href: 'https://github.com/MaithreshVaddi-27/TrustRAG',
    desc: (
      <>
        An 8-stage verification pipeline: deterministic route → hybrid retrieval (<code>BGE-small</code> on ONNX Runtime + BM25 with server-side IDF and RRF fusion) → grounded generation → atomic claim decomposition → NLI verdicts (<code>SUPPORTED</code> / <code>CONTRADICTED</code> / <code>NEUTRAL</code>) → SHA-256 and temporal-validity audit → budget-aware LangGraph recovery → answer or safe <code>ABSTAIN</code>. Ingests PDF, DOCX, CSV, JSON, HTML, TXT, and MD with RapidOCR fallback.
      </>
    ),
    highlight: (
      <>
        Runs locally by default (Ollama, llama.cpp, or MLX; embedded Qdrant + MongoDB 7; <code>models.yaml</code> v1.29 controls KV-cache quantization, flash attention, and context compression). Hardened with JWT HS256 (<code>iss/aud</code> + JTI revocation), bcrypt, login lockout, SSRF guards, KB snapshots + rollback, a JSON-RPC 2.0 MCP server, SSE streaming, and Prometheus <code>/metrics</code>. Fused decompose+verify halves verification calls; verified across pytest, Vitest, Playwright, and k6.
      </>
    ),
    metrics: [
      ['8 stages', 'route → answer or abstain'],
      ['≤2 attempts', 'bounded recovery loop'],
      ['fused NLI', 'halves verification calls'],
    ],
    stack: [
      'FastAPI 0.115 · Python 3.11+ · Pydantic v2',
      'LangGraph · LangChain',
      'React 18 · Vite 6 · Tailwind 3 · TanStack Query 5',
      'Qdrant · MongoDB 7',
      'ONNX Runtime · BGE-small · int8 reranker',
      'MCP JSON-RPC 2.0',
      'Docker Compose · pytest · Vitest · Playwright · k6',
    ],
  },
  {
    tag: 'solo · job intelligence · deterministic',
    title: 'CareerOS-Pro — Deterministic Normalize, LLM Only for Explain',
    icon: mark('careeros-pro'),
    href: 'https://github.com/MaithreshVaddi-27/CareerOS-Pro',
    desc: (
      <>
        Self-hosted job-intelligence platform aggregating six sources (JSearch, Adzuna, Remotive, RemoteOK, Arbeitnow, plus an async company scraper). Normalization, <code>url_hash</code> + <code>content_hash</code> deduplication, hard eligibility filters, and hybrid keyword + semantic reranking run in pure Python — unreadable fields remain <code>unknown</code>, and the LLM never overrides a hard rule.
      </>
    ),
    highlight: (
      <>
        A linear LangGraph state machine (<code>backend/graph.py</code>) with a <code>human_review</code> interrupt hands only pre-approved matches to Gemini via a CRAFT-structured grounding prompt that quotes posting evidence on <code>/jobs/match</code>. Backed by MySQL 8, embedded Qdrant, and <b>218 pytest tests</b> across 17 test files (with <code>ruff</code> CI enforcement).
      </>
    ),
    metrics: [
      ['6 sources', '5 job APIs + async scraper'],
      ['218 tests', '17 pytest suites · ruff CI'],
      ['0 LLM parse', 'hard rules stay pure Python'],
    ],
    stack: [
      'FastAPI 0.115+ · Python 3.12',
      'React 19 · Vite',
      'MySQL 8 · Qdrant (embedded)',
      'LangGraph · Gemini',
      'pytest · ruff · GitHub Actions',
    ],
  },
  {
    tag: 'solo · open source · multi-runtime',
    title: 'ApplyOS — Local-First Job Application OS',
    icon: mark('applyos'),
    href: 'https://github.com/MaithreshVaddi-27/ApplyOS',
    desc: (
      <>
        Runtime-agnostic job application engine pairing markdown workflow specs (<code>/setup</code>, <code>/scrape</code>, <code>/rank</code>, <code>/apply</code>) with a zero-runtime-dependency Bun workspace: two runnable apps (<code>applyos</code> CLI and read-only <code>applyos-tui</code>), six core packages, 13 portal-search CLIs, and 14 provider entries (6 aggregators + 8 ATS adapters including Workday, Greenhouse, Lever, SmartRecruiters, and Amazon).
      </>
    ),
    highlight: (
      <>
        The deterministic ranker evaluates <b>9 gates</b>, 4 weighted dimensions, and 5 verdict bands — missing evidence reports <code>not evaluated</code> rather than guessing. Generates LaTeX CVs verified for ATS text-layer parseability (<code>verify_pdf.py --check-ats</code>) and validates behavior across 4 offline deterministic eval runners and cross-OS CI.
      </>
    ),
    metrics: [
      ['14 providers', '6 aggregators · 8 ATS engines'],
      ['9 gates', '4 dimensions · 5 verdict bands'],
      ['4 eval suites', 'offline deterministic + ATS PDF'],
    ],
    stack: [
      'Bun 1.4.3 · TypeScript workspace',
      'Python 3.10+ · LaTeX (lualatex)',
      '6 engine packages · CLI + TUI',
      'OpenCode · Claude Code · Codex adapters',
      'GitHub Actions (macOS / Linux / Windows)',
    ],
  },
  {
    tag: 'solo · grounding · local inference',
    title: 'Agentic DocuChat — Local LLM RAG + MCP Tools',
    icon: mark('docuchat'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_Agentic_DocuChat',
    desc: (
      <>
        Upload a PDF, ask a question, and get an answer pinned to the exact source pages. Runs offline via Ollama, llama.cpp, or MLX, with Google Gemini as an optional cloud path. Content-hash ChromaDB IDs skip re-embedding across restarts, and PDF text is treated strictly as evidence to resist prompt injection.
      </>
    ),
    highlight: (
      <>
        Simplified from a multi-agent graph to a single agent with dynamic tool routing (<b>6.8 s → 1.9 s, −68% tokens</b>). One retrieval pass feeds both the reply and the Sources panel, with a single repair pass when citations are missing. Covered by <b>102 unit tests</b> and DeepEval checks.
      </>
    ),
    metrics: [
      ['1 retrieval pass', 'answer + page citations'],
      ['−68% tokens', 'single agent over swarm'],
      ['102 tests', 'Ollama · llama.cpp · MLX · Gemini'],
    ],
    stack: [
      'LangChain · LangGraph',
      'ChromaDB · SQLite memory',
      'Gradio',
      'Composio MCP · Tavily',
      'Ollama · llama.cpp · MLX · Gemini',
      'Python 3.10–3.13 · DeepEval',
    ],
  },
  {
    tag: 'solo · evidence · match reports',
    title: 'Resume Crew — Deterministic + LLM Match Reports',
    icon: mark('resume-crew'),
    href: 'https://github.com/MaithreshVaddi-27/Resume_Crew',
    desc: (
      <>
        Compares a resume against a job description to produce an evidence-focused match report with zero invented skills. Each run exports nine artifacts (Markdown, PDF, DOCX match reports, candidate/JD profiles, skills gap, tailored bullets, interview prep, and <code>run_meta.json</code>) across PDF, DOCX, TXT, and Markdown inputs.
      </>
    ),
    highlight: (
      <>
        Runs locally with MLX-LM (Apple Silicon) or Ollama, plus optional Gemini fallback; CrewAI tracing ships disabled by default for PII privacy. Hardware diagnostics (<code>--check-hardware</code>) run without an LLM, and the README explicitly notes the deterministic keyword score is a whole-term overlap signal, <b>not an ATS simulation</b>.
      </>
    ),
    metrics: [
      ['9 files', 'per analysis run'],
      ['0–100 rank', 'CLI + Gradio web UI'],
      ['evidence-only', 'tracing disabled by default'],
    ],
    stack: [
      'CrewAI · Python 3.12+',
      'MLX-LM · Ollama · Gemini fallback',
      'Gradio',
      'pypdf · python-docx',
      'pytest + coverage · GitHub Actions',
    ],
  },
  {
    tag: 'solo · MCP · CLI agents',
    title: 'MCP Agents Suite — SkillMap & SalaryInsights',
    icon: mark('mcp-suite'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_SkillMap_Agent',
    desc: (
      <>
        Four multi-turn Python CLI agents built on LangChain, LangGraph in-memory checkpointing, and Composio MCP: SkillMap pairs Tavily skill demand with RapidAPI JSearch listings; SalaryInsights scrapes Glassdoor, AmbitionBox, PayScale, and Levels.fyi via Firecrawl; CourseFinder pairs Tavily + YouTube; and Email Inbox Summarizer classifies Gmail and drafts replies without sending.
      </>
    ),
    highlight: (
      <>
        Known limits are documented directly in each repository: salary queries can fall back to general knowledge if tools are skipped, memory is in-process per thread, and <code>mcp==1.29.0</code> is pinned against a breaking <code>langchain-mcp-adapters==0.3.1</code> incompatibility.
      </>
    ),
    metrics: [
      ['4 CLI agents', 'skills · salary · courses · mail'],
      ['drafts only', '5 Gmail tools, never sends'],
      ['mcp 1.29.0', 'pinned against adapter break'],
    ],
    stack: [
      'LangChain · LangGraph',
      'Composio MCP',
      'Gemini',
      'Tavily · RapidAPI JSearch · Firecrawl',
      'Python 3.11+',
    ],
  },
]
