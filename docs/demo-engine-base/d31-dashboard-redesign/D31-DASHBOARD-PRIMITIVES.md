# D31 Shared Dashboard Primitives

## Purpose

D31-4 establishes the reusable visual building blocks used by the Officer,
Supervisor, and Admin dashboard reconstructions.

The primitives consume the scoped token system created in D31-3. They do not
own routes, shells, navigation, Demo Pack data, or business-state transitions.

## Source structure

```text
features/demo-engine/dashboards/shared/components/
├── dashboard-card.tsx
├── dashboard-chart-frame.tsx
├── dashboard-grid.tsx
├── dashboard-metric.tsx
├── dashboard-primitives.module.css
├── dashboard-primitives.types.ts
├── dashboard-progress.tsx
├── dashboard-section-heading.tsx
├── dashboard-status-badge.tsx
├── dashboard-table.tsx
├── dashboard-tabs.tsx
├── dashboard-zone.tsx
└── index.ts
```

## Card

`DashboardCard` provides the shared bordered surface.

Variants:

```text
default
muted
emphasis
inverse
```

Padding:

```text
none
compact
default
```

Cards do not become clickable containers. Interactive content must use semantic
buttons or links inside the card.

## Grid

`DashboardGrid` and `DashboardGridItem` implement the 12-column layout.

The grid always uses:

```text
minmax(0, 1fr)
min-width: 0
```

At compact widths, dashboard items become full-width rather than being
artificially scaled.

## Zone

`DashboardZone` renders:

- optional Zone number;
- semantic heading;
- optional description;
- optional action;
- normal-flow zone content.

Supervisor and Admin dashboards use this primitive for long scrolling zones.

## Metric

`DashboardMetricStrip` and `DashboardMetric` support:

- connected metric groups;
- circular icon containers;
- large values;
- labels;
- deltas;
- optional progress;
- semantic tones.

## Status

`DashboardStatusBadge` provides compact, semantic status labels.

Tones:

```text
neutral
primary
success
warning
danger
purple
teal
```

Colour must not be the only status indicator; visible text remains mandatory.

## Progress

`DashboardProgress` provides a semantic `role="progressbar"` implementation with
optional label and percentage.

Values are clamped to the supplied range.

## Table

`DashboardTable<Row>` provides:

- typed column definitions;
- semantic `table`, `thead`, `tbody`, `th`, and `td`;
- row-key ownership;
- optional caption;
- empty state;
- horizontal scrolling;
- explicit minimum width;
- left, center, and right alignment.

Interactive row actions remain ordinary links or buttons rendered by a column.

## Chart frame

`DashboardChartFrame` provides:

- chart title;
- optional description;
- optional action;
- separate legend area;
- measured numeric plot dimensions;
- minimum height;
- optional aspect ratio.

The measurement implementation uses a callback ref, `ResizeObserver`, and React state. Measurements update from callbacks rather than from an effect, and render reads only state-backed numeric dimensions.

Recharts components should consume the numeric `width` and `height` supplied by
the render function.

Square rings and donuts should use:

```text
aspectRatio="1 / 1"
```

## Tabs

`DashboardTabs` provides:

- controlled or uncontrolled selection;
- optional counts;
- disabled tabs;
- `tablist`, `tab`, and `tabpanel` semantics;
- Arrow Left and Arrow Right navigation;
- Home and End navigation;
- 44px minimum touch target;
- horizontal overflow at narrow widths.

## Boundary rules

The shared primitives may not:

- import Savannah or TVET fixtures;
- import a Demo Pack directly;
- mount route layouts;
- mount sidebars;
- mount top bars;
- mount role selectors;
- use CSS zoom;
- use `transform: scale`;
- use dashboard reference images as backgrounds.
