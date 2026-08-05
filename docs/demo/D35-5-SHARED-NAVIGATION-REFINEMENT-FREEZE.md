# D35-5 — Shared Navigation Refinement Freeze

## Freeze status

**COMPLETE — D35 SHARED NAVIGATION REFINEMENT FROZEN**

## Baseline

| Field | Value |
|---|---|
| Repository | `Nyabera/digi-serve` |
| Branch | `demo/d35-shared-navigation-visual-refinement` |
| D35-4 acceptance commit | `d06fb0e6edf460a1bc58f7c55ff9fca80c1b8190` |
| D35-4 short commit | `d06fb0e` |
| Generated locally | `2026-08-05 19:37:47 EAT` |
| Generated UTC | `2026-08-05T16:37:47Z` |

## Frozen scope

D35 is frozen for:

- Applicant
- Officer
- Supervisor
- Admin

Department remains explicitly excluded and unchanged.

## Frozen implementation

The final implementation is owned by:

```text
components/demo/internal-shell/internal-shell.module.css
features/demo-applicant/components/applicant-workspace-shell.module.css
```

The final exact values are recorded in:

```text
docs/demo/d35-freeze/FINAL-VISUAL-VALUES.txt
```

The checksum manifest is:

```text
docs/demo/d35-freeze/SHA256SUMS
```

## Acceptance evidence

Desktop evidence:

- Applicant
- Officer
- Supervisor
- Admin
- Department control

Mobile evidence:

- Applicant
- Admin

The D35-4 human visual decision is recorded as PASS.

## Frozen guarantees

The following must not drift without a new numbered change stage:

- Source Code Pro navigation typography
- 0.7125rem navigation font size
- 400 navigation font weight
- 0.05px letter spacing
- #666666 inactive labels
- unchanged inactive icon colour
- unchanged active item colour
- square active rows
- final role-specific item heights
- final role-specific icon sizes
- icon stroke width 1
- final expanded desktop sidebar widths
- unchanged mobile and collapsed widths
- unchanged labels, ordering, hrefs, and active matching
- unchanged Department navigation

## Verification

Run:

```bash
./scripts/demo/verify-d35-5-shared-navigation-freeze.sh
```

The verifier checks exact values, role scope, protected global tokens, evidence files, and SHA-256 integrity.

## Stage completion

D35-5 completes D35. No additional D35 changes should be made after this freeze without reopening the stage or starting a new numbered change sequence.
