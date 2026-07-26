# D29R-17 — Reports plot-height correction

## Root cause

The ten-chart Mosaic update retained the measured Recharts wrapper but changed
the chart host sizing. `.plot` and `.plotTall` used `flex: 1`, which sets a
zero flex-basis. Their parent card had only a minimum height, creating an
indefinite flex-size cycle. The measured host could therefore remain zero
pixels high, so the wrapper correctly chose not to mount the Recharts SVG.

The KPI sparklines and SLA donut remained visible because those hosts already
had explicit measurable heights. The HTML/CSS heatmaps also did not depend on
Recharts measurement.

## Correction

- Standard plots use a concrete 232px height and flex basis.
- Tall plots use a concrete 266px height and flex basis.
- Three-column variants use concrete 210px and 238px heights.
- Existing ResizeObserver-based Recharts measurement remains unchanged.
- Key Takeaways explicitly uses Plus Jakarta Sans.
- Layout, Mosaic ordering, data, chart types and route structure are unchanged.
