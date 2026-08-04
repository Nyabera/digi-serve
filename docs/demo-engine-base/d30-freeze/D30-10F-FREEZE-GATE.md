# D30-10F Verification, Build and Freeze Alignment Gate

## Purpose

D30-10F is the final automated gate for D30-10A through D30-10E.

It verifies that the new public verification, Officer document hub, Applicant
profile, Applicant document vault, route registry, navigation and Demo state:

- remain aligned with the frozen Demo architecture;
- compile under TypeScript;
- pass lint;
- pass tests;
- pass Demo Pack validation;
- pass the production build;
- appear in the generated Next.js route output;
- contain no Git whitespace defects.

## Commands

Run the normal freeze gate:

```text
./scripts/run-d30-10f-freeze-gate.sh
```

Run it after committing D30-10F and require a clean working tree:

```text
D30_10F_REQUIRE_CLEAN=1 \
./scripts/run-d30-10f-freeze-gate.sh
```

Include a live localhost route smoke test:

```text
D30_10F_RUN_DEV_SMOKE=1 \
./scripts/run-d30-10f-freeze-gate.sh
```

The live smoke test uses port `3010` unless `D30_10F_DEV_PORT` is provided.

## Synthetic workflow-boundary notices

The TVET workflow fixtures do not repeat explicit Start and End entries in each
workflow.

The universal workflow model supplies those boundaries. D30-10F therefore:

1. captures the raw validation output;
2. requires `Errors: 0`;
3. requires the Demo Pack PASS result;
4. verifies that synthetic Start and End notices are balanced;
5. fails on every other warning;
6. records the expected notices in the freeze report.

This preserves validator transparency without treating expected model behaviour
as a freeze failure.

## Freeze report

A successful run writes:

```text
docs/demo-engine-base/d30-freeze/D30-10F-VERIFICATION-REPORT.txt
```

The report records:

- timestamp;
- branch and base commit;
- Node, npm and Next.js versions;
- every gate result;
- whether live route smoke testing ran;
- the temporary raw-log location.

## Alignment rules

D30-10F verifies:

- one central route registry;
- correct role-home mappings;
- correct public, Applicant and Officer navigation;
- Verify Certificate in the homepage footer only;
- all new configuration validators integrated;
- TVET content remains pack-owned;
- reusable mechanics do not import TVET fixtures directly;
- public verification excludes prohibited personal fields;
- the Applicant vault contains no permanent public file URLs;
- application source no longer imports `next/font/google`;
- local variable-font packages are recorded;
- new route pages inherit rather than remount shared shells.
