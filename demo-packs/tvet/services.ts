import type { DemoServiceConfig } from "../../features/demo-engine/config";

export const tvetServicesDraft = [
  {
    id: "transcript-request",
    name: "Transcript Request",
    workflowId: "transcript-request",
    slaId: "sla-transcript-request",
    active: true,
  },
  {
    id: "student-clearance",
    name: "Student Clearance",
    workflowId: "student-clearance",
    slaId: "sla-student-clearance",
    active: true,
  },
  {
    id: "certificate-replacement",
    name: "Certificate Replacement",
    workflowId: "certificate-replacement",
    slaId: "sla-certificate-replacement",
    active: true,
  },
  {
    id: "industrial-attachment-letter",
    name: "Industrial Attachment Letter",
    workflowId: "industrial-attachment-letter",
    slaId: "sla-industrial-attachment-letter",
    active: true,
  },
  {
    id: "course-application",
    name: "Course Application",
    workflowId: "course-application",
    slaId: "sla-course-application",
    active: true,
  },
  {
    id: "class-registration",
    name: "Class Registration",
    workflowId: "class-registration",
    slaId: "sla-class-registration",
    active: true,
  },
] satisfies readonly DemoServiceConfig[];
