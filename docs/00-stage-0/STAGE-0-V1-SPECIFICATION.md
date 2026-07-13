# FAIDIA Stage 0 — V1 Product Specification

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

FAIDIA V1 proves that one formal institutional service request can move from applicant submission through review, correction, departmental referral, approval, controlled outcome issuance, applicant tracking, audit history, notifications, and operational reporting in one traceable system.

Stage 1 is the first complete Transcript Request vertical slice. Stage 1 is not the entire V1 platform.

## 2. Product definition

Product category: **Service Operations Platform**.

Positioning: **FAIDIA is the workflow, coordination, tracking, and verification layer for institutional services.**

Validation question: can one institution process one formal service request end-to-end in FAIDIA with clearer ownership, fewer external follow-ups, structured departmental collaboration, and better management visibility than its current process?

## 3. First market scenario

Target institution type: **Kenyan TVET, technical college, or small private college**.

Demo organization: **Savannah Technical College**.

Departments:

1. **Student Records** — originating and coordinating department.
2. **Finance** — receiving department for hold/payment-reference verification.
3. **Registrar** — final approval and outcome authorization.

Use synthetic or non-sensitive data for Stage 1.

## 4. Service scope

Fully functional Stage 1 service: **Transcript Request**.

Controlled demonstration services:

- Student Clearance Request.
- Certificate Replacement Request.

The two demonstration services may use seeded read-only or simplified behavior. They are not dependencies of the Stage 1 acceptance scenario.

## 5. Stage boundary

`STAGE_1_REQUIRED` pages and capabilities must be complete before Stage 1 approval.

`LATER_V1` pages and capabilities are part of the complete V1 release but are not required for Stage 1.

The authoritative classifications are in `PAGE-INVENTORY.md`.

## 6. Transcript Request definition

The applicant requests an academic transcript or transcript-related controlled outcome.

Eligibility baseline:

- applicant is a current or former student;
- applicant supplies an admission or student number;
- the institution can locate the academic record;
- the applicant accepts the accuracy declaration;
- a Finance hold may block issuance even when submission is allowed;
- third-party requests are postponed.

## 7. Seeded Stage 1 form

The Stage 1 schema is seeded. Organization Admin may edit labels and help text, but may not add, remove, reorder, branch, or script fields.

Supported seeded field types:

- `SHORT_TEXT`
- `EMAIL`
- `PHONE`
- `SELECT`
- `YEAR`
- `TEXTAREA`
- `CHECKBOX`
- `DECLARATION`

Applicant fields:

- full legal name;
- email;
- phone number;
- admission or student number;
- national ID or passport number;
- former name where relevant;
- programme;
- department or school;
- campus where relevant;
- year of admission;
- year of completion or graduation;
- study mode where relevant;
- transcript purpose;
- one copy only;
- delivery method: controlled download or physical collection;
- recipient details where relevant;
- manual payment reference;
- additional notes;
- accuracy declaration and required acknowledgement.

## 8. Seeded document requirements

Required:

- national ID or passport.

Conditional:

- student ID or institutional identifier where available;
- payment-reference evidence where policy requires it;
- name-change evidence.

Stage 1 does not include arbitrary conditional-rule construction. Conditions are seeded and evaluated by approved application logic.

Applicant-supplied documents use `ACCEPTED` when they satisfy a requirement.

## 9. Fee and Finance model

The generic V1 service model supports a conditional manual payment reference.

For the Savannah Transcript Request demo:

- manual payment reference is enabled;
- manual payment reference is required;
- payment remains inside the request form/review flow;
- no standalone payment page is required.

Finance verifies whether a hold blocks transcript issuance.

Result codes:

- `CLEAR`
- `HOLD`
- `CANNOT_VERIFY`

`HOLD` returns the request to applicant action. `CANNOT_VERIFY` returns the referral for clarification and prevents approval until resolved.

## 10. Seeded Stage 1 workflow

The workflow step order is fixed:

1. Applicant submission.
2. Student Records review.
3. Applicant correction when required.
4. Finance referral and result.
5. Student Records completion.
6. Registrar approval, rejection, or return for clarification.
7. Controlled outcome preparation and issue.
8. Recorded download, collection, or exceptional manual closure.

Transfer, parallel branches, arbitrary conditions, scripts, and visual workflow editing are excluded from Stage 1.

## 11. Stage 1 configuration model

Stage 1 uses a seeded Transcript Request template with limited safe editing.

Organization Admin may edit:

- organization name;
- logo;
- primary brand color;
- service display name;
- public description;
- eligibility and requirement explanatory text;
- processing target;
- active/inactive state;
- manual payment-reference enabled/required flags;
- labels and help text for existing fields and document requirements.

Organization Admin may not edit:

- field types;
- field order;
- seeded validation rules;
- workflow step order;
- Finance result schema;
- approval requirement;
- internal statuses;
- applicant status mappings;
- permission bundles;
- completion or reopening rules.

## 12. Versioning rules

