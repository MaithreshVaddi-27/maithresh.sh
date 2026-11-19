# 003 — Breakout beam steering: no once-per-second direction jumps

- **Status**: DONE
- **Commit**: 408c1ec
- **Severity**: LOW
- **Category**: Interruptibility / physicality (continuous motion)
- **Estimated scope**: 1 file, ~20 lines

## Problem

The breakout beam's "hungry steering" hops once per second: every 60 substeps
it blends 50% of the velocity toward the nearest unstruck brick in a single
substep. That is a visible ~60° direction twitch every second, against the
"calm drift" the surrounding comments intend. Steering should turn the beam,
not teleport its heading.

`src/components/ArcadeActors.jsx:269-289` — current nudge block (inside `step`):

```js
      if (++sinceNudge >= 60) {
        sinceNudge = 0
        if (seen.size >= bricks.length) seen.clear()
        let best = -1, bestD = Infinity
        for (let i = 0; i < bricks.length; i++) {
          if (seen.has(i)) continue
          const b = bricks[i]
          const dx = b.x - px, dy = b.y - py
          const d = dx * dx + dy * dy
          if (d < bestD) { bestD = d; best = i }
        }
        if (best >= 0 && bestD > 1) {
          const b = bricks[best]
          const d = Math.sqrt(bestD)
          const sp = Math.hypot(vx, vy) || SPEED
          vx = vx * 0.5 + ((b.x - px) / d) * sp * 0.5
          vy = vy * 0.5 + ((b.y - py) / d) * sp * 0.5
          const s2 = Math.hypot(vx, vy) || 1
          vx = (vx / s2) * sp; vy = (vy / s2) * sp
        }
      }
      px += vx; py += vy
```

## Target

Keep the once-per-second target *search* (it's cheap), but hold the chosen
heading in `steerX/steerY` and turn toward it gradually every substep; clear
it on collision so a ricochet reads cleanly before the hunt resumes.

Replace the nudge block's blend with:

```js
      if (++sinceNudge >= 60) {
        sinceNudge = 0
        if (seen.size >= bricks.length) seen.clear()
        let best = -1, bestD = Infinity
        for (let i = 0; i < bricks.length; i++) {
          if (seen.has(i)) continue
          const b = bricks[i]
          const dx = b.x - px, dy = b.y - py
          const d = dx * dx + dy * dy
          if (d < bestD) { bestD = d; best = i }
        }
        if (best >= 0 && bestD > 1) {
          const b = bricks[best]
          const d = Math.sqrt(bestD)
          steerX = (b.x - px) / d
          steerY = (b.y - py) / d
        }
      }
      // Turn toward the held heading a little each substep (~3%) instead of
      // hopping 50% once per second — the drift reads as one continuous
      // curve. Renormalized so the beam never gains speed from steering.
      if (steerX || steerY) {
        const sp = Math.hypot(vx, vy) || SPEED
        vx = vx * 0.97 + steerX * sp * 0.03
        vy = vy * 0.97 + steerY * sp * 0.03
        const s2 = Math.hypot(vx, vy) || 1
        vx = (vx / s2) * sp; vy = (vy / s2) * sp
      }
      px += vx; py += vy
```

Declaration alongside the other per-loop lets (~line 235):

```js
let steerX = 0, steerY = 0
```

And in the collision handler (the block that sets `holding = b.order;
dwell = 20`), add so bounces dominate for a moment:

```js
        steerX = 0; steerY = 0
```

## Repo conventions to follow

- The loop already renormalizes velocity after every change
  (`const s2 = Math.hypot(vx, vy) || 1; vx = (vx / s2) * SPEED; …`) —
  mirror that idiom exactly (see `src/components/ArcadeActors.jsx:304-305`).
- Continuous per-frame actor motion is plain arithmetic in the rAF loop here
  (no GSAP in this chunk) — keep it that way.

## Steps

1. Add `let steerX = 0, steerY = 0` next to `let sinceNudge = 0`
   (`src/components/ArcadeActors.jsx:235`).
2. Replace the velocity blend inside the nudge block with the steering-vector
   assignment shown above.
3. Insert the per-substep gentle turn between the nudge block and
   `px += vx; py += vy`.
4. In the collision handler, zero `steerX`/`steerY` alongside `cool[i] = 10`.

## Boundaries

- Do NOT touch the wall bounces, the constant-speed rescale at the end of
  `step`, pacman, or anything outside `useBreakout`.
- Do NOT change `SPEED`, `reach`, `STEP`, or the once-per-second search rate.
- If the quoted code has drifted from commit 408c1ec, locate by quoted
  snippets; if absent, STOP and report.

## Verification

- **Mechanical**: `npm run build` succeeds.
- **Feel check**: run the site, switch to BREAKOUT, watch ~30s. The beam
  should carve smooth arcs between bricks with no once-a-second kink; right
  after a strike it should bounce cleanly (no immediate turn back toward the
  brick it just hit) for a few frames before steering resumes. Speed should
  look constant — steering must never look like a burst.
- At 10% playback in DevTools, confirm no single frame turns the heading more
  than a few degrees while steering.
- **Done when**: no visible once-per-second twitch in a 30s watch.
