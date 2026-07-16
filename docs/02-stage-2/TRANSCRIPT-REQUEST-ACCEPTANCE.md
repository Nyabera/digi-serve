---
title: Transcript Request Acceptance Scenarios
stage: 2
status: READY_FOR_OWNER_APPROVAL
version: 1.1.0
last_updated: 2026-07-16
---

# Transcript Request Acceptance Scenarios

## 1. Applicant submission

```gherkin
Feature: Applicant submits a Transcript Request

  Scenario: Eligible applicant submits a valid request
    Given an eligible applicant is signed in
    And the Transcript Request service is active
    When the applicant starts a request
    And completes every required field
    And uploads a National ID or passport
    And uploads payment-reference evidence
    And enters a payment reference
    And accepts the applicant declaration
    And accepts institutional verification consent
    And confirms the review page
    And submits the request
    Then one unique request reference is created
    And the submitted form becomes read-only
    And the submitted documents become read-only
    And the request enters the unassigned Student Records queue
    And the applicant sees "Submitted"
    And the applicant receives confirmation
    And the submission appears in status history
    And the submission appears in audit history
```

## 2. Applicant correction

```gherkin
Feature: Applicant responds to a correction

  Scenario: Applicant corrects only requested items
    Given Student Records requested a correction
    And the correction deadline has not passed
    When the applicant opens the request
    Then only flagged fields are editable
    And only rejected documents are replaceable
    When the applicant resubmits
    Then the request returns to the same Records work item
    And the request reference does not change
    And the assigned officer is notified
    And the correction cycle is audited
```

## 3. Student Records officer

```gherkin
Feature: Student Records processes the request

  Scenario: Records officer clears the request
    Given a Records officer is assigned
    When the officer opens the request
    Then the officer sees the submitted form
    And can access permitted documents
    And can start review
    And can accept or reject documents
    And rejection requires a reason
    And internal notes remain hidden from the applicant
    And the officer can request correction
    And can reject an ineligible request
    And can create a Finance referral after Records clearance
    And every action is server-authorized
    And every state change is audited
```

## 4. Finance referral

```gherkin
Feature: Finance processes the referral

  Scenario: Finance accepts and clears the request
    Given Student Records created a valid Finance referral
    And the referral is pending acceptance
    When an authorized Finance officer opens it
    Then the officer can accept it
    And can decline with reason
    And can return it for clarification
    When the officer accepts
    Then the Finance work item becomes active
    And acceptance time is recorded
    When the officer starts work
    Then start time is recorded
    When the officer records FINANCE_CLEAR
    And completes the referral
    Then the structured result returns to Records
    And Student Records remains the parent owner
    And the originator is notified
    And the handoff is fully audited
```

## 5. Supervisor

```gherkin
Feature: Supervisor manages departmental work

  Scenario: Supervisor manages Student Records queues
    Given a Student Records supervisor is signed in
    When the supervisor opens the department workspace
    Then the supervisor sees unassigned work
    And assigned work
    And due-soon work
    And overdue work
    And can assign a Records work item
    And can reassign with reason
    And can view Finance referrals
    And can view requests waiting on Finance
    And can view approved requests waiting on issuance
    And can view stage durations
    And cannot access another organization
    And cannot edit audit events
```

## 6. Organization Admin

```gherkin
Feature: Organization Admin configures the slice

  Scenario: Admin publishes Transcript Request
    Given an Organization Admin is signed in
    When the admin configures the service
    Then the admin can publish a service version
    And set the KES 500 fee
    And configure eligibility
    And configure form fields
    And configure document requirements
    And attach the workflow version
    And configure Student Records, Finance and Registrar
    And invite staff
    And assign fixed V1 roles
    And enable required feature flags
    And cannot overwrite a published version attached to an existing request
```

## 7. Official upload completion

```gherkin
Feature: Registrar issues an official transcript

  Scenario: Official Registrar PDF completes the request
    Given Registrar approved the request
    And the request is APPROVED_PENDING_ISSUANCE
    When an authorized Registrar user uploads a valid official transcript PDF
    Then FAIDIA validates the file
    And stores it privately
    And calculates a checksum
    And creates one issued-document record
    And records issuance_mode as OFFICIAL_UPLOAD
    And notifies the applicant
    And the request becomes COMPLETED
    And the applicant can download the document through an authorized signed URL
```

## 8. Demonstration fallback completion

```gherkin
Feature: FAIDIA generates a demonstration transcript

  Scenario: Demo generation completes the request when official PDF is unavailable
    Given Registrar approved the request
    And the request is APPROVED_PENDING_ISSUANCE
    And an official transcript PDF is unavailable
    And seeded synthetic academic data exists
    When the authorized fallback issuance action runs
    Then FAIDIA generates a PDF
    And every page is marked DEMONSTRATION DATA
    And the file is stored privately
    And a checksum is calculated
    And one issued-document record is created
    And issuance_mode is DEMO_GENERATED
    And the applicant is notified
    And the request becomes COMPLETED
```

## 9. Issuance failure

```gherkin
Feature: Issuance failure does not falsely complete a request

  Scenario: Official upload fails validation
    Given the request is APPROVED_PENDING_ISSUANCE
    When the Registrar uploads an invalid file
    Then no issued-document record is created
    And the request remains APPROVED_PENDING_ISSUANCE
    And the applicant does not receive a completion notification
    And the failure is audited
```

```gherkin
  Scenario: Demo generation fails
    Given the request is APPROVED_PENDING_ISSUANCE
    When demonstration PDF generation fails
    Then no issued-document record is created
    And the request remains APPROVED_PENDING_ISSUANCE
    And the issuing user and supervisor are notified
    And the failure is audited
```

## 10. Complete end-to-end scenario

```gherkin
Feature: Complete Transcript Request vertical slice

  Scenario: Applicant receives a transcript through either valid issuance mode
    Given Savannah Technical College is configured
    And Student Records, Finance and Registrar exist
    And the Transcript Request service is published
    And the service fee is KES 500

    When an eligible applicant submits a valid request
    Then Student Records receives one request with one reference

    When the supervisor assigns the Records work item
    And the Records officer verifies identity
    And matches the academic record
    And accepts every required document
    And clears Records
    And creates a Finance referral
    Then Finance receives a pending referral

    When Finance accepts
    And verifies the payment reference
    And records FINANCE_CLEAR
    And completes the referral
    Then the result returns to Records

    When the request advances to Registrar
    And Registrar approves
    Then the request becomes APPROVED_PENDING_ISSUANCE

    When either a valid official Registrar PDF is uploaded
    Or a valid demonstration transcript is generated
    Then one issued-document record is created
    And the request becomes COMPLETED
    And the applicant receives a secure download notification

    And the applicant sees one continuous timeline
    And the supervisor sees every stage duration
    And request history is complete
    And handoff history is complete
    And audit history is complete
    And no organization or department boundary is violated
```

## 11. Required exception coverage

The implementation must test:

1. duplicate submission;
2. missing required field;
3. missing required document;
4. unauthorized officer access;
5. applicant cross-request access;
6. cross-organization access;
7. document rejection without reason;
8. correction editing outside flagged scope;
9. Finance editing academic data;
10. Finance completion without structured result;
11. Registrar approval before Records and Finance completion;
12. unsupported official upload type;
13. official upload over 20 MB;
14. failed storage;
15. demo generation without synthetic seed data;
16. demo PDF without visible demonstration marking;
17. duplicate issuance retry;
18. internal note leakage;
19. audit-event mutation;
20. completion without issued-document record.
