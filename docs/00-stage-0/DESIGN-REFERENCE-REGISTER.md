# FAIDIA Stage 0 — Design Reference Register

Status: **DRAFT — requires product-owner approval**  
Version: **0.2**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This document records the approved visual direction, the mockups that may be used as references, what each reference controls and which values remain intentionally unfrozen.

It prevents coding agents from treating every old screenshot as equally authoritative.

## 2. Stage 0 design status

Stage 0 approves:

- overall visual direction;
- public, applicant, officer/supervisor and admin workspace boundaries;
- intended navigation groups;
- broad responsive behaviour;
- selected mockups as references;
- design elements that must remain consistent.

Stage 0 does **not** approve final pixel values.

## 3. Approved visual direction

**Modern institutional operations interface**

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
- higher information density for officers/supervisors.

### Approved applicant-facing design reference — Version 0.2

**Reference name:** Modern applicant-facing institutional service portal  
**Reference status:** `APPROVED_REFERENCE`  
**Suggested asset path:** `docs/assets/shared/modern-applicant-service-portal-reference.png`

Use the following design direction in addition to the existing approved direction above:

- white or near-white foundation;
- fixed white sidebar with clearly grouped navigation;
- spacious, structured dashboard layouts;
- soft grey card borders;
- restrained cards with subtle corner rounding;
- minimal decorative shadows;
- deep navy typography for headings and primary content;
- bright institutional blue for primary actions and active states;
- pale blue active-navigation backgrounds;
- compact but readable tables and document lists;
- large, clear page titles with short supporting descriptions;
- prominent search, request and tracking actions;
- icon-led service cards with softly tinted backgrounds;
- consistent outlined icons throughout;
- small, rounded status badges using semantic colours;
- green for verified, approved and completed states;
- amber for pending, expiring and attention states;
- red for failed, overdue and renewal-required states;
- purple and cyan as restrained secondary accents;
- tabbed navigation with thin blue active indicators;
- strong visual separation through spacing and borders rather than shadows;
- calm institutional branding with friendly applicant-facing language;
- selective use of campus photography in wide hero banners;
- simple illustrations for help, empty and onboarding states;
- information-dense layouts that remain visually clean;
- clear card, table and detail-panel hierarchy;
- persistent access to profile, notifications and global search;
- responsive card grids and applicant workflows;
- obvious selected-row and selected-record states;
- consistent primary, secondary and tertiary button hierarchy;
- generous whitespace around major sections;
- approachable presentation without looking playful or consumer-oriented;
- polished digital-service styling similar to a modern university, banking or government self-service portal.

This reference controls visual direction and hierarchy. It does **not** freeze exact pixel values, spacing tokens, dimensions or final component implementation.

## 4. Working design choices

Directional defaults:

- **Icons:** Lucide React.
- **UI:** Tailwind CSS + shadcn/ui.
- **Tables:** TanStack Table.
- **Charts:** Recharts.
- **Background:** white/light neutral.
- **Cards:** subtle border, restrained radius, little/no shadow.
- **Navigation:** grouped labels and clear active state.
- **Typography:** readable; avoid squeezed or excessively light body text.
- **Statuses:** badge plus text; never colour-only.
- **Charts:** real data, readable labels, restrained grid and tooltip design.

## 5. Workspace direction

### Public portal

Structure:

1. institution branding/header;
2. service discovery/search;
3. popular services/categories;
4. how it works;
5. track/sign-in action;
6. help/contact;
7. policy/footer.

It serves applicants; it is not mainly a FAIDIA sales page.

### Applicant shell

- compact left sidebar on desktop;
- top bar with page context, notifications and account;
- readable main content width;
- mobile drawer or simplified bottom navigation;
- Action Required and active requests are prominent;
- use only V1 navigation, not the full future map.

### Officer/supervisor shell

- one shared shell;
- dense but readable operational layout;
- persistent queue/handoff navigation;
- supervisor items appear by permission;
- request reference and current status remain visible;
- filters support larger queues;
- actions depend on current workflow step.

### Admin shell

- grouped navigation;
- Services contains forms, requirements and workflow configuration;
- organization settings separated from operations;
- postponed builder/marketplace pages absent from active navigation;
- publishing/version states are obvious.

## 6. Responsive direction

### Desktop

- persistent sidebar;
- fixed/sticky top bar;
- full-width tables where needed;
- visible filters when space permits;
- request details may use tabs or structured columns.

### Tablet

- collapsible sidebar;
- reduced page padding;
- filters may use a drawer;
- tables may scroll or reduce columns;
- primary actions remain accessible.

### Mobile

- drawer or bottom navigation;
- single-column forms/details;
- stacked cards;
- sectioned long forms;
- responsive rows or controlled horizontal scrolling for tables;
- full-screen sheets where useful;
- applicant submission/correction must remain fully usable.

