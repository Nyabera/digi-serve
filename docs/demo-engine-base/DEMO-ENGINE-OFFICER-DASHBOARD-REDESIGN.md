# FAIDIA Demo Engine Officer Dashboard Redesign

## Document status

- Stage: D29R-3
- Status: Implemented
- Route: `/demo/officer`
- Scope: Officer dashboard and queue
- Route inventory: Unchanged at 14 pages
- Workflow behavior: Unchanged
- Production Supabase access: Prohibited

## 1. Purpose

D29R-3 replaces the former dark-header Officer page with the approved shared internal application shell.

The redesigned Officer workspace combines the D29R-1 shell and D29R-2 operational components.

The route now follows the dashboard and queue references rather than the former page-specific card layout.

## 2. Controlling references

The primary visual references are:

- `01-officer-dashboard.png`;
- `02-officer-queue.png`.

The implementation follows `app/globals.css` for visual tokens and does not copy the screenshot palette.

## 3. Shared shell integration

The Officer route now uses:

- `InternalAppShell`;
- Officer role navigation;
- configured institution identity;
- white sticky topbar;
- global search;
- compact request navigation;
- compact workspace navigation;
- presentation action;
- reset action;
- notifications;
- staff identity.

The legacy full-width Demo Control Bar remains mounted for D27 compatibility but is hidden when the D29R-3 Officer shell is present.

Presentation and reset continue through the D27 keyboard shortcuts.

## 4. Officer dashboard

The dashboard includes six operational metrics:

- Assigned to me;
- Due today;
- Overdue;
- Waiting on applicant;
- Waiting on department;
- Completed today.

## 5. Officer queue

The queue includes search, status filtering, sorting, a compact semantic table, request references, applicants, services, statuses, priorities, submission times, SLA labels, actions and pagination.

The mobile layout changes the table into compact request cards.

No new queue route is created. The queue remains part of `/demo/officer`.

## 6. Right operational rail

The right rail includes:

- recent handoffs;
- recent applicant messages;
- upcoming deadlines;
- department SLA summary.

## 7. Data behavior

D29R-3 reads the shared D7 browser-session state.

A view-model layer safely maps available synthetic request and handoff records into the redesigned interface.

Controlled fallback records keep the buyer demonstration populated when a browser session contains incomplete synthetic data.

The view model does not modify reducer state.

## 8. Responsive behavior

At wide desktop, six KPI cards form one row and the queue and right rail remain side by side.

At smaller widths the KPI cards reduce to three, two and one column. The right rail moves below the queue and the data table becomes request cards on mobile.

## 9. Accessibility

The redesigned route provides semantic table markup, an accessible table caption, scoped headers, labelled search and selectors, text status labels, priority labels, current-page navigation and keyboard-accessible actions.

## 10. Restrictions

D29R-3 does not modify D7 reducer behavior, D21 request review, D22 handoffs, D23 approval, D24 outcomes, D25 reports, route count or Supabase access.

## 11. D29R-3 definition of done

D29R-3 is complete when:

- `/demo/officer` uses `InternalAppShell`;
- the dark workspace header is removed;
- the legacy full-width control bar is hidden on the Officer route;
- six metric cards render;
- the Officer queue renders;
- search, filtering, sorting and pagination work;
- recent handoffs, messages, deadlines and SLA summary render;
- mobile request cards render;
- shared D7 state influences the page;
- the 14-route inventory remains exact;
- no workflow behavior changes;
- no Supabase dependency is introduced;
- type checking, linting and production build pass;
- D29R-3 verification passes;
- D29R-3 is committed separately.
