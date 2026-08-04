# D31-8 — Supervisor Dashboard Reconstruction

## Outcome

D31-8 replaces only the body of:

```text
/demo/supervisor
```

The Supervisor route continues to inherit the shared Officer/Supervisor
operational shell frozen in D31-2. The dashboard does not mount a sidebar,
topbar, role selector or demo controls.

## Data flow

```text
getActiveDemoPack()
        ↓
adaptSupervisorDashboard()
        ↓
validateSupervisorDashboardData()
        ↓
SupervisorDashboard
```

The page remains configuration-driven. TVET-specific records are not imported
inside the dashboard component.

## Four-zone composition

### Zone 1 — Department health

- six department-health metrics;
- Approval lane;
- Critical attention;
- Unassigned work.

### Zone 2 — Work distribution and control

- Officer workload and capacity;
- Assignment centre;
- Department work queue;
- Handoff control;
- Escalations and exceptions;
- Document and payment exceptions.

### Zone 3 — Department performance

- Service flow performance;
- SLA trend;
- Officer performance;
- Service performance;
- Department throughput;
- Applicant experience;
- Performance insights.

### Zone 4 — Oversight and governance

- Recent decisions;
- Department activity;
- Audit highlights;
- Team notifications;
- Reports and exports.

## Source files

```text
features/demo-engine/dashboards/supervisor/
├── index.ts
├── supervisor-dashboard-charts.tsx
├── supervisor-dashboard.module.css
└── supervisor-dashboard.tsx
```

The charts are isolated in one client leaf. The main dashboard remains a Server
Component.

## Visual rule

D31-8 reconstructs the Supervisor dashboard. It does not freeze screenshots.
D31-9 will perform the Supervisor overlay, responsive screenshots and visual
regression freeze.

## Protected boundaries

D31-8 does not edit:

- the Officer dashboard;
- the Officer visual baseline;
- the shared operational shell;
- shell navigation;
- the Admin shell;
- the active Demo Pack;
- dashboard data adapters;
- shared primitive implementation.
