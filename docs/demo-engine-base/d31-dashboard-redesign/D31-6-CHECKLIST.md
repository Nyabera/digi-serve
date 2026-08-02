# D31-6 — Reconstruct and Wire the Officer Dashboard

## Route and data

- [x] `/demo/officer` remains the Officer dashboard route
- [x] route loads the active Demo Pack
- [x] route uses `adaptOfficerDashboard`
- [x] route validates the Officer dashboard model
- [x] route contains no dashboard markup beyond body mounting
- [x] Officer body consumes only `OfficerDashboardData`

## Reference composition

- [x] compact greeting exists
- [x] Workload pulse exists
- [x] Today's work plan exists
- [x] Case signals exists
- [x] Recent handoffs exists
- [x] Recent Activity exists
- [x] Up Next exists
- [x] Action Required exists
- [x] My rhythm exists
- [x] left and right stacks follow the reference
- [x] four-card lower row exists

## Shared system

- [x] D31 dashboard theme is applied
- [x] role attribute is `officer`
- [x] shared card primitive is used
- [x] shared metric primitive is used
- [x] shared table primitive is used
- [x] shared status primitive is used
- [x] shared progress primitive is used
- [x] shared chart frame is used
- [x] shared tabs primitive is used

## Interaction and accessibility

- [x] work-plan tabs change visible content
- [x] case-signal tabs change visible content
- [x] request actions use links
- [x] handoff actions use links
- [x] action-required rows use links
- [x] tables have accessible names
- [x] progress bars retain semantics
- [x] charts expose visible text labels
- [x] one page-level `h1` exists
- [x] major panels use `h2`
- [x] narrow tables scroll instead of squeezing
- [x] mobile layouts reflow instead of scaling

## Boundaries

- [x] no operational shell file is edited
- [x] no route layout is edited
- [x] no TVET fixture is imported by Officer JSX
- [x] no raw Demo Pack record is read by Officer JSX
- [x] no global `:root` token is added
- [x] no CSS zoom is used
- [x] no screenshot background is used
- [x] no `ResponsiveContainer` is used
- [x] Officer reconstruction documentation exists

## Engineering gate

- [x] D31-2 shell verifier still passes
- [x] D31-3 token verifier still passes
- [x] D31-4 primitive verifier still passes
- [x] D31-5 data verifier still passes
- [x] D31-6 Officer verifier passes
- [x] Demo Pack validation passes
- [x] TypeScript passes
- [x] lint passes
- [x] tests pass
- [x] production build passes
- [x] Git whitespace validation passes
- [x] D31-6 Officer commit created
- [x] D31-6 checklist completion commit created
