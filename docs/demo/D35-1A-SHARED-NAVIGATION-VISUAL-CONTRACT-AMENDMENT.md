# D35-1A — Shared Navigation Visual Contract Amendment

## Status

**APPROVED USER AMENDMENT — SUPERSEDES THE D35-1 VISUAL VALUES**

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d35-shared-navigation-visual-refinement` |
| D35-1 commit | `ffb5f4028b9a85e1e6304178f66f8af718789211` |
| D35-1 short commit | `ffb5f40` |

## Reason for amendment

After reviewing the first D35-2 browser result, the user requested a smaller monospaced navigation treatment, a narrower expanded sidebar, and a further icon-size reduction.

This amendment changes only the visual values. The role scope remains:

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ADMIN`

The `DEPARTMENT` workspace remains excluded.

## Final amended values

| Property | Previous D35-1 value | Final value |
|---|---:|---:|
| Font size | `0.8125rem` | `0.7125rem` |
| Pixel equivalent | 13px | 11.4px |
| Font family | Plus Jakarta Sans | Source Code Pro |
| Font weight | 400 | 400 |
| Letter spacing | `0.1px` | `0.05px` |
| Item minimum height | `2.25rem` | unchanged |
| Inline padding | `0.75rem` | unchanged |
| Icon/label gap | `0.75rem` | unchanged |
| Inter-item gap | `0.25rem` | unchanged |
| Icon size | `1.425rem` / 22.8px | `1.35rem` / 21.6px |
| Icon reduction from original | 5% | 10% |
| Icon stroke width | 1 | 1 |
| Expanded desktop sidebar | `16.5rem` | `14.025rem` |
| Sidebar width reduction | — | 15% |

## Sidebar width scope

The 15% reduction applies only to the expanded desktop sidebar at the existing desktop breakpoint.

The following remain unchanged:

- manually collapsed sidebar width;
- automatic collapsed state below the existing breakpoint;
- mobile drawer width;
- navigation item height;
- navigation item padding;
- group spacing;
- label/icon gap;
- top-bar dimensions.

## Implementation rule

Use role-scoped CSS rooted at `data-internal-shell-role`.

Do not modify the global tokens:

```css
--sidebar-width-staff: 16.5rem;
--control-height-compact: 2.5rem;
```

The narrower desktop width must be implemented as a role-scoped grid override rather than a global token change.
