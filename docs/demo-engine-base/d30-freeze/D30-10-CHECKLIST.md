# D30-10 Completion Checklist

## Validator

- [x] Pack-neutral validation module exists
- [x] CLI validator exists
- [x] JSON output is supported
- [x] Validation returns a non-zero status on errors
- [x] Negative validator test exists

## Identity and branding

- [x] Pack identity is validated
- [x] Organization identity is validated
- [x] Default route and role are validated
- [x] Logo assets are validated
- [x] Branding colors are validated

## Cross-references

- [x] Duplicate IDs are rejected
- [x] User department references are validated
- [x] Service workflow references are validated
- [x] Workflow department references are validated
- [x] Workflow step transitions are validated
- [x] Request service and user references are validated
- [x] Request current-step references are validated
- [x] SLA service and department references are validated
- [x] Default request is validated

## Workflow validation

- [x] Empty workflows are rejected
- [x] Duplicate step IDs are rejected
- [x] Multiple Start nodes are rejected
- [x] Missing terminal steps are rejected
- [x] Synthetic Start and End conditions produce warnings
- [x] Unreachable steps produce warnings

## Reports and SLA

- [x] Report metrics are required
- [x] Report charts are required
- [x] Empty chart datasets are rejected
- [x] SLA targets are validated
- [x] Compliance values are validated

## Validation gate

- [x] TVET pack passes
- [x] Negative validator test passes
- [x] D30-10 verifier passes
- [x] TypeScript passes
- [x] lint passes
- [x] tests pass
- [x] production build passes
- [x] Git whitespace validation passes
- [ ] D30-10 is committed separately
