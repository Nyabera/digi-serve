# FAIDIA Demo Engine Controlled Outcome

## Document status

- Stage: D24
- Status: Active
- Route: `/demo/outcomes/[requestId]`
- Outcome type: Controlled notice plus synthetic demo transcript
- Production Supabase access: Prohibited

## 1. Purpose

D24 replaces the outcome placeholder with controlled demonstration issuance and applicant access.

The stage issues one exact synthetic transcript copy after Registrar approval.

D24 separates approval, issuance and completion.

## 2. Issuance prerequisite

An outcome can be issued only when D23 contains an immutable Registrar APPROVED decision.

REJECTED and RETURNED_FOR_CLARIFICATION decisions cannot issue an outcome.

Repeated issuance is blocked after the first issued record is saved.

## 3. Outcome record

The controlled outcome stores:

- issued-document ID;
- request reference;
- service;
- document type;
- public reference;
- version;
- delivery method;
- issue timestamp;
- issuing Registrar;
- approving decision reference;
- applicant name;
- student reference;
- programme;
- checksum;
- exact stored HTML copy;
- exact-copy statement;
- delivery status and timestamp when completed.

The exact synthetic copy is stored at issuance and is not regenerated differently on later access.

## 4. Approved outcome type

The D24 outcome is:

- a controlled outcome notice;
- one synthetic demonstration transcript.

It is not an official academic transcript.

The institution or its current authoritative process remains responsible for creating the official transcript. FAIDIA stores and controls access to the exact issued copy.

## 5. Delivery methods

D24 supports the two approved delivery methods:

- CONTROLLED_DOWNLOAD;
- PHYSICAL_COLLECTION.

Issuance alone does not complete the request.

Controlled download records outcome_downloaded.

Physical collection records outcome_collected.

Either approved delivery action then records request_completed.

## 6. Status behavior

Controlled download issuance records:

- internal status OUTCOME_ISSUED;
- applicant-safe status READY_FOR_DOWNLOAD.

Physical collection issuance records:

- internal status OUTCOME_ISSUED;
- applicant-safe status READY_FOR_COLLECTION.

Recorded download or collection records:

- internal status COMPLETED;
- applicant-safe status COMPLETED.

## 7. Audit behavior

Issuance appends:

- document_issued;
- outcome_issued.

Recorded delivery appends one delivery event and request_completed.

The outcome record prevents duplicate issuance within the demonstration browser session.

## 8. Demonstration boundary

D24 stores one synthetic HTML outcome in D7 browser session state.

It does not:

- create an official transcript;
- generate a production PDF;
- upload to Supabase Storage;
- create a permanent public URL;
- create a production signed download;
- create public QR verification;
- add an electronic signature;
- use OCR;
- expose internal Finance or officer notes;
- call Supabase.

Production PDF generation, private storage, signed URLs, download logging and verification records remain separate production work.

## 9. D24 definition of done

D24 is complete when:

- the outcome placeholder is replaced;
- issuance requires Registrar approval;
- rejected and clarification decisions remain blocked;
- duplicate issuance is blocked;
- one exact synthetic transcript copy is stored;
- checksum and public reference are stored;
- controlled download is supported;
- physical collection is supported;
- issuance does not complete the request;
- recorded delivery completes the request;
- document_issued is recorded;
- outcome_issued is recorded;
- request_completed is recorded;
- applicant-safe ready and completed statuses are stored;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D24 verification passes;
- D24 is committed separately.
