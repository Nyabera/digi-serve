# FAIDIA Stage 0 — V1 Non-Goals

Status: **APPROVED_FOR_V1**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document prevents V1 from expanding into the complete future FAIDIA platform. A non-goal is not deleted forever; it is intentionally excluded because it is not required to validate the first end-to-end institutional workflow.

## 2. Scope Principle

Build narrow and end-to-end, not broad and shallow.

A feature is not part of V1 merely because:

- a mockup exists;
- a competitor has it;
- it sounds enterprise-ready;
- the architecture may support it later;
- it makes the demo look larger;
- an AI coding agent can generate a rough version quickly.

## 3. Approved Stage 1 Exclusions

The following are not active Stage 1 scope:

- transfer route in the main Transcript Request path;
- standalone applicant payment workspace;
- standalone admin payment configuration;
- live M-PESA;
- PayBill reconciliation;
- Stripe;
- refunds;
- fee waivers;
- public document verification;
- visual workflow builder;
- visual form builder;
- homepage block builder;
- template marketplace;
- integration marketplace;
- custom report builder;
- AI routing;
- AI document analysis;
- OCR;
- capacity-based assignment;
- automatic round-robin;
- cross-organization handoffs;
- enterprise SSO;
- native mobile apps;
- offline officer workflows;
- microservices;
- GraphQL as primary API;
- Kubernetes;
- Kafka;
- Camunda;
- Temporal.

## 4. Workflow And Routing Non-Goals

Excluded:

- advanced visual workflow builder;
- BPMN compatibility;
- arbitrary workflow scripting;
- unrestricted conditional branching;
- transfer as required Stage 1 path;
- automatic routing;
- automatic workload balancing;
- automatic round-robin as core dependency;
- multi-level escalation ladders;
- cross-organization handoffs.

V1 alternative:

- versioned workflow records;
- controlled configuration;
- sequential Transcript Request path;
- Finance referral only in main path;
- manual assignment and department self-claim;
- due dates and overdue visibility.

## 5. Forms And Public Pages Non-Goals

Excluded:

- drag-and-drop form builder;
- unrestricted conditional logic;
- custom scripts;
- homepage block builder;
- template marketplace.

V1 alternative:

- supported field types;
- versioned form schemas;
- fixed institution service portal structure;
- controlled form configuration.

## 6. Permission And Enterprise Non-Goals

Excluded:

- arbitrary custom roles;
- field-level permission builder;
- visual permission matrix;
- delegated policy administration;
- SAML;
- custom identity providers;
- directory synchronization;
- full public API platform.

V1 alternative:

- fixed roles;
- permission keys and scopes;
- email/password;
- verification, reset, and staff invitations;
- server-side authorization helpers.

## 7. Communication Non-Goals

Excluded:

- WhatsApp integration;
- SMS integration;
- omnichannel inbox;
- call-center integration;
- unrestricted notification template builder.

V1 alternative:

- in-app notifications required;
- email optional for internal demo and required before external pilot;
- applicant messages;
- internal notes;
- structured handoff instructions.

## 8. Document-Intelligence Non-Goals

Excluded:

- OCR;
- AI document analysis;
- automatic classification;
- fraud scoring;
- biometric checks;
- advanced e-signatures;
- blockchain verification;
- advanced retention/legal holds.

V1 alternative:

- real private uploads;
- metadata;
- type/size validation;
- signed downloads;
- manual review;
- exact issued-document storage.

Malware scanning should be added before sensitive production use at scale.

## 9. Payment Non-Goals

V1 approved payment posture: manual payment reference inside the request flow.

Excluded unless future scope changes:

- live M-PESA STK Push;
- PayBill reconciliation automation;
- Stripe;
- multiple providers;
- refunds;
- partial payments;
- overpayment allocation;
- fee-waiver workflow;
- subscription billing.

## 10. Reporting Non-Goals

Excluded:

- unrestricted custom report builder;
- arbitrary SQL reporting;
- advanced executive dashboard suite;
- data warehouse;
- predictive analytics;
- officer league tables;
- scheduled report builder.

V1 alternative:

- operational metrics;
- officer, department, organization, and handoff reports;
- product-validation events;
- server-generated aggregate queries.

## 11. Design Non-Goals

Stage 0 does not finalize:

- every missing screen;
- exact spacing/dimensions;
- every responsive detail;
- advanced motion;
- multiple visual themes;
- full white-label website freedom.

The current visual direction is approved, and missing screens may be designed during implementation.

## 12. Enforcement Test

When a new feature is proposed, ask:

1. Is it required for the Transcript Request vertical slice?
2. Is it required for pilot safety?
3. Is it required to measure the core assumption?
4. What existing V1 work will it replace?
5. What evidence proves it must be built now?

If the case is weak, move it to `POST-V1-BACKLOG.md`.

## 13. Coding-Agent Instruction

Do not implement, activate navigation for, or simulate completion of a non-goal unless product scope explicitly changes.
