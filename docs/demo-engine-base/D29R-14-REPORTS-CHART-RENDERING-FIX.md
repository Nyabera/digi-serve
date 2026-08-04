# D29R-14 — Reports chart rendering repair

## Confirmed failure

The Reports body supplied explicit chart-slot heights, but the earlier D26/D28
calibration layers also applied route-wide minimum heights to every Recharts
`ResponsiveContainer`. The report used percentage-only dimensions during the
server/hydration transition. Static HTML, custom legends, centre labels and
tables rendered, while Recharts SVG plots could remain without a stable
measured box.

## Correction

- Retain all existing Recharts chart types and seeded data.
- Introduce one hydration-safe report chart wrapper.
- Render the chart after the client hydration snapshot is available.
- Supply `minWidth={1}` and `minHeight={1}` directly to ResponsiveContainer.
- Add a report-local dimension contract that outranks route-wide calibration.
- Preserve the existing layout, panel heights, filters, copy and shell.
- Add no database, Supabase or external network access.

## Browser checks

Inspect `/demo/reports` at desktop, tablet and mobile widths. Confirm that:

- KPI sparklines render;
- Workload vs throughput shows bars, line, axes and grid;
- SLA health shows the donut;
- Backlog age shows stacked horizontal bars;
- Workflow completion shows the funnel;
- tooltips appear on hover;
- charts remain inside their panels;
- no horizontal page overflow is introduced.
