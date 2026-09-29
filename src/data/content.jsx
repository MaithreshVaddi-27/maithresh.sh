// Repeated content, kept as data so React renders it instead of me hand-writing
// the same <span class="chip"> forty times. One-off schematic SVGs stay inline
// in their component — data-ifying a unique 60-line SVG just adds indirection.

export const NAV_LINKS = [
  ['#workbench', 'Workbench'],
  ['#projects', 'Systems'],
  ['#automation', 'Automations'],
  ['#education', 'Academic'],
  ['#certifications', 'Credentials'],
]

export const MARQUEE = [
  'LangChain', 'LangGraph', 'CrewAI', 'MCP', 'RAG', 'Qdrant', 'FastAPI',
  'ChromaDB', 'Ollama', 'llama.cpp', 'n8n', 'Make.com', 'Python', 'httpx',
]

export const STACK = [
  {
    file: 'llm.sh',
    title: 'LLM / Agentic AI',
    icon: 'brain',
    accent: ['LangChain', 'LangGraph', 'CrewAI'],
    chips: [
      'LangChain', 'LangGraph', 'CrewAI',
      'MCP server + client (JSON-RPC 2.0, Composio)', 'RAG', 'Hybrid dense + BM25 (RRF)',
      'Cross-encoder reranking', 'NLI claim verification', 'Qdrant', 'ChromaDB',
      'ONNX Runtime', 'HF Embeddings (bge-small, bge-base, mpnet)', 'Gemini API',
      'NVIDIA NIM', 'Ollama', 'llama.cpp', 'MLX', 'LM Studio', 'Prompt engineering',
      'ReAct / Plan-Execute', 'Conversational memory / checkpointing', 'LoRA / RLHF fundamentals',
    ],
    note: 'Build method: spec-first, AI-assisted — I write the architecture + line-by-line specs, direct implementation via Claude Code / OpenCode / Antigravity, and own every design decision. Happy to walk through specs vs. tool defaults in an interview.',
  },
  {
    file: 'automation.sh',
    title: 'Automation',
    icon: 'bolt',
    chips: [
      'n8n (10 workflows, agentic + voice + Redis memory)', 'Make.com',
      'Automation Anywhere (RPA)', 'Webhooks', 'REST APIs', 'Telegram Bot API',
      'Groq Whisper',
    ],
  },
  {
    file: 'backend.sh',
    title: 'Backend & Data',
    icon: 'db',
    chips: [
      'Python', 'Java (OOP)', 'C++', 'JavaScript (ES6)', 'SQL', 'FastAPI', 'Granian',
      'Flask', 'httpx (async)', 'Pydantic', 'SQLAlchemy', 'Node.js', 'Express.js',
      'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Pandas', 'NumPy', 'Matplotlib',
    ],
    note: '26 LeetCode SQL problems solved — joins, subqueries, aggregations.',
  },
  {
    file: 'cloud.sh',
    title: 'Cloud, ML & Tools',
    icon: 'cloud',
    chips: [
      'Docker + Compose',
      'AWS (EC2, S3, Lambda, SQS/SNS, DynamoDB, IAM, VPC)', 'Render', 'Cloudflare Pages',
      'Kubernetes', 'Jenkins', 'TensorFlow / Keras', 'Scikit-learn', 'YOLO',
      'CNN / RNN / LSTM', 'Git',
    ],
    note: 'AWS / K8s / Jenkins: coursework + hands-on labs, no named production deployment. Frontend: React 19, Framer Motion, Gradio, Bootstrap 4.5 · Design: Figma (UX research, wireframing).',
  },
]

