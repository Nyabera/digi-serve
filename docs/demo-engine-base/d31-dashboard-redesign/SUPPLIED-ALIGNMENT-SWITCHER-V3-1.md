# Officer dashboard alignment and switcher refresh — v3.1

This update is a focused correction to the approved spacious-v3 dashboard body. It does not replace or modify the application sidebar, topbar, role selector, navigation, routes, or demo reset behavior.

## Diagnosed causes

1. The first work-plan `<td>` had been changed into a flex container. That removed it from normal table-cell sizing and allowed its content to shift the remaining columns.
2. Case signals used a growing flex card and an auto-margin footer. When the left column was taller, the link was pushed to the bottom of a large empty region.
3. Recent Activity mixed a three-column grid with different top padding and icon margins for each child, so the time, icon, and copy did not share a baseline.
4. The period selector had no fixed heading geometry and positioned its chevron from the top edge, making it drift when host styles changed control height.
5. The prior work-plan tabs were optimized for wrapping, but the approved switcher reference uses three equal, icon-led single-line segments.

## Corrections included

- Added a semantic eight-column `<colgroup>` with stable percentage widths.
- Restored the Service cell as a native table cell and placed its icon/content in an inner `.service-cell` grid.
- Added the exact three-part switcher treatment: cobalt active segment, white active badge, muted inactive badges, icons, dividers, and one-line labels.
- Made Case signals content-sized and allowed Recent handoffs to absorb remaining right-column space.
- Centered the Case signals tabs and `Mark all read` control within a fixed 44px tab rail.
- Removed the auto footer spacer from Case signals.
- Aligned every Recent Activity row on one `58px / 31px / remaining` grid with vertically centered cells.
- Gave the chart heading and `Last 7 days` selector explicit 34px/32px geometry and a centered chevron.
- Scoped reset, focus, button, select, and reduced-motion selectors beneath `.officer-dashboard` to protect the existing application shell.

## Integration

Replace these files together:

- `components/OfficerDashboard.tsx`
- `styles/officer-dashboard.css`

Continue rendering the body inside the existing Officer shell:

```tsx
<OfficerDashboard embedded />
```

The production TypeScript build for this bundle was completed successfully.
