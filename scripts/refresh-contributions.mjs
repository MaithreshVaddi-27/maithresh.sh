// Regenerate src/data/contributions.json from the live contribution API.
// Run before a release so the committed baseline isn't months stale:
//   npm run refresh:contrib
import { writeFileSync } from 'node:fs'

const USER = process.env.GITHUB_USER || 'MaithreshVaddi-27'
const url = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`
const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
if (!res.ok) throw new Error(`contribution API returned ${res.status}`)
const raw = await res.json()
if (!raw?.contributions?.length) throw new Error('contribution API returned no days')

const total = typeof raw.total === 'object' ? raw.total.lastYear : raw.total
writeFileSync('src/data/contributions.json', JSON.stringify({
  _comment: 'Baseline snapshot of the GitHub contribution calendar so the contact '
    + 'section paints immediately and survives the third-party API being slow or down. '
    + 'Regenerate with: npm run refresh:contrib',
  fetchedAt: new Date().toISOString().slice(0, 10),
  total,
  contributions: raw.contributions,
}))
console.log(`wrote src/data/contributions.json — ${raw.contributions.length} days, ${total} contributions`)
