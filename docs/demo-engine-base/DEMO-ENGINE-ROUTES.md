# FAIDIA Demo Engine Routes

## Document status

- Stage: D5
- Status: Active
- Repository: `/Users/blaq/Downloads/faidia`
- Branch: `feat/demo-engine-base`
- Route namespace: `/demo`

## 1. Purpose

D5 creates and verifies the complete Demo Engine route tree.

Every route remains beneath `/demo`.

D5 uses temporary placeholder interfaces only.

D5 does not implement final design, state, workflow logic, Supabase integration or production authentication.

## 2. Route inventory

| Journey stage | Route pattern | Verification URL |
|---|---|---|
| Route index and homepage | `/demo` | `/demo` |
| Service information | `/demo/services/[serviceSlug]` | `/demo/services/transcript-request` |
| Applicant sign-up | `/demo/sign-up` | `/demo/sign-up` |
| Application form | `/demo/apply/[serviceSlug]` | `/demo/apply/transcript-request` |
| Submission confirmation | `/demo/requests/[requestId]/confirmation` | `/demo/requests/REQ-DEMO-001/confirmation` |
| Applicant tracking | `/demo/track/[requestId]` | `/demo/track/REQ-DEMO-001` |
| Officer dashboard | `/demo/officer` | `/demo/officer` |
| Officer request review | `/demo/officer/requests/[requestId]` | `/demo/officer/requests/REQ-DEMO-001` |
| Receiving department | `/demo/department` | `/demo/department` |
| Department handoff | `/demo/department/handoffs/[handoffId]` | `/demo/department/handoffs/HND-DEMO-001` |
| Supervisor dashboard | `/demo/supervisor` | `/demo/supervisor` |
| Supervisor approval | `/demo/supervisor/approvals/[requestId]` | `/demo/supervisor/approvals/REQ-DEMO-001` |
| Controlled outcome | `/demo/outcomes/[requestId]` | `/demo/outcomes/REQ-DEMO-001` |
| Reports | `/demo/reports` | `/demo/reports` |

## 3. Route behaviour

The `/demo` route acts as a temporary route index.

Every route must:

- Render successfully.
- Remain beneath `/demo`.
- Link back to `/demo`.
- Link to the next demonstration stage.
- Avoid production database writes.
- Avoid production authentication.
- Avoid production Storage uploads.
- Avoid production route dependencies.

## 4. Shared placeholder

Temporary route pages use:

`components/demo/shared/demo-route-placeholder.tsx`

The placeholder provides:

- Route title.
- Route description.
- Route pattern.
- Route-index navigation.
- Next-stage navigation.

The placeholder is temporary and will be replaced progressively during later D-stages.

## 5. D5 restrictions

D5 must not implement:

- Client configuration.
- Demo Engine state.
- Homepage A, B or C.
- Production authentication.
- Supabase writes.
- Document uploads.
- Officer workflow actions.
- Departmental handoff actions.
- Supervisor approval logic.
- Recharts dashboards.
- Final visual design.

D5 must not modify:

- Production route groups.
- Stage 8 design-system files.
- `app/globals.css`.
- `app/layout.tsx`.
- `components/ui/**`.
- `app/design-lab/**`.
- `db/**`.
- `supabase/**`.
- `package.json`.
- `package-lock.json`.

## 6. D5 definition of done

D5 is complete when:

- All 14 planned routes exist.
- Every route remains beneath `/demo`.
- Every route renders a temporary placeholder.
- The route index links to all verification URLs.
- The placeholder journey is clickable from applicant entry to reports.
- Type checking passes.
- Linting passes.
- The application build passes.
- The D5 verification script passes.
- No protected production file was modified.
- D5 is committed separately.