export const MORE_PROJECTS = [
  {
    tag: 'solo',
    title: 'AI Blog Writing Crew',
    body: 'A 3-agent CrewAI pipeline (Strategist → Writer → Editor) that turns one topic into a finished, edited blog post — each run saved with a timestamp so nothing gets overwritten.',
    stack: ['CrewAI', 'Gemini'],
  },
  {
    tag: 'solo',
    title: 'AI Game Development Crew',
    body: 'A 3-agent CrewAI pipeline (Designer → Developer → QA) that turns a one-line idea into a playable 2D Pygame game — shipped to the browser via WebAssembly after fixing two real packaging bugs.',
    stack: ['CrewAI', 'Gemini', 'Pygame', 'pygbag'],
  },
  {
    tag: 'solo',
    title: 'Email Inbox Summarizer',
    body: 'A Gmail triage agent that summarizes unread mail in a line or two, classifies it URGENT / NEEDS REPLY / FYI, and drafts replies for your review. Read-and-draft only — it never sends on its own.',
    stack: ['LangChain', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo',
    title: 'CourseFinder Agent',
    body: 'Merges roadmap docs and tutorial search into one structured learning path per topic — every recommendation grounded in actual tool output, never hallucinated from memory.',
    stack: ['LangChain', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · Kaggle GPU',
    title: 'F5-TTS Podcast Generator',
    body: 'A reproducible Kaggle notebook running F5-TTS voice-cloning inference behind a simple Gradio UI — my hands-on entry into speech synthesis.',
    stack: ['F5-TTS', 'Kaggle', 'Gradio'],
  },
]

export const AUTOMATIONS = [
  {
    status: '● live ↗',
    live: true,
    title: 'AI Podcast Generator — PodEase Pro',
    href: 'https://podease-pro.lovable.app',
    body: 'Idea → finished audio file. A Lovable frontend hits a webhook into n8n, which routes the topic through Gemini for script generation, then Murf AI for text-to-speech, returning the audio in the webhook response. Live at podease-pro.lovable.app.',
    stack: ['n8n', 'Gemini API', 'Murf AI', 'Webhooks'],
    icon: 'mic',
  },
  {
    status: '10 workflows',
    title: 'n8n Workflow Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'Ten workflows: Internship Applier, LinkedIn Job Tracker, News Summarizer, a Telegram Shopping Assistant (Groq Whisper voice input + Redis per-chat memory), Weather Planner, a Learning Path agent that writes study blocks to Google Calendar, Historical Content Publisher, and more. Chosen over Make.com here deliberately — n8n gives full control over branching, code nodes, and LLM agents.',
    stack: ['n8n', 'Gemini', 'Groq', 'Redis', 'Webhooks'],
    icon: 'flow',
  },
  {
    status: '2 scenarios',
    title: 'Make.com Automation Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'Two scenarios. A Google Sheets → Gemini pipeline that fans one article out to LinkedIn, Facebook, and Telegram via a Router module on a 15-minute schedule — deliberately the n8n counterpart of the same workflow, so I could compare both platforms. Plus a Telegram-triggered AI resume evaluator that returns results over Telegram and Email.',
    stack: ['Make.com', 'Gemini', 'Sheets', 'Telegram'],
    icon: 'share',
  },
  {
    status: 'RPA',
    title: 'Automated Email Reminder Bot',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: "Reads row-by-row from an Excel source, applies date-diff business logic to decide who is due a reminder, sends the emails, and writes status back — wrapped in Try-Catch so one malformed row can't kill the run. Picked for deterministic, rule-based work with no judgment call. Documented with a PDF writeup and a screen recording.",
    stack: ['Automation Anywhere', 'Excel', 'Email'],
    icon: 'mail',
  },
]

export const GROUP_PROJECTS = [
  {
    file: 'crimesleuth.sh',
    title: 'CrimeSleuth',
    href: 'https://github.com/MaithreshVaddi-27/CrimeSleuth',
    tag: 'team of 4 · forensic case management',
    body: 'Investigators open a case, upload evidence, and get computer-vision analysis plus an LLM chat surface over the case record. The interesting engineering is the ML layer.',
    scope: <><b>My scope:</b> trained the model, not just wired it — a 14-class crime-scene classifier trained on Google Colab, exported as <code>.pth</code> and loaded locally via PyTorch for inference in Flask. Also integrated YOLO detection on evidence images and fused classification + detection output into Gemini prompts to auto-generate investigation reports.</>,
    stack: ['React', 'Flask', 'MongoDB', 'YOLO', 'Gemini API'],
  },
  {
    file: 'signaturesense.sh',
    title: 'SignatureSense',
    href: 'https://github.com/MaithreshVaddi-27/SignatureSense',
    tag: 'team of 4 · signature verification',
    body: 'MERN + Flask signature verification: upload a sample, get a verification verdict backed by a TensorFlow model.',
    scope: <><b>My scope:</b> inference integration, not training — loaded a <b>pre-trained</b> Keras/TensorFlow model (<code>.h5</code>) via <code>load_model()</code> and owned image preprocessing, integration tests, and the Bootstrap frontend fixes. (Deliberately distinct from CrimeSleuth, where I trained the model myself.)</>,
    stack: ['MERN', 'Flask', 'TensorFlow/Keras'],
  },
]

export const CERTS = [
  {
    file: 'nxtwave.sh',
    title: 'NxtWave — GenAI / LLM Applications + MCP',
    body: 'RAG, LangChain agents, Model Context Protocol (Cursor IDE workshop: Gmail, LinkedIn, YouTube / Drive / Notion servers), prompt engineering, AI agents, SQLite schema design, joins, normalization to BCNF.',
    stack: ['LangChain', 'MCP', 'RAG', 'SQLite', 'Prompt engineering'],
  },
  {
    file: 'studycomrade.sh',
    title: 'StudyComrade Workshop — Data Analytics',
    body: 'EDA and visualization on an Amazon e-commerce dataset. LeetCode: 26 SQL problems (joins, subqueries, aggregations).',
    stack: ['Python', 'Pandas', 'Matplotlib', 'SQL'],
  },
  {
    file: 'outskill.sh',
    title: 'Outskill AI Mastermind — Applied AI Builds',
    body: 'Custom GPTs and assistants, vibe-coded builds, Claude Artifacts, AI image/video generation, AI-built sites — rapid prototyping reps behind the shipped systems above.',
    stack: ['Custom GPTs', 'Claude Artifacts', 'Rapid prototyping'],
  },
  {
    file: 'labs.sh',
    title: 'AWS · Kubernetes · Jenkins — Hands-on Labs',
    body: 'Coursework labs across EC2, S3, Lambda, container orchestration, and CI pipelines — the deployment footing behind the Docker-based hardening noted above.',
    stack: ['AWS', 'Kubernetes', 'Jenkins', 'Docker'],
  },
]

export const CONTACT_LINKS = [
  ['mailto:maithreshvaddi16@gmail.com?subject=Internship%20opportunity%20—%20via%20maithresh.sh', 'mail', 'maithreshvaddi16@gmail.com'],
  ['https://www.linkedin.com/in/maithreshvaddi/', 'linkedin', 'LinkedIn ↗'],
  ['https://github.com/MaithreshVaddi-27', 'github', 'GitHub ↗'],
  ['https://leetcode.com/u/MaithreshV/', 'code', 'LeetCode ↗'],
  ['https://www.hackerrank.com/profile/maithreshvaddi16', 'shield', 'HackerRank ↗'],
]

export const CONSOLE_ITEMS = [
  { target: 'workbench', glyph: '»', title: 'Architecture Workbench', sub: 'Run the pipeline for each system, then read the design trade-off I can defend', tag: '#workbench', tagTone: 'cyan', keywords: 'trustrag docuchat resumecrew careeros resume crew sim architecture' },
  { target: 'projects', glyph: '#', title: 'Featured systems', sub: 'Five highlights from 11+ solo-built agent repositories — problem, constraint, and what I haven’t solved yet', tag: '#projects', tagTone: 'amber', glyphTone: 'amber', keywords: 'repos github trust rag mcp agents projects' },
  { target: 'automation', glyph: '*', title: 'Automation & workflow suites', sub: '13+ live workflows across n8n, Make.com, and RPA', tag: '#automation' },
  { target: 'stack', glyph: '≡', title: 'Technical stack', sub: 'LLM, automation, backend and cloud tooling', tag: '#stack', keywords: 'tools langchain langgraph ollama' },
  { target: 'about', glyph: '=', title: 'cat about.md', sub: 'Background, how I work, and what I can defend', tag: '#about', glyphTone: 'dim' },
  { target: 'contact', glyph: '✉', title: 'Contact', sub: 'Internship inquiries — replies within 48 hours', tag: '#contact', tagTone: 'cyan' },
  { action: 'github', glyph: '@', title: 'GitHub Profile (MaithreshVaddi-27)', sub: 'Inspect source repos and live commit logs', tag: 'EXTERNAL ↗', tagTone: 'ext' },
]

export const SIM_LABELS = {
  'trustrag:valid': 'TrustRAG — all claims verified, grounded answer returned',
  'trustrag:fail': 'TrustRAG — unverified claim triggers bounded recovery',
  'docuchat:tool': 'DocuChat — live web grounding via MCP tool dispatch',
  'docuchat:local': 'DocuChat — local ChromaDB content-hash cache hit',
  'resumecrew:match': 'Resume Crew — evidence-backed match report generated',
  'resumecrew:gap': 'Resume Crew — missing requirements flagged, not invented',
  'careeros:dedup': 'CareerOS-Pro — two-stage deduplication, no LLM in parse',
  'careeros:resilient': 'CareerOS-Pro — one source degrades, the rest keep serving',
}

export const GITHUB = 'https://github.com/MaithreshVaddi-27'

// Diagrams live with the component that draws them (Projects.jsx); this is the
// copy, the accent, and the row swatch that go with each.
export const PROJECTS = [
  {
    title: 'TrustRAG — Local-First RAG Reliability Workbench',
    href: 'https://github.com/MaithreshVaddi-27/TrustRAG',
    accent: 'cyan',
    swatch: 'swShield',
    tag: 'solo flagship · v0.1.0 MIT · verify-then-answer',
    desc: <>RAG that refuses to fail silently. Deterministic router (no LLM call) → hybrid retrieval — dense <code>BGE-small</code> via ONNX Runtime + BM25 with RRF fusion, optional <code>ms-marco-MiniLM-L-6-v2</code> int8 cross-encoder rerank → grounded generation with inline <code>[Segment N]</code> citations → atomic claim decomposition → NLI verdicts (SUPPORTED / CONTRADICTED / NEUTRAL) → SHA-256 + temporal-validity audit → budget-aware LangGraph recovery loop (rewrite → re-retrieve → regenerate, ≤2 attempts) → answer or explicit ABSTAIN. Inference on Ollama / llama.cpp / MLX, embedded Qdrant + local MongoDB, <code>models.yaml</code> v1.20 controls KV-cache quant, flash-attention, speculative decoding, and eviction tiers.</>,
    highlight: <>Hardened paths engineers care about: JWT HS256 with <code>iss/aud</code> + JTI denylist, bcrypt-12, MongoDB-TTL login lockout, SlowAPI limits, SSRF guard (DNS allowlist + IP pinning), JSON-RPC 2.0 MCP server, Prometheus <code>/metrics</code>, snapshot / rollback, A/B flags. Recovery <b>diagnoses why</b> verification failed before picking rewrite vs. wider retrieval vs. regenerate.</>,
    metrics: [['offline default', 'zero API keys required'], ['≤2 attempts', 'bounded recovery loop'], ['ABSTAIN-safe', 'grounded or nothing']],
    stack: ['FastAPI 0.115', 'Python 3.11+ · Pydantic v2', 'LangGraph · LangChain', 'React 18 · Vite 6 · TanStack Query 5', 'Qdrant · MongoDB 7', 'ONNX Runtime', 'MCP JSON-RPC 2.0'],
  },
  {
    title: 'Agentic DocuChat — Local LLM RAG + MCP Tools',
    href: 'https://github.com/MaithreshVaddi-27/MCP_Agentic_DocuChat',
    accent: 'green',
    swatch: 'swDocChat',
    tag: 'solo · CLI + Gradio · local-first RAG',
    desc: <>Document QA with swappable inference: Gemini, Ollama (<code>gemma3:4b</code> default), llama.cpp (<code>Qwen3-4B-GGUF:Q4_0</code>) — each with readiness checks. Ingestion uses content-hash ChromaDB IDs so restarts skip re-embedding. Provider-agnostic tool routing: Gemini always takes the tool-calling agent path; local models use it only when <code>COMPOSIO_TOOLKITS</code> is configured, else a faster direct-grounded streaming path. Preserved CLI keeps LangGraph checkpointing plus <code>retrieve_multi</code> and <code>calculate</code> tools.</>,
    highlight: <>Reliability over novelty: single retrieval pass feeds both generation and the sources panel, embedding/chat/agent objects build once per config, same labelled context package (task / memory / conversation / docs) per provider, grounding check triggers a repair pass, response cache is size/age-bounded (7-day TTL, 2000 cap). I cut the earlier <b>multi-agent</b> variant back to one agent when the coordination cost stopped paying.</>,
    metrics: [['content-hash IDs', 'no re-embed on restart'], ['repair pass', 'ungrounded answers retried'], ['SQLite memory', 'history + personal facts']],
    stack: ['LangChain · LangGraph', 'ChromaDB', 'Gradio', 'Composio MCP', 'SQLite', 'Ollama · llama.cpp · Gemini'],
  },
  {
    title: 'Resume Crew — Deterministic + LLM Match Reports',
    href: 'https://github.com/MaithreshVaddi-27/Resume_Crew',
    accent: 'amber',
    swatch: 'swResume',
    tag: 'solo · CrewAI · deterministic + LLM',
    desc: <>Resume ↔ JD matching as a CrewAI pipeline (parse → score → gap-analysis → tailored bullets → interview prep) emitting match score, resume profile, JD profile, skills gap, tailored bullets, and interview prep — exported as Markdown / PDF / Word. Deterministic keyword scoring grounds the LLM analysis; the Build-Resume workflow drafts strictly from source facts. Parses PDF, DOCX, TXT, Markdown across CLI + Gradio (Analyze, Build, Rank, Batch, Compare-JDs, History with score-trend chart, Hardware diagnostics).</>,
    highlight: <>Local-first via Ollama (CUDA / MPS / CPU auto-detect) with optional Gemini fallback, CrewAI tracing/telemetry <b>disabled by default</b>, ngrok sharing behind optional password. Pytest covers scoring, doc validation, report structure, and edge cases (CRLF, single-char tokens, timestamps).</>,
    metrics: [['6-part', 'evidence-based report'], ['deterministic + LLM', 'scoring, not vibes'], ['PDF/DOCX/TXT/MD', 'CLI + Gradio']],
    stack: ['CrewAI', 'Ollama · Gemini fallback', 'Gradio', 'pypdf · python-docx', 'pytest'],
  },
  {
    title: 'CareerOS-Pro — Deterministic Normalize, LLM Only for Explain',
    href: 'https://github.com/MaithreshVaddi-27/CareerOS-Pro',
    accent: 'purple',
    swatch: 'swBrief',
    tag: 'solo · 5 APIs + scraper · no LLM in parse',
    desc: <>Aggregation from JSearch, Adzuna, Remotive, RemoteOK, Arbeitnow + BeautifulSoup4 async career-page scraper (per-domain semaphores, backoff+jitter, in-memory HTML cache). Parsing is pure deterministic logic — location/remote, employment-type, experience-level, salary + FX — the LLM never overrides hard eligibility filters. Two-stage dedup (<code>url_hash</code> exact, then <code>content_hash</code> fallback), two-stage verification (HTTP HEAD → Firecrawl scrape). LangGraph match/explain with fallback order LlamaCpp → NVIDIA NIM → OpenRouter → Gemini.</>,
    highlight: <>Operability is the feature: every provider and source adapter is an independently-failing agent behind <code>GET /agents/health</code> (calls, failure rate, latency, healthy / degraded / down). Honest caveat — health + rate limiter are <b>per-process in-memory today</b>; Redis-backed multi-worker is the documented next step, not yet built. Tests use <code>respx</code> mocks, zero live network in CI.</>,
    metrics: [['no LLM in parse', 'deterministic normalize'], ['HEAD → Firecrawl', 'verify before surfacing'], ['per-agent health', '/agents/health endpoint']],
    stack: ['FastAPI · Granian', 'LangGraph', 'React 19 · Vite · Framer Motion', 'MySQL · Qdrant', 'Docker Compose', 'pytest + respx'],
  },
  {
    title: 'MCP Agents Suite — SkillMap & SalaryInsights',
    href: 'https://github.com/MaithreshVaddi-27/MCP_SkillMap_Agent',
    accent: 'cyan',
    swatch: 'swMesh',
    tag: 'solo · Composio MCP · multi-turn',
    desc: <>SkillMap: Gemini reasoning over Tavily search via Composio MCP + custom <code>search_jobs</code> tool (RapidAPI JSearch), clean CLI errors, graceful Ctrl+C. SalaryInsights: Firecrawl scrape tools over Glassdoor / AmbitionBox / PayScale / Levels.fyi. Both use LangGraph checkpointing (<code>thread_id</code>) for multi-turn follow-ups. Reproducibility fix shipped: pinned <code>mcp==1.29.0</code> — <code>langchain-mcp-adapters==0.3.1</code> needs <code>mcp&gt;=1.24.0</code> unbounded, but <code>mcp&gt;=2.0.0</code> renamed <code>RequestContext → BaseContext</code> and broke imports.</>,
    highlight: <>Disclosed limitation, not hidden: the system prompt orders scrape-before-answer, but Gemini isn't <b>forced</b> to call tools — it can fall back to general knowledge. Memory is <code>InMemorySaver</code> (resets on restart). Next step is forced tool-call grounding.</>,
    metrics: [['thread_id', 'multi-turn checkpointing'], ['mcp==1.29.0', 'pinned transitive fix'], ['no raw tracebacks', 'CLI-grade error UX']],
    stack: ['LangChain', 'Composio MCP', 'Tavily · Firecrawl', 'JSearch API', 'Gemini API'],
  },
]
