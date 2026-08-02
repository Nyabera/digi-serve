# D31-10 — Admin Dashboard Reconstruction

## Outcome

D31-10 reconstructs the body of:

```text
/demo/admin
```

The existing Admin shell remains responsible for administrator navigation and
application chrome. The production dashboard therefore uses the supplied
bundle's embedded composition and does not render its standalone navy sidebar.

## Supplied runnable bundle

The complete supplied bundle is archived under:

```text
docs/demo-engine-base/d31-dashboard-redesign/
└── admin-reference-source/
```

The archived source includes the original React component, CSS, typed data,
integration examples, implementation specification, desktop design reference,
desktop implementation preview and mobile preview.

The archived `.tsx`, `.ts` and `.css` sources use `.txt` suffixes where needed
so they cannot enter the production TypeScript or CSS compilation graph.

## Production files

```text
app/demo/admin/
├── admin-dashboard-reference.css
└── page.tsx

features/demo-engine/dashboards/admin/
├── admin-dashboard.reference-contract.ts
├── index.ts
└── high-fidelity/
    ├── AdminDashboardHighFidelity.tsx
    ├── admin-dashboard-reference-data.ts
    └── index.ts
```

## Data flow

```text
getActiveDemoPack()
        ↓
adaptAdminDashboard()
        ↓
validateAdminDashboardData()
        ↓
buildAdminDashboardReferenceData()
        ↓
AdminDashboardHighFidelity
```

The bridge uses the typed D31-5 Admin adapter as the route boundary. When the
adapter exposes the supplied reference fields directly, those values are used.
Otherwise the exact supplied demo figures remain the visual fallback while
institution identity and executive summary are taken from the active Demo Pack
when available.

## Zone composition

The reference intentionally uses Zones 1, 2, 3 and 5.

### Zone 1 — Institution-wide health

- Organization overview and executive brief
- Six institution metrics
- Service Delivery Trend
- Institutional Alerts
- Department Performance Comparison

### Zone 2 — Operational visibility

- Institution-wide SLA Monitor
- Requests by Status
- Requests by Service
- Department capacity heatmap
- Workflow Bottlenecks
- Handoff Network
- Approvals and Escalations

### Zone 3 — Financial and document control

- Payment Overview
- Document Operations
- Certificate and Verification Activity
- Renewals and Expiries

### Zone 5 — Governance and institutional insight

- Audit and Compliance Risk Feed
- Applicant Experience Funnel
- Platform Adoption
- External Coordination Leakage
- Institutional Outcomes
- System Health
- Recent Administrative Activity
- Scheduled Reports

## High-fidelity rules

- Plus Jakarta Sans headings and Inter interface text
- body-only integration inside the existing Admin shell
- no production reference sidebar
- no CSS zoom or scale transform
- no screenshot backgrounds
- responsive reflow at 1200px, 840px and 560px
- horizontally scrollable tables on narrow containers
- real Recharts charts
- working controls and status feedback

## Next stage

D31-11 performs Admin Playwright captures, supplied-reference overlays,
responsive verification and the Admin visual freeze.
