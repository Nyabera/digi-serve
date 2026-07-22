import { getDefaultDemoClient } from "@/config/demo";
import type { DemoEngineState } from "@/types/demo/demo-state";

function requireValue<T>(value: T | undefined, label: string): T {
  if (!value) {
    throw new Error(`Missing required Demo Engine seed value: ${label}`);
  }

  return value;
}

export function createDemoSeedState(): DemoEngineState {
  const client = getDefaultDemoClient();

  const applicant = requireValue(
    client.people.find((person) => person.role === "APPLICANT"),
    "applicant",
  );

  const recordsOfficer = requireValue(
    client.people.find(
      (person) =>
        person.role === "OFFICER" &&
        person.departmentId === "student-records",
    ),
    "Student Records officer",
  );

  const financeOfficer = requireValue(
    client.people.find(
      (person) =>
        person.role === "OFFICER" && person.departmentId === "finance",
    ),
    "Finance officer",
  );

  const supervisor = requireValue(
    client.people.find((person) => person.role === "SUPERVISOR"),
    "supervisor",
  );

  const transcriptService = requireValue(
    client.services.find(
      (service) => service.slug === "transcript-request",
    ),
    "Transcript Request service",
  );

  const clearanceService = requireValue(
    client.services.find(
      (service) => service.slug === "student-clearance",
    ),
    "Student Clearance service",
  );

  const seededAt = "2026-07-22T08:00:00.000Z";

  return {
    schemaVersion: 1,
    clientSlug: client.organization.slug,
    activeHomepageVariant: client.homepage.defaultVariant,
    activeRole: client.presentation.defaultRole,
    activeRequestId: "REQ-DEMO-001",
    activeHandoffId: "HND-DEMO-001",

    applicant: {
      id: applicant.id,
      fullName: applicant.name,
      email: applicant.email,
      phone: "+254 712 345 678",
      registered: true,
    },

    formDrafts: {
      "transcript-request": {
        fullName: applicant.name,
        email: applicant.email,
        phone: "+254 712 345 678",
        admissionNumber: "STC/2021/0042",
        programme: "Diploma in Information Communication Technology",
        yearOfAdmission: 2021,
        yearOfCompletion: 2024,
        purpose: "employment",
        deliveryMethod: "controlled-download",
        paymentReference: "MPESA-DEMO-48291",
        accuracyDeclaration: true,
      },
    },

    documents: [
      {
        id: "DOC-DEMO-001",
        requestId: "REQ-DEMO-001",
        requirementId: "document-national-id",
        name: "amina-hassan-national-id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 842_000,
        status: "ACCEPTED",
        selectedAt: "2026-07-22T08:22:00.000Z",
        reviewedAt: "2026-07-22T09:05:00.000Z",
      },
      {
        id: "DOC-DEMO-002",
        requestId: "REQ-DEMO-001",
        requirementId: "document-student-id",
        name: "student-id-card.png",
        mimeType: "image/png",
        sizeBytes: 428_000,
        status: "UNDER_REVIEW",
        selectedAt: "2026-07-22T08:23:00.000Z",
      },
      {
        id: "DOC-DEMO-003",
        requestId: "REQ-DEMO-002",
        requirementId: "document-national-id",
        name: "applicant-two-id.pdf",
        mimeType: "application/pdf",
        sizeBytes: 611_000,
        status: "ACCEPTED",
        selectedAt: "2026-07-21T07:30:00.000Z",
        reviewedAt: "2026-07-21T08:10:00.000Z",
      },
    ],

    requests: [
      {
        id: "REQ-DEMO-001",
        reference: "STC-TR-2026-0042",
        serviceId: transcriptService.id,
        serviceSlug: transcriptService.slug,
        applicantId: applicant.id,
        status: "RECORDS_REVIEW_IN_PROGRESS",
        publicStatus: "In Review",
        currentDepartmentId: "student-records",
        assignedOfficerId: recordsOfficer.id,
        currentWorkflowStepId: "transcript-records-review",
        createdAt: "2026-07-22T08:10:00.000Z",
        submittedAt: "2026-07-22T08:25:00.000Z",
        dueAt: "2026-07-27T17:00:00.000Z",
        formResponse: {
          admissionNumber: "STC/2021/0042",
          fullName: applicant.name,
          programme:
            "Diploma in Information Communication Technology",
          yearOfCompletion: 2024,
          deliveryMethod: "controlled-download",
          paymentReference: "MPESA-DEMO-48291",
        },
      },
      {
        id: "REQ-DEMO-002",
        reference: "STC-TR-2026-0038",
        serviceId: transcriptService.id,
        serviceSlug: transcriptService.slug,
        applicantId: "person-applicant-demo-two",
        status: "FINANCE_REFERRAL_IN_PROGRESS",
        publicStatus: "Additional Checks in Progress",
        currentDepartmentId: "student-records",
        assignedOfficerId: recordsOfficer.id,
        currentWorkflowStepId: "transcript-finance-referral",
        createdAt: "2026-07-21T07:00:00.000Z",
        submittedAt: "2026-07-21T07:35:00.000Z",
        dueAt: "2026-07-26T17:00:00.000Z",
        formResponse: {
          admissionNumber: "STC/2020/0118",
          fullName: "Brian Ochieng",
          programme: "Diploma in Business Management",
          paymentReference: "MPESA-DEMO-39012",
        },
      },
      {
        id: "REQ-DEMO-003",
        reference: "STC-TR-2026-0031",
        serviceId: transcriptService.id,
        serviceSlug: transcriptService.slug,
        applicantId: "person-applicant-demo-three",
        status: "AWAITING_APPROVAL",
        publicStatus: "Awaiting Decision",
        currentDepartmentId: "registrar",
        assignedOfficerId: supervisor.id,
        currentWorkflowStepId: "transcript-registrar-approval",
        createdAt: "2026-07-19T06:30:00.000Z",
        submittedAt: "2026-07-19T07:00:00.000Z",
        dueAt: "2026-07-24T17:00:00.000Z",
        formResponse: {
          admissionNumber: "STC/2019/0086",
          fullName: "Mercy Atieno",
          programme: "Diploma in Hospitality Management",
        },
      },
      {
        id: "REQ-DEMO-004",
        reference: "STC-CL-2026-0027",
        serviceId: clearanceService.id,
        serviceSlug: clearanceService.slug,
        applicantId: "person-applicant-demo-four",
        status: "COMPLETED",
        publicStatus: "Completed",
        currentDepartmentId: "registrar",
        assignedOfficerId: supervisor.id,
        currentWorkflowStepId: "clearance-completion",
        createdAt: "2026-07-16T09:00:00.000Z",
        submittedAt: "2026-07-16T09:20:00.000Z",
        dueAt: "2026-07-19T17:00:00.000Z",
        completedAt: "2026-07-18T14:30:00.000Z",
        formResponse: {
          admissionNumber: "STC/2022/0162",
          fullName: "Kevin Maina",
          clearancePurpose: "Graduation clearance",
        },
      },
    ],

    workItems: [
      {
        id: "WORK-DEMO-001",
        requestId: "REQ-DEMO-001",
        title: "Review transcript application",
        description:
          "Confirm applicant identity, academic information and document completeness.",
        departmentId: "student-records",
        assignedOfficerId: recordsOfficer.id,
        status: "IN_PROGRESS",
        createdAt: "2026-07-22T08:25:00.000Z",
        dueAt: "2026-07-23T16:00:00.000Z",
      },
      {
        id: "WORK-DEMO-002",
        requestId: "REQ-DEMO-002",
        title: "Confirm Finance clearance",
        description:
          "Confirm whether a Finance hold prevents transcript issuance.",
        departmentId: "finance",
        status: "READY",
        createdAt: "2026-07-21T09:00:00.000Z",
        dueAt: "2026-07-22T17:00:00.000Z",
      },
      {
        id: "WORK-DEMO-003",
        requestId: "REQ-DEMO-003",
        title: "Registrar approval",
        description:
          "Review completed departmental work and issue the final decision.",
        departmentId: "registrar",
        assignedOfficerId: supervisor.id,
        status: "READY",
        createdAt: "2026-07-21T13:20:00.000Z",
        dueAt: "2026-07-22T17:00:00.000Z",
      },
      {
        id: "WORK-DEMO-004",
        requestId: "REQ-DEMO-004",
        title: "Clearance decision",
        description: "Complete the student clearance request.",
        departmentId: "registrar",
        assignedOfficerId: supervisor.id,
        status: "COMPLETED",
        createdAt: "2026-07-17T11:00:00.000Z",
        completedAt: "2026-07-18T14:30:00.000Z",
      },
    ],

    handoffs: [
      {
        id: "HND-DEMO-001",
        requestId: "REQ-DEMO-002",
        workItemId: "WORK-DEMO-002",
        type: "REFERRAL",
        fromDepartmentId: "student-records",
        toDepartmentId: "finance",
        createdByOfficerId: recordsOfficer.id,
        requestedAction:
          "Confirm whether a Finance hold prevents transcript issuance.",
        reason:
          "Student Records requires Finance clearance before continuing.",
        expectedOutput:
          "Return CLEAR, HOLD or CANNOT_VERIFY with a reason and verification date.",
        status: "PENDING_ACCEPTANCE",
        createdAt: "2026-07-21T09:00:00.000Z",
        dueAt: "2026-07-22T17:00:00.000Z",
      },
      {
        id: "HND-DEMO-002",
        requestId: "REQ-DEMO-003",
        workItemId: "WORK-DEMO-003",
        type: "REFERRAL",
        fromDepartmentId: "student-records",
        toDepartmentId: "finance",
        createdByOfficerId: recordsOfficer.id,
        assignedOfficerId: financeOfficer.id,
        requestedAction: "Confirm Finance clearance.",
        reason: "Required transcript workflow check.",
        expectedOutput: "Return a clear Finance result.",
        status: "COMPLETED",
        createdAt: "2026-07-20T08:00:00.000Z",
        dueAt: "2026-07-20T17:00:00.000Z",
        acceptedAt: "2026-07-20T08:25:00.000Z",
        completedAt: "2026-07-20T12:10:00.000Z",
        result: "CLEAR — no Finance hold was found.",
      },
    ],

    approvals: [
      {
        id: "APR-DEMO-001",
        requestId: "REQ-DEMO-003",
        approverId: supervisor.id,
        status: "PENDING",
        recommendation:
          "Approve. Student Records and Finance checks are complete.",
        createdAt: "2026-07-21T13:20:00.000Z",
      },
      {
        id: "APR-DEMO-002",
        requestId: "REQ-DEMO-004",
        approverId: supervisor.id,
        status: "APPROVED",
        recommendation: "Approve student clearance.",
        decisionReason: "All required departmental checks were complete.",
        createdAt: "2026-07-18T13:45:00.000Z",
        decidedAt: "2026-07-18T14:00:00.000Z",
    },
    ],

    outcomes: [
      {
        id: "OUT-DEMO-001",
        requestId: "REQ-DEMO-004",
        label: "Student Clearance Notice",
        status: "ISSUED",
        reference: "STC-OUT-2026-0027",
        description:
          "The student clearance request was approved and completed.",
        issuedAt: "2026-07-18T14:20:00.000Z",
      },
    ],

    notifications: [
      {
        id: "NOT-DEMO-001",
        recipientId: applicant.id,
        requestId: "REQ-DEMO-001",
        title: "Request received",
        message:
          "Your Transcript Request is currently being reviewed by Student Records.",
        href: "/demo/track/REQ-DEMO-001",
        read: false,
        createdAt: "2026-07-22T08:25:00.000Z",
      },
      {
        id: "NOT-DEMO-002",
        recipientId: financeOfficer.id,
        requestId: "REQ-DEMO-002",
        title: "New Finance referral",
        message:
          "Student Records has requested a Finance clearance check.",
        href: "/demo/department/handoffs/HND-DEMO-001",
        read: false,
        createdAt: "2026-07-21T09:00:00.000Z",
      },
      {
        id: "NOT-DEMO-003",
        recipientId: supervisor.id,
        requestId: "REQ-DEMO-003",
        title: "Approval required",
        message:
          "A Transcript Request is ready for Registrar approval.",
        href: "/demo/supervisor/approvals/REQ-DEMO-003",
        read: false,
        createdAt: "2026-07-21T13:20:00.000Z",
      },
    ],

    timelineEvents: [
      {
        id: "TIME-DEMO-001",
        requestId: "REQ-DEMO-001",
        title: "Request submitted",
        description:
          "The Transcript Request was received successfully.",
        visibility: "APPLICANT",
        occurredAt: "2026-07-22T08:25:00.000Z",
      },
      {
        id: "TIME-DEMO-002",
        requestId: "REQ-DEMO-001",
        title: "Review started",
        description:
          "Student Records started reviewing the request.",
        visibility: "APPLICANT",
        occurredAt: "2026-07-22T09:00:00.000Z",
      },
      {
        id: "TIME-DEMO-003",
        requestId: "REQ-DEMO-002",
        title: "Finance referral created",
        description:
          "Student Records requested a Finance clearance check.",
        visibility: "INTERNAL",
        occurredAt: "2026-07-21T09:00:00.000Z",
      },
      {
        id: "TIME-DEMO-004",
        requestId: "REQ-DEMO-004",
        title: "Request completed",
        description:
          "The controlled clearance outcome was issued.",
        visibility: "APPLICANT",
        occurredAt: "2026-07-18T14:30:00.000Z",
      },
    ],

    activityEvents: [
      {
        id: "ACT-DEMO-001",
        name: "request_submitted",
        requestId: "REQ-DEMO-001",
        departmentId: "student-records",
        occurredAt: "2026-07-22T08:25:00.000Z",
      },
      {
        id: "ACT-DEMO-002",
        name: "request_opened_by_officer",
        requestId: "REQ-DEMO-001",
        departmentId: "student-records",
        occurredAt: "2026-07-22T09:00:00.000Z",
      },
      {
        id: "ACT-DEMO-003",
        name: "handoff_created",
        requestId: "REQ-DEMO-002",
        departmentId: "finance",
        occurredAt: "2026-07-21T09:00:00.000Z",
      },
      {
        id: "ACT-DEMO-004",
        name: "handoff_completed",
        requestId: "REQ-DEMO-003",
        departmentId: "finance",
        occurredAt: "2026-07-20T12:10:00.000Z",
      },
      {
        id: "ACT-DEMO-005",
        name: "request_completed",
        requestId: "REQ-DEMO-004",
        departmentId: "registrar",
        occurredAt: "2026-07-18T14:30:00.000Z",
      },
    ],

    meta: {
      seededAt,
      lastUpdatedAt: seededAt,
      revision: 0,
    },
  };
}
