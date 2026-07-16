---
title: Stage 2 Approval Gate
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Stage 2 Approval Gate

## 1. Current result

**Specification:** `READY_FOR_OWNER_APPROVAL`

**Approval:** `NOT_YET_APPROVED`

The package contains no intentionally unresolved Stage 2 service decision.

Formal approval still requires an explicit product-owner approval.

## 2. Adopted decisions

1. Transcript Request is the first fully functional service.
2. Savannah Technical College is the demonstration organization.
3. Student Records owns and coordinates the request.
4. Finance receives a referral and does not take parent ownership.
5. Registrar makes the final decision.
6. The service costs KES 500.
7. Payment uses a manual reference verified by Finance.
8. One digital copy is issued.
9. Delivery is secure applicant download.
10. National ID or passport is mandatory.
11. Finance issues block approval and issuance, not submission.
12. Initial Records assignment is performed by a supervisor.
13. Officer self-claim is disabled.
14. Corrections are due within seven calendar days.
15. Supervisor is notified after two correction cycles.
16. Registrar approval transitions to `APPROVED_PENDING_ISSUANCE`.
17. Preferred issuance mode is Registrar-uploaded official PDF.
18. Fallback issuance mode is FAIDIA-generated demonstration PDF.
19. Demonstration PDFs must display `DEMONSTRATION DATA` on every page.
20. Either valid issuance mode may complete the request.
21. Issuance failure must not complete the request.
22. Public QR verification is postponed.
23. SLA calculations use elapsed hours and calendar days.

## 3. Approval checklist

### Service

- [x] Form fields are defined.
- [x] Eligibility is defined.
- [x] Required and conditional documents are defined.
- [x] Fee and waiver rules are defined.
- [x] Draft rules are defined.
- [x] Submission rules are defined.
- [x] Correction rules are defined.
- [x] Document-review rules are defined.
- [x] Assignment rules are defined.
- [x] Official upload requirements are defined.
- [x] Demonstration generation requirements are defined.

### Workflow

- [x] Every step has an owner.
- [x] Every step has allowed actions.
- [x] Internal statuses are defined.
- [x] Applicant-safe statuses are defined.
- [x] Allowed transitions are defined.
- [x] Referral ownership is explicit.
- [x] Transfer ownership is explicit.
- [x] Work-item lifecycle is explicit.
- [x] Registrar approval preconditions are explicit.
- [x] Completion requires a valid issued document.
- [x] Hybrid issuance behavior is explicit.
- [x] Failure behavior is explicit.

### Events and operations

- [x] Notification triggers are defined.
- [x] Audit events are defined.
- [x] Issuance-specific audit metadata is defined.
- [x] SLA timestamps are defined.
- [x] Issuance SLA is defined.
- [x] Final outcomes are defined.
- [x] Issued-document model is defined.
- [x] Metrics are defined.

### Acceptance

- [x] Applicant scenario is defined.
- [x] Officer scenario is defined.
- [x] Referral scenario is defined.
- [x] Supervisor scenario is defined.
- [x] Admin scenario is defined.
- [x] Official upload scenario is defined.
- [x] Demo generation scenario is defined.
- [x] Issuance failure scenarios are defined.
- [x] End-to-end scenario is defined.
- [x] Exception coverage is defined.
- [x] The slice does not require a postponed feature.

## 4. Approval statement

When approved, update front matter to:

```text
status: APPROVED
```

Then add:

```text
Approved by: <product owner>
Approved on: <YYYY-MM-DD>
Approved version: 1.1.0
```

After approval, material changes require a recorded decision and version increment.
