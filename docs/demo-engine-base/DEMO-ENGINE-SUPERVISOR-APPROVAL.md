# FAIDIA Demo Engine Supervisor Approval

## Document status

- Stage: D23
- Status: Active
- Route: `/demo/supervisor`
- Decision profile: Registrar-profile Supervisor
- Production Supabase access: Prohibited

## 1. Purpose

D23 replaces the supervisor placeholder with the Registrar approval workspace.

Only the Registrar-profile Supervisor may approve, reject or return the request for clarification.

D23 records the formal decision but does not issue the controlled outcome. Outcome issuance belongs to D24.

## 2. Approval prerequisites

Approval is blocked until all of the following pass:

- required configured application fields are complete;
- required document metadata is available;
- the originating officer completed all three review checks;
- the Finance referral is completed;
- a structured Finance result exists;
- the Finance result is CLEAR;
- no unresolved correction, clarification or declined referral remains.

A HOLD or CANNOT_VERIFY result cannot be approved.

## 3. Registrar approval

The Registrar must confirm the decision declaration.

Approval records:

- decision APPROVED;
- internal status APPROVED;
- applicant-safe status APPROVED;
- Registrar name and profile;
- decision timestamp;
- Finance result;
- internal decision note;
- immutable final-decision flag;
- one request_approved activity event.

Approval authorizes D24 outcome issuance.

## 4. Final rejection

Rejection requires:

- a reviewed application;
- required documents;
- a Finance result;
- Registrar declaration;
- applicant-visible rejection reason.

Rejection records an immutable REJECTED decision and one request_rejected activity event.

## 5. Return for clarification

The Registrar may return the request to Student Records with a clear reason.

This records:

- RETURNED_FOR_CLARIFICATION decision;
- internal status SUPERVISOR_CLARIFICATION_REQUIRED;
- applicant-safe status ADDITIONAL_CHECKS_IN_PROGRESS;
- one request_returned_for_clarification activity event.

It does not create an approved outcome.

## 6. Role and ownership boundary

Registrar is a Supervisor membership profile, not a separate top-level role.

Student Records remains the parent-request owner.

Finance supplies a structured result but cannot make the final decision.

The Registrar cannot silently bypass missing approval prerequisites.

## 7. State boundary

D23 stores synthetic decision data in the D7 browser session state.

The stage does not:

- call Supabase;
- create a production decision;
- generate an outcome PDF;
- upload an official transcript;
- issue an applicant download;
- mark delivery or collection complete;
- reopen a completed production request.

## 8. D23 definition of done

D23 is complete when:

- the supervisor placeholder is replaced;
- the approval queue state is visible;
- all approval prerequisites are displayed;
- approval is blocked unless Finance returned CLEAR;
- only the Registrar-profile Supervisor is represented as decision authority;
- the Registrar can approve;
- the Registrar can reject with an applicant-visible reason;
- the Registrar can return for clarification;
- decision data persists in shared demo state;
- request_approved and request_rejected events are supported;
- D24 outcome issuance is linked only after approval;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking passes;
- linting passes;
- the production build passes;
- D23 verification passes;
- D23 is committed separately.
