import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mono-section">
          <div className="monograph-container">
            <p className="error-fallback-copy">
              A section failed to render. Reload the page to restore the portfolio view.
            </p>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
