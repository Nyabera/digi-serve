# FAIDIA Demo Engine Boundaries

## Document status

- Stage: D3
- Status: Active source of truth
- Repository: `/Users/blaq/Downloads/faidia`
- Branch: `feat/demo-engine-base`
- Route namespace: `/demo`
- Production Supabase writes: Prohibited
- Production Supabase Storage uploads: Prohibited
- Production Supabase Auth users: Prohibited

## 1. Purpose

The FAIDIA Demo Engine is an internal mini-application inside the existing FAIDIA Next.js repository.

It demonstrates one complete service journey using synthetic information and local browser state.

The demonstration includes:

- Three switchable homepage designs.
- Service information.
- Simulated applicant sign-up.
- Application form completion.
- Simulated document selection.
- Request submission.
- Applicant progress tracking.
- Officer review.
- Departmental referral.
- Receiving-department processing.
- Supervisor approval.
- Controlled outcome issuance.
- Recharts reporting.
- Presentation controls and reset.

The Demo Engine is not a replacement for the production FAIDIA application.

## 2. Architectural position

The Demo Engine remains inside the existing FAIDIA repository.

It must not become:

- A separate Next.js project.
- A separate repository.
- A separate standalone application.
- A replacement for the production applicant portal.
- A replacement for the production officer workspace.
- A replacement for the production supervisor workspace.
- A replacement for production Supabase workflows.

The Demo Engine may reuse approved design tokens, shared components, and installed packages.

Its routes, data, state, workflow simulation, and presentation controls must remain isolated.

## 3. Route namespace

Every Demo Engine route must begin with `/demo`.

Planned routes include:

- `/demo`
- `/demo/services/[serviceSlug]`
- `/demo/sign-up`
- `/demo/apply/[serviceSlug]`
- `/demo/requests/[requestId]/confirmation`
- `/demo/track/[requestId]`
- `/demo/officer`
- `/demo/officer/requests/[requestId]`
- `/demo/department`
- `/demo/department/handoffs/[handoffId]`
- `/demo/supervisor`
- `/demo/supervisor/approvals/[requestId]`
- `/demo/outcomes/[requestId]`
- `/demo/reports`

The Demo Engine must not replace production URLs such as `/`, `/services`, `/login`, `/applicant`, `/officer`, `/admin`, or `/supervisor`.

## 4. Demo-owned paths

The Demo Engine may create and modify files inside:

- `app/demo/**`
- `components/demo/**`
- `features/demo/**`
- `config/demo/**`
- `types/demo/**`
- `tests/demo/**`
- `public/demo/**`
- `docs/demo-engine-base/**`

Demo pages should compose components and call typed state actions.

Substantial workflow logic must not be placed directly inside `page.tsx` files.

## 5. Protected production routes

The following production routes are protected:

- `app/(public)/**`
- `app/(applicant)/**`
- `app/(auth)/**`
- `app/(officer)/**`
- `app/(admin)/**`
- `app/(supervisor)/**`
- `app/api/**`

A later task must explicitly authorize any change to these areas.

## 6. Protected Stage 8 design files

The following Stage 8 and shared design areas are protected:

- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/page.module.css`
- `components/ui/**`
- `app/design-lab/**`
- `docs/01-stage-1/interface/**`

The Demo Engine must consume the existing design system rather than redefining it.

Demo-specific components should first be created inside `components/demo/**`.

Global typography, colours, spacing, and tokens must not be changed without explicit approval.

## 7. Design Lab boundary

The Design Lab at `app/design-lab/**` is reference-only.

The Demo Engine may inspect it and reproduce approved visual patterns.

The Demo Engine must not:

- Import `app/design-lab/page.tsx`.
- Import route pages from the Design Lab.
- Delete or restructure the Design Lab.
- Modify unrelated Design Lab experiments.
- Treat route files as reusable components.

Reusable components must live outside route pages.

## 8. Production service protection

The following production areas are protected:

- `db/**`
- `supabase/**`
- `services/**`
- `emails/**`
- `pdf/**`
- `app/api/**`

The following root files are protected by default:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `.env.local`
- `.env.example`
- `middleware.ts`

A task requiring one of these files must state why it is needed, what may change, what must remain unchanged, and how it will be tested.

## 9. Synthetic data boundary

Synthetic state is the source for the demo.

Initial data should be stored in typed configuration files such as:

- `config/demo/clients.ts`
- `config/demo/services.ts`
- `config/demo/forms.ts`
- `config/demo/workflows.ts`
- `config/demo/people.ts`
- `config/demo/requests.ts`
- `config/demo/reports.ts`

The Demo Engine must not:

- Write to production Supabase tables.
- Run production migrations.
- Modify Row Level Security policies.
- Create production Supabase Auth users.
- Upload files to production Supabase Storage.
- Use real applicant personal information.
- Use real institutional records.
- Require internet access for the main journey.

## 10. Simulated document upload

The Demo Engine may display a browser file selector.

The demonstration may store simulated metadata including:

- Filename.
- File type.
- File size.
- Document category.
- Simulated upload status.
- Simulated review status.

The selected file must not be uploaded to production Supabase Storage.

Resetting the demo must remove the simulated document state.

## 11. Demo state system

The first Demo Engine state system will use:

- React Context.
- `useReducer`.
- Typed state.
- Typed actions.
- Deterministic synthetic seed data.
- Optional `sessionStorage`.
- A complete reset action.

The state model must keep these records distinct:

- Client.
- Applicant.
- Service.
- Request.
- Form response.
- Document metadata.
- Work item.
- Departmental handoff.
- Approval.
- Outcome.
- Notification.
- Timeline event.
- Reporting event.

One applicant-facing request remains the parent record while internal work items and handoffs occur beneath it.

## 12. Shared demonstration journey

The Demo Engine demonstrates this journey:

- Applicant opens the institutional homepage.
- Applicant selects a service.
- Applicant reads the service information.
- Applicant completes simulated sign-up.
- Applicant completes the application form.
- Applicant selects required documents.
- Applicant submits the request.
- Applicant receives a request reference.
- Request enters the officer queue.
- Officer reviews the request.
- Officer creates a departmental referral.
- Receiving department accepts the referral.
- Receiving department completes its check.
- Result returns to the originating officer.
- Request enters supervisor approval.
- Supervisor approves the request.
- A controlled outcome is issued.
- Applicant sees the completed status and outcome.
- Reports reflect the workflow activity.

## 13. Homepage variants

Homepage variants share one journey.

The Demo Engine will include:

- `HomepageA`
- `HomepageB`
- `HomepageC`

All homepage variants must use the same:

- Client configuration.
- Services.
- Applicant state.
- Request state.
- Workflow state.
- Departments.
- Outcome.

Switching homepage variants must not reset the journey or create duplicate requests.

## 14. Client configuration boundary

Client-specific differences must be configuration-driven.

Configurable values may include:

- Institution name.
- Institution abbreviation.
- Logo.
- Branding.
- Homepage variant.
- Services.
- Service descriptions.
- Eligibility rules.
- Form sections.
- Form fields.
- Required documents.
- Departments.
- Staff names.
- Workflow labels.
- Applicant-visible statuses.
- Outcome wording.
- Report labels.
- Synthetic chart data.

Pages must not contain separate hard-coded applications for individual clients.

## 15. Internal and applicant-visible statuses

The Demo Engine must distinguish internal statuses from applicant-visible statuses.

Example internal status:

- `FINANCE_REFERRAL_PENDING_ACCEPTANCE`

Example applicant-visible status:

- `ADDITIONAL_CHECKS_IN_PROGRESS`

Applicants must not see confidential notes, internal assignments, or unnecessary departmental bureaucracy.

## 16. Reporting boundary

Recharts may use synthetic data in the Demo Engine base.

Reporting data must remain consistent with the seeded requests and workflow activity.

Reports may include:

- Requests submitted.
- Requests completed.
- Open requests.
- Overdue work.
- Requests by service.
- Requests by department.
- Pending handoffs.
- Completion rate.
- Average turnaround time.
- Officer workload.

Charts should be implemented as reusable Demo Engine components.

## 17. Explicit non-goals

The first Demo Engine base does not include:

- Production authentication.
- Production database writes.
- Production Storage uploads.
- Real applicant accounts.
- Real email delivery.
- SMS delivery.
- WhatsApp integration.
- M-PESA processing.
- Stripe processing.
- Production PDF generation.
- Production QR verification.
- Production audit logging.
- Production Row Level Security.
- A visual form builder.
- A visual workflow builder.
- A homepage block builder.
- Cross-organization handoffs.
- Automated workload balancing.
- AI routing.
- OCR.
- Electronic signatures.
- A custom report builder.
- A data warehouse.
- A native mobile application.

## 18. Dependency direction

The permitted dependency direction is:

- `app/demo` may depend on `features/demo`.
- `features/demo` may depend on `components/demo`.
- Demo components may depend on `config/demo` and `types/demo`.
- Demo code may depend on approved shared components and libraries.

Production code must never depend on Demo Engine code.

For example, `app/(officer)/**` must not import from `features/demo/**`.

Demo Engine code must remain removable without damaging the production application.

## 19. Cursor task boundary

Every Cursor implementation prompt must state:

- Objective.
- Allowed files.
- Protected files.
- Existing components to reuse.
- Required behaviour.
- Acceptance checks.

Cursor must not receive broad permission to rebuild the entire application.

Each Demo Engine stage must remain bounded.

## 20. Stage completion procedure

After every Demo Engine stage:

1. Review changed files.
2. Run relevant syntax and type checks.
3. Run linting when runtime code changes.
4. Run relevant tests.
5. Test the affected journey manually.
6. Commit only the files belonging to the stage.
7. Confirm the working tree is clean.
8. Begin the next stage only after the current stage passes.

## 21. D3 definition of done

D3 is complete when:

- The repository is `/Users/blaq/Downloads/faidia`.
- The branch is `feat/demo-engine-base`.
- The route namespace is `/demo`.
- Production routes are protected.
- Stage 8 design files are protected.
- Production Supabase writes are prohibited.
- Synthetic state is the source for the demo.
- The Design Lab is reference-only.
- Homepage variants share one journey.
- Client differences are configuration-driven.
- Production code cannot depend on Demo Engine code.
- No Demo Engine runtime folders or routes were created during D3.
- The D3 verification script passes.
- The two D3 files are committed separately.
