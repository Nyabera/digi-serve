# FAIDIA Stage 1 — Feature Flag Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** Stage 0 `PAGE-INVENTORY.md`, `V1-NON-GOALS.md` and role/permission matrix

## 1. Thesis

Feature flags are server-side deployment/scope guards, not authorization and not a way to expose unapproved functionality.

## 2. Stage 1 registry

| Key | Synthetic organization | Meaning |
|---|---|---|
| `transcript_request` | enabled | fully functional vertical slice |
| `finance_handoff` | enabled | fixed Records → Finance collaboration |
| `pdf_generation` | enabled | approved private outcome generation path |
| `clearance_request_demo` | enabled | simplified demo service only |
| `certificate_replacement_demo` | enabled | simplified demo service only |
| `email_delivery` | disabled | required before external pilot |
| `public_verification` | disabled | postponed |
| `workflow_builder` | disabled | postponed |
| `advanced_reports` | disabled | outside Stage 1 |
| `sms_notifications` | disabled | outside Stage 1 |

Unknown keys default disabled. Flags are organization-scoped, evaluated on the server and cached only with organization/version-safe keys. Disabling a flag removes entry points but does not delete historical data or bypass valid in-flight-state handling.

## 3. Governance

The Stage 1 admin feature-flag page is `LATER_V1`; seed/migration configuration is sufficient. A flag cannot grant a permission, add a route classification or weaken server checks. Changes record actor/reason/audit where a management surface later exists.

## 4. Decision required

`S1-DEC-041` must approve this closed registry/default-off behavior.

