# Savannah Technical College supervisor dashboard

This bundle rebuilds the supplied supervisor-dashboard concept as a real React, CSS, and TypeScript interface. It contains the exact four-zone information architecture and demo data from the reference, plus working filters, approval actions, navigation feedback, search, queue tabs, Recharts charts, report controls, and responsive states.

## Run the exact reference preview

```bash
npm install
npm run dev
```

The preview renders the Savannah sidebar and supervisor header so the page can be compared directly with `reference/supervisor-dashboard-design.png`.

## Integrate it into your existing demo

Your existing Officer/Supervisor shell should remain the source of truth. Copy these three implementation files into your app:

- `components/SupervisorDashboard.tsx`
- `data/supervisor-dashboard-data.ts`
- `styles/supervisor-dashboard.css`

Install the package additions:

```bash
npm install lucide-react recharts @fontsource-variable/inter @fontsource-variable/plus-jakarta-sans
```

Then keep the supervisor route thin:

```tsx
import SupervisorDashboard from "@/components/supervisor/SupervisorDashboard";
import "@/styles/supervisor-dashboard.css";

export default function SupervisorDashboardPage() {
  return <SupervisorDashboard embedded />;
}
```

`embedded` preserves your existing sidebar, topbar, routes, role switching, and demo state. Use `embedded={false}` only for the supplied standalone visual-parity preview.

## Data layer

All supplied reference content is centralized in `data/supervisor-dashboard-data.ts`:

- department-health metrics and approval rows;
- critical and unassigned queues;
- officer capacity and assignment recommendations;
- service queue, handoffs, escalations, and exceptions;
- flow stages, SLA trend, throughput, CSAT, rankings, and insights;
- decisions, department activity, audit highlights, notifications, and reports.

Replace this object with your existing demo selector/state adapter when wiring live demo behavior. The visual components do not need to change.

## Important integration boundary

The dashboard stylesheet is scoped below `.supervisor-dashboard`. It does not include bare `button`, `select`, `input`, `body`, `html`, `:root`, or universal selectors that can alter your existing application shell. The only page-level rules live in `src/preview.css`, and that file is for the standalone Vite preview only.

See `SUPERVISOR-DASHBOARD-SPEC.md` for the parity map and responsive behavior.
