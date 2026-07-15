# FAIDIA Stage 0 — Page Inventory

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Classification

- **STAGE_1_REQUIRED** — required for the first Transcript Request vertical slice; real data, server-side authorization, and approved behavior are mandatory.
- **LATER_V1** — required before the complete V1 release or external pilot, but not required to finish Stage 1.
- **DEMO_ONLY** — optional seeded/simplified surface; cannot be a dependency of Stage 1.
- **POSTPONED** — outside V1 and must not have active V1 navigation.

`V1_REQUIRED` is retired because it previously conflated Stage 1 with the complete V1.

## 2. Scope counts

- `STAGE_1_REQUIRED`: **39 inventory items / 32 distinct routes**
  - 32 distinct product routes
  - 7 embedded sections/actions
- `LATER_V1`: **24**
- `DEMO_ONLY`: **12**
- `POSTPONED`: **18**

Stage 1 is complete when the `STAGE_1_REQUIRED` route set and embedded sections pass the vertical-slice acceptance scenario. It does not require all complete-V1 pages.

## 3. Stage 1 configuration-page rule

The Stage 1 admin pages are limited to:

- dashboard/setup summary;
- organization metadata;
- seeded service list;
- limited safe service metadata editing;
- basic branding.

Full department/user management, form configuration, document-rule configuration, workflow configuration, workflow-version UI, feature flags, and organization reports are `LATER_V1`.

The service versions required for Stage 1 may be seeded by migrations/seed scripts.

## 4. Public and authentication

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| PUB-001 | Organization service homepage | /o/[organizationSlug] | STAGE_1_REQUIRED | Branding, discovery, sign-in/start |
| PUB-002 | Service catalogue | /o/[organizationSlug]/services | STAGE_1_REQUIRED | Active service cards and search |
| PUB-003 | Service details | /o/[organizationSlug]/services/[serviceSlug] | STAGE_1_REQUIRED | Eligibility, requirements, payment reference, target, start |
| PUB-004 | Track entry | /track | DEMO_ONLY | Redirect to authenticated tracking |
| PUB-005 | Public document verification | /verify/[token] | POSTPONED | Future controlled verification |
| AUTH-001 | Registration | /register | STAGE_1_REQUIRED | Applicant account creation |
| AUTH-002 | Sign in | /login | STAGE_1_REQUIRED | Applicant/staff authentication |
| AUTH-003 | Email verification | /verify-email | LATER_V1 | Required before external pilot |
| AUTH-004 | Forgot password | /forgot-password | LATER_V1 | Account recovery |
| AUTH-005 | Reset password | /reset-password | LATER_V1 | Complete recovery |
| AUTH-006 | Invitation acceptance | /invitation/[token] | LATER_V1 | Staff joins organization |
| AUTH-007 | Organization selection | /select-organization | LATER_V1 | Only multi-membership staff |

## 5. Applicant workspace

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| APP-001 | Dashboard | /applicant/dashboard | STAGE_1_REQUIRED | Active requests and action required |
| APP-002 | Browse services | /applicant/services | LATER_V1 | Authenticated service discovery |
| APP-003 | Start request | /applicant/services/[serviceSlug]/start | STAGE_1_REQUIRED | Create pinned draft |
| APP-004 | Application form | /applicant/requests/[id]/form | STAGE_1_REQUIRED | Seeded fields and validation |
| APP-005 | Documents | /applicant/requests/[id]/documents | STAGE_1_REQUIRED | Checklist, upload, replace |
| APP-006 | Review submission | /applicant/requests/[id]/review | STAGE_1_REQUIRED | Summary, declaration, submit |
| APP-007 | Confirmation | /applicant/requests/[id]/submitted | STAGE_1_REQUIRED | Reference and next step |
| APP-008 | My Requests | /applicant/requests | STAGE_1_REQUIRED | Owned request list |
| APP-009 | Request details | /applicant/requests/[id] | STAGE_1_REQUIRED | Status, next action, outcome |
| APP-010 | Timeline | Included in request details | STAGE_1_REQUIRED | Applicant-safe history |
| APP-011 | Correction response | /applicant/requests/[id]/correction | STAGE_1_REQUIRED | Replace unlocked fields/files |
| APP-012 | Messages | Included in request details | STAGE_1_REQUIRED | Applicant-visible thread |
| APP-013 | Notifications | /applicant/notifications | STAGE_1_REQUIRED | Unread/read and linked actions |
| APP-014 | Issued outcome | /applicant/requests/[id]/outcome | STAGE_1_REQUIRED | Controlled download/collection |
| APP-015 | Account | /applicant/account | LATER_V1 | Permitted profile fields |
| APP-016 | Saved drafts | /applicant/drafts | LATER_V1 | Dedicated draft list |
| APP-017 | Document vault | /applicant/documents | DEMO_ONLY | Document history |
| APP-018 | Payments | /applicant/payments | DEMO_ONLY | Standalone payment status |
| APP-019 | Renewals | /applicant/renewals | POSTPONED | Future renewal workflows |
| APP-020 | Verification records | /applicant/verifications | POSTPONED | Future verification history |

