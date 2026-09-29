# Project & Certification Portfolio (Detailed)

Companion reference to the master CV/resume. Full technical detail per project — use this to pull specifics into interview prep or a tailored resume; the CV/resume stay summarized.

---

## Certifications & Training

**NxtWave** — GenAI/LLM applications, RAG, LangChain Agents, Model Context Protocol (including a Cursor IDE workshop covering Gmail, LinkedIn, YouTube/Drive/Notion server integrations), prompt engineering, AI agents, SQLite (schema design, joins, normalization to BCNF).

**StudyComrade Workshop — Data Analytics.** EDA and visualization on an Amazon e-commerce dataset using Python, Pandas, and Matplotlib.

**Outskill AI Mastermind Workshop.** Foundations of AI, building custom AI assistants and GPTs, vibe coding, Claude Artifacts, AI image and video generation, AI-built websites.

**LeetCode.** 26 SQL problems solved (joins, subqueries, aggregations).

---

## Flagship Projects

### TrustRAG — Local-First RAG Reliability Workbench
*Solo · v0.1.0, MIT license*

- **What it is:** an 8-stage pipeline — Route (deterministic, no LLM call) → Retrieve (hybrid dense + BM25 + RRF fusion, optional cross-encoder rerank) → Generate (grounded, inline `[Segment N]` citations) → Decompose (atomic claims) → Verify (NLI: SUPPORTED / CONTRADICTED / NEUTRAL) → Audit (SHA-256 + temporal validity) → Recover (budget-aware LangGraph loop, rewrite → re-retrieve → regenerate, ≤2 attempts) → Answer or safely abstain.
- **Local-first architecture:** runs entirely offline by default — Ollama, llama.cpp, or MLX for inference; ONNX Runtime (torch-free) for embeddings (BAAI/bge-small-en-v1.5, ~500–1000 MB RAM saved) and int8 cross-encoder reranking (ms-marco-MiniLM-L-6-v2); embedded Qdrant; local MongoDB. No API keys required for the default path. Gemini and NVIDIA NIM are optional cloud fallbacks (NVIDIA NIM verified live 2026-09-21).
- **Inference acceleration / memory optimization (config-driven, `models.yaml` v1.20, env-var overridable):** KV-cache quantization (q4_0/q8_0/fp16), flash attention, prompt caching, speculative decoding (min-p/top-k + early EOS exit), dynamic context sizing, aggressive model eviction by RAM tier, adaptive top-k retrieval, hierarchical context compression, reranker result caching, cache TTL + VACUUM.
- **MCP integration:** JSON-RPC 2.0 server for Claude Desktop, Cursor, and Windsurf; service-token auth with prompt/model caps.
- **Auth & security:** JWT (HS256, `iss`/`aud` validation, JTI revocation denylist), bcrypt cost 12, login lockout via MongoDB TTL collection, SlowAPI rate limiting (Redis in prod, in-memory in dev), SSRF protection (DNS allowlist, IP pinning, host-header guard).
- **Ops tooling:** knowledge-base snapshots + rollback, Prometheus `/metrics`, A/B experiments with feature flags.
- **Ingestion:** PDF, DOCX, CSV, JSON, HTML, TXT, MD, with RapidOCR fallback for scanned pages.
- **Engineering rigor:** pytest (backend, mocked, no live services), Vitest (frontend), Playwright E2E, k6 load test; Ruff/ESLint lint gates. Prior verified figures: 111 backend pytest tests, 15 Vitest tests, 2 Playwright E2E tests, k6 held <1% failure with p95 latency <300ms — these predate the local-first/optimization-suite additions above and haven't been re-confirmed against the current version; don't quote them as current without re-checking.
- **Stack:** FastAPI 0.115 (Python 3.11+, Pydantic v2, LangGraph, LangChain), React 18 + Vite 6 + Tailwind CSS 3 + TanStack Query 5 + React Router 7, MongoDB 7 (local or Atlas — not exclusively Atlas), Qdrant.
- **Deployment:** documented targets include Cloud Run, Render, Railway, Fly.io (API) and Cloudflare Pages or Vercel (frontend); actual live deploy previously confirmed on Render (API) + Cloudflare Pages (frontend).
- **Build process — stated as a skill, not a caveat:** specified the complete system end-to-end (architecture, all 8 pipeline stages, data models, security requirements) personally, then directed implementation via detailed line-by-line specs across Claude Code, OpenCode, and Antigravity — frontend primarily via Claude Code, backend from the original design. This is framed as demonstrated AI-orchestrated engineering fluency. **Be ready to back this up in an interview**: walk through the actual specs written, explain design decisions made differently than the AI tools' defaults, describe concretely what "directing" meant. If a recruiter reads this as equivalent to traditional hand-coding experience and it can't be defended under questioning, the framing backfires — know the distinction cold before leaning on it.
- **Open question:** a tool called "omniroute" was mentioned alongside Claude Code/OpenCode/Antigravity in the build process — not yet confirmed what it is or does. Don't describe its function anywhere until clarified.

