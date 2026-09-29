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
    note: 'AI-orchestrated engineering: directing OpenCode & Antigravity from self-written specs: architecture owned, implementation delegated deliberately.',
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
    body: 'Single-file 3-agent CrewAI pipeline (Content Strategist → Blog Writer → Editor) turns one topic into a finished, edited blog post saved as markdown.',
    stack: ['CrewAI', 'Gemini'],
  },
  {
    tag: 'solo',
    title: 'AI Game Development Crew',
    body: '3-agent CrewAI pipeline (Designer → Developer → QA) turns a one-line idea into a playable 2D game, packaged to WebAssembly via pygbag and shared through ngrok.',
    stack: ['CrewAI', 'Gemini', 'Pygame', 'pygbag'],
  },
  {
    tag: 'solo',
    title: 'MCP Email Inbox Summarizer',
    body: 'Gmail triage agent — classifies unread mail URGENT / NEEDS REPLY / FYI and drafts replies via Composio MCP. Read/draft only, never auto-sends.',
    stack: ['LangChain', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo',
    title: 'MCP CourseFinder Agent',
    body: 'Merges Tavily + YouTube MCP results into one structured learning path per topic, with a no-hallucination system prompt grounding every recommendation in tool output.',
    stack: ['LangChain', 'Composio MCP', 'Gemini'],
  },
  {
    tag: 'solo · Kaggle GPU',
    title: 'F5-TTS Podcast Generator',
    body: 'Reproducible Kaggle notebook running F5-TTS voice-cloning inference behind a Gradio UI.',
    stack: ['F5-TTS', 'Kaggle', 'Gradio'],
  },
]

export const AUTOMATIONS = [
  {
    status: '● live ↗',
    live: true,
    title: 'AI Podcast Generator — PodEase Pro',
    href: 'https://podease-pro.lovable.app',
    body: 'Idea-to-published-audio pipeline. A Lovable frontend triggers a webhook into n8n, which routes the topic through Gemini for script generation, then Murf AI for text-to-speech, returning the finished file via webhook response.',
    stack: ['n8n', 'Gemini API', 'Murf AI', 'Webhooks'],
    icon: 'mic',
  },
  {
    status: '10 workflows',
    title: 'n8n Workflow Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'Internship Applier, LinkedIn Job Tracker, News Summarizer, a Telegram Shopping Assistant (Groq Whisper voice input + Redis memory), Weather Daily Planner, Learning Path Generator Agent, and more — built and debugged solo.',
    stack: ['n8n', 'Gemini', 'Groq', 'Redis', 'Webhooks'],
    icon: 'flow',
  },
  {
    status: '2 scenarios',
    title: 'Make.com Automation Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'A Google Sheets → Gemini content-generation pipeline, and a Telegram-triggered AI resume evaluator that parses a Google Doc, scores it via an AI Agent module, and returns results by Telegram/Email.',
    stack: ['Make.com', 'Gemini', 'Sheets', 'Telegram'],
    icon: 'share',
  },
  {
    status: 'RPA',
    title: 'Automated Email Reminder Bot',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: "Loops through Sheets records, runs date-diff conditional logic to flag overdue items, sends reminder emails, and writes status back — wrapped in Try-Catch so one bad row doesn't kill the run.",
    stack: ['Automation Anywhere', 'Google Sheets'],
    icon: 'mail',
  },
]

export const GROUP_PROJECTS = [
  {
    file: 'crimesleuth.sh',
    title: 'CrimeSleuth',
    href: 'https://github.com/MaithreshVaddi-27/CrimeSleuth',
    tag: 'team of 4 · forensic case management',
    body: 'Investigators create cases, upload evidence, and get computer-vision + multimodal AI analysis with an LLM chat interface over case data.',
    scope: <><b>My scope:</b> trained the 14-class crime-scene classifier myself on Colab, exported as <code>.pth</code>, loaded locally for PyTorch inference in Flask; integrated YOLO detection; outputs feed Gemini to auto-generate reports.</>,
    stack: ['React', 'Flask', 'MongoDB', 'YOLO', 'Gemini API'],
  },
  {
    file: 'signaturesense.sh',
    title: 'SignatureSense',
    href: 'https://github.com/MaithreshVaddi-27/SignatureSense',
    tag: 'team of 4 · signature verification',
    body: 'Full-stack handwritten signature verification via image similarity.',
    scope: <><b>My scope:</b> integrated a pre-trained Keras/TensorFlow model (<code>.h5</code>) for inference, handled image preprocessing and Bootstrap frontend fixes.</>,
    stack: ['MERN', 'Flask', 'TensorFlow/Keras'],
  },
]

