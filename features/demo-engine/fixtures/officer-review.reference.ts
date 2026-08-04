import type { OfficerReviewReference } from "@/features/officer-review/model/officer-review-model";

export const officerReviewReference =
  Object.freeze({
    officers: [
      {
        id: "OFF-FIN-001",
        name: "Peter Mwangi",
        role: "Finance Officer",
        departmentName: "Finance",
      },
      {
        id: "OFF-FIN-002",
        name: "Amina Hassan",
        role: "Senior Finance Officer",
        departmentName: "Finance",
      },
      {
        id: "OFF-REG-001",
        name: "Miriam Wekesa",
        role: "Registrar Analyst",
        departmentName: "Registrar",
      },
      {
        id: "OFF-REC-001",
        name: "Grace Wanjiku",
        role: "Student Records Officer",
        departmentName: "Student Records",
      },
    ],
    reasons: [
      {
        value:
          "Finance verification is required before the transcript request can proceed to final review.",
        label: "Fee or payment verification",
      },
      {
        value:
          "Registrar confirmation is required before the request can proceed.",
        label: "Registrar confirmation",
      },
      {
        value:
          "A specialist review is required for the submitted supporting documents.",
        label: "Specialist document review",
      },
      {
        value:
          "The originating officer requires additional departmental guidance.",
        label: "Additional departmental guidance",
      },
    ],
    requestOptions: [
      {
        label: "REQ-DEMO-001",
        href: "/demo/officer/requests/REQ-DEMO-001",
      },
      {
        label: "REQ-DEMO-002",
        href: "/demo/officer/requests/REQ-DEMO-002",
      },
      {
        label: "REQ-DEMO-003",
        href: "/demo/officer/requests/REQ-DEMO-003",
      },
      {
        label: "REQ-DEMO-004",
        href: "/demo/officer/requests/REQ-DEMO-004",
      },
      {
        label: "REQ-DEMO-005",
        href: "/demo/officer/requests/REQ-DEMO-005",
      },
    ],
    defaultRequestedAction:
      "Verify the submitted manual payment reference and confirm whether the student account is clear.",
    defaultReason:
      "Finance verification is required before the transcript request can proceed to final review.",
    defaultExpectedOutput:
      "Return one structured result: CLEAR, HOLD or CANNOT_VERIFY.",
    defaultDueDate: "2026-07-25",
  } satisfies OfficerReviewReference);
