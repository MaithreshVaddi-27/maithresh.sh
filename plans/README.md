# Animation plans

Plans for maithresh.sh, written by the `improve-animations` audit at commit `408c1ec`.

| # | Plan | Severity | Status | Depends on |
|---|------|----------|--------|------------|
| 001 | [Boot reveal easing tokens](001-boot-reveal-easing-tokens.md) | MEDIUM | DONE | — |
| 002 | [COURSE CLEAR celebration pulse](002-course-clear-celebration.md) | MEDIUM | DONE | — |
| 003 | [Breakout steer smoothing](003-breakout-steer-smoothing.md) | LOW | DONE | — |
| 004 | [Live upgrade fade](004-live-upgrade-fade.md) | LOW | DONE | — |

Recommended order: 001 → 002 → 003 → 004 (001 and 002 both touch the boot
reveal block; do 001 first so 002's keyframes land next to cleaned-up rules).
All four are independent — any failure in one does not block the others.

Scope note: these cover the contribution heatmap audit. A whole-site motion
audit is pending; new findings continue at 005.
