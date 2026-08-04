# D29R-20 — Officer individual case page

## Route behavior

The existing route remains:

```text
/demo/officer/requests/[requestId]
```

It now opens the individual case workspace by default.

The previously implemented Share Workflow / Refer Case screen is preserved at:

```text
/demo/officer/requests/[requestId]?view=refer
```

This avoids adding another `page.tsx` route and keeps older route-count
verification intact.

## Individual case sections

- breadcrumbs and request identity;
- current status and SLA time remaining;
- five-stage workflow;
- request details;
- submitted documents;
- academic record verification;
- discrepancy review;
- next action checklist;
- applicant contact summary;
- case activity;
- internal notes;
- Share Workflow / Refer Case action.

## Boundary

The Officer dashboard is not replaced or redesigned. Queue links that already
target `/demo/officer/requests/[requestId]` now open the individual case page.
The referral implementation is preserved verbatim in
`share-workflow-referral-page.tsx`.
