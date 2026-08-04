# FAIDIA Demo Engine Service Information

## Document status

- Stage: D15
- Status: Active
- Route: `/demo/services/[serviceSlug]`
- Data source: D6 client configuration
- Production Supabase access: Prohibited

## 1. Purpose

D15 replaces the temporary public-route placeholder with a complete, configuration-driven service-information page.

The page must help an applicant understand the service before signing up or starting a request.

## 2. Required service information

Every active service page displays:

- service name;
- service category;
- full service description;
- short service summary;
- eligibility information;
- requirements;
- required and conditional documents;
- accepted file formats;
- maximum file size;
- document-replacement policy;
- expected processing time;
- fee or no-fee status;
- expected controlled outcome;
- workflow configuration version;
- a clear Start request action;
- a Track an existing request action.

## 3. Configuration rule

The page reads the selected service from the D6 client configuration.

The route must not contain transcript-only page logic.

Transcript Request, Student Clearance Request and Certificate Replacement Request use the same page component.

Unknown or inactive service slugs return the Next.js not-found response.

## 4. Start-request boundary

The Start request action links to:

`/demo/sign-up?service=[serviceSlug]`

D15 does not build simulated registration or the application form.

D16 builds applicant sign-up.

D17 builds the configurable application form.

## 5. Public-shell boundary

The service-information page continues using the D9 public-facing shell.

The D8 demonstration controls remain above the public shell through the shared `/demo` layout.

The page must remain responsive and keyboard accessible.

## 6. Homepage integration

D15 updates the D11 homepage service links so that they point to real configured service-information routes.

The homepage must not link to the non-existent bare route `/demo/services`.

## 7. Data and security restrictions

D15 uses static synthetic Demo Engine configuration only.

D15 must not:

- read production Supabase records;
- write production Supabase records;
- create authentication users;
- create draft requests;
- upload documents;
- process payments;
- record real applicant information.

## 8. D15 definition of done

D15 is complete when:

- the dynamic service-information route is implemented;
- all three active configured services render through one shared component;
- description, eligibility and requirements are visible;
- document requirements are visible;
- processing time is visible;
- fee or no-fee status is visible;
- the expected outcome is visible;
- Start request links to D16 sign-up with the selected service slug;
- Track an existing request links to the seeded tracking route;
- unknown service slugs return not found;
- homepage service links point to valid service routes;
- no production Supabase dependency is added;
- type checking passes;
- linting passes;
- the production build passes;
- D15 verification passes;
- D15 is committed separately.
