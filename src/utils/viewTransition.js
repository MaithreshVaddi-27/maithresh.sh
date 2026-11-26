import { flushSync } from 'react-dom'

/**
 * Execute a state update inside a native View Transition when available
 * and reduced-motion preference permits; otherwise update synchronously.
 */
export function runViewTransition(update) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (
    typeof document === 'undefined' ||
    typeof document.startViewTransition !== 'function' ||
    prefersReduced
  ) {
    update()
    return
  }

  document.startViewTransition(() => {
    flushSync(update)
  })
}
