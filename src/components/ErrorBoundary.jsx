import { Component } from 'react'

// A portfolio that renders a blank white page because one component threw is
// the worst failure mode there is: the visitor sees nothing and nobody gets a
// stack trace. This keeps the page up and says what happened.
//
// Class component because that's the only way React still exposes
// componentDidCatch. Nothing else in this app needs an error boundary, so
// there is deliberately no reset/retry machinery — reload is the honest
// recovery and the browser provides it for free.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[maithresh.sh] render error', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="fatal-error" role="alert">
        <div className="fatal-error-card">
          <p className="fatal-error-code">$ render --stacktrace</p>
          <h2>Something broke while drawing this page.</h2>
          <p className="fatal-error-body">
            The rest of the site still works — use the navigation above, or reload to try again.
          </p>
          <button type="button" className="btn-nested btn-nested-primary" onClick={() => location.reload()}>
            <span>↻ reload</span>
          </button>
        </div>
      </div>
    )
  }
}
