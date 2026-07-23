# FAIDIA Demo Engine Technical Verification

## Document status

- Stage: D29
- Status: Active
- Scope: Final technical verification before freeze
- Route inventory: 14 pages
- Production Supabase access: Prohibited

## 1. Purpose

D29 runs the complete technical verification gate for the reusable Demo Engine.

The stage validates route integrity, source boundaries, accessibility checks, TypeScript, linting, automated tests, production build output and Git cleanliness.

D29 does not add product functionality.

## 2. Verification commands

The primary command is:

`./scripts/verify-d29-technical-verification.sh`

The verifier executes:

- D29 route inventory audit;
- D29 Demo Engine boundary audit;
- D28 source accessibility audit;
- shell syntax checks for all stage verifiers;
- package dependency validation;
- TypeScript validation;
- ESLint validation;
- configured automated tests;
- Next.js production build;
- whitespace validation.

## 3. Route verification

D29 requires the exact approved 14-page route inventory.

The audit fails when:

- a route is missing;
- an unexpected route exists;
- two page files resolve to the same route;
- a page lacks a default export;
- the obsolete singular `/demo/outcome` route returns.

The controlled outcome route remains:

`/demo/outcomes/[requestId]`

## 4. Demo Engine boundary verification

The Demo Engine remains synthetic and browser-session based.

D29 fails when Demo Engine runtime source contains:

- Supabase imports or client calls;
- Supabase environment access;
- network requests;
- WebSocket creation;
- persistent localStorage use;
- missing shared-state storage keys;
- missing single-homepage configuration;
- missing route-scoped calibration, presentation or accessibility layers.

## 5. TypeScript, lint and build

D29 requires:

- `npx tsc --noEmit`;
- `npm run lint`;
- the configured automated test command;
- `npm run build`;
- `git diff --check`.

Warnings should be reviewed. Errors fail D29.

## 6. Automated tests

The verifier reads the `test` script from `package.json`.

It runs:

- Vitest using `npm test -- --run`;
- Jest using `npm test -- --runInBand`;
- another configured runner using `npm test -- --run`.

A missing or placeholder test script fails D29 because this repository has an established testing stage.

## 7. Evidence

Run D29 with a terminal log when formal evidence is required:

`./scripts/verify-d29-technical-verification.sh 2>&1 | tee /tmp/faidia-d29-verification.log`

The log remains outside the repository and is not committed.

## 8. Manual smoke test

After automated checks pass, manually confirm:

- `/demo` loads;
- one applicant submission can be completed;
- officer review can create a Finance referral;
- Finance can accept and complete the referral;
- Registrar approval works after `CLEAR`;
- the controlled outcome can be issued;
- download or collection completes the request;
- reports render eight charts;
- presentation mode exits with Escape;
- reset returns to `/demo`.

## 9. D29 restrictions

D29 does not:

- add a route;
- modify workflow behavior;
- modify shared state;
- modify client configuration;
- modify public status mappings;
- write production records;
- call Supabase;
- freeze the Demo Engine.

The freeze occurs in D30 after D29 passes.

## 10. D29 definition of done

D29 is complete when:

- the route audit passes;
- the boundary audit passes;
- the D28 accessibility audit passes;
- every verifier script has valid shell syntax;
- required packages resolve;
- TypeScript passes;
- ESLint passes;
- automated tests pass;
- the production build passes;
- Git whitespace validation passes;
- only D29-owned files are changed;
- the 14-route inventory remains exact;
- no production dependency is introduced;
- D29 verification passes;
- D29 is committed separately.
