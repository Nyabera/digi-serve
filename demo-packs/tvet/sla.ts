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
  departmentTargets: [],
  seededPerformance: [],
} satisfies DemoSlaConfig;
