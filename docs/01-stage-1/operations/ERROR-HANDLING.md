# FAIDIA Stage 1 — Error Handling Contract

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Authority:** AC-SCP-05, AC-AUD-04 and AC-SEC-09

## 1. Thesis

Errors must preserve domain truth, give the user a safe recovery path and give operators a correlation trail. UI messages never reveal authorization rules, secrets, stack traces, SQL or private storage paths.

## 2. Error taxonomy

| Kind | HTTP analogue | User behavior |
|---|---:|---|
| validation | 400/422 | show field/command-safe corrections; retain input |
| unauthenticated | 401 | safe sign-in return path |
| forbidden | 403 | permission-denied state; do not reveal record existence |
| not found | 404 | not-found state, including concealed unauthorized resources |
| stale/conflict | 409 | refresh current state; do not retry mutation blindly |
| rate limited | 429 | bounded retry guidance |
| temporary dependency | 503 | preserve committed work; offer safe retry |
| unexpected | 500 | generic message and correlation ID |

## 3. Boundary behavior

Validation happens at UI convenience and again on the server. Domain commands return typed expected failures; unexpected failures are captured centrally. Transactions roll back all internal changes on failure. External jobs persist attempt/failure state, use bounded exponential retry with jitter and dead-letter/operator visibility after exhaustion.

Outcome generation failure records `OUTCOME_GENERATION_FAILED`, keeps the request in the approved recoverable state and exposes an authorized retry. Notification failure does not roll back workflow. Download retrieval failure records no successful download or completion.

## 4. UI state contract

Every required page supplies loading, empty, error, permission-denied and stale-action states. Consequential actions disable duplicate submission only as UX assistance; server idempotency remains authoritative. Forms keep non-sensitive entered data after recoverable validation errors.

## 5. Logging and redaction

Log correlation ID, environment, safe error code, actor/context IDs where permitted, command key and dependency category. Redact credentials, cookies, authorization headers, tokens, personal fields, file content, messages/notes and raw database errors.

## 6. Decision required

This contract is governed with `S1-DEC-042`; operational retry limits are environment configuration, not product workflow changes.