## 6. Officer workspace

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| OFF-001 | Dashboard | /officer/dashboard | STAGE_1_REQUIRED | Assigned, waiting, overdue summary |
| OFF-002 | My Queue | /officer/queue | STAGE_1_REQUIRED | Assigned/claimed work |
| OFF-003 | Department Queue | /officer/department-queue | STAGE_1_REQUIRED | Unassigned and department work |
| OFF-004 | Request details | /officer/requests/[id] | STAGE_1_REQUIRED | Main processing workspace |
| OFF-005 | Document review | Request-details tab | STAGE_1_REQUIRED | Accept/reject with reason |
| OFF-006 | Internal notes | Request-details tab | STAGE_1_REQUIRED | Private operational notes |
| OFF-007 | Applicant messages | Request-details tab | STAGE_1_REQUIRED | Applicant-visible communication |
| OFF-008 | Correction action | Request-details action | STAGE_1_REQUIRED | Reason, fields/files, deadline |
| OFF-009 | Create referral | /officer/requests/[id]/referrals/new | STAGE_1_REQUIRED | Finance referral |
| OFF-010 | Create transfer | /officer/requests/[id]/transfers/new | POSTPONED | Transfer outside V1 |
| OFF-011 | Incoming handoffs | /officer/handoffs/incoming | STAGE_1_REQUIRED | Finance acceptance and active work |
| OFF-012 | Outgoing handoffs | /officer/handoffs/outgoing | STAGE_1_REQUIRED | Track sent referrals |
| OFF-013 | Handoff details | /officer/handoffs/[id] | STAGE_1_REQUIRED | Accept, clarify, complete |
| OFF-014 | Work-item details | /officer/work-items/[id] | LATER_V1 | Dedicated task page |
| OFF-015 | Registrar decision actions | Request-details action panel | STAGE_1_REQUIRED | Embedded in `/officer/requests/[id]`; visible only to a    Registrar-profile Supervisor and enforced server-side |
| OFF-016 | Notifications | /officer/notifications | STAGE_1_REQUIRED | Assignment, handoff, overdue |
| OFF-017 | Global search | /officer/search | DEMO_ONLY | Permission-scoped lookup |
| OFF-018 | Correspondence | /officer/communications/correspondence | DEMO_ONLY | Formal communication |
| OFF-019 | Knowledge base | /officer/communications/knowledge-base | DEMO_ONLY | Staff guidance |
| OFF-020 | Advanced workload | /officer/workload | POSTPONED | Capacity balancing |

## 7. Supervisor workspace

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| SUP-001 | Department dashboard | /supervisor/dashboard | STAGE_1_REQUIRED | Backlog and stage timing |
| SUP-002 | Unassigned work | /supervisor/unassigned | LATER_V1 | Dedicated assignment view |
| SUP-003 | Officer assignments | /supervisor/assignments | LATER_V1 | Workload/reassignment |
| SUP-004 | Pending handoffs | /supervisor/handoffs | LATER_V1 | Dedicated handoff monitor |
| SUP-005 | Overdue work | /supervisor/overdue | LATER_V1 | Dedicated overdue view |
| SUP-006 | Approval queue | /supervisor/approvals | STAGE_1_REQUIRED | Registrar approval queue; selecting a request opens `/officer/requests/[id]` in the shared staff processing shell |
| SUP-007 | Department report | /supervisor/reports | LATER_V1 | Detailed operational report |
| SUP-008 | SLA monitor | /supervisor/sla | DEMO_ONLY | Focused SLA view |
| SUP-009 | Escalations | /supervisor/escalations | POSTPONED | Advanced ladder |
| SUP-010 | Officer ranking | /supervisor/officer-performance | POSTPONED | Advanced analytics |

### Supervisor shell and route rule

Supervisors use the shared Officer processing shell rather than a separate duplicate processing shell.

Supervisor-only navigation items and controls may be displayed according to the active membership profile and permissions.

The Registrar approval queue at `/supervisor/approvals` links to the shared request-details route:

```text
/supervisor/approvals
→ /officer/requests/[id]
```

There is no separate `/officer/requests/[id]/approval` route in Stage 1.

Approval, rejection, and return-for-clarification controls are embedded in `/officer/requests/[id]` and are available only to a Registrar-profile Supervisor.

