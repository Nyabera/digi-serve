# D31-6R2 — Officer Shell-Safe Cutoff Correction

## Source replacement

- [x] corrected v2 component installed
- [x] corrected v2 stylesheet installed
- [x] component renders in embedded mode
- [x] original reference image retained in the downloadable bundle
- [x] cutoff diagnosis retained in the downloadable bundle

## Shell safety

- [x] all selectors scoped under `.d31-officer-reference`
- [x] no global `:root` selector remains
- [x] no global `html` or `body` selector remains
- [x] no unscoped generic `.card` selector remains
- [x] dashboard uses inline-size container queries
- [x] shell layout remains unchanged
- [x] topbar remains unchanged
- [x] sidebar remains unchanged

## Cutoff corrections

- [x] 900px desktop table minimum removed
- [x] plan tabs use the full safe width
- [x] Case Signals uses a minimum height
- [x] Case Signals footer remains in flow
- [x] Recent Handoffs uses a minimum height
- [x] lower cards use minimum heights
- [x] Action Required final row remains visible
- [x] embedded mode removes full-viewport assumptions
- [x] compact table overflow remains controlled

## Engineering gate

- [x] D31-2 shell verification passes
- [x] D31-3 token verification passes
- [x] D31-4 primitive verification passes
- [x] D31-5 data verification passes
- [x] D31-6R2 verification passes
- [x] Demo Pack validation passes
- [x] TypeScript passes
- [x] lint passes
- [x] tests pass
- [x] production build passes
- [x] Git whitespace validation passes
- [ ] implementation commit created
- [ ] checklist commit created
