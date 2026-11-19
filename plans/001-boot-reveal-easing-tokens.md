# 001 — Boot reveal uses the repo easing tokens

- **Status**: DONE
- **Commit**: 408c1ec
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, 2 lines

## Problem

The heatmap boot reveal hand-types a cubic-bezier that is byte-identical to the
existing `--ease-out` token, and the month/day labels enter with bare `ease`
while the columns use the strong curve — the labels lag behind the columns'
motion instead of moving as one reveal.

`src/styles.css:640` — current:

```css
  .activity-graph-frame.boot .cweek{
    opacity: 0;
    animation: cweekIn .55s cubic-bezier(.16,1,.3,1) forwards;
    animation-delay: var(--rd, 0ms);
  }
  .activity-graph-frame.boot .clab{
    opacity: 0;
    animation: cweekIn .5s ease forwards;
    animation-delay: 60ms;
  }
```

## Target

```css
  .activity-graph-frame.boot .cweek{
    opacity: 0;
    animation: cweekIn .55s var(--ease-out) forwards;
    animation-delay: var(--rd, 0ms);
  }
  .activity-graph-frame.boot .clab{
    opacity: 0;
    animation: cweekIn .5s var(--ease-out) forwards;
    animation-delay: 60ms;
  }
```

## Repo conventions to follow

- Motion tokens live at `src/styles.css:112-113`:
  `--ease-out: cubic-bezier(.16,1,.3,1);` — this plan replaces a hand-typed
  duplicate with that token, nothing new is introduced.
- Exemplar: `src/styles.css:712` — `.arcade-btn` already uses
  `var(--ease-out)` for its transitions.

## Steps

1. In `src/styles.css`, in the `.activity-graph-frame.boot .cweek` rule, replace
   `cubic-bezier(.16,1,.3,1)` with `var(--ease-out)`.
2. In the same block, in `.activity-graph-frame.boot .clab`, replace `ease`
   with `var(--ease-out)`.

## Boundaries

- Do NOT touch any other rule in `src/styles.css`, any JSX, or `@keyframes cweekIn`.
- Do NOT add new tokens or dependencies.
- If the lines no longer match (drift since commit 408c1ec), STOP and report.

## Verification

- **Mechanical**: `npm run build` succeeds.
- **Feel check**: reload the page, scroll to the contribution card, confirm the
  month/day labels and the week columns share one easing so the reveal reads
  as a single wipe. In DevTools Animations panel at 10% speed the labels should
  not visibly lag behind the columns' curve.
- **Done when**: both rules reference `var(--ease-out)` and grep shows no
  `cubic-bezier(.16,1,.3,1)` left inside the `.boot` block.
