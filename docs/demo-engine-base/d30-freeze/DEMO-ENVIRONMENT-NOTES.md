# D30-6 Technical Environment Notes

## Purpose

D30-6 records the technical environment used to build and demonstrate the
FAIDIA Demo Engine.

The snapshot is stored at:

```text
docs/demo-engine-base/d30-freeze/DEMO-ENVIRONMENT.txt
```

## What is recorded

- local and UTC capture time;
- Git branch and commit;
- active Demo Pack;
- operating system and architecture;
- Node and npm versions;
- project package metadata;
- Next.js, React, TypeScript, Recharts and other key versions;
- lockfile names and checksums;
- recognized configuration files;
- npm scripts;
- top-level dependency tree;
- environment-related filenames;
- freeze rules.

## What is deliberately excluded

The snapshot does not record:

- environment-variable values;
- passwords;
- API keys;
- Supabase service-role keys;
- private keys;
- email credentials;
- SMS credentials;
- production customer data.

Only environment filenames are listed.

## Regeneration rule

The environment snapshot must be regenerated:

1. after an approved dependency change;
2. after a Node or npm version change;
3. before final Demo Engine tagging;
4. before final TVET Demo Pack tagging.

Run:

```bash
./scripts/capture-demo-environment.sh
```

## Lockfile rule

The frozen Demo uses npm and `package-lock.json`.

During the freeze:

- do not run `npm update`;
- do not replace the lockfile casually;
- review any dependency change separately;
- run the full engineering gate after a lockfile change.

## Snapshot timing

The D30-6 snapshot records the Git commit that existed immediately before the
environment documentation was committed.

The final freeze stage must regenerate the file so that it records the final
release candidate.
