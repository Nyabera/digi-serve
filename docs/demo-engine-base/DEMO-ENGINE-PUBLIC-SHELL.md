# FAIDIA Demo Engine Public Shell

## Document status

- Stage: D9
- Status: Active
- Route scope: Public and applicant-facing Demo Engine routes
- Production route changes: Prohibited
- Production Supabase access: Prohibited

## 1. Purpose

D9 creates the shared public-facing shell for the Demo Engine.

The shell provides a consistent institutional frame while client-specific page content remains configurable.

## 2. Shell components

The public shell contains:

- institutional logo and name;
- desktop public navigation;
- mobile public navigation;
- service links;
- request-tracking access;
- staff-workspace access;
- skip-to-content access;
- institutional footer;
- contact information;
- synthetic-environment notice.

## 3. Applied routes

The shell is applied to:

- `/demo`;
- `/demo/services/[serviceSlug]`;
- `/demo/sign-up`;
- `/demo/apply/[serviceSlug]`;
- `/demo/requests/[requestId]/confirmation`;
- `/demo/track/[requestId]`.

Internal officer, department, supervisor, outcome and reporting routes do not use the public shell during D9.

## 4. Configuration

The public shell reads:

- organization name;
- short organization name;
- organization description;
- logo mark;
- branding colours;
- contact details;
- location;
- primary service;
- service count;
- department count.

These values come from the D6 client configuration.

## 5. Interaction with D8

The D8 demonstration control bar remains above the public shell.

The public shell does not replace or duplicate the demonstration controls.

Homepage variant, role and request state continue to exist in the D7 provider.

## 6. Accessibility

The shell includes:

- semantic header, main and footer regions;
- labelled navigation;
- visible keyboard focus;
- skip-to-content access;
- minimum interactive-control heights;
- responsive desktop and mobile navigation;
- applicant-readable route descriptions.

## 7. Restrictions

D9 does not implement:

- Homepage A;
- Homepage B;
- Homepage C;
- final service-information content;
- final sign-up forms;
- final configurable application form;
- document selection;
- applicant timeline;
- officer shell;
- department shell;
- supervisor shell;
- workflow actions;
- Recharts dashboards;
- production authentication;
- production Supabase reads or writes.

## 8. D9 definition of done

D9 is complete when:

- the public shell exists;
- the institutional header exists;
- responsive public navigation exists;
- the institutional footer exists;
- public pages use the shared shell;
- public navigation remains beneath `/demo`;
- public navigation exposes service, application and tracking routes;
- staff workspace access points to `/demo/officer`;
- public content reads client configuration;
- D8 controls remain functional;
- internal operational routes remain unchanged;
- type checking passes;
- linting passes;
- the production build passes;
- D9 verification passes;
- D9 is committed separately.
