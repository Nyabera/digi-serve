---
title: Transcript Request Service Specification
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Transcript Request Service Specification

## 1. Service identity

| Property | Value |
|---|---|
| Service key | `transcript-request` |
| Service name | Transcript Request |
| Organization | Savannah Technical College |
| Service owner | Student Records |
| Fee | KES 500 |
| Copies | One |
| Delivery method | Secure digital download |
| Expected overall processing time | Five calendar days |
| Initial receiving department | Student Records |
| Referral department | Finance |
| Final approval department | Registrar |
| Preferred issuance mode | `OFFICIAL_UPLOAD` |
| Fallback issuance mode | `DEMO_GENERATED` |

## 2. Exact application form fields

### 2.1 Applicant details

| Key | Label | Type | Required | Rule |
|---|---|---|---|---|
| `fullLegalName` | Full legal name | Text | Yes | 2–150 characters. Prefilled where available but confirmed by applicant. |
| `previousOrAlternativeName` | Previous or alternative name | Text | Conditional | Required where the applicant's current legal name differs from the academic record. |
| `identityDocumentNumber` | National ID or passport number | Text | Yes | 5–30 characters. Sensitive field. |
| `admissionNumber` | Admission or student number | Text | Yes | 3–50 characters. Trimmed and normalized. |
| `emailAddress` | Email address | Email | Yes | Must pass shared email validation. |
| `mobileNumber` | Mobile number | Phone | Yes | Must pass shared phone validation. |

### 2.2 Academic details

| Key | Label | Type | Required | Rule |
|---|---|---|---|---|
| `programme` | Programme or course | Text | Yes | 2–150 characters. |
| `campus` | Campus | Select | Yes | Must be an active Savannah Technical College campus. |
| `yearOfAdmission` | Year of admission | Number | Yes | Four-digit year, not later than the current year. |
| `yearOfCompletionOrLastAttendance` | Year of completion or last attendance | Number | Yes | Must be equal to or later than `yearOfAdmission`. |
| `graduationYear` | Graduation year | Number | Conditional | Required where the applicant states that they graduated. |
| `awardLevel` | Award level | Select | Yes | `CERTIFICATE`, `DIPLOMA`, `HIGHER_DIPLOMA`, `OTHER`. |

### 2.3 Request details

| Key | Label | Type | Required | Rule |
|---|---|---|---|---|
| `transcriptPurpose` | Purpose of transcript | Select | Yes | `EMPLOYMENT`, `FURTHER_STUDY`, `IMMIGRATION`, `PERSONAL_RECORDS`, `OTHER`. |
| `numberOfCopies` | Number of copies | Fixed | Yes | Fixed at `1`. |
| `deliveryMethod` | Delivery method | Fixed | Yes | Fixed at `SECURE_DIGITAL_DOWNLOAD`. |
| `recipientInstitutionName` | Recipient institution name | Text | No | Maximum 200 characters. |
| `recipientEmailAddress` | Recipient email address | Email | No | Metadata only. FAIDIA does not email the transcript directly in Stage 2. |
| `additionalInstructions` | Additional instructions | Long text | No | Maximum 1,000 characters. |
| `paymentReference` | Payment reference | Text | Yes | 4–100 characters. Verified by Finance. |
| `applicantDeclarationAccepted` | Applicant declaration | Checkbox | Yes | Must be `true`. |
| `verificationConsentAccepted` | Consent to institutional verification | Checkbox | Yes | Must be `true`. |

## 3. Eligibility rules

An applicant may submit when:

1. They are a current student, former student or graduate of Savannah Technical College.
2. They provide a valid admission number or enough supporting evidence for Student Records to identify the academic record.
3. They provide a National ID or passport.
4. The supplied identity reasonably matches the student record.
5. They accept the declaration and verification-consent statements.
6. They provide a payment reference or an approved fee waiver.
7. No legal, disciplinary or records-preservation hold prohibits issuance.

A Finance balance or unverified payment does not block submission.

It blocks final approval and issuance until Finance returns `FINANCE_CLEAR`.

## 4. Document requirements

### 4.1 Always required

| Document | Requirement |
|---|---|
| National ID or passport | Mandatory |
| Payment receipt or payment-reference evidence | Mandatory unless a fee waiver applies |

### 4.2 Conditionally required

| Condition | Required document |
|---|---|
| Admission number cannot be matched | Student ID, admission letter or certificate |
| Current name differs from academic record | Gazette notice, marriage certificate or affidavit |
| Another person acts for the applicant | Authorization letter and representative identity document |
| Record is old, incomplete or disputed | Supporting institutional correspondence |

### 4.3 File rules

