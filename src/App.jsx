import { useRef, useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Preloader from './components/Preloader'
import TelemetryBar from './components/TelemetryBar'
import Nav from './components/Nav'
import { Hero, Marquee } from './components/Hero'
import About from './components/About'
import Stack from './components/Stack'
import Workbench from './components/Workbench'
import Projects from './components/Projects'
import { Automation, GroupPlatforms, Education, Certifications, Contact, Footer } from './components/Sections'
import CommandConsole from './components/CommandConsole'
import { PROJECTS } from './data/content'
import { useSmoothScroll, useReveals } from './hooks/useMotion'
import { useScrollProgress, useScrollChrome, usePointerTelemetry, useCountUp } from './hooks/useChrome'
import { useInstrumentCursor } from './hooks/useInstrumentCursor'

export default function App() {
  const root = useRef(null)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const { scrolled, showTop } = useScrollChrome()

  useSmoothScroll()
  useReveals(root)
  useScrollProgress()
  usePointerTelemetry()
  useCountUp()
  useInstrumentCursor()

  return (
    <div ref={root}>
      <a href="#top" className="skip-link">Skip to content</a>
      <TelemetryBar onOpenConsole={() => setConsoleOpen(true)} />
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-fill" id="scrollProgressFill" />
      </div>
      <Nav onOpenConsole={() => setConsoleOpen(true)} scrolled={scrolled} />

      <main id="top" tabIndex="-1">
        {/* Inside the boundary, not above it: the preloader is a fixed
            full-viewport overlay, so if it ever throws outside the boundary
            the visitor gets a blank page with no nav and no error card. */}
        <ErrorBoundary>
          <Preloader />
          <Hero />
          <Marquee />
          <About />
          <Stack />
          <Workbench onAnnounce={setAnnouncement} />
          <Projects projects={PROJECTS} />
          <Automation />
          <GroupPlatforms />
          <Education />
          <Certifications />
          <Contact />
        </ErrorBoundary>
      </main>

      <CommandConsole
        open={consoleOpen}
        onOpen={() => setConsoleOpen(true)}
        onClose={() => setConsoleOpen(false)}
      />
      <Footer />
      <span id="simLive" className="sr-only" aria-live="polite">{announcement}</span>
      <button
        type="button"
        className={`to-top${showTop ? ' show' : ''}`}
        id="toTop"
        aria-label="Back to top"
        title="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  )
}
