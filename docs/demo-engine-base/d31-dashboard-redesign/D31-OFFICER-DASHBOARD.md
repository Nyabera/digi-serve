# D31-6 — Officer Dashboard Reconstruction

## Outcome

D31-6 replaces only the Officer dashboard body at:

```text
/demo/officer
```

The operational shell, sidebar, top bar, role selector, reset behaviour, route
layout and shell persistence remain owned by the D31-2 shell contract.

## Reference composition

The implementation follows the frozen Officer reference:

1. compact greeting;
2. left stack:
   - Workload pulse;
   - Today's work plan;
3. right stack:
   - Case signals;
   - Recent handoffs;
4. four-card lower row:
   - Recent Activity;
   - Up Next;
   - Action Required;
   - My rhythm.

The body uses the D31-3 role-scoped token system and the D31-4 shared dashboard
primitives.

## Source files

```text
features/demo-engine/dashboards/officer/
├── officer-case-signal-tabs.tsx
├── officer-dashboard.module.css
├── officer-dashboard.tsx
├── officer-rhythm-panel.tsx
├── officer-work-plan-tabs.tsx
└── index.ts
```

The route remains thin:

```text
app/demo/officer/page.tsx
```

It loads the active Demo Pack, runs `adaptOfficerDashboard()`, validates the
result and renders `OfficerDashboard`.

## Data boundary

The JSX consumes only `OfficerDashboardData`.

It does not import:

- TVET fixtures;
- the demo store;
- raw Demo Pack records;
- Drizzle records;
- Supabase records.

The active Demo Pack remains the source of names, requests, services,
departments, statuses and route references.

## Interactions

The following interactions are active:

- work-plan tabs;
- case-signal tabs;
- request review links;
- case-signal actions;
- handoff links;
- queue and document links;
- SLA detail link;
- rhythm period selector presentation.

No new route is invented when an existing Officer route is available.

## Layout contract

At the canonical Officer reference width:

- the main body uses a wide `1.85fr / 1fr` two-column composition;
- Workload pulse remains above Today's work plan;
- Case signals remains above Recent handoffs;
- the lower row uses four cards;
- work-plan tables use deliberate widths and horizontal overflow;
- circular SLA content is measured inside a square chart frame;
- all grid children use `min-width: 0`;
- the body contains no horizontal page scrollbar.

Below tablet width, the two main columns collapse to one. Lower cards move to
two columns, then one column on mobile.

## Accessibility

- exactly one page `h1`;
- every major panel has an `h2`;
- work-plan tables have accessible names;
- status includes visible text;
- charts retain textual titles and labels;
- progress bars use progress semantics;
- tabs support keyboard navigation;
- links remain semantic links;
- decorative icons are hidden from assistive technology.

## Protected files

D31-6 must not modify:

```text
components/demo/internal-shell/**
components/demo/workspace-shells/**
app/demo/officer/layout.tsx
app/demo/supervisor/layout.tsx
app/demo/admin/layout.tsx
```

The D31-2 verifier remains the authority for shell integrity.
