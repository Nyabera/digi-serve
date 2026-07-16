# FAIDIA Stage 1 — Reporting Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** AC-REP-01–05 and Stage 0 `V1-VERTICAL-SLICE.md` Section 11

## 1. Thesis

Stage 1 reporting is server-calculated operational visibility from durable timestamps and facts. It is not a custom report builder, data warehouse or sensitive request browser for Organization Admin.

## 2. Metric definitions

| Metric | Exact calculation |
|---|---|
| time to first action | first recorded review action − submitted_at |
| correction response time | correction resubmitted_at − correction requested_at, per correction |
| referral acceptance time | accepted_at − handoff created_at |
| referral completion time | completed_at − accepted_at |
| approval waiting time | decision created_at − approval work created_at |
| outcome-ready time | outcome available_at − approval decision_at |
| end-to-end time | first completion completed_at − submitted_at |
| handoff count | count of non-cancelled handoffs for request/period |
| correction count | count of correction records |
| current owner | request current owner department fact |
| overdue state | derived active SLA state at query `as_of` |
| completion method | immutable completion method enum |
| reopened count | count of reopening records |
| manual closure count | count of manual-closure completion records |

Durations exclude incomplete records from completion averages and expose an incomplete count. Median and percentile metrics are not required for Stage 1. Every response identifies `as_of`, timezone, filters and denominator.

## 3. Required projections

- Officer: assigned, due today, overdue, waiting on Finance and recently completed within permitted scope.
- Supervisor: real department backlog, unassigned work, stage duration and pending Finance handoffs.
- Organization Admin: organization/service/department aggregates only, with no applicant, document, message, note or handoff-detail payload.

## 4. Authorization

Report queries begin from the same authorized relation as direct record access. Counts cannot be calculated globally and filtered afterwards. Organization and department filters are mandatory server inputs resolved from actor context, not trusted client values.

## 5. Presentation

Charts use Recharts only, real server aggregates, accessible text/table equivalents, readable labels and non-color-only status. Empty sets render an honest empty state; never seed or hard-code production-looking totals in application queries.

## 6. Exclusions

No report export, saved views, officer ranking, advanced SLA heatmap, arbitrary dimensions or standalone organization report route is Stage 1 required. Permission names reserved for later scope do not create a route.

## 7. Decision required

`S1-DEC-039` must approve the precise metric denominators and aggregate privacy boundary.

