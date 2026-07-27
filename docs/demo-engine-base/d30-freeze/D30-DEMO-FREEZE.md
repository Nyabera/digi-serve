# D30 Demo Engine Freeze

## Freeze identity

- Demo Engine: FAIDIA Demo Engine
- Active pack: `tvet`
- Pack name: TVET Demo Pack
- Pack version: `0.3.0-draft`
- Pack status: `draft`
- Organization: Savannah Technical College
- Default route: `/demo`
- Default role: `applicant`
- Default request: `STC-CL-2026-0027`
- Documentation generated: 2026-07-27T18:45:44+03:00

## Purpose

D30 creates a controlled and reproducible release of:

1. the reusable FAIDIA Demo Engine;
2. the TVET Demo Pack containing Savannah-specific configuration.

The engine must remain reusable. Organization identity, departments, services,
workflows and seeded data belong to the active Demo Pack.

## Frozen engine scope

- public service discovery;
- request submission and tracking;
- Applicant, Officer, Supervisor and Admin workspaces;
- role switching;
- shared shells;
- task and case processing;
- handoffs and referrals;
- audit history;
- SLA monitoring;
- reports;
- workflow overview;
- visual workflow builder;
- reset and presentation controls.

## Frozen TVET pack scope

- Savannah identity and branding;
- TVET homepage;
- departments and fictional users;
- six public services;
- workflow definitions;
- seeded requests;
- report datasets;
- SLA targets and performance.

## Change policy

Post-freeze changes are limited to demonstrable defects such as build failures,
broken routes, blank charts, duplicated shells, incorrect role access or
serious accessibility failures.

Design experimentation and dependency upgrades must happen on separate
branches.
