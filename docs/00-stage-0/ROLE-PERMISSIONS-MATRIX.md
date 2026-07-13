# FAIDIA Stage 0 — Roles and Permissions Matrix

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This document defines the fixed V1 roles, permission scopes and access rules.

Authentication answers: **Who is this person?**

Authorization answers:

- Which organization do they belong to?
- Which department can they access?
- Which records can they view?
- Which actions can they perform?
- What scope applies?

V1 uses fixed role bundles. A visual permission editor is postponed.

## 2. Authorization principles

Every organization-owned action must validate:

1. authenticated user;
2. active organization membership;
3. active organization context;
4. required permission;
5. department scope where relevant;
6. ownership/assignment where relevant;
7. server-side authorization;
8. database/storage policy as defence in depth.

Hidden buttons are not security.

## 3. V1 roles

### `APPLICANT`

Purpose: submit and track their own requests.

Default scope: `SELF`.

Can:

- browse services;
- register and sign in;
- create/save drafts;
- submit requests;
- upload and replace permitted documents;
- view owned requests;
- view applicant-safe status/timeline;
- respond to corrections;
- send applicant-visible messages;
- receive notifications;
- access owned issued outcomes;
- update permitted account fields.

Cannot:

- view another applicant's request;
- view internal notes;
- view confidential handoff instructions;
- assign staff;
- approve/reject;
- manage organization configuration;
- view internal reports;
- download files without permission.

### `OFFICER`

Purpose: process assigned or permitted department work.

Default scopes: `ASSIGNED`; optionally `DEPARTMENT`.

Can:

- view assigned requests/work items;
- view unassigned department work if permitted;
- review form responses;
- review/accept/reject documents;
- add internal notes;
- send applicant-visible messages;
- start review;
- request corrections;
- create referrals;
- create transfers if permitted;
- complete work items;
- record handoff results;
- recommend approval/rejection where allowed;
- view request/handoff history in scope;
- claim work if enabled.

Cannot by default:

- manage users or departments;
- publish services/workflows;
- manage branding;
- view organization-wide reports;
- force transfers;
- approve outside explicit permission;
- access unrelated departments/organizations;
- edit audit events.

### `SUPERVISOR`

Purpose: control department workload, assignment, approvals and visibility.

Default scope: `DEPARTMENT`.

Can:

- perform permitted officer actions;
- view department requests/work;
- assign/reassign;
- view handoffs;
- accept transfers where policy permits;
- monitor overdue work;
- review blocked/repeatedly returned work;
- approve/reject authorized requests;
- return for clarification;
- view department reports;
- override selected actions with a reason;
- view permitted department audit information.

Cannot by default:

- manage organization-wide configuration;
- access another organization;
- edit audit events;
- access financial/audit reports without separate permission.

### `ORGANIZATION_ADMIN`

Purpose: configure one institution.

Default scope: `ORGANIZATION`.

Can:

- manage organization details;
- create/edit/deactivate departments;
- invite staff;
- manage memberships;
- assign fixed roles;
- assign department memberships;
- activate/deactivate services;
- configure service metadata;
- configure forms and document requirements;
- configure controlled workflow steps;
- publish new versions;
- manage basic branding;
- manage feature flags;
- view organization reports;
- view permitted admin audit information.

Cannot:

- edit/delete audit events;
- overwrite published versions used by requests;
- access another organization;
- bypass server permissions;
- automatically read every sensitive request unless separately permitted.

### `PLATFORM_ADMIN` — optional internal role

Used for FAIDIA support across organizations. Not required for the first institutional workflow and should not appear in ordinary organization navigation.

## 4. Permission scopes

| Scope | Meaning |
|---|---|
| `SELF` | Applicant-owned records |
| `ASSIGNED` | Work assigned to the staff member |
| `DEPARTMENT` | One permitted department |
| `MULTIPLE_DEPARTMENTS` | Specifically assigned departments |
| `ORGANIZATION` | Current organization |
| `PLATFORM` | Cross-organization internal administration |

A role does not automatically imply every scope.

## 5. Recommended permission keys

### Requests

- `requests.create`
- `requests.view_self`
- `requests.view_assigned`
- `requests.view_department`
- `requests.view_organization`
- `requests.update_draft`
- `requests.start_review`
- `requests.return_for_correction`
- `requests.approve`
- `requests.reject`
- `requests.cancel`
- `requests.complete`
- `requests.reopen`

### Assignment and work items

- `assignments.claim`
- `assignments.assign`
- `assignments.reassign`
- `work_items.view_assigned`
- `work_items.view_department`
- `work_items.start`
- `work_items.complete`
- `work_items.return`

### Handoffs

- `handoffs.create_referral`
- `handoffs.create_transfer`
- `handoffs.view_incoming`
- `handoffs.view_outgoing`
- `handoffs.accept`
- `handoffs.decline`
- `handoffs.return_for_clarification`
- `handoffs.assign_receiving_officer`
- `handoffs.complete`
- `handoffs.cancel`
- `handoffs.force_transfer`

### Documents

- `documents.upload`
- `documents.view_self`
- `documents.view_assigned`
- `documents.review`
- `documents.accept`
- `documents.reject`
- `documents.download`
- `documents.issue`
- `documents.revoke`

### Communication

- `messages.send_applicant`
- `messages.read_applicant`
- `internal_notes.create`
- `internal_notes.read_department`
- `internal_notes.read_supervisor`

