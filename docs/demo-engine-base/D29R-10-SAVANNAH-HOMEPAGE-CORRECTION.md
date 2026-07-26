# D29R-10 — Savannah Technical College Homepage Correction

## Decision

The `/demo` route is the Savannah Technical College student-facing homepage. It must not also render the FAIDIA demonstration route index.

The presentation-only journey map moves to:

- `/demo/demo-journey`

The journey is implemented as a route handler rather than another `page.tsx`. This keeps the established 14-page Demo Engine route inventory unchanged while providing a separate presentational control centre.

## Homepage boundary

The homepage must:

- identify Savannah Technical College consistently;
- use the dark operational student-service hub above the fold;
- use the warm editorial information system below it;
- include service search, quick actions, request tracking and live status;
- show exactly four popular college services;
- explain the four-stage student-safe process;
- show the student-experience placeholder;
- visibly label illustrative demo metrics and personas;
- use Plus Jakarta Sans and Inter only;
- provide keyboard focus, semantic headings, labelled search, real accordion buttons and 44px coarse-pointer targets;
- remain responsive through desktop, tablet and mobile layouts.

## Popular services

1. Academic transcript request
2. Student clearance
3. Certificate replacement
4. Industrial attachment letter

## Seeded operational route

The public request card presents:

- public reference: `SAV-TR-2026-00421`
- service: Academic transcript request
- current status: Finance verification
- next step: Registrar approval

The card links to the existing repeatable request fixture:

- `/demo/track/REQ-DEMO-001`

This keeps the public presentation realistic without changing the Demo Engine state model.

## Image policy

The supplied campus and student-group photographs are installed as placeholders:

- `public/demo/homepage/savannah-campus-placeholder.jpeg`
- `public/demo/homepage/savannah-students-placeholder.jpg`

They must be replaced with approved Savannah Technical College photography before any real public deployment. Placeholder labels and demo disclaimers remain visible in the current build.

## Route and architecture safety

D29R-10:

- replaces only `app/demo/page.tsx`;
- adds the separate `/demo/demo-journey` route handler;
- adds a self-contained homepage feature;
- introduces no Supabase write;
- introduces no network request;
- changes no workflow, role, permission, configuration or state contract;
- keeps the plural `/demo/outcomes/[requestId]` route canonical;
- keeps the 14 `page.tsx` route count unchanged.

## Manual acceptance

Test `/demo` at:

- 1440 × 900
- 1200 × 800
- 1024 × 768
- 768 × 1024
- 390 × 844
- 320 × 568
- 200% browser zoom

Confirm:

- only one homepage is visible;
- the white temporary route-index hero is gone;
- the Savannah dark header begins at the top of the page content;
- all four popular services are present;
- both supplied photographs render;
- search is labelled and `Command/Ctrl + K` focuses it;
- mobile navigation opens and closes;
- FAQ controls are keyboard operable;
- no page-level horizontal scrollbar appears;
- `/demo/demo-journey` contains the presentation route map;
- presentation and reset controls remain available through the existing Demo Engine frame.
