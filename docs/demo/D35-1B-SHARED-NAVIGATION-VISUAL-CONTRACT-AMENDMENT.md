# D35-1B — Shared Navigation Visual Contract Amendment

## Status

**APPROVED USER AMENDMENT — SUPERSEDES D35-1A WHERE VALUES CONFLICT**

## Baseline

| Field | Value |
|---|---|
| Branch | `demo/d35-shared-navigation-visual-refinement` |
| D35-1 commit | `ffb5f4028b9a85e1e6304178f66f8af718789211` |
| D35-1 short commit | `ffb5f40` |

## Scope

This amendment applies to:

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ADMIN`

The `DEPARTMENT` workspace remains excluded.

## Final V3 changes

| Property | D35-2 V2 | D35-2 V3 |
|---|---:|---:|
| Inactive label colour | inherited | `#666666` |
| Inactive icon colour | existing | unchanged |
| Active item text colour | existing primary | unchanged |
| Active item icon colour | existing primary | unchanged |
| Active item radius | existing control radius | `0` |
| Item minimum height | `2.25rem` / 36px | `2.025rem` / 32.4px |
| Additional height reduction | — | 10% |
| Horizontal padding | existing | unchanged |
| Icon-label gap | existing | unchanged |
| Inter-item gap | existing | unchanged |
| Icon size | `1.35rem` / 21.6px | unchanged |
| Icon stroke width | `1` | unchanged |
| Expanded sidebar width | `14.025rem` | unchanged |

## Colour implementation rule

The `#666666` colour must be applied only to:

```css
.nav-item:not([aria-current="page"]) .nav-item-label
```

It must not be applied to the parent `.nav-item`, because Lucide icons inherit the parent text colour.

## Density implementation rule

The current implementation has no explicit block-axis item padding. The requested additional 10% vertical reduction must therefore be represented by:

```css
min-height: 2.025rem;
```

The following must remain unchanged:

- inline padding;
- icon-label gap;
- list gap;
- group spacing;
- sidebar width;
- mobile width;
- collapsed width;
- top-bar dimensions.
