import type { DemoClientConfig } from "@/types/demo/client-config";

export const savannahTechnicalCollegeConfig = {
  schemaVersion: 1,

  organization: {
    id: "org-savannah-technical-college",
    slug: "savannah-technical-college",
    name: "Savannah Technical College",
    shortName: "Savannah",
    type: "Technical college",
    tagline: "Skills for work. Knowledge for life.",
    description:
      "A synthetic technical-college organization used to demonstrate formal service requests, departmental coordination, approvals and controlled outcomes.",
    location: "Nairobi, Kenya",
    contact: {
      email: "services@savannah.example",
      phone: "+254 700 000 000",
    },
  },

  branding: {
    logoMark: "STC",
    logoText: "Savannah Technical College",
    logoPath: "/demo/branding/savannah-technical-college.svg",
    primaryColor: "#173F5F",
    secondaryColor: "#20639B",
    accentColor: "#F6C85F",
    surfaceColor: "#F7F9FC",
  },

  homepage: {
    defaultVariant: "A",
    availableVariants: ["A", "B", "C"],
    showVariantSwitcher: true,
  },

  presentation: {
    defaultRole: "APPLICANT",
    showRoleSwitcher: true,
    showPresentationControls: true,
    allowReset: true,
  },

  departments: [
    {
      id: "student-records",
      name: "Student Records",
      shortName: "Records",
      description:
        "Receives transcript requests, reviews applicant information and coordinates the complete request.",
    },
    {
      id: "finance",
      name: "Finance",
      shortName: "Finance",
      description:
        "Confirms whether an institutional hold or payment-reference issue blocks processing.",
    },
    {
      id: "registrar",
      name: "Registrar",
      shortName: "Registrar",
      description:
        "Performs the final decision and authorizes the controlled institutional outcome.",
    },
  ],

  people: [
    {
      id: "person-applicant-amina",
      name: "Amina Hassan",
      role: "APPLICANT",
      jobTitle: "Former student",
      email: "amina.hassan@example.com",
      initials: "AH",
    },
    {
      id: "person-officer-peter",
      name: "Peter Mwangi",
      role: "OFFICER",
      jobTitle: "Student Records Officer",
      departmentId: "student-records",
      email: "peter.mwangi@savannah.example",
      initials: "PM",
    },
    {
      id: "person-officer-grace",
      name: "Grace Wanjiku",
      role: "OFFICER",
      jobTitle: "Finance Officer",
      departmentId: "finance",
      email: "grace.wanjiku@savannah.example",
      initials: "GW",
    },
    {
      id: "person-supervisor-njeri",
      name: "Dr. Njeri Kamau",
      role: "SUPERVISOR",
      jobTitle: "Registrar",
      departmentId: "registrar",
      email: "njeri.kamau@savannah.example",
      initials: "NK",
    },
    {
      id: "person-admin-daniel",
      name: "Daniel Otieno",
      role: "ORGANIZATION_ADMIN",
      jobTitle: "Systems Administrator",
      email: "daniel.otieno@savannah.example",
      initials: "DO",
    },
  ],

  services: [
    {
      id: "service-transcript-request",
      slug: "transcript-request",
      name: "Transcript Request",
      shortDescription:
        "Request an academic transcript or controlled transcript-related outcome.",
      description:
        "Submit your academic information and supporting documents. Student Records reviews the request, Finance confirms that no institutional hold blocks processing, and the Registrar authorizes the final outcome.",
      category: "Academic records",
      active: true,
      featured: true,
      expectedProcessingTime: "Up to 5 working days",
      eligibility: [
        "You are a current or former Savannah Technical College student.",
        "You can provide a valid admission or student number.",
        "The college can locate your academic record.",
        "You accept the applicant accuracy declaration.",
      ],
      requirements: [
        "Complete all required applicant and academic information.",
        "Provide a manual payment reference.",
        "Select controlled download or physical collection.",
        "Upload the required identity document.",
      ],
      fee: {
        type: "MANUAL_REFERENCE",
        label: "Manual payment reference required",
        amount: 500,
        currency: "KES",
      },
      form: {
        sections: [
          {
            id: "applicant-information",
            title: "Applicant information",
            description:
              "Provide the details used to identify and contact you.",
            fields: [
              {
                key: "fullName",
                label: "Full legal name",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "Enter your full legal name",
              },
              {
                key: "email",
                label: "Email address",
                type: "EMAIL",
                required: true,
                placeholder: "name@example.com",
              },
              {
                key: "phone",
                label: "Phone number",
                type: "PHONE",
                required: true,
                placeholder: "+254 7XX XXX XXX",
              },
              {
                key: "admissionNumber",
                label: "Admission or student number",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "For example, STC/2021/0042",
              },
              {
                key: "identityNumber",
                label: "National ID or passport number",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "Enter the document number",
              },
              {
                key: "formerName",
                label: "Former name",
                type: "SHORT_TEXT",
                required: false,
                helpText: "Complete this only where your records use another name.",
              },
            ],
          },
          {
            id: "academic-information",
            title: "Academic information",
            description:
              "Help Student Records locate the correct academic record.",
            fields: [
              {
                key: "programme",
                label: "Programme",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "For example, Diploma in ICT",
              },
              {
                key: "schoolDepartment",
                label: "School or department",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "Enter your academic department",
              },
              {
                key: "campus",
                label: "Campus",
                type: "SELECT",
                required: true,
                options: [
                  { label: "Main Campus", value: "main-campus" },
                  { label: "Westlands Campus", value: "westlands-campus" },
                  { label: "Thika Campus", value: "thika-campus" },
                ],
              },
              {
                key: "yearOfAdmission",
                label: "Year of admission",
                type: "YEAR",
                required: true,
                placeholder: "2021",
              },
              {
                key: "yearOfCompletion",
                label: "Year of completion or graduation",
                type: "YEAR",
                required: true,
                placeholder: "2024",
              },
              {
                key: "studyMode",
                label: "Study mode",
                type: "SELECT",
                required: true,
                options: [
                  { label: "Full time", value: "full-time" },
                  { label: "Part time", value: "part-time" },
                  { label: "Evening", value: "evening" },
                ],
              },
            ],
          },
          {
            id: "request-information",
            title: "Request information",
            description:
              "Tell the institution why the transcript is required and how the outcome should be handled.",
            fields: [
              {
                key: "purpose",
                label: "Transcript purpose",
                type: "SELECT",
                required: true,
                options: [
                  { label: "Employment", value: "employment" },
                  { label: "Further study", value: "further-study" },
                  { label: "Professional registration", value: "registration" },
                  { label: "Personal records", value: "personal-records" },
                ],
              },
              {
                key: "deliveryMethod",
                label: "Delivery method",
                type: "SELECT",
                required: true,
                options: [
                  {
                    label: "Controlled digital download",
                    value: "controlled-download",
                  },
                  {
                    label: "Physical collection",
                    value: "physical-collection",
                  },
                ],
              },
              {
                key: "recipientDetails",
                label: "Recipient details",
                type: "TEXTAREA",
                required: false,
                placeholder:
                  "Add an institution or recipient where applicable",
              },
              {
                key: "paymentReference",
                label: "Manual payment reference",
                type: "SHORT_TEXT",
                required: true,
                placeholder: "For example, MPESA-ABC123",
              },
              {
                key: "additionalNotes",
                label: "Additional notes",
                type: "TEXTAREA",
                required: false,
                placeholder: "Add relevant information for Student Records",
              },
              {
                key: "accuracyDeclaration",
                label:
                  "I confirm that the information supplied is accurate.",
                type: "DECLARATION",
                required: true,
                defaultValue: false,
              },
            ],
          },
        ],
      },
      requiredDocuments: [
        {
          id: "document-national-id",
          name: "National ID or passport",
          description:
            "A clear copy of the identity document used in the application.",
          level: "REQUIRED",
          acceptedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
          maximumSizeMb: 5,
          replacementAllowed: true,
        },
        {
          id: "document-student-id",
          name: "Student ID or institutional identifier",
          description:
            "Provide this where it remains available to help locate the record.",
          level: "CONDITIONAL",
          acceptedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
          maximumSizeMb: 5,
          replacementAllowed: true,
        },
        {
          id: "document-name-change",
          name: "Name-change evidence",
          description:
            "Required only where your current name differs from the academic record.",
          level: "CONDITIONAL",
          acceptedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
          maximumSizeMb: 5,
          replacementAllowed: true,
        },
      ],
      workflowId: "workflow-transcript-request",
      outcomeLabel: "Transcript Request Completion Notice",
    },

    {
      id: "service-student-clearance",
      slug: "student-clearance",
      name: "Student Clearance Request",
      shortDescription:
        "Request confirmation that required institutional clearances are complete.",
      description:
        "Submit a clearance request for coordinated review by the relevant institutional departments.",
      category: "Student services",
      active: true,
      featured: true,
      expectedProcessingTime: "Up to 3 working days",
      eligibility: [
        "You are a current or former Savannah Technical College student.",
        "You can provide a valid admission or student number.",
      ],
      requirements: [
        "Complete your student details.",
        "State the reason for the clearance request.",
      ],
      fee: {
        type: "FREE",
        label: "No service fee",
      },
      form: {
        sections: [
          {
            id: "clearance-request",
            title: "Clearance request",
            fields: [
              {
                key: "fullName",
                label: "Full legal name",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "admissionNumber",
                label: "Admission or student number",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "clearancePurpose",
                label: "Reason for clearance",
                type: "TEXTAREA",
                required: true,
              },
              {
                key: "accuracyDeclaration",
                label:
                  "I confirm that the information supplied is accurate.",
                type: "DECLARATION",
                required: true,
              },
            ],
          },
        ],
      },
      requiredDocuments: [],
      workflowId: "workflow-student-clearance",
      outcomeLabel: "Student Clearance Notice",
    },

    {
      id: "service-certificate-replacement",
      slug: "certificate-replacement",
      name: "Certificate Replacement Request",
      shortDescription:
        "Request review and replacement of a lost or damaged certificate.",
      description:
        "Provide the relevant academic and identification details so the institution can assess a replacement request.",
      category: "Academic records",
      active: true,
      featured: false,
      expectedProcessingTime: "Up to 10 working days",
      eligibility: [
        "The original certificate was issued by Savannah Technical College.",
        "You can provide sufficient information to locate the award record.",
      ],
      requirements: [
        "Explain why the replacement is required.",
        "Provide an identity document.",
      ],
      fee: {
        type: "MANUAL_REFERENCE",
        label: "Manual payment reference required",
        amount: 1000,
        currency: "KES",
      },
      form: {
        sections: [
          {
            id: "replacement-request",
            title: "Certificate replacement request",
            fields: [
              {
                key: "fullName",
                label: "Full legal name",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "admissionNumber",
                label: "Admission or student number",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "awardName",
                label: "Award or programme",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "replacementReason",
                label: "Reason for replacement",
                type: "TEXTAREA",
                required: true,
              },
              {
                key: "paymentReference",
                label: "Manual payment reference",
                type: "SHORT_TEXT",
                required: true,
              },
              {
                key: "accuracyDeclaration",
                label:
                  "I confirm that the information supplied is accurate.",
                type: "DECLARATION",
                required: true,
              },
            ],
          },
        ],
      },
      requiredDocuments: [
        {
          id: "replacement-identity",
          name: "National ID or passport",
          description:
            "A clear copy of the applicant identity document.",
          level: "REQUIRED",
          acceptedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
          maximumSizeMb: 5,
          replacementAllowed: true,
        },
      ],
      workflowId: "workflow-certificate-replacement",
      outcomeLabel: "Certificate Replacement Decision Notice",
    },
  ],

  workflows: [
    {
      id: "workflow-transcript-request",
      serviceId: "service-transcript-request",
      name: "Transcript Request Workflow",
      version: 1,
      steps: [
        {
          id: "transcript-submission",
          order: 1,
          label: "Application submitted",
          description:
            "The applicant submits the form and required supporting documents.",
          type: "APPLICANT_ACTION",
          role: "APPLICANT",
          internalStatus: "SUBMITTED",
          publicStatus: "Submitted",
        },
        {
          id: "transcript-records-review",
          order: 2,
          label: "Student Records review",
          description:
            "Student Records verifies identity, academic details and document completeness.",
          type: "OFFICER_REVIEW",
          role: "OFFICER",
          departmentId: "student-records",
          internalStatus: "RECORDS_REVIEW_IN_PROGRESS",
          publicStatus: "In Review",
          targetHours: 8,
        },
        {
          id: "transcript-correction",
          order: 3,
          label: "Applicant correction",
          description:
            "The applicant corrects information or replaces a rejected document where required.",
          type: "CORRECTION",
          role: "APPLICANT",
          internalStatus: "WAITING_ON_APPLICANT",
          publicStatus: "Action Required",
        },
        {
          id: "transcript-finance-referral",
          order: 4,
          label: "Finance verification",
          description:
            "Finance confirms whether an institutional hold or payment issue blocks processing.",
          type: "REFERRAL",
          role: "OFFICER",
          departmentId: "finance",
          internalStatus: "FINANCE_REFERRAL_IN_PROGRESS",
          publicStatus: "Additional Checks in Progress",
          targetHours: 8,
        },
        {
          id: "transcript-records-completion",
          order: 5,
          label: "Records review completed",
          description:
            "Student Records confirms that required review work is complete.",
          type: "OFFICER_COMPLETION",
          role: "OFFICER",
          departmentId: "student-records",
          internalStatus: "RECORDS_REVIEW_COMPLETED",
          publicStatus: "Awaiting Decision",
          targetHours: 4,
        },
        {
          id: "transcript-registrar-approval",
          order: 6,
          label: "Registrar decision",
          description:
            "The Registrar approves, rejects or returns the request for clarification.",
          type: "APPROVAL",
          role: "SUPERVISOR",
          departmentId: "registrar",
          internalStatus: "REGISTRAR_APPROVAL_PENDING",
          publicStatus: "Awaiting Decision",
          targetHours: 8,
        },
        {
          id: "transcript-outcome",
          order: 7,
          label: "Controlled outcome prepared",
          description:
            "The approved completion, collection or dispatch outcome is prepared.",
          type: "OUTCOME",
          role: "OFFICER",
          departmentId: "student-records",
          internalStatus: "OUTCOME_PREPARATION",
          publicStatus: "Preparing Outcome",
          targetHours: 4,
        },
        {
          id: "transcript-completion",
          order: 8,
          label: "Request completed",
          description:
            "The outcome becomes available through the configured controlled method.",
          type: "COMPLETION",
          role: "APPLICANT",
          internalStatus: "COMPLETED",
          publicStatus: "Completed",
        },
      ],
    },

    {
      id: "workflow-student-clearance",
      serviceId: "service-student-clearance",
      name: "Student Clearance Workflow",
      version: 1,
      steps: [
        {
          id: "clearance-submission",
          order: 1,
          label: "Application submitted",
          description: "The applicant submits the clearance request.",
          type: "APPLICANT_ACTION",
          role: "APPLICANT",
          internalStatus: "SUBMITTED",
          publicStatus: "Submitted",
        },
        {
          id: "clearance-review",
          order: 2,
          label: "Clearance review",
          description:
            "Student Records coordinates the institutional clearance review.",
          type: "OFFICER_REVIEW",
          role: "OFFICER",
          departmentId: "student-records",
          internalStatus: "CLEARANCE_REVIEW_IN_PROGRESS",
          publicStatus: "In Review",
          targetHours: 16,
        },
        {
          id: "clearance-approval",
          order: 3,
          label: "Clearance decision",
          description: "The authorized supervisor confirms the result.",
          type: "APPROVAL",
          role: "SUPERVISOR",
          departmentId: "registrar",
          internalStatus: "CLEARANCE_APPROVAL_PENDING",
          publicStatus: "Awaiting Decision",
          targetHours: 8,
        },
        {
          id: "clearance-completion",
          order: 4,
          label: "Clearance completed",
          description: "The clearance outcome is made available.",
          type: "COMPLETION",
          role: "APPLICANT",
          internalStatus: "COMPLETED",
          publicStatus: "Completed",
        },
      ],
    },

    {
      id: "workflow-certificate-replacement",
      serviceId: "service-certificate-replacement",
      name: "Certificate Replacement Workflow",
      version: 1,
      steps: [
        {
          id: "replacement-submission",
          order: 1,
          label: "Application submitted",
          description: "The applicant submits the replacement request.",
          type: "APPLICANT_ACTION",
          role: "APPLICANT",
          internalStatus: "SUBMITTED",
          publicStatus: "Submitted",
        },
        {
          id: "replacement-records-review",
          order: 2,
          label: "Award record review",
          description:
            "Student Records verifies the original award and supporting information.",
          type: "OFFICER_REVIEW",
          role: "OFFICER",
          departmentId: "student-records",
          internalStatus: "REPLACEMENT_REVIEW_IN_PROGRESS",
          publicStatus: "In Review",
          targetHours: 24,
        },
        {
          id: "replacement-approval",
          order: 3,
          label: "Replacement decision",
          description:
            "The Registrar approves or rejects the certificate replacement.",
          type: "APPROVAL",
          role: "SUPERVISOR",
          departmentId: "registrar",
          internalStatus: "REPLACEMENT_APPROVAL_PENDING",
          publicStatus: "Awaiting Decision",
          targetHours: 16,
        },
        {
          id: "replacement-completion",
          order: 4,
          label: "Replacement outcome",
          description: "The replacement decision outcome is made available.",
          type: "COMPLETION",
          role: "APPLICANT",
          internalStatus: "COMPLETED",
          publicStatus: "Completed",
        },
      ],
    },
  ],

  reports: [
    {
      id: "report-requests-by-service",
      title: "Requests by service",
      description:
        "Synthetic request volume across the configured service catalogue.",
      chartType: "BAR",
      data: [
        { label: "Transcript", value: 84 },
        { label: "Clearance", value: 52 },
        { label: "Replacement", value: 21 },
      ],
    },
    {
      id: "report-monthly-volume",
      title: "Monthly request volume",
      description:
        "Synthetic request intake and completion figures for the last six months.",
      chartType: "LINE",
      data: [
        { label: "Jan", value: 18, secondaryValue: 14 },
        { label: "Feb", value: 24, secondaryValue: 20 },
        { label: "Mar", value: 29, secondaryValue: 25 },
        { label: "Apr", value: 31, secondaryValue: 27 },
        { label: "May", value: 37, secondaryValue: 32 },
        { label: "Jun", value: 42, secondaryValue: 36 },
      ],
    },
    {
      id: "report-request-status",
      title: "Current request status",
      description:
        "Synthetic distribution of active and completed demonstration requests.",
      chartType: "DONUT",
      data: [
        { label: "In review", value: 28 },
        { label: "Additional checks", value: 17 },
        { label: "Awaiting decision", value: 11 },
        { label: "Completed", value: 44 },
      ],
    },
  ],
} satisfies DemoClientConfig;
