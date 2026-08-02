# D31-6R3 — Officer dashboard spacing refresh

## Scope

This correction replaces only the Officer dashboard body. The operational
sidebar, top bar, role selector, route shell, navigation, and demo persistence
remain unchanged.

## Source

The implementation is derived directly from the supplied
`officer-dashboard-react-typescript (3).zip` package.

## Corrections

- Reclaims 14px of route padding on each side at desktop widths.
- Gives the work-plan column more width than Case signals.
- Reduces SLA, Status, and Action from 33% to 26% combined.
- Allocates more space to Service, Request ID, and Next action.
- Uses predictable two-line Request ID formatting.
- Uses 58px table rows and 32px service icons.
- Prevents service-name breaks through words.
- Uses full-width, three-column work-plan tabs.
- Retains container-query responsive behavior.
- Retains controlled horizontal scrolling below 760px.
- Keeps all CSS scoped to the Officer dashboard root.

## Route

```text
/demo/officer
```

## Integration

```tsx
<OfficerDashboardHighFidelity embedded />
```
