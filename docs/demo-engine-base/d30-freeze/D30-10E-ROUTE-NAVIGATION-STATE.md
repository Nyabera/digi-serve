# D30-10E Route, Navigation and Demo-State Integration

## Purpose

D30-10E connects the pages added during D30-10A through D30-10D to the
appropriate public, Applicant and Officer navigation surfaces.

It also centralizes Demo route ownership and role-switch destinations.

## Central registry

```text
features/demo-engine/navigation/demo-route-registry.ts
```

The registry owns:

- public verification route;
- Applicant home, profile and documents routes;
- Officer home, documents and SLA routes;
- Supervisor home and operational routes;
- Admin workflow routes;
- role-home destinations;
- route-to-role resolution.

## Demo navigation state

The role-navigation bridge records session-scoped presentation state:

```text
faidia-demo-role
faidia-demo-path
faidia-demo-last-route:<role>
```

This state supports the Demo role selector. It is not authentication,
authorization or production application state.

## Role-switch destinations

```text
Applicant  -> /demo/track
Officer    -> /demo/officer
Supervisor -> /demo/supervisor
Admin      -> /demo/admin
```

## Navigation ownership

Public homepage footer:

```text
/demo/verify-certificate
```

Applicant shell:

```text
/demo/track
/demo/applicant/documents
/demo/applicant/profile
```

Officer shell:

```text
/demo/officer/documents
```

## Boundary

The route registry and role bridge are reusable Demo mechanics. They must not
contain Savannah service records, applicant identities, department fixtures or
workflow content.
