# FAIDIA Stage 1 — Technology Stack

**Status:** READY_FOR_PRODUCT_OWNER_REVIEW  
**Version:** 0.1  
**Last updated:** 2026-07-14  
**Product:** FAIDIA — Service Operations Platform  
**Authority:** `ARCHITECTURE.md`, approved Stage 0 design/stack decisions, and current official vendor documentation

## 1. Purpose

This document records the approved technology choices, what each tool is for, and what must not be added without a documented decision.

Choosing a tool does not mean every tool must be installed on day one. Install it when its first approved feature is built.

## 2. Version policy

Do not hard-code guessed package versions in planning documentation.

At project creation:

1. use the latest stable, mutually compatible releases supported by the chosen Next.js version;
2. use an active Node.js LTS release supported by Next.js and Vercel;
3. record the exact runtime in `.nvmrc` and `package.json` engines;
4. pin the pnpm version with the `packageManager` field;
5. commit `pnpm-lock.yaml`;
6. allow automated updates only through reviewed pull requests;
7. never use prerelease, beta, RC or canary packages without a recorded decision.

The lockfile, not this prose document, becomes the exact dependency-version record.

## 3. Core stack

| Area | Technology | FAIDIA responsibility |
|---|---|---|
| Runtime | Node.js active LTS supported by the selected Next.js release | Server execution and tooling |
| Package manager | pnpm | Reproducible dependency installation |
| Framework | Next.js App Router | Full-stack application, routes, layouts and server execution |
| UI runtime | React | Component rendering and interaction |
| Language | TypeScript with strict mode | Type-safe application contracts |
| Styling | Tailwind CSS | Utility styling and responsive layout |
| Component foundation | shadcn/ui | Owned, editable accessible component source |
| Icons | Lucide React | Consistent interface icons |
| Forms | React Hook Form | Interactive form state |
| Validation | Zod | Shared runtime input and environment validation |
| Tables | TanStack Table | Accessible operational table behavior |
| Charts | Recharts through shared chart components | Operational visualizations |
| Dates | date-fns | Date formatting and calculations |
| Database | Supabase PostgreSQL | System of record |
| ORM/query layer | Drizzle ORM | Typed schema and queries |
| Migrations | Drizzle Kit generating reviewed SQL in `supabase/migrations/` | Version-controlled schema/RLS changes |
| Authentication | Supabase Auth | Email/password identity and sessions |
| Storage | Supabase Storage private buckets | Applicant documents and outcomes |
| Database/storage policy | PostgreSQL/Supabase RLS | Defence-in-depth access control |
| Background work | Inngest | Durable scheduled/retryable jobs |
| Transactional email | Resend | External email delivery before pilot |
| Email templates | React Email | Version-controlled email markup |
| PDF/outcome rendering | `@react-pdf/renderer` where required | Controlled notice/demo PDF generation |
| Error monitoring | Sentry for Next.js | Error and trace diagnosis |
| Platform logs/deployment | Vercel | Hosting, previews and runtime logs |
| Unit/integration tests | Vitest | Domain, validation, API and integration tests |
| Component tests | React Testing Library | User-facing component behavior |
| Browser tests | Playwright | Full vertical-slice and authorization journeys |
| Lint/format | ESLint and Prettier | Static quality and consistent formatting |
| Source control | Git and GitHub | Version history and review workflow |

## 4. Next.js rules

- Use the App Router only; do not add a `pages/` application.
- Use Server Components by default.
- Add `"use client"` only at the smallest interactive boundary.
- Use Server Actions for first-party form/control mutations.
- Use Route Handlers for auth callback, Inngest, health and later approved webhooks/APIs.
- Use `proxy.ts` for the current Next.js request-boundary session refresh/gating integration; authorization still occurs inside server operations.
- Treat every Server Action and Route Handler as a public attack surface requiring input validation and authorization.
- Do not fetch the application’s own internal Route Handlers from Server Components when a direct server function call is sufficient.

## 5. TypeScript rules

- Enable `strict` mode.
- Do not use `any` to bypass unresolved domain modeling.
- Prefer inferred types from Zod and Drizzle where they represent the same contract.
- Keep branded identifiers or clear ID types where mixing IDs would be dangerous.
- Model command results as explicit success/failure unions rather than throwing untyped errors for expected business denials.
- Internal status values and permission keys come from shared domain modules, not repeated strings.

## 6. UI stack rules

### Tailwind and shadcn/ui

- Use CSS variables as design tokens.
- Keep generated shadcn/ui source inside the repository and adapt it to FAIDIA’s design system.
- Do not install a second general component library.
- Prefer accessible primitives and preserve keyboard/focus behavior when styling.

### Recharts

- Recharts is the only approved charting library.
- Use shared FAIDIA chart containers, tokens, tooltips, legends, empty states and accessible summaries.
- Feed charts server-generated aggregates, not unrestricted raw request data.
- Do not add Chart.js.

### Forms

- Zod is the authoritative runtime validation schema for action input.
- React Hook Form improves client interaction but never replaces server validation.
- Server responses use safe field/form errors without leaking internals.

