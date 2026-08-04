# D30-10E Completion Checklist

## Route registry

- [x] central Demo route registry exists
- [x] public verification route is registered
- [x] Applicant profile route is registered
- [x] Applicant document route is registered
- [x] Officer document route is registered
- [x] Admin workflow routes are registered
- [x] role-home destinations are centralized
- [x] route-to-role resolution exists

## Navigation

- [x] homepage footer contains Verify Certificate
- [x] homepage top navigation does not contain Verify Certificate
- [x] Applicant My Requests link is correct
- [x] Applicant My Documents link is correct
- [x] Applicant My Profile link is correct
- [x] Officer Documents Hub link is correct

## Demo state

- [x] role bridge consumes the central registry
- [x] pathname updates session-scoped Demo state
- [x] Applicant routes resolve to Applicant
- [x] Officer routes resolve to Officer
- [x] Supervisor routes resolve to Supervisor
- [x] Admin routes resolve to Admin
- [x] public verification resolves to no staff role
- [x] native role selectors synchronize
- [x] custom role selectors navigate through Next.js

## Engineering gate

- [x] TVET pack validation passes
- [x] D30-10E verifier passes
- [x] TypeScript passes
- [x] lint passes
- [x] tests pass
- [x] production build passes
- [x] Git whitespace validation passes
- [x] D30-10E is committed separately
