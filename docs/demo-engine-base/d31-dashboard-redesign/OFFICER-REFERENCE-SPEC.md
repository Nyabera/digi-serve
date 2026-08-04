# D31 Officer Dashboard Reference Specification

## Authority

```text
public/demo/references/dashboards/officer-dashboard.png
```

Canvas:

```text
1568 × 1003
```

## Shell decision

This image is a dashboard-body specification. It must render inside the current
Officer operational shell.

Do not copy or invent another sidebar, top bar, role selector or page wrapper.

## Page introduction

Exact visible hierarchy:

```text
Good afternoon, Grace
Officer dashboard • Thursday, May 8, 2026
```

The heading is large, heavy and tightly tracked. The metadata line is compact
and muted.

## Module order

1. Workload pulse
2. Case signals
3. Today's work plan
4. Recent handoffs
5. Recent Activity
6. Up Next
7. Action Required
8. My rhythm

## Workload pulse

Four connected metrics:

| Metric | Value | Accent |
| --- | ---: | --- |
| Assigned | 18 | Blue |
| Due today | 7 | Orange |
| Overdue | 3 | Red |
| SLA on time | 92% | Green |

The metrics share one card and are separated by vertical dividers. Each metric
contains a circular icon, large value, label and short coloured progress line.

## Case signals

Tabs:

```text
Messages
Assignments
Notices
Case Updates
```

Additional action:

```text
Mark all read
```

Visible rows combine:

- applicant or department identity;
- unread or handoff badge;
- short message;
- service and request reference;
- timestamp;
- contextual action.

## Today's work plan

Tabs:

```text
Needs action
Waiting on others
Ready to complete
```

Visible columns:

```text
Service
Applicant
Request ID
Next action
Stage
SLA
Status
Action
```

Rows use a slim semantic accent line and service icon. SLA is represented with
a short progress line and compact due label.

## Recent handoffs

Compact three-row list:

- From Admissions Office
- To Finance Office
- Completed to Applicant

## Lower row

Four equal operational panels:

- Recent Activity
- Up Next
- Action Required
- My rhythm

The rhythm panel combines a two-series line chart with a square 92% SLA ring.

## Chart types

- two-series line chart;
- donut or radial SLA ring.

## Interaction contract

- work-plan tabs filter visible rows;
- case-signal tabs switch datasets;
- Review and Check open the request workspace;
- reply actions open or simulate messaging;
- handoff actions open handoff details;
- action-required rows open filtered operational queues;
- date-period control changes chart data;
- View details opens Officer SLA details.

## Fidelity constraints

- use a 12-column CSS grid;
- keep every grid child at `min-width: 0`;
- do not use absolute positioning for the main layout;
- do not use CSS zoom or `transform: scale`;
- do not place the reference image behind the UI;
- do not allow the SLA ring to stretch into an oval;
- tables may scroll horizontally below supported widths.