## 7. Supabase responsibility split

| Supabase capability | Use | Do not use it for |
|---|---|---|
| PostgreSQL | durable business records, constraints, transactions and reporting | hidden schema changes made only in the dashboard |
| Auth | identity, registration, sign-in and session tokens | FAIDIA role/permission truth |
| Storage | private document/outcome objects | public Stage 1 document hosting |
| RLS | database and storage defence in depth | the sole authorization layer |
| Realtime | not required in Stage 1 | creating an unnecessary live-update dependency |

Use separate browser and server Supabase clients according to the current SSR guidance. Never expose a service-role key to the browser.

## 8. Drizzle and migration policy

- Define application database schema under `src/server/db/schema/`.
- Generate reviewable SQL migrations into `supabase/migrations/`.
- Include tables, constraints, indexes, functions/triggers where approved, RLS enablement and policies in version control.
- Apply migrations in order through the controlled environment workflow.
- Do not use schema push against shared staging or production environments.
- Do not edit an already-applied migration; create a new one.
- Use direct PostgreSQL transactions for critical commands.

The exact driver/pooling configuration is chosen during environment setup based on the current Supabase and Vercel guidance, then recorded in `ENVIRONMENTS.md`.

## 9. Inngest rules

Use Inngest when work requires scheduling, delay, durable retry, step isolation or execution visibility.

Do not use Inngest for:

- checking a permission;
- deciding a workflow transition;
- writing the only audit record;
- work that must be confirmed before the current user action succeeds.

Jobs consume persisted outbox/event data, use stable event schemas and idempotency keys, and remain safe to retry.

## 10. Email and notification policy

In-app notifications stored in PostgreSQL are required for the synthetic Stage 1 demo.

Resend and React Email are approved but may be installed/configured when external email delivery is implemented before the pilot. Email failure must not erase a valid workflow transition.

## 11. Testing stack rules

| Test type | Tool | Examples |
|---|---|---|
| Unit | Vitest | transitions, permission predicates, status mapping, metric calculations |
| Validation | Vitest + Zod | form/action/environment schemas |
| Database integration | Vitest + isolated test database | transactions, constraints, RLS and query scoping |
| Component | React Testing Library | forms, tables, dialogs, status and error states |
| Browser E2E | Playwright | applicant journey, Finance paths, Registrar decisions, denied access |

Do not replace integration tests with mocks for security boundaries or critical transactions.

## 12. Installation sequence

Install tools when needed in this order:

1. Next.js, React, TypeScript, pnpm and base linting.
2. Tailwind CSS, shadcn/ui and Lucide.
3. Zod, React Hook Form, TanStack Table, Recharts and date-fns.
4. Supabase client/SSR libraries, Drizzle ORM, selected PostgreSQL driver and Drizzle Kit.
5. Vitest, React Testing Library and Playwright.
6. Inngest when the first scheduled/retryable job is built.
7. PDF tooling when outcome generation is built.
8. Resend and React Email when email delivery is built.
9. Sentry when environment-aware monitoring is configured.

## 13. Explicit exclusions

Do not add without a new approved decision:

- Chart.js;
- Prisma;
- a second database;
- Firebase Auth or Clerk;
- a second storage provider;
- Redux as a default global state layer;
- GraphQL;
- tRPC merely for internal UI calls;
- Supabase Realtime as a Stage 1 dependency;
- Redis/Upstash as a required Stage 1 dependency;
- a separate Express/NestJS backend;
- a separate analytics vendor;
- a different queue/workflow platform;
- M-PESA packages;
- OCR or AI SDKs.

## 14. Official compatibility references

Consult current official documentation during setup:

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Supabase server-side Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Drizzle with Supabase](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)
- [Inngest execution model](https://www.inngest.com/docs/learn/how-functions-are-executed)
- [Resend with Next.js](https://resend.com/docs/send-with-nextjs)
- [Sentry for Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [shadcn/ui charts with Recharts](https://ui.shadcn.com/docs/components/chart)

## 15. Stack acceptance

- [x] The modular full-stack Next.js stack is approved.
- [x] pnpm and the stable-version/lockfile policy are approved.
- [x] Supabase PostgreSQL, Auth, private Storage and RLS are approved.
- [x] Drizzle plus version-controlled SQL migrations are approved.
- [x] Inngest’s limited job role is approved.
- [x] Recharts is confirmed and Chart.js remains excluded.
- [x] Resend/React Email remain approved for later email delivery.
- [x] Vitest, React Testing Library and Playwright are approved.
- [x] Vercel and Sentry are approved for deployment/observability.
- [x] No excluded dependency is required for the Stage 1 contract.

## 16. Change rule

Adding or replacing a core framework, database, ORM, auth system, storage system, job platform, chart library, test runner or hosting platform requires an approved Stage 1 decision and updates to architecture, project structure and affected contracts.

## 17. Coding-agent instruction

Do not install packages from this review version. After approval, use stable compatible releases, commit the lockfile, keep provider SDKs behind server/infrastructure modules, and do not introduce “helpful” alternative libraries without an approved decision.
