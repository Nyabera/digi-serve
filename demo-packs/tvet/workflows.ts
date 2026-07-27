import type { DemoWorkflowConfig } from "../../features/demo-engine/config";

export const tvetWorkflowsDraft = [
  {
    id: "transcript-request",
    name: "Transcript Request",
    category: "Student Records",
    status: "published",
    steps: [
      {
        id: "submission",
        type: "submission",
        label: "Submission",
        nextStepIds: ["document-check"],
      },
      {
        id: "document-check",
        type: "verification",
        label: "Document Check",
        departmentId: "student-records",
        nextStepIds: ["payment-check"],
      },
      {
        id: "payment-check",
        type: "verification",
        label: "Payment Check",
        departmentId: "finance",
        nextStepIds: ["records-review"],
      },
      {
        id: "records-review",
        type: "review",
        label: "Records Review",
        departmentId: "student-records",
        nextStepIds: ["registrar-approval"],
      },
      {
        id: "registrar-approval",
        type: "approval",
        label: "Registrar Approval",
        departmentId: "registrar",
        nextStepIds: ["transcript-issued"],
      },
      {
        id: "transcript-issued",
        type: "output",
        label: "Transcript Issued",
        outputLabel: "Official transcript",
      },
    ],
  },
  {
    id: "student-clearance",
    name: "Student Clearance",
    category: "Student Services",
    status: "published",
    steps: [
      {
        id: "submission",
        type: "submission",
        label: "Submission",
        nextStepIds: ["department-clearance"],
      },
      {
        id: "department-clearance",
        type: "approval",
        label: "Department Clearance",
        departmentId: "department-office",
        nextStepIds: ["library-clearance"],
      },
      {
        id: "library-clearance",
        type: "approval",
        label: "Library Clearance",
        departmentId: "library",
        nextStepIds: ["finance-clearance"],
      },
      {
        id: "finance-clearance",
        type: "approval",
        label: "Finance Clearance",
        departmentId: "finance",
        nextStepIds: ["registrar-completion"],
      },
      {
        id: "registrar-completion",
        type: "output",
        label: "Clearance Completed",
        departmentId: "registrar",
        outputLabel: "Student clearance confirmation",
      },
    ],
  },
] satisfies readonly DemoWorkflowConfig[];
