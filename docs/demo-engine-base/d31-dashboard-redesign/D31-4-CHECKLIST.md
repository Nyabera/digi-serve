# D31-4 — Build Shared Dashboard Primitives

## Components

- [x] DashboardCard exists
- [x] DashboardGrid exists
- [x] DashboardGridItem exists
- [x] DashboardZone exists
- [x] DashboardSectionHeading exists
- [x] DashboardMetricStrip exists
- [x] DashboardMetric exists
- [x] DashboardStatusBadge exists
- [x] DashboardProgress exists
- [x] typed DashboardTable exists
- [x] measured DashboardChartFrame exists
- [x] accessible DashboardTabs exists
- [x] primitive barrel exports exist
- [x] shared dashboard index exports primitives

## Layout and visual rules

- [x] cards use shared D31 tokens
- [x] grid uses `minmax(0, 1fr)`
- [x] grid children use `min-width: 0`
- [x] zones remain in normal document flow
- [x] compact metric-strip breakpoints exist
- [x] tables scroll horizontally
- [x] chart frames accept numeric measured dimensions
- [x] square aspect ratios are supported
- [x] tabs support horizontal overflow
- [x] 44px tab touch targets exist
- [x] reduced-motion handling exists

## Accessibility

- [x] progress uses progressbar semantics
- [x] tables use semantic elements
- [x] table scroll area is keyboard focusable
- [x] tabs use tablist, tab, and tabpanel roles
- [x] tabs support arrow, Home, and End keys
- [x] status badges retain visible text
- [x] zone and section headings are semantic

## Boundaries

- [x] primitives contain no route ownership
- [x] primitives contain no shell ownership
- [x] primitives contain no TVET Pack imports
- [x] primitive CSS contains no global `:root`
- [x] primitive CSS contains no CSS zoom
- [x] primitive CSS contains no transform scaling
- [x] primitive CSS contains no screenshot backgrounds
- [x] primitive documentation exists

## Engineering gate

- [x] D31-2 shell verifier still passes
- [x] D31-3 token verifier still passes
- [x] D31-4 primitive verifier passes
- [x] Demo Pack validation passes
- [x] TypeScript passes
- [x] lint passes
- [x] tests pass
- [x] production build passes
- [x] Git whitespace validation passes
- [ ] D31-4 primitive commit created
- [ ] D31-4 checklist completion commit created