### DocuChat — Agentic RAG Assistant with Local LLMs, MCP & Persistent Memory
*Solo*

- **Original form:** CLI-only. PyPDFLoader ingestion → RecursiveCharacterTextSplitter chunking → BAAI/bge-base-en-v1.5 embeddings → ChromaDB retrieval (stable content-hash IDs, no re-embedding on restart).
- **Evolved into a Gradio web app** (`rag_backend.py` + `gradio_app.py`) with three swappable providers: Gemini, Ollama (gemma3:4b default), llama.cpp (Qwen3-4B-GGUF:Q4_0) — each with automatic readiness checks. The original CLI is preserved as a separate entry point (LangGraph checkpointing, `retrieve_multi`, `calculate` tools).
- **MCP tool routing (provider-agnostic):** Gemini always uses a tool-calling agent; local providers use the same agent only when Composio toolkits are configured, otherwise a faster direct-grounded streaming path. `COMPOSIO_TOOLKITS` is comma-separated and extensible with no code change (web search by default; calendar/email/docs addable).
- **Memory & performance:** persistent SQLite conversation history; automatic capture of stated personal facts as long-term memory; size/age-bounded response cache (7-day TTL, 2000-entry cap); per-user rate limiting; exponential-backoff retries on local-model hiccups; single retrieval pass reused for both generation context and the UI's "sources" panel; embedding/chat/agent objects cached and built once per config.
- **Reliability guardrails:** every provider gets the same labelled context package (task/memory/conversation/retrieved docs); a grounding check triggers an automatic repair pass on ungrounded or citation-less answers.
- **Embeddings:** switchable local (HuggingFace, private, default) or online (Google API), auto-rebuilds index on switch.
- **Honesty note:** an earlier public repo variant (`Agentic_DocuChat_Pro`) was largely vibe-coded — disclosed openly, flagged as an interview risk. Don't overstate hand-authorship of that specific variant.

### CareerOS-Pro — Multi-Source Job Aggregation & Career-Page Scraping Platform
*Solo*

- **Sources:** 5 job-board APIs — JSearch (RapidAPI), Adzuna, Remotive, RemoteOK, Arbeitnow — plus a free async company-career-page scraper (BeautifulSoup4) as a 6th source. *(Note: earlier notes referenced 10 sources including Indeed/Naukri/Internshala/Wellfound/Otta — the current README only documents these 5 + scraper. Confirm which is accurate before quoting a number anywhere.)*
- **Pipeline:** deterministic normalization (no LLM in the parsing path) — location/remote classification, employment-type mapping, experience-level classification, salary parsing with currency conversion. Two-stage dedup (`url_hash` exact match, then `content_hash` fallback). Hard eligibility filters applied in pure logic — the LLM never overrides them.
- **LLM layer:** LangGraph state machine for match/explain, with multi-provider fallback order LlamaCpp → NVIDIA NIM → OpenRouter → Gemini.
- **Verification:** two-stage — cheap HTTP HEAD check, then a Firecrawl content scrape — before a listing is ever surfaced; never invents a result.
- **Company scraper:** per-domain semaphore concurrency control, exponential backoff with jitter, in-memory HTML cache; runs as the `company` job source, no API key needed.
- **Monitoring:** every LLM provider and job-source adapter is an independently-failing "agent"; `GET /agents/health` reports per-agent call counts, failure rate, latency, and status (healthy/degraded/down). **Currently per-process and in-memory** — resets on restart, not shared across workers. Same caveat applies to the rate limiter: it is in-memory today, not Redis-backed; the README notes Redis as the needed upgrade for multi-worker production, but that isn't built yet.
- **Stack:** FastAPI/Granian backend, React 19 + Vite + Framer Motion frontend, MySQL (canonical store), Qdrant (semantic ranking), Docker/docker-compose.
- **Testing:** pytest with `respx` HTTP mocking — no real network calls in CI.

