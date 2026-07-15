# FAIDIA Stage 1 — Data Dictionary

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `DATABASE.md`, approved Stage 0 documents, approved Part 5 documents, and `docs/01-stage-1/ACCEPTANCE-CRITERIA.md`

## 1. Purpose

This document defines the proposed Stage 1 PostgreSQL enums, tables, columns, keys and important constraints. It is the bridge from the logical Part 5 contracts to Part 6 migrations.

The design remains provisional where it depends on pending `S1-DEC-018` through `S1-DEC-028`.

## 2. Shared column conventions

Unless a table says otherwise:

| Column | Type | Rule |
|---|---|---|
| `id` | `uuid` | primary key; default `gen_random_uuid()` |
| `organization_id` | `uuid` | non-null tenant key; composite-FK participant |
| `created_at` | `timestamptz` | non-null; default `now()` |
| `updated_at` | `timestamptz` | non-null on mutable rows; application/utility trigger updates it |
| `record_version` | `bigint` | non-null on mutable aggregate rows; default `1`; increment per successful update |

All timestamps are UTC instants. Names ending `_at` use `timestamptz`; `_on` uses `date`. Foreign keys use UUID. Free text is `text` with explicit application/DB length checks finalized before migrations.

Every tenant table has `UNIQUE (organization_id, id)` to support tenant-safe composite foreign keys.

## 3. Proposed database enums

| Enum | Values |
|---|---|
| `fixed_role` | `APPLICANT`, `OFFICER`, `SUPERVISOR`, `ORGANIZATION_ADMIN`, `PLATFORM_ADMIN` |
| `fixed_profile_key` | `REGISTRAR` |
| `membership_status` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `department_key` | `STUDENT_RECORDS`, `FINANCE`, `REGISTRAR` |
| `version_status` | `DRAFT`, `PUBLISHED`, `RETIRED` |
| `request_status` | exact values from `STATUSES.md` |
| `work_item_status` | exact values from `STATUSES.md` |
| `handoff_status` | exact values from `STATUSES.md` |
| `document_status` | exact values from `STATUSES.md` |
| `decision_status` | exact values from `STATUSES.md` |
| `sla_state` | exact values from `STATUSES.md` |
| `notification_delivery_status` | exact values from `STATUSES.md` |
| `finance_result_code` | `CLEAR`, `HOLD`, `CANNOT_VERIFY` |
| `field_type` | `SHORT_TEXT`, `EMAIL`, `PHONE`, `SELECT`, `YEAR`, `TEXTAREA`, `CHECKBOX`, `DECLARATION` |
| `workflow_step_key` | `APPLICANT_SUBMISSION`, `STUDENT_RECORDS_REVIEW`, `APPLICANT_CORRECTION`, `FINANCE_REFERRAL`, `STUDENT_RECORDS_COMPLETION`, `REGISTRAR_DECISION`, `OUTCOME_PREPARATION`, `COMPLETION` |
| `delivery_method` | `CONTROLLED_DOWNLOAD`, `PHYSICAL_COLLECTION` |
| `completion_method` | `CONTROLLED_DOWNLOAD`, `PHYSICAL_COLLECTION`, `MANUAL_CLOSURE` |
| `snapshot_kind` | `SUBMISSION`, `CORRECTION_RESUBMISSION` |
| `document_kind` | `APPLICANT_EVIDENCE`, `STAFF_EVIDENCE`, `ISSUED_OUTCOME` |
| `document_review_decision` | `ACCEPTED`, `REJECTED` |
| `outcome_status` | `PENDING`, `PROCESSING`, `ISSUED`, `FAILED`, `REVOKED` |
| `attempt_status` | `PENDING`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELLED` |
| `actor_kind` | `APPLICANT`, `STAFF`, `ADMIN`, `SYSTEM`, `WORKER` |
| `message_author_kind` | `APPLICANT`, `STAFF` |
| `notification_channel` | `IN_APP`, `EMAIL` |
| `outbox_status` | `PENDING`, `PROCESSING`, `DELIVERED`, `FAILED`, `CANCELLED` |

`PLATFORM_ADMIN` exists as a reserved fixed value but receives no Stage 1 organization membership grants/navigation. `OVERDUE` is not a work-item status; SLA is separate.

## 4. Organization and identity tables

### 4.1 `organizations`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id` | `uuid` | no | PK |
| `slug` | `text` | no | normalized public slug; globally unique |
| `legal_name` | `text` | no | organization name |
| `display_name` | `text` | no | public/UI name |
| `time_zone` | `text` | no | IANA name; seed `Africa/Nairobi` |
| `locale` | `text` | no | seed `en-KE` |
| `is_active` | `boolean` | no | default true |
| `created_at`, `updated_at`, `record_version` | shared | no | mutable aggregate fields |

