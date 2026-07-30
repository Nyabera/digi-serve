# D31 Dashboard Redesign Baseline

## Sequence

- D30 is paused after D30-10.
- D31 dashboard reconstruction runs before D30-11.
- D30-11 resumes only after D31 is completed, verified and merged back into `feat/demo-engine-base`.

## Protected baseline

- Source branch: `feat/demo-engine-base`
- Baseline commit: `f3378202027955e7e16fa868978694d634629dc3`
- Baseline commit date: `2026-07-29T14:05:39+03:00`
- Protected archive branch: `archive/demo-engine-d30-10-freeze`
- Annotated freeze tag: `demo-engine-d30-10-freeze`
- D31 working branch: `feat/demo-dashboard-redesign`

## D31 scope

D31 reconstructs the Officer, Supervisor and Admin dashboard bodies from the selected visual references.

D31 must preserve:

- current role routes;
- Demo role switching;
- Demo Pack configuration;
- existing request, approval, handoff and document routes;
- D30 freeze documentation;
- current Applicant, Officer, Supervisor and Admin workspace behaviour.

## Shell rule

Dashboard route components must not remount a sidebar or top bar.

Officer and Supervisor continue to inherit the operational shell.

Admin continues to inherit the organization-admin shell.

Any shell work must be isolated to the explicit D31 shell-contract stage and must not duplicate navigation.

## Reference sources

The selected source images are currently:

- `/mnt/data/officer-dashboard-redesign.png`
- `/mnt/data/supervisor-dashboard-design.png`
- `/mnt/data/admin-dashboard-design.png`

They will be copied into the repository during D31-1.

## Restore points

Return to the protected D30-10 baseline:

```bash
git switch feat/demo-engine-base
git reset --hard demo-engine-d30-10-freeze
```

Inspect the protected baseline without changing the current branch:

```bash
git show --stat demo-engine-d30-10-freeze
git log --oneline --decorate archive/demo-engine-d30-10-freeze -1
```

Do not run the hard reset unless intentionally restoring the branch.
