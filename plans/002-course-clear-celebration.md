# 002 — COURSE CLEAR celebration pulse

- **Status**: DONE
- **Commit**: 408c1ec
- **Severity**: MEDIUM
- **Category**: Missed opportunity (rare, high-emotion moment rendered flat)
- **Estimated scope**: 2 files, ~20 lines

## Problem

The pacman loop finishing the whole year is the rarest moment on the page —
it renders as a plain, instant text append (`· COURSE CLEAR ↺ REPLAY`) and the
grid does nothing. First-visit/celebration moments are the one tier where
delight is allowed; this one spends none of that budget.

`src/components/ContributionGraph.jsx:237` — current:

```jsx
        {cleared && <span> · COURSE CLEAR ↺ REPLAY</span>}
```

`src/components/ContributionGraph.jsx:259` — current frame element:

```jsx
      <div ref={frameRef} className={`activity-graph-frame${STILL ? '' : ' boot'}`}>
```

## Target

One-shot, event-driven (never continuous!) animation pair, both tied to the
existing `cleared` state, both inside the ice-cyan ramp, zero new hues, no
per-frame filters (the keyframe runs ~1s once per clear):

1. Caption span gets a class so it can pulse:

```jsx
        {cleared && <span className="course-clear"> · COURSE CLEAR ↺ REPLAY</span>}
```

2. The frame element reflects `cleared` (note: `cleared` only ever becomes true
when the game loop runs, i.e. never under STILL, so no STILL guard needed):

```jsx
      <div ref={frameRef} className={`activity-graph-frame${STILL ? '' : ' boot'}${cleared ? ' clear-breathe' : ''}`}>
```

3. In `src/styles.css`, next to the existing `.brick-hit` rules (~line 682):

```css
  /* COURSE CLEAR: one-shot pulse when the chomper finishes the year.
     Event-driven (plays ~1s per full course, never loops); text-shadow and
     brightness are confined to the animation keyframes so nothing repaints
     per frame at rest. */
  .course-clear{
    animation: courseClearPulse 1s var(--ease-out);
  }
  @keyframes courseClearPulse{
    0%{ opacity: .2; text-shadow: none; }
    30%{ opacity: 1; text-shadow: 0 0 14px rgba(186,230,252,.55); }
    100%{ opacity: 1; text-shadow: none; }
  }
  .activity-graph-frame.clear-breathe svg{
    animation: clearBreathe .9s var(--ease-out);
  }
  @keyframes clearBreathe{
    0%{ filter: none; }
    35%{ filter: brightness(1.28) saturate(1.15); }
    100%{ filter: none; }
  }
  @media (prefers-reduced-motion: reduce){
    .course-clear,
    .activity-graph-frame.clear-breathe svg{ animation: none; }
  }
```

## Repo conventions to follow

- Easing: `var(--ease-out)` (`src/styles.css:112`).
- One-shot keyframes with `forwards`/event triggers are the house pattern:
  `.brick-hit` and `.brick-shard` (`src/styles.css:682-700`) do exactly this.
- Reduced-motion belt-and-braces guard mirrors the one at
  `src/styles.css:652`.
- Colors: stay on the ramp — `rgba(186,230,252,·)` is `#bae6fd` at alpha, the
  pale ice tier already used for HOT cells.

## Steps

1. Edit `src/components/ContributionGraph.jsx:237` to add `className="course-clear"`.
2. Edit `src/components/ContributionGraph.jsx:259` to append the `clear-breathe`
   class when `cleared` is true (exact JSX above).
3. Add the CSS block to `src/styles.css` after the `.brick-shard` rules
   (before `.arcade-select`, ~line 701).

## Boundaries

- Do NOT add JS timers, state, or effect hooks — the animation is pure CSS
  driven by the existing `cleared` boolean.
- Do NOT animate the rect cells individually.
- No new hues, no continuous glow at rest (all effects end at computed rest).
- If line numbers drift from commit 408c1ec, locate by the quoted code, not
  the numbers; if the quoted code itself is gone, STOP and report.

## Verification

- **Mechanical**: `npm run build` succeeds; grep confirms `@keyframes courseClearPulse` exists once.
- **Feel check**: run the dev server, switch to PAC-MAN, wait for a full course.
  On clear: caption text blooms in with a soft ice glow, the grid briefly
  breathes brighter (~0.9s), then both return to rest. Each replay re-pulses.
  At DevTools 10% playback the pulse eases out, never snaps.
- Toggle `prefers-reduced-motion` in the Rendering panel and confirm both
  animations are dropped (text still appears — only motion is removed,
  which here means the pulse, not the text).
- **Done when**: clear event visibly pulses once per course and nothing glows
  at rest afterward.
