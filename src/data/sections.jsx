export const AUTOMATIONS = [
  {
    status: 'live',
    live: true,
    title: 'AI Podcast Generator — PodEase Pro',
    href: 'https://podease-pro.lovable.app',
    body: 'Idea → finished audio file. A Lovable frontend hits a webhook into n8n, which routes the topic through Gemini for script generation, then Murf AI for text-to-speech, returning the audio in the webhook response. Live at podease-pro.lovable.app.',
    stack: ['n8n', 'Gemini API', 'Murf AI', 'Webhooks'],
    icon: 'mic',
  },
  {
    status: 'live',
    title: 'n8n Workflow Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'The n8n half of the suite: Internship Applier, LinkedIn Job Tracker, News Summarizer, a Telegram Shopping Assistant (Groq Whisper voice input + Redis per-chat memory), Weather Planner, a Learning Path agent that writes study blocks to Google Calendar, Historical Content Publisher, and more. Chosen over Make.com here deliberately — n8n gives full control over branching, code nodes, and LLM agents.',
    stack: ['n8n', 'Gemini', 'Groq', 'Redis', 'Webhooks'],
    icon: 'flow',
  },
  {
    status: 'live',
    title: 'Make.com Automation Suite',
    href: 'https://github.com/MaithreshVaddi-27/Ai-Workflow-Automations',
    body: 'A Google Sheets → Gemini pipeline that fans one article out to LinkedIn, Facebook, and Telegram via a Router module on a 15-minute schedule — deliberately the n8n counterpart of the same workflow, so I could compare both platforms. Plus a Telegram-triggered AI resume evaluator that returns results over Telegram and Email.',
    stack: ['Make.com', 'Gemini', 'Sheets', 'Telegram'],
    icon: 'share',
  },
  {
    status: 'rpa',
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
    body: 'React + Vite, Node.js/Express, MongoDB, and a Flask ML inference service: upload a signature sample and get a verification verdict backed by a TensorFlow model.',
    scope: (
      <>
        <b>My scope:</b> inference integration, not training — loaded a <b>pre-trained</b> Keras/TensorFlow model (<code>.h5</code>) via <code>load_model()</code> in <code>model_predict.py</code> and owned image preprocessing, integration tests, and React/Vite frontend fixes.
      </>
    ),
    stack: ['React · Vite', 'Node.js · Express', 'MongoDB', 'Flask · TensorFlow/Keras'],
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
    body: 'EDA and visualization on an Amazon e-commerce dataset. LeetCode: 26+ SQL problems (joins, subqueries, aggregations).',
    stack: ['Python', 'Pandas', 'Matplotlib', 'SQL'],
  },
  {
    file: 'outskill.sh',
    title: 'Outskill AI Mastermind — Applied AI Builds',
    body: 'Custom GPTs, Claude Artifacts, AI image/video generation, and rapid prototype builds behind the production systems listed above.',
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
  ['https://www.linkedin.com/in/maithreshvaddi/', 'linkedin', 'LinkedIn'],
  ['https://github.com/MaithreshVaddi-27', 'github', 'GitHub'],
  ['https://leetcode.com/u/MaithreshV/', 'code', 'LeetCode'],
  ['https://www.hackerrank.com/profile/maithreshvaddi16', 'shield', 'HackerRank'],
]

