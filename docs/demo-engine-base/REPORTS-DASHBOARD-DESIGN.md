# FAIDIA Reports & Insights — Design and Build Specification

## 1. Purpose

This page is a supervisor control surface for a technical college. It should
answer three questions without requiring the supervisor to inspect raw queues:

1. What requires intervention now?
2. Where is work accumulating or ageing?
3. Which workflow stage or department is causing the delay?

It is not a generic analytics page. Student grades, attendance, finance totals,
website traffic and ornamental “engagement” metrics do not belong here.

## 2. Scope

The kit implements only the reports body. It does not change:

- the officer/supervisor sidebar;
- the application top bar;
- account or notification controls;
- global font loading;
- shared shell spacing;
- `app/globals.css`.

The supplied demo route is `/demo/reports`. Move or re-export it from the final
supervisor route after visual calibration.

## 3. Page anatomy

| Zone | Purpose | Implementation |
| --- | --- | --- |
| Page header | Title, reporting context, filters and export | Native selects + print button |
| KPI band | Current operational state | Four compact cards + Recharts `LineChart` sparklines |
| Workload vs throughput | Compare intake, output and weekly capacity | Recharts `ComposedChart` |
| SLA health | Show risk mix and departmental compliance | Recharts `PieChart` + accessible progress bars |
| Backlog age | Show where requests are ageing | Recharts horizontal stacked `BarChart` |
| Workflow completion | Show retained volume and stage loss | Recharts `FunnelChart` + semantic HTML table |
| Insight banners | Explain what the chart means | Contextual info/warning/danger banners |
| Needs attention | Convert analysis into supervisor actions | Three action cards |

The annotated map is in `assets/recharts-build-map.png`.

## 4. Desktop layout

Target canvas: approximately `1536 × 1024`.

| Token | Value |
| --- | ---: |
| Page padding | 22px |
| Main grid gap | 14px |
| Header bottom gap | 18px |
| KPI columns | 4 equal columns |
| KPI minimum height | 90px |
| Chart columns | 2 equal columns |
| Panel radius | 11px |
| Panel border | 1px |
| Primary chart minimum height | 338px |
| Secondary chart minimum height | 276px |
| Panel internal padding | 14–15px |
| Filter height | 40px |

The page should feel dense but not cramped. The original page failed because
cards were extremely tall while the actual chart region was empty. Here, card
height follows information density.

## 5. Visual tokens

The CSS Module defines local tokens so the page remains isolated.

| Role | Value |
| --- | --- |
| Page background | `#F7F9FC` |
| Panel background | `#FFFFFF` |
| Primary ink | `#10234A` |
| Muted ink | `#667694` |
| Border | `#DCE4EF` |
| Blue / submitted | `#1769FF` |
| Teal / completed | `#08A99C` |
| Green / healthy | `#079B73` |
| Amber / due soon | `#FF9F0A` |
| Coral / overdue | `#FF4753` |
| Panel shadow | `0 1px 2px rgb(16 35 74 / 4%), 0 8px 28px rgb(16 35 74 / 3%)` |

Typography inherits the existing Plus Jakarta Sans variable when available:

```css
font-family:
  var(--font-plus-jakarta),
  "Plus Jakarta Sans",
  Inter,
  ui-sans-serif,
  system-ui,
  sans-serif;
```

The body therefore matches the FAIDIA shell without loading a second font.

## 6. Typography

| Element | Size | Weight |
| --- | ---: | ---: |
| Page title | 24–31px responsive | 700 |
| Page subtitle | 13px | 450 |
| Card title | 14px | 700 |
| KPI label | 11px | 600 |
| KPI value | 25px | 700 |
| Chart axis / legend | 8–11px | 500–600 |
| Insight banner | 10px | 520 |
| Action title | 12px | 700 |

Avoid increasing all labels to 14–16px. The compact chart typography is part of
the reference proportions.

## 7. Recharts configuration

### 7.1 KPI sparklines

- `LineChart`
- no axis, grid, dots or tooltip
- 2px stroke
- `monotone` interpolation
- 43px chart height
- each metric uses its semantic tone

### 7.2 Workload vs throughput

- `ComposedChart`
- blue `Bar` = submitted
- teal `Line` = completed
- dashed `ReferenceLine` at capacity `80`
- horizontal `CartesianGrid` only
- custom two-line week tick
- custom tooltip calculates `submitted − completed`
- domain `0–100`

The chart should expose a backlog gap, not merely show two unrelated series.

### 7.3 SLA health

- `PieChart` with `innerRadius=57`, `outerRadius=92`
- clockwise 360° donut
- semantic colors: on track, due soon, overdue
- a positioned HTML centre label to keep `74%` crisp
- department progress bars use semantic HTML with `role="progressbar"`

