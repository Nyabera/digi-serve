# FAIDIA Stage 1 — Project Structure

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `ARCHITECTURE.md`, `TECH-STACK.md`, `ROUTES.md`, and approved Stage 0 page/permission rules

## 1. Purpose

This document defines where code and configuration will live.

For a beginner: a consistent folder structure stops page files from becoming a mixture of database queries, permission checks, workflow decisions and UI code. Each folder below has one job.

## 2. Repository rule

Use one repository and one Next.js application. Do not create separate `frontend/` and `backend/` applications.

## 3. Proposed structure

```text
FAIDIA/
├── README.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── prettier.config.mjs
├── components.json
├── drizzle.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── .env.example
├── .nvmrc
│
├── docs/
│   ├── SOURCE-OF-TRUTH.md
│   ├── 00-stage-0/
│   ├── 01-stage-1/
│   └── assets/
│
├── public/
│   └── static public-safe assets only
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   └── seed.sql
│
├── emails/
│   ├── components/
│   └── templates/
│
├── scripts/
│   ├── seed.ts
│   ├── reset-demo.ts
│   └── verify-environment.ts
│
├── tests/
│   ├── integration/
│   ├── authorization/
│   ├── fixtures/
│   └── e2e/
│
└── src/
    ├── app/
    │   ├── (public)/
    │   ├── (auth)/
    │   ├── (applicant)/
    │   ├── (staff)/
    │   ├── (admin)/
    │   ├── api/
    │   ├── error.tsx
    │   ├── global-error.tsx
    │   ├── not-found.tsx
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── components/
    │   ├── ui/
    │   ├── shared/
    │   ├── shells/
    │   ├── forms/
    │   ├── tables/
    │   └── charts/
    │
    ├── features/
    │   ├── public-services/
    │   ├── authentication/
    │   ├── applicant-requests/
    │   ├── staff-queues/
    │   ├── request-processing/
    │   ├── corrections/
    │   ├── handoffs/
    │   ├── decisions/
    │   ├── outcomes/
    │   ├── notifications/
    │   ├── supervisor-reporting/
    │   └── organization-settings/
    │
    ├── domain/
    │   ├── statuses/
    │   ├── permissions/
    │   ├── events/
    │   ├── errors/
    │   └── value-objects/
    │
    ├── server/
    │   ├── application/
    │   │   ├── commands/
    │   │   └── queries/
    │   ├── auth/
    │   ├── authorization/
    │   ├── db/
    │   │   ├── schema/
    │   │   ├── queries/
    │   │   ├── repositories/
    │   │   ├── transaction.ts
    │   │   └── client.ts
    │   ├── storage/
    │   ├── audit/
    │   ├── outbox/
    │   ├── notifications/
    │   ├── reporting/
    │   ├── inngest/
    │   │   ├── client.ts
    │   │   └── functions/
    │   └── observability/
    │
    ├── lib/
    │   ├── env/
    │   ├── supabase/
    │   ├── logger/
    │   ├── dates/
    │   └── utils.ts
    │
    ├── instrumentation.ts
    └── proxy.ts
```

Only create folders when their first approved file is needed. The tree defines ownership; it is not a request to add empty folders.

## 4. Route-group structure

Route groups organize files without changing URLs.

```text
src/app/
├── (public)/
│   └── o/[organizationSlug]/...
├── (auth)/
│   ├── login/
│   ├── register/
│   └── auth/callback/
├── (applicant)/
│   └── applicant/...
├── (staff)/
│   ├── officer/...
│   └── supervisor/...
├── (admin)/
│   └── admin/...
└── api/
    ├── health/
    └── inngest/
```

Parentheses do not appear in the public URL. For example:

```text
src/app/(staff)/officer/requests/[id]/page.tsx
```

serves:

```text
/officer/requests/[id]
```

## 5. Layout ownership

| Layout | Responsibility |
|---|---|
| Root | HTML, global styles, metadata defaults and global providers |
| Public | Institution-facing header/footer and organization context |
| Auth | Simple registration/sign-in shell |
| Applicant | Applicant sidebar/mobile navigation and self-scope gate |
| Staff | Shared Officer/Supervisor processing shell and membership context |
| Admin | Organization configuration shell and metadata-only access gate |

Do not create a separate Supervisor processing layout that duplicates the Officer request workspace. Supervisor routes and navigation use the shared staff shell.

## 6. Page-file rule

A `page.tsx` file should be small. It may:

- read route/search parameters;
- call one or more authorized application queries;
- assemble feature components;
- choose safe not-found/denied behavior;
- define route metadata.

It must not:

- contain raw SQL;
- define workflow transitions;
- duplicate permission logic;
- initialize admin/service-role clients casually;
- send email directly;
- perform a multi-record mutation outside an application command.

## 7. Feature folders

A feature folder owns UI and presentation schemas that belong specifically to one product capability.

Suggested internal shape:

```text
src/features/handoffs/
├── components/
├── actions/
├── schemas/
├── presenters/
└── index.ts
```

Feature `actions/` files expose Server Action adapters. They call `src/server/application/commands/`; they do not implement handoff rules themselves.

