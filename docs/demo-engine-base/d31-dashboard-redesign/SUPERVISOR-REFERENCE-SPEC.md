# D31 Supervisor Dashboard Reference Specification

## Authority

```text
public/demo/references/dashboards/supervisor-dashboard.png
```

Canvas:

```text
864 × 1821
```

## Shell decision

The reference contains a shell concept, but implementation must retain the
existing shared Officer/Supervisor operational shell.

The body begins with:

```text
Good afternoon, Grace
Records Department • Supervisor
```

## Page model

The Supervisor dashboard is one continuous route:

```text
/demo/supervisor
```

Zones remain vertically stacked on the same page.

## Zone 1 — Department health

Modules:

- six-metric department health strip;
- Approval lane;
- Critical attention;
- Unassigned work.

Metrics:

```text
Open requests
Unassigned
Due today
Overdue
Pending approvals
SLA on time
```

The Approval lane is the dominant left table. Critical attention and Unassigned
work form the right rail.

## Zone 2 — Work distribution and control

Top row:

- Officer workload and capacity;
- Assignment centre;
- Department work queue.

Second row:

- Handoff control;
- Escalations and exceptions;
- Document and payment exceptions.

Primary visual forms:

- Officer utilisation progress bars;
- compact assignment recommendations;
- compact queue table;
- handoff rows;
- exception lists with semantic actions.

## Zone 3 — Department performance

Top row:

- Service flow performance;
- SLA trend.

Lower row:

- Officer performance;
- Service performance;
- Department throughput;
- Applicant experience;
- Performance insights.

Chart types:

- service-stage flow;
- line chart;
- compact bar chart;
- horizontal performance bars;
- CSAT distribution.

## Zone 4 — Oversight and governance

Top row:

- Recent decisions;
- Department activity;
- Audit highlights.

Bottom row:

- Team notifications;
- Reports and exports.

## Interaction contract

- Approve opens the Supervisor approval workspace;
- Assign updates or simulates assignment state;
- Review opens the relevant request, handoff or exception;
- queue tabs and filters alter displayed data;
- performance period controls alter chart data;
- audit links open the audit trail;
- report cards route to department-scoped reporting.

## Scroll behaviour

- one route;
- normal document flow;
- no fixed-height zone viewport;
- optional zone anchors;
- optional active-zone indication using `IntersectionObserver`;
- no separate route per zone.

## Fidelity constraints

- preserve compact density;
- use measured chart wrappers;
- keep the dominant tables wider than right rails;
- retain the visible Zone 1 through Zone 4 order;
- do not copy the generated reference shell independently.
