// Shared heatmap geometry + brick pathing, imported statically by both the
// renderer (ContributionGraph.jsx) and the lazily-loaded game loops
// (ArcadeActors.jsx). Lives in its own tiny module so the ~30KB loop chunk
// can split off after first paint without dragging the renderer with it —
// importing the loops file directly would defeat the split.

export const CELL = 11, GAP = 3, LEFT_PAD = 28, TOP_PAD = 20

// Brick centres in VIEWBOX units, active days only — the only ground either
// game spends time on. ViewBox units (not rendered pixels) keep the travelers
// glued to the cells at every card width: no scale factor to drift, nothing
// to rebuild on resize. Shared by both loops so the pathing math lives once.
export function computeBricks(days) {
  const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const bricks = []
  days.forEach((d, i) => {
    if (Number(d.count) <= 0) return
    const p = i + firstDow
    bricks.push({
      // Day-index order: `flat` is built from the same padded array but
      // padding nulls return before pushing, so flat[j] is always day j.
      // Reporting anything else (e.g. an active-only rank, or a padded
      // offset) makes strikes flash the wrong cell once inactive days
      // intervene — typically a zero-count day, which is exactly the
      // stuck "EATEN 0" symptom.
      order: i,
      count: Number(d.count) || 0,
      x: LEFT_PAD + Math.floor(p / 7) * (CELL + GAP) + CELL / 2,
      y: TOP_PAD + (p % 7) * (CELL + GAP) + CELL / 2,
    })
  })
  return bricks.length >= 4 ? bricks : null
}
