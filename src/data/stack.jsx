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
      'NVIDIA NIM', 'Ollama', 'llama.cpp', 'MLX', 'MLX-LM', 'LM Studio', 'Prompt engineering',
      'ReAct / Plan-Execute', 'Conversational memory / checkpointing', 'LoRA / RLHF fundamentals',
    ],
    note: 'Build method: spec-first, AI-assisted — I write the architecture + line-by-line specs, direct implementation via Claude Code / OpenCode / Antigravity, and own every design decision. Happy to walk through specs vs. tool defaults in an interview.',
  },
  {
    file: 'automation.sh',
    title: 'Automation',
    icon: 'bolt',
    chips: [
      'n8n (agentic + voice + Redis memory)', 'Make.com',
      'Automation Anywhere (RPA)', 'Webhooks', 'REST APIs', 'Telegram Bot API',
      'Groq Whisper',
    ],
  },
  {
    file: 'backend.sh',
    title: 'Backend & Data',
    icon: 'db',
    chips: [
      'Python', 'TypeScript', 'Java (OOP)', 'C++', 'JavaScript (ES6)', 'SQL', 'FastAPI', 'Granian',
      'Flask', 'httpx (async)', 'Pydantic', 'SQLAlchemy', 'Bun', 'Node.js', 'Express.js',
      'MongoDB', 'MySQL', 'SQLite', 'Redis', 'Pandas', 'NumPy', 'Matplotlib',
    ],
    note: '26+ LeetCode SQL problems solved — joins, subqueries, aggregations.',
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
    note: 'AWS / Kubernetes / Jenkins: academic coursework and lab environments, no named production deployment. Frontend: React 19, Framer Motion, Gradio, Bootstrap 4.5 · Design: Figma (UX research, wireframing).',
  },
]

