export type OfficerTaskStatus =
  | "On track"
  | "Due soon"
  | "Overdue"
  | "Waiting";

export type OfficerTaskGroup = "Today" | "Tomorrow" | "Later";

export type OfficerTask = {
  id: string;
  applicant: string;
  applicantReference: string;
  service: string;
  due: string;
  status: OfficerTaskStatus;
  group: OfficerTaskGroup;
  step: string;
  appliedOn: string;
  email: string;
  phone: string;
};

export const OFFICER_TASKS: OfficerTask[] = [
  {
    id: "REQ-2026-0715",
    applicant: "Brian Otieno",
    applicantReference: "STC/DEE/2023/041",
    service: "Transcript Request",
    due: "Today, 10:30 AM",
    status: "On track",
    group: "Today",
    step: "Document review",
    appliedOn: "24 Jul 2026",
    email: "brian.otieno@example.com",
    phone: "+254 712 345 678",
  },
  {
    id: "REQ-2026-0718",
    applicant: "Mercy Akinyi",
    applicantReference: "STC/DBA/2022/188",
    service: "Certificate Replacement",
    due: "Today, 11:45 AM",
    status: "Due soon",
    group: "Today",
    step: "Records verification",
    appliedOn: "24 Jul 2026",
    email: "mercy.akinyi@example.com",
    phone: "+254 721 405 817",
  },
  {
    id: "REQ-2026-0722",
    applicant: "Kevin Mwangi",
    applicantReference: "STC/ICT/2024/223",
    service: "Student Clearance",
    due: "Today, 2:00 PM",
    status: "Due soon",
    group: "Today",
    step: "Finance clearance",
    appliedOn: "25 Jul 2026",
    email: "kevin.mwangi@example.com",
    phone: "+254 733 201 144",
  },
  {
    id: "REQ-2026-0726",
    applicant: "Linda Njeri",
    applicantReference: "STC/ELC/2021/241",
    service: "Course Application",
    due: "Today, 4:30 PM",
    status: "On track",
    group: "Today",
    step: "Eligibility review",
    appliedOn: "25 Jul 2026",
    email: "linda.njeri@example.com",
    phone: "+254 711 090 240",
  },
  {
    id: "REQ-2026-0728",
    applicant: "Daniel Kiptoo",
    applicantReference: "STC/MEC/2023/199",
    service: "Class Registration",
    due: "Tomorrow, 9:30 AM",
    status: "On track",
    group: "Tomorrow",
    step: "Unit approval",
    appliedOn: "25 Jul 2026",
    email: "daniel.kiptoo@example.com",
    phone: "+254 720 881 006",
  },
  {
    id: "REQ-2026-0731",
    applicant: "Amina Hassan",
    applicantReference: "STC/BIT/2024/042",
    service: "Industrial Attachment Letter",
    due: "Tomorrow, 11:00 AM",
    status: "Due soon",
    group: "Tomorrow",
    step: "Department confirmation",
    appliedOn: "26 Jul 2026",
    email: "amina.hassan@example.com",
    phone: "+254 714 224 980",
  },
  {
    id: "REQ-2026-0703",
    applicant: "Priya Mehta",
    applicantReference: "STC/ARC/2022/087",
    service: "Certificate Replacement",
    due: "Overdue by 2h 15m",
    status: "Overdue",
    group: "Later",
    step: "Registrar approval",
    appliedOn: "21 Jul 2026",
    email: "priya.mehta@example.com",
    phone: "+254 700 240 311",
  },
  {
    id: "REQ-2026-0698",
    applicant: "Rahul Verma",
    applicantReference: "STC/CIV/2023/089",
    service: "Transcript Request",
    due: "Waiting since yesterday",
    status: "Waiting",
    group: "Later",
    step: "Applicant correction",
    appliedOn: "20 Jul 2026",
    email: "rahul.verma@example.com",
    phone: "+254 735 100 982",
  },
  {
    id: "REQ-2026-0689",
    applicant: "Sheila Iyer",
    applicantReference: "STC/HOS/2022/080",
    service: "Student Clearance",
    due: "Overdue by 56m",
    status: "Overdue",
    group: "Later",
    step: "Library clearance",
    appliedOn: "20 Jul 2026",
    email: "sheila.iyer@example.com",
    phone: "+254 706 091 725",
  },
];

export type AuditEventCategory =
  | "Comments"
  | "Status changes"
  | "Document actions"
  | "Verification events";

export type AuditEvent = {
  id: string;
  category: AuditEventCategory;
  title: string;
  actor: string;
  role: string;
  department: string;
  source: string;
  time: string;
  description: string;
  before: string;
  after: string;
  attachments: string[];
  ipAddress: string;
  userAgent: string;
};

