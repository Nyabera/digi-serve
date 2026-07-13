# FAIDIA Stage 0 — Design Reference Register

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document records the approved visual direction, reference status, missing screens, and design boundaries for FAIDIA V1.

Approved Stage 0 decision: current visual direction is approved for Stage 1, and missing screens may be designed during implementation.

## 2. Approved Visual Direction

FAIDIA V1 uses a **modern institutional operations interface**.

Use:

- white or near-white foundation;
- restrained cards;
- subtle borders;
- minimal decorative shadows;
- compact but readable operational tables;
- clear status hierarchy;
- calm institutional branding;
- modern typography;
- consistent icons;
- strong empty/loading/error states;
- responsive applicant flows;
- higher information density for officers and supervisors.

## 3. Approved Applicant-Facing Reference

Reference name: **Modern applicant-facing institutional service portal**.

Reference status: `APPROVED_REFERENCE`.

Suggested asset path: `docs/assets/shared/modern-applicant-service-portal-reference.png`.

Preserve:

- white or near-white foundation;
- fixed white sidebar with grouped navigation;
- spacious, structured dashboard layouts;
- soft grey card borders;
- restrained cards with subtle corner rounding;
- minimal decorative shadows;
- deep navy typography for headings and primary content;
- institutional blue for primary actions and active states;
- pale blue active-navigation backgrounds;
- compact but readable tables and document lists;
- large page titles with short supporting descriptions;
- icon-led service cards with softly tinted backgrounds;
- semantic status badges;
- tabbed navigation with thin blue active indicators;
- spacing and borders rather than heavy shadows;
- responsive applicant workflows.

This reference controls direction and hierarchy. It does not freeze exact pixel values.

## 4. Working Design Choices

- Icons: Lucide React.
- UI foundation: Tailwind CSS + shadcn/ui.
- Tables: TanStack Table.
- Charts: Recharts.
- Background: white/light neutral.
- Cards: subtle border, restrained radius, little/no shadow.
- Navigation: grouped labels and clear active state.
- Typography: readable; avoid squeezed or excessively light body text.
- Statuses: badge plus text; never color-only.
- Charts: real data, readable labels, restrained grid and tooltip design.

## 5. Workspace Direction

Public portal:

- institution branding/header;
- service discovery/search;
- active services/categories;
- how it works;
- track/sign-in action;
- help/contact;
- policy/footer.

Applicant shell:

- compact left sidebar on desktop;
- top bar with page context, notifications, and account;
- readable main content width;
- mobile drawer or simplified bottom navigation;
- Action Required and active requests prominent;
- V1 navigation only.

Officer/supervisor shell:

- shared shell;
- dense but readable operational layout;
- persistent queue/handoff navigation;
- supervisor items appear by permission;
- request reference and current status remain visible;
- filters support larger queues;
- actions depend on workflow state.

Admin shell:

- grouped navigation;
- Services contains forms, requirements, and workflow configuration;
- organization settings separated from operations;
- postponed builder/marketplace pages absent;
- publishing/version states obvious.

## 6. Responsive Direction

Desktop:

- persistent sidebar;
- fixed/sticky top bar;
- full-width tables where needed;
- visible filters when space permits;
- request details may use tabs or structured columns.

Tablet:

- collapsible sidebar;
- reduced page padding;
- filters may use a drawer;
- tables may scroll or reduce columns;
- primary actions remain accessible.

Mobile:

- drawer or bottom navigation;
- single-column forms/details;
- stacked cards;
- sectioned long forms;
- controlled horizontal scrolling for dense tables;
- full-screen sheets where useful;
- applicant submission/correction fully usable.

## 7. Reference Register

| Ref ID | Workspace | Suggested asset path | Status | Preserve | Not final |
|---|---|---|---|---|---|
| REF-PUB-001 | Public | `docs/assets/public/service-home-reference.png` | MISSING | Service discovery hierarchy | Exact copy/dimensions |
| REF-APP-001 | Applicant | `docs/assets/applicant/applicant-shell-reference.png` | PARTIAL_REFERENCE | Navigation grouping, white base, type direction | Exact width, future nav |
| REF-APP-002 | Applicant | `docs/assets/applicant/applicant-dashboard-reference.png` | PARTIAL_REFERENCE | Content hierarchy, restrained cards | Filler metrics |
| REF-APP-003 | Applicant | `docs/assets/applicant/request-details-reference.png` | MISSING | Timeline/action-required hierarchy | Exact layout |
| REF-OFF-001 | Officer | `docs/assets/officer/officer-shell-reference.png` | PARTIAL_REFERENCE | Operational navigation and density | Exact spacing, old future nav |
| REF-OFF-002 | Officer | `docs/assets/officer/officer-dashboard-reference.png` | PARTIAL_REFERENCE | Priority metrics and queue | Decorative/filler charts |
| REF-OFF-003 | Officer | `docs/assets/officer/request-details-reference.png` | MISSING | Tabs, review and actions | Final dimensions |
| REF-SUP-001 | Supervisor | `docs/assets/supervisor/department-dashboard-reference.png` | MISSING | Workload and approval hierarchy | Final report set |
| REF-SUP-002 | Supervisor | `docs/assets/supervisor/sla-monitor-reference.png` | PARTIAL_REFERENCE | Due-soon/overdue emphasis | Advanced SLA behavior |
| REF-ADM-001 | Admin | `docs/assets/admin/admin-shell-reference.png` | PARTIAL_REFERENCE | Grouped navigation, clean white styling | Full future menu |
| REF-ADM-002 | Admin | `docs/assets/admin/admin-dashboard-reference.png` | PARTIAL_REFERENCE | Organization overview hierarchy | Advanced executive analytics |
| REF-ADM-003 | Admin | `docs/assets/admin/service-configuration-reference.png` | MISSING | Controlled configuration/version state | Visual builder behavior |
| REF-SHARED-001 | Shared | `docs/assets/shared/design-system-reference.png` | PARTIAL_REFERENCE | Type, borders, cards, tables, badges | Final token values |
| REF-SHARED-002 | Shared / Applicant | `docs/assets/shared/modern-applicant-service-portal-reference.png` | APPROVED_REFERENCE | White foundation, grouped sidebar, navy/blue hierarchy, restrained cards, semantic badges, clean tables | Exact pixel values |

## 8. Missing Screens Allowed During Build

The following screens may be designed during implementation rather than blocking Stage 1. Their reference status remains `MISSING`; the missing status is explicitly non-blocking where the approved visual direction is sufficient.

- applicant correction response;
- applicant outcome access;
- mobile applicant form;
- officer create referral;
- officer accept referral;
- officer clarification return;
- officer complete referral/result;
- work-item details;
- approval review;
- department dashboard;
- controlled form configuration;
- controlled workflow configuration;
- feature flags;
- permission denied;
- empty queue;
- upload failure;
- loading/slow states.

Transfer accept/decline screen is postponed with transfer scope.

## 9. Coding-Agent Instruction

Use approved visual direction and named partial references. Do not infer final CSS values from low-resolution screenshots. Do not reintroduce postponed navigation from old mockups.
