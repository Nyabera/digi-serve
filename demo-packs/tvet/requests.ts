import type { DemoRequestConfig } from "../../features/demo-engine/config";

export const tvetRequestsDraft = [
  {
    id: "STC-CL-2026-0027",
    serviceId: "student-clearance",
    requesterId: "applicant-demo",
    assignedOfficerId: "officer-demo",
    assignedDepartmentId: "student-records",
    status: "completed",
    currentStepId: "registrar-completion",
    data: {
      registrationNumber: "STC/2026/0027",
      programme: "Diploma in Information Technology",
    },
  },
] satisfies readonly DemoRequestConfig[];
