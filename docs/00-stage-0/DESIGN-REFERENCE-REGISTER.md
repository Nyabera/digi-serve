# FAIDIA Stage 0 — Design Reference Register

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document records approved visual direction and the exact repository paths of current reference assets.

Missing screens may be designed during implementation within this direction. Missing references do not expand Stage 1 scope.

## 2. Visual direction

Use a modern institutional operations interface:

- white or near-white foundation;
- restrained bordered cards;
- minimal decorative shadows;
- clear status hierarchy;
- compact readable operational tables;
- calm institutional branding;
- modern readable typography;
- consistent Lucide icons;
- responsive applicant flows;
- denser officer/supervisor workspaces;
- complete loading, empty, error, and permission states.

## 3. Working design choices

- UI: Tailwind CSS and shadcn/ui.
- Icons: Lucide React.
- Tables: TanStack Table.
- Charts: Recharts.
- Forms: React Hook Form and Zod.
- Cards: subtle border, restrained radius, little/no shadow.
- Statuses: text plus semantic badge; never color-only.
- Typography: readable, not squeezed or excessively light.
- Charts: real data, readable labels, restrained grids/tooltips.

## 4. Exact asset paths

### Applicant shell references

- `docs/assets/applicant-shell/applicant-shell-reference-01.png`
- `docs/assets/applicant-shell/applicant-shell-reference-02.png`
- `docs/assets/applicant-shell/applicant-shell-reference-03.png`
- `docs/assets/applicant-shell/applicant-shell-reference-04.png`
- `docs/assets/applicant-shell/applicant-shell-reference-05.png`

### Officer shell references

- `docs/assets/officer-shell/officer-shell-reference-01.png`
- `docs/assets/officer-shell/officer-shell-reference-02.png`
- `docs/assets/officer-shell/officer-shell-reference-03.png`
- `docs/assets/officer-shell/officer-shell-reference-04.png`
- `docs/assets/officer-shell/officer-shell-reference-05.png`
- `docs/assets/officer-shell/officer-shell-reference-06.png`
- `docs/assets/officer-shell/officer-shell-reference-07.png`

### Organization Admin references

- `docs/assets/admin-shell/admin-shell-reference-01.png`
- `docs/assets/admin-shell/admin-shell-reference-02.png`
- `docs/assets/admin-shell/admin-shell-reference-03.png`
- `docs/assets/admin-shell/admin-shell-reference-04.png`
- `docs/assets/admin-shell/admin-shell-reference-05.png`

### Workflow references

- `docs/assets/workflows/transcript-request-process-map.png`
- `docs/assets/workflows/transcript-request-workflow.png`
- `docs/assets/workflows/departmental-handoff-workflow.png`

These paths match the repository folder structure. Do not use `docs/assets/applicant/`, `docs/assets/officer/`, `docs/assets/admin/`, or colon-suffixed folder names.

## 5. Applicant workspace direction

- compact desktop sidebar;
- mobile drawer or simplified navigation;
- large page title with brief supporting copy;
- Action Required and active-request emphasis;
- clear request reference and applicant-safe status;
- step-based form/document/review flow;
- visible save/continue behavior;
- safe timeline without internal operational detail.

## 6. Officer/Supervisor direction

- compact sidebar and persistent context;
- queue-first dashboard;
- table/list density appropriate for operational work;
- request details as the main workspace;
- clear current owner, SLA, action state, and handoff state;
- tabs/sections for documents, messages, notes, and history;
- supervisor dashboard focused on backlog, overdue work, stage timing, and approval queue.

## 7. Organization Admin direction

Stage 1 admin design covers only:

- setup summary;
- organization metadata;
- seeded service list;
- limited service metadata editor;
- branding.

Do not visually imply a full form builder, workflow builder, permission editor, or marketplace in Stage 1.

## 8. Responsive direction

Applicant pages:

- single-column mobile flow;
- sticky primary action where appropriate;
- accessible upload controls;
- readable status/timeline;
- no horizontal table dependency.

Staff pages:

- responsive tables may become cards;
- request details preserves task/action priority;
- side navigation collapses;
- critical action menus remain permission-gated.

## 9. Missing screens allowed during build

The following may be designed during implementation:

- public homepage variants;
- request-details edge states;
- correction error/expiry states;
- Supervisor dashboard details;
- limited admin service metadata editor;
- outcome collection/manual-closure dialogs;
- reopening confirmation;
- permission-denied and stale-action states.

A new screen must still match `PAGE-INVENTORY.md` classification.

## 10. Reference authority

Reference images control direction and hierarchy, not exact pixels. Source documents control functionality, scope, statuses, permissions, and navigation.

## 11. Coding-agent instruction

Verify that every referenced asset path exists before using it. Do not create a route or feature merely because a reference image contains it.
