# FAIDIA Stage 0 — Current Transcript Request Process

Status: **APPROVED_FOR_STAGE_1**  
Version: **1.4**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document records the assumed current-state Transcript Request process before FAIDIA. It identifies actors, tools, handoffs, delays, missing records, and communication outside formal systems.

Stage 1 may use these assumptions for a synthetic demo. They must be validated before an external real-data pilot.

## 2. Validation position

Decision: **Proceed with documented assumptions for the synthetic Stage 1 demo; validate before external pilot.**

Stage 1 must not hard-code institution-specific facts beyond the approved Savannah defaults.

## 3. Generic current-state summary

A typical process may involve:

1. applicant learns about the service through word of mouth, notices, website, or a physical office;
2. applicant submits a paper form, email, WhatsApp message, or verbal request;
3. Student Records manually records or forwards the request;
4. staff check identity and academic details in another system, paper file, or spreadsheet;
5. Finance is contacted through call, email, WhatsApp, paper note, or in-person follow-up;
6. Registrar approval is requested through a moved file, email, or signature process;
7. applicant repeatedly contacts staff for updates;
8. final transcript or collection instruction is delivered manually;
9. stage duration, ownership, and handoff delay are poorly measured.

## 4. Current actors

| Actor | Typical responsibility | Typical tools | Main risk |
|---|---|---|---|
| Applicant | Start request, provide information, follow up, collect outcome | Walk-in, paper, phone, email, WhatsApp | Repeated visits and unclear status |
| Front desk | Explain requirements and direct applicant | Verbal instructions, printed checklist | Inconsistent guidance |
| Student Records officer | Receive, review, coordinate | Paper file, email, spreadsheet, student system | Lost requests and unclear ownership |
| Finance officer | Confirm hold, fee, balance, or payment reference | Finance system, spreadsheet, email, call | Informal confirmation |
| Registrar | Review and authorize | Paper file, email, signature | Approval delay and weak tracking |
| Supervisor | Allocate work and resolve delay | Meetings, spreadsheet, phone | No reliable backlog view |
| Support staff | Answer enquiries | Phone, email, counter | Time spent reconstructing status |

## 5. Approved Stage 1 assumptions

- Student Records coordinates the parent request.
- Finance performs a structured referral check.
- Finance result codes are `CLEAR`, `HOLD`, and `CANNOT_VERIFY`.
- Manual payment reference is required for the Savannah demo.
- Registrar approval is required for every Transcript Request.
- ID/passport is required; student ID is conditional.
- Outcome is a controlled notice plus demo transcript.
- Completion is recorded only after controlled download, physical collection, or exceptional Supervisor manual closure.
- Transfer is not part of the Stage 1 path.

## 6. Process areas to validate before external pilot

| Process area | Owner to confirm | Evidence | Stage 1 assumption |
|---|---|---|---|
| Submission channel | Service owner | Interview/form | Digital service flow |
| Required fields | Student Records | Blank form | Seeded V1 form |
| Documents | Student Records | Checklist | ID/passport required |
| Fee | Finance | Fee schedule | Manual reference required |
| Finance check | Finance | Example result | Hold blocks issuance |
| Approval authority | Registrar | SOP/interview | Registrar approval required |
| Outcome type | Records/Registrar | Sample output | Controlled notice plus exact stored copy |
| Processing target | Service owner | Published target | Five working days |
| Notification channel | Service owner | Template | In-app; email before pilot |
| Collection evidence | Student Records | Register/SOP | Collector, identifier, date/time, outcome reference |
| Manual closure authority | Service owner | SOP | Supervisor only, reason/evidence required |
| Reopening authority | Service owner | SOP | Supervisor only, reason required |

## 7. Pain inventory and FAIDIA response

| Pain | Operational effect | FAIDIA response |
|---|---|---|
| No unique reference | Difficult lookup and duplicates | Generated request reference and duplicate control |
| Unclear owner | Requests stall | Work items, assignment, department queue |
| Vague handoff | Rework and clarification | Structured Finance referral |
| Missing documents | Repeated visits | Requirements, review states, correction action |
| No tracking | Status enquiries | Applicant-safe status and timeline |
| Missing timestamps | Bottlenecks invisible | Request, work-item, handoff, and outcome timestamps |
| Informal approval | Weak auditability | Registrar decision and audit event |
| Disconnected outcome | Broken record | Exact issued copy/outcome link and checksum |
| Spreadsheet reports | Conflicting totals | Reports from database timestamps/events |
| External coordination | No audit trail | Handoffs, messages, notes, notifications, events |

## 8. Artifacts to request before external pilot

Request blank or redacted examples of:

- service description;
- application form;
- requirements checklist;
- fee schedule;
- correction message;
- Finance verification request/result;
- approval note;
- rejection reasons;
- request receipt;
- collection notice and collection register;
- manual closure SOP;
- reopening SOP;
- supervisor report;
- processing target;
- current SOP.

Do not request sensitive student records merely to design V1.

## 9. Baseline measurements

Measure or estimate:

- monthly request volume;
- end-to-end completion time;
- time to first action;
- correction rate;
- applicant follow-ups per request;
- Finance response time;
- approval waiting time;
- outcome access/collection rate;
- reopened request rate;
- manual closure rate;
- overdue rate;
- staff time spent on spreadsheets and status enquiries.

## 10. Coding-agent instruction

Use this file for current-state assumptions only. Use `V1-VERTICAL-SLICE.md` for future-state behavior. Do not implement unvalidated institution-specific rules as generic platform behavior.
