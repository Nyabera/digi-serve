export type WorkflowTemplateTone =
  | "blue"
  | "green"
  | "purple"
  | "orange";

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  usedCount: number;
  steps: number;
  tone: WorkflowTemplateTone;
  status: "Published" | "Draft";
};

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "student-admission",
    name: "Student Admission",
    description:
      "End-to-end admission, document review, payment confirmation and registration.",
    category: "Admissions",
    usedCount: 48,
    steps: 7,
    tone: "blue",
    status: "Published",
  },
  {
    id: "transcript-request",
    name: "Transcript Request",
    description:
      "Records review, finance verification, registrar approval and transcript issue.",
    category: "Student Records",
    usedCount: 36,
    steps: 6,
    tone: "green",
    status: "Published",
  },
  {
    id: "certificate-issuance",
    name: "Certificate Issuance",
    description:
      "Academic verification, approval, signatory routing and document generation.",
    category: "Academic Records",
    usedCount: 29,
    steps: 8,
    tone: "purple",
    status: "Published",
  },
  {
    id: "leave-of-absence",
    name: "Leave of Absence",
    description:
      "Student request, departmental review, dean approval and applicant notification.",
    category: "Academic Affairs",
    usedCount: 29,
    steps: 5,
    tone: "orange",
    status: "Published",
  },
  {
    id: "course-registration",
    name: "Course Registration",
    description:
      "Eligibility check, class-capacity validation, fee check and registration confirmation.",
    category: "Academic Affairs",
    usedCount: 24,
    steps: 6,
    tone: "blue",
    status: "Published",
  },
  {
    id: "student-clearance",
    name: "Student Clearance",
    description:
      "Parallel clearance through Library, Finance, Department and Registrar.",
    category: "Student Services",
    usedCount: 18,
    steps: 9,
    tone: "green",
    status: "Published",
  },
  {
    id: "certificate-replacement",
    name: "Certificate Replacement",
    description:
      "Identity validation, supporting-document review, approval and replacement issue.",
    category: "Student Records",
    usedCount: 12,
    steps: 7,
    tone: "purple",
    status: "Draft",
  },
  {
    id: "attachment-letter",
    name: "Industrial Attachment Letter",
    description:
      "Programme validation, placement details, approval and letter generation.",
    category: "Career Services",
    usedCount: 11,
    steps: 5,
    tone: "orange",
    status: "Published",
  },
];

export const activeWorkflowRows = [
  {
    id: "WF-2026-00156",
    name: "Transcript Request — John Doe",
    template: "Transcript Request",
    initiatedBy: "John Doe",
    initiatedAt: "27 Jul 2026, 10:30 AM",
    currentStep: "Registrar Approval",
    status: "In Progress",
  },
  {
    id: "WF-2026-00155",
    name: "Certificate Issuance — Maria Santos",
    template: "Certificate Issuance",
    initiatedBy: "Maria Santos",
    initiatedAt: "27 Jul 2026, 9:15 AM",
    currentStep: "Officer Review",
    status: "Pending",
  },
  {
    id: "WF-2026-00154",
    name: "Leave of Absence — Alex Lee",
    template: "Leave of Absence",
    initiatedBy: "Alex Lee",
    initiatedAt: "26 Jul 2026, 4:45 PM",
    currentStep: "Dean Approval",
    status: "In Progress",
  },
  {
    id: "WF-2026-00153",
    name: "Student Admission — Priya Kumar",
    template: "Student Admission",
    initiatedBy: "Priya Kumar",
    initiatedAt: "26 Jul 2026, 11:20 AM",
    currentStep: "Document Verification",
    status: "Pending",
  },
  {
    id: "WF-2026-00152",
    name: "Transcript Request — Daniel Martinez",
    template: "Transcript Request",
    initiatedBy: "Daniel Martinez",
    initiatedAt: "25 Jul 2026, 2:05 PM",
    currentStep: "Finance Approval",
    status: "Approved",
  },
];

export const recentWorkflowActivity = [
  {
    title: "John Doe’s Transcript Request",
    detail: "Registrar approved the request",
    time: "2 minutes ago",
    tone: "green",
  },
  {
    title: "Maria Santos’s Certificate Issuance",
    detail: "Waiting for Officer Review",
    time: "15 minutes ago",
    tone: "orange",
  },
  {
    title: "Alex Lee’s Leave of Absence",
    detail: "Dean approved the request",
    time: "1 hour ago",
    tone: "blue",
  },
  {
    title: "Priya Kumar’s Admission",
    detail: "Documents verified successfully",
    time: "2 hours ago",
    tone: "purple",
  },
  {
    title: "Daniel Martinez’s Transcript Request",
    detail: "Finance approval completed",
    time: "3 hours ago",
    tone: "green",
  },
] as const;