export const CERTS = [
  {
    file: 'studycomrade.sh',
    title: 'StudyComrade Workshop — Data Analytics',
    body: 'EDA and visualization on an Amazon e-commerce dataset.',
    stack: ['Python', 'Pandas', 'Matplotlib'],
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
  { target: 'workbench', glyph: '»', title: 'Multi-System Architecture Workbench', sub: 'Interactive pipeline visualizers across all 4 agent systems', tag: '#workbench', tagTone: 'cyan', keywords: 'trustrag docuchat resumecrew careeros careeros resume crew sim' },
  { target: 'projects', glyph: '#', title: 'Featured Systems & Runtimes', sub: 'Inspect all 11 solo-built agent repositories', tag: '#projects', tagTone: 'amber', glyphTone: 'amber', keywords: 'repos github trust rag mcp agents' },
  { target: 'automation', glyph: '*', title: 'Automation & Workflow Suites', sub: '13 production workflows across n8n, Make.com, RPA', tag: '#automation' },
  { target: 'stack', glyph: '≡', title: 'Technical stack', sub: 'LLM, automation, backend and cloud tooling', tag: '#stack', keywords: 'tools langchain langgraph ollama' },
  { target: 'about', glyph: '=', title: 'cat about.md', sub: 'Background, engineering ethos & defense pledge', tag: '#about', glyphTone: 'dim' },
  { target: 'contact', glyph: '✉', title: 'Contact', sub: 'Internship inquiries — replies within 48 hours', tag: '#contact', tagTone: 'cyan' },
  { action: 'github', glyph: '@', title: 'GitHub Profile (MaithreshVaddi-27)', sub: 'Inspect source repos and live commit logs', tag: 'EXTERNAL ↗', tagTone: 'ext' },
]

export const SIM_LABELS = {
  'trustrag:valid': 'TrustRAG high-confidence query',
  'trustrag:fail': 'TrustRAG unverified-claim recovery',
  'docuchat:tool': 'DocuChat MCP web dispatch',
  'docuchat:local': 'DocuChat local ChromaDB cache hit',
  'resumecrew:match': 'Resume Crew high-alignment match',
  'resumecrew:gap': 'Resume Crew skill-gap rejection',
  'careeros:dedup': 'CareerOS-Pro two-stage deduplication',
  'careeros:resilient': 'CareerOS-Pro source-failure circuit breaker',
}

export const GITHUB = 'https://github.com/MaithreshVaddi-27'

// Diagrams live with the component that draws them (Projects.jsx); this is the
// copy, the accent, and the row swatch that go with each.
export const PROJECTS = [
  {
    title: 'TrustRAG — AI Reliability Workbench',
    href: 'https://github.com/MaithreshVaddi-27/TrustRAG',
    accent: 'cyan',
    swatch: 'swShield',
    tag: 'solo flagship · local-first · zero API keys · claim-verified answers',
    desc: <>Standard RAG systems fail silently — this doesn't. A local-first reliability loop: hybrid retrieve (dense BGE-small + BM25 + RRF) → grounded generation → claim decomposition fused with NLI verification in one call → SHA-256 + temporal-window evidence audit → reliability scoring against configurable thresholds → if it fails, a budget-aware LangGraph recovery loop (rewrite → re-retrieve → regenerate, capped at 2 attempts) → grounded answer or explicit ABSTAIN. Runs entirely on Ollama/llama.cpp — no API keys required.</>,
    highlight: <>Recovery doesn't just retry blindly — it diagnoses <b>why</b> verification failed and picks the matching fix: query rewrite, wider re-retrieval, or a free regenerate, bounded to one round.</>,
    metrics: [['−62%', 'verification latency'], ['2-attempt', 'recovery cap'], ['ABSTAIN', '-safe, never guessed']],
    stack: ['Python', 'FastAPI', 'React 18', 'LangGraph', 'Qdrant', 'ONNX Runtime', 'MCP (JSON-RPC 2.0)', 'MongoDB', 'Ollama', 'llama.cpp', 'Docker'],
  },
  {
    title: 'Agentic DocuChat — Intelligent PDF Agent',
    href: 'https://github.com/MaithreshVaddi-27/MCP_Agentic_DocuChat',
    accent: 'green',
    swatch: 'swDocChat',
    tag: 'solo · my original agent-architecture project',
    desc: <>Agentic RAG app for chatting with PDFs — now with a full Gradio front end. Per-question choice of provider (llama.cpp local-default, Ollama, or Gemini), persistent SQLite conversation history, a <code>retrieve_multi</code> tool for compound questions, and dynamic routing to live Tavily search via MCP.</>,
    highlight: <>Pulled back from an earlier <b>multi-agent</b> version to a lean single agent once the added complexity stopped earning its keep. Token cost dropped 68% and latency fell from 6.8s to 1.9s.</>,
    metrics: [['6.8s → 1.9s', 'latency'], ['−68%', 'token cost'], ['single-agent', ', zero swarm inflation']],
    stack: ['LangChain', 'LangGraph', 'ChromaDB', 'Gradio', 'Composio MCP', 'Gemini', 'SQLite', 'Ollama', 'llama.cpp'],
  },
  {
    title: 'Resume Crew — Grounded ATS Verification',
    href: 'https://github.com/MaithreshVaddi-27/Resume_Crew',
    accent: 'amber',
    swatch: 'swResume',
    tag: 'solo · CLI + Gradio UI',
    desc: <>Compares a resume against a job description and produces an evidence-focused match report — no invented skills, no guessed experience. Runs locally by default (Ollama) with optional Gemini fallback. Accepts PDF, DOCX, TXT, and Markdown, across both CLI and Gradio UI.</>,
    highlight: <>Hardware auto-detection (Apple Silicon Metal / CUDA), telemetry off by default, runs fully offline via Ollama.</>,
    metrics: [['0', 'hallucinated skills'], ['offline-first', 'via Ollama'], ['CLI + Gradio', 'interfaces']],
    stack: ['CrewAI', 'Ollama', 'Gemini API', 'Gradio', 'pypdf', 'python-docx'],
  },
  {
    title: 'CareerOS-Pro — Resilient Career Engine',
    href: 'https://github.com/MaithreshVaddi-27/CareerOS-Pro',
    accent: 'purple',
    swatch: 'swBrief',
    tag: 'solo · in active production hardening',
    desc: <>Career-intelligence platform aggregating listings from JSearch, Adzuna, Remotive, RemoteOK, Arbeitnow, plus a free company-career-page scraper. Deterministic normalization and two-stage dedup keep the LLM out of the parsing path; a LangGraph state machine routes match-explanation across a multi-provider fallback chain.</>,
    highlight: <>Every LLM provider and job-source adapter runs as a self-contained agent with <b>health monitoring</b> — one failing source can't take the system down. Pruned 74% redundant postings before LLM processing.</>,
    metrics: [['74%', 'duplicates pruned pre-LLM'], ['6-source', 'aggregation'], ['isolated', 'circuit breakers']],
    stack: ['FastAPI', 'LangGraph', 'React 19', 'Redis', 'Qdrant', 'Docker'],
  },
  {
    title: 'MCP Agents Suite — Autonomous Career Mesh',
    href: 'https://github.com/MaithreshVaddi-27/MCP_SkillMap_Agent',
    accent: 'cyan',
    swatch: 'swMesh',
    tag: 'solo · SkillMap + SalaryInsights',
    desc: <>Two agents orchestrating Composio-hosted MCP tools via LangChain: skill-to-career mapping with live India job search (JSearch API), and compensation research scraping Glassdoor, AmbitionBox, and Levels.fyi into salary bands.</>,
    highlight: <>Session state persisted with <b>InMemorySaver</b> so follow-up queries resolve without restating context. Standardized on JSON-RPC 2.0 Model Context Protocol for cross-agent reusability.</>,
    metrics: [['multi-turn', 'session memory'], ['JSON-RPC 2.0', 'MCP standard'], ['live India', 'job + salary data']],
    stack: ['LangChain', 'Composio MCP', 'Tavily', 'Firecrawl', 'JSearch API', 'Gemini API'],
  },
]