Indexes: unique `slug`; partial active-slug lookup. No ordinary application hard delete.

### 4.2 `organization_branding`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant; one current row per organization |
| `logo_bucket`, `logo_object_key` | `text` | yes | validated public-safe `branding-assets` object reference |
| `primary_color` | `text` | no | validated CSS hex token |
| `updated_by_membership_id` | `uuid` | yes | authorized admin membership |
| `created_at`, `updated_at`, `record_version` | shared | no | mutation tracking |

Constraints: unique `organization_id`; safe color check; tenant-safe admin FK.

### 4.3 `departments`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant |
| `key` | `department_key` | no | fixed Stage 1 department identity |
| `display_name` | `text` | no | seeded/admin-safe label |
| `is_active` | `boolean` | no | default true |
| `created_at`, `updated_at`, `record_version` | shared | no | mutable metadata |

Constraints/indexes: unique `(organization_id, key)`; unique active display name as appropriate.

### 4.4 `user_profiles`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id` | `uuid` | no | PK and FK to `auth.users(id)`; no organization column |
| `display_name` | `text` | no | safe UI name |
| `created_at`, `updated_at`, `record_version` | shared without tenant | no | profile lifecycle |

Do not store a global role. Email/credentials remain owned by Supabase Auth.

### 4.5 `applicant_profiles`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant |
| `user_id` | `uuid` | no | FK `user_profiles.id` |
| `student_number_normalized` | `text` | yes | permitted exact/search value |
| `created_at`, `updated_at`, `record_version` | shared | no | profile lifecycle |

Constraints: unique `(organization_id, user_id)`; indexed `(organization_id, student_number_normalized)` with privacy review.

### 4.6 `organization_memberships`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant |
| `user_id` | `uuid` | no | FK `user_profiles.id` |
| `role` | `fixed_role` | no | staff/admin fixed role; applicant self access is separate |
| `status` | `membership_status` | no | default `ACTIVE` for seed |
| `job_title` | `text` | yes | display only; never authorization |
| `joined_at` | `timestamptz` | no | default now |
| `suspended_at`, `ended_at` | `timestamptz` | yes | lifecycle evidence |
| `created_at`, `updated_at`, `record_version` | shared | no | mutation tracking |

Constraints: unique active relationship per `(organization_id, user_id)` for Stage 1; disallow `APPLICANT`/`PLATFORM_ADMIN` organization membership in normal seed unless separately approved.

### 4.7 `membership_departments`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant |
| `membership_id`, `department_id` | `uuid` | no | tenant-safe FKs |
| `is_primary` | `boolean` | no | default false |
| `created_at` | `timestamptz` | no | assignment evidence |

Constraints: unique `(organization_id, membership_id, department_id)`; at most one primary department per membership through partial unique index.

### 4.8 `membership_profiles`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| `id`, `organization_id` | `uuid` | no | PK/tenant |
| `membership_id` | `uuid` | no | tenant-safe Supervisor membership FK |
| `profile_key` | `fixed_profile_key` | no | Stage 1 `REGISTRAR` only |
| `created_at` | `timestamptz` | no | grant evidence |

Constraints: unique `(organization_id, membership_id, profile_key)`; DB check/trigger requires membership role `SUPERVISOR`.

## 5. Versioned service configuration

### 5.1 `services`

Columns: shared mutable tenant columns; `slug text`; `service_key text`; `is_active boolean`; `current_publication_id uuid NULL`; `created_by_membership_id uuid`.

