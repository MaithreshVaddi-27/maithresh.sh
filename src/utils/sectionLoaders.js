import { lazy } from 'react'

const importers = {
  workbench: () => import('../features/architecture/ArchitectureWorkbench'),
  systems: () => import('../features/systems/FeaturedSystems'),
  stack: () => import('../features/stack/StackMatrix'),
  automations: () => import('../features/workflows/AutomationsAndTeam'),
  background: () => import('../features/background/BackgroundAndContact'),
}

export const ArchitectureWorkbench = lazy(importers.workbench)
export const FeaturedSystems = lazy(importers.systems)
export const StackMatrix = lazy(importers.stack)
export const AutomationsAndTeam = lazy(importers.automations)
export const BackgroundAndContact = lazy(importers.background)

const warmed = new Set()

/** Prefetch a lazy section chunk once, skipping on Save-Data connections. */
export function prefetchSection(key) {
  if (typeof navigator !== 'undefined' && navigator.connection?.saveData) {
    return
  }
  const load = importers[key]
  if (!load || warmed.has(key)) {
    return
  }
  warmed.add(key)
  load().catch(() => {
    warmed.delete(key)
  })
}

/** Prefetch all below-the-fold route sections in priority order. */
export function prefetchBelowFold() {
  for (const key of Object.keys(importers)) {
    prefetchSection(key)
  }
}
