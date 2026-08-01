# D31-12 — Cross-role Dashboard Regression and D31 Freeze

## Objective

D31-12 closes the dashboard-redesign programme after the role-specific freezes:

```text
D31-7  Officer visual freeze
D31-9  Supervisor visual freeze
D31-11 Admin visual freeze
```

It does not alter any frozen dashboard implementation, route, shell, screenshot,
reference asset or role baseline.

The role visual suites can regenerate comparison PNGs and metrics during a
normal regression run. D31-12 treats those files as read-only freeze artifacts
and restores them to the committed role baseline immediately after each suite.

## Cross-role regression

The regression gate runs the complete Officer, Supervisor and Admin visual test
suites without updating their screenshots.

A separate Playwright smoke suite then visits all three role routes in one
browser session and verifies:

- exactly one role-specific dashboard body exists on each route;
- the expected role body is visible;
- foreign role bodies are absent;
- each role body has one page heading;
- each role body has measurable geometry;
- route transitions remain distinct;
- no uncaught page errors occur;
- generated role-comparison artifacts are restored to their frozen versions.

## Engineering gate

D31-12 reruns:

```text
D31-2 shell contract
D31-7 Officer freeze verifier
D31-9 Supervisor freeze verifier
D31-11 Admin freeze verifier
Officer visual regression
Supervisor visual regression
Admin visual regression
Cross-role Playwright regression
Demo Pack validation
TypeScript
ESLint
Vitest
Production build
Git whitespace validation
```

## Master freeze

The D31 master freeze hashes the role routes, shared dashboard system,
role-specific implementations, visual tests, screenshots, comparison artifacts,
role baselines and freeze verifiers.

The checklist is intentionally excluded because its final completion markers are
committed after the master freeze is recorded.
