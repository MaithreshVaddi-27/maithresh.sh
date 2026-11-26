import { Suspense, lazy } from 'react'
import { Theme } from '@astryxdesign/core/theme'
import { monographTheme } from '../theme/monographTheme'
import ErrorBoundary from '../components/common/ErrorBoundary'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../features/hero/HeroSection'

const ArchitectureWorkbench = lazy(() => import('../features/architecture/ArchitectureWorkbench'))
const FeaturedSystems = lazy(() => import('../features/systems/FeaturedSystems'))
const StackMatrix = lazy(() => import('../features/stack/StackMatrix'))
const AutomationsAndTeam = lazy(() => import('../features/workflows/AutomationsAndTeam'))
const BackgroundAndContact = lazy(() => import('../features/background/BackgroundAndContact'))

export default function App() {
  return (
    <Theme theme={monographTheme} mode="dark">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <ErrorBoundary>
          <HeroSection />
          <Suspense fallback={null}>
            <ArchitectureWorkbench />
            <FeaturedSystems />
            <StackMatrix />
            <AutomationsAndTeam />
            <BackgroundAndContact />
          </Suspense>
        </ErrorBoundary>
      </main>
    </Theme>
  )
}
