#!/usr/bin/env bash
set -euo pipefail
ROOT="${FAIDIA_ROOT:-/Users/blaq/Downloads/faidia}"
cd "$ROOT"
[[ "$(git branch --show-current)" == "feat/demo-engine-base" ]] || { echo "FAIL: Wrong branch"; exit 1; }
for file in \
  docs/demo-engine-base/d30-freeze/D30-11-RESET-IMPLEMENTATION-AUDIT.json \
  docs/demo-engine-base/d30-freeze/D30-11-RESET-RESULTS.json \
  docs/demo-engine-base/d30-freeze/reset-baseline/D30-11-RESET-FREEZE.json \
  docs/demo-engine-base/d30-freeze/D30-11-RESET-BEHAVIOUR.md \
  docs/demo-engine-base/d30-freeze/D30-11-CHECKLIST.md \
  playwright.d30-reset.config.ts \
  tests/acceptance/d30/demo-reset-behaviour.pw.ts; do
  [[ -s "$file" ]] || { echo "FAIL: Missing $file"; exit 1; }
done
python3 - <<'PY'
from pathlib import Path
import hashlib, json
audit=json.loads(Path("docs/demo-engine-base/d30-freeze/D30-11-RESET-IMPLEMENTATION-AUDIT.json").read_text())
results=json.loads(Path("docs/demo-engine-base/d30-freeze/D30-11-RESET-RESULTS.json").read_text())
freeze=json.loads(Path("docs/demo-engine-base/d30-freeze/reset-baseline/D30-11-RESET-FREEZE.json").read_text())
assert audit.get("resetControlLocated") is True
assert results.get("status") == "passed"
assert results.get("playwright", {}).get("failed", 0) == 0
assert results.get("routeBehaviour", {}).get("policy") == "preserve-current-route"
assert results.get("routeBehaviour", {}).get("officerResetResult") == "/demo/officer"
assert freeze.get("stage") == "D30-11"
assert freeze.get("roleRouteBehaviour") == "preserve-current-route"
for record in freeze["files"]:
    path=Path(record["path"])
    assert path.is_file(), f"Missing frozen file: {path}"
    assert hashlib.sha256(path.read_bytes()).hexdigest() == record["sha256"], f"Changed frozen file: {path}"
print("PASS: D30-11 reset audit, results and hashes are valid")
PY
grep -Fq externalMutations tests/acceptance/d30/demo-reset-behaviour.pw.ts
git diff --check
echo "PASS: D30-11 reset-behaviour verification passed"
