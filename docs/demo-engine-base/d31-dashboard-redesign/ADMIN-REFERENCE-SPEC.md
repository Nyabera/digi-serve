# D31 Admin Dashboard Reference Specification

## Authority

```text
public/demo/references/dashboards/admin-dashboard.png
```

Canvas:

```text
864 × 1821
```

## Shell decision

Admin uses the separate organization-admin shell.

The selected reference uses a dark navy institutional sidebar with:

```text
Dashboard
Requests
Departments
Services
Reports
Payments
Documents
Audit Log
```

D31-2 will reconcile this visual direction with the existing Admin navigation
without duplicating or removing working routes.

## Page model

The Admin dashboard is one continuous route:

```text
/demo/admin
```

## Zone 1 — Institution-wide health

Header:

```text
Institution-wide health
Organization overview
```

Modules:

- search and date controls;
- navy Executive brief;
- six institution metrics;
- Service Delivery Trend;
- Institutional Alerts;
- Department Performance Comparison.

Metrics:

```text
Submitted
Completed
Open
Completion rate
Avg turnaround
Overdue
```

Chart types:

- grouped bars with backlog line;
- progress-bar comparison table.

## Zone 2 — Operational visibility

Modules:

- Institution-wide SLA Monitor;
- Requests by Status;
- Requests by Service;
- Requests by Department capacity heatmap;
- Workflow Bottlenecks;
- Handoff Network;
- Approvals and Escalations.

Chart types:

- square SLA donut;
- horizontal bars;
- heatmap;
- average-duration bars;
- node-link handoff diagram;
- operational table.

## Zone 3 — Financial and document control

Modules:

- Payment Overview;
- Revenue by Service;
- Document Operations;
- top issued document types;
- Certificate and Verification Activity;
- Verification Trend;
- Renewals and Expiries.

Chart types:

- KPI groups;
- horizontal revenue bars;
- document-type bars;
- success-rate ring;
- verification line chart;
- horizontal date timeline.

## Zone 5 — Governance and institutional insight

The selected image intentionally skips Zone 4.

Modules:

- Audit and Compliance Risk Feed;
- Applicant Experience Funnel;
- Platform Adoption;
- External Coordination Leakage;
- Institutional Outcomes;
- System Health;
- Recent Administrative Activity;
- Scheduled Reports.

Chart types:

- funnel;
- time-series line chart;
- horizontal leakage bars;
- compact outcome comparisons;
- system-status indicators.

## Interaction contract

- department rows open institution-scoped department reports;
- alerts open filtered request views;
- workflow bottlenecks open workflow analytics;
- payment and document metrics open corresponding operations;
- verification activity opens the verification report;
- audit entries open the audit log;
- report switches update Demo state;
- scheduled-report links open Admin reporting.

## Fidelity constraints

- preserve the dark-sidebar visual identity;
- keep the body light and information dense;
- preserve Zone 1, Zone 2, Zone 3 and Zone 5 numbering;
- render charts as real components;
- do not use screenshot backgrounds;
- protect all donut and network proportions.
