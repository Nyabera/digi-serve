---
title: Transcript Request Outcome and Metrics Specification
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Transcript Request Outcome and Metrics Specification

## 1. Final outcome

### Successful outcome

```text
REQUEST_APPROVED
+
ISSUED_DOCUMENT_CREATED
+
REQUEST_COMPLETED
```

The issued document may come from:

```text
OFFICIAL_UPLOAD
```

or:

```text
DEMO_GENERATED
```

Registrar approval alone is not completion.

## 2. Other final outcomes

| Outcome | Rule |
|---|---|
| `REJECTED` | Final decision with applicant-visible reason |
| `CANCELLED` | Applicant withdrawal or authorized cancellation with reason |

The following are intermediate states:

- correction required;
- payment not found;
- amount mismatch;
- outstanding balance;
- Finance clarification required;
- approved pending issuance;
- issuance failed.

## 3. Issued-document model

```text
issued_documents
----------------
id
organization_id
request_id
document_type
issuance_mode
storage_bucket
storage_path
original_filename
mime_type
size_bytes
checksum
issued_at
issued_by_user_id
service_version_id
workflow_version_id
version
is_demonstration
status
created_at
```

Allowed issuance modes:

```text
OFFICIAL_UPLOAD
DEMO_GENERATED
```

Allowed issued-document statuses:

```text
PENDING
AVAILABLE
FAILED
REVOKED
REPLACED
```

## 4. Official upload requirements

1. PDF only.
2. Maximum size: 20 MB.
3. Registrar or authorized issuer uploads the file.
4. The institution remains the authoritative academic source.
5. FAIDIA validates:
   - MIME type;
   - extension;
   - file size;
   - filename sanitization;
   - storage success.
6. A checksum is mandatory.
7. The exact uploaded PDF is preserved.
8. The file is stored privately.
9. Applicant access uses an authorized short-lived signed URL.
10. Upload success creates the issued-document record.
11. Upload failure leaves the request `APPROVED_PENDING_ISSUANCE`.

## 5. Demonstration generation requirements

The fallback path is permitted only where an official transcript PDF is unavailable in the demonstration environment.

The PDF must contain:

1. institution name;
2. institution logo;
3. title `Official Academic Transcript`;
4. unique transcript reference;
5. applicant name;
6. admission number;
7. programme;
8. campus;
9. study period;
10. synthetic units or courses;
11. synthetic grades;
12. synthetic credit values where applicable;
13. synthetic award or completion status;
14. issue date;
15. Registrar approval block;
16. page numbers;
17. FAIDIA issued-document ID;
18. verification reference;
19. institutional footer;
20. `DEMONSTRATION DATA` on every page.

The fallback must use seeded synthetic data only.

It must not use real production academic data.

## 6. Common issuance rules

Both issuance modes use identical:

- private storage;
- checksum storage;
- permission checks;
- download behavior;
- issued-document records;
- notification flow;
- audit events;
- reporting;
- SLA completion;
- applicant timeline behavior.

The rest of FAIDIA must not depend on how the PDF was produced.

## 7. Idempotency and retry rules

1. One active issued document is allowed per request and issuance version.
2. Repeated successful retries must not create duplicates.
3. Failed attempts are recorded separately.
4. A retry may reuse the same mode or switch from `OFFICIAL_UPLOAD` to `DEMO_GENERATED`.
5. Switching issuance mode requires an audit event.
6. A replaced issued document must preserve the prior version and replacement relationship.

## 8. Applicant dashboard outputs

- request reference;
- service name;
- submitted date;
- applicant-safe status;
- required applicant action;
- correction deadline;
- applicant-visible timeline;
- applicant-visible messages;
- final decision;
- issuance mode is not shown unless the document is a demonstration document;
- `DEMONSTRATION DATA` warning where applicable;
- secure download when completed.

## 9. Officer metrics

- assigned to me;
- due today;
- due soon;
- overdue;
- waiting on applicant;
- waiting on Finance;
- approved pending issuance;
- issuance failures;
- recently completed;
- time to first action;
- average active processing time.

## 10. Department metrics

- open requests;
- unassigned work;
- assigned work;
- overdue work;
- pending Finance referrals;
- Finance referrals awaiting acceptance;
- average Finance acceptance time;
- average Finance completion time;
- Registrar approvals pending;
- approved requests awaiting issuance;
- average approval-to-issuance time;
- official-upload count;
- demo-generated count;
- issuance failure count;
- average stage duration;
- average end-to-end completion time.

## 11. Organization metrics

- requests started;
- requests submitted;
- draft abandonment rate;
- requests completed;
- requests rejected;
- requests cancelled;
- completion rate;
- correction rate;
- average correction cycles;
- average applicant response time;
- average turnaround;
- SLA compliance;
- open backlog;
- overdue backlog;
- official-upload percentage;
- demo-generated percentage;
- issuance success rate;
- issuance retry rate.

## 12. Handoff metrics

- Finance referrals created;
- pending acceptance;
- accepted;
- declined;
- returned for clarification;
- completed;
- average acceptance time;
- average completion time;
- overdue referrals;
- result distribution.

## 13. Validation metrics

Record:

- requests completed entirely inside FAIDIA;
- requests requiring external phone calls;
- requests requiring external email;
- requests requiring external WhatsApp;
- status enquiries;
- manual follow-ups;
- lost or untraceable requests;
- turnaround reduction;
- requests completed end to end;
- official PDFs available at approval;
- fallback generation usage;
- reasons official PDFs were unavailable.

## 14. Metric definitions

| Metric | Definition |
|---|---|
| Submission rate | Submitted requests divided by started requests |
| Draft abandonment rate | Expired or deleted unsubmitted drafts divided by started requests |
| Correction rate | Submitted requests with at least one correction divided by submitted requests |
| Applicant response time | Correction request to correction resubmission |
| Time to first action | Submission to first authorized officer action |
| Finance acceptance time | Referral sent to accepted |
| Finance completion time | Referral accepted to completed |
| Approval-to-issuance time | Registrar approval to issued document |
| Issuance success rate | Successful issued documents divided by issuance attempts |
| Official-upload percentage | `OFFICIAL_UPLOAD` completions divided by completed requests |
| Demo-generated percentage | `DEMO_GENERATED` completions divided by completed requests |
| End-to-end turnaround | Submission to completion |
| SLA compliance | Completed on time divided by completed |
| External-coordination rate | Completed requests involving phone, email or WhatsApp divided by completed requests |
