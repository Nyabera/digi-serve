# Supervisor dashboard parity specification

## Reference geometry

- Source reference: 864 × 1821px.
- Reference preview: a 218px operational sidebar and a dashboard body capped at 1440px before browser scaling.
- Typography: Plus Jakarta Sans for titles, headings, names, and numeric emphasis; Inter for dense table and chart text.
- Styling: white cards, `#DDE5F0` structural borders, very light blue-gray surfaces, cobalt actions, and semantic violet/orange/red/green status colors.
- Layout: real CSS Grid and semantic tables. No screenshot background, CSS zoom, transform scaling, or fixed viewport-sized dashboard body.

## Zone map

### Zone 1 — Department health

- Six-metric department-health strip.
- Five-row Approval lane with exact applicants, request IDs, services, dates, stages, owners, and decision controls.
- Critical attention and Unassigned work side cards.

### Zone 2 — Work distribution and control

- Officer workload and capacity.
- Assignment centre recommendations.
- Department work queue with All/My queue/Team tabs.
- Handoff control.
- Escalations and exceptions.
- Document and payment exceptions.

### Zone 3 — Department performance

- Four-stage service flow with the Finance verification bottleneck.
- Overall SLA summary and 14-day Recharts line chart.
- Officer and service rankings.
- Department-throughput Recharts bar chart.
- Applicant experience distribution and performance insights.

### Zone 4 — Oversight and governance

- Recent decisions.
- Department activity timeline.
- Audit highlights and top signals.
- Team notifications.
- Four report/export tiles.

## Responsive behavior

- Above 1260px: reference three- and five-column desktop geometry.
- 1040–1260px: compact sidebar and tighter desktop allocations.
- 720–1040px: two-column operational panels; performance hero stacks; lower performance cards use three columns.
- Below 720px: one-column zones, horizontally scrollable approval table, mobile navigation rail, and two-column report tiles.
- Below 430px: single-column metrics and reports.

## Interaction coverage

- Active sidebar state and demo toast feedback.
- Search submission, date control, and notification action.
- Request opening, approval decisions, and row menus.
- Team, assignment, queue, handoff, escalation, and exception actions.
- Queue tabs.
- Report run/schedule controls and all “View” actions.

## Verification

- Strict TypeScript production build passes.
- Recharts render through `ResponsiveContainer` with aspect-ratio-protected parents.
- Dashboard control/reset/focus selectors are component-scoped.
- The archive is integrity-tested before delivery.