Constraints/indexes: unique `(organization_id, slug)` and `(organization_id, service_key)`; Stage 1 full key `TRANSCRIPT_REQUEST`; current publication must belong to same service/organization.

### 5.2 `service_versions`

Columns: immutable-version tenant columns; `service_id uuid`; `version_number integer`; `status version_status`; `display_name text`; `public_description text`; `eligibility_text text`; `requirements_text text`; `processing_target_minutes integer`; `manual_payment_reference_enabled boolean`; `manual_payment_reference_required boolean`; `created_by_membership_id uuid`; `published_at timestamptz NULL`; `retired_at timestamptz NULL`.

Constraints: unique `(organization_id, service_id, version_number)`; positive target; required implies enabled; immutable after publish.

### 5.3 `form_definitions`

Columns: shared tenant identity columns; `service_id uuid`; `form_key text`; `created_at`.

Constraints: unique `(organization_id, service_id, form_key)`; Stage 1 one Transcript form.

### 5.4 `form_versions`

Columns: immutable-version tenant columns; `form_definition_id uuid`; `version_number integer`; `status version_status`; `schema_signature text`; `created_by_membership_id uuid`; `published_at`, `retired_at timestamptz NULL`.

Constraints: unique definition/version; signature matches compiled registry at publish; immutable after publish.

### 5.5 `form_fields`

Columns: immutable child tenant columns; `form_version_id uuid`; `field_key text`; `field_type field_type`; `position integer`; `label text`; `help_text text NULL`; `is_required boolean`; `validation_key text`; `options jsonb NULL`.

Constraints: unique `(organization_id, form_version_id, field_key)` and position; strict key/type/position/validation registry; options array only for approved `SELECT`; parent-published immutability trigger.

### 5.6 `requirement_sets`

Columns: tenant identity columns; `service_id uuid`; `requirement_set_key text`; `created_at`.

Constraints: unique `(organization_id, service_id, requirement_set_key)`.

### 5.7 `requirement_versions`

Columns: immutable-version tenant columns; `requirement_set_id uuid`; `version_number integer`; `status version_status`; `created_by_membership_id uuid`; `published_at`, `retired_at timestamptz NULL`.

Constraints: unique definition/version; immutable after publish.

### 5.8 `document_requirements`

Columns: immutable child tenant columns; `requirement_version_id uuid`; `requirement_key text`; `position integer`; `label text`; `help_text text NULL`; `is_required boolean`; `condition_key text`; `allowed_media_types text[]`; `max_bytes bigint`.

Constraints: unique requirement key/position within version; condition key from compiled registry; positive max bytes; parent-published immutability.

### 5.9 `workflow_definitions`

Columns: tenant identity columns; `service_id uuid`; `workflow_key text`; `created_at`.

Constraints: unique `(organization_id, service_id, workflow_key)`.

### 5.10 `workflow_versions`

Columns: immutable-version tenant columns; `workflow_definition_id uuid`; `version_number integer`; `status version_status`; `workflow_signature text`; `created_by_membership_id uuid`; `published_at`, `retired_at timestamptz NULL`.

Constraints: unique definition/version; signature matches fixed eight-step registry; immutable after publish.

### 5.11 `workflow_steps`

Columns: immutable child tenant columns; `workflow_version_id uuid`; `step_key workflow_step_key`; `position integer`; `department_key department_key NULL`; `title text`; `processing_target_minutes integer NULL`; `is_conditional boolean`.

Constraints: unique key/position in version; exact ordered Stage 1 signature; parent-published immutability.

### 5.12 `service_publications`

Columns: immutable tenant columns; `service_id uuid`; `publication_number integer`; `service_version_id uuid`; `form_version_id uuid`; `requirement_version_id uuid`; `workflow_version_id uuid`; `published_by_membership_id uuid`; `published_at timestamptz`; `retired_at timestamptz NULL`.

Constraints: unique service/publication number; all versions same organization/service bundle and `PUBLISHED`; `services.current_publication_id` points here atomically.

## 6. Request-processing tables

### 6.1 `requests`

