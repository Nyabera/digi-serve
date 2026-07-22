# FAIDIA Demo Engine Department Processing

## Document status

- Stage: D22
- Status: Active
- Route: `/demo/department`
- Receiving department: Finance
- Production Supabase access: Prohibited

## 1. Purpose

D22 replaces the receiving-department placeholder with a functional Finance work-item workspace.

Finance can accept a structured referral, process the defined task and return a structured result to Student Records.

Finance does not take ownership of the applicant request.

## 2. D21 input

D22 reads the structured referral created during officer review.

The referral contains the originating department, receiving department, requested action, reason, expected output, due date, officer and timestamps.

When no D21 referral exists, the demo displays one controlled pending Finance referral.

## 3. Acceptance

Finance may accept a PENDING_ACCEPTANCE referral.

Acceptance records:

- status ACCEPTED;
- accepting officer;
- acceptance timestamp;
- internal status IN_FINANCE_REVIEW;
- applicant-safe status ADDITIONAL_CHECKS_IN_PROGRESS;
- one handoff_accepted activity event.

Student Records remains parent-request owner.

## 4. Processing result

Finance records exactly one result:

- CLEAR;
- HOLD;
- CANNOT_VERIFY.

Completing the work item records the result, result note, completing officer, completion timestamp and return timestamp.

Completion also records internal status FINANCE_COMPLETE, applicant-safe status ADDITIONAL_CHECKS_COMPLETED and one handoff_completed activity event.

The completed work item returns to Student Records.

## 5. Clarification and decline

An accepted referral can be returned for clarification.

A pending referral can be declined with a reason.

These actions preserve the reason and append a corresponding activity event.

## 6. Ownership boundary

D22 implements departmental referral processing, not request transfer.

Finance cannot approve, reject or issue the final outcome.

## 7. D21 compatibility

D22 expands the D21 referral parser and status labels so the originating-officer workspace continues to display accepted, completed, declined and clarification-returned referrals.

## 8. State boundary

D22 uses D7 browser session state only.

It does not query or write production records and does not call Supabase.

## 9. D22 definition of done

D22 is complete when:

- the department placeholder is replaced;
- Finance can accept the referral;
- handoff_accepted is recorded;
- Finance can record CLEAR, HOLD or CANNOT_VERIFY;
- Finance can complete and return the work item;
- handoff_completed is recorded;
- Finance can request clarification;
- Finance can decline with a reason;
- Student Records remains parent owner;
- D21 understands the expanded referral states;
- no Supabase dependency is introduced;
- the 14-route inventory remains intact;
- type checking, linting and build pass;
- D22 verification passes;
- D22 is committed separately.