### Configuration

- `services.view`
- `services.configure`
- `services.publish`
- `forms.configure`
- `workflows.configure`
- `workflows.publish`
- `organizations.manage`
- `departments.manage`
- `users.invite`
- `memberships.manage`
- `roles.assign_fixed`
- `branding.manage`
- `features.manage`

### Reporting and audit

- `reports.view_self`
- `reports.view_department`
- `reports.view_organization`
- `reports.view_financial`
- `reports.view_audit`
- `reports.export`
- `audit.view_request`
- `audit.view_department`
- `audit.view_organization`

## 6. Role matrix

Legend:

- **Yes** — default bundle;
- **Conditional** — depends on explicit permission/scope/workflow;
- **No** — excluded by default.

| Capability | Applicant | Officer | Supervisor | Org Admin |
|---|---:|---:|---:|---:|
| Browse active services | Yes | Yes | Yes | Yes |
| Create own request | Yes | No | No | No |
| Edit own draft | Yes | No | No | No |
| Submit own request | Yes | No | No | No |
| View own requests | Yes | No | No | No |
| View assigned requests | No | Yes | Yes | Conditional |
| View department queue | No | Conditional | Yes | Conditional |
| View organization requests | No | No | No | Conditional |
| Start review | No | Yes | Yes | No |
| Review form responses | No | Yes | Yes | Conditional |
| Review documents | No | Yes | Yes | Conditional |
| Reject document with reason | No | Yes | Yes | Conditional |
| Request correction | No | Yes | Yes | No |
| Respond to correction | Yes | No | No | No |
| Add internal note | No | Yes | Yes | Conditional |
| Read internal notes | No | Assigned/Dept | Department | Conditional |
| Send applicant message | Yes | Yes | Yes | Conditional |
| Create referral | No | Yes | Yes | No |
| Accept referral | No | Conditional | Yes | No |
| Decline referral | No | Conditional | Yes | No |
| Complete referral | No | Assigned receiver | Yes | No |
| Create transfer | No | Conditional | Yes | No |
| Force transfer | No | No | Conditional | No |
| Claim unassigned work | No | Conditional | Yes | No |
| Assign officer | No | No | Yes | Conditional |
| Reassign officer | No | No | Yes | Conditional |
| Approve request | No | Conditional | Yes | No |
| Reject request | No | Conditional | Yes | No |
| Complete request | No | Conditional | Yes | No |
| Download own outcome | Yes | No | No | No |
| Issue outcome | No | Conditional | Yes | Conditional |
| Manage departments | No | No | No | Yes |
| Invite staff | No | No | No | Yes |
| Assign fixed roles | No | No | No | Yes |
| Configure service | No | No | No | Yes |
| Configure form | No | No | No | Yes |
| Configure workflow | No | No | No | Yes |
| Publish version | No | No | No | Yes |
| Manage branding | No | No | No | Yes |
| Manage feature flags | No | No | No | Yes |
| View department report | No | Limited | Yes | Yes |
| View organization report | No | No | Conditional | Yes |
| Edit audit events | No | No | No | No |

## 7. Department rules

- officer actions require active department membership;
- Finance officer may access the referral without owning the parent request;
- Student Records remains coordinating owner during referral;
- Registrar needs explicit approval permission;
- cross-department access requires a handoff, supervisory scope or explicit multi-department permission;
- search must respect the same permissions as direct access.

## 8. Assignment rules

Recommended:

- supervisor can assign and reassign;
- authorized officers may claim unassigned work in their department;
- reassignment requires a reason;
- completed work cannot be reassigned without controlled reopening;
- assigned officer must belong to the owning department;
- cross-department assignment is not a handoff substitute;
- automatic routing and capacity balancing are postponed.

**Decision required:** confirm whether self-assignment is enabled.

## 9. Approval rules

- approval permission is explicit;
- required work items must be complete;
- required documents must be accepted;
- required handoff results must exist;
- request must be in a valid state;
- approval creates decision and audit records;
- repeat approval cannot issue duplicate outcomes;
- approved requests are normally read-only.

## 10. Administrative separation

Organization administration should not automatically grant unrestricted access to sensitive request content.

Separate where possible:

- configuration;
- operational records;
- financial reports;
- audit reports;
- platform support.

## 11. Server-side checks

### Accept referral

Validate:

- user authenticated;
- active membership;
- same organization;
- receiving department matches;
- `handoffs.accept`;
- handoff currently `PENDING_ACCEPTANCE`.

### View document

Validate:

- user authenticated;
- organization matches;
- applicant owns request or staff has scope;
- document visibility allows access;
- signed URL generated only after authorization.

### Approve

Validate:

- authentication;
- active membership;
- approval permission;
- valid state and prerequisites;
- idempotency;
- transaction creates decision, history and audit event.

## 12. Required tests

- unauthenticated route access;
- applicant ownership isolation;
- Institution A vs Institution B isolation;
- cross-department denial;
- internal notes hidden from applicant;
- Finance sees referral but not unrelated work;
- only permitted user accepts handoff;
- only permitted user approves/rejects;
- admin cannot edit audit events;
- search does not leak;
- signed file access requires authorization.

## 13. Coding-agent instruction

> Use shared server-side permission helpers rather than scattered role-name checks. Do not add a new role when department membership or a permission scope can represent the distinction.
