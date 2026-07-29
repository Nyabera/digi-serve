# D30-10C Applicant Profile Page

## Purpose

D30-10C adds an authenticated Applicant profile workspace that presents
personal, contact, institutional, communication and security information.

## Routes

```text
/demo/applicant
/demo/applicant/profile
```

The Applicant index redirects to the profile page.

## Reusable shell

The Applicant shell provides:

- Applicant navigation;
- workspace search;
- notifications;
- current Applicant identity;
- Help and Exit Demo actions;
- responsive mobile navigation.

The shell is owned by:

```text
app/demo/applicant/layout.tsx
```

## Profile sections

- profile summary;
- completion indicator;
- personal information;
- contact information;
- institution details;
- communication preferences;
- verification status;
- membership;
- security.

## Pack ownership

Reusable UI and shell mechanics live under:

```text
features/demo-applicant/
```

Savannah Applicant content lives under:

```text
demo-packs/tvet/applicant-profile.ts
```

## Demo interactions

Edit, preference and security controls provide local Demo feedback.

They do not change production accounts or send data to an external service.

## Validation

D30-10C validates:

- required profile fields;
- email format;
- profile date values;
- completion range;
- active-session count;
- duplicate primary and alternate phone values.