| Column | Type | Null | Meaning/rules |
|---|---|---:|---|
| shared mutable tenant columns | shared | no | request aggregate |
| `applicant_profile_id` | `uuid` | no | tenant-safe owner |
| `service_id`, `service_version_id` | `uuid` | no | exact service pin |
| `form_version_id`, `requirement_version_id`, `workflow_version_id` | `uuid` | no | exact version pins |
| `reference` | `text` | yes | null in draft; assigned once on submission |
| `status` | `request_status` | no | default `DRAFT` |
| `coordinating_department_id` | `uuid` | no | Student Records |
| `current_owner_department_id` | `uuid` | no | remains Student Records in Stage 1 |
| `applicant_name_search` | `text` | no | normalized permitted queue/search value |
| `student_number_search` | `text` | no | normalized permitted queue/search value |
| `delivery_method` | `delivery_method` | yes | required by submission |
| `manual_payment_reference` | `text` | yes | protected; required by published flags |
| `request_started_at` | `timestamptz` | no | draft creation fact |
| `submitted_at`, `first_action_at`, `review_started_at` | `timestamptz` | yes | reporting facts |
| `pending_approval_at`, `decision_at`, `outcome_ready_at` | `timestamptz` | yes | reporting facts |
| `completed_at`, `cancelled_at`, `expired_at` | `timestamptz` | yes | lifecycle facts |
| `completion_count`, `reopened_count`, `correction_count`, `handoff_count` | `integer` | no | default 0; transactional counters |

Constraints/indexes: unique `(organization_id, reference)` when non-null; pins bundle-compatible; non-negative counters; queue indexes described in `DATABASE.md`.

### 6.2 `request_draft_answers`

Columns: shared mutable tenant columns; `request_id uuid`; `answers jsonb`; `last_saved_by_user_id uuid`; `last_saved_at timestamptz`.

Constraints: one row per request; request must be editable `DRAFT` or correction-authorized through application; JSON object and known keys validated; applicant-only RLS.

### 6.3 `duplicate_request_overrides`

Columns: immutable tenant columns; `applicant_profile_id uuid`; `service_id uuid`; `candidate_request_id uuid NULL`; `new_request_id uuid`; `granted_by_membership_id uuid`; `reason text`; `granted_at timestamptz`; `correlation_id uuid`.

Constraints: exact permission enforced in application; reason nonblank; admin RLS projection excludes request content.

### 6.4 `request_response_snapshots`

Columns: immutable tenant columns; `request_id uuid`; `sequence integer`; `kind snapshot_kind`; `form_version_id uuid`; `answers jsonb`; `declaration_accepted boolean`; `declaration_text_version text`; `submitted_by_user_id uuid`; `submitted_at timestamptz`; `previous_snapshot_id uuid NULL`.

Constraints: unique request/sequence; answers object uses pinned known keys; declaration true; append-only.

### 6.5 `request_status_history`

Columns: immutable tenant columns; `request_id uuid`; `from_status request_status NULL`; `to_status request_status`; `reason_code text NULL`; `actor_kind actor_kind`; `actor_user_id uuid NULL`; `actor_membership_id uuid NULL`; `occurred_at timestamptz`; `correlation_id uuid`.

Constraints: append-only; actor shape check; indexed request/time.

### 6.6 `workflow_instances`

Columns: shared mutable tenant columns; `request_id uuid`; `workflow_version_id uuid`; `current_step_key workflow_step_key`; `started_at timestamptz`; `completed_at timestamptz NULL`; `is_active boolean`.

Constraints: one active instance per request; pinned workflow match.

### 6.7 `work_items`

Columns: shared mutable tenant columns; `request_id uuid`; `workflow_instance_id uuid`; `workflow_step_key workflow_step_key`; `owning_department_id uuid`; `assigned_membership_id uuid NULL`; `status work_item_status`; `priority smallint`; `title text`; `description text NULL`; `ready_at`, `started_at`, `due_at`, `completed_at`, `returned_at`, `cancelled_at timestamptz NULL`; `completion_code text NULL`.

Constraints: priority bounded compiled scale; assignee active/in department; due ≥ ready; tenant-safe FKs; partial queue indexes.

### 6.8 `work_item_assignments`

