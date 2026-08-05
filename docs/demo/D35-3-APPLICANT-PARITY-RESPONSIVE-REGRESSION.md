# D35-3 — Applicant Parity and Responsive Role Regression

## Status

**IMPLEMENTED — PENDING COMMIT**

## Finding carried into D35-3

Applicant does not use the shared `InternalSidebar`. It uses:

```text
features/demo-applicant/components/applicant-workspace-shell.tsx
features/demo-applicant/components/applicant-workspace-shell.module.css
```

Therefore, D35-2's shared-shell selectors correctly reached Officer, Supervisor, and Admin, but did not reach the actual Applicant workspace.

D35-3 adds Applicant parity before running role and responsive regression checks.

## Applicant calculations

Applicant keeps its own proportional baseline:

| Property | Original | D35 final |
|---|---:|---:|
| Desktop sidebar | 252px | 214.2px |
| Sidebar reduction | — | 15% |
| Item height | 44px | 35.64px |
| Item reduction | — | 19% cumulative |
| Icon size | 19px | 17.1px |
| Icon reduction | — | 10% |
| Font size | 13px | 11.4px |
| Font family | inherited | Source Code Pro |
| Weight | 650 | 400 |
| Letter spacing | default | 0.05px |
| Inactive label | inherited | #666666 |
| Active radius | 9px | 0 |

The item-height calculation applies the two requested 10% reductions:

```text
44 × 0.90 × 0.90 = 35.64px
```

## Included workspaces

- Applicant
- Officer
- Supervisor
- Admin

## Excluded workspace

- Department

## Responsive checks

- Expanded desktop widths
- Internal-shell collapsed width
- Internal mobile drawer width
- Applicant mobile drawer width
- Item typography and density
- Inactive label colour
- Icon colour preservation
- Active item square corners
- Icon size and stroke
- Department exclusion regression

## Files added by D35-3

```text
features/demo-applicant/components/applicant-workspace-shell.module.css
playwright.d35.config.ts
tests/acceptance/d35/shared-navigation-responsive.pw.ts
tests/demo/unit/d35-shared-navigation-regression.test.ts
scripts/demo/verify-d35-3-shared-navigation-regression.sh
docs/demo/D35-3-APPLICANT-PARITY-RESPONSIVE-REGRESSION.md
```
