const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Format an ISO YYYY-MM-DD date in UTC as e.g. "Nov 26, 2026". */
export function formatContributionDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  if (!y || !m || !d) return isoDate
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`
}

/**
 * Compute aggregate GitHub cadence metrics from a chronologically ordered
 * list of daily `{ date, count, level }` entries.
 */
export function computeContributionStats(contributions) {
  let activeDays = 0
  let longestStreak = 0
  let currentRun = 0
  let peakDay = contributions[0] || { date: '', count: 0, level: 0 }
  let lastActiveDay = null
  const monthBuckets = new Map()

  for (const day of contributions) {
    const count = day.count || 0
    if (count > 0) {
      activeDays += 1
      currentRun += 1
      if (currentRun > longestStreak) longestStreak = currentRun
      lastActiveDay = day
    } else {
      currentRun = 0
    }

    if (count >= (peakDay.count || 0) && count > 0) {
      peakDay = day
    }

    const monthKey = day.date.slice(0, 7)
    const monthNum = Number(day.date.slice(5, 7)) - 1
    const existing = monthBuckets.get(monthKey) || {
      key: monthKey,
      label: MONTH_NAMES[monthNum] || monthKey,
      year: day.date.slice(0, 4),
      count: 0,
      activeDays: 0,
    }
    existing.count += count
    if (count > 0) existing.activeDays += 1
    monthBuckets.set(monthKey, existing)
  }

  const recent90 = contributions.slice(-91)
  const recent90Total = recent90.reduce((sum, item) => sum + (item.count || 0), 0)
  const recent90ActiveDays = recent90.filter((item) => (item.count || 0) > 0).length
  const recent30Total = contributions
    .slice(-30)
    .reduce((sum, item) => sum + (item.count || 0), 0)

  const monthlyTotals = Array.from(monthBuckets.values()).slice(-12)
  const peakMonthCount = Math.max(1, ...monthlyTotals.map((m) => m.count))

  return {
    activeDays,
    longestStreak,
    peakDay,
    lastActiveDay: lastActiveDay || contributions.at(-1) || peakDay,
    recent90Total,
    recent90ActiveDays,
    recent30Total,
    monthlyTotals,
    peakMonthCount,
  }
}

/**
 * Build week-aligned SVG cell coordinates and spaced month labels for either
 * the full 12-month matrix ('12m') or recent 90-day zoom ('90d').
 */
export function buildHeatmapGrid(contributions, rangeKey) {
  const days = rangeKey === '90d' ? contributions.slice(-91) : contributions
  const firstDate = days[0]?.date || ''
  const lastDate = days.at(-1)?.date || ''
  const startDayOffset = firstDate ? new Date(`${firstDate}T00:00:00Z`).getUTCDay() : 0
  const totalCols = Math.max(1, Math.ceil((days.length + startDayOffset) / 7))

  const cells = []
  const monthLabels = []
  let prevMonth = ''
  let lastLabeledCol = -4

  days.forEach((day, idx) => {
    const slot = idx + startDayOffset
    const col = Math.floor(slot / 7)
    const row = slot % 7
    cells.push({ ...day, col, row })

    const ym = day.date.slice(0, 7)
    if (ym !== prevMonth) {
      prevMonth = ym
      if (col - lastLabeledCol >= 3 && totalCols - col >= 2) {
        const monthIdx = Number(day.date.slice(5, 7)) - 1
        monthLabels.push({ col, label: MONTH_NAMES[monthIdx] || ym })
        lastLabeledCol = col
      }
    }
  })

  return { days, firstDate, lastDate, totalCols, cells, monthLabels }
}
