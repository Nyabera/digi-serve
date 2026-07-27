import type { DemoUserConfig } from "../../features/demo-engine/config";

export const tvetUsersDraft = [
  {
    id: "applicant-demo",
    name: "Demo Applicant",
    role: "applicant",
    departmentId: null,
    active: true,
  },
  {
    id: "officer-demo",
    name: "Grace Wanjiku",
    role: "officer",
    departmentId: "student-records",
    title: "Student Records Officer",
    active: true,
  },
  {
    id: "supervisor-demo",
    name: "Dr. Miriam Wekesa",
    role: "supervisor",
    departmentId: "registrar",
    title: "Registrar Supervisor",
    active: true,
  },
  {
    id: "admin-demo",
    name: "System Administrator",
    role: "admin",
    departmentId: null,
    title: "Institution Administrator",
    active: true,
  },
] satisfies readonly DemoUserConfig[];