---

## Agentic / GenAI Projects

### Resume Crew — Local-First Resume-to-JD Match & Tailoring Tool
*Solo*

- CrewAI multi-agent pipeline parsing resume/JD pairs (PDF, DOCX, TXT, Markdown) into a six-part evidence-based report: match score, resume profile, JD profile, skills-gap analysis, tailored bullet suggestions, interview prep. Combines deterministic keyword scoring with LLM analysis. Reports export as Markdown, PDF, and Word.
- Gradio UI with 8 workflows: Analyze, **Build Resume** (drafts a new resume from source facts only — nothing invented), Rank Resumes, Batch Analyze (full pipeline across a folder), Compare JDs (one resume vs. several postings), History (with a score-trend chart), Hardware diagnostics.
- Runs local-first via Ollama (privacy-first, CUDA/MPS/CPU auto-detection) with optional Gemini cloud fallback; optional password-protected ngrok public sharing.
- Testing: pytest suite across 6 modules covering scoring logic, document validation, report structure, and edge cases (CRLF handling, single-character tokens, timestamp formatting).
- Privacy: CrewAI tracing/telemetry disabled by default, keeping candidate data out of third-party services.

### AI Game Development Crew — Multi-Agent CrewAI Pipeline
*Solo*

- 3-agent sequential CrewAI pipeline: Game Designer → Senior Python/Pygame Developer (equipped with SerperDevTool live web search) → QA Reviewer. Turns a one-line idea into a complete, playable 2D Pygame game.
- Packaged as browser-playable WebAssembly via `pygbag`, served through a public ngrok tunnel.
- **Two real bugs fixed:** (1) a self-destructive output-path collision — if generated code were written straight to `main.py` (as in the original notebook), it would overwrite the launcher script itself; fixed by naming the launcher `crew.py` and routing generated code to `output/main.py`. (2) a Pyodide/WASM compatibility gap — `pygbag` runs the game via Pyodide in-browser, which requires the game loop to yield every frame (`await asyncio.sleep(0)`); missing this caused browser builds to freeze/blank on load. Also patched a pygbag 0.9.3 template bug where the media-engagement preloader gate stayed active despite `--ume_block 0`.

### MCP Agents Suite — SkillMap & SalaryInsights
*Solo*

**SkillMap Agent** (AI Skill-to-Career Mapping): Gemini reasoning via LangChain, Tavily search through a Composio MCP session, live job search via a custom `search_jobs` tool calling RapidAPI's JSearch. LangGraph in-memory conversation checkpointing (`thread_id`). Clean CLI error handling (no raw tracebacks) and graceful Ctrl+C. **Engineering fix:** diagnosed and pinned a transitive dependency conflict — `langchain-mcp-adapters==0.3.1` requires `mcp>=1.24.0` with no upper bound, but `mcp>=2.0.0` renamed `RequestContext`→`BaseContext` and broke the adapters' imports; pinned `mcp==1.29.0` in `requirements.txt` to keep the build reproducible.

**SalaryInsights Agent:** Gemini reasoning via LangChain, Firecrawl search-and-scrape tools loaded through Composio MCP, pulling compensation data from Glassdoor, AmbitionBox, PayScale, and Levels.fyi. LangGraph memory checkpointing (`thread_id="salary-agent"`) for multi-turn follow-ups. **Known, disclosed limitation:** the system prompt instructs the agent to call the scraping tools before answering, but Gemini isn't forced to — it can fall back to a general-knowledge estimate instead of scraped data. Memory is in-process only (`InMemorySaver`), reset on restart.

### Email Inbox Summarizer Agent — Gmail Triage & Auto-Draft
*Solo*

- Gmail tools loaded through Composio MCP (`GMAIL_FETCH_EMAILS`, `GMAIL_CREATE_DRAFT`, `GMAIL_MODIFY_LABELS`, `GMAIL_LIST_LABELS`, `GMAIL_REPLY_TO_THREAD`), reasoned over by Gemini via LangChain, with LangGraph memory checkpointing.
- Summarizes unread inbox items in 1–2 lines each, classifies as URGENT / NEEDS REPLY / FYI, drafts replies for flagged emails.
- **Safety design:** no auto-send — the system prompt only ever instructs drafting or replying-to-draft, never sending. Drafts land in Gmail's Drafts folder for manual review.

