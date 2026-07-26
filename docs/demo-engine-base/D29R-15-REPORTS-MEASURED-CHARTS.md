# D29R-15 — Reports measured-chart repair

## Root cause

All non-Recharts content rendered, while every SVG chart remained blank. The
previous repair retained Recharts ResponsiveContainer and introduced a
hydration snapshot. That still depended on percentage sizing inside the shared
Demo shell and could leave the chart at the placeholder/unmeasured stage.

## Correction

Reports no longer uses ResponsiveContainer. Each existing chart slot is
measured with ResizeObserver and `getBoundingClientRect()`. The measured numeric
width and height are passed directly to LineChart, ComposedChart, PieChart,
BarChart and FunnelChart. Existing data, layout, panel heights, filters and
responsive rules remain unchanged.
