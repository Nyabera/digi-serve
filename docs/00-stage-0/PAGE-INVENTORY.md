# FAIDIA Stage 0 — V1 Page Inventory

Status: **APPROVED_FOR_V1**  
Version: **1.1**
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Classification

- **V1_REQUIRED** — real data, permissions, and behavior required for the vertical slice or pilot.
- **DEMO_ONLY** — may use seeded/simplified behavior and is not required for Stage 1 completion.
- **POSTPONED** — intentionally excluded.

Approved changes:

- transfer route is no longer V1-required;
- manual payment reference stays inside request flow and is required only where the published service version requires it;
- standalone payment pages remain demo-only;
- organization selection is required only for staff with multiple memberships;
- standalone admin audit page remains demo-only, while request-level audit/history is required in request details.

## 2. Stage 1 Scope Boundary

There are **63 `V1_REQUIRED` pages**, **12 `DEMO_ONLY` pages**, and **18 `POSTPONED` pages** in this inventory.

- Every `V1_REQUIRED` page is part of the Stage 1 implementation scope and must have real data, server-side permissions, and the documented behavior before Stage 1 is approved.
- `DEMO_ONLY` pages may use seeded or simplified behavior and must not become dependencies of the approved vertical slice.
- `POSTPONED` pages must not have active V1 navigation or required routes.
- The 63 `V1_REQUIRED` pages are the complete V1 surface; no additional page is implied by a mockup, backlog item, or old navigation reference.

## 3. Public And Authentication

| ID | Page | Suggested route | Class | Purpose |
|---|---|---|---|---|
| PUB-001 | Organization service homepage | `/o/[organizationSlug]` | V1_REQUIRED | Branding, service discovery, sign in/track |
| PUB-002 | Service catalogue | `/o/[organizationSlug]/services` | V1_REQUIRED | Active service cards and search |
| PUB-003 | Service details | `/o/[organizationSlug]/services/[serviceSlug]` | V1_REQUIRED | Description, eligibility, requirements, documents, manual payment reference, processing target, start |
| PUB-004 | Track entry | `/track` | DEMO_ONLY | Direct applicant to authenticated tracking |
| PUB-005 | Public document verification | `/verify/[token]` | POSTPONED | Future controlled document verification |
| AUTH-001 | Registration | `/register` | V1_REQUIRED | Applicant account creation |
| AUTH-002 | Sign in | `/login` | V1_REQUIRED | Applicant/staff authentication |
| AUTH-003 | Email verification | `/verify-email` | V1_REQUIRED | Verification state and resend |
| AUTH-004 | Forgot password | `/forgot-password` | V1_REQUIRED | Start reset |
| AUTH-005 | Reset password | `/reset-password` | V1_REQUIRED | Complete reset |
| AUTH-006 | Invitation acceptance | `/invitation/[token]` | V1_REQUIRED | Staff joins organization |
| AUTH-007 | Organization selection | `/select-organization` | V1_REQUIRED | Shown only when staff has multiple memberships |

## 4. Applicant Workspace

| ID | Page | Suggested route | Class | Purpose |
|---|---|---|---|---|
| APP-001 | Dashboard | `/applicant/dashboard` | V1_REQUIRED | Active requests, action required, updates |
| APP-002 | Browse services | `/applicant/services` | V1_REQUIRED | Search and service cards |
| APP-003 | Start request | `/applicant/services/[serviceSlug]/start` | V1_REQUIRED | Confirm service and create draft |
| APP-004 | Application form | `/applicant/requests/[id]/form` | V1_REQUIRED | Configured fields, manual payment reference, validation, save |
| APP-005 | Documents | `/applicant/requests/[id]/documents` | V1_REQUIRED | Checklist, upload, replace |
| APP-006 | Review submission | `/applicant/requests/[id]/review` | V1_REQUIRED | Read-only summary, documents, payment reference, declaration |
| APP-007 | Confirmation | `/applicant/requests/[id]/submitted` | V1_REQUIRED | Reference and next step |
| APP-008 | My Requests | `/applicant/requests` | V1_REQUIRED | Owned request list and filters |
| APP-009 | Request details | `/applicant/requests/[id]` | V1_REQUIRED | Public status, next action, outcome |
| APP-010 | Timeline | Included in details | V1_REQUIRED | Applicant-safe history |
| APP-011 | Correction response | `/applicant/requests/[id]/correction` | V1_REQUIRED | Correct fields/files and resubmit |
| APP-012 | Messages | `/applicant/requests/[id]/messages` | V1_REQUIRED | Applicant-visible thread |
| APP-013 | Notifications | `/applicant/notifications` | V1_REQUIRED | Unread/read and linked actions |
| APP-014 | Issued outcome | `/applicant/requests/[id]/outcome` | V1_REQUIRED | Controlled download or collection instructions |
| APP-015 | Account | `/applicant/account` | V1_REQUIRED | Permitted profile fields |
| APP-016 | Saved drafts | `/applicant/drafts` | V1_REQUIRED | Continue drafts before 30-day expiry |
| APP-017 | Document vault | `/applicant/documents` | DEMO_ONLY | Upload/issued history |
| APP-018 | Payments | `/applicant/payments` | DEMO_ONLY | Standalone payment status not required; manual reference is inside request |
| APP-019 | Renewals | `/applicant/renewals` | POSTPONED | Future renewal workflows |
| APP-020 | Verification records | `/applicant/verifications` | POSTPONED | Future verification history |

