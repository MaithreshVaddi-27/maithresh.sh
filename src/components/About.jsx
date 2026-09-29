import Icon from './Icon'

const PRINCIPLES = [
  [<b key="a">Simple beats clever.</b>, ' I rebuilt DocuChat from a multi-agent system back down to one agent once the extra complexity stopped paying for itself.'],
  [<b key="b">Ship it, don’t demo it.</b>, ' Every project on this page is a real repo with a README, not a notebook I ran once.'],
  [<b key="c">If I can’t defend it in an interview, it doesn’t go on this page.</b>],
]

const TERMINAL = [
  ['$ whoami --verbose', false],
  ['role: AI/ML Engineer · Backend Developer', true],
  ['based: Hyderabad, Telangana, IN', true],
  ['status: open to internships', true],
  ['$ ls agents/ --count', false, true],
  ['11 solo-built · MCP · LangGraph · CrewAI', true],
  ['$ curl -s stack.local/llm', false, true],
  ['Qwen3-4B-GGUF, gemma3:4b + more — all local, offline', true],
  ['$ echo $STATUS', false, true],
  ['still learning, still shipping', true],
]

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="about-grid reveal">
          <div className="about-text">
            <div className="section-eyebrow">
              <Icon name="file" />
              <span>$ cat about.md</span>
            </div>
            <h2>No inflated claims. Every line here is something I can defend in an interview.</h2>
            <p className="about-lead">
              I’m a final-year <strong>B.Tech CSE</strong> undergrad at KMIT Hyderabad, and most of
              what’s below happened outside class — evenings and weekends spent on <strong>agentic
              RAG architecture</strong>: retrieval pipelines, MCP-based tool orchestration, multi-agent
              systems that route between reasoning and live data.
            </p>
            <p>
              Eleven of those are solo builds, shipped as standalone repos — not notebooks, not
              one-off demos. A production RAG reliability pipeline with a claim-verification loop. A
              CrewAI resume-matching tool that runs fully local by default. Thirteen n8n/Make.com/RPA
              workflows I built, broke, and fixed myself, which taught me more than the building did.
              Two group platforms too, where I owned the ML-integration layer.
            </p>
            <p>
              Right now I’m hardening TrustRAG’s claim-verification and adaptive-recovery loop, and
              pushing CareerOS-Pro toward Docker-based production deployment with per-agent health
              monitoring.
            </p>

            <div className="principles">
              <div className="principles-label">A few things I actually believe, not just say:</div>
              <ul>
                {PRINCIPLES.map(([bold, tail], i) => (
                  <li key={i}>
                    <Icon name="check" className="principle-icon" />
                    <span>{bold}{tail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="terminal">
            <div className="t-head"><span /><span /><span /></div>
            {TERMINAL.map(([text, out, spaced]) => (
              <div key={text} className={`t-line${out ? ' t-out' : ''}${spaced ? ' t-line--spaced' : ''}`}>
                {out ? text : <><span className="t-prompt">$</span> {text}</>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
