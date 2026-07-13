# FAIDIA Stage 0 — Roles And Permissions Matrix

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines fixed V1 roles, exact Stage 1 grants, permission scopes, and access boundaries.

The exact grant registry in Section 6 is authoritative. Any permission not listed for a role/profile is denied.

## 2. Authorization principles

Every organization-owned action validates:

1. authenticated user;
2. active organization membership;
3. active organization context;
4. exact permission;
5. department scope;
6. ownership, assignment, or handoff scope;
7. current workflow state;
8. server-side authorization;
9. database/storage policy as defense in depth.

Hidden UI is not authorization.

## 3. Roles and profiles

### `APPLICANT`

Scope: `SELF`.

May use owned services, drafts, requests, messages, notifications, documents, and outcomes.

Never sees another applicant's data, internal notes, private handoff detail, or confidential Finance detail.

### `OFFICER`

Scope: assigned/claimed work and permitted own-department work.

May review, request correction, create/receive referrals, communicate, review documents, complete work items, and process authorized outcomes.

An ordinary Officer may not:

- approve;
- reject;
- return an approval for clarification;
- reopen a final request;
- manually close a request;
- access unrelated departments or organizations;
- manage configuration.

### `SUPERVISOR`

Scope: own department unless an explicit permission states otherwise.

May assign/reassign, monitor, intervene, reopen, and view department reports.

A standard Supervisor does not automatically receive approval grants.

### Supervisor shell model

Supervisors use the shared Officer processing shell.

They inherit the Officer processing experience and receive additional supervisor-only navigation items, dashboards, monitoring controls, assignment controls, reopening controls, manual-closure controls, and department-level reporting according to their exact permissions.

Stage 1 must not create a second duplicate request-processing shell for Supervisors.

Supervisor-only controls must be hidden when permission is absent, but hidden UI is not sufficient authorization. Every protected action must also be checked server-side.

### Registrar profile

### Registrar request-decision route

The Registrar profile uses the approval queue at:

```text
/supervisor/approvals

Registrar is a `SUPERVISOR` membership profile labelled **Registrar**.

Only this profile receives:

- `requests.approve`
- `requests.reject`
- `requests.return_for_clarification`

No separate top-level Registrar role exists.

### `ORGANIZATION_ADMIN`

Scope: organization configuration and organization-level aggregate reporting.

Organization Admin may manage organization details, departments, memberships, seeded service metadata, publication, branding, and feature flags.

Organization Admin has no V1 access to:

- sensitive request content;
- applicant documents;
- applicant messages;
- internal notes;
- operational handoff detail;
- issued outcome files.

The duplicate-active override may use minimum request metadata only.

### `PLATFORM_ADMIN`

Optional internal FAIDIA support role. It is outside ordinary organization navigation and has no grant through this Stage 1 registry.

## 4. Scopes

| Scope | Meaning |
|---|---|
| `SELF` | Applicant-owned records |
| `ASSIGNED` | Work assigned to staff member |
| `DEPARTMENT` | One active permitted department |
| `MULTIPLE_DEPARTMENTS` | Explicitly assigned departments |
| `ORGANIZATION_METADATA` | Aggregate/configuration metadata without sensitive request content |
| `PLATFORM` | Internal cross-organization administration |

## 5. Permission keys

Requests:

- `requests.create`
- `requests.view_self`
- `requests.view_assigned`
- `requests.view_department`
- `requests.view_organization_metadata`
- `requests.update_draft`
- `requests.start_review`
- `requests.return_for_correction`
- `requests.return_for_clarification`
- `requests.approve`
- `requests.reject`
- `requests.cancel`
- `requests.complete`
- `requests.manual_close`
- `requests.reopen`
- `requests.override_duplicate_active`

Assignment/work:

- `assignments.claim`
- `assignments.assign`
- `assignments.reassign`
- `work_items.view_assigned`
- `work_items.view_department`
- `work_items.start`
- `work_items.complete`
- `work_items.return`

Handoffs:

- `handoffs.create_referral`
- `handoffs.view_incoming`
- `handoffs.view_outgoing`
- `handoffs.accept`
- `handoffs.decline`
- `handoffs.return_for_clarification`
- `handoffs.assign_receiving_officer`
- `handoffs.complete`
- `handoffs.cancel`

Documents/outcomes:

- `documents.upload`
- `documents.view_self`
- `documents.view_assigned`
- `documents.review`
- `documents.accept`
- `documents.reject`
- `documents.download`
- `documents.issue`
- `documents.revoke`

Communication:

- `messages.send_applicant`
- `messages.read_applicant`
- `internal_notes.create`
- `internal_notes.read_department`
- `internal_notes.read_supervisor`

Configuration:

- `services.view`
- `services.configure`
- `services.publish`
- `forms.configure_limited`
- `workflows.publish_seeded`
- `organizations.manage`
- `departments.manage`
- `users.invite`
- `memberships.manage`
- `roles.assign_fixed`
- `branding.manage`
- `features.manage`

Reporting/audit:

- `reports.view_self`
- `reports.view_department`
- `reports.view_organization`
- `reports.view_financial`
- `reports.view_audit`
- `reports.export`
- `audit.view_request`
- `audit.view_department`
- `audit.view_organization`

## 6. Exact Stage 1 grant registry

| Group | Applicant | Officer | Supervisor | Registrar profile additions | Organization Admin |
|---|---|---|---|---|---|
| Requests | `requests.create`, `requests.view_self`, `requests.update_draft`, `requests.cancel` | `requests.view_assigned`, `requests.view_department`, `requests.start_review`, `requests.return_for_correction`, `requests.cancel`, `requests.complete` | Officer grants plus `requests.view_organization_metadata`, `requests.reopen`, `requests.override_duplicate_active`, `requests.manual_close` | `requests.approve`, `requests.reject`, `requests.return_for_clarification` | `requests.view_organization_metadata`, `requests.override_duplicate_active` |
| Assignment/work | None | `assignments.claim`, `work_items.view_assigned`, `work_items.view_department`, `work_items.start`, `work_items.complete`, `work_items.return` | Officer grants plus `assignments.assign`, `assignments.reassign` | None | None |
| Handoffs | None | `handoffs.create_referral`, `handoffs.view_incoming`, `handoffs.view_outgoing`, `handoffs.accept`, `handoffs.decline`, `handoffs.return_for_clarification`, `handoffs.complete` | Officer grants plus `handoffs.assign_receiving_officer`, `handoffs.cancel` | None | None |
| Documents/outcomes | `documents.upload`, `documents.view_self`, `documents.download` | `documents.upload`, `documents.view_assigned`, `documents.review`, `documents.accept`, `documents.reject`, `documents.download`, `documents.issue` | Officer grants plus `documents.revoke` | None | None |
| Communication | `messages.send_applicant`, `messages.read_applicant` | `messages.send_applicant`, `messages.read_applicant`, `internal_notes.create`, `internal_notes.read_department` | Officer grants plus `internal_notes.read_supervisor` | None | None |
| Configuration | `services.view` | `services.view` | `services.view` | None | `services.view`, `services.configure`, `services.publish`, `forms.configure_limited`, `workflows.publish_seeded`, `organizations.manage`, `departments.manage`, `users.invite`, `memberships.manage`, `roles.assign_fixed`, `branding.manage`, `features.manage` |
| Reporting/audit | `reports.view_self` | `reports.view_self`, `reports.view_department`, `audit.view_request` | Officer grants plus `reports.view_financial`, `reports.view_audit`, `reports.export`, `audit.view_department` | None | `reports.view_organization`, `reports.view_audit`, `reports.export`, `audit.view_organization` |

## 7. Hard constraints

```md
- Supervisors use the shared Officer processing shell with supervisor-only navigation and controls.
- `/supervisor/approvals` is a queue route, not a separate processing workspace.
- Approval-queue links open `/officer/requests/[id]`.
- Registrar decision controls are embedded in `/officer/requests/[id]`.
- Registrar decision controls are rendered only when the active membership has the required permissions.
- Approval, rejection, and return-for-clarification must always be re-authorized server-side.
- `/officer/requests/[id]/approval` must not be implemented.

