# FAIDIA Stage 1 — Document and Outcome Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md` Sections 8 and 13–14, `docs/00-stage-0/V1-VERTICAL-SLICE.md` Phases 3, 5, 9–10, and AC-SUB/AC-COR/AC-OUT/AC-CMP/AC-SEC

## 1. Purpose

This document defines private applicant documents, review/replacement history, issued outcomes, authorized access and completion evidence.

## 2. Document thesis

The database owns document identity, authorization metadata, status and history. Supabase Storage holds private bytes under opaque server-derived keys. No stored object is public. Replacement, issue, revocation, download and collection preserve evidence.

## 3. Document classes

| Class | Examples | Owner/access |
|---|---|---|
| Applicant evidence | national ID/passport, student ID, payment evidence, name-change evidence | applicant self; permitted processing staff; explicit Finance projection only |
| Supporting staff evidence | authorized workflow/closure evidence | exact staff scope; not applicant-visible unless explicitly approved |
| Issued outcome | completion notice, controlled demo transcript, exact institutional copy | applicant self and authorized Student Records/Supervisor |

Internal notes and applicant messages are not document records even when they reference a permitted attachment.

## 4. Metadata contract

Each file version records at least:

- organization, request and document identities;
- requirement/outcome association and pinned requirement version where applicable;
- uploader actor/type and upload time;
- original display filename as untrusted text;
- storage bucket/key (never a public URL);
- media type, byte size and extension detected/validated server-side;
- status and immutable status/review history;
- replacement/replaced-by relationship;
- checksum algorithm/digest where applicable;
- issue/revoke metadata for outcomes;
- expected record version/stale token.

Part 6 assigns columns and constraints.

## 5. Private storage layout

Use separate private buckets or equivalent policy partitions:

- `request-documents`;
- `issued-outcomes`.

Use opaque server-derived object keys, for example:

```text
organizations/{organizationId}/requests/{requestId}/documents/{documentId}/versions/{fileVersionId}
organizations/{organizationId}/requests/{requestId}/outcomes/{outcomeId}/versions/{fileVersionId}
```

Do not place applicant names, identity numbers, email addresses, student numbers or raw filenames in object keys.

## 6. Applicant upload flow

1. Server authorizes applicant, organization, request state, pinned requirement and correction unlock.
2. Server validates intended metadata and creates an upload intent/file-version identity.
3. Client uploads to the exact private key using a short-lived scoped upload mechanism.
4. Finalize command verifies object existence and actual size/type, then records metadata/status and `DOCUMENT_UPLOADED` atomically.
5. Submission counts only finalized documents satisfying the pinned requirement.

An abandoned upload intent is not a submitted document and may be cleaned by a safe scheduled job.

## 7. File validation

- Allow types and byte limits per seeded requirement, finalized in `SEED-DATA.md`/`SECURITY.md` before implementation approval.
- Verify content signature/media type where practical; never trust extension or browser MIME alone.
- Normalize display filename and render it escaped.
- Reject zero-byte, oversized, disallowed or mismatched files.
- Malware scanning/quarantine is explicitly post-V1 (`DOC-002`) and must not be falsely represented as complete in Stage 1.

## 8. Review and replacement

- Staff with exact document/request scope may move an available document through review to `ACCEPTED` or `REJECTED`.
- Rejection requires an applicant-visible reason when correction is requested and records `DOCUMENT_REJECTED`.
- Acceptance records `DOCUMENT_ACCEPTED`.
- Applicant replaces only an unlocked required file.
- Old file version becomes `REPLACED` through an explicit relationship; bytes/metadata/history remain protected and retained.
- No ordinary user permanently deletes history.

## 9. Finance document access

Finance can access only document IDs explicitly attached to the active handoff and necessary for the requested action. The server returns a handoff-scoped document projection and authorizes each download separately.

## 10. Issued outcome lifecycle

1. Approval creates pending `IssuedOutcome` metadata.
2. Authorized processor/system generates a notice/demo file or records the exact external institutional file.
3. Calculate checksum where available.
4. Store privately and link exact version.
5. Mark file/outcome `ISSUED`.
6. Record `OUTCOME_GENERATED` and `DOCUMENT_ISSUED`.
7. Move request to `OUTCOME_READY` and notify applicant.

