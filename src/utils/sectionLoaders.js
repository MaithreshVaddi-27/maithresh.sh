import { lazy } from 'react'

const importers = {
  systems: () => import('../features/systems/FeaturedSystems'),
  workbench: () => import('../features/architecture/ArchitectureWorkbench'),
  automations: () => import('../features/workflows/AutomationsAndTeam'),
  stack: () => import('../features/stack/StackMatrix'),
  background: () => import('../features/background/BackgroundAndContact'),
}

export const FeaturedSystems = lazy(importers.systems)
export const ArchitectureWorkbench = lazy(importers.workbench)
export const AutomationsAndTeam = lazy(importers.automations)
export const StackMatrix = lazy(importers.stack)
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

/** Prefetch all below-the-fold route sections in reading order. */
export function prefetchBelowFold() {
  for (const key of Object.keys(importers)) {
    prefetchSection(key)
  }
}
