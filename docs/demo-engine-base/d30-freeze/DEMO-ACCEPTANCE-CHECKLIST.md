# Demo Acceptance Checklist

## Engineering

- [ ] TypeScript passes
- [ ] lint passes
- [ ] tests pass
- [ ] production build passes
- [ ] `git diff --check` passes
- [ ] working tree is clean

## Active pack

- [ ] TVET pack loads
- [ ] Savannah branding appears
- [ ] homepage uses Plus Jakarta Sans
- [ ] homepage `h2` spacing is `-0.025em`
- [ ] six core services appear
- [ ] seeded requests, reports and SLA data appear

## Role selector

- [ ] Applicant opens `/demo/track`
- [ ] Officer opens `/demo/officer`
- [ ] Supervisor opens `/demo/supervisor`
- [ ] Admin opens `/demo/admin`
- [ ] no role destination returns 404
- [ ] no stale or duplicated shell appears

## Applicant

- [ ] `/demo` loads
- [ ] service cards open
- [ ] forms validate
- [ ] request submission works
- [ ] tracking works
- [ ] reset restores the default request

## Officer

- [ ] one sidebar and one top bar
- [ ] task queue works
- [ ] cases open
- [ ] comments and history render
- [ ] internal referral works
- [ ] email sharing works in Demo mode
- [ ] phone sharing works in Demo mode
- [ ] personal SLA charts render

## Supervisor

- [ ] dashboard loads
- [ ] approval queue works
- [ ] audit trail works
- [ ] department SLA renders
- [ ] department reports render

## Admin

- [ ] `/demo/admin` resolves
- [ ] workflow overview loads
- [ ] templates open the builder
- [ ] drag and drop works
- [ ] node reordering works
- [ ] settings can be edited
- [ ] Demo save and publish actions respond
- [ ] no production workflow is altered

## Responsive

- [ ] 1440 × 900 inspected
- [ ] 1024 × 768 inspected
- [ ] 768 × 1024 inspected
- [ ] 390 × 844 inspected
- [ ] charts remain visible
- [ ] navigation is not clipped
- [ ] contrast remains legible

## Freeze evidence

- [ ] route inventory exists
- [ ] layout inventory exists
- [ ] role matrix exists
- [ ] data map exists
- [ ] reset behaviour is documented
- [ ] limitations are documented
- [ ] environment is recorded
- [ ] screenshots are captured


## Applicant profile

- [ ] `/demo/applicant/profile` loads
- [ ] `/demo/applicant` redirects to the profile
- [ ] applicant shell shows one sidebar and one top bar
- [ ] profile summary renders
- [ ] profile-completion indicator renders
- [ ] personal information renders
- [ ] contact information renders
- [ ] institution details render
- [ ] verification status renders
- [ ] membership information renders
- [ ] communication-preference controls respond
- [ ] security controls respond
- [ ] responsive layouts remain usable
- [ ] no duplicate shell appears


## Applicant document vault

- [ ] `/demo/applicant/documents` loads
- [ ] Applicant sidebar contains My Documents
- [ ] My Uploads tab works
- [ ] Generated Letters tab works
- [ ] Certificates tab works
- [ ] search filters the active tab
- [ ] metrics render
- [ ] storage usage renders
- [ ] upload action provides Demo feedback
- [ ] preview, download and more actions provide Demo feedback
- [ ] document statuses render
- [ ] responsive layouts remain usable
- [ ] exactly one Applicant shell appears


## D30-10E route and Demo-state integration

- [ ] homepage footer links to `/demo/verify-certificate`
- [ ] verification link does not appear in the homepage top navigation
- [ ] Applicant navigation links to requests, documents and profile
- [ ] Officer navigation links to the document hub
- [ ] Applicant role switch opens `/demo/track`
- [ ] Officer role switch opens `/demo/officer`
- [ ] Supervisor role switch opens `/demo/supervisor`
- [ ] Admin role switch opens `/demo/admin`
- [ ] role state updates when a workspace route changes
- [ ] public verification does not impersonate a staff role
- [ ] all D30-10A through D30-10D routes load
