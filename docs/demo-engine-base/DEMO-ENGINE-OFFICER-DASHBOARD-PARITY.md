# FAIDIA Demo Engine Officer Dashboard Body Parity

## Document status

- Stage: D29R-3P density correction
- Route: `/demo/officer`
- Scope: Officer dashboard body only
- Internal shell: Protected and unchanged
- Route inventory: Unchanged at 14 pages
- Production Supabase access: Prohibited

## Purpose

This correction replaces the first D29R-3P body implementation with the supplied measured-density package.

The package controls typography, body offsets, KPI proportions, table density, panel geometry, activity rows, message rows, SLA chart dimensions and responsive transitions.

## Repository adaptation

The supplied package included a direct `app/demo/officer/page.tsx` body render. That file is not installed because this repository mounts `InternalAppShell` through `components/demo/officer/officer-dashboard.tsx`.

Replacing the route page would remove the shared sidebar and topbar.

The package is therefore adapted as follows:

- `InternalAppShell` remains mounted and unchanged;
- the new `OfficerDashboardBody` replaces only body content;
- CSS compensates for the existing shell content gutter;
- the supplied body dimensions remain intact;
- fixture links are mapped to the existing 14-route Demo Engine;
- no Officer queue, message, handoff or SLA routes are invented.

## Exact desktop contract

At the canonical `1672 × 941` viewport:

- body padding: `12px 20px 32px 38px`;
- greeting: `24px / 30px`;
- subtitle: `13px / 20px`;
- KPI height: `116px`;
- KPI icon: `48 × 48px`;
- KPI label: `12px / 16px`;
- KPI value: `22px / 28px`;
- KPI columns: `1.12fr 1fr 1.02fr 0.99fr 0.99fr 0.92fr`;
- KPI gap: `16px`;
- main grid: `3fr / 2fr`;
- main gap: `24px`;
- panel radius: `10px`;
- panel header: `50px`;
- queue header: `30px`;
- queue row: `55px`;
- queue footer: `38px`;
- handoff row: `52px`;
- message row: `44px`;
- compact controls: `32px`;
- SLA donut: `128 × 128px`.

## Superseded interim components

The first D29R-3P implementation created a temporary shared internal-body component tree. The measured replacement is self-contained and no longer imports that tree.

The superseded files are removed to avoid dead presentation code and conflicting dimensions.

## Route safety

Visible reference IDs remain unchanged, but click targets use existing synthetic request IDs and current Demo Engine destinations.

The route count remains exactly 14.

## Definition of done

The correction is complete when:

- shell files remain unchanged;
- the direct uploaded route page is not installed;
- the supplied measured body, model, fixture, adapter and donut are installed;
- the shell gutter is neutralised only inside the Officer body;
- all six KPI labels remain on one line at `1672 × 941`;
- five queue rows remain visible;
- five handoff rows remain visible;
- three message rows remain visible;
- SLA and workload remain visible in the first screen;
- there is no page-level horizontal overflow;
- fixture interactions use existing routes;
- TypeScript, lint, tests, build and parity verification pass;
- visual approval occurs before D29R-4.
