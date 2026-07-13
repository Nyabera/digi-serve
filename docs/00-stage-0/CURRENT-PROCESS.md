# FAIDIA Stage 0 — Current Transcript Request Process

Status: **APPROVED_FOR_V1_WITH_PILOT_VALIDATION_REQUIRED**  
Version: **1.0**  
Last updated: **2026-07-13**  
Product: **FAIDIA — Service Operations Platform**

## 1. Purpose

This document records the likely current-state or as-is Transcript Request process before FAIDIA. It identifies actors, tools, handoffs, delays, missing records, and communication outside formal systems.

Approved Stage 0 decision: FAIDIA may proceed to Stage 1 using these documented assumptions for a synthetic demo. These assumptions must be validated before an external real-data pilot.

## 2. Current-State Validation Position

Decision: **Proceed with documented assumptions for demo; validate before real pilot.**

Consequences:

- Stage 1 implementation is not blocked by missing current-process interviews.
- Real pilot onboarding must validate the process areas listed below.
- Coding agents must not hard-code unconfirmed institution-specific process details beyond approved V1 defaults.

## 3. Generic Current-State Summary

A typical Transcript Request process may involve:

1. applicant learns about the service through word of mouth, notice, website, or physical office;
2. applicant submits paper form, email, WhatsApp message, or verbal request;
3. Student Records manually records or forwards the request;
4. staff check identity and academic details in another system, paper file, or spreadsheet;
5. Finance is contacted through call, email, WhatsApp, paper note, or in-person follow-up;
6. Registrar approval is requested through moved file, email, or signature process;
7. applicant repeatedly contacts staff for updates;
8. final transcript, notice, or collection instruction is delivered manually;
9. stage duration, ownership, and handoff delay are poorly measured.

## 4. Current Actors

| Actor | Typical responsibility | Typical tools | Main risk |
|---|---|---|---|
| Applicant | Start request, provide information, follow up, collect outcome | Walk-in, paper, phone, email, WhatsApp | Repeated visits and unclear status |
| Front desk | Explain requirements and direct applicant | Verbal instructions, printed checklist | Inconsistent guidance |
| Student Records officer | Receive, review, coordinate | Paper file, email, spreadsheet, student system | Lost requests and unclear ownership |
| Finance officer | Confirm hold, fee, balance, payment reference, or clearance | Finance system, spreadsheet, email, call, WhatsApp | Informal confirmation |
| Registrar / approver | Review and authorize final result | Paper file, email, signature | Approval delay and weak tracking |
| Supervisor | Allocate work and resolve delay | Meetings, spreadsheet, phone | No reliable backlog view |
| Support staff | Answer status enquiries | Phone, email, counter | Time spent finding updates |

## 5. Validated V1 Assumptions For Stage 1 Demo

These are approved for Stage 1 demo implementation:

- Student Records is the coordinating department.
- Finance performs a structured referral check.
- Finance result codes are `CLEAR`, `HOLD`, and `CANNOT_VERIFY`.
- Manual payment reference may be captured in the request.
- Registrar approval is required for every Transcript Request.
- Applicant identity uses ID/passport required and student ID conditional.
- Outcome is controlled notice plus demo transcript, not legally asserted official transcript generation.
- Completion occurs at recorded download, collection, delivery, or approved closure.

## 6. Process Areas To Validate Before Real Pilot

| Process area | Status | Owner to confirm | Evidence | Stage 1 position |
|---|---|---|---|---|
| Submission channel | Must validate before real pilot | Service owner | Interview/form | Use digital request flow in demo |
| Required fields | Must validate before real pilot | Student Records | Blank form | Use approved V1 form baseline |
| Documents | Must validate before real pilot | Student Records | Checklist | ID/passport required; student ID conditional |
| Fee | Must validate before real pilot | Finance | Fee schedule | Manual payment reference in demo |
| Finance check | Must validate before real pilot | Finance | Example request/result | Finance hold blocking issuance |
| Approval authority | Must validate before real pilot | Registrar | SOP/interview | Registrar approval required |
| Outcome type | Must validate before real pilot | Records/Registrar | Sample output | Controlled notice plus demo transcript |
| Processing target | Must validate before real pilot | Service owner | Published target | Five working days as demo target |
| Notification channel | Must validate before real pilot | Service owner | Current template | In-app required; email before external pilot |
| Closure condition | Must validate before real pilot | Student Records | Register/SOP | Download/collection/delivery/closure record |

## 7. Pain Inventory And FAIDIA Response

| Pain | Operational effect | Intended FAIDIA response |
|---|---|---|
| No unique reference | Difficult lookup and duplicates | Generated request reference and duplicate active request control |
| Unclear owner | Requests stall | Work items, assignment, department queue, self-claim |
| Vague handoff | Rework and clarification | Structured Finance referral |
| Missing documents | Repeated visits | Requirements, document states, correction action |
| No tracking | Status enquiries | Public status and applicant-safe timeline |
| Missing timestamps | Bottlenecks invisible | Request/work-item/handoff timestamps |
| Informal approval | Weak auditability | Registrar decision record and audit event |
| Disconnected outcome | Broken end-to-end record | Issued outcome link and checksum where available |
| Spreadsheet reports | Conflicting totals | Database reports from timestamps/events |
| External coordination | No audit trail | Handoffs, notes, messages, notifications, events |

## 8. Current Artifacts To Request Before Real Pilot

Where permitted, request blank or redacted examples of:

- service description;
- application form;
- requirements checklist;
- fee schedule;
- spreadsheet/register columns;
- correction message;
- Finance verification request/result;
- approval note;
- rejection reasons;
- request receipt;
- collection or dispatch notice;
- supervisor report;
- written turnaround target;
- current SOP.

Do not request sensitive student records merely to design V1.

## 9. Baseline Measurements Before Pilot

Estimate or measure:

- monthly request volume;
- end-to-end completion time;
- time to first action;
- correction rate;
- applicant follow-ups per request;
- departments per request;
- percentage consistently logged;
- lost or duplicated requests;
- Finance response time;
- approval waiting time;
- outcome delivery rate;
- staff time updating spreadsheets;
- staff time answering status enquiries.

## 10. Coding-Agent Instruction

Use this file as context for the problem and pilot validation. Use `V1-VERTICAL-SLICE.md` for the approved future workflow.
