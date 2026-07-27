import type { DemoSlaConfig } from "../../features/demo-engine/config";

export const tvetSlaDraft = {
  serviceTargets: [
    {
      id: "sla-transcript-request",
      serviceId: "transcript-request",
      targetHours: 120,
      warningHours: 96,
    },
    {
      id: "sla-student-clearance",
      serviceId: "student-clearance",
      targetHours: 72,
      warningHours: 48,
    },
    {
      id: "sla-certificate-replacement",
      serviceId: "certificate-replacement",
      targetHours: 120,
      warningHours: 96,
    },
    {
      id: "sla-industrial-attachment-letter",
      serviceId: "industrial-attachment-letter",
      targetHours: 48,
      warningHours: 36,
    },
    {
      id: "sla-course-application",
      serviceId: "course-application",
      targetHours: 72,
      warningHours: 48,
    },
    {
      id: "sla-class-registration",
      serviceId: "class-registration",
      targetHours: 24,
      warningHours: 18,
    },
  ],
  departmentTargets: [
    {
      id: "sla-department-student-records",
      departmentId: "student-records",
      targetHours: 48,
      warningHours: 36,
    },
    {
      id: "sla-department-finance",
      departmentId: "finance",
      targetHours: 24,
      warningHours: 18,
    },
    {
      id: "sla-department-admissions",
      departmentId: "admissions",
      targetHours: 48,
      warningHours: 36,
    },
    {
      id: "sla-department-registrar",
      departmentId: "registrar",
      targetHours: 48,
      warningHours: 36,
    },
  ],
  seededPerformance: [
    {
      id: "performance-officer-grace",
      subjectId: "officer-demo",
      subjectType: "officer",
      complianceRate: 94,
      averageResolutionHours: 31,
      state: "on-track",
    },
    {
      id: "performance-officer-peter",
      subjectId: "officer-finance-demo",
      subjectType: "officer",
      complianceRate: 91,
      averageResolutionHours: 19,
      state: "on-track",
    },
    {
      id: "performance-department-records",
      subjectId: "student-records",
      subjectType: "department",
      complianceRate: 86,
      averageResolutionHours: 41,
      state: "at-risk",
    },
    {
      id: "performance-department-finance",
      subjectId: "finance",
      subjectType: "department",
      complianceRate: 93,
      averageResolutionHours: 17,
      state: "on-track",
    },
  ],
} satisfies DemoSlaConfig;
