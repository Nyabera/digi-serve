# FAIDIA Demo Engine Review and Submission

## Document status

- Stage: D19
- Status: Active
- Route: `/demo/requests/[requestId]/confirmation`
- Submission mode: Synthetic browser-session event
- Production Supabase access: Prohibited

## 1. Purpose

D19 replaces the confirmation placeholder with a review-before-submission page, explicit submission confirmation and a submitted-request confirmation state.

The applicant must review the configured form responses and selected-document metadata before the request can be submitted.

## 2. Route continuity

D18 continues to:

`/demo/requests/[requestId]/confirmation?service=[serviceSlug]`

The D19 route reads:

- the request reference from the route parameter;
- the selected service from the query parameter.

When the service query parameter is absent, Transcript Request is used.

An unknown or inactive service returns the Next.js not-found page.

## 3. Review content

The page displays:

- applicant name;
- applicant email;
- applicant phone;
- selected service;
- processing target;
- every configured form section;
- every configured form response;
- every configured document requirement;
- selected filenames;
- selected file sizes;
- required, conditional and optional document levels;
- draft request reference.

The review renderer uses D6 configuration and D7 browser state.

## 4. Completeness validation

Submission is blocked when:

- the simulated applicant is not registered;
- a required form field is incomplete;
- a required document has no valid metadata selection;
- the explicit submission declaration is not accepted.

The page links back to the relevant applicant, form and document steps.

## 5. Explicit confirmation

The applicant must select a declaration confirming that the information and document metadata have been reviewed.

The Submit request button remains disabled until the application journey is complete.

A missing declaration also produces a visible validation message.

## 6. Synthetic submission record

D19 records submission using existing D7 typed actions.

The stage stores:

- `__submission:submittedAt`;
- `__submission:reference`;
- `__submission:confirmed`.

The stage also appends one `request_submitted` activity event.

The existing seeded active request identifier becomes the controlled demonstration reference.

D19 does not generate a production database reference or workflow record.

## 7. Confirmation state

After submission, the same route displays:

- confirmation that the request was submitted;
- request reference;
- submission date and time;
- applicant-safe Submitted status;
- processing target;
- Track request action;
- Open officer workspace action.

Refreshing the page preserves the confirmation state within the same browser session.

## 8. Idempotency

After a submitted timestamp exists, the page remains in the submitted state.

The normal interface does not expose a second Submit request action.

This prevents accidental duplicate activity events through ordinary use.

## 9. Security boundary

D19 does not:

- create a production request;
- create a production workflow instance;
- create a production work item;
- create a production assignment;
- write to Supabase;
- send production notifications;
- upload file bytes;
- expose sensitive documents;
- create a production audit event.

It records controlled synthetic values in the Demo Engine session only.

## 10. Existing system boundaries

D19 continues to use:

- D6 client, service, form and document configuration;
- D7 shared browser state and typed actions;
- D8 demonstration controls and reset;
- D9 public-facing shell;
- D16 simulated applicant identity;
- D17 configured form responses;
- D18 selected-document metadata.

The 14-route inventory remains unchanged.

## 11. D19 definition of done

D19 is complete when:

- the confirmation placeholder is replaced;
- the page reviews applicant details;
- the page reviews configured form responses;
- the page reviews selected-document metadata;
- incomplete required fields block submission;
- incomplete required documents block submission;
- explicit confirmation is required;
- submission records `request_submitted`;
- the synthetic reference is displayed;
- the submitted state survives refresh in the browser session;
- Track request opens the matching request;
- no Supabase dependency is introduced;
- type checking passes;
- linting passes;
- the production build passes;
- D19 verification passes;
- D19 is committed separately.

The stage also appends one request_submitted activity event.
