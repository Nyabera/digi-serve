# FAIDIA Stage 0 — V1 Product Specification

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

FAIDIA V1 proves that one formal institutional service request can move from applicant submission through officer review, departmental collaboration, approval, controlled outcome issuance, applicant tracking, audit history, notifications, and reporting inside one traceable system.

The V1 build is narrow and end-to-end. It is not a visual-only prototype and it is not the full future FAIDIA platform.

## 2. Approved Product Definition

Product category: **Service Operations Platform**.

Positioning: **FAIDIA is the workflow and verification layer for institutional services.**

Core assumption: institutions will adopt FAIDIA because their current mix of paper, walk-ins, spreadsheets, email, calls, and WhatsApp does not provide one continuous request record, clear ownership, structured handoffs, reliable applicant tracking, or management visibility.

Central validation question: can a real institution process one formal service request end-to-end in FAIDIA with less external coordination, clearer ownership, and better visibility than its current process?

## 3. Approved First Market Scenario

Target institution type: **Kenyan TVET, technical college, or small private college**.

Demo organization: **Savannah Technical College**.

Demo departments:

1. **Student Records** — originating and coordinating department.
2. **Finance** — receiving department for hold/payment-reference verification.
3. **Registrar** — final approval and outcome authorization.

Demo data must be synthetic or non-sensitive.

## 4. Approved V1 Service Scope

Fully functional V1 service: **Transcript Request**.

Controlled demonstration services:

1. **Student Clearance Request**.
2. **Certificate Replacement Request**.

Only Transcript Request must work end-to-end for Stage 1. The two demonstration services prove configuration direction but may use simpler workflows.

## 5. Transcript Request Definition

The applicant requests an academic transcript or controlled transcript-related outcome. The institution reviews applicant identity, academic record information, and Finance status before approval and outcome issuance.

Approved eligibility baseline:

- applicant is a current or former student;
- applicant provides admission or student number;
- institution can locate the academic record;
- applicant accepts the accuracy declaration;
- Finance hold may block issuance even when submission is allowed;
- third-party requests are postponed unless a pilot explicitly requires them.

## 6. Approved Form Data

Applicant information:

- full legal name;
- email;
- phone number;
- admission or student number;
- national ID or passport number;
- former name where relevant.

Academic information:

- programme;
- department or school;
- campus where relevant;
- year of admission;
- year of completion or graduation;
- study mode where relevant.

Request information:

- transcript purpose;
- one copy only for Stage 1;
- delivery method: controlled download or physical collection;
- recipient details where relevant;
- manual payment reference;
- additional notes.

Confirmation:

- accuracy declaration;
- consent or acknowledgement required by the institution.

## 7. Approved Documents

Required:

- national ID or passport.

Conditional:

- student ID or equivalent institutional identifier where available;
- payment receipt or reference evidence where required;
- name-change evidence;
- authorization letter where future policy requires it.

Applicant-supplied documents use status `ACCEPTED`, not `APPROVED`, when they satisfy requirements.

## 8. Approved Fee Model

V1 uses **manual payment reference**. Payment remains inside the request form/review flow.

V1 does not require:

- standalone applicant payment workspace;
- standalone admin payment configuration;
- live M-PESA;
- PayBill reconciliation;
- refunds;
- fee-waiver workflow.

## 9. Approved Finance Verification

Finance verifies whether the applicant has a hold that blocks transcript issuance. Where a manual payment reference is provided, Finance may use it as supporting evidence.

Required Finance result codes:

- `CLEAR`
- `HOLD`
- `CANNOT_VERIFY`

If Finance returns `HOLD`, the request returns to applicant action with a clear applicant-visible explanation or next step. It is not automatically rejected.

## 10. Approved Outcome And Completion

V1 outcome: **Completion / Collection / Dispatch Notice**, with a controlled sample transcript PDF in demo mode.

The institution or its current process creates the official transcript. FAIDIA stores the exact issued copy or controlled issued outcome.

Request lifecycle meaning:

- `APPROVED`: decision recorded;
- `OUTCOME_READY`: controlled outcome available;
- `COMPLETED`: recorded download, collection, delivery, or approved institutional closure rule.

FAIDIA must not claim to generate a legally valid transcript unless the institution provides official data, template, signing method, approval process, and legal authority.

## 11. Approved Roles

