import { TechStack as Stack } from '../Common'
import { MORE_PROJECTS } from '../../data/content'

// Expandable list of the remaining projects.
export function MoreProjects({ open, onToggle }) {
  const items = MORE_PROJECTS
  return (
    <div className="more-projects reveal">
      <button
        type="button"
        className="more-toggle"
        id="moreToggle"
        aria-expanded={open}
        aria-controls="moreBody"
        onClick={onToggle}
      >
        <span>$ ls projects/ --all</span>
        <span id="moreArrow">{open ? '− hide' : `+ show ${items.length} more`}</span>
      </button>
      <div className={`more-body${open ? ' open' : ''}`} id="moreBody">
        {items.map((item) => (
          <div className="more-item" key={item.title}>
            <div className="proj-top">
              <span className="proj-tag">{item.tag}</span>
              {item.href && (
                <a className="proj-link" href={item.href} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              )}
            </div>
            <h3 className="proj-title proj-title--sm">
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p>{item.body}</p>
            <Stack items={item.stack} />
          </div>
        ))}
      </div>
    </div>
  )
}
