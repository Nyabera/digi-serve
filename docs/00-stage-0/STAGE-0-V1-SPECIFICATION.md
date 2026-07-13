# FAIDIA Stage 0 — V1 Product Specification

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose of this document

This is the primary Stage 0 source of truth. It defines what FAIDIA V1 must prove, the first market scenario, the first services, the users, the pilot boundary, the required operational journey and the decisions that coding agents must not silently change.

It does **not** freeze final CSS values, exact component code or the finished shell implementation. Those are finalized later.

## 2. Product definition

### Product category

FAIDIA is a **Service Operations Platform** for institutions that need to digitize requests, approvals, documents, certificates, renewals, verification and service delivery.

### Positioning

> FAIDIA is the workflow and verification layer for institutional services.

### Single purpose of V1

> Prove that one formal institutional service request can move from applicant submission through officer review, departmental collaboration, approval and final outcome inside one traceable system.

### Core assumption V1 must prove or disprove

> Institutions will adopt FAIDIA because their current mix of paper, walk-ins, spreadsheets, email, calls and WhatsApp does not provide one continuous request record, clear ownership, structured handoffs, reliable applicant tracking or management visibility.

### Central validation question

> Can a real institution process one formal service request end-to-end in FAIDIA with less external coordination, clearer ownership and better visibility than its current process?

## 3. First market scenario

### Target institution type

**Recommended default:** a Kenyan TVET, technical college or small private college.

Why:

- transcript, clearance and certificate workflows are familiar;
- there are enough departments to validate handoffs;
- the organization is usually simpler than a large university;
- a limited pilot is realistic;
- the underlying architecture can remain generic.

### Demonstration organization

**Savannah Technical College**

This is a fictional seeded institution for repeatable demos. It must use synthetic or non-sensitive data.

### Demonstration departments

1. **Student Records** — coordinating and originating department.
2. **Finance** — receiving department for a defined verification referral.
3. **Registrar** — final approval and outcome authorization.

## 4. Operational problem

Formal service requests are often spread across:

- walk-ins and physical counters;
- paper forms;
- email inboxes;
- WhatsApp messages;
- phone calls;
- spreadsheets;
- manually moved files;
- informal manager approvals;
- repeated applicant follow-ups.

This causes:

- unclear ownership;
- lost or duplicated requests;
- missing documents;
- inconsistent correction instructions;
- slow interdepartmental coordination;
- work happening outside an auditable system;
- no reliable stage-duration data;
- repeated applicant status enquiries;
- poor supervisor visibility;
- weak evidence of who approved what and when.

## 5. V1 service scope

### Fully functional service

**Transcript Request**

It must support:

- public service discovery;
- registration and sign-in;
- draft creation and saving;
- form completion;
- document upload;
- review and submission;
- officer queue entry;
- document review;
- correction and resubmission;
- Finance referral;
- receiving-department acceptance and completion;
- final approval or rejection;
- controlled outcome issuance;
- applicant tracking;
- notifications;
- timestamps;
- audit history;
- basic operational reporting.

### Two demonstration services

1. **Student Clearance Request**
2. **Certificate Replacement Request**

These services should prove that FAIDIA is configuration-driven rather than transcript-specific. They may use simpler workflows.

## 6. Transcript Request definition

### Service description

> Request an academic transcript or controlled transcript-related outcome. The institution reviews the applicant's identity, academic record and applicable Finance status before approval and issuance.

### Eligibility

Recommended rules:

- applicant is a current or former student;
- applicant provides a valid admission or student number;
- the institution can locate the academic record;
- applicant accepts the accuracy declaration;
- an institutional hold may block issuance even when submission is allowed;
- third-party requests are postponed unless the pilot explicitly requires them.

### Recommended form fields

#### Applicant information

- full legal name;
- email;
- phone number;
- admission or student number;
- national ID or passport number where policy requires it;
- former name where relevant.

#### Academic information

- programme;
- department or school;
- campus;
- year of admission;
- year of completion or graduation;
- study mode where relevant.

#### Request information

- transcript purpose;
- number of copies;
- delivery method;
- recipient name or institution;
- recipient email or postal details;
- additional notes.