- Published service, form, requirement, and workflow versions are immutable.
- A change to published configuration creates a new draft version.
- Publication is atomic and creates a new version number and timestamp.
- Only users with the relevant publish permission may publish.
- New requests use the latest published version.
- Drafts and submitted requests store exact version IDs.
- Submitted requests never migrate automatically.
- Drafts remain pinned to the creation version.
- A draft pinned to a retired version becomes read-only and must be restarted.
- No Stage 1 migration engine is required.

## 13. Outcome and completion

V1 outcome:

- Completion / Collection / Dispatch Notice;
- controlled sample transcript PDF in demo mode;
- exact issued copy when the institution provides it.

The institution or its existing process creates the official transcript. FAIDIA stores and controls access to the exact issued copy or controlled outcome.

Supported completion triggers:

1. successful authorized controlled download;
2. recorded physical collection;
3. exceptional Supervisor manual closure.

Physical collection requires:

- authorized Student Records officer;
- collector name;
- collector identifier or relationship;
- collection date/time;
- outcome reference;
- optional note;
- `REQUEST_COMPLETED` audit event.

Exceptional manual closure requires:

- `SUPERVISOR` role;
- `requests.manual_close`;
- request state `OUTCOME_READY`;
- mandatory reason code;
- mandatory explanatory note;
- supporting evidence reference where applicable;
- `REQUEST_MANUALLY_CLOSED` and `REQUEST_COMPLETED` events.

There is no generic “delivery” completion trigger in Stage 1.

## 14. Reopening rules

Only a Supervisor with `requests.reopen` may reopen `REJECTED` or `COMPLETED`.

Reopening:

- requires a mandatory reason;
- creates `REQUEST_REOPENED`;
- returns the request to `IN_REVIEW`;
- creates or reactivates a Student Records work item;
- preserves all previous decisions, outcomes, status history, and audit events;
- notifies the applicant and coordinating department;
- does not automatically revoke an issued outcome.

Outcome revocation is a separate explicit action requiring `documents.revoke`.

`CANCELLED` and `EXPIRED` are not reopenable in Stage 1.

## 15. Roles

Top-level V1 roles:

- `APPLICANT`
- `OFFICER`
- `SUPERVISOR`
- `ORGANIZATION_ADMIN`

Optional internal support role:

- `PLATFORM_ADMIN`

Registrar is a Supervisor membership profile labelled Registrar.

Only the Registrar profile receives:

- `requests.approve`
- `requests.reject`
- `requests.return_for_clarification`

Ordinary Officers do not receive those permissions.

Organization Admin has configuration and organization-reporting access only. Organization Admin has no V1 sensitive request, document, applicant-message, or internal-note access.

## 16. Minimum Stage 1 product surface

The Stage 1 product surface is limited to the `STAGE_1_REQUIRED` inventory.

It must support:

- service discovery and service details;
- applicant registration and sign in;
- draft, form, documents, review, submission, tracking, correction, messaging, notifications, and outcome access;
- Student Records queue, request review, correction, Finance referral, and outcome processing;
- Finance incoming referral acceptance, result recording, and clarification;
- Registrar approval queue and decision page;
- supervisor stage-duration dashboard;
- limited Organization Admin branding and service-metadata configuration;
- real audit events, status history, timestamps, and permission checks.

The complete V1 may add `LATER_V1` pages after the vertical slice passes acceptance.

## 17. Pilot posture

- synthetic demo first;
- limited real pilot later;
- founder plus service-owner support;
- weekly staff feedback;
- short applicant feedback;
- structured issue log.

Before external pilot, validate the real fee schedule, Finance process, approval authority, output, closure condition, email delivery, and support ownership.

## 18. Stage 1 success criteria

Stage 1 passes when:

- the canonical Source of Truth is used;
- only `STAGE_1_REQUIRED` scope is treated as mandatory;
- the seeded service configuration is published and versioned;
- applicant registration/sign-in works;
- a Transcript Request is submitted with required data/documents;
- duplicate active request control works;
- Student Records reviews and requests correction;
- applicant corrects and resubmits;
- Finance referral and all three result paths work;
- approval cannot occur without resolved Finance verification;
- only Registrar can approve/reject/return for clarification;
- an outcome is stored or recorded;
- controlled download or collection completes the request;
- exceptional manual closure is permission-gated and audited;
- rejected/completed reopening is permission-gated and audited;
- applicant sees `Expired` when applicable;
- supervisor sees stage timing and backlog;
- tenant, department, ownership, and file isolation tests pass;
- audit history contains the full sequence.

## 19. Approval checklist

- [x] Stage 1 defined as the first vertical slice.
- [x] Complete V1 separated from Stage 1.
- [x] Configuration model fixed as seeded plus limited editing.
- [x] Versioning and request pinning defined.
- [x] Officer approval ambiguity removed.
- [x] Organization Admin sensitive-content access denied.
- [x] Completion triggers fixed.
- [x] Manual closure evidence and permission fixed.
- [x] Reopening rules fixed.
- [x] `Expired` public status approved.
- [x] Page classifications updated.
- [x] Design asset paths corrected.
- [x] No blocking Stage 0 decisions remain.

## 20. Coding-agent instruction

Implement only the approved Stage 1 task. Do not infer that `LATER_V1` is required. Do not create new roles, statuses, routes, permissions, configuration depth, workflow branches, or completion methods without first updating the controlling documents.