### CourseFinder Agent — Learning Roadmap & Course Curation
*Solo*

- Merges Tavily MCP results (roadmaps, docs, certifications) and YouTube MCP results (tutorial/playlist search) into one structured learning path per topic.
- No-hallucination system prompt grounds every recommendation in actual tool-call output rather than the model's own suggestions.

### AI Blog Writing Crew — Topic-to-Post CrewAI Pipeline
*Solo*

- Single-file CrewAI pipeline: Content Strategist → Blog Writer → Editor, sequential process, Gemini-backed (default `gemini/gemini-2.5-flash`, overridable).
- CLI takes a topic (flag or interactive prompt), an optional custom output path, and an optional model override; each run writes a timestamped Markdown file so past runs are never overwritten.

---

## Automation & Workflow Engineering

*One consolidated repo across three platforms, chosen deliberately to learn where each excels rather than forcing everything into one tool. Workflow exports themselves (`.json`/`.blueprint.json`) live in linked Google Drive folders, not the repo, with all secrets redacted.*

### n8n — 10 workflows (chosen for full control over logic, branching, code nodes, and LLM agents)

1. **Internship Applier.** Google Sheets Trigger → Gemini LLM Chain (structured output parser drafts the application email) → Gmail send node.
2. **LinkedIn Job Tracker.** Schedule Trigger → RSS Read (LinkedIn feed) → Gemini LLM Chain extracts required skills and drafts a cover letter → append-row node writes to `LinkedIn Job Tracker.xlsx` (Google Sheet).
3. **News Summarizer (SerpApi).** Schedule Trigger → RSS Read (AI + Tech feeds) run in parallel with a SerpApi event fetch → Data Merger/Aggregator node → Gemini summarizer node produces a categorized digest → Gmail send.
4. **Shopping Assistant (most complex, agentic — went through two versions).**
   - *v1:* Telegram Trigger → If node branches on image vs. text. Image branch: Get File → a Python code node → HTTP POST to the Groq API for vision-based product recognition. Text branch goes straight to an AI Agent node (Gemini model + an HTTP Request tool hitting a scraper API for product search) → reply via Telegram.
   - *v2 (current, per the published README):* dropped the image/vision branch in favor of voice input — Telegram Trigger accepts text or voice; voice notes are transcribed via Groq Whisper; the transcription (or text) is routed to the same Gemini tool-using agent (scraper-API product search tool); added persistent per-chat memory via a Redis Chat Memory node. Still text-out only, no TTS reply.
5. **Weather-Based Daily Planner.** Schedule Trigger → OpenWeather API fetch node → Gemini node summarizes the forecast into a day plan → Gmail send.
6. **Historical Content Publisher (LinkedIn).** Schedule Trigger → a Gemini "Historical Day Finder" node researches and writes the post → LinkedIn create-post node.
7. **AI Podcast Generator (n8n backend for PodEase Pro).** Webhook trigger (called from the Lovable frontend) → Gemini podcast-script-generator node → Murf AI API node (text-to-speech) → a podcast-downloader node → Respond to Webhook returns the audio file.
8. **Learning Journey Showcase.** Google Sheets Trigger (fires on a new learning-log row) → Gemini summarizer node → parallel Gemini rewrite nodes tailored per platform → LinkedIn post node + X/Twitter post node.
9. **Social Media Automation (n8n port).** Google Sheets Trigger (fires on a new article-link row) → Gemini summarizer → parallel Gemini rewrites per platform → LinkedIn post + X/Twitter post. Built deliberately as an n8n counterpart to the existing Make.com Social Media Automation project (see below), to compare how the same workflow plays out on both platforms.
10. **Learning Path Generator Agent (agentic).** Chat-message trigger → a tool-using AI Agent (Gemini model + a SerpApi search tool) researches and builds a day-wise curriculum → writes the plan to a new Google Doc → creates matching Google Calendar study-block events.

### Make.com — 2 workflows (chosen for fast visual builds of straightforward trigger→transform→post pipelines)