- Officer approval is denied even when the Officer can view the request.
- Standard Supervisor approval is denied unless the membership has the Registrar profile additions.
- Organization Admin configuration access never implies request-content access.
- Organization Admin duplicate override shows only request reference, applicant identifier needed for duplicate matching, service, status, creation date, and override reason field.
- `requests.complete` for Officers is limited to recording physical collection from `OUTCOME_READY`.
- Controlled download completion is performed by the system after authorized access.
- `requests.manual_close` is Supervisor-only and valid only from `OUTCOME_READY`.
- `requests.reopen` is Supervisor-only and valid only for `REJECTED` or `COMPLETED`.
- `documents.revoke` is separate from reopening.
- No role may edit or delete audit events.

## 8. Department and assignment rules

- Officer actions require active department membership.
- Finance may access an assigned/claimed Finance referral without owning the parent request.
- Student Records remains coordinating owner during referral.
- Cross-department access requires an active handoff or explicit multi-department membership.
- Supervisor may assign/reassign within scope.
- Authorized Officers may claim unassigned work only in their department.
- Reassignment requires a reason.
- Completed work cannot be reassigned unless the request is reopened.
- Search applies the same authorization as direct access.

## 9. Approval rules

Approval eligibility requires:

- request `PENDING_APPROVAL`;
- required documents `ACCEPTED`;
- Finance result `CLEAR`;
- required work items complete;
- no unresolved correction or handoff;
- Registrar profile and exact permission.

Approval, rejection, and return for clarification create immutable decision and audit records.

## 10. Completion and reopening rules

Physical collection:

- Officer with `requests.complete`;
- assigned/permitted Student Records scope;
- request `OUTCOME_READY`;
- collection evidence required.

Manual closure:

- Supervisor with `requests.manual_close`;
- request `OUTCOME_READY`;
- reason code, note, and evidence required.

Reopen:

- Supervisor with `requests.reopen`;
- request `REJECTED` or `COMPLETED`;
- reason required;
- request returns `IN_REVIEW`;
- previous history preserved.

## 11. Required tests

- unauthenticated denial;
- applicant ownership isolation;
- organization isolation;
- cross-department denial;
- internal notes hidden from applicant;
- Finance access limited to referral;
- ordinary Officer approval denied;
- standard Supervisor approval denied without Registrar profile;
- Organization Admin sensitive request/document/message/note access denied;
- Officer self-claim limited to own department;
- duplicate override denied without permission and reason;
- manual closure denied to Officer;
- manual closure denied outside `OUTCOME_READY`;
- reopening denied to Officer and Organization Admin;
- reopening preserves history;
- search does not leak data;
- signed file access requires authorization;
- published versions are immutable.

## 12. Coding-agent instruction

Use shared server-side permission helpers. The exact registry is authoritative. Do not infer grants from navigation visibility, job titles, or broad role descriptions.
