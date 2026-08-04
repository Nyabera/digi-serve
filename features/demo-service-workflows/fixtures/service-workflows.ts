export type WorkflowStage = {
  label: string;
  department: string;
  description: string;
};

export type ApplicationPrompt = {
  id: string;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "select" | "textarea";
  options?: string[];
};

export type ServiceWorkflow = {
  slug:
    | "student-clearance"
    | "certificate-replacement"
    | "industrial-attachment-letter"
    | "course-application"
    | "class-registration";
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  processingTime: string;
  fee: string;
  caseId: string;
  ownerDepartment: string;
  assignedOfficer: string;
  currentStageIndex: number;
  actionRequired?: string;
  requirements: string[];
  applicationPrompts: ApplicationPrompt[];
  stages: WorkflowStage[];
  finalOutputs: string[];
  paymentStatus: string;
  serviceHref: string;
  applyHref: string;
  trackHref: string;
};

export const SERVICE_WORKFLOWS: ServiceWorkflow[] = [
  {
    slug: "student-clearance",
    title: "Complete student clearance",
    shortTitle: "Student Clearance",
    description:
      "Clear Finance, Library, your academic department and the Registrar through one tracked request.",
    category: "Student Records",
    processingTime: "Up to 7 working days",
    fee: "No service fee",
    caseId: "CLEAR-2026-0042",
    ownerDepartment: "Student Records",
    assignedOfficer: "Kevin Mwangi",
    currentStageIndex: 2,
    actionRequired:
      "Finance clearance is complete. The Library is confirming that no materials remain outstanding.",
    requirements: [
      "Student identification card or admission number",
      "Finance statement where an outstanding balance was recently settled",
      "Library return receipt where applicable",
    ],
    applicationPrompts: [
      {
        id: "clearanceReason",
        label: "Reason for clearance",
        placeholder: "Select a reason",
        type: "select",
        options: [
          "Graduation",
          "Course completion",
          "Withdrawal",
          "Transfer",
          "Official records request",
        ],
      },
      {
        id: "programme",
        label: "Programme",
        placeholder: "Diploma in Electrical Engineering",
      },
      {
        id: "completionDate",
        label: "Expected completion date",
        placeholder: "Select a date",
        type: "date",
      },
    ],
    stages: [
      {
        label: "Request submitted",
        department: "Student Records",
        description: "The request is checked for completeness.",
      },
      {
        label: "Finance clearance",
        department: "Finance",
        description: "Balances, receipts and payment references are verified.",
      },
      {
        label: "Library clearance",
        department: "Library",
        description: "Borrowed materials and library obligations are checked.",
      },
      {
        label: "Department clearance",
        department: "Academic Department",
        description: "The programme department confirms academic clearance.",
      },
      {
        label: "Registrar approval",
        department: "Registrar",
        description: "The final clearance decision is recorded.",
      },
      {
        label: "Clearance certificate issued",
        department: "Student Records",
        description: "The approved clearance certificate becomes available.",
      },
    ],
    finalOutputs: [
      "Student clearance certificate",
      "Outstanding-obligation notice",
      "Department-specific correction request",
    ],
    paymentStatus: "Not applicable",
    serviceHref: "/demo/services/student-clearance",
    applyHref: "/demo/apply/student-clearance",
    trackHref: "/demo/track/CLEAR-2026-0042",
  },
  {
    slug: "certificate-replacement",
    title: "Replace a lost certificate",
    shortTitle: "Certificate Replacement",
    description:
      "Apply for a replacement certificate and submit identification and evidence of loss or damage.",
    category: "Certificates and Records",
    processingTime: "Up to 15 working days",
    fee: "KES 1,500",
    caseId: "CERT-2026-0061",
    ownerDepartment: "Registrar",
    assignedOfficer: "Grace Naliaka",
    currentStageIndex: 2,
    actionRequired:
      "The archived certificate record has been found. Student Records is validating the original issue details.",
    requirements: [
      "National ID or passport",
      "Police abstract or sworn affidavit",
      "Copy or photograph of the damaged certificate where available",
      "Replacement-fee receipt",
    ],
    applicationPrompts: [
      {
        id: "certificateType",
        label: "Certificate type",
        placeholder: "Select the certificate",
        type: "select",
        options: [
          "Certificate",
          "Diploma",
          "Higher Diploma",
          "Short-course certificate",
        ],
      },
      {
        id: "certificateNumber",
        label: "Original certificate number",
        placeholder: "Enter the number if known",
      },
      {
        id: "lossDetails",
        label: "Loss or damage details",
        placeholder: "Explain what happened to the original certificate",
        type: "textarea",
      },
    ],
    stages: [
      {
        label: "Application submitted",
        department: "Student Records",
        description: "The replacement application is checked for completeness.",
      },
      {
        label: "Identity verification",
        department: "Student Records",
        description: "The applicant identity and admission history are verified.",
      },
      {
        label: "Records search",
        department: "Registry Archives",
        description: "The original certificate record is located and compared.",
      },
      {
        label: "Payment confirmation",
        department: "Finance",
        description: "The replacement fee and payment reference are confirmed.",
      },
      {
        label: "Registrar approval",
        department: "Registrar",
        description: "The replacement issue is formally approved.",
      },
      {
        label: "Replacement issued",
        department: "Registrar",
        description: "Collection or secure-delivery instructions are released.",
      },
    ],
    finalOutputs: [
      "Replacement certificate",
      "Collection instructions",
      "Secure verification reference",
    ],
    paymentStatus: "Verified · KES 1,500",
    serviceHref: "/demo/services/certificate-replacement",
    applyHref: "/demo/apply/certificate-replacement",
    trackHref: "/demo/track/CERT-2026-0061",
  },
  {
    slug: "industrial-attachment-letter",
    title: "Get an industrial attachment letter",
    shortTitle: "Attachment Letter",
    description:
      "Request an introduction, placement or completion letter for your industrial attachment.",
    category: "Industrial Liaison",
    processingTime: "Up to 5 working days",
    fee: "No service fee",
    caseId: "ATTACH-2026-0088",
    ownerDepartment: "Industrial Liaison Office",
    assignedOfficer: "Amina Hassan",
    currentStageIndex: 2,
    actionRequired:
      "Your academic department is confirming the attachment dates and placement organisation.",
    requirements: [
      "Student identification card or admission number",
      "Placement organisation details",
      "Attachment start and end dates",
      "Completion evidence for completion-letter requests",
    ],
    applicationPrompts: [
      {
        id: "letterType",
        label: "Letter type",
        placeholder: "Select a letter type",
        type: "select",
        options: [
          "Introduction letter",
          "Placement letter",
          "Completion letter",
        ],
      },
      {
        id: "organisation",
        label: "Placement organisation",
        placeholder: "Enter the organisation name",
      },
      {
        id: "attachmentDates",
        label: "Attachment dates",
        placeholder: "Example: 1 September to 30 November 2026",
      },
    ],
    stages: [
      {
        label: "Request submitted",
        department: "Industrial Liaison Office",
        description: "The requested letter type and placement details are checked.",
      },
      {
        label: "Student-status verification",
        department: "Student Records",
        description: "Active student status and programme details are verified.",
      },
      {
        label: "Department review",
        department: "Academic Department",
        description: "The department confirms eligibility and attachment dates.",
      },
      {
        label: "Liaison-office review",
        department: "Industrial Liaison Office",
        description: "The placement organisation and request purpose are reviewed.",
      },
      {
        label: "Letter generation",
        department: "Industrial Liaison Office",
        description: "The approved letter is prepared using verified details.",
      },
      {
        label: "Letter issued",
        department: "Industrial Liaison Office",
        description: "The signed attachment letter becomes available.",
      },
    ],
    finalOutputs: [
      "Introduction letter",
      "Placement letter",
      "Completion letter",
    ],
    paymentStatus: "Not applicable",
    serviceHref: "/demo/services/industrial-attachment-letter",
    applyHref: "/demo/apply/industrial-attachment-letter",
    trackHref: "/demo/track/ATTACH-2026-0088",
  },
  {
    slug: "course-application",
    title: "Apply for a new course",
    shortTitle: "Course Application",
    description:
      "Choose a course, submit your qualifications and track your application through review and admission.",
    category: "Admissions",
    processingTime: "Up to 20 working days",
    fee: "KES 500 application fee",
    caseId: "COURSE-2026-01482",
    ownerDepartment: "Admissions",
    assignedOfficer: "Lucy Wambui",
    currentStageIndex: 2,
    actionRequired:
      "The Electrical Engineering department is reviewing your qualifications against the entry requirements.",
    requirements: [
      "National ID or birth certificate",
      "Passport photograph",
      "KCSE result slip or certificate",
      "Previous academic certificates",
      "Sponsorship or funding documents where applicable",
    ],
    applicationPrompts: [
      {
        id: "course",
        label: "Preferred course",
        placeholder: "Select a course",
        type: "select",
        options: [
          "Diploma in Electrical Engineering",
          "Diploma in Mechanical Engineering",
          "Diploma in Information Technology",
          "Certificate in Building Technology",
        ],
      },
      {
        id: "intake",
        label: "Preferred intake",
        placeholder: "Select an intake",
        type: "select",
        options: [
          "September 2026",
          "January 2027",
          "May 2027",
        ],
      },
      {
        id: "studyMode",
        label: "Study mode",
        placeholder: "Select a study mode",
        type: "select",
        options: ["Full-time", "Part-time", "Evening"],
      },
      {
        id: "secondChoice",
        label: "Optional second-choice course",
        placeholder: "Enter a second choice or leave blank",
      },
    ],
    stages: [
      {
        label: "Application submitted",
        department: "Admissions",
        description: "The application and uploaded qualifications are checked.",
      },
      {
        label: "Completeness check",
        department: "Admissions",
        description: "Required fields, documents and payment are validated.",
      },
      {
        label: "Eligibility review",
        department: "Academic Department",
        description: "The course department reviews entry requirements.",
      },
      {
        label: "Finance verification",
        department: "Finance",
        description: "The application fee or exemption is confirmed.",
      },
      {
        label: "Registrar approval",
        department: "Registrar",
        description: "The admission decision is formally approved.",
      },
      {
        label: "Admission letter issued",
        department: "Admissions",
        description: "The offer letter and enrolment instructions are released.",
      },
    ],
    finalOutputs: [
      "Admission or offer letter",
      "Student admission number",
      "Fee structure and reporting date",
      "Alternative-course recommendation",
      "Decline decision with reason",
    ],
    paymentStatus: "Verified · KES 500",
    serviceHref: "/demo/services/course-application",
    applyHref: "/demo/apply/course-application",
    trackHref: "/demo/track/COURSE-2026-01482",
  },
  {
    slug: "class-registration",
    title: "Register for classes",
    shortTitle: "Class Registration",
    description:
      "Select your units for the upcoming term and submit them for academic and finance clearance.",
    category: "Academic Registration",
    processingTime: "Up to 5 working days",
    fee: "Tuition balance must be within policy",
    caseId: "CLASS-2026-0109",
    ownerDepartment: "Registrar",
    assignedOfficer: "Daniel Kiptoo",
    currentStageIndex: 2,
    actionRequired:
      "Your academic adviser is checking prerequisites and the selected credit load.",
    requirements: [
      "Active student status",
      "Selected semester or term",
      "Required prerequisite results",
      "Finance status or approved payment plan",
    ],
    applicationPrompts: [
      {
        id: "semester",
        label: "Semester",
        placeholder: "Select a semester",
        type: "select",
        options: [
          "Year 1 Semester 1",
          "Year 1 Semester 2",
          "Year 2 Semester 1",
          "Year 2 Semester 2",
        ],
      },
      {
        id: "units",
        label: "Units to register",
        placeholder:
          "Example: EEE 221, EEE 224, MAT 210, COM 201",
        type: "textarea",
      },
      {
        id: "studyLoad",
        label: "Study load",
        placeholder: "Select a study load",
        type: "select",
        options: ["Full load", "Reduced load", "Repeat units only"],
      },
    ],
    stages: [
      {
        label: "Registration submitted",
        department: "Registrar",
        description: "The selected term and units are recorded.",
      },
      {
        label: "Prerequisite validation",
        department: "Student Records",
        description: "Completed prerequisites and progression rules are checked.",
      },
      {
        label: "Academic adviser review",
        department: "Academic Department",
        description: "The selected units and credit load are reviewed.",
      },
      {
        label: "Finance clearance",
        department: "Finance",
        description: "Tuition status or an approved payment plan is confirmed.",
      },
      {
        label: "Registrar confirmation",
        department: "Registrar",
        description: "The approved registration is locked for the term.",
      },
      {
        label: "Registration slip issued",
        department: "Registrar",
        description: "The official unit-registration slip becomes available.",
      },
    ],
    finalOutputs: [
      "Approved unit registration",
      "Registration slip",
      "Rejected-unit explanation",
      "Finance action required notice",
    ],
    paymentStatus: "Within registration policy",
    serviceHref: "/demo/services/class-registration",
    applyHref: "/demo/apply/class-registration",
    trackHref: "/demo/track/CLASS-2026-0109",
  },
];

export const WORKFLOW_BY_SLUG = Object.fromEntries(
  SERVICE_WORKFLOWS.map((workflow) => [workflow.slug, workflow]),
) as Record<ServiceWorkflow["slug"], ServiceWorkflow>;

export const WORKFLOW_BY_CASE_ID = Object.fromEntries(
  SERVICE_WORKFLOWS.map((workflow) => [workflow.caseId, workflow]),
) as Record<string, ServiceWorkflow>;

export function getWorkflowBySlug(
  slug: ServiceWorkflow["slug"],
): ServiceWorkflow {
  return WORKFLOW_BY_SLUG[slug];
}

export function getWorkflowByCaseId(
  caseId: string,
): ServiceWorkflow | undefined {
  return WORKFLOW_BY_CASE_ID[caseId];
}
