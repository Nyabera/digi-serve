# D29R-12 — Demo action controls and tracking entry

## Scope

D29R-12 corrects action-button presentation and makes the request-tracking
feature reachable through a canonical public entry URL.

## System correction

- Demo action controls keep labels on one line.
- Action rows may stack or wrap, but individual labels do not split.
- Decorative right-arrow and chevron icons are hidden inside button-like
  actions.
- Icon-only utility controls remain available.
- Savannah homepage action buttons use the same single-line contract.
- The confirmation page retains a dynamic link to the request that was
  submitted.
- `/demo/track` redirects to the seeded demonstration request.
- `/demo/track?requestId=<ID>` redirects to the requested safe synthetic ID.
- The existing `/demo/track/[requestId]` page remains the actual tracking page.
- No production database or Supabase writes are introduced.
- The 14-page route inventory is unchanged because the new entry uses
  `route.ts`, not another `page.tsx`.