export const AUDIT_EVENTS: AuditEvent[] = [
  {
    id: "EVT-2026-07-24-0001",
    category: "Status changes",
    title: "Submission received",
    actor: "Brian Otieno",
    role: "Applicant",
    department: "Applicant",
    source: "Web portal",
    time: "24 Jul 2026 · 10:02 AM",
    description: "The transcript request was submitted successfully.",
    before: "Draft",
    after: "Submitted",
    attachments: ["National_ID.pdf", "Payment_receipt.pdf"],
    ipAddress: "10.3.24.18",
    userAgent: "Chrome 150 · macOS",
  },
  {
    id: "EVT-2026-07-24-0002",
    category: "Document actions",
    title: "Documents uploaded",
    actor: "Brian Otieno",
    role: "Applicant",
    department: "Applicant",
    source: "Web portal",
    time: "24 Jul 2026 · 10:05 AM",
    description: "Two required documents were attached to the request.",
    before: "0 documents",
    after: "2 documents",
    attachments: ["National_ID.pdf", "Payment_receipt.pdf"],
    ipAddress: "10.3.24.18",
    userAgent: "Chrome 150 · macOS",
  },
  {
    id: "EVT-2026-07-24-0003",
    category: "Verification events",
    title: "Payment verified",
    actor: "Mercy Wanjiku",
    role: "Finance Officer",
    department: "Finance",
    source: "Staff workspace",
    time: "24 Jul 2026 · 10:07 AM",
    description: "Manual payment reference MP-48291 was verified for KES 1,500.",
    before: "Pending",
    after: "Verified",
    attachments: ["Payment_receipt.pdf"],
    ipAddress: "10.3.24.44",
    userAgent: "Edge 150 · Windows 11",
  },
  {
    id: "EVT-2026-07-24-0004",
    category: "Comments",
    title: "Officer note added",
    actor: "Kevin Mwangi",
    role: "Registry Officer",
    department: "Student Records",
    source: "Staff workspace",
    time: "24 Jul 2026 · 10:15 AM",
    description: "Identity and application form were verified. The archived marksheet still requires review.",
    before: "No internal note",
    after: "Internal note added",
    attachments: [],
    ipAddress: "10.3.24.56",
    userAgent: "Chrome 150 · Windows 11",
  },
  {
    id: "EVT-2026-07-25-0005",
    category: "Status changes",
    title: "Workflow referred",
    actor: "Kevin Mwangi",
    role: "Registry Officer",
    department: "Student Records",
    source: "Staff workspace",
    time: "25 Jul 2026 · 9:30 AM",
    description: "Finance was asked to confirm the payment reference and student-account status.",
    before: "Records review",
    after: "Finance verification",
    attachments: ["Payment_receipt.pdf"],
    ipAddress: "10.3.24.56",
    userAgent: "Chrome 150 · Windows 11",
  },
  {
    id: "EVT-2026-07-25-0006",
    category: "Status changes",
    title: "Registrar approval requested",
    actor: "Kevin Mwangi",
    role: "Registry Officer",
    department: "Student Records",
    source: "Staff workspace",
    time: "25 Jul 2026 · 11:20 AM",
    description: "The completed records review was forwarded for Registrar approval.",
    before: "Finance verified",
    after: "Approval pending",
    attachments: [],
    ipAddress: "10.3.24.56",
    userAgent: "Chrome 150 · Windows 11",
  },
  {
    id: "EVT-2026-07-26-0007",
    category: "Status changes",
    title: "Returned for correction",
    actor: "Dr. Miriam Wekesa",
    role: "Registrar Supervisor",
    department: "Registrar",
    source: "Supervisor workspace",
    time: "26 Jul 2026 · 2:45 PM",
    description: "A document mismatch requires the applicant to upload a clearer archived marksheet.",
    before: "Approval pending",
    after: "Applicant action required",
    attachments: ["Archived_marksheet.pdf"],
    ipAddress: "10.3.24.67",
    userAgent: "Safari 20 · macOS",
  },
  {
    id: "EVT-2026-07-26-0008",
    category: "Document actions",
    title: "Applicant correction received",
    actor: "Brian Otieno",
    role: "Applicant",
    department: "Applicant",
    source: "Web portal",
    time: "26 Jul 2026 · 3:30 PM",
    description: "The applicant uploaded a corrected copy of the archived marksheet.",
    before: "Correction requested",
    after: "Correction submitted",
    attachments: ["Corrected_marksheet.pdf"],
    ipAddress: "10.3.24.18",
    userAgent: "Chrome 150 · macOS",
  },
];

export const OFFICER_SLA_SERIES = {
  "7 Days": [88, 91, 89, 93, 94, 92, 95],
  "1 Month": [76, 89, 81, 90, 96, 86, 90, 97, 98, 87, 91, 95, 99, 83],
  "3 Months": [72, 77, 80, 85, 82, 88, 90, 86, 92, 94, 91, 96],
  "6 Months": [68, 74, 79, 83, 87, 90, 92, 91, 94, 96, 93, 92],
} satisfies Record<string, number[]>;

export type DepartmentSlaRow = {
  department: string;
  assigned: number;
  onTrack: number;
  dueSoon: number;
  overdue: number;
  compliance: number;
};

export const DEPARTMENT_SLA_ROWS: DepartmentSlaRow[] = [
  {
    department: "Student Records",
    assigned: 82,
    onTrack: 72,
    dueSoon: 7,
    overdue: 3,
    compliance: 92,
  },
  {
    department: "Finance",
    assigned: 64,
    onTrack: 51,
    dueSoon: 8,
    overdue: 5,
    compliance: 84,
  },
  {
    department: "Registrar",
    assigned: 48,
    onTrack: 42,
    dueSoon: 4,
    overdue: 2,
    compliance: 89,
  },
  {
    department: "Academic Departments",
    assigned: 80,
    onTrack: 67,
    dueSoon: 9,
    overdue: 4,
    compliance: 87,
  },
];

export const SUPERVISOR_SLA_SERIES = {
  "7 Days": [84, 86, 85, 89, 87, 90, 88],
  "1 Month": [82, 84, 86, 85, 87, 89, 88, 90, 91, 87, 88, 90],
  "3 Months": [78, 80, 82, 83, 85, 84, 86, 88, 87, 89, 90, 88],
  "6 Months": [74, 76, 79, 81, 82, 84, 83, 85, 87, 88, 90, 88],
} satisfies Record<string, number[]>;
