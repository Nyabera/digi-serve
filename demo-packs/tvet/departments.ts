import type { DemoDepartmentConfig } from "../../features/demo-engine/config";

export const tvetDepartmentsDraft = [
  { id: "admissions", name: "Admissions", active: true },
  {
    id: "student-records",
    name: "Student Records",
    active: true,
  },
  { id: "finance", name: "Finance", active: true },
  { id: "registrar", name: "Registrar", active: true },
  {
    id: "academic-affairs",
    name: "Academic Affairs",
    active: true,
  },
  {
    id: "career-services",
    name: "Career Services",
    active: true,
  },
  { id: "library", name: "Library", active: true },
  {
    id: "department-office",
    name: "Department Office",
    active: true,
  },
] satisfies readonly DemoDepartmentConfig[];
