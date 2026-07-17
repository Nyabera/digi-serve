# FAIDIA Feature Module Convention

Each major business capability belongs in its own feature module.

Example:

features/requests/
├── components/
├── permissions/
├── queries/
├── schemas/
├── services/
├── tests/
├── types/
├── events/
└── index.ts

## Rules

1. Feature-specific types stay inside the feature.
2. Feature-specific Zod schemas stay inside the feature.
3. Feature-specific queries stay inside the feature.
4. Feature-specific UI stays inside the feature.
5. Feature-specific permission definitions stay inside the feature.
6. A feature must not import private internals from another feature.
7. Cross-feature operations must use an exported public interface.
8. Shared UI primitives belong in components/.
9. Shared technical utilities belong in lib/.
10. Cross-feature workflow orchestration belongs in services/.

## Intended V1 modules

- auth
- organizations
- memberships
- permissions
- departments
- servignments
- handoffs
- documents
- notifications
- audit
- sla
- reporting

Do not create all implementation files before their build stages.
