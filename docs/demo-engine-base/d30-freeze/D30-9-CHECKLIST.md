# D30-9 Completion Checklist

## Universal model

- [x] Universal workflow-node type exists
- [x] Universal transition type exists
- [x] Entry step is represented
- [x] Terminal steps are represented
- [x] Synthetic Start support exists
- [x] Synthetic End support exists
- [x] Configured `nextStepIds` become transitions
- [x] Incoming transition lookup exists
- [x] Outgoing transition lookup exists
- [x] Transition-permission helper exists
- [x] Terminal-step helper exists

## Runtime instance

- [x] Universal workflow instance exists
- [x] Instance creation exists
- [x] Transition resolution exists
- [x] Instance advancement exists
- [x] Completion is detected generically

## Builder integration

- [x] Builder consumes universal workflow model
- [x] Builder no longer creates a second workflow model
- [x] Generic palette remains engine-owned
- [x] TVET content remains pack-owned

## Validation

- [ ] D30-9 verifier passes
- [ ] TypeScript passes
- [ ] lint passes
- [ ] tests pass
- [ ] production build passes
- [ ] Git whitespace validation passes
- [x] D30-9 is committed separately
