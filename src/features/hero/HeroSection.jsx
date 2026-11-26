import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { VStack } from '@astryxdesign/core/VStack'
import { Badge } from '@astryxdesign/core/Badge'
import portraitUrl from '../../../assets/svg/maithresh-terminal-portrait.59fb7aed.svg?url'

const LEDGER = [
  ['11+', 'Solo-built AI & agentic systems'],
  ['13+', 'n8n, Make & RPA workflows shipped'],
  ['7.96', 'B.Tech CSE CGPA · KMIT 2027'],
]

export default function HeroSection() {
  return (
    <section id="top" className="hero-section">
      <div className="monograph-container">
        <div className="hero-grid">
          <div className="hero-arrive">
            <Heading level={1} className="hero-headline">
              Verifiable AI systems, <em>built from first principles.</em>
            </Heading>

            <div className="hero-location-line">
              <span>Maithresh Vaddi</span>
              <span>·</span>
              <span>AI/ML &amp; Backend Engineer</span>
              <span>·</span>
              <span>Hyderabad, IN</span>
            </div>

            <div className="hero-mobile-badge">
              <Badge variant="blue" label="Open to AI/ML Internships" />
            </div>

            <p className="hero-copy">
              Final-year B.Tech CSE engineer at KMIT Hyderabad. I build local-first RAG pipelines,
              Model Context Protocol (MCP) tool servers, and deterministic backend architectures
              where models handle only reasoning and every claim stays traceable.
            </p>

            <HStack gap={2} wrap="wrap" style={{ marginTop: '26px' }}>
              <Button label="Inspect Systems" variant="primary" size="md" href="#systems" />
              <Button label="Architecture Workbench" variant="secondary" size="md" href="#workbench" />
              <Button label="Contact" variant="ghost" size="md" href="#contact" />
            </HStack>

            <div className="hero-ledger" role="region" aria-label="Verified engineering summary">
              {LEDGER.map(([value, label]) => (
                <div className="ledger-cell" key={label}>
                  <div className="ledger-val tabular-metric">{value}</div>
                  <div className="ledger-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="specimen-card hero-arrive--delayed" aria-label="Engineer profile specification">
            <div className="specimen-head">
              <span>SPEC // MV-2027</span>
              <Badge variant="blue" label="SYNCED" />
            </div>

            <div className="specimen-portrait">
              <img
                src={portraitUrl}
                alt="ASCII terminal portrait of Maithresh Vaddi"
                width="840"
                height="875"
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <VStack gap={2} padding={3}>
              <HStack justify="between" gap={2} wrap="wrap">
                <span className="specimen-k">FOCUS</span>
                <span className="specimen-v">RAG Reliability · Agentic AI · Backend</span>
              </HStack>
              <HStack justify="between" gap={2} wrap="wrap">
                <span className="specimen-k">CORE STACK</span>
                <span className="specimen-v">LangGraph · CrewAI · FastAPI · Qdrant</span>
              </HStack>
              <HStack justify="between" gap={2} wrap="wrap">
                <span className="specimen-k">INFERENCE</span>
                <span className="specimen-v">ONNX · Ollama · llama.cpp · MLX</span>
              </HStack>
              <HStack justify="between" gap={2} wrap="wrap">
                <span className="specimen-k">PRINCIPLE</span>
                <Text size="xsm" color="accent" weight="medium">
                  Every claim defensible under questioning
                </Text>
              </HStack>
            </VStack>
          </aside>
        </div>
      </div>
    </section>
  )
}
