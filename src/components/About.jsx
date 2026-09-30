import Icon from './Icon'

const PRINCIPLES = [
  [<b key="a">Constraints before code.</b>, ' Decide what must never be wrong — eligibility filters, evidence, secrets — then keep the model out of that path.'],
  [<b key="b">Simple beats clever.</b>, ' I rebuilt DocuChat from a multi-agent system down to one agent once the coordination cost stopped paying for itself.'],
  [<b key="c">Ship it, don’t demo it.</b>, ' Every project here is a real repo with a README, a test suite, and a license — not a notebook I ran once.'],
  [<b key="d">If I can’t defend it in an interview, it doesn’t go on this page.</b>],
]

const TERMINAL = [
  // Input rows carry no literal prompt: the renderer prefixes every input
  // with <span className="t-prompt">$</span>, so a '$' here would print twice.
  ['whoami --verbose', false],
  ['role: AI/ML Engineer · Backend & Agent Systems', true],
  ['focus: RAG reliability · MCP tool orchestration', true],
  ['based: Hyderabad, Telangana, IN', true],
  ['status: open to AI/ML internships', true],
  ['ls systems/ --count', false, true],
  ['11+ solo-built · LangGraph · CrewAI · MCP', true],
  ['curl -s stack.local/llm', false, true],
  ['Qwen3-4B-GGUF, gemma3:4b — local, offline', true],
  ['echo $NEXT', false, true],
  ['Redis-backed rate limiting on CareerOS-Pro', true],
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
            <h2 className="about-lede">
              No inflated claims. Every number on this page is one I can defend under questioning.
            </h2>
            <p className="about-lead">
              I’m a final-year <strong>B.Tech CSE</strong> undergrad at KMIT Hyderabad, and most of
              what’s below happened outside class — evenings and weekends spent on <strong>production
              AI infrastructure</strong>: retrieval pipelines that verify before they answer, MCP
              tool servers, and agent systems that fail gracefully instead of falling over.
            </p>
            <p>
              I work the way I ship:{' '}
              <strong>architecture and constraints first, code second.</strong> In CareerOS-Pro the
              LLM is deliberately kept out of the parsing path because hard eligibility filters should
              never be negotiable. In TrustRAG the answer is only returned after every claim passes NLI
              verification — otherwise the system abstains. Most of these are solo builds shipped as
              real repos, not notebooks I ran once.
            </p>
            <p>
              The part people underestimate: <strong>debugging is the job.</strong> Fixing a
              self-overwriting output path, making a Pygame loop survive a Pyodide/WASM browser
              build, pinning a transitive MCP dependency that broke the LangChain adapters. Those
               hours taught me more than the happy path did. 13+ automation workflows
               and team platforms round it out, where I owned the ML integration layer.
            </p>
            <p>
              Currently hardening TrustRAG’s recovery loop and pushing CareerOS-Pro toward
              multi-worker production — where the in-memory rate limiter and health registry need to
              become Redis-backed. I’d rather say that plainly than imply it’s done.
            </p>

            <div className="principles">
              <div className="principles-label">How I actually build:</div>
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
