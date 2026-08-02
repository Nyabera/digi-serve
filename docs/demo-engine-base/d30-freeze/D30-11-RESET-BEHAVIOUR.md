# D30-11 — Freeze Demo Reset Behaviour

D30-11 freezes the global `Reset demo` contract before complete route acceptance.

Reset must clear temporary Demo-only browser state and preserve the current
presentation route. When invoked from `/demo`, it remains on `/demo`; when invoked
from `/demo/officer`, it remains on `/demo/officer`. In both cases the Savannah
Technical College presentation stays usable, the Reset control remains available,
and no external mutating request or uncaught browser error may occur.

The existing implementation is not replaced. This stage inventories it, tests it
in Playwright, records only browser-storage keys literally referenced by the Reset
implementation. If the implementation owns no browser-storage keys, the stage
records an explicit `no-browser-storage-contract` mode instead of failing.
It then creates a SHA-256 freeze plus
`scripts/verify-d30-11-reset-behaviour.sh`.

No guessed or speculative role-route keys are added to the contract.