## 5. Officer Workspace

| ID | Page | Suggested route | Class | Purpose |
|---|---|---|---|---|
| OFF-001 | Dashboard | `/officer/dashboard` | V1_REQUIRED | Assigned, due, overdue, waiting, completed |
| OFF-002 | My Queue | `/officer/queue` | V1_REQUIRED | Assigned/claimed work |
| OFF-003 | Department Queue | `/officer/department-queue` | V1_REQUIRED | Incoming, unassigned, self-claim, assigned, overdue |
| OFF-004 | Request details | `/officer/requests/[id]` | V1_REQUIRED | Main processing workspace |
| OFF-005 | Document review | Details section/tab | V1_REQUIRED | Accept/reject with reason |
| OFF-006 | Internal notes | Details section/tab | V1_REQUIRED | Private operational notes |
| OFF-007 | Applicant messages | Details section/tab | V1_REQUIRED | Applicant-visible communication |
| OFF-008 | Correction action | Modal/page from details | V1_REQUIRED | Reason, fields, files, deadline |
| OFF-009 | Create referral | `/officer/requests/[id]/referrals/new` | V1_REQUIRED | Finance referral |
| OFF-010 | Create transfer | `/officer/requests/[id]/transfers/new` | POSTPONED | Transfer is outside Stage 1 main path |
| OFF-011 | Incoming handoffs | `/officer/handoffs/incoming` | V1_REQUIRED | Pending acceptance and active Finance work |
| OFF-012 | Outgoing handoffs | `/officer/handoffs/outgoing` | V1_REQUIRED | Track sent referrals |
| OFF-013 | Handoff details | `/officer/handoffs/[id]` | V1_REQUIRED | Accept/decline/clarify/start/complete referral |
| OFF-014 | Work-item details | `/officer/work-items/[id]` | V1_REQUIRED | Task, SLA, dependencies, completion |
| OFF-015 | Approval/rejection | `/officer/requests/[id]/approval` | V1_REQUIRED | Canonical Registrar/supervisor decision page with prerequisites, reason, approve, reject, and return-for-clarification actions |
| OFF-016 | Notifications | `/officer/notifications` | V1_REQUIRED | Assignment, handoff, correction, overdue |
| OFF-017 | Global search | `/officer/search` | DEMO_ONLY | Permission-scoped lookup |
| OFF-018 | Correspondence | `/officer/communications/correspondence` | DEMO_ONLY | Formal communication |
| OFF-019 | Knowledge base | `/officer/communications/knowledge-base` | DEMO_ONLY | Staff guidance |
| OFF-020 | Advanced workload | `/officer/workload` | POSTPONED | Capacity balancing |

## 6. Supervisor Workspace

Supervisor reuses the officer shell with additional permission-gated navigation.

| ID | Page | Suggested route | Class | Purpose |
|---|---|---|---|---|
| SUP-001 | Department dashboard | `/supervisor/dashboard` | V1_REQUIRED | Open, unassigned, overdue, handoffs, average time |
| SUP-002 | Unassigned work | `/supervisor/unassigned` | V1_REQUIRED | Assign work and monitor self-claim |
| SUP-003 | Officer assignments | `/supervisor/assignments` | V1_REQUIRED | View workload, assign/reassign |
| SUP-004 | Pending handoffs | `/supervisor/handoffs` | V1_REQUIRED | Pending, clarification, overdue |
| SUP-005 | Overdue work | `/supervisor/overdue` | V1_REQUIRED | Intervene in delay |
| SUP-006 | Approval queue | `/supervisor/approvals` | V1_REQUIRED | Registrar/supervisor approval and rejection |
| SUP-007 | Department report | `/supervisor/reports` | V1_REQUIRED | Volume, completion, overdue, handoffs |
| SUP-008 | SLA monitor | `/supervisor/sla` | DEMO_ONLY | Due-soon/overdue focus |
| SUP-009 | Escalations | `/supervisor/escalations` | POSTPONED | Advanced ladder |
| SUP-010 | Officer ranking | `/supervisor/officer-performance` | POSTPONED | Advanced fairness-aware analytics |

## 7. Organization Admin

