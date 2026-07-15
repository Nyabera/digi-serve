# FAIDIA Stage 0 — Replacement Instructions

Status: **ARCHIVED_MIGRATION_RECORD**  
Version: **1.4**  
Last updated: **2026-07-14**

## Purpose

This document records the migration from the earlier Stage 0 documentation set to the synchronized version 1.4 set.

It is a historical record and is not a controlling product specification.

## Canonical Source of Truth

The only canonical Source-of-Truth file is:

```text
docs/SOURCE-OF-TRUTH.md
```

The following files must not exist:

```text
SOURCE-OF-TRUTH.md
docs/00-stage-0/SOURCE-OF-TRUTH.md
docs/00-stage-0/SOURCE-OF-TRUTH-v0.2.md
```

## Registrar route correction

The approved route flow is:

```text
/supervisor/approvals
→ /officer/requests/[id]
→ embedded Registrar decision panel
```

The application must not implement:

```text
/officer/requests/[id]/approval
```

## Shared staff shell

Supervisors use the shared Officer processing shell with additional permission-controlled navigation and controls.

A duplicate Supervisor request-processing shell must not be created.