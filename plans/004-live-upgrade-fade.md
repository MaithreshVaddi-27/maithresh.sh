# 004 — Fade the caption's snapshot→live upgrade

- **Status**: DONE
- **Commit**: 408c1ec
- **Severity**: LOW
- **Category**: Missed opportunity (teleporting state change)
- **Estimated scope**: 2 files, ~10 lines

## Problem

When the live fetch succeeds, the caption's source token swaps
`snapshot 2026-xx-xx` → `live` instantly — a teleporting text change in the
element a visitor is most likely to be reading.

`src/components/ContributionGraph.jsx:233` — current:

```jsx
        <span>
          · {live ? 'live' : `snapshot ${fetchedAt}`}, last 12 months
          {failed && !live ? ' · live feed unreachable' : ''}
        </span>
```

## Target

A keyed remount of just the source token with a 200ms opacity fade — no JS
timers, no state; React's key-swap remount triggers the entry animation.

```jsx
        <span>
          {' · '}
          <span className="src-swap" key={live ? 'live' : 'snap'}>
            {live ? 'live' : `snapshot ${fetchedAt}`}
          </span>
          , last 12 months
          {failed && !live ? ' · live feed unreachable' : ''}
        </span>
```

In `src/styles.css`, next to `.activity-caption` rules (~line 614):

```css
  /* Live-data upgrade: keyed remount of the source token fades in, so the
     snapshot→live swap doesn't teleport under the reader's eyes. */
  .src-swap{ animation: srcSwapIn .2s var(--ease-out); display: inline; }
  @keyframes srcSwapIn{ from{ opacity: 0; } to{ opacity: 1; } }
  @media (prefers-reduced-motion: reduce){ .src-swap{ animation: none; } }
```

## Repo conventions to follow

- `var(--ease-out)` (`src/styles.css:112`); 200ms matches the small-popover
  tier; opacity-only, so it's composited.
- Reduced-motion guard mirrors `src/styles.css:652`.
- The outer span keeps the existing `.activity-caption span` accent color;
  the nested span inherits it — do not add a color rule.

## Steps

1. Rework the caption span in `src/components/ContributionGraph.jsx` as shown.
2. Add the `.src-swap` rule + keyframes + reduced-motion guard to
   `src/styles.css` right after `.activity-caption span` (~line 614).

## Boundaries

- Do NOT touch the EATEN/cleared spans, the fetch logic, or `live` state.
- Do NOT animate anything except the source token's opacity.
- If the quoted code drifted from commit 408c1ec, locate by quoted snippet;
  if absent, STOP and report.

## Verification

- **Mechanical**: `npm run build` succeeds.
- **Feel check**: hard-reload with DevTools network throttled to Fast 3G — the
  caption reads `snapshot …`, then within a few seconds the token crossfades
  to `live` over ~0.2s with no jump in the surrounding text.
- Reduced-motion on: text swaps instantly, no fade. Both are correct.
- **Done when**: the swap fades and nothing else in the caption moves.