| ID | Page | Suggested route | Class | Purpose |
|---|---|---|---|---|
| ADM-001 | Dashboard | `/admin/dashboard` | V1_REQUIRED | Setup and operational summary |
| ADM-002 | Organization details | `/admin/organization` | V1_REQUIRED | Institution information |
| ADM-003 | Departments | `/admin/departments` | V1_REQUIRED | Create/edit/deactivate |
| ADM-004 | Department details | `/admin/departments/[id]` | V1_REQUIRED | Members and status |
| ADM-005 | Users/invitations | `/admin/users` | V1_REQUIRED | Invite and manage staff |
| ADM-006 | Membership details | `/admin/users/[id]` | V1_REQUIRED | Role and department |
| ADM-007 | Services | `/admin/services` | V1_REQUIRED | Activate/deactivate and versions |
| ADM-008 | Service configuration | `/admin/services/[id]` | V1_REQUIRED | Description, eligibility, time, manual payment reference setting |
| ADM-009 | Form configuration | `/admin/services/[id]/form` | V1_REQUIRED | Controlled fields/sections |
| ADM-010 | Document requirements | `/admin/services/[id]/documents` | V1_REQUIRED | Requirement rules |
| ADM-011 | Workflow configuration | `/admin/services/[id]/workflow` | V1_REQUIRED | Controlled step sequence |
| ADM-012 | Workflow versions | `/admin/services/[id]/workflow/versions` | V1_REQUIRED | Publish without overwrite |
| ADM-013 | Branding | `/admin/settings/branding` | V1_REQUIRED | Logo, name, primary color |
| ADM-014 | Feature flags | `/admin/settings/features` | V1_REQUIRED | Enable controlled modules |
| ADM-015 | Organization reports | `/admin/reports` | V1_REQUIRED | Volume, completion, turnaround, overdue |
| ADM-016 | Audit activity | `/admin/audit` | DEMO_ONLY | Standalone audit page; request audit appears in request details |
| ADM-017 | Handoff routes | `/admin/handoff-routes` | DEMO_ONLY | Permitted department routes |
| ADM-018 | Payment configuration | `/admin/settings/payments` | DEMO_ONLY | Standalone payment config not required for manual reference in request flow |
| ADM-019 | Notification templates | `/admin/notifications/templates` | DEMO_ONLY | Controlled templates |
| ADM-020 | Permission editor | `/admin/permissions` | POSTPONED | Custom roles/permissions |
| ADM-021 | Visual workflow builder | `/admin/workflows/builder` | POSTPONED | Drag-and-drop |
| ADM-022 | Visual form builder | `/admin/forms/builder` | POSTPONED | Drag-and-drop |
| ADM-023 | Homepage builder | `/admin/homepage-builder` | POSTPONED | Block editor |
| ADM-024 | Template marketplace | `/admin/templates` | POSTPONED | Template installation |
| ADM-025 | Integration marketplace | `/admin/integrations` | POSTPONED | External systems |
| ADM-026 | Custom report builder | `/admin/reports/builder` | POSTPONED | Arbitrary reports |

## 8. Platform Admin

| ID | Page | Route | Class | Purpose |
|---|---|---|---|---|
| PADM-001 | Organizations | `/platform-admin/organizations` | DEMO_ONLY | Internal demo/support |
| PADM-002 | Support | `/platform-admin/support` | POSTPONED | Cross-tenant support |
| PADM-003 | Usage | `/platform-admin/usage` | POSTPONED | SaaS usage |
| PADM-004 | Subscriptions | `/platform-admin/subscriptions` | POSTPONED | Billing |
| PADM-005 | System health | `/platform-admin/system-health` | POSTPONED | Monitoring UI |

## 9. Approved Navigation

Applicant:

```text
HOME
- Dashboard

SERVICES
- Service Catalogue
- Browse Services
- Start New Request

REQUESTS
- My Requests
- Saved Drafts

COMMUNICATION
- Messages
- Notifications

ACCOUNT
- Profile
```

Officer:

```text
WORK
- Dashboard
- My Queue
- Department Queue

REQUESTS
- Requests
- Waiting on Applicant
- Waiting on Department

HANDOFFS
- Incoming
- Outgoing
- Completed

COMMUNICATION
- Applicant Messages
- Internal Notes

ACCOUNT
- Notifications
- Profile
```

Supervisor additions:

```text
DEPARTMENT
- Department Overview
- Unassigned Work
- Assignments
- Overdue Work
- Approval Queue
- Department Report

Approval Queue links to the canonical approval route `/officer/requests/[id]/approval`.
```

Admin:

```text
OVERVIEW
- Dashboard

ORGANIZATION
- Organization Details
- Departments
- Users

SERVICES
- Services
- Forms
- Requirements
- Workflows

INSIGHTS
- Reports

SETTINGS
- Branding
- Feature Flags
```

## 10. Remove From Active V1 Navigation

- transfer creation;
- standalone payment workspace;
- public document verification;
- template marketplace;
- integration marketplace;
- visual workflow builder;
- visual form builder;
- homepage builder;
- custom report builder;
- data warehouse;
- AI routing;
- AI document analysis;
- OCR;
- capacity balancing;
- cross-organization workflows;
- native mobile administration;
- enterprise SSO.

## 11. Shared State Requirements

Each V1 page needs loading, empty, error, permission-denied where relevant, mobile behavior, keyboard access, page title/breadcrumb, and clear data freshness expectations.

## 12. Coding-Agent Instruction

Build only V1-required pages unless explicitly authorized. Do not add active navigation for postponed features.
