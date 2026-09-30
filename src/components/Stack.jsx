import { useEffect, useState } from 'react'
import Icon from './Icon'
import { STACK } from '../data/content'
import { ScrollTrigger } from '../hooks/useChrome'

const VISIBLE = 8

// Long chip walls collapse past 8 with an inline toggle — keeps the honest
// inventory (nothing leaves the DOM) while restoring scan. Collapsing is a
// class toggle in CSS, so React only owns the boolean.
function Chips({ card }) {
  const [open, setOpen] = useState(false)
  // Expanding adds rows, so every ScrollTrigger below this point is measuring a
  // stale layout. This has to run *after* the class lands — calling refresh()
  // inside the click handler measures the old, still-collapsed geometry.
  useEffect(() => { ScrollTrigger.refresh() }, [open])
  if (card.chips.length <= VISIBLE) {
    return (
      <div className="chips">
        {card.chips.map((chip) => <Chip key={chip} chip={chip} accent={card.accent?.includes(chip)} />)}
      </div>
    )
  }
  const collapsed = !open
  const listId = `chips-${card.file.replace(/\W+/g, '-')}`
  return (
    <>
      <div className={`chips${collapsed ? ' is-collapsed' : ''}`} id={listId}>
        {card.chips.map((chip) => <Chip key={chip} chip={chip} accent={card.accent?.includes(chip)} />)}
      </div>
      <button
        type="button"
        className="chips-toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        {collapsed ? `+ show ${card.chips.length - VISIBLE} more` : '− show less'}
      </button>
    </>
  )
}

const Chip = ({ chip, accent }) => (
  <span className={accent ? 'chip chip-accent' : 'chip'}>{chip}</span>
)

export default function Stack() {
  return (
    <section id="stack">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="section-eyebrow">
            <Icon name="stack" />
            <span>$ ls stack/</span>
          </div>
          <h2>Technical stack</h2>
          <p className="section-sub">Ordered by what I actually use day to day, not by what looks impressive on paper.</p>
        </div>
        <div className="stack-groups">
          {STACK.map((card) => (
            <div className="stack-card reveal" key={card.file}>
              <div className="t-head-mini"><span /><span /><span /><em>{card.file}</em></div>
              <h3>
                <Icon name={card.icon} width={1.7} className="stack-h-icon" />
                {card.title}
              </h3>
              <Chips card={card} />
              {card.note && <p className="stack-note">{card.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