Do not create one giant `services/`, `helpers/` or `types/` folder containing unrelated code.

## 8. Domain folders

`src/domain/` contains framework-independent vocabulary and rules shared across features and server code:

- approved status constants and transition types;
- permission keys and scope vocabulary;
- audit-event names;
- typed business errors;
- value objects such as request reference or version identifiers.

Domain modules must not import React, Next.js, Supabase, Drizzle, Inngest or Resend.

## 9. Server folders

### `server/application/commands`

One entry point per state-changing use case. Commands authorize, validate current state, open a transaction, apply domain rules, persist state/audit/outbox and return an explicit result.

### `server/application/queries`

Permission-scoped reads for pages, queues and reporting.

### `server/authorization`

Shared actor/context resolution and exact permission/scope checks. No page defines its own interpretation of a role.

### `server/db`

Drizzle schema, client, transaction wrapper, repositories and focused query modules. UI imports application queries/commands, not database modules.

### Provider folders

Storage, Inngest, notifications and observability integrations stay behind server interfaces. Provider-specific objects must not spread through UI/features.

## 10. Supabase helpers

`src/lib/supabase/` may contain the current official browser/server client factories needed for SSR sessions.

Rules:

- browser client exposes public configuration only;
- server client reads/writes auth cookies according to current official integration guidance;
- service-role access, if later required, is isolated server-only and narrowly named;
- session refresh in `proxy.ts` is not an authorization decision;
- no business query belongs in the client-factory files.

## 11. Database migrations and seeds

- `src/server/db/schema/` is the typed application schema source.
- `supabase/migrations/` contains ordered reviewed SQL generated/maintained through the migration workflow.
- `supabase/seed.sql` contains stable local Supabase seed entry behavior where appropriate.
- `scripts/seed.ts` creates/reset synthetic domain data using approved seed services.
- Test fixtures live under `tests/fixtures/`, not in production seed logic.

Never store production secrets, applicant documents or real pilot data in the repository.

## 12. Tests

Place tests according to the boundary they verify:

- colocated `*.test.ts` for small pure domain/utility tests;
- `tests/integration/` for database, storage and command boundaries;
- `tests/authorization/` for permit/deny matrices and isolation;
- `tests/e2e/` for Playwright journeys;
- `tests/fixtures/` for synthetic builders and known scenarios.

Every acceptance test name should include or map to an `AC-*` identifier.

## 13. Import boundaries

Allowed dependency direction:

```text
app/routes -> features/components -> server application -> domain
                                      -> infrastructure adapters
infrastructure adapters -> domain contracts
```

Forbidden examples:

- `domain` importing `server` or React;
- a Client Component importing `server/db`;
- `server/db` importing a page/component;
- Inngest functions importing UI actions;
- Organization Admin feature code bypassing application authorization.

Use the `@/` alias for `src/` imports. Avoid long relative traversal such as `../../../../`.

## 14. Naming rules

- Files and folders: lowercase kebab-case except framework-required names.
- React components and exported types: PascalCase.
- Functions and variables: camelCase.
- Database tables/columns: snake_case.
- Domain constants and audit/status values: approved uppercase values.
- Server Actions: verb-first names such as `submitRequestAction`.
- Commands: verb-first names such as `submitRequest`.
- Queries: `get`, `list` or `find` prefix.
- Do not name unrelated modules `common`, `misc`, `general` or `helpers`.

## 15. Environment and secret boundaries

- `.env.example` contains names and safe descriptions only.
- Server-only environment variables are parsed once in `src/lib/env/server.ts`.
- Browser-exposed variables are explicitly allow-listed in `src/lib/env/client.ts`.
- Secrets never enter `NEXT_PUBLIC_*` variables.
- Environment validation fails fast at startup/build where appropriate.

## 16. What must not exist in Stage 1

- a `pages/` router application;
- separate `frontend/` and `backend/` apps;
- `/officer/requests/[id]/approval` route folder;
- active folders/pages for postponed transfer or visual builders;
- direct database imports from Client Components;
- duplicate status/permission constants inside features;
- public storage for applicant/outcome documents;
- committed `.env` or real data;
- empty placeholder navigation pages for `LATER_V1`.

## 17. Structure acceptance

- [x] One-repository structure is approved.
- [x] Route groups are approved and do not alter public URLs.
- [x] Shared staff shell structure is approved.
- [x] Thin page and Server Action adapter rules are approved.
- [ ] Domain/application/infrastructure dependency direction is approved.
- [x] `supabase/migrations/` is approved as the migration directory.
- [x] Testing and fixture locations are approved.
- [x] `src/proxy.ts` and `src/instrumentation.ts` locations are approved.
- [x] Prohibited folders/routes are correct.

## 18. Change rule

Moving a responsibility across architecture layers, introducing a second application, or changing route-group/layout ownership requires this document and affected architecture/routes documents to be updated first.

## 19. Coding-agent instruction

Do not scaffold from this review version. After approval, create folders incrementally, keep pages thin, keep domain modules framework-independent, and do not use folder existence as permission to implement later scope.
