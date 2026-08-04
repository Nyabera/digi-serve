# D31 Dashboard Data Contracts and Demo Pack Adapters

## Purpose

D31-5 separates dashboard presentation from the active Demo Pack.

The Officer, Supervisor, and Admin dashboard components will receive typed,
role-specific view models. They will not read TVET fixtures directly and will
not inspect the raw Demo Pack inside JSX.

## Data flow

```text
Active Demo Pack
      ↓
createDashboardPackSnapshot()
      ↓
Role adapter
      ↓
Typed dashboard view model
      ↓
Dashboard components
```

## Source structure

```text
features/demo-engine/dashboards/data/
├── admin-dashboard.adapter.ts
├── admin-dashboard.types.ts
├── dashboard-adapter.utilities.ts
├── dashboard-data.shared.ts
├── dashboard-data.validation.ts
├── demo-pack-dashboard.snapshot.ts
├── officer-dashboard.adapter.ts
├── officer-dashboard.types.ts
├── supervisor-dashboard.adapter.ts
├── supervisor-dashboard.types.ts
└── index.ts
```

## Demo Pack snapshot

`createDashboardPackSnapshot(pack)` normalizes the sections required by the
dashboard layer:

- institution name;
- services;
- departments;
- users;
- requests;
- workflows;
- documents.

The snapshot accepts the typed `DemoPack`, then performs defensive runtime
normalization. Missing optional fields do not crash a dashboard route.

The snapshot is intentionally read-only.

## Officer contract

`OfficerDashboardData` contains:

- identity and greeting;
- workload pulse;
- three work-plan groups;
- four case-signal groups;
- recent handoffs;
- recent activity;
- up-next queue;
- action-required rows;
- seven-day rhythm and SLA result.

## Supervisor contract

`SupervisorDashboardData` contains the four reference zones:

1. Department health;
2. Work distribution and control;
3. Department performance;
4. Oversight and governance.

The contract includes approval rows, attention signals, Officer capacity,
assignment recommendations, queue aggregates, handoffs, exceptions, service
flow, SLA trends, performance rankings, throughput, CSAT, insights, audit
summaries, notifications, and report cards.

## Admin contract

`AdminDashboardData` contains the selected reference zones:

1. Institution-wide health;
2. Operational visibility;
3. Financial and document control;
5. Governance and institutional insight.

The contract includes institution metrics, executive brief, alerts, department
comparison, status and service distributions, capacity heatmap, bottlenecks,
handoff graph data, approvals, payments, documents, verification activity,
renewals, compliance risks, Applicant funnel, adoption, external coordination,
institutional outcomes, system health, activity, and scheduled reports.

## Adapter context

Every adapter accepts an optional `DashboardAdapterContext`:

```ts
{
  now?: string;
  institutionId?: string;
  departmentId?: string;
  officerId?: string;
  supervisorId?: string;
  adminId?: string;
}
```

The context makes role selection and screenshot dates deterministic.

## Determinism

Adapters must not use:

```text
Date.now()
Math.random()
crypto.randomUUID()
browser locale defaults
```

The default reference date is fixed. Explicit dates can be supplied through the
adapter context.

## Fallback rule

Fallback values preserve a stable demonstration when a vertical pack has sparse
data. Pack-provided IDs, names, statuses, services, departments, users,
requests, workflows, and documents always take priority.

Fallbacks belong in adapters, not dashboard JSX.

## Validation

The data layer includes lightweight structural validators for all three role
models. These validate required identity text and unique IDs in critical
collections.

## Boundaries

The data package may import:

- `DemoPack` types;
- other data-layer modules.

It may not import:

- React;
- Recharts;
- CSS Modules;
- route layouts;
- dashboard primitives;
- TVET fixture files;
- shell components.

This preserves the reusable vertical-cloning boundary.
