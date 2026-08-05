# D35-2 — Shared Navigation Visual Implementation

## Status

**V3 IMPLEMENTED — PENDING BROWSER ACCEPTANCE AND COMMIT**

## Included roles

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ADMIN`

## Excluded role

- `DEPARTMENT`

## Final V3 values

| Property | Value |
|---|---:|
| Font size | `0.7125rem` |
| Font family | Source Code Pro |
| Font weight | `400` |
| Letter spacing | `0.05px` |
| Inactive label colour | `#666666` |
| Inactive icon colour | unchanged |
| Active text/icon colour | unchanged |
| Active item radius | `0` |
| Item minimum height | `2.025rem` / 32.4px |
| Horizontal padding | unchanged |
| Icon-label gap | unchanged |
| Inter-item gap | unchanged |
| Icon size | `1.35rem` / 21.6px |
| Icon stroke width | `1` |
| Expanded desktop sidebar | `14.025rem` |

## Implementation detail

The inactive text colour is applied to the label span only:

```css
.nav-item:not([aria-current="page"]) .nav-item-label
```

This prevents the Lucide icons from inheriting `#666666`.

The additional 10% density reduction is implemented through the item minimum height because the navigation item has no explicit vertical padding.

## Verification

```bash
./scripts/demo/verify-d35-2-shared-navigation-visuals.sh
```

Focused test:

```bash
./node_modules/.bin/vitest run tests/demo/unit/d35-shared-navigation-visuals.test.ts
```

## Browser checks

Verify:

1. Inactive text is `#666666`.
2. Inactive icon colour is unchanged.
3. Active text and icon colours are unchanged.
4. Active item corners are square.
5. Item rows are visibly denser.
6. Labels, icons, and active indicator are not clipped.
7. Department remains unchanged.
