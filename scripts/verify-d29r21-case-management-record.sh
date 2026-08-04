#!/usr/bin/env bash
set -euo pipefail
COMPONENT="components/demo/officer/individual-case/officer-individual-case-shell.tsx"
STYLES="components/demo/officer/individual-case/officer-individual-case.module.css"
pass(){ printf 'PASS: %s\n' "$1"; }
fail(){ printf 'FAIL: %s\n' "$1" >&2; exit 1; }
for MARKER in "Applicant details" "Documents" "Payment / reference status" "Current step" "Assigned officer" "Comments" "Status history" "Final output" "Audit log"; do
  grep -Fq "$MARKER" "$COMPONENT" && pass "$MARKER" || fail "Missing $MARKER"
done
grep -Fq 'data-case-management-record' "$COMPONENT" && pass "Case record mounted" || fail "Case record missing"
grep -Fq 'D29R-21 case management record' "$STYLES" && pass "Case record CSS exists" || fail "Case record CSS missing"
PAGE_COUNT="$(find app/demo -type f -name page.tsx | wc -l | tr -d ' ')"
[[ "$PAGE_COUNT" -eq 14 ]] && pass "14 routes remain" || fail "Expected 14 routes, found $PAGE_COUNT"
printf '\nD29R-21 CASE MANAGEMENT RECORD VERIFICATION PASSED\n'