1. **Social Media Automation.** Google Sheets trigger → an ArticleSummarizer (AI) module → a Router module splits into three branches → LinkedIn-Personalizer → LinkedIn post; Facebook-Personalizer → Facebook Pages post; Telegram-Personalizer → Telegram Bot message. Runs on a 15-minute schedule.
2. **Resume Evaluator.** Triggered by a Telegram message; a Make AI Agent with three tool scenarios — Get Resume Content, Send Email, Send Telegram Message — evaluates the uploaded resume and replies with results via both channels.

### Automation Anywhere — 1 RPA bot (chosen for deterministic, rule-based work with no judgment call)

1. **Automated Email Notification System.** RPA bot reads row-by-row from an Excel source (`AutomatedEmail.xlsx`), applies date-diff conditional business logic to decide who's due a reminder, sends the reminder emails, and updates status — wrapped in Try-Catch error handling. Documented with a PDF writeup and a screen-recorded demo.

### Services used across the suite
Google Gemini (primary LLM), Groq (fast Whisper transcription), SerpApi (search/events), ScraperAPI (proxied product-page fetch), Murf AI (TTS), OpenWeatherMap, Redis (per-user chat memory), Telegram Bot API, Google Sheets/Docs/Calendar, Gmail, LinkedIn/X/Facebook Pages APIs.

### Repo & secrets handling
All three platforms are consolidated into one repo, not split per platform — with a per-project README and renamed workflow/output screenshots (`project_platform_workflow`/`output` naming convention). The actual workflow exports (`.json` for n8n, `.blueprint.json` for Make.com) are deliberately **not stored in the repo at all**, even redacted — they live only in view-only Google Drive folders (n8n and Make.com/Automation Anywhere each have their own), and each project's README links to its file there.

**Security note (for your own awareness, not resume material):** the original workflow exports contained hardcoded live secrets — ScraperAPI, SerpApi, MurfAI, OpenWeatherMap, and Groq API keys, a Google OAuth `client_secret` file, and personal email/Telegram chat ID/LinkedIn URN/Facebook page ID/Google Sheet IDs. All were redacted to placeholders in what's shared publicly. If any of those original keys haven't been rotated yet, rotate them now.

---

## Team Projects

### CrimeSleuth — AI-Powered Criminal Investigation Platform
*Team of 4*

- Trained a 14-class crime-scene classification model on Google Colab, exported as `.pth`, loaded via PyTorch for inference in a deployed Flask app — **genuine model training**, not a pretrained-model integration. Integrated YOLO object detection on evidence images.
- Combined classification and detection outputs into Gemini API prompts to auto-generate investigation reports.
- Stack: React/TS, Flask, MongoDB, YOLO, Gemini API.

### SignatureSense — Handwritten Signature Verification
*Team of 4*

- Integrated a **pre-trained** Keras/TensorFlow model (`.h5`, loaded via `tf.keras.models.load_model()`) for inference — no training performed here; always frame distinctly from CrimeSleuth's genuine training.
- Owned image preprocessing, integration testing, and Bootstrap frontend fixes.
- Stack: MERN, Flask, TensorFlow/Keras.

---

## Other Projects

### F5-TTS Podcast Generator
*Solo*
Ran GPU inference and voice-cloning execution on a Kaggle notebook using the F5-TTS model.

### FoodMunch — Restaurant Landing Page
*Solo*
Responsive restaurant landing page using Bootstrap 4.5. Lowest-ranked project — frontend-only, avoid leading with this given the target roles (AI/ML, not frontend).

---

## Open items to resolve before using any of this externally

1. **CareerOS-Pro source count** — confirm 5 API sources (current README) vs. an earlier claim of 10 (Indeed/Naukri/Internshala/Wellfound/Otta included). Don't quote a number until this is settled.
2. **SkillMap Agent geographic filtering** — an earlier note claimed results were filtered for India internship/full-time listings; the current README doesn't mention this. Confirm whether that feature ever existed or was dropped.
3. **NxtWave education entry** — need the exact program title and enrollment dates for the CV's Education section.
4. **TrustRAG "omniroute"** — confirm what this tool is/does before it's described anywhere.
5. **TrustRAG test counts** — the 111/15/2 pytest/Vitest/Playwright figures and the k6 p95<300ms result predate the local-first and inference-optimization additions; re-verify before quoting them as current.
