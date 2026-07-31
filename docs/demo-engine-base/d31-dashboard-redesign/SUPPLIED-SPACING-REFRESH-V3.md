# Officer dashboard spacing refresh — v3

## Diagnosis

The remaining crowding came from width allocation rather than a global font problem:

1. The embedded body stopped at the route's inner padding, leaving usable space outside the dashboard frame.
2. The work-plan grid reserved 33% for SLA, Status, and Action even though those cells contain compact values.
3. Service, Request ID, and Next action therefore wrapped at arbitrary points. This produced splits such as `Replacemen / t` and inconsistent request IDs.
4. The three work-plan filters used a 39px-high, 620px-wide strip. They read like squeezed controls instead of primary dashboard navigation.
5. Forty-nine-pixel rows left too little vertical breathing room once the host shell applied its own typography and button rules.

## What changed

- The embedded dashboard frame now bleeds 14px into the route padding on each side. The bleed resets at 1120px, before the layout stacks.
- The desktop top grid now favors the work-plan column while preserving a 410px minimum for Case signals.
- Column widths now prioritize Service (18.5%), Request ID (12.5%), and Next action (21%). SLA, Status, and Action use 26% together instead of 33%.
- Work-plan tabs span the full card and use stacked two-line labels with separate count badges.
- Request IDs split predictably before their final numeric group.
- Table rows are 58px high, with 32px service icons and calmer cell padding.
- The header row uses a soft surface, clearer hierarchy, and compact uppercase labels.
- Case signals can grow with the left column so both sides keep a clean lower edge.

## Integration boundary

Replace both `components/OfficerDashboard.tsx` and `styles/officer-dashboard.css`, then render:

```tsx
<OfficerDashboard embedded />
```

No shell, sidebar, topbar, navigation, role selector, or persistence file needs to change.