#### Confirmation

- accuracy declaration;
- consent or acknowledgement required by the institution.

### Required documents

Recommended baseline:

- national ID or passport;
- student ID or equivalent institutional identifier where available.

Conditional:

- payment receipt or reference;
- name-change evidence;
- authorization letter;
- previous transcript copy;
- another pilot-specific requirement.

Each document rule must define:

- required, conditional or optional;
- accepted file types;
- maximum size;
- reviewer;
- rejection reasons;
- whether replacement is allowed.

### Fee

**Decision required**

Choose one:

1. no fee;
2. manual payment reference;
3. institution cashier confirmation.

Do not make live M-PESA a V1 blocker unless payment is the main pilot problem.

### Processing target

**Recommended demo target:** five working days overall.

V1 may calculate straightforward elapsed hours or days before adding business calendars.

### Final issued outcome

**Recommended default:** a Transcript Request Completion / Collection / Dispatch Notice, with a controlled sample transcript PDF in demo mode.

FAIDIA should not claim to generate a legally valid transcript unless the institution provides and authorizes the official data source, template, approval process and signing method.

## 7. V1 roles

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ORGANIZATION_ADMIN`

Optional internal role:

- `PLATFORM_ADMIN`

See [ROLE-PERMISSIONS-MATRIX.md](./ROLE-PERMISSIONS-MATRIX.md).

## 8. V1 journey summary

1. Applicant discovers Transcript Request.
2. Applicant authenticates.
3. System creates a draft.
4. Applicant completes the form.
5. Applicant uploads documents.
6. Applicant reviews and submits.
7. Student Records receives the request.
8. Records officer starts review.
9. Officer requests a correction where necessary.
10. Applicant corrects and resubmits.
11. Records creates a Finance referral.
12. Finance accepts and completes the verification.
13. Result returns to Records.
14. Records completes its work.
15. Registrar reviews the complete request.
16. Registrar approves or rejects.
17. FAIDIA records or generates the controlled outcome.
18. Applicant is notified.
19. Applicant accesses the outcome.
20. Request is completed and the audit history remains available.

See [V1-VERTICAL-SLICE.md](./V1-VERTICAL-SLICE.md).

## 9. Handoff rules

### Referral

- originating department keeps parent-request ownership;
- receiving department performs a defined action;
- requested action, reason, expected output and due date are mandatory;
- receiving department may accept, decline or return for clarification;
- completion requires a structured result;
- applicant sees a controlled public status, not raw handoff detail.

### Transfer

- used only when responsibility genuinely changes;
- receiving department becomes owner only after acceptance;
- decline requires a reason;
- forced transfer requires higher permission;
- full ownership history is retained.

## 10. Applicant-visible status policy

Applicants may see:

- Draft;
- Submitted;
- In Review;
- Action Required;
- Additional Checks in Progress;
- Awaiting Decision;
- Approved;
- Preparing Outcome;
- Ready;
- Completed;
- Rejected;
- Cancelled.

Applicants must not see:

- internal notes;
- raw handoff instructions;
- confidential Finance details;
- officer disputes;
- permission changes;
- unnecessary bureaucratic states.

See [STATUS-MAPPINGS.md](./STATUS-MAPPINGS.md).

## 11. Success criteria

V1 is functionally successful when:

- an organization can be configured;
- an admin can activate the service;
- an applicant can register and sign in;
- an applicant can submit a request and upload documents;
- the request reaches the correct queue;
- an officer can review and request corrections;
- the applicant can correct and resubmit;
- an officer can create a Finance referral;
- Finance can accept and complete it;
- the originating officer receives the result;
- an authorized user can approve or reject;
- the applicant receives and accesses the outcome;
- the supervisor can see stage durations and backlog information;
- the full sequence appears in audit history;
- organization and department isolation work.

## 12. Validation metrics

### Applicant

- service-view-to-form-start rate;
- submission rate;
- abandonment rate;
- correction rate;
- correction response time;
- tracking-page visits;
- status enquiries outside FAIDIA.

### Officer and department

- time to first officer action;
- active processing time;
- referral acceptance time;
- referral completion time;
- overdue work;
- reassignment rate;
- work completed inside FAIDIA;
- work completed through email, phone or WhatsApp.

### Institution

- end-to-end turnaround time;
- completion rate;
- percentage completed without external coordination;
- reduction in lost requests;
- reduction in status enquiries;
- visibility of current ownership;
- number processed end-to-end.

### Provisional pilot targets

- 20–50 controlled request attempts;
- at least 80% completed without a workflow-blocking defect;
- every active request shows a current owner;
- no unauthorized cross-organization access;
- core staff complete the journey after basic training;
- external coordination is measured rather than ignored.

## 13. Limited pilot boundary

Recommended:

- one actual institution;
- one primary service and optionally one secondary service;
- one service owner;
- one supervisor;
- three to five officers;
- one to three departments;
- a limited applicant group;
- weekly feedback sessions;
- manual founder support;
- controlled or carefully limited data.

Do not onboard the entire institution in the first pilot.

## 14. Minimum V1 product surface

### Public and authentication

- organization service homepage or catalogue;
- service details;
- registration;
- sign in;
- email verification;
- password reset;
- staff invitation acceptance.

### Applicant

- dashboard;
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
- account.

### Officer and supervisor

- officer dashboard;
- My Queue;
- Department Queue;
- request details;
- document review;
- internal notes;
- applicant messages;
- correction action;
- referral and transfer actions;
- handoff inbox and details;
- work-item completion;
- approval and rejection;
- department dashboard;
- unassigned work;
- assignments;
- overdue work;
- approval queue;
- basic department reporting.

### Organization admin

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

See [PAGE-INVENTORY.md](./PAGE-INVENTORY.md).

## 15. Product-level architecture boundaries

- one applicant-facing request may contain multiple internal work items;
- every organization-owned record is organization-scoped;
- users belong through memberships;
- services, forms and workflows are versioned;
- published definitions used by existing requests are not overwritten;
- handoffs are first-class records;
- critical actions create audit events;
- status values come from shared domain definitions;
- permissions are enforced on the server;
- pages do not directly coordinate multi-table business transactions;
- notifications react to recorded events;
- real timestamps support reporting.

## 16. What Stage 0 freezes

Freeze now:

- product purpose;
- target institution type;
- first service and demonstration services;
- pilot boundary;
- roles;
- broad workflow;
- handoff meaning;
- public-status policy;
- page classification;
- workspace boundaries;
- navigation structure;
- non-goals.

Do not freeze yet:

- exact typography sizes;
- final sidebar width;
- final top-bar height;
- final spacing tokens;
- exact border, radius and shadow values;
- final chart styling;
- final implemented shell screenshots.

## 17. Scope-control rule

A feature belongs in V1 only if it is required to:

1. complete the approved vertical slice;
2. keep the limited pilot secure and usable; or
3. measure the core product assumption.

Everything else goes to [POST-V1-BACKLOG.md](./POST-V1-BACKLOG.md).

## 18. Change control

When an approved decision changes:

1. update the controlling Markdown file;
2. record the reason;
3. update affected workflow, roles, statuses and pages;
4. increase the version;
5. commit the documentation change with or before the code;
6. do not let a coding agent silently reinterpret the decision.

## 19. Approval checklist

- [ ] Purpose approved.
- [ ] Core assumption approved.
- [ ] Target institution approved.
- [ ] Transcript Request approved.
- [ ] Demo services approved.
- [ ] Demo organization approved.
- [ ] Departments approved.
- [ ] Fee decision resolved.
- [ ] Form and documents approved.
- [ ] Final outcome approved.
- [ ] Roles and permissions approved.
- [ ] Vertical slice approved.
- [ ] Status mappings approved.
- [ ] Page classifications approved.
- [ ] Non-goals approved.
- [ ] Pilot boundary approved.
- [ ] Open decisions do not block Stage 1.

## 20. Coding-agent instruction

> Read this document and every linked Stage 0 file before implementation. Do not invent new roles, statuses, workflow steps, pages, permissions or service rules. Where a decision is unresolved, surface it instead of guessing.
