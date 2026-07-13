# FAIDIA Stage 0 — Roles And Permissions Matrix

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document defines fixed V1 roles, permission scopes, and access rules.

Authentication answers: who is this person?

Authorization answers:

- Which organization do they belong to?
- Which department can they access?
- Which records can they view?
- Which actions can they perform?
- What scope applies?

V1 uses fixed role bundles. A visual permission editor is postponed.

## 2. Authorization Principles

Every organization-owned action must validate:

1. authenticated user;
2. active organization membership;
3. active organization context;
4. required permission;
5. department scope where relevant;
6. ownership or assignment where relevant;
7. server-side authorization;
8. database/storage policy as defense in depth.

Hidden buttons are not security.

## 3. Approved Roles

### `APPLICANT`

Purpose: submit and track owned requests.

Default scope: `SELF`.

Can:

- browse active services;
- register and sign in;
- create/save drafts;
- submit requests;
- upload and replace permitted documents;
- provide manual payment reference;
- view owned requests;
- view applicant-safe timeline/status;
- respond to corrections and Finance HOLD actions;
- send applicant-visible messages;
- receive notifications;
- access owned issued outcomes;
- update permitted account fields.

Cannot:

- view another applicant's request;
- view internal notes;
- view confidential handoff or Finance details;
- assign staff;
- approve/reject;
- manage organization configuration;
- view internal reports;
- download files without authorization.

### `OFFICER`

Purpose: process assigned, claimed, or permitted department work.

Default scopes: `ASSIGNED`; optionally `DEPARTMENT`.

Can:

- view assigned requests/work items;
- view unassigned department work if permitted;
- claim unassigned work in own department if `assignments.claim` is enabled;
- review form responses;
- review, accept, or reject documents;
- add internal notes;
- send applicant-visible messages;
- start review;
- request corrections;
- create referrals;
- complete work items;
- record handoff results when receiving officer;
- recommend approval/rejection where allowed;
- view in-scope request/handoff history.

Cannot by default:

- manage users or departments;
- publish services/workflows;
- manage branding;
- view organization-wide reports;
- force transfers;
- approve outside explicit permission;
- access unrelated departments or organizations;
- edit audit events.

### `SUPERVISOR`

Purpose: control department workload, assignment, approvals, and visibility.

Default scope: `DEPARTMENT`.

Can:

- perform permitted officer actions;
- view department requests/work;
- assign/reassign;
- permit or perform department self-claim where configured;
- view handoffs;
- monitor overdue work;
- review blocked/repeatedly returned work;
- approve/reject authorized requests;
- return for clarification;
- view department reports;
- override selected actions with reason;
- view permitted department audit information.

Registrar approval is represented by a `SUPERVISOR` membership profile with membership label **Registrar** and explicit `requests.approve` / `requests.reject` permissions. Do not create a new top-level Registrar role.

Cannot by default:

- manage organization-wide configuration;
- access another organization;
- edit audit events;
- access financial/audit reports without separate permission.

### `ORGANIZATION_ADMIN`

Purpose: configure one institution.

Default scope: `ORGANIZATION` for configuration, not unrestricted operational content.

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
- view organization reports and permitted metadata.

Cannot:

- edit/delete audit events;
- overwrite published versions used by requests;
- access another organization;
- bypass server permissions;
- automatically read every sensitive request or file unless separately permitted.

### `PLATFORM_ADMIN`

Optional internal FAIDIA support role. Not required for the first institutional workflow and must not appear in ordinary organization navigation.

## 4. Permission Scopes

| Scope | Meaning |
|---|---|
| `SELF` | Applicant-owned records |
| `ASSIGNED` | Work assigned to staff member |
| `DEPARTMENT` | One permitted department |
| `MULTIPLE_DEPARTMENTS` | Specifically assigned departments |
| `ORGANIZATION` | Current organization, within permission limits |
| `PLATFORM` | Cross-organization internal administration |

A role does not automatically imply every scope.

## 5. Approved Permission Keys

Requests:

- `requests.create`
- `requests.view_self`
- `requests.view_assigned`
- `requests.view_department`
- `requests.view_organization_metadata`
- `requests.update_draft`
- `requests.start_review`
- `requests.return_for_correction`
- `requests.approve`
- `requests.reject`
- `requests.cancel`
- `requests.complete`
- `requests.reopen`
- `requests.override_duplicate_active`

Assignment and work items:

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

Transfer permissions are postponed from Stage 1 required scope.

Documents:

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

Reporting and audit:

