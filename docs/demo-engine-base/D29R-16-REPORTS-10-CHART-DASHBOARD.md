# D29R-16 — Ten-chart operational reports dashboard

## Scope

D29R-16 expands the Savannah Technical College Reports page from four primary reports to ten operational reports using seeded demonstration data.

## Included reports

1. Workload vs throughput — composed bars and lines
2. SLA health — donut and departmental progress
3. Backlog age by department — horizontal stacked bars
4. Workflow completion — funnel
5. Turnaround-time trend — multi-line trend against SLA
6. Requests by service — ranked horizontal bars
7. Department handoff delays — heatmap
8. Officer workload and productivity — bubble scatter
9. Request outcomes — 100% stacked bars
10. Demand pattern — calendar heatmap

## Interaction changes

- Every report title has a functioning information button.
- Each information panel explains the chart in one sentence.
- Every report includes three concise operational takeaways.
- A layout selector switches between a modular Mosaic board and a strict 3 × 1 chart grid.
- The Mosaic board uses 3 cards in row one, 2 in row two, 2 in row three and 3 in row four before responsive collapse.
- Export report opens the browser print workflow.

## Visual system

Charts use a restrained Google Material palette:

- Indigo 400: `#5C6BC0`
- Blue 400: `#42A5F5`
- Teal 400: `#26A69A`
- Green 400: `#66BB6A`
- Amber 600: `#FFB300`
- Red 400: `#EF5350`
- Blue Grey 400: `#78909C`
- Blue Grey 200: `#B0BEC5`

Axis, label and legend typography is deliberately reduced to prevent clipping in the three-column layout.

## Rendering contract

All Recharts roots use the D29R-15 measured-host pattern. `ResizeObserver` measures each local chart slot and passes pixel dimensions directly to the chart root. Reports does not use `ResponsiveContainer`.

## Data boundary

All values are coherent seeded demo data. This stage adds no Supabase, production database or network access.