- Allowed types: PDF, JPG and PNG.
- Maximum size: 10 MB per file.
- Files are stored privately.
- File metadata is stored in PostgreSQL.
- Applicant may replace a file before submission.
- After submission, replacement is permitted only through an active correction.
- Replacements create a new document record and preserve the previous version.
- Permanent public URLs are prohibited.

## 5. Fee rules

1. The Stage 2 fee is KES 500.
2. The fee covers one digital transcript.
3. The amount is stored on the published service version.
4. The applicant enters a manual payment reference.
5. Finance confirms or rejects the payment reference.
6. Partial payment does not clear the request.
7. Overpayment is placed `UNDER_REVIEW`.
8. A waiver requires:
   - a recorded reason; and
   - Finance Supervisor or Organization Admin permission.
9. Changing the fee creates a new service version.
10. Existing requests retain their submitted fee version.
11. The browser cannot declare payment success.

## 6. Draft rules

1. A draft is created when an authenticated applicant starts the service.
2. One active draft is allowed per applicant, organization and service version.
3. Draft responses autosave after meaningful changes.
4. Draft documents remain private and attached to the draft.
5. Drafts do not:
   - enter staff queues;
   - start processing SLAs;
   - create staff assignments; or
   - notify staff.
6. Officers cannot view applicant drafts.
7. A draft expires after 30 days of inactivity.
8. The applicant may delete an active draft.
9. A draft remains attached to the service version under which it started.
10. If that version is withdrawn, submission is blocked and the applicant must restart under the current version.

## 7. Submission rules

Submission requires:

- all required fields to pass server-side validation;
- all required documents to be present;
- all required declarations to be accepted;
- the service version to remain active; and
- the applicant to confirm the review page.

A successful submission must:

1. lock the form-response snapshot;
2. lock the submitted document set;
3. attach the service version;
4. attach the form-schema version;
5. attach the workflow version;
6. generate one unique request reference;
7. create the workflow instance;
8. create the first Student Records work item;
9. place it in the unassigned Student Records queue;
10. create status history;
11. create the submission audit event;
12. create notifications;
13. start SLA timestamps.

Duplicate attempts with the same idempotency key must return the existing request.

After submission, the applicant cannot edit data unless a correction explicitly reopens it.

## 8. Correction rules

1. Only the current responsible officer may request correction.
2. Every correction must identify:
   - affected fields;
   - affected documents; and
   - a reason for each requested change.
3. The applicant may edit only flagged fields.
4. The applicant may replace only flagged documents.
5. Unaffected information remains locked.
6. The applicant has seven calendar days to respond.
7. Resubmission returns the request to the same Student Records work item.
8. The request reference does not change.
9. Each correction cycle records separate timestamps, status history and audit events.
10. After two correction cycles, the Student Records supervisor is notified.
11. Missing the deadline does not automatically reject the request.
12. An authorized officer or supervisor must explicitly extend, cancel or reject.
13. Finance-related applicant corrections are opened by Student Records and are limited to payment data or evidence.

## 9. Document-review rules

### Decisions

```text
PENDING_REVIEW
ACCEPTED
REJECTED_REPLACEMENT_REQUIRED
NOT_APPLICABLE
```

### Rules

1. Every required document receives a decision.
2. Rejection requires a reason.
3. Rejection uses a structured reason and optional note.
4. Accepted documents remain locked unless an authorized officer reopens review.
5. Replacement creates a new document record linked to the previous record.
6. Previous versions remain in authorized audit history.
7. Applicants see decisions and applicant-visible reasons.
8. Applicants never see internal notes.
9. Sensitive document views and downloads are audited.
10. Records Review cannot complete until every required document is accepted.

## 10. Assignment rules

1. New requests enter the unassigned Student Records queue.
2. The Student Records supervisor assigns the first work item.
3. Officer self-claim is disabled.
4. Reassignment requires a reason.
5. Assignment history preserves old and new assignees.
6. Assignment cannot cross:
   - organization boundaries;
   - unauthorized department boundaries; or
   - permission scope.
7. Finance assigns its referral work item separately.
8. Registrar Approval may be assigned only to a user with `requests.approve`.
9. Assignment alone does not change applicant-facing status.

## 11. Issuance input rules

After Registrar approval, one of two issuance paths is used.

### Official upload

- Registrar uploads an official PDF.
- Allowed type: PDF only.
- Maximum size: 20 MB.
- File must pass validation.
- Uploading user must have issuance permission.
- The file must be stored privately.
- A checksum is mandatory.

### Demonstration generation

- Available only where official upload is unavailable.
- Uses seeded synthetic academic data.
- Every page must display `DEMONSTRATION DATA`.
- Generated content must never be sourced from real student production data.
- The generated file follows the same issued-document process as an official upload.
