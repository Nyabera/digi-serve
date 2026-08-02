# D31-6R5 — Officer alignment and switcher refresh

## Purpose

D31-6R5 restores and refreshes the approved spacious-v3 Officer dashboard after
the rejected command-center experiment.

The dashboard keeps the existing application shell, including:

- Savannah Technical College sidebar;
- top search bar;
- role selector;
- current-request selector;
- presentation and reset controls;
- navigation and demo persistence.

## Restored dashboard regions

- greeting and date line;
- Workload pulse;
- Today’s work plan;
- Case signals;
- Recent handoffs;
- Recent Activity;
- Up Next;
- Action Required;
- My rhythm.

## Corrections from the supplied v3.1 bundle

- Adds a stable semantic eight-column `colgroup`.
- Keeps the Service `<td>` as a native table cell.
- Places Service icon and text inside an inner `.service-cell` grid.
- Restores the three-part icon switcher.
- Uses a cobalt active segment and white active count badge.
- Uses equal switcher segments with one-line labels.
- Removes Case signals auto-spacer behavior.
- Keeps the signals tab rail at 44px.
- Lets Recent handoffs absorb remaining right-column height.
- Aligns Recent Activity on a `58px / 31px / 1fr` grid.
- Fixes the chart-period selector at `98px × 32px`.
- Centers the selector chevron vertically.
- Retains container-aware shell breakpoints.
- Retains controlled horizontal table scrolling on compact widths.

## Route

```text
/demo/officer
```

## Integration

```tsx
<OfficerDashboardHighFidelity embedded />
```

## CSS safety

The supplied stylesheet is fully scoped beneath:

```css
.d31-officer-reference
```

This prevents generic classes such as `.card`, `.dashboard-frame`, and
`.text-button` from changing the sidebar, topbar, or other routes.
