import { Suspense, useEffect } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { monographTheme } from '../theme/monographTheme'
import ErrorBoundary from '../components/common/ErrorBoundary'
import SectionSkeleton from '../components/common/SectionSkeleton'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../features/hero/HeroSection'
import {
  ArchitectureWorkbench,
  AutomationsAndTeam,
  BackgroundAndContact,
  FeaturedSystems,
  StackMatrix,
  prefetchBelowFold,
} from '../utils/sectionLoaders'

export default function App() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetchBelowFold, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const timerId = window.setTimeout(prefetchBelowFold, 900)
    return () => window.clearTimeout(timerId)
  }, [])

  return (
    <Theme theme={monographTheme} mode="dark">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <ErrorBoundary>
          <HeroSection />
          <Suspense fallback={<SectionSkeleton cards={1} height={320} />}>
            <ArchitectureWorkbench />
          </Suspense>
          <Suspense fallback={<SectionSkeleton cards={3} height={180} />}>
            <FeaturedSystems />
          </Suspense>
          <Suspense fallback={<SectionSkeleton cards={2} height={140} />}>
            <StackMatrix />
          </Suspense>
          <Suspense fallback={<SectionSkeleton cards={2} height={150} />}>
            <AutomationsAndTeam />
          </Suspense>
          <Suspense fallback={<SectionSkeleton cards={2} height={160} />}>
            <BackgroundAndContact />
          </Suspense>
        </ErrorBoundary>
      </main>
    </Theme>
  )
}
