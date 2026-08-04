# D30-12 Route Acceptance Evidence

## Outcome

```text
Status: passed
Resolved routes: 43
Unresolved dynamic route files: 3
Playwright passed: 50
Playwright failed: 0
Route tests expected: 43
Route tests passed: 43
```

## Route matrix

| Route | Ownership | Resolution | Source |
|---|---|---|---|
| `/demo` | public | static | `app/demo/page.tsx` |
| `/demo/admin` | admin | static | `app/demo/admin/page.tsx` |
| `/demo/admin/workflows` | admin | static | `app/demo/admin/workflows/page.tsx` |
| `/demo/admin/workflows/builder` | admin | static | `app/demo/admin/workflows/builder/page.tsx` |
| `/demo/applicant` | applicant | static | `app/demo/applicant/page.tsx` |
| `/demo/applicant/documents` | applicant | static | `app/demo/applicant/documents/page.tsx` |
| `/demo/applicant/profile` | applicant | static | `app/demo/applicant/profile/page.tsx` |
| `/demo/apply/certificate-replacement` | public | static | `app/demo/apply/certificate-replacement/page.tsx` |
| `/demo/apply/class-registration` | public | static | `app/demo/apply/class-registration/page.tsx` |
| `/demo/apply/course-application` | public | static | `app/demo/apply/course-application/page.tsx` |
| `/demo/apply/industrial-attachment-letter` | public | static | `app/demo/apply/industrial-attachment-letter/page.tsx` |
| `/demo/apply/student-clearance` | public | static | `app/demo/apply/student-clearance/page.tsx` |
| `/demo/department` | public | static | `app/demo/department/page.tsx` |
| `/demo/officer` | officer | static | `app/demo/officer/page.tsx` |
| `/demo/officer/documents` | officer | static | `app/demo/officer/documents/page.tsx` |
| `/demo/officer/queue` | officer | static | `app/demo/officer/queue/page.tsx` |
| `/demo/officer/reports/sla` | officer | static | `app/demo/officer/reports/sla/page.tsx` |
| `/demo/officer/requests/STC-CL-2026-0027` | officer | seeded dynamic | `app/demo/officer/requests/[requestId]/page.tsx` |
| `/demo/officer/sla` | officer | static | `app/demo/officer/sla/page.tsx` |
| `/demo/officer/sla-monitor` | officer | static | `app/demo/officer/sla-monitor/page.tsx` |
| `/demo/officer/tasks` | officer | static | `app/demo/officer/tasks/page.tsx` |
| `/demo/outcomes/STC-CL-2026-0027` | public | seeded dynamic | `app/demo/outcomes/[requestId]/page.tsx` |
| `/demo/reports` | public | static | `app/demo/reports/page.tsx` |
| `/demo/requests/STC-CL-2026-0027/confirmation` | public | seeded dynamic | `app/demo/requests/[requestId]/confirmation/page.tsx` |
| `/demo/services/certificate-replacement` | public | static | `app/demo/services/certificate-replacement/page.tsx` |
| `/demo/services/class-registration` | public | static | `app/demo/services/class-registration/page.tsx` |
| `/demo/services/course-application` | public | static | `app/demo/services/course-application/page.tsx` |
| `/demo/services/industrial-attachment-letter` | public | static | `app/demo/services/industrial-attachment-letter/page.tsx` |
| `/demo/services/student-clearance` | public | static | `app/demo/services/student-clearance/page.tsx` |
| `/demo/sign-up` | public | static | `app/demo/sign-up/page.tsx` |
| `/demo/supervisor` | supervisor | static | `app/demo/supervisor/page.tsx` |
| `/demo/supervisor/approvals/STC-CL-2026-0027` | supervisor | seeded dynamic | `app/demo/supervisor/approvals/[requestId]/page.tsx` |
| `/demo/supervisor/audit` | supervisor | static | `app/demo/supervisor/audit/page.tsx` |
| `/demo/supervisor/audit-trail` | supervisor | static | `app/demo/supervisor/audit-trail/page.tsx` |
| `/demo/supervisor/sla` | supervisor | static | `app/demo/supervisor/sla/page.tsx` |
| `/demo/supervisor/sla-monitor` | supervisor | static | `app/demo/supervisor/sla-monitor/page.tsx` |
| `/demo/track/ATTACH-2026-0088` | public | static | `app/demo/track/ATTACH-2026-0088/page.tsx` |
| `/demo/track/CERT-2026-0061` | public | static | `app/demo/track/CERT-2026-0061/page.tsx` |
| `/demo/track/CLASS-2026-0109` | public | static | `app/demo/track/CLASS-2026-0109/page.tsx` |
| `/demo/track/CLEAR-2026-0042` | public | static | `app/demo/track/CLEAR-2026-0042/page.tsx` |
| `/demo/track/COURSE-2026-01482` | public | static | `app/demo/track/COURSE-2026-01482/page.tsx` |
| `/demo/track/STC-CL-2026-0027` | public | seeded dynamic | `app/demo/track/[requestId]/page.tsx` |
| `/demo/verify-certificate` | public | static | `app/demo/verify-certificate/page.tsx` |

## Unresolved dynamic routes

- `/demo/apply/[serviceSlug]` from `app/demo/apply/[serviceSlug]/page.tsx`; unresolved: [serviceSlug]
- `/demo/department/handoffs/[handoffId]` from `app/demo/department/handoffs/[handoffId]/page.tsx`; unresolved: [handoffId]
- `/demo/services/[serviceSlug]` from `app/demo/services/[serviceSlug]/page.tsx`; unresolved: [serviceSlug]

## Targeted journeys

```json
{
  "publicHome": true,
  "verification": true,
  "applicantTracking": true,
  "applicantProfile": true,
  "applicantDocuments": true,
  "officerHome": true,
  "officerDocuments": true,
  "officerSla": true,
  "supervisorHome": true,
  "adminHome": true,
  "adminWorkflows": true,
  "adminBuilder": true,
  "referral": true,
  "reports": true
}
```

## Evidence screenshots

Screenshots are stored under:

```text
docs/demo-engine-base/d30-freeze/screenshots/acceptance/
```
