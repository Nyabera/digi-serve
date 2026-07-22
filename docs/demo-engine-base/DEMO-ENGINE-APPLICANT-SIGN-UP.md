# FAIDIA Demo Engine Applicant Sign-Up

## Document status

- Stage: D16
- Status: Active
- Route: `/demo/sign-up`
- Authentication mode: Simulated browser state
- Production Supabase access: Prohibited

## 1. Purpose

D16 builds the simulated applicant sign-up step for the Demo Engine.

The page captures the minimum applicant details needed to continue the public request journey.

D16 does not create a production authentication account.

## 2. Selected-service continuity

The service-information page starts the journey using:

`/demo/sign-up?service=[serviceSlug]`

The sign-up route reads the `service` query parameter.

After successful simulated sign-up, the applicant continues to:

`/demo/apply/[serviceSlug]`

When the query parameter is absent, the route uses `transcript-request`.

An unknown or inactive service returns the Next.js not-found page.

## 3. Applicant details

D16 captures:

- full legal name;
- email address;
- phone number;
- applicant accuracy declaration.

The page updates the D7 applicant record through the typed `UPDATE_APPLICANT` action.

The page also sets the active role to `APPLICANT`.

## 4. State boundary

Applicant information is stored only in the shared Demo Engine browser state.

The route does not:

- create a Supabase Auth user;
- send verification email;
- set a production session;
- write to production tables;
- upload a production document;
- read production applicant information.

## 5. Existing system boundaries

D16 continues to use:

- D6 client and service configuration;
- D7 shared state and typed reducer actions;
- D8 role, request, presentation and reset controls;
- D9 public-facing shell;
- D15 service selection.

## 6. User experience

The page must show:

- selected service;
- institution;
- processing-time context;
- full name;
- email;
- phone;
- declaration;
- clear continuation action;
- explanation that no production account is created;
- summary of the next request steps.

## 7. Restrictions

D16 does not implement:

- production registration;
- production sign-in;
- password creation;
- email verification;
- a database-backed draft request;
- the configurable application form;
- document selection;
- final request submission.

Those capabilities belong to later Demo Engine stages or the production V1.

## 8. D16 definition of done

D16 is complete when:

- the placeholder sign-up page is replaced;
- the selected service is preserved from the query parameter;
- missing service context defaults to Transcript Request;
- unknown service context returns not found;
- applicant details update shared state;
- the active role becomes Applicant;
- continuation opens the matching application route;
- the page clearly states that no real account is created;
- no Supabase dependency is added;
- type checking passes;
- linting passes;
- the production build passes;
- D16 verification passes;
- D16 is committed separately.
