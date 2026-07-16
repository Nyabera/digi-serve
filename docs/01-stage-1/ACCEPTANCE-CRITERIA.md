# FAIDIA Stage 1 — Acceptance Criteria

**Status:** APPROVED  
**Version:** 1.0  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/SOURCE-OF-TRUTH.md` and the approved Stage 0 controlling documents

## 1. Purpose

This document states what the Stage 1 Transcript Request vertical slice must prove before it can be approved.

These requirements describe observable product behavior. They do not choose database tables, function names, React components, or other implementation details. Those decisions belong in later Stage 1 implementation documents.

## 2. How to read this document

Each requirement has a permanent ID. When reporting a problem or requesting a change, quote the ID.

The meanings of the verification levels are:

- **E2E:** verify through the working user journey.
- **Integration:** verify multiple system boundaries together, such as database, storage and authorization.
- **Authorization:** verify both permitted and denied access server-side.
- **Inspection:** verify configuration, records, timestamps or immutable history directly.

## 3. Preconditions and seeded configuration

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-PRE-01 | Savannah Technical College exists as the synthetic Stage 1 organization. | Inspection |
| AC-PRE-02 | Student Records, Finance and Registrar departments exist and are attached to Savannah Technical College. | Inspection |
| AC-PRE-03 | Synthetic Applicant, Student Records Officer, Finance Officer, standard Supervisor, Registrar-profile Supervisor and Organization Admin accounts exist with active memberships where applicable. | Inspection |
| AC-PRE-04 | Transcript Request exists as the fully functional Stage 1 service. | Inspection |
| AC-PRE-05 | A published service, form, document-requirement and workflow version exists for Transcript Request. | Inspection |
| AC-PRE-06 | The published Stage 1 workflow follows the approved fixed order and does not require a visual workflow builder. | Inspection |
| AC-PRE-07 | The required national ID or passport rule, conditional supporting-document rules and required manual payment reference are seeded. | Inspection |
| AC-PRE-08 | Every new draft records the exact service, form, document-requirement and workflow version IDs. | Integration |
| AC-PRE-09 | Publishing a newer configuration version affects new requests only; existing drafts and submitted requests remain pinned. | Integration |
| AC-PRE-10 | A draft pinned to a retired version becomes read-only and instructs the applicant to start a new request. | E2E |
| AC-PRE-11 | Published configuration versions cannot be edited in place. | Authorization |
| AC-PRE-12 | Student Clearance Request and Certificate Replacement Request do not become dependencies of the Transcript Request journey. | Inspection |

## 4. Service discovery

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-DIS-01 | A visitor can open Savannah Technical College's public organization page. | E2E |
| AC-DIS-02 | Only active published services appear in the public catalogue. | Integration |
| AC-DIS-03 | The visitor can open the Transcript Request service details. | E2E |
| AC-DIS-04 | Service details show branding, description, eligibility, requirements, document checklist, payment-reference requirement, processing target and start action before sign-in. | E2E |
| AC-DIS-05 | The displayed service information comes from an identifiable published version. | Inspection |
| AC-DIS-06 | Starting an inactive or unpublished service is denied server-side. | Authorization |

## 5. Authentication and draft creation

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-AUT-01 | An unauthenticated visitor who starts Transcript Request is directed to register or sign in. | E2E |
| AC-AUT-02 | Open email registration works for the synthetic demo. | E2E |
| AC-AUT-03 | After successful registration or sign-in, the applicant returns to the intended Transcript Request flow. | E2E |
| AC-AUT-04 | Draft creation records the organization, applicant, pinned versions, `DRAFT` status, `REQUEST_CREATED` audit event and `request_started` timestamp. | Integration |
| AC-AUT-05 | A draft belongs only to its authenticated applicant and organization. | Authorization |
| AC-AUT-06 | An applicant cannot open, edit, submit or upload documents to another applicant's draft. | Authorization |
| AC-AUT-07 | A draft expires after 30 days when it has not been submitted. | Integration |

## 6. Form, documents, review and submission

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-SUB-01 | The applicant can complete every seeded Transcript Request field required by the published version. | E2E |
| AC-SUB-02 | The form supports the approved field types only and does not expose an arbitrary form builder. | Inspection |
| AC-SUB-03 | The applicant can upload the required national ID or passport and any applicable conditional documents to private storage. | Integration |
| AC-SUB-04 | Every upload records document metadata and a `DOCUMENT_UPLOADED` audit event. | Inspection |
| AC-SUB-05 | The applicant can enter the required manual payment reference inside the request flow. | E2E |
| AC-SUB-06 | The applicant can review the completed form, documents, payment reference and declaration before submitting. | E2E |
| AC-SUB-07 | Server-side submission rejects missing required fields, documents, payment reference or declaration. | Integration |
| AC-SUB-08 | Server-side submission validates applicant ownership, organization context and pinned-version availability. | Authorization |
| AC-SUB-09 | A duplicate active Transcript Request for the same applicant is detected, explained and blocked by default. | E2E |
| AC-SUB-10 | The applicant cannot override the duplicate-active-request block. | Authorization |
| AC-SUB-11 | A Supervisor or Organization Admin may override the duplicate block only with `requests.override_duplicate_active` and a mandatory reason. | Authorization |
| AC-SUB-12 | Organization Admin sees only the minimum duplicate-matching metadata during an override and no sensitive request content. | Authorization |
| AC-SUB-13 | A valid submission atomically creates the final reference, response snapshot, workflow instance, Student Records work item, queue state, status history, notification and required audit/timestamp records. | Integration |
| AC-SUB-14 | Successful submission changes the request to `SUBMITTED` and gives the applicant a confirmation and reference. | E2E |
| AC-SUB-15 | Repeating the same successful submission action does not create a second request or duplicate critical side effects. | Integration |

## 7. Student Records review

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-REV-01 | The submitted request appears in the permitted Student Records queue. | E2E |
| AC-REV-02 | Staff access requires authentication, active organization membership, department scope and assigned, claimed or permitted department work. | Authorization |
| AC-REV-03 | A Student Records Officer can claim eligible unassigned work only within Student Records. | Authorization |
| AC-REV-04 | Starting review changes the request to `IN_REVIEW`, the work item to `IN_PROGRESS`, and the public status to In Review. | Integration |
| AC-REV-05 | Starting review records `first_action_at`, `review_started_at` and `REVIEW_STARTED` once. | Inspection |
| AC-REV-06 | An ordinary Officer cannot approve, reject, reopen or manually close the request. | Authorization |
| AC-REV-07 | Internal notes are never visible to the applicant. | Authorization |

## 8. Correction and resubmission

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-COR-01 | A permitted Student Records Officer can reject a document with an applicant-visible reason. | E2E |
| AC-COR-02 | The correction identifies the reason, documents to replace, fields unlocked and deadline when one is used. | E2E |
| AC-COR-03 | Requesting correction changes the request and Records work item to `WAITING_ON_APPLICANT`, maps the public status to Action Required and records `CORRECTION_REQUESTED`. | Integration |
| AC-COR-04 | The applicant is notified and sees the exact required action without internal notes. | E2E |
| AC-COR-05 | During correction, the applicant can change only explicitly unlocked fields and files. | Authorization |
| AC-COR-06 | A replacement document preserves the earlier document history and marks the applicable relationship/status without deleting history. | Inspection |
| AC-COR-07 | Resubmission returns the request to `IN_REVIEW`, makes the Records work item `READY` or `IN_PROGRESS`, records `CORRECTION_RESUBMITTED` and notifies the originating work context. | Integration |
| AC-COR-08 | Correction response time can be calculated from stored timestamps. | Inspection |

## 9. Finance referral and handoff

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-FIN-01 | Student Records can create a Finance referral containing receiving department, requested action, reason, result schema, due date, priority, relevant references/documents and applicant-visibility setting. | E2E |
| AC-FIN-02 | Creating the referral records the handoff, immutable history, Finance work item, notification, `HANDOFF_CREATED` and `handoff_created`. | Integration |
| AC-FIN-03 | Student Records remains the parent request's coordinating owner throughout the Finance referral. | Inspection |
| AC-FIN-04 | An active Finance referral changes the request to `WAITING_ON_DEPARTMENT` and maps the public status to Additional Checks in Progress. | Integration |
| AC-FIN-05 | Only permitted Finance staff can access the Finance referral; they cannot gain unrelated parent-request or organization access. | Authorization |
| AC-FIN-06 | Finance acceptance validates organization, department, permission and current state, then records `HANDOFF_ACCEPTED`. | Integration |
| AC-FIN-07 | A Finance result records code, explanatory note, verification date, officer and optional reference. | Integration |
| AC-FIN-08 | A `CLEAR` result completes Finance work and handoff, returns the request to `IN_REVIEW`, readies Records work and records `HANDOFF_COMPLETED`. | E2E |
| AC-FIN-09 | A `HOLD` result completes Finance work and handoff, changes the request and Records work to applicant-waiting states, and provides an exact applicant action. | E2E |
| AC-FIN-10 | Resolving the `HOLD` returns the request to `IN_REVIEW`; any required re-verification uses a new Finance referral. | E2E |
| AC-FIN-11 | A `CANNOT_VERIFY` result returns Finance work and the same handoff for clarification, returns the request to `IN_REVIEW`, and keeps approval blocked. | E2E |
| AC-FIN-12 | Student Records can clarify and resubmit the same `CANNOT_VERIFY` handoff to `PENDING_ACCEPTANCE`, or request applicant action first. | E2E |
| AC-FIN-13 | Finance can decline a referral, which preserves history, cancels Finance work, returns the request to `IN_REVIEW`, and requires a new referral for revised work. | E2E |
| AC-FIN-14 | Finance `HOLD`, `CANNOT_VERIFY` and decline never automatically reject the parent request. | Integration |
| AC-FIN-15 | Referral acceptance time and completion time can be calculated from stored timestamps. | Inspection |

## 10. Student Records completion and Registrar decision

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-REG-01 | Student Records cannot complete its required work until required documents are `ACCEPTED`, corrections are resolved, Finance is `CLEAR`, Records checks are complete and no mandatory work item is unresolved. | Integration |
| AC-REG-02 | Valid Records completion completes its work item, changes the request to `PENDING_APPROVAL`, maps the public status to Awaiting Decision and makes approval work ready. | Integration |
| AC-REG-03 | The approval queue exists at `/supervisor/approvals`. | E2E |
| AC-REG-04 | Selecting an approval opens `/officer/requests/[id]` in the shared staff shell. | E2E |
| AC-REG-05 | `/officer/requests/[id]/approval` does not exist. | E2E |
| AC-REG-06 | Approve, reject and return-for-clarification controls are embedded in request details only for a Registrar-profile Supervisor with the exact grant. | Authorization |
| AC-REG-07 | An ordinary Officer and a standard Supervisor cannot see or execute Registrar decision actions. | Authorization |
| AC-REG-08 | Every decision action revalidates active membership, profile, permission, organization, department, request state, Finance clearance and workflow version server-side. | Authorization |
| AC-REG-09 | Approval is denied unless the request is `PENDING_APPROVAL`, Finance is `CLEAR`, required work is complete and no mandatory item is unresolved. | Integration |
| AC-REG-10 | Valid approval creates an immutable decision, changes the request to `APPROVED`, records `REQUEST_APPROVED` and begins outcome processing. | E2E |
| AC-REG-11 | Valid rejection requires an applicant-visible reason, creates an immutable decision, changes the request to `REJECTED`, notifies the applicant and records `REQUEST_REJECTED`. | E2E |
| AC-REG-12 | Return for clarification requires the exact permission and reasons/instructions, records an immutable returned decision, changes the request to `IN_REVIEW`, readies Records work, records `REQUEST_RETURNED_FOR_CLARIFICATION` and blocks outcome processing. | E2E |
| AC-REG-13 | Approval waiting time can be calculated from stored timestamps. | Inspection |

## 11. Outcome preparation and issue

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-OUT-01 | An approved request creates a pending issued-outcome record before the file is marked issued. | Integration |
| AC-OUT-02 | FAIDIA can generate a controlled notice/demo transcript or record an externally produced institutional outcome. | E2E |
| AC-OUT-03 | The issued file is stored privately, linked to the exact outcome record and given a checksum where available. | Integration |
| AC-OUT-04 | Successful issue records `OUTCOME_GENERATED` and `DOCUMENT_ISSUED`, changes the request to `OUTCOME_READY` and notifies the applicant. | Integration |
| AC-OUT-05 | The public status Preparing Outcome appears only when outcome preparation has a meaningful delay. | E2E |
| AC-OUT-06 | Outcome preparation failure changes the request to `OUTCOME_FAILED`, maps to Outcome Issue, records `OUTCOME_GENERATION_FAILED` and prevents completion. | E2E |
| AC-OUT-07 | An authorized retry moves `OUTCOME_FAILED` to `OUTCOME_PREPARATION` without erasing the earlier failure record. | Integration |
| AC-OUT-08 | Outcome-ready time can be calculated from stored timestamps. | Inspection |

## 12. Completion, reopening and expiry

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-CMP-01 | An authorized applicant can request a short-lived signed URL for an issued outcome belonging to them. | Authorization |
| AC-CMP-02 | Successful controlled download records `DOCUMENT_DOWNLOADED`, changes `OUTCOME_READY` to `COMPLETED` and records `REQUEST_COMPLETED`. | E2E |
| AC-CMP-03 | A permitted Student Records Officer can record physical collection only from `OUTCOME_READY` and must capture collector, identifier/relationship, collection time and outcome reference. | Authorization |
| AC-CMP-04 | Physical collection records `OUTCOME_COLLECTED`, changes the request to `COMPLETED` and records `REQUEST_COMPLETED`. | E2E |
| AC-CMP-05 | Supervisor manual closure requires `requests.manual_close`, `OUTCOME_READY`, a reason code, explanatory note and evidence reference. | Authorization |
| AC-CMP-06 | Valid manual closure records `REQUEST_MANUALLY_CLOSED`, changes the request to `COMPLETED` and records `REQUEST_COMPLETED`. | E2E |
| AC-CMP-07 | No generic delivery action or any other trigger can complete a Stage 1 request. | Integration |
| AC-CMP-08 | A Supervisor with `requests.reopen` can reopen only `REJECTED` or `COMPLETED`, with a mandatory reason. | Authorization |
| AC-CMP-09 | Reopening returns the request to `IN_REVIEW`, creates or reactivates Records work, records `REQUEST_REOPENED`, notifies the applicant/department and preserves all earlier history. | E2E |
| AC-CMP-10 | Reopening does not automatically revoke an issued outcome. | Integration |
| AC-CMP-11 | Outcome revocation is a separate permission-gated action that records `DOCUMENT_REVOKED`. | Authorization |
| AC-CMP-12 | `CANCELLED` and `EXPIRED` requests cannot be reopened in Stage 1. | Authorization |
| AC-CMP-13 | A waiting-on-applicant request expires only after its recorded action deadline passes. | Integration |
| AC-CMP-14 | Expiry changes the request to terminal `EXPIRED`, shows Expired with the reason/date, records `REQUEST_EXPIRED` and offers an appropriate start-new-request instruction. | E2E |
| AC-CMP-15 | Completion method, end-to-end time, reopened count and manual-closure count can be calculated from stored records. | Inspection |

## 13. Notifications and applicant-safe communication

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-NOT-01 | Stage 1 provides in-app notifications for submission, correction, correction resubmission, Finance referral events, Finance results, Registrar decisions, outcome ready, expiry, completion, reopening and overdue warning. | E2E |
| AC-NOT-02 | Notification records preserve delivery state and link to the permitted next action or context. | Inspection |
| AC-NOT-03 | Applicant notifications never expose internal notes, confidential Finance details or unrelated staff information. | Authorization |
| AC-NOT-04 | A failed notification does not roll back an otherwise valid critical workflow transaction. | Integration |
| AC-NOT-05 | Email delivery is not required to approve the synthetic Stage 1 demo, but remains required before an external pilot. | Inspection |

## 14. Audit and immutable history

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-AUD-01 | Every event required by `V1-VERTICAL-SLICE.md` Section 10 is recorded when its corresponding action succeeds. | Integration |
| AC-AUD-02 | Audit records identify event type, time, organization, request/context, actor or system actor and relevant safe metadata. | Inspection |
| AC-AUD-03 | Audit records are append-only and no role can edit or delete them. | Authorization |
| AC-AUD-04 | Failed or denied actions do not create misleading success events. | Integration |
| AC-AUD-05 | Reassignment, correction, handoff clarification, decision, completion, reopening and revocation preserve previous history. | Inspection |
| AC-AUD-06 | The applicant timeline shows only applicant-safe history; operational history remains permission-scoped. | Authorization |

## 15. Reporting and management visibility

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-REP-01 | The Supervisor dashboard shows real Stage 1 backlog and stage-duration values, not hard-coded totals. | E2E |
| AC-REP-02 | FAIDIA can calculate time to first action, correction response, referral acceptance, referral completion, approval waiting, outcome ready and end-to-end completion. | Inspection |
| AC-REP-03 | FAIDIA can report handoff count, correction count, current owner, overdue state, completion method, reopened count and manual-closure count. | Inspection |
| AC-REP-04 | Reporting follows organization and department permissions and does not leak applicant-sensitive data to Organization Admin. | Authorization |
| AC-REP-05 | Any Stage 1 chart uses Recharts, real aggregate data, readable labels and an accessible non-color-only presentation. | E2E |

## 16. Security and isolation

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-SEC-01 | Unauthenticated access to protected applicant, staff, Supervisor and admin data is denied server-side. | Authorization |
| AC-SEC-02 | An applicant can access only their own drafts, requests, messages, documents, notifications and outcomes. | Authorization |
| AC-SEC-03 | Data from one organization cannot be read or changed through another organization context. | Authorization |
| AC-SEC-04 | Staff access is limited by active membership, department, assignment/claim, handoff and exact permission. | Authorization |
| AC-SEC-05 | Finance access is limited to its referral work and does not transfer parent ownership. | Authorization |
| AC-SEC-06 | Organization Admin cannot access request content, applicant documents/messages, internal notes, operational handoff details or issued outcome files. | Authorization |
| AC-SEC-07 | Internal notes and confidential Finance information are never exposed to applicants. | Authorization |
| AC-SEC-08 | File access is private, authorized and time-limited; guessing or reusing an unauthorized file reference fails. | Authorization |
| AC-SEC-09 | Critical state changes are transactional and safe against duplicate execution. | Integration |
| AC-SEC-10 | Published versions and immutable decision/audit/history records cannot be edited through application actions. | Authorization |
| AC-SEC-11 | Search, queues, counts and reports apply the same authorization rules as direct record access. | Authorization |

## 17. Stage 1 scope enforcement

| ID | Acceptance requirement | Verification |
|---|---|---|
| AC-SCP-01 | Every `STAGE_1_REQUIRED` route or embedded section needed by this acceptance contract exists and uses real data and server-side authorization. | E2E |
| AC-SCP-02 | `LATER_V1` items are not treated as Stage 1 blockers or shown as active empty navigation by default. | Inspection |
| AC-SCP-03 | `DEMO_ONLY` items do not become dependencies of the working vertical slice. | Integration |
| AC-SCP-04 | `POSTPONED` items, including transfer, public verification and visual builders, are not implemented as Stage 1 requirements. | Inspection |
| AC-SCP-05 | Every required page defines loading, empty, error, permission-denied and applicable stale-action behavior. | E2E |
| AC-SCP-06 | Applicant flows work responsively without requiring horizontal operational tables. | E2E |
| AC-SCP-07 | Critical actions are keyboard accessible and statuses are not communicated by color alone. | E2E |

## 18. Stage 1 pass rule

Stage 1 passes only when:

1. every requirement in this document passes;
2. no blocking contradiction exists between implementation and controlling Markdown;
3. the complete audit sequence can be demonstrated using synthetic data;
4. all required isolation and denied-access tests pass;
5. the product owner approves the demonstrated vertical slice.

A partial happy-path demonstration is not a Stage 1 pass.

## 19. Explicit non-goals

This acceptance contract does not require:

- the complete V1 page inventory;
- visual form or workflow builders;
- transfer workflows;
- parallel work items;
- arbitrary workflow scripting;
- public QR verification;
- M-PESA integration;
- advanced/custom report builders;
- AI routing or OCR;
- enterprise SSO;
- email delivery for the synthetic demo;
- production pilot validation decisions listed as non-blocking in Stage 0.

## 20. Product-owner review checklist

- [x] The preconditions match the intended synthetic demo.
- [x] The applicant journey is complete and correct.
- [x] Correction behavior is correct.
- [x] All Finance result paths are correct.
- [x] Registrar authority and route behavior are correct.
- [x] Outcome and completion behavior are correct.
- [x] Reopening, revocation and expiry are correct.
- [x] Reporting and security expectations are correct.
- [x] Nothing outside Stage 1 has become mandatory.
- [x] Product owner approved Parts 1 and 2 on 2026-07-14; architecture documentation may proceed.

## 21. Change rule

If a requirement conflicts with the intended product, record the requirement ID and proposed correction. Update the controlling Stage 0 document first when the correction changes scope, routes, roles, permissions, statuses, workflow, navigation, completion, reopening or data ownership.

## 22. Coding-agent instruction

Do not implement from this file alone. Read the Source of Truth and the cited controlling Stage 0 document. Later technical documents must map implementation and tests back to these stable acceptance IDs.
