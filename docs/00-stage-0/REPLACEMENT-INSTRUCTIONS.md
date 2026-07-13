# FAIDIA Stage 0 v1.3 — Replacement Instructions

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.3**  
Last updated: **2026-07-13**

## 1. Copy

Copy this pack's `docs/` folder into the FAIDIA repository root and replace matching files.

## 2. Delete competing or retired files

From the FAIDIA repository root:

```bash
rm -f SOURCE-OF-TRUTH.md
rm -f docs/00-stage-0/SOURCE-OF-TRUTH.md
rm -f docs/00-stage-0/SOURCE-OF-TRUTH-v0.2.md
rm -f docs/00-stage-0/UNRESOLVED-DECISIONS.md
```

Do not delete `docs/SOURCE-OF-TRUTH.md`.

## 3. Remove macOS metadata

```bash
find . -name '.DS_Store' -type f -delete
printf '\n.DS_Store\n' >> .gitignore
sort -u .gitignore -o .gitignore
```

## 4. Verify canonical structure

```bash
test -f docs/SOURCE-OF-TRUTH.md
test ! -f SOURCE-OF-TRUTH.md
test ! -f docs/00-stage-0/SOURCE-OF-TRUTH.md
test ! -f docs/00-stage-0/UNRESOLVED-DECISIONS.md
test -f docs/00-stage-0/DECISION-LOG.md
find . -name '.DS_Store' -print
```

The final command should print nothing.

## 5. Stage, review, commit, and push

```bash
git add -A
git status
git commit -m "Finalize Stage 0 v1.3 and lock Stage 1 scope"
git push origin main
git status
```

Expected final status:

```text
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

## 6. Final Codex audit prompt

```text
Read docs/SOURCE-OF-TRUTH.md and every Markdown file in docs/00-stage-0.

Verify:
- only one canonical Source of Truth exists;
- all controlling files are version 1.3, dated 2026-07-13, and APPROVED_FOR_STAGE_1;
- Stage 1 is the Transcript Request vertical slice, not complete V1;
- PAGE-INVENTORY uses STAGE_1_REQUIRED, LATER_V1, DEMO_ONLY, POSTPONED;
- permissions match the exact grant registry;
- ordinary Officers cannot approve/reject/reopen/manual-close;
- Organization Admin cannot read sensitive request content;
- Expired is applicant-visible;
- completion and reopening rules are exact;
- design paths exist;
- no blocking contradictions remain.

Do not edit files. Return PASS or FAIL with exact file/line evidence.
```