Failure records `OUTCOME_GENERATION_FAILED`, sets request `OUTCOME_FAILED` and preserves partial/failure evidence. Retry creates a new attempt/version as appropriate.

## 11. Controlled download and completion

A storage signed URL alone cannot prove a successful download initiation. Stage 1 therefore uses a short-lived signed FAIDIA download URL:

```text
/api/outcomes/[outcomeId]/download?token={shortLivedOpaqueToken}
```

Flow:

1. Applicant requests download from the outcome page.
2. Server authorizes current session, applicant ownership, organization, outcome `ISSUED`/not revoked and request `OUTCOME_READY` or `COMPLETED`.
3. Server creates a short-lived, single-purpose opaque signed token bound to applicant, outcome and organization.
4. GET route validates both session and token, reauthorizes current state, retrieves the private Storage object server-side and prepares the response.
5. After storage retrieval succeeds and before emitting the response, one transaction records one `DOCUMENT_DOWNLOADED` for the token use. If the request is `OUTCOME_READY`, it also moves to `COMPLETED`, records `REQUEST_COMPLETED`, completion method/time and required notification/audit/outbox. If already `COMPLETED`, it does not repeat completion.
6. A retry of the same still-valid token returns the file without duplicating that token's download/completion events; a later newly authorized download may create a new `DOCUMENT_DOWNLOADED` event.

“Successful controlled download” means the authorized server successfully retrieved the exact private object and began the file response. FAIDIA cannot prove that a person later opened/saved it.

This technical route must be added to `ROUTES.md`; it does not add a product page.

## 12. Physical collection

Authorized Student Records Officer with `requests.complete` and request `OUTCOME_READY` records collector name, identifier/relationship, collection date/time, outcome reference and optional note. The transaction records `OUTCOME_COLLECTED`, request `COMPLETED`, `REQUEST_COMPLETED` and completion facts.

## 13. Manual closure

Supervisor with `requests.manual_close`, request `OUTCOME_READY`, mandatory reason code/note and evidence reference may close exceptionally. Evidence reference must point to a permitted retained record; it is not a free public URL. Record both required events and completion facts.

## 14. Revocation and reopening

- Reopening does not revoke an issued outcome.
- Revocation is a separate `documents.revoke` action, requires exact permission/reason, marks outcome/document `REVOKED` and records `DOCUMENT_REVOKED`.
- Revoked outcomes cannot create new download tokens.
- Previous download/issue/completion evidence remains immutable.

## 15. Signed access

- Tokens/URLs are short-lived, purpose-specific and unpredictable.
- Current session and resource authorization are rechecked at use.
- Never log full signed URLs/tokens.
- Use safe `Content-Disposition`, media type and anti-sniffing headers.
- Denied/expired/revoked tokens reveal no cross-tenant object detail.
- Staff evidence downloads use their own exact authorization and do not complete the applicant request.

## 16. Tests

- private bucket/object policy and cross-tenant denial;
- applicant ownership and state/requirement upload authorization;
- finalize verifies object/metadata and records event once;
- correction replacement preserves history;
- Finance sees only attached documents;
- issued outcome/failure/retry/checksum behavior;
- signed token expiry, replay/idempotency, revocation and cross-user denial;
- first successful stream from `OUTCOME_READY` records exactly one completion; later downloads do not repeat completion;
- failed object retrieval does not complete;
- collection/manual closure exact prerequisites/evidence;
- filenames/headers resist injection.

## 17. Explicit non-goals

- Public buckets or permanent public links.
- Public QR/token verification.
- Malware scanning/quarantine, OCR or AI analysis.
- Generic document vault.
- Third-party recipient delivery.
- Generic “delivered” completion trigger.

## 18. Open questions

- `P5-OQ-DOC-001` — Finalize allowed media types and byte limits in `SEED-DATA.md`/`SECURITY.md` before implementation approval.
- `P5-OQ-DOC-002` — Finalize Stage 1 retention values and generated demo PDF template before implementation approval; do not delete immutable workflow/audit evidence while deciding retention.

## 19. Change rule

Adding a document class, public access path, completion trigger, scan/integration or retention behavior requires security/product approval and controlling-document updates.

## 20. Coding-agent instruction

Keep all bytes private and all object keys opaque. Authorize every upload/download at use time. Never mark a request complete merely because a link was displayed.
