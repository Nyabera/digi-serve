import type { DemoServiceConfig } from "../../features/demo-engine/config";

export const tvetServicesDraft = [
  {
    id: "transcript-request",
    name: "Transcript Request",
    summary: "Request an official academic transcript.",
    description:
      "Submit your details for records review, payment verification and Registrar approval.",
    audienceLabel: "Current and former students",
    workflowId: "transcript-request",
    slaId: "sla-transcript-request",
    active: true,
  },
  {
    id: "student-clearance",
    name: "Student Clearance",
    summary: "Complete institutional clearance through one request.",
    description:
      "Route clearance through the Department, Library, Finance and Registrar.",
    audienceLabel: "Completing and withdrawing students",
    workflowId: "student-clearance",
    slaId: "sla-student-clearance",
    active: true,
  },
  {
    id: "certificate-replacement",
    name: "Certificate Replacement",
    summary: "Replace a lost, damaged or incorrect certificate.",
    description:
      "Verify identity and supporting documents before replacement approval and issue.",
    audienceLabel: "Graduates and former students",
    workflowId: "certificate-replacement",
    slaId: "sla-certificate-replacement",
    active: true,
  },
  {
    id: "industrial-attachment-letter",
    name: "Industrial Attachment Letter",
    summary: "Request an official industrial attachment letter.",
    description:
      "Confirm programme eligibility, placement details and departmental approval.",
    audienceLabel: "Eligible continuing students",
    workflowId: "industrial-attachment-letter",
    slaId: "sla-industrial-attachment-letter",
    active: true,
  },
  {
    id: "course-application",
    name: "Course Application",
    summary: "Apply for admission into a new programme.",
    description:
      "Submit applicant information, academic evidence and programme selection for review.",
    audienceLabel: "Prospective students",
    workflowId: "course-application",
    slaId: "sla-course-application",
    active: true,
  },
  {
    id: "class-registration",
    name: "Class Registration",
    summary: "Register for the next class or teaching period.",
    description:
      "Verify academic eligibility, fee status and class capacity before confirmation.",
    audienceLabel: "Current students",
    workflowId: "class-registration",
    slaId: "sla-class-registration",
    active: true,
  },
] satisfies readonly DemoServiceConfig[];