## 8. Organization Admin

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| ADM-001 | Dashboard | /admin/dashboard | STAGE_1_REQUIRED | Setup summary |
| ADM-002 | Organization details | /admin/organization | STAGE_1_REQUIRED | Limited organization metadata |
| ADM-003 | Departments | /admin/departments | LATER_V1 | Full department management |
| ADM-004 | Department details | /admin/departments/[id] | LATER_V1 | Members and status |
| ADM-005 | Users/invitations | /admin/users | LATER_V1 | Invite/manage staff |
| ADM-006 | Membership details | /admin/users/[id] | LATER_V1 | Role and department |
| ADM-007 | Services | /admin/services | STAGE_1_REQUIRED | Seeded service list and state |
| ADM-008 | Service configuration | /admin/services/[id] | STAGE_1_REQUIRED | Limited safe metadata editing |
| ADM-009 | Form configuration | /admin/services/[id]/form | LATER_V1 | Controlled field configuration |
| ADM-010 | Document requirements | /admin/services/[id]/documents | LATER_V1 | Controlled requirement configuration |
| ADM-011 | Workflow configuration | /admin/services/[id]/workflow | LATER_V1 | Controlled sequence configuration |
| ADM-012 | Workflow versions | /admin/services/[id]/workflow/versions | LATER_V1 | Version history and publishing UI |
| ADM-013 | Branding | /admin/settings/branding | STAGE_1_REQUIRED | Name, logo, primary color |
| ADM-014 | Feature flags | /admin/settings/features | LATER_V1 | Controlled modules |
| ADM-015 | Organization reports | /admin/reports | LATER_V1 | Aggregate operational reports |
| ADM-016 | Audit activity | /admin/audit | DEMO_ONLY | Standalone audit page |
| ADM-017 | Handoff routes | /admin/handoff-routes | DEMO_ONLY | Seeded permitted routes |
| ADM-018 | Payment configuration | /admin/settings/payments | DEMO_ONLY | Standalone payment settings |
| ADM-019 | Notification templates | /admin/notifications/templates | DEMO_ONLY | Controlled templates |
| ADM-020 | Permission editor | /admin/permissions | POSTPONED | Custom roles/permissions |
| ADM-021 | Visual workflow builder | /admin/workflows/builder | POSTPONED | Drag-and-drop workflow |
| ADM-022 | Visual form builder | /admin/forms/builder | POSTPONED | Drag-and-drop form |
| ADM-023 | Homepage builder | /admin/homepage-builder | POSTPONED | Block editor |
| ADM-024 | Template marketplace | /admin/templates | POSTPONED | Template installation |
| ADM-025 | Integration marketplace | /admin/integrations | POSTPONED | External systems |
| ADM-026 | Custom report builder | /admin/reports/builder | POSTPONED | Arbitrary reports |

## 9. Platform Admin

| ID | Page | Route/location | Class | Purpose |
|---|---|---|---|---|
| PADM-001 | Organizations | /platform-admin/organizations | DEMO_ONLY | Internal demo/support |
| PADM-002 | Support | /platform-admin/support | POSTPONED | Cross-tenant support |
| PADM-003 | Usage | /platform-admin/usage | POSTPONED | SaaS usage |
| PADM-004 | Subscriptions | /platform-admin/subscriptions | POSTPONED | Billing |
| PADM-005 | System health | /platform-admin/system-health | POSTPONED | Monitoring UI |

## 10. Stage 1 active navigation

Applicant:

```text
HOME
- Dashboard

REQUESTS
- Start New Request
- My Requests

COMMUNICATION
- Notifications

ACCOUNT
- Sign Out
```

The request-details page contains the applicant-safe timeline and messages. Outcome access appears as an action from request details.

Officer:

```text
WORK
- Dashboard
- My Queue
- Department Queue

HANDOFFS
- Incoming
- Outgoing

ACCOUNT
- Notifications
- Sign Out
```

Request details contains document review, internal notes, applicant messages, correction, and outcome-processing actions.

Registrar/Supervisor additions:

```text
DEPARTMENT
- Department Overview
- Approval Queue
```

Organization Admin:

```text
OVERVIEW
- Dashboard

ORGANIZATION
- Organization Details

SERVICES
- Services

SETTINGS
- Branding
```

## 11. Complete-V1 navigation rule

`LATER_V1` navigation is added only after the Stage 1 slice passes acceptance and the relevant page is scheduled. Do not display inactive placeholders for `LATER_V1` pages by default.

## 12. Removed from active Stage 1 navigation

- transfer creation;
- dedicated work-item page;
- advanced supervisor assignment pages;
- full department/user administration;
- full form/document/workflow configuration;
- workflow-version UI;
- standalone payments;
- public verification;
- template/integration marketplaces;
- visual builders;
- custom report builder;
- AI routing/OCR;
- capacity balancing;
- cross-organization workflows;
- enterprise SSO.

## 13. Shared page requirements

Every `STAGE_1_REQUIRED` route or embedded section must define:

- loading;
- empty;
- error;
- permission-denied;
- stale-action/concurrency behavior where relevant;
- responsive behavior;
- keyboard access;
- page title and breadcrumb/context;
- data freshness expectation;
- applicant-safe error language;
- server-side authorization.

## 14. Coding-agent instruction

Build only `STAGE_1_REQUIRED` items unless the current task explicitly promotes another item. Do not infer scope from old mockups or broad V1 navigation.