Columns: immutable tenant columns; `work_item_id uuid`; `from_membership_id uuid NULL`; `to_membership_id uuid`; `assigned_by_membership_id uuid`; `reason text`; `assigned_at timestamptz`; `ended_at timestamptz NULL`; `correlation_id uuid`.

Constraints: append-only assignment history; exactly one current assignment per work item through partial unique `ended_at IS NULL`; denormalized work-item assignee updated in same transaction.

### 6.9 `corrections`

Columns: shared tenant columns frozen after resolution; `request_id uuid`; `sequence integer`; `requested_by_membership_id uuid`; `reason text`; `applicant_instructions text`; `requested_at timestamptz`; `action_due_at timestamptz NULL`; `resubmitted_at timestamptz NULL`; `resolved_at timestamptz NULL`; `resubmission_snapshot_id uuid NULL`; `status text` constrained to `OPEN`, `RESUBMITTED`, `RESOLVED`, `EXPIRED`, `CANCELLED`.

Constraints: unique request/sequence; one open correction per request; reason/instructions nonblank.

### 6.10 `correction_fields`

Columns: immutable tenant columns; `correction_id uuid`; `field_key text`; `created_at`.

Constraints: unique correction/field; field exists in pinned form registry.

### 6.11 `correction_documents`

Columns: immutable tenant columns; `correction_id uuid`; `document_id uuid`; `requirement_key text`; `created_at`.

Constraints: unique correction/document; request/tenant match.

### 6.12 `request_decisions`

Columns: immutable tenant columns; `request_id uuid`; `sequence integer`; `status decision_status`; `decided_by_membership_id uuid`; `internal_reason text NULL`; `applicant_reason_or_instruction text NULL`; `decided_at timestamptz`; `workflow_version_id uuid`; `correlation_id uuid`.

Constraints: unique request/sequence; actor is active Registrar-profile Supervisor with exact grant at command time; reason requirements by status; append-only.

### 6.13 `request_reopenings`

Columns: immutable tenant columns; `request_id uuid`; `sequence integer`; `from_status request_status`; `reopened_by_membership_id uuid`; `reason text`; `reopened_at timestamptz`; `reactivated_work_item_id uuid`; `correlation_id uuid`.

Constraints: from status `REJECTED` or `COMPLETED`; unique request/sequence; append-only.

### 6.14 `request_completions`

Columns: immutable tenant columns; `request_id uuid`; `sequence integer`; `method completion_method`; `completed_at timestamptz`; `completed_by_user_id uuid NULL`; `completed_by_membership_id uuid NULL`; `outcome_id uuid`; `correlation_id uuid`.

Constraints: unique request/sequence; actor shape/method prerequisites; each completion moves current request from `OUTCOME_READY` only; history survives reopen.

## 7. Finance handoff tables

### 7.1 `handoffs`

Columns: shared mutable tenant columns; `request_id uuid`; `sequence integer`; `originating_department_id uuid`; `receiving_department_id uuid`; `created_by_membership_id uuid`; `assigned_membership_id uuid NULL`; `requested_action text`; `reason text`; `expected_result_schema text`; `due_at timestamptz`; `priority smallint`; `applicant_visibility_key text`; `status handoff_status`; `sent_at`, `accepted_at`, `completed_at`, `declined_at`, `returned_at`, `cancelled_at timestamptz NULL`.

Constraints: unique request/sequence; fixed Student Records → Finance departments; exact schema key; active-status indexes. Acceptance/completion durations are calculated from immutable timestamps, not stored counters.

### 7.2 `handoff_documents`

Columns: immutable tenant columns; `handoff_id uuid`; `document_id uuid`; `document_version_id uuid`; `attached_by_membership_id uuid`; `created_at`.

Constraints: unique handoff/document version; all belong to same request/organization; explicit Finance projection source.

### 7.3 `handoff_status_history`

Columns: immutable tenant columns; `handoff_id uuid`; `from_status handoff_status NULL`; `to_status handoff_status`; `reason text NULL`; `actor_membership_id uuid NULL`; `occurred_at timestamptz`; `correlation_id uuid`.

Constraints: append-only; indexed handoff/time.

### 7.4 `finance_results`

