import { Component } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { Heading } from '@astryxdesign/core/Heading'
import { Icon } from '@astryxdesign/core/Icon'
import { VStack } from '@astryxdesign/core/VStack'
import { RotateCcw } from 'lucide-react'

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
            <VStack gap={3} align="start" className="error-fallback-panel">
              <Heading level={2} size="lg" className="editorial-heading">
                Section temporarily unavailable
              </Heading>
              <p className="error-fallback-copy">
                A section failed to load cleanly. Reload to restore the full portfolio view.
              </p>
              <Button
                label="Reload page"
                variant="secondary"
                size="sm"
                icon={<Icon icon={RotateCcw} size="sm" />}
                onClick={() => window.location.reload()}
              />
            </VStack>
          </div>
        </section>
      )
    }
    return this.props.children
  }
}
