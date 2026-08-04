# FAIDIA Demo Engine Operational Reports

## Document status

- Stage: D25
- Status: Active
- Route: `/demo/reports`
- Chart library: Recharts
- Production Supabase access: Prohibited

## 1. Purpose

D25 replaces the reports placeholder with a focused operational dashboard.

The dashboard demonstrates how FAIDIA can show request volume, completion, backlog, workflow-stage movement, handoff state and departmental workload.

D25 does not implement the full reporting platform.

## 2. Reporting boundary

The D25 dashboard is limited to a controlled operational snapshot.

It does not implement:

- unrestricted custom reports;
- officer ranking;
- predictive analytics;
- a data warehouse;
- organization-wide executive BI;
- arbitrary exports;
- financial reporting;
- compliance reporting;
- cross-organization benchmarks.

## 3. Data behavior

The dashboard starts from a controlled synthetic reporting snapshot.

It overlays current browser-session evidence from:

- D7 timeline events;
- D21 referral state;
- D22 Finance completion state;
- D23 Registrar decision state;
- D24 issued-outcome state;
- synthetic request records already present in shared demo state.

No metric is presented as a production aggregate.

## 4. Dashboard metrics

D25 displays:

- requests submitted;
- requests completed;
- completion rate;
- open backlog;
- pending handoffs;
- approval rate;
- recorded activity-event count;
- controlled-outcome count.

## 5. Recharts visualizations

D25 includes:

- submitted-versus-completed area and line chart;
- workflow-stage horizontal bar chart;
- handoff-state donut chart;
- departmental open-versus-completed bar chart;
- average processing-time versus target chart;
- SLA attainment trend chart;
- service-demand mix chart;
- backlog-age profile chart.

Charts use the approved FAIDIA chart tokens, restrained gridlines, compact labels and responsive containers.

## 6. Filters

The dashboard includes controlled date-range and service filters.

The filters communicate reporting context without pretending that the Demo Engine has production aggregate queries.

Production filters, database aggregation and permission scoping remain separate work.

## 7. Navigation

The officer dashboard links to `/demo/reports`.

The reports dashboard links back to the officer and Finance workspaces.

## 8. State and security boundary

D25 reads browser-session demonstration state only.

It does not:

- query Supabase;
- write Supabase;
- expose production personal data;
- calculate staff league tables;
- export a report;
- schedule a report;
- create an audit report;
- change a request;
- change a handoff;
- change a decision;
- change an outcome.

## 9. D25 definition of done

D25 is complete when:

- the reports placeholder is replaced;
- Recharts is used;
- eight responsive charts render;
- operational KPI cards render;
- shared demo events influence the snapshot;
- handoff, decision and outcome states influence the snapshot;
- the officer dashboard links to reports;
- the reports page links to operational workspaces;
- chart styling follows the existing design system;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D25 verification passes;
- D25 is committed separately.