Columns: immutable tenant columns; `handoff_id uuid`; `attempt_sequence integer`; `code finance_result_code`; `explanatory_note text`; `verification_at timestamptz`; `officer_membership_id uuid`; `reference text NULL`; `created_at`; `correlation_id uuid`.

Constraints: unique handoff/attempt; nonblank note; Finance membership; append-only. Current valid clearance derives from latest resolved applicable result/handoff, not an overwritten column.

## 8. Document and outcome tables

### 8.1 `documents`

Columns: shared mutable tenant columns; `request_id uuid`; `kind document_kind`; `requirement_version_id uuid NULL`; `requirement_key text NULL`; `status document_status`; `current_version_id uuid NULL`; `uploaded_by_user_id uuid NULL`; `uploaded_by_membership_id uuid NULL`; `created_at`, `updated_at`, `record_version`.

Constraints: actor shape; applicant evidence requires pinned requirement; issued outcome association handled through `issued_outcomes`; request/tenant indexes.

### 8.2 `document_versions`

Columns: immutable tenant columns; `document_id uuid`; `sequence integer`; `previous_version_id uuid NULL`; `bucket_name text`; `object_key text`; `original_filename text`; `media_type text`; `byte_size bigint`; `checksum_algorithm text NULL`; `checksum_digest text NULL`; `uploaded_by_user_id uuid NULL`; `uploaded_by_membership_id uuid NULL`; `uploaded_at timestamptz`; `finalized_at timestamptz`; `metadata jsonb` limited to safe non-critical properties.

Constraints: unique document/sequence and bucket/key; positive bytes; approved private bucket; opaque key prefix tenant/request match; actor shape.

### 8.3 `document_status_history`

Columns: immutable tenant columns; `document_id uuid`; `document_version_id uuid NULL`; `from_status document_status NULL`; `to_status document_status`; `reason text NULL`; `actor_user_id uuid NULL`; `actor_membership_id uuid NULL`; `occurred_at timestamptz`; `correlation_id uuid`.

Constraints: append-only; request/tenant match.

### 8.4 `document_reviews`

Columns: immutable tenant columns; `document_id uuid`; `document_version_id uuid`; `decision document_review_decision`; `reviewed_by_membership_id uuid`; `applicant_visible_reason text NULL`; `internal_note text NULL`; `reviewed_at timestamptz`; `correlation_id uuid`.

Constraints: reason required for rejection; exact review permission; append-only.

### 8.5 `issued_outcomes`

Columns: shared mutable tenant columns; `request_id uuid`; `sequence integer`; `status outcome_status`; `outcome_reference text`; `current_document_id uuid NULL`; `current_document_version_id uuid NULL`; `issued_by_membership_id uuid NULL`; `issued_at timestamptz NULL`; `failed_at timestamptz NULL`; `revoked_at timestamptz NULL`; `failure_summary text NULL`.

Constraints: unique request/sequence and organization/outcome reference; current file belongs to request/organization; only `ISSUED` not revoked downloadable.

### 8.6 `outcome_generation_attempts`

Columns: immutable except operational status tenant columns; `outcome_id uuid`; `attempt_sequence integer`; `status attempt_status`; `idempotency_key text`; `started_at timestamptz NULL`; `finished_at timestamptz NULL`; `error_code text NULL`; `safe_error_summary text NULL`; `document_version_id uuid NULL`; `created_at`.

Constraints: unique outcome/sequence and idempotency key; success requires document version; failure history retained.

### 8.7 `outcome_download_tokens`

Columns: mutable security tenant columns; `outcome_id uuid`; `applicant_profile_id uuid`; `token_hash bytea`; `purpose text`; `expires_at timestamptz`; `revoked_at timestamptz NULL`; `first_used_at timestamptz NULL`; `download_id uuid NULL`; `created_at`; `record_version`.

Constraints: unique token hash; purpose fixed `OUTCOME_DOWNLOAD`; expiry after creation; no raw bearer token stored; RLS denies direct client reads.

### 8.8 `outcome_downloads`

