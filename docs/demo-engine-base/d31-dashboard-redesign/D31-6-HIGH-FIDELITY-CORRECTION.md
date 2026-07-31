# D31-6R — Officer Dashboard High-Fidelity Correction

## Reason for correction

The first D31-6 implementation reproduced the information architecture, but it
did not reproduce the supplied visual system. It used the generic D31 primitive
geometry and sparse Demo Pack values, which changed the proportions, density,
typography, card heights, table widths and lower-panel composition.

D31-6R makes the user-supplied verified React/TypeScript bundle the canonical
visual implementation for the Officer dashboard.

## Source of truth

The implementation is derived directly from:

```text
officer-dashboard-react-typescript.zip
```

The source bundle contains the original 1568 × 1003 reference image, component,
CSS, responsive behavior and working interactions.

## Integration changes

The supplied component markup and geometry are preserved. Only the following
integration changes are made:

1. CSS selectors are scoped under `.d31-officer-reference` so the dashboard
   cannot restyle the shared FAIDIA role shell or other pages.
2. The outer root carries both `officer-dashboard` and
   `d31-officer-reference`.
3. Full-viewport minimum heights are neutralized inside the existing role shell.
4. The unused `BarChart3` import is removed to satisfy the project lint rules.
5. `/demo/officer` is rewired to this implementation without changing the
   Officer layout or shell.

## Preserved reference geometry

```text
Top grid: 1.735fr / minimum 430px
Workload pulse: 145px
Work plan: 443px
Case signals: 422px
Recent handoffs: 168px
Bottom cards: 267px
Bottom grid: 1.2fr / 1.17fr / 0.99fr / 1.5fr
Desktop reference: 1568 × 1003
```

## Data boundary

The exact reference fixture is intentionally retained during visual sign-off.
This prevents sparse Demo Pack data from collapsing the intended six-row work
plan and signal density. The D31-5 adapters remain intact and can be connected
after fidelity approval without changing the canonical markup or CSS.

## Shell boundary

D31-6R does not modify:

- `app/demo/officer/layout.tsx`;
- the shared Officer/Supervisor shell;
- the top bar;
- the sidebar;
- role switching;
- Admin shell ownership.

## Visual comparison conditions

Use browser zoom 100% and a viewport near 1536 × 1000 for direct comparison.
At smaller widths, the supplied responsive breakpoints intentionally reflow the
right column, lower cards and work table.
