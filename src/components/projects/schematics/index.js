import { TrustRag } from './TrustRagDiagram'
import { DocuChat } from './DocuChatDiagram'
import { ResumeCrew } from './ResumeCrewDiagram'
import { CareerOS } from './CareerOSDiagram'
import { CareerMesh } from './CareerMeshDiagram'

// Keyed by GitHub repo slug so copy and schematic can't drift out of order.
export const DIAGRAMS = {
  TrustRAG: TrustRag,
  MCP_Agentic_DocuChat: DocuChat,
  Resume_Crew: ResumeCrew,
  'CareerOS-Pro': CareerOS,
  MCP_SkillMap_Agent: CareerMesh,
}

export const repoSlug = (href) => href.split('/').pop()
