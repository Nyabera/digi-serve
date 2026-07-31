# Officer dashboard — Image 3 visual parity

## Target

This release treats `reference/officer-dashboard-v4-concept.png` as the primary visual specification. It rebuilds the dashboard body shown in the concept while preserving the existing Savannah Technical College application shell.

## Problems diagnosed in the implementation screenshots

1. **Unstable table geometry.** The first table cell was itself a flex container. That changes native table-cell behavior and lets content width disturb column alignment.
2. **Irregular Recent Activity spacing.** Time, icon, and copy were placed in narrow tracks with inconsistent padding offsets rather than one repeated row grid.
3. **Case signals dead space.** The card stretched to match the taller work-plan column while its footer was pinned to the bottom, creating a large empty region.
4. **Top cutoff pressure.** The previous body retained a greeting and workload section above the active-work surface, increasing scroll offset inside the fixed shell.
5. **Misaligned period selector.** The selector relied on inherited shell control geometry and was not centered inside the card-heading row.
6. **Shell leakage risk.** Generic `button`, `select`, `body`, and universal selectors could affect the surrounding demo shell or trigger the unscoped-selector check.

## Structural corrections

| Area | v4 implementation |
| --- | --- |
| Work-plan columns | Native table plus an eight-column `colgroup`; flex only inside cell wrappers |
| Work-plan navigation | Three equal tracks; 58px controls inside an 80px segmented card |
| Table rows | Fixed 74px rhythm with nested service, SLA, and action layouts |
| Case signals | Header action at the top; three intrinsic signal rows; no bottom-pinned footer |
| Recent handoffs | Dedicated timeline marker track and evenly distributed rows |
| Recent Activity | Repeated `61px / 32px / 1fr` item grid |
| Bottom cards | `1.13fr / 1fr / 0.9fr / 1.48fr` desktop grid matching the concept |
| Period selector | Explicit 102 × 36px control aligned by the shared heading grid |
| Typography | Plus Jakarta Sans headings; Inter dense interface copy |
| CSS ownership | Every control and component selector is scoped below `.officer-dashboard` |

## Shell boundary

Replace only:

- `components/OfficerDashboard.tsx`
- `styles/officer-dashboard.css`

Render the body with:

```tsx
<OfficerDashboard embedded />
```

Do not change `InternalAppShell`, the sidebar, topbar, role selector, navigation configuration, route persistence, or demo reset behavior.

## Responsive behavior

- Desktop follows Image 3 with the work plan and signals stack side by side.
- Below 1080px, active work becomes one column and the right-side cards share a secondary row.
- Below 760px, all cards stack and the work-plan table scrolls horizontally at its deliberate minimum width.
- Below 480px, card headings and the rhythm chart reflow without relying on global button heights.