Columns: immutable tenant columns; `outcome_id uuid`; `document_version_id uuid`; `token_id uuid`; `applicant_profile_id uuid`; `downloaded_at timestamptz`; `completion_id uuid NULL`; `correlation_id uuid`; `response_etag text NULL`.

Constraints: unique token ID; exact issued/non-revoked file; one token retry does not duplicate event; completion link only when request transitioned from `OUTCOME_READY`.

### 8.9 `physical_collections`

Columns: immutable tenant columns; `request_id uuid`; `outcome_id uuid`; `completion_id uuid`; `recorded_by_membership_id uuid`; `collector_name text`; `collector_identifier_or_relationship text`; `collected_at timestamptz`; `outcome_reference text`; `note text NULL`; `correlation_id uuid`.

Constraints: unique completion; Student Records permission/scope; required evidence nonblank.

### 8.10 `manual_closures`

Columns: immutable tenant columns; `request_id uuid`; `outcome_id uuid`; `completion_id uuid`; `closed_by_membership_id uuid`; `reason_code text`; `explanatory_note text`; `evidence_reference text`; `closed_at timestamptz`; `correlation_id uuid`.

Constraints: unique completion; Supervisor + exact permission; required evidence fields nonblank.

### 8.11 `outcome_revocations`

Columns: immutable tenant columns; `outcome_id uuid`; `revoked_by_membership_id uuid`; `reason text`; `revoked_at timestamptz`; `correlation_id uuid`.

Constraints: one active revocation per outcome; exact permission; append-only; does not delete completion/download history.

## 9. Communication and evidence tables

### 9.1 `applicant_messages`

Columns: immutable tenant columns; `request_id uuid`; `author_kind message_author_kind`; `author_user_id uuid`; `author_membership_id uuid NULL`; `body text`; `sent_at timestamptz`; `reply_to_message_id uuid NULL`; `correlation_id uuid`.

Constraints: actor shape and request access; body nonblank; no internal note content; chronological index.

### 9.2 `internal_notes`

Columns: immutable tenant columns; `request_id uuid`; `department_id uuid`; `author_membership_id uuid`; `body text`; `visibility_key text`; `created_at`; `correlation_id uuid`.

Constraints: visibility key approved `DEPARTMENT`/`SUPERVISOR`; applicant RLS always denies; append-only correction via superseding note if later required.

### 9.3 `notifications`

Columns: mutable delivery tenant columns; `recipient_user_id uuid`; `request_id uuid NULL`; `template_key text`; `channel notification_channel`; `safe_payload jsonb`; `delivery_status notification_delivery_status`; `available_at timestamptz`; `sent_at`, `delivered_at`, `failed_at`, `read_at`, `cancelled_at timestamptz NULL`; `failure_code text NULL`; `action_path text NULL`; `idempotency_key text`; `created_at`, `updated_at`, `record_version`.

Constraints: unique `(organization_id, idempotency_key, channel)`; internal details prohibited by template/schema; action path same-origin approved route.

### 9.4 `audit_events`

Columns: immutable tenant columns; `event_type text`; `request_id uuid NULL`; `aggregate_type text`; `aggregate_id uuid`; `actor_kind actor_kind`; `actor_user_id uuid NULL`; `actor_membership_id uuid NULL`; `occurred_at timestamptz`; `correlation_id uuid`; `causation_id uuid NULL`; `safe_metadata jsonb`.

Constraints: append-only grants/trigger; actor shape; event type from approved registry; metadata excludes secrets/raw file tokens; indexes request/time, actor/time, event/time.

### 9.5 `outbox_events`

Columns: operational tenant columns; `event_type text`; `aggregate_type text`; `aggregate_id uuid`; `payload jsonb`; `status outbox_status`; `idempotency_key text`; `available_at timestamptz`; `attempt_count integer`; `locked_at timestamptz NULL`; `delivered_at timestamptz NULL`; `last_error_code text NULL`; `created_at`, `updated_at`, `record_version`.

Constraints: unique organization/idempotency key; attempt non-negative; immutable event identity/payload after insert; worker updates delivery fields only; partial pending index.

### 9.6 `sla_instances`