## 7. Reference statuses

- `APPROVED_REFERENCE` — authoritative visual direction.
- `PARTIAL_REFERENCE` — preserve only named aspects.
- `EXPLORATION` — inspiration only.
- `OBSOLETE` — do not use.
- `MISSING` — design still required.

## 8. Reference register

Replace placeholder paths after copying real mockups into `docs/assets/`.

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
| REF-SUP-002 | Supervisor | `docs/assets/supervisor/sla-monitor-reference.png` | PARTIAL_REFERENCE | Due-soon/overdue emphasis | Advanced SLA behaviour |
| REF-ADM-001 | Admin | `docs/assets/admin/admin-shell-reference.png` | PARTIAL_REFERENCE | Grouped navigation, clean white styling | Full future menu |
| REF-ADM-002 | Admin | `docs/assets/admin/admin-dashboard-reference.png` | PARTIAL_REFERENCE | Organization overview hierarchy | Advanced executive analytics |
| REF-ADM-003 | Admin | `docs/assets/admin/service-configuration-reference.png` | MISSING | Controlled configuration/version state | Visual builder behaviour |
| REF-SHARED-001 | Shared | `docs/assets/shared/design-system-reference.png` | PARTIAL_REFERENCE | Type, borders, cards, tables, badges | Final token values |
| REF-SHARED-002 | Shared / Applicant | `docs/assets/shared/modern-applicant-service-portal-reference.png` | APPROVED_REFERENCE | White foundation, fixed grouped sidebar, navy-and-institutional-blue hierarchy, restrained cards, semantic badges, clean tables, responsive applicant workflows | Exact pixel values and final tokens |

## 9. Missing-screen register

| ID | Workspace | Screen | Required during | Status |
|---|---|---|---|---|
| MISS-001 | Applicant | Correction response | Correction stage | MISSING |
| MISS-002 | Applicant | Outcome access | Completion/PDF stage | MISSING |
| MISS-003 | Applicant | Mobile application form | Submission stage | MISSING |
| MISS-004 | Officer | Create referral | Referral stage | MISSING |
| MISS-005 | Officer | Accept referral | Referral stage | MISSING |
| MISS-006 | Officer | Clarification return | Referral stage | MISSING |
| MISS-007 | Officer | Complete referral/result | Referral stage | MISSING |
| MISS-008 | Officer | Transfer accept/decline | Transfer stage | MISSING |
| MISS-009 | Officer | Work-item details | Officer stage | MISSING |
| MISS-010 | Supervisor | Approval review | Approval stage | MISSING |
| MISS-011 | Supervisor | Department dashboard | Supervisor stage | MISSING |
| MISS-012 | Admin | Controlled form configuration | Admin stage | MISSING |
| MISS-013 | Admin | Controlled workflow configuration | Admin stage | MISSING |
| MISS-014 | Admin | Feature flags | Feature-flag stage | MISSING |
| MISS-015 | Shared | Permission denied | Project-structure stage | MISSING |
| MISS-016 | Shared | Empty queue | Shared components | MISSING |
| MISS-017 | Shared | Upload failure | Submission stage | MISSING |
| MISS-018 | Shared | Loading/slow state | Shared components | MISSING |

## 10. Reference acceptance checklist

For each selected mockup:

- [ ] clear file name;
- [ ] workspace/page identified;
- [ ] reference status assigned;
- [ ] aspects to preserve listed;
- [ ] obsolete aspects listed;
- [ ] device context known;
- [ ] filler content labelled;
- [ ] classification matches `PAGE-INVENTORY.md`;
- [ ] no postponed feature implied as functional;
- [ ] accessibility risks noted.

## 11. Asset naming

Use:

```text
applicant-shell-reference-v1.png
officer-request-details-reference-v1.png
admin-service-configuration-exploration-02.png
supervisor-department-dashboard-approved.png
```

Avoid:

```text
Screenshot 2026-07-12 at 12.57.11.png
final-final-new.png
image3.png
```

## 12. Freeze after implementation

After design-system and shell implementation, freeze:

- typography tokens;
- colour/semantic tokens;
- spacing scale;
- radii, borders and shadows;
- sidebar/top-bar dimensions;
- icon sizes;
- table density;
- form-control dimensions;
- chart defaults;
- desktop/tablet/mobile shell behaviour;
- implemented reference screenshots.

Before then, freeze only direction and structure.

## 13. Coding-agent instruction

> Use only Approved References or the explicitly named parts of Partial References. Do not infer final CSS values from a low-resolution screenshot when later design-system documentation provides exact values. Do not reintroduce postponed navigation from old mockups.

## Version 0.2 update record

- Added the approved modern applicant-facing institutional service portal design reference.
- Added `REF-SHARED-002` to the reference register.
- Preserved all previous design-direction content and references.
