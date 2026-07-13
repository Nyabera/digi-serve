# FAIDIA Source of Truth

**Status:** Draft for review  
**Version:** 0.2  
**Last updated:** 2026-07-13  
**Applies to:** FAIDIA V1  
**Primary use:** Product definition, prompt building, implementation control, and change tracking

---

## 1. Purpose of This File

This file is the master index for the FAIDIA V1 documentation system.

It tells developers, designers, AI coding agents, and product contributors:

- which documents control each part of the product;
- which files must be read before building a feature;
- how conflicts between prompts, mockups, and specifications should be resolved;
- where open questions should be recorded;
- how changes should be documented and committed.

This file does not replace the detailed specification files. It points to them and defines how they should be used.

---

## 2. Core Authority Rule

When there is a conflict between any of the following:

- a chat conversation;
- a coding prompt;
- a screenshot or mockup;
- an old prototype;
- an implementation decision;
- a source-of-truth Markdown file;

use this priority order:

1. Approved source-of-truth Markdown files
2. Latest approved product decision
3. Current implementation constraints
4. Design references
5. Chat history and exploratory ideas

If a conflict cannot be resolved safely, do not guess. Add the issue to:

```text
`docs/00-stage-0/UNRESOLVED-DECISIONS.md`
```

---

## 3. Mandatory Reading Before Any Build Task

Before implementing a feature, route, workflow, role, page, or database change, read:

```text
- docs/SOURCE-OF-TRUTH.md
- docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md
- docs/00-stage-0/V1-VERTICAL-SLICE.md
- docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md
- docs/00-stage-0/STATUS-MAPPINGS.md
- docs/00-stage-0/PAGE-INVENTORY.md
```

Also read the following when relevant:

```text
- docs/00-stage-0/CURRENT-PROCESS.md
- docs/00-stage-0/V1-NON-GOALS.md
- docs/00-stage-0/POST-V1-BACKLOG.md
- docs/00-stage-0/UNRESOLVED-DECISIONS.md
- docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md
```

---

## 4. Source-of-Truth Map

### 4.1 Product Scope and V1 Boundaries

**Primary file**

```text
`docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md`
```

**Controls**

- purpose of FAIDIA V1;
- target institution type;
- first fully functional service;
- demonstration services;
- pilot size and limits;
- problem statement;
- validation assumptions;
- success criteria;
- V1 service rules;
- departments involved;
- final issued outcome;
- intended shell structure;
- scope-freeze decisions.

**Implementation rule**

Do not add a major V1 capability unless it is already approved here or explicitly authorized by the product owner.

---

### 4.2 Current Manual Process

**Primary file**

```text
`docs/00-stage-0/CURRENT-PROCESS.md`
```

**Controls**

- how the institution currently processes the service;
- current actors and departments;
- current tools and communication channels;
- manual workarounds;
- current pain points;
- delays, duplication, and failure points;
- what FAIDIA is expected to reduce or replace.

**Implementation rule**

Do not invent a future workflow without checking what the current process actually does.

---

### 4.3 End-to-End V1 Vertical Slice

**Primary file**

```text
`docs/00-stage-0/V1-VERTICAL-SLICE.md`
```

**Controls**

- complete Transcript Request journey;
- applicant journey;
- originating officer journey;
- receiving officer journey;
- referral journey;
- transfer journey;
- correction and resubmission;
- approval;
- rejection;
- outcome delivery;
- supervisor journey;
- admin journey;
- final vertical-slice acceptance scenario.

**Implementation rule**

This file is the behavioral reference for the first complete working flow. The main V1 build should preserve this journey unless the file is updated first.

---

### 4.4 Roles and Permissions

**Primary file**

```text
`docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md`
```

**Controls**

- Applicant permissions;
- Officer permissions;
- Supervisor permissions;
- Organization Admin permissions;
- optional Platform Admin permissions;
- action visibility;
- workspace boundaries;
- role-based restrictions.

**Implementation rule**

Do not introduce new V1 roles, permissions, or action access rules directly in code without updating this file.

---

### 4.5 Status Models and Mappings

**Primary file**

```text
`docs/00-stage-0/STATUS-MAPPINGS.md`
```

**Controls**

- request statuses;
- work-item statuses;
- handoff statuses;
- document statuses;
- SLA statuses;
- applicant-visible statuses;
- internal-to-public status mappings;
- status transitions;
- status-related notifications;
- status-related audit events.

**Implementation rule**