- `reports.view_self`
- `reports.view_department`
- `reports.view_organization`
- `reports.view_financial`
- `reports.view_audit`
- `reports.export`
- `audit.view_request`
- `audit.view_department`
- `audit.view_organization`

## 6. Role Matrix

| Capability | Applicant | Officer | Supervisor / Registrar | Org Admin |
|---|---:|---:|---:|---:|
| Browse active services | Yes | Yes | Yes | Yes |
| Create own request | Yes | No | No | No |
| Edit own draft | Yes | No | No | No |
| Submit own request | Yes | No | No | No |
| View own requests | Yes | No | No | No |
| View assigned requests | No | Yes | Yes | Conditional |
| View department queue | No | Conditional | Yes | Conditional metadata |
| View organization request content | No | No | Conditional | Conditional explicit permission |
| Start review | No | Yes | Yes | No |
| Review form responses | No | Yes | Yes | Conditional explicit permission |
| Review documents | No | Yes | Yes | Conditional explicit permission |
| Accept/reject documents | No | Yes | Yes | Conditional explicit permission |
| Request correction | No | Yes | Yes | No |
| Respond to correction | Yes | No | No | No |
| Add internal note | No | Yes | Yes | Conditional explicit permission |
| Read internal notes | No | Assigned/Dept | Department | Conditional explicit permission |
| Send applicant message | Yes | Yes | Yes | Conditional |
| Create referral | No | Yes | Yes | No |
| Accept referral | No | Conditional | Yes | No |
| Decline referral | No | Conditional | Yes | No |
| Complete referral | No | Assigned receiver | Yes | No |
| Claim unassigned work | No | Conditional own dept | Yes | No |
| Assign/reassign officer | No | No | Yes | Conditional |
| Approve/reject request | No | Conditional explicit permission | Yes | No |
| Override duplicate active request block | No | No | Yes | Conditional explicit permission |
| Complete request | No | Conditional | Yes | No |
| Download own outcome | Yes | No | No | No |
| Issue outcome | No | Conditional | Yes | Conditional explicit permission |
| Manage configuration | No | No | No | Yes |
| Manage feature flags | No | No | No | Yes |
| View department report | No | Limited | Yes | Yes |
| View organization report | No | No | Conditional | Yes |
| Edit audit events | No | No | No | No |

## 7. Department Rules

- Officer actions require active department membership.
- Finance officer may access assigned Finance referral without owning the parent request.
- Student Records remains coordinating owner during referral.
- Registrar needs explicit approval permission.
- Registrar is a Supervisor membership profile labelled Registrar, not a separate top-level role.
- Cross-department access requires handoff, supervisory scope, or explicit multi-department permission.
- Search must respect the same permissions as direct access.

## 8. Assignment Rules

Approved:

- supervisor can assign and reassign;
- authorized officers may claim unassigned work in their own department;
- reassignment requires a reason;
- completed work cannot be reassigned without controlled reopening;
- assigned officer must belong to the owning department;
- cross-department assignment is not a handoff substitute;
- automatic routing and capacity balancing are postponed.

## 9. Approval Rules

- Registrar approval is required for every Transcript Request.
- Approval permission is explicit.
- Required work items must be complete.
- Required documents must be accepted.
- Required Finance result must exist.
- Request must be in `PENDING_APPROVAL`.
- Approval creates decision and audit records.
- Repeat approval cannot issue duplicate outcomes.
- Approved requests are normally read-only except outcome processing.

## 10. Duplicate Override Rules

- Applicants cannot override duplicate active request blocking.
- Default officers cannot override duplicate active request blocking.
- Supervisors may override with `requests.override_duplicate_active`.
- Organization Admin may override only with explicit `requests.override_duplicate_active`.
- Override happens from staff-side request review/intervention, not applicant self-service.
- Override requires a mandatory reason and records `DUPLICATE_REQUEST_OVERRIDE_GRANTED`.

## 11. Required Tests

- unauthenticated route access;
- applicant ownership isolation;
- organization isolation;
- cross-department denial;
- internal notes hidden from applicant;
- Finance sees referral but not unrelated work;
- only permitted user accepts handoff;
- only permitted user approves/rejects;
- officer self-claim limited to own department;
- duplicate override denied without `requests.override_duplicate_active`;
- duplicate override creates audit event and mandatory reason;
- admin cannot edit audit events;
- admin cannot automatically access sensitive request content;
- search does not leak;
- signed file access requires authorization.

## 12. Coding-Agent Instruction

Use shared server-side permission helpers. Do not add roles when department membership or permission scope can represent the distinction.
