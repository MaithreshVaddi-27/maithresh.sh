export const CONSOLE_ITEMS = [
  { target: 'workbench', glyph: '»', title: 'Architecture Workbench', sub: 'Run the pipeline for each system, then read the design trade-off I can defend', tag: '#workbench', tagTone: 'cyan', keywords: 'trustrag docuchat resumecrew careeros resume crew sim architecture' },
  { target: 'projects', glyph: '#', title: 'Featured systems', sub: 'Highlights from 11+ solo-built agent repositories — problem, constraint, and what I haven’t solved yet', tag: '#projects', tagTone: 'amber', glyphTone: 'amber', keywords: 'repos github trust rag mcp agents projects' },
  { target: 'automation', glyph: '*', title: 'Automation & workflow suites', sub: '13+ automation workflows across n8n, Make.com, and RPA', tag: '#automation' },
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