Do not use three separate gauge charts. The donut shows composition; the bars
show departmental comparison.

### 7.4 Backlog age

- `BarChart layout="vertical"`
- three bars with `stackId="age"`
- category Y axis and numeric X axis
- segment labels appear inside the bars
- the total appears to the right of the final segment

The implementation data reconciles:

| Department | 0–2 days | 3–5 days | 6+ days | Total |
| --- | ---: | ---: | ---: | ---: |
| Student Records | 16 | 10 | 5 | 31 |
| Finance | 14 | 11 | 9 | 34 |
| Registrar | 11 | 7 | 3 | 21 |
| **Total** | **41** | **28** | **17** | **86** |

### 7.5 Workflow completion

- `FunnelChart`
- one `Cell` color per stage
- Finance check has an amber outline
- white request count labels
- adjacent semantic table shows counts and retention

The table is not redundant. It gives exact values and remains understandable
when the funnel geometry becomes narrow.

## 8. Insight writing rules

Every insight must contain one of the following:

- a risk;
- a cause;
- an operational comparison;
- a recommended action.

Good:

> Finance has 5 of 9 overdue requests.

Bad:

> SLA performance is displayed above.

The “Needs attention” cards use: affected queue/service → concrete evidence →
next action. Keep them to two short lines plus one action.

## 9. Data model for the real page

The bundled data is seeded in `report-data.ts`. Replace it with one
server-generated aggregate object; do not execute one browser request per card.

Recommended server payload:

```ts
type ReportsSnapshot = {
  period: {
    from: string;
    to: string;
    label: string;
  };
  kpis: {
    open: number;
    dueWithin48Hours: number;
    overdue: number;
    medianTurnaroundDays: number;
  };
  workload: Array<{
    period: string;
    submitted: number;
    completed: number;
    capacity: number;
  }>;
  sla: {
    onTrack: number;
    dueSoon: number;
    overdue: number;
    byDepartment: Array<{ department: string; onTrackPercent: number }>;
  };
  backlogAge: Array<{
    department: string;
    zeroToTwoDays: number;
    threeToFiveDays: number;
    sixPlusDays: number;
  }>;
  workflow: Array<{
    stage: string;
    requests: number;
    retainedPercent: number;
  }>;
  attention: Array<{
    title: string;
    evidence: string;
    actionLabel: string;
    href: string;
    severity: "info" | "warning" | "danger";
  }>;
};
```

Aggregate on the server from request timestamps, status history, assignments and
handoff events. Keep the chart component client-side, but pass it a prepared
snapshot from the server page.

## 10. Responsive behaviour

### 1180px and below

- KPI band becomes 2 columns.
- SLA content stacks donut over department bars.
- workflow funnel stacks over the table.

### 900px and below

- header filters wrap below the title;
- all chart grids become one column;
- attention cards become one column.

### 620px and below

- page padding becomes 12px;
- KPI cards become one column;
- each filter becomes full width;
- chart heights increase slightly to protect labels.

Do not attempt to keep the entire desktop mosaic on mobile. It produces
unreadable axes.

## 11. Accessibility

- Every chart wrapper has a concise `aria-label`.
- Department SLA bars use native progress semantics.
- filter labels are available to screen readers.
- focus rings are visible.
- color is reinforced by labels and exact values.
- the workflow table provides a non-visual exact-value fallback.
- print/export hides controls and removes shadows.

## 12. Integration sequence

1. Install the kit on a clean reports branch.
2. Open `/demo/reports`.
3. Compare the body against the reference at `1536 × 1024`.
4. Adjust only the shell’s content inset if needed.
5. Replace seed data with a server snapshot.
6. Wire filter values to query parameters or a server action.
7. Replace placeholder action buttons with route links.
8. Move the route into the supervisor shell.
9. Run lint, type checking and the project test suite.
10. Capture desktop, tablet and mobile screenshots before freezing the stage.

## 13. Acceptance checklist

- [ ] Shell code is unchanged.
- [ ] `recharts` and `lucide-react` resolve.
- [ ] Four KPIs render in one row at desktop width.
- [ ] Two main charts render side by side at desktop width.
- [ ] Backlog totals equal the open-request KPI.
- [ ] Tooltips show exact values and units.
- [ ] SLA colors are used consistently.
- [ ] Insight copy identifies a cause, risk or action.
- [ ] No chart has a large empty body.
- [ ] The page stacks cleanly below 900px.
- [ ] Keyboard focus is visible.
- [ ] Printing hides filter controls.