V1 roles:

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ORGANIZATION_ADMIN`

Optional internal support role:

- `PLATFORM_ADMIN`

Registrar approval is required for every Transcript Request in Stage 1. The Registrar is represented through explicit approval permission, normally on the Supervisor role or an authorized staff membership.

Organization Admin does not automatically receive access to sensitive request content.

## 12. Approved Workflow Summary

1. Applicant discovers Transcript Request.
2. Applicant registers or signs in using email.
3. System creates a draft.
4. Applicant completes the form.
5. Applicant uploads documents.
6. Applicant reviews and submits.
7. Duplicate active request is blocked unless staff override exists.
8. Student Records receives the request.
9. Officer starts review.
10. Officer requests correction where needed.
11. Applicant corrects and resubmits.
12. Student Records creates Finance referral.
13. Finance accepts and completes verification.
14. Finance returns `CLEAR`, `HOLD`, or `CANNOT_VERIFY`.
15. If `HOLD`, applicant receives clear action.
16. Records completes work when prerequisites are met.
17. Request moves to Registrar approval.
18. Registrar approves or rejects.
19. FAIDIA records or stores the controlled outcome.
20. Applicant is notified.
21. Applicant downloads or collects outcome.
22. Request is completed and audit history remains available.

Transfer is postponed from the Stage 1 main path.

## 13. Minimum V1 Product Surface

Public and authentication:

- organization service homepage or catalogue;
- service details;
- registration;
- sign in;
- email verification;
- password reset;
- staff invitation acceptance;
- organization selection only for staff with multiple memberships.

Applicant:

- dashboard;
- browse services;
- start request;
- form;
- document upload;
- review and submit;
- confirmation;
- My Requests;
- request details and timeline;
- correction response;
- messages;
- notifications;
- outcome access;
- account;
- saved drafts.

Officer and supervisor:

- dashboard;
- My Queue;
- Department Queue;
- request details;
- document review;
- internal notes;
- applicant messages;
- correction action;
- create referral;
- incoming/outgoing handoffs;
- handoff details;
- work-item completion;
- approval/rejection;
- department dashboard;
- unassigned work;
- assignments;
- overdue work;
- approval queue;
- basic department reporting.

Organization admin:

- admin dashboard;
- organization details;
- departments;
- users and invitations;
- memberships;
- services;
- controlled form configuration;
- document requirements;
- controlled workflow configuration;
- branding;
- feature flags;
- basic reports.

Standalone payment pages, transfer routes, visual builders, advanced workload tools, public verification, and custom report builders are not required for Stage 1.

## 14. Pilot Posture

Stage 1 may proceed using documented current-process assumptions and synthetic data. Before external pilot, validate current manual process assumptions with the institution.

Pilot posture:

- synthetic demo first;
- carefully limited real pilot data later;
- founder plus service-owner support;
- weekly staff feedback;
- short applicant feedback;
- structured issue log.

In-app notifications are required for demo. Email is optional for internal demo and required before external pilot.

## 15. Success Criteria

V1 is functionally successful when:

- organization and departments can be configured;
- an applicant can register, sign in, and submit a Transcript Request;
- required documents and manual payment reference are captured;
- duplicate active requests are controlled;
- Student Records can review and request correction;
- applicant can correct and resubmit;
- Student Records can create Finance referral;
- Finance can accept and complete verification;
- HOLD returns applicant to clear action;
- Registrar can approve or reject;
- FAIDIA stores or records the controlled outcome;
- applicant can access outcome;
- request completes at recorded download/collection/closure;
- supervisor can see stage durations and backlog;
- audit history contains the complete sequence;
- tenant and department permissions hold.

## 16. Approval Checklist

- [x] Purpose approved.
- [x] Core assumption approved.
- [x] Target institution approved.
- [x] Transcript Request approved.
- [x] Demo services approved.
- [x] Demo organization approved.
- [x] Departments approved.
- [x] Fee decision resolved.
- [x] Form and documents approved.
- [x] Final outcome approved.
- [x] Roles and permissions approved.
- [x] Vertical slice approved.
- [x] Status mappings approved.
- [x] Page classifications approved.
- [x] Non-goals approved.
- [x] Pilot boundary approved.
- [x] Open decisions do not block Stage 1.

## 17. Coding-Agent Instruction

Implement only the approved step in the current task. Do not invent statuses, roles, workflow steps, pages, permissions, or service rules. Preserve parent ownership during referral, use server-side authorization, and record audit/status history for critical actions.