Columns: shared mutable tenant columns; `request_id uuid`; `work_item_id uuid NULL`; `handoff_id uuid NULL`; `workflow_step_key workflow_step_key`; `department_id uuid`; `started_at timestamptz`; `due_at timestamptz`; `completed_at timestamptz NULL`; `state sla_state`; `target_minutes integer`; `last_evaluated_at timestamptz`.

Constraints: exactly one work/handoff/request target shape; positive target; due ≥ start; unique active SLA per scoped target; SLA state does not change request status.

## 10. Foreign-key deletion behavior

| Relationship | Delete action |
|---|---|
| organization → tenant operational data | `RESTRICT` |
| auth user → profile/membership/applicant | `RESTRICT` or controlled deactivation; no cascading evidence loss |
| request → workflow/handoff/document/message/evidence | `RESTRICT` |
| version definition → published/request-pinned version | `RESTRICT` |
| document → versions/reviews/history | `RESTRICT` |
| outcome → attempts/downloads/completion/revocation | `RESTRICT` |
| optional current pointers | `SET NULL` only when history remains valid and command permits it |

Do not use `ON DELETE CASCADE` for immutable business/audit evidence. Environment-only demo reset may truncate in dependency order outside production.

## 11. Required database views/projections

Part 7 may implement these as RLS-safe SQL views or application queries:

- active public service catalogue/details;
- applicant request summary/timeline;
- Student Records and Finance queues;
- Registrar approval queue;
- Supervisor backlog/stage-duration aggregates;
- Organization Admin setup/aggregate metadata.

No view may use security-definer behavior that bypasses RLS unintentionally. Organization Admin projections contain no sensitive request rows.

## 12. Required database assertions

Migration/authorization tests must prove:

- every tenant table carries/enforces organization;
- cross-tenant composite FK insert fails;
- application roles cannot bypass RLS;
- absent actor context fails closed;
- applicant/staff/Finance/admin policies match exact scope;
- published configuration/evidence UPDATE/DELETE fails;
- invalid version bundle/request pins fail;
- duplicate submissions serialize correctly;
- impossible actor/method/completion relationships fail;
- audit success cannot survive a rolled-back business transaction;
- Storage object policies deny unrelated access.

## 13. Data classification

| Class | Examples | Handling |
|---|---|---|
| Public | organization name/branding, published service copy | public published projection only |
| Account | display name, user link, membership | authenticated, scoped |
| Sensitive applicant | identity/student number, answers, files, messages | applicant self or exact staff/handoff scope |
| Confidential operations | internal notes, Finance detail, assignment/decision context | permission/department scoped; never applicant/admin projection |
| Security secret | tokens, auth codes, signing secrets | never stored raw in app tables/logs; token hashes only |
| Immutable evidence | decisions, audit, histories, completion/reopen/revoke | append-only/restricted |

`SECURITY.md` finalizes encryption, logging and retention controls.

## 14. Explicit exclusions

No Stage 1 tables for:

- payments, M-PESA, refunds or reconciliation;
- custom roles/permissions;
- arbitrary form/workflow conditions, transitions, dependencies or scripts;
- transfer/consultation/escalation/cross-organization handoffs;
- public verification tokens/QR;
- malware scanning/quarantine/OCR/AI;
- marketplace, integrations, SSO/SCIM;
- custom reports/data warehouse;
- global search index.

## 15. Open questions

- `P6-OQ-DD-001` — Confirm exact text length checks and select options with `SEED-DATA.md` before migrations.
- `P6-OQ-DD-002` — Confirm the approved audit/notification payload schemas in Part 7 before creating their final JSON validation checks.
- `P6-OQ-DD-003` — Confirm SLA target values and whether `sla_instances` are created at work readiness or first start; the choice must preserve approved measurements.
- `P6-OQ-DD-004` — Confirm retention/anonymization behavior before adding any purge function or scheduled deletion.

## 16. Change rule

Every schema change updates this dictionary, Drizzle schema, SQL migration, RLS/grants, affected seed/test fixtures and traceability together. A column must not be added as a hidden substitute for an unapproved product concept.

## 17. Coding-agent instruction

Do not create tables from names alone. After approval, implement each table with its tenant-safe keys, indexes, immutability and RLS in the same migration series; validate the generated database against this dictionary.
