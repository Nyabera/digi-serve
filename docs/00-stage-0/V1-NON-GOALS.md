# FAIDIA Stage 0 — V1 Non-Goals

Status: **DRAFT — requires product-owner approval**  
Version: **0.1**  
Last updated: **2026-07-12**  
Product: **FAIDIA — Service Operations Platform**  

> This Stage 0 document is based on the uploaded FAIDIA product description, V1 structure, full development structure, recommended stack and strict build-order documents. Recommended defaults are filled in, while unresolved items are explicitly marked.


## 1. Purpose

This document prevents V1 from expanding into the complete future FAIDIA platform. A non-goal is not deleted forever. It is intentionally excluded because it is not required to validate the first end-to-end institutional workflow.

## 2. Scope principle

> Build narrow and end-to-end, not broad and shallow.

A feature is not part of V1 merely because:

- a mockup exists;
- a competitor has it;
- it sounds enterprise-ready;
- the architecture may support it later;
- it makes the demo look larger;
- an AI coding agent can generate a rough version quickly.

## 3. Workflow and routing non-goals

### Advanced visual workflow builder

Excluded:

- drag-and-drop canvas;
- arbitrary node creation;
- free-form branch design;
- visual condition editor.

V1 alternative:

- versioned workflow records;
- seed data;
- controlled configuration;
- sequential steps and only essential limited branching.

### BPMN and unrestricted workflow scripting

Excluded:

- BPMN compatibility;
- arbitrary scripts;
- embedded code actions;
- unrestricted expressions;
- reusable subprocesses;
- nested workflow branches.

Reason: complexity, security risk and difficult AI maintenance.

### Automatic routing and workload balancing

Excluded:

- AI routing;
- learned routing;
- capacity-based assignment;
- automatic round-robin as a core dependency;
- automatic workload balancing.

V1 alternative: manual assignment and controlled department routes.

### Advanced escalation

Excluded:

- multi-level escalation ladders;
- nested escalation policy builder;
- automatic management escalation chains.

V1 alternative: due dates, overdue visibility and manual supervisor intervention.

### Cross-organization handoffs

Excluded: routing a request between separate legal institutions or tenants.

Reason: contractual, privacy, permission and data-sharing complexity.

## 4. Forms and public pages

### Visual form builder

Excluded:

- arbitrary drag-and-drop fields;
- unrestricted conditional logic;
- custom scripts;
- deeply nested reusable components.

V1 alternative: supported field types and versioned form schemas.

### Homepage block builder

Excluded:

- free-form layout editing;
- third-party blocks;
- custom-code blocks;
- a full website builder.

V1 alternative: institution branding applied to a fixed service-portal structure.

### Template marketplace

Excluded:

- public template publishing;
- third-party developer marketplace;
- paid template distribution;
- arbitrary installable workflow packs.

## 5. Permission and enterprise non-goals

### Complex permission editor

Excluded:

- arbitrary custom roles;
- field-level permission builder;
- visual permission matrix;
- delegated policy administration.

V1 alternative: fixed roles, permission keys and scopes.

### Enterprise SSO

Excluded:

- SAML;
- custom identity providers;
- directory synchronization;
- automated provisioning.

V1 alternative: email/password, verification, reset and staff invitations.

### Full public API platform

Excluded:

- public developer portal;
- customer API keys;
- broad versioned external API;
- SDKs and marketplace webhooks.

Internal route handlers and required provider webhooks are still allowed.

### Dedicated database/deployment per ordinary institution

V1 uses shared-database, shared-schema multi-tenancy with organization isolation.

## 6. Communication non-goals

Excluded:

- WhatsApp integration;
- SMS integration;
- omnichannel inbox;
- call-centre integration;
- advanced preference centre;
- unrestricted institution notification builder.

V1 alternative:

- in-app notifications;
- essential email;
- applicant messages;
- internal notes;
- structured handoff instructions.

## 7. Document-intelligence non-goals

Excluded:

- OCR;
- AI document analysis;
- automatic classification;
- automatic comparison;
- AI fraud scoring;
- biometric checks;
- advanced electronic signatures;
- blockchain verification;
- advanced retention/legal holds;
- full antivirus workflow during the earliest controlled demo.

V1 alternative:

- real private uploads;
- metadata;
- type/size validation;
- signed downloads;
- manual review;
- exact issued-document storage.

Malware scanning becomes necessary before sensitive production use at scale.

## 8. Payment non-goals

Unless payment is the central pilot problem, exclude:

- live M-PESA STK Push as a launch dependency;
- PayBill reconciliation automation;
- Stripe;
- multiple providers;
- refunds;
- partial payments;
- overpayment allocation;
- fee-waiver workflow;
- subscription billing.

V1 alternative:

- no fee;
- manual payment reference;
- officer verification;
- payment confirmed or rejected;
- provider abstraction preserved.

## 9. Reporting and analytics non-goals

Excluded:

- unrestricted custom report builder;
- arbitrary SQL reporting;
- advanced executive dashboard suite;
- data warehouse;
- external BI platform;
- predictive analytics;
- officer league tables;
- complex fairness-adjusted scoring;
- large fact/dimension model as a V1 requirement;
- scheduled report builder.

V1 alternative:

- real operational metrics;
- officer, department, organization and handoff reports;
- product-validation events;
- server-generated aggregate queries;
- Recharts where useful.

## 10. AI non-goals

Excluded:

- AI routing;
- AI decision-making;
- AI approval recommendation as a core dependency;
- AI document analysis;
- AI-generated rejection decisions;
- autonomous staff actions;
- predictive escalation.

Useful AI requires historical data, clear rules, human override, trust and measurable error rates.

## 11. Mobile non-goals

Excluded:

- native Android app;
- native iOS app;
- offline-first officer workflows;
- push-notification infrastructure as a V1 requirement.

V1 still requires a responsive web experience, especially for applicants.

## 12. Infrastructure non-goals

Excluded:

- microservices;
- separate frontend and Express/Nest backend;
- Kubernetes;
- Kafka;
- GraphQL as primary API;
- Camunda;
- Temporal;
- Elasticsearch/OpenSearch;
- custom authentication;
- custom file-storage infrastructure;
- separate repository per dashboard;
- separate database per ordinary institution;
- real-time updates on every page.

## 13. Service breadth non-goals

V1 does not attempt:

- every institutional service;
- every industry;
- 100 configured services;
- every department structure;
- arbitrary organization hierarchies;
- all payment/document policies.

V1 supports one fully functional service and two controlled demonstration services.

## 14. Design non-goals

Stage 0 does not finalize:

- every missing screen;
- exact spacing/dimensions;
- every responsive detail;
- advanced motion;
- multiple visual themes;
- full white-label website freedom.

Later design stages must still deliver a coherent, responsive and accessible V1.

## 15. Enforcement test

When a new feature is proposed, ask:

1. Is it required for the Transcript Request vertical slice?
2. Is it required for pilot safety?
3. Is it required to measure the core assumption?
4. What existing V1 work will it replace?
5. What evidence proves it must be built now?

If the case is weak, move it to `POST-V1-BACKLOG.md`.

## 16. Allowed extension points

V1 should preserve clean seams for:

- additional services through versioned configuration;
- more departments and memberships;
- more workflow steps/transitions;
- payment adapters;
- notification channels;
- PDF templates;
- verification records;
- aggregate reporting;
- feature flags;
- integration routes.

An extension point is not permission to implement the feature now.

## 17. Coding-agent instruction

> Do not implement, activate navigation for or simulate completion of a non-goal unless the current release scope explicitly changes. Record future requirements in the backlog.