Do not create new status strings inside individual pages, components, or actions. Status values should come from shared approved definitions.

---

### 4.6 Pages, Routes, Workspaces, and Navigation

**Primary file**

```text
`docs/00-stage-0/PAGE-INVENTORY.md`
```

**Controls**

- complete page inventory;
- public pages;
- applicant pages;
- officer pages;
- supervisor pages;
- admin pages;
- page ownership;
- route expectations;
- navigation groups and items;
- classification as:
  - `V1_REQUIRED`
  - `DEMO_ONLY`
  - `POSTPONED`

**Implementation rule**

A page should not be added to V1 only because it appears in an old mockup. It must exist in the approved page inventory or be explicitly authorized.

---

### 4.7 V1 Non-Goals

**Primary file**

```text
`docs/00-stage-0/V1-NON-GOALS.md`
```

**Controls**

- features explicitly excluded from V1;
- advanced capabilities that should not block launch;
- ideas that must not expand the first build;
- scope-protection rules.

**Implementation rule**

Before accepting a new feature into V1, check this file first.

---

### 4.8 Post-V1 Backlog

**Primary file**

```text
`docs/00-stage-0/POST-V1-BACKLOG.md`
```

**Controls**

- future features;
- postponed ideas;
- roadmap items;
- advanced integrations;
- later reporting capabilities;
- mobile, AI, automation, and enterprise features.

**Implementation rule**

When a good idea is not required for the approved vertical slice, move it here instead of expanding V1.

---

### 4.9 Unresolved Decisions

**Primary file**

```text
`docs/00-stage-0/UNRESOLVED-DECISIONS.md`
```

**Controls**

- open product questions;
- unclear workflow rules;
- unresolved payment decisions;
- incomplete permission decisions;
- design ambiguity that affects implementation;
- architecture blockers;
- questions that require product-owner approval.

**Implementation rule**

Do not hide uncertainty inside code or prompts. Record it here.

---

### 4.10 Design References

**Primary file**

```text
`docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md`
```

**Controls**

- approved visual direction;
- applicant-shell references;
- officer-shell references;
- admin-shell references;
- workflow illustration references;
- shell aesthetic;
- navigation styling cues;
- known missing designs;
- reference status such as draft, approved, or obsolete.

**Implementation rule**

Use this file for look and feel, but do not allow a visual reference to override approved product behavior.

---

## 5. Recommended Project Structure

```text
faidia/
├── app/
├── components/
├── lib/
├── public/
├── docs/
│   ├── SOURCE-OF-TRUTH.md
│   ├── 00-stage-0/
│   │   ├── STAGE-0-V1-SPECIFICATION.md
│   │   ├── CURRENT-PROCESS.md
│   │   ├── V1-VERTICAL-SLICE.md
│   │   ├── ROLE-PERMISSIONS-MATRIX.md
│   │   ├── STATUS-MAPPINGS.md
│   │   ├── PAGE-INVENTORY.md
│   │   ├── V1-NON-GOALS.md
│   │   ├── POST-V1-BACKLOG.md
│   │   ├── UNRESOLVED-DECISIONS.md
│   │   └── DESIGN-REFERENCE-REGISTER.md
│   └── assets/
│       ├── applicant-shell/
│       ├── officer-shell/
│       ├── admin-shell/
│       └── workflows/
└── README.md
```

---

## 6. Prompt-Building Template

Use this at the beginning of future implementation prompts:

```text
Before making changes, read and follow:

- docs/SOURCE-OF-TRUTH.md
- docs/00-stage-0/STAGE-0-V1-SPECIFICATION.md
- docs/00-stage-0/V1-VERTICAL-SLICE.md
- docs/00-stage-0/ROLE-PERMISSIONS-MATRIX.md
- docs/00-stage-0/STATUS-MAPPINGS.md
- docs/00-stage-0/PAGE-INVENTORY.md
- docs/00-stage-0/DESIGN-REFERENCE-REGISTER.md

Task:
[Describe the exact build task here.]

Rules:
- Do not contradict the source-of-truth files.
- Do not invent new roles, statuses, pages, or workflow steps.
- Do not add postponed features.
- Do not redesign unrelated shells or pages.
- Do not change database structure unless required by the approved workflow.
- Flag unresolved decisions instead of guessing.
- Preserve existing wiring unless the task explicitly requires a change.
```

---

## 7. Task-Specific Reading Guide

### Building an applicant page

Read:

```text
- STAGE-0-V1-SPECIFICATION.md
- V1-VERTICAL-SLICE.md
- ROLE-PERMISSIONS-MATRIX.md
- STATUS-MAPPINGS.md
- PAGE-INVENTORY.md
- DESIGN-REFERENCE-REGISTER.md
```

### Building an officer workflow

Read:

```text
- V1-VERTICAL-SLICE.md
- ROLE-PERMISSIONS-MATRIX.md
- STATUS-MAPPINGS.md
- PAGE-INVENTORY.md
- CURRENT-PROCESS.md
```

### Building admin configuration

Read:

```text
- STAGE-0-V1-SPECIFICATION.md
- ROLE-PERMISSIONS-MATRIX.md
- PAGE-INVENTORY.md
- V1-NON-GOALS.md
```

### Building workflow logic

Read:

```text
- V1-VERTICAL-SLICE.md
- STATUS-MAPPINGS.md
- ROLE-PERMISSIONS-MATRIX.md
- UNRESOLVED-DECISIONS.md
```

### Building dashboards or reports

Read:

```text
- STAGE-0-V1-SPECIFICATION.md
- STATUS-MAPPINGS.md
- PAGE-INVENTORY.md
- DESIGN-REFERENCE-REGISTER.md
```

---

## 8. Change-Control Process

When a decision changes:

1. Identify the authoritative source file.
2. Update that file first.
3. Update any dependent documents.
4. Change the version number where appropriate.
5. Add or close any unresolved decision.
6. Update implementation code.
7. Commit the documentation and code together where practical.
8. Use a clear Git commit message.

Example commit messages:

```text
Update transcript workflow correction rules
Add applicant navigation to page inventory
Revise V1 status mappings
Move WhatsApp integration to post-V1 backlog
Approve Stage 0 specification v1.0
```

---

## 9. Freeze Rules

### Frozen for V1

Once approved, the following should not change casually:

- target institution type;
- primary service;
- demonstration services;
- V1 scope;
- role model;
- permission model;
- workflow steps;
- status definitions;
- page inventory classifications;
- shell and navigation structure.

### Not yet frozen in Stage 0

The following may remain flexible until later implementation stages:

- exact font sizes;
- exact spacing tokens;
- exact sidebar width;
- exact icon sizes;
- final breakpoints;
- final shadow values;
- final card radii;
- final mobile layouts;
- final chart styling.

---

## 10. AI Coding Agent Guardrails

AI coding agents must not:

- invent new product behavior;
- create unapproved roles;
- create page-specific status values;
- expand V1 scope silently;
- rebuild unrelated areas;
- replace approved navigation with older mockup navigation;
- expose internal statuses directly to applicants;
- bypass role or tenant restrictions;
- treat demo-only pages as production-complete;
- implement postponed features unless explicitly instructed.

AI coding agents should:

- preserve existing structure where possible;
- make the smallest necessary change;
- report contradictions;
- reference the correct source file;
- update tests with implementation changes;
- keep documentation aligned with code.

---

## 11. Approval States

Use these document states consistently:

```text
DRAFT
UNDER_REVIEW
APPROVED_FOR_V1
FROZEN_FOR_IMPLEMENTATION
SUPERSEDED
POSTPONED
```

Recommended version progression:

```text
0.1 = initial draft
0.2 = improved working draft
0.3 = reviewed draft
0.9 = final review candidate
1.0 = approved V1 source of truth
```

---

## 12. Quick Reference Table

| Product area | Authoritative file |
|---|---|
| V1 scope | `STAGE-0-V1-SPECIFICATION.md` |
| Current process | `CURRENT-PROCESS.md` |
| End-to-end workflow | `V1-VERTICAL-SLICE.md` |
| Roles and permissions | `ROLE-PERMISSIONS-MATRIX.md` |
| Status model | `STATUS-MAPPINGS.md` |
| Pages and navigation | `PAGE-INVENTORY.md` |
| Excluded V1 features | `V1-NON-GOALS.md` |
| Future roadmap | `POST-V1-BACKLOG.md` |
| Open questions | `UNRESOLVED-DECISIONS.md` |
| Visual direction | `DESIGN-REFERENCE-REGISTER.md` |

---

## 13. Final Operating Rule

The repository documentation is the authority.

Use this sequence:

```text
Explore in conversation
→ make a decision
→ update the correct Markdown file
→ review the change
→ commit to Git
→ use the updated file in future prompts
```

Do not rely on chat history alone to define the product.

