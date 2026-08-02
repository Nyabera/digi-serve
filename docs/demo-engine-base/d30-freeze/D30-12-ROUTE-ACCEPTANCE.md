# D30-12 — Complete Route Acceptance Testing

## Purpose

D30-12 supplies acceptance evidence for the complete frozen Demo Engine after
the D31 dashboard redesign has been merged.

It tests the configured routes rather than relying on a hand-maintained list.

## Route discovery

The route manifest is generated from:

```text
app/demo/**/page.tsx
```

Known dynamic segments receive deterministic TVET values:

```text
requestId  -> active pack default request
serviceId  -> first configured service
workflowId -> first configured workflow
documentId -> first configured document
```

Unresolved catch-all or unknown dynamic segments are recorded separately for
manual review.

## Acceptance coverage

The gate verifies:

- public homepage and verification;
- Applicant tracking, profile and document vault;
- Officer dashboard, document hub, seeded request referral and SLA;
- Supervisor dashboard and operational routes;
- Admin dashboard, workflows and builder;
- configured report routes;
- role-route separation;
- one expected workspace body per role;
- no uncaught browser errors;
- no HTTP 500 route responses;
- D30-11 reset-state restoration;
- active TVET defaults after reset.

## D31 protection

D30-12 validates every D31-owned master-freeze file before and after
acceptance testing. `package.json` is intentionally excluded because D30-11
adds the reset-acceptance command after D31 was frozen. Dashboard source,
screenshots, role baselines and D31-owned verification files remain protected.

## Evidence

```text
docs/demo-engine-base/d30-freeze/
├── D30-12-ROUTE-MANIFEST.json
├── D30-12-ACCEPTANCE-RESULTS.json
├── D30-12-ACCEPTANCE-EVIDENCE.md
└── screenshots/acceptance/
```

Playwright HTML, traces and failure screenshots remain disposable diagnostics
under:

```text
artifacts/d30-acceptance/
```

D30-12 shares `tests/acceptance/d30/` with D30-11. Its rollback may remove
only `demo-route-acceptance.pw.ts`; it must never remove the committed
`demo-reset-behaviour.pw.ts`.

Role acceptance checks require at least one visible role workspace. They do not
require exactly one matching DOM marker because the frozen shell and dashboard
body can both carry the same role marker. Duplicate same-role markers are a
valid ownership hierarchy, not duplicate role UIs.

The standalone TypeScript and production-build gates begin with a clean `.next`
directory. Playwright's temporary `next dev` server may leave generated files
under `.next/dev/types`; those files are disposable and are never treated as
source or freeze evidence.

Route coverage is verified by matching every resolved manifest route to its
specific `route loads: <path>` Playwright result. The verifier does not compare
the total number of passing tests to the route count because the suite also
contains non-route journey tests and Playwright JSON uses outcome values such
as `expected` rather than `passed` at test level.
