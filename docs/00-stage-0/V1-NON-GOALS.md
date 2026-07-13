# FAIDIA Stage 0 — V1 And Stage 1 Non-Goals

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.3**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document prevents the first vertical slice from expanding into the full future platform.

## 2. Stage 1 principle

Stage 1 proves one complete Transcript Request journey. It does not prove every V1 page, every service, or every configuration capability.

A useful feature is still excluded when it is not required by the approved acceptance scenario.

## 3. Stage 1 non-goals

Stage 1 does not require:

- all `LATER_V1` pages;
- complete organization onboarding;
- complete department/user/membership administration;
- full applicant account management;
- dedicated saved-draft management;
- full supervisor assignment/reporting suite;
- standalone work-item details;
- standalone audit activity;
- standalone payment workspace;
- complete service template management;
- arbitrary form-field creation;
- arbitrary document-rule creation;
- arbitrary workflow editing;
- workflow migration;
- automatic draft migration;
- custom roles;
- custom permission editor;
- advanced feature-flag management;
- organization-wide custom reports.

## 4. Workflow/routing non-goals

- transfer;
- cross-organization handoffs;
- parallel branches;
- nested branches;
- arbitrary conditions;
- scripts;
- BPMN;
- reusable subprocesses;
- automatic routing;
- workload balancing;
- multi-level escalation ladders;
- advanced SLA calendars.

## 5. Form/public-page non-goals

- drag-and-drop form builder;
- arbitrary field types;
- arbitrary conditional logic;
- homepage block builder;
- template marketplace;
- developer marketplace;
- arbitrary public themes;
- multilingual content editor.

## 6. Permission/enterprise non-goals

- custom roles;
- visual permission editor;
- enterprise SSO;
- directory synchronization;
- cross-organization operational access;
- Organization Admin access to sensitive requests by default;
- support impersonation;
- unrestricted Platform Admin data access.

## 7. Communication non-goals

- WhatsApp;
- SMS;
- live chat;
- omnichannel inbox;
- advanced correspondence templates;
- external email delivery for the internal Stage 1 demo.

Email is required before an external pilot.

## 8. Document-intelligence non-goals

- OCR;
- AI extraction;
- AI document analysis;
- automatic authenticity determination;
- biometric verification;
- public QR/token verification;
- document marketplace.

## 9. Payment non-goals

- M-PESA STK Push;
- PayBill reconciliation;
- cards;
- multiple providers;
- refunds;
- fee waivers;
- payment plans;
- financial ledger;
- standalone applicant/admin payment modules.

Stage 1 records the configured manual payment reference inside the request.

## 10. Reporting non-goals

- custom report builder;
- data warehouse;
- predictive analytics;
- officer ranking;
- arbitrary exports;
- executive BI suite;
- cross-organization benchmarks.

Stage 1 reporting is limited to real workflow timestamps, stage duration, backlog, handoff time, correction time, approval time, completion method, reopen count, and overdue state.

## 11. Design non-goals

- final pixel-perfect design freeze;
- custom animation system;
- native mobile apps;
- complete dark mode;
- every old mockup;
- placeholders for postponed routes;
- pixel-copying inconsistent references.

## 12. Enforcement test

Before adding work, ask:

1. Is it `STAGE_1_REQUIRED`?
2. Is it required by the acceptance scenario?
3. Is it supported by the exact permission/status/workflow documents?
4. Does it avoid creating a new database or route commitment?
5. Is it absent from this non-goal list?

If any answer is no, stop and update the documents before implementation.

## 13. Coding-agent instruction

Do not build excluded capabilities as “small extras.” Keep `LATER_V1`, `DEMO_ONLY`, and `POSTPONED` out of Stage 1 unless explicitly promoted.
