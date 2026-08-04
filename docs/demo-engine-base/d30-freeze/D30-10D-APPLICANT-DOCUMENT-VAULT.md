# D30-10D Applicant Document Vault

## Purpose

D30-10D adds one Applicant-owned document workspace for uploads, generated
letters and certificates.

## Route

```text
/demo/applicant/documents
```

## Tabs

- My Uploads
- Generated Letters
- Certificates

## Main capabilities

- document search;
- metadata table;
- document-status badges;
- simulated upload;
- simulated preview and download;
- storage-usage metrics;
- verification-aware certificate records;
- responsive layouts.

## Pack ownership

Reusable UI lives under:

```text
features/demo-applicant-documents/
```

Savannah seeded records live under:

```text
demo-packs/tvet/applicant-document-vault.ts
```

## Security boundary

The Demo stores only non-sensitive seeded metadata.

Production should later use private Supabase Storage, permission-checked signed
URLs, file validation, download logging and retention controls. Permanent public
document URLs are outside D30-10D.
