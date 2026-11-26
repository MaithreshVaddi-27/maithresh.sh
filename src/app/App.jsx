import { Theme } from '@astryxdesign/core/theme'
import { monographTheme } from '../theme/monographTheme'
import ErrorBoundary from '../components/common/ErrorBoundary'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../features/hero/HeroSection'
import ArchitectureWorkbench from '../features/architecture/ArchitectureWorkbench'
import FeaturedSystems from '../features/systems/FeaturedSystems'
import StackMatrix from '../features/stack/StackMatrix'
import AutomationsAndTeam from '../features/workflows/AutomationsAndTeam'
import BackgroundAndContact from '../features/background/BackgroundAndContact'

export default function App() {
  return (
    <Theme theme={monographTheme} mode="dark">
      <div className="monograph-shell">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main">
          <ErrorBoundary>
            <HeroSection />
            <ArchitectureWorkbench />
            <FeaturedSystems />
            <StackMatrix />
            <AutomationsAndTeam />
            <BackgroundAndContact />
          </ErrorBoundary>
        </main>
      </div>
    </Theme>
  )
}
