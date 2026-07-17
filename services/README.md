# FAIDIA Application Service Rules

Application pages are delivery-layer files.

Pages may:

- Read route parameters.
- Read search parameters.
- Request authenticated server data.
- Call an application service.
- Render components.
- Redirect after a service result.
- Handle page-level expected states.

Pages must not:

- Directly update several database tables.
- Implement workflow transitions.
- Implement handoff lifecycle rules.
- Calculate permissions from client input.
- Send transactional email directly.
- Generate institutional PDFs directly.
- Trust client-provided organization IDs.
- Scatter status strings throughout UI code.
- Perform provider-specific payment logic.
- create audit events separately from the action being audited.

Cross-table business operations belong in application services.

Expected flow:

Page or Server Action
→ Authentication
→ Organization context
→ Permission validation
→ Zod validation
→ Application service
→ Database traudit event
→ Domain event
→ Background processing
