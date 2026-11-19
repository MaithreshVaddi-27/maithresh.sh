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
            <div className="more-title-row">
              <img className="more-icon" src={item.icon} alt="" aria-hidden="true" width="36" height="36" />
              <h3 className="proj-title proj-title--sm">
                {item.href ? (
                  <a className="more-title-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </h3>
            </div>
            <p>{item.body}</p>
            <Stack items={item.stack} />
          </div>
        ))}
      </div>
    </div>
  )
}
