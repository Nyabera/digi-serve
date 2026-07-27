import type { DemoDepartmentConfig } from "../../features/demo-engine/config";

export const tvetDepartmentsDraft = [
  {
    id: "admissions",
    name: "Admissions",
    description:
      "Handles applications, enrolment checks and admission decisions.",
    active: true,
  },
  {
    id: "student-records",
    name: "Student Records",
    description:
      "Maintains academic records, transcripts and student files.",
    active: true,
  },
  {
    id: "finance",
    name: "Finance",
    description:
      "Verifies fees, payments, balances and financial clearance.",
    active: true,
  },
  {
    id: "registrar",
    name: "Registrar",
    description:
      "Provides final academic approval and official document authorization.",
    active: true,
  },
  {
    id: "academic-affairs",
    name: "Academic Affairs",
    description:
      "Coordinates course, class and academic-status decisions.",
    active: true,
  },
  {
    id: "career-services",
    name: "Career Services",
    description:
      "Supports industrial attachment and employer-facing documentation.",
    active: true,
  },
  {
    id: "library",
    name: "Library",
    description:
      "Confirms library obligations and student clearance.",
    active: true,
  },
  {
    id: "department-office",
    name: "Department Office",
    description:
      "Handles programme-level review and departmental approval.",
    active: true,
  },
] satisfies readonly DemoDepartmentConfig[];
