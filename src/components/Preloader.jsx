import { useEffect, useState } from 'react'
import { reduceMotion } from '../hooks/useMotion'

// Boot progress readout. Climbs asymptotically to 90% while assets settle, then
// snaps to 100% on window load — never a fake timer pretending to be a bar.
export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(reduceMotion)

  useEffect(() => {
    if (reduceMotion) return
    // Declared before `finish` closes over it: if the document is already
    // complete when this mounts, `finish` runs synchronously below, and a
    // `const timer` further down would still be in its TDZ — a
    // "Cannot access 'timer' before initialization" ReferenceError that
    // white-screens the whole app on a fast load or an HMR reload.
    let timer = 0
    let p = 0
    const finish = () => {
      clearInterval(timer)
      setProgress(100)
      setTimeout(() => setDone(true), 320)
    }
    // React may mount after `load` already fired; don't wait on an event that
    // will never come again.
    if (document.readyState === 'complete') {
      finish()
      return
    }
    timer = setInterval(() => {
      p = Math.min(p + (90 - p) * 0.08 + 0.4, 90)
      setProgress(p)
    }, 90)
    window.addEventListener('load', finish, { once: true })
    // Hard ceiling: a stalled third-party asset can't trap the user behind it.
    const failsafe = setTimeout(finish, 3500)
    return () => {
      clearInterval(timer)
      clearTimeout(failsafe)
      window.removeEventListener('load', finish)
    }
  }, [])

  return (
    <div className={`preloader${done ? ' done' : ''}`} id="preloader" aria-hidden="true">
      <div className="preloader-inner">
        <span className="preloader-mark">maithresh.sh</span>
        <div className="preloader-bar">
          <div className="preloader-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="preloader-pct">{String(Math.floor(progress)).padStart(2, '0')}%</span>
      </div>
    </div>
  )
}
