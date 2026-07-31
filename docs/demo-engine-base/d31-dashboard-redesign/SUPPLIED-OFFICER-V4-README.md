# Officer Dashboard v4 — integration guide

This package recreates the supplied command-center reference as a functional, responsive React and TypeScript dashboard body.

## Files you need

- `components/OfficerDashboard.tsx` — dashboard data, components, interactions, and inline chart.
- `styles/officer-dashboard.css` — exact desktop geometry, container-aware shell layouts, and responsive states.
- `example/page.tsx`, `example/layout.tsx`, and `example/globals.css` — optional standalone Next.js example.
- `package-additions.json` — the two dependencies required by the component.
- `CUTOFF-DIAGNOSIS.md` — exact explanation of the shell integration failures and fixes.
- `SPACING-REFRESH-V3.md` — diagnosis and measurements for the wider, less crowded body refresh.
- `VISUAL-PARITY-V4.md` — Image 3 parity decisions and the alignment fixes in this release.
- `reference/officer-dashboard-v4-concept.png` — the approved visual target.

## Run this standalone package

```bash
npm install
npm run dev
```

## Add it to your existing Next.js App Router demo

1. Copy `OfficerDashboard.tsx` and `officer-dashboard.css` into the route or component folder you want to use.
2. Install the two dependencies:

   ```bash
   npm install lucide-react @fontsource-variable/plus-jakarta-sans @fontsource-variable/inter
   ```

3. Import the stylesheet and component in the target page:

   ```tsx
   import "./officer-dashboard.css";
   import OfficerDashboard from "./OfficerDashboard";

   export default function OfficerDashboardPage() {
     return <OfficerDashboard embedded />;
   }
   ```

## Connect it to your Demo Pack data

The arrays at the top of `OfficerDashboard.tsx` are the replaceable data layer:

- `workItems`
- `caseSignals`
- `handoffs`
- `activities`
- `upNext`
- `actions`
- `chartSeries`

Replace those arrays with typed props or your existing Demo Pack adapter. The visual components do not need to change.

## Existing shell integration

The component now defaults to `embedded={true}`. This is the correct mode for your existing fixed sidebar and slim topbar. It removes full-viewport height assumptions and makes every breakpoint react to the width of the dashboard content area—not the width of the whole browser window.

Use `embedded={false}` only when this dashboard is the entire standalone page.

The v4 dashboard is body-only. It does not render or modify the greeting, app sidebar, topbar, role selector, navigation, route state, demo reset, or persistence code. Its root remains container-aware, so shell width—not browser width—drives the responsive layout.

The table now uses a real `colgroup`; internal flex layouts sit inside normal table cells. This prevents the column drift seen when a `<td>` itself was changed to `display: flex`. Case signals no longer stretches a footer across unused vertical space, and the lower cards use explicit internal grids for repeatable alignment.

## Exact-layout notes

- The reference geometry is calibrated around the supplied 1536 × 1000 Image 3 concept.
- At 1320px of available dashboard width, spacing compresses without shrinking text.
- At 1080px of available dashboard width, the main and lower grids collapse safely.
- Below 760px, tables retain controlled horizontal scrolling instead of being squeezed.
- Interactive controls include work-plan filters, case actions, row menus, action buttons, chart periods, keyboard focus states, and status toasts.
- All button and select rules are scoped beneath `.officer-dashboard` to avoid shell leakage and unscoped-selector verification failures.
