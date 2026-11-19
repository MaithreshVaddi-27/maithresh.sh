// Project marks are imported so Vite rebases them for both / and /maithresh.sh/.
const projectIcons = import.meta.glob('../../assets/project-icons/*.svg', {
  eager: true, query: '?url', import: 'default',
})
const mark = (name) => projectIcons[`../../assets/project-icons/${name}.svg`]

export const MORE_PROJECTS = [
  {
    tag: 'solo · CrewAI · content',
    title: 'AI Blog Writing Crew',
    icon: mark('ai-blog-writing-crew'),
    href: 'https://github.com/MaithreshVaddi-27/Ai-Blog-Writer-Crew',
    body: 'Three agents — Strategist → Writer → Editor — turn one topic into a finished, edited post. Every run writes to a timestamped file so past drafts are never overwritten; topic, output path and model are CLI flags.',
    stack: ['CrewAI', 'Gemini'],
  },
  {
    tag: 'solo · CrewAI · Pygame WASM',
    title: 'AI Game Development Crew',
    icon: mark('ai-game-dev-crew'),
    href: 'https://github.com/MaithreshVaddi-27/AI-Game-Dev-Crew',
    body: 'Designer → Developer → QA turns a one-line idea into a playable 2D Pygame game, built to WebAssembly with pygbag and served over ngrok. No retry loop — it fails loudly when the generated code is missing `import pygame`.',
    stack: ['CrewAI', 'Gemini', 'Pygame', 'pygbag', 'Serper'],
  },
  {
    tag: 'solo · LangChain · Composio MCP',
    title: 'Email Inbox Summarizer',
    icon: mark('email-inbox-summarizer'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_Email_Inbox_Summarizer',
    body: 'Reads unread Gmail, summarizes in a line or two, sorts into URGENT / NEEDS REPLY / FYI and drafts replies through five Gmail tools. Drafts only — it never sends, and its LangGraph memory resets on restart.',
    stack: ['LangChain', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · LangChain · Composio MCP',
    title: 'CourseFinder Agent',
    icon: mark('coursefinder-agent'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_CourseFinder_Agent',
    body: 'Tavily and YouTube tools behind Composio turn a topic into a structured learning path. Started as a Colab prototype, now a terminal chat loop that keeps one checkpointer thread until you type exit.',
    stack: ['LangChain', 'LangGraph', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · Kaggle GPU · speech',
    title: 'F5-TTS Podcast Generator',
    icon: mark('f5-tts-podcast-generator'),
    href: 'https://github.com/MaithreshVaddi-27/F5-tts-podcast-generator',
    body: 'A six-step Kaggle notebook for F5-TTS voice cloning on a T4 — four reference samples (normal, sad, anger, surprise), 3–10 seconds of reference audio, and a Gradio share link for listening back.',
    stack: ['F5-TTS', 'Kaggle', 'PyTorch', 'Gradio'],
  },
  {
    tag: 'solo · open source · multi-runtime',
    title: 'ApplyOS — AI Job Application Framework',
    icon: mark('applyos'),
    href: 'https://github.com/MaithreshVaddi-27/ApplyOS',
    body: 'A runtime-agnostic job-search OS: 12 portal skills, a Bun monorepo with `scrape` / `rank` / `apply`, and a 7-gate ranked shortlist across 12+ Indian portals and global remote boards. Includes the first live-verified Workday tenant (JioStar, 226 postings) and CI on three operating systems.',
    stack: ['Bun', 'Python', 'LaTeX', 'OpenCode', 'GitHub Actions'],
  },
  {
    tag: 'solo · Retell AI · voice agent',
    title: 'Home Credit LAP Voice Agent',
    icon: mark('home-credit-lap-voice-agent'),
    href: 'https://github.com/MaithreshVaddi-27/home-credit-lap-voice-agent',
    body: 'A bilingual phone agent that qualifies a pre-approved loan offer of up to ₹75 lakh: a seven-item eligibility checklist, four hard stops, clean handoff or a polite exit. Seven test scenarios with transcripts; final credit decisions stay with humans.',
    stack: ['Retell AI', 'Prompt engineering', 'RAG context'],
  },
  {
    tag: 'solo · early work',
    title: 'FoodMunch — Restaurant Landing Page',
    icon: mark('foodmunch'),
    href: 'https://github.com/MaithreshVaddi-27/FoodMunch',
    body: 'A responsive restaurant site with hero, menu categories, delivery and payment info, gift redemption and footer — my first structured frontend, built with plain HTML5, CSS3 and Bootstrap 4.5.',
    stack: ['HTML5', 'CSS3', 'Bootstrap 4.5'],
  },
]

// Ordered by engineering weight: the verification platform first, then the
// data platform, then the productised RAG work and its smaller siblings.
export const PROJECTS = [
  {
    tag: 'solo · verification · local-first',
    title: 'TrustRAG — Local-First RAG Reliability Workbench',
    icon: mark('trustrag'),
    href: 'https://github.com/MaithreshVaddi-27/TrustRAG',
    desc: <>An eight-stage answer pipeline that refuses to fail silently: deterministic route → hybrid retrieval (<code>BGE-small</code> on ONNX Runtime + BM25 with RRF) → grounded generation with inline <code>[Segment N]</code> citations → atomic claim decomposition → NLI verdicts → SHA-256 and temporal-validity audit → budget-aware LangGraph recovery → answer or explicit ABSTAIN. Ingests PDF, DOCX, CSV, JSON, HTML, TXT and MD, with RapidOCR fallback for scans. Inference runs on Ollama, llama.cpp or MLX; <code>models.yaml</code> v1.21 controls KV-cache quantisation, flash attention, speculative decoding and context compression.</>,
    highlight: <>The hardening is the point: JWT HS256 with <code>iss/aud</code> and a JTI denylist, bcrypt, TTL login lockout, SlowAPI limits, an SSRF guard (DNS allowlist plus IP pinning), a JSON-RPC 2.0 MCP server, SSE progress and Prometheus <code>/metrics</code>. Recovery <b>diagnoses why</b> verification failed before choosing rewrite, wider retrieval or regeneration. A fused NLI call cut verify latency by <b>62%</b>, and three RAM tiers (Lean ≤8 GB, Balanced ≤16 GB, Cloud) keep the same pipeline runnable on a laptop.</>,
    metrics: [['8 stages', 'route → answer or abstain'], ['≤2 attempts', 'bounded recovery loop'], ['−62% latency', 'one fused NLI call']],
    stack: ['FastAPI 0.115 · Python 3.11+ · Pydantic v2', 'LangGraph · LangChain', 'React 18 · Vite 6 · Tailwind · TanStack Query', 'Qdrant · MongoDB 7', 'ONNX Runtime · BGE-small · int8 reranker', 'MCP JSON-RPC 2.0', 'Docker Compose · pytest · Vitest · Playwright · k6'],
  },
  {
    tag: 'solo · job intelligence · deterministic',
    title: 'CareerOS-Pro — Deterministic Normalize, LLM Only for Explain',
    icon: mark('careeros-pro'),
    href: 'https://github.com/MaithreshVaddi-27/CareerOS-Pro',
    desc: <>A self-hosted job-intelligence platform. Six sources — JSearch, Adzuna, Remotive, RemoteOK, Arbeitnow and an async company scraper — feed parsing that stays deterministic: location, remote status, employment type, experience and salary plus FX are pure logic, and the LLM never overrides a hard eligibility filter. Two-stage dedup (<code>url_hash</code>, then <code>content_hash</code>) and two-stage verification (HTTP HEAD → Firecrawl) run before a LangGraph linear state machine with a human-review interrupt hands match and explain to Gemini. Embedded Qdrant stores the semantic vectors.</>,
    highlight: <>Operability is the feature: every provider and source adapter is an independently failing agent behind <code>/agents/health</code> with calls, failure rate and latency. Two-stage dedup removed <b>74%</b> of redundant posts; 53 tests run on <code>respx</code> mocks with zero live network in CI. Honest caveat — health and rate limiting are per-process in memory today; Redis-backed multi-worker is the documented next step, not a shipped feature.</>,
    metrics: [['6 sources', '5 APIs + scraper'], ['−74% redundant', 'two-stage dedup'], ['53 tests', 'mocked, zero live network']],
    stack: ['FastAPI 0.115 · Granian', 'React 19 · Vite · Framer Motion', 'MySQL 8 · Qdrant', 'LangGraph · Gemini', 'Docker Compose', 'pytest + respx · ruff · oxlint'],
  },
  {
    tag: 'solo · grounding · local inference',
    title: 'Agentic DocuChat — Local LLM RAG + MCP Tools',
    icon: mark('docuchat'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_Agentic_DocuChat',
    desc: <>Upload a PDF, ask a question, get an answer that names the pages it came from. Inference is swappable — Gemini, Ollama (<code>gemma3:4b</code>) or llama.cpp (<code>Qwen3-4B-GGUF:Q4_0</code>) — each with readiness checks. Content-hash Chroma IDs let restarts skip re-embedding. Tool routing follows the provider: Gemini always takes the tool-calling path, while local models use it only when <code>COMPOSIO_TOOLKITS</code> is set. One retrieval pass feeds both the answer and the Sources panel, and an ungrounded answer gets exactly one repair rewrite.</>,
    highlight: <>I cut the earlier <b>multi-agent</b> variant back to a single agent when coordination cost stopped paying — <b>6.8 s → 1.9 s, −68% tokens</b>. 102 tests cover the pipeline; <code>.env.example</code> documents all 43 variables. Chunks are 700/100, retrieval K is 4 with fetch K 12, and the upload cap is 50 MB. The retained CLI keeps LangGraph checkpointing and the <code>retrieve_multi</code> and <code>calculate</code> tools.</>,
    metrics: [['1 retrieval pass', 'answer + sources'], ['−68% tokens', 'one agent, not a swarm'], ['102 tests', '43 documented variables']],
    stack: ['LangChain · LangGraph', 'ChromaDB · SQLite memory', 'Gradio', 'Composio MCP · Tavily', 'Ollama · llama.cpp · MLX · Gemini', 'Python 3.10–3.13 · DeepEval'],
  },
  {
    tag: 'solo · evidence · match reports',
    title: 'Resume Crew — Deterministic + LLM Match Reports',
    icon: mark('resume-crew'),
    href: 'https://github.com/MaithreshVaddi-27/Resume_Crew',
    desc: <>A resume ↔ JD comparison that produces an evidence-focused match report — no invented skills, no guessed experience. Each run writes nine files: match report (Markdown, PDF, DOCX), resume and JD profiles, skills gap, tailored bullets, interview prep and run metadata. Deterministic keyword scoring grounds the LLM analysis, and the Build-Resume workflow drafts strictly from source facts. Parses PDF, DOCX, TXT and Markdown through both a CLI and a Gradio UI with Analyze, Build, Rank, Batch, Compare-JDs and History tabs.</>,
    highlight: <>Local-first with Ollama (CUDA / MPS / CPU auto-detect) and an optional Gemini fallback; CrewAI tracing is <b>disabled by default</b>. Ranking scores each resume 0–100 with one LLM call per file. The honest caveat is in the README too: the deterministic score is a whole-term overlap signal, <b>not an ATS simulation</b>.</>,
    metrics: [['9 files', 'per analysis run'], ['0–100 rank', 'one LLM call per CV'], ['no invented skills', 'evidence-only reports']],
    stack: ['CrewAI · Python 3.12+', 'MLX-LM · Ollama · Gemini fallback', 'Gradio', 'pypdf · python-docx', 'pytest + coverage · GitHub Actions'],
  },
  {
    tag: 'solo · MCP · CLI agents',
    title: 'MCP Agents Suite — SkillMap & SalaryInsights',
    icon: mark('mcp-suite'),
    href: 'https://github.com/MaithreshVaddi-27/MCP_SkillMap_Agent',
    desc: <>Four small multi-turn CLI agents over Composio MCP and LangGraph memory: SkillMap pairs Tavily skill demand with RapidAPI JSearch listings; SalaryInsights scrapes Glassdoor, AmbitionBox, PayScale and Levels.fyi through Firecrawl; CourseFinder merges tutorial search; and the Inbox agent drafts Gmail replies without ever sending. Each keeps a checkpointer thread until Ctrl+C.</>,
    highlight: <>The caveats are documented rather than hidden: the salary agent can still answer from general knowledge instead of calling a tool, memory is in-process only, and <code>mcp==1.29.0</code> is pinned because <code>langchain-mcp-adapters==0.3.1</code> breaks on newer releases. Errors print one <code>[ERROR]</code> line and exit cleanly.</>,
    metrics: [['4 CLI agents', 'skills · salary · courses · mail'], ['drafts only', 'inbox agent never sends'], ['mcp 1.29.0', 'pinned against a known break']],
    stack: ['LangChain · LangGraph', 'Composio MCP', 'Gemini', 'Tavily · RapidAPI JSearch · Firecrawl', 'Python 3.11+'],
  },
]
