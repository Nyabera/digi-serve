import type {
  DepartmentCompletedHandoffModel,
  DepartmentHandoffRowModel,
  DepartmentInboxModel,
} from "@/features/department-handoffs/model/department-handoff-model";

const timeline = [
  {
    id: "timeline-created",
    title: "Referral created",
    detail: "Student Records sent a structured Finance verification request.",
    occurredAt: "2026-05-12T09:42:00+03:00",
    timestampLabel: "May 12, 2026 · 9:42 AM",
    tone: "blue",
  },
  {
    id: "timeline-received",
    title: "Received by Finance",
    detail: "The work item entered the Finance handoff inbox.",
    occurredAt: "2026-05-12T09:44:00+03:00",
    timestampLabel: "May 12, 2026 · 9:44 AM",
    tone: "orange",
  },
] as const;

const baseRows = [
  ["HND-DEMO-001", "REQ-DEMO-001", "Transcript Request", "Grace Wanjiku", "Student Records", "Grace Wanjiku", "Verify the submitted manual payment reference and confirm whether the student account is clear.", "Finance verification is required before the transcript request can proceed to final review.", "Return one structured result: CLEAR, HOLD or CANNOT_VERIFY.", "May 12, 2026 · 9:42 AM", "May 13, 2026", "Today", "Amina Hassan", "AH", "PENDING_ACCEPTANCE", "Pending acceptance", "orange"],
  ["HND-DEMO-002", "REQ-DEMO-002", "Financial Aid Appeal", "Brian Otieno", "Financial Aid Office", "Mercy Akinyi", "Review the applicant’s financial circumstances and confirm the account position.", "Specialist Finance input is required before the appeal can proceed.", "Return CLEAR, HOLD or CANNOT_VERIFY with a concise Finance note.", "May 12, 2026 · 9:15 AM", "May 13, 2026", "Today", "Marcus Lee", "ML", "PENDING_ACCEPTANCE", "Pending acceptance", "orange"],
  ["HND-DEMO-003", "REQ-DEMO-003", "Emergency Grant", "Kevin Mwangi", "Student Affairs", "Jane Otieno", "Confirm the applicant account balance and determine the current financial impact.", "The grant review depends on an accurate account position.", "Return a Finance account-position result.", "May 11, 2026 · 4:20 PM", "May 14, 2026", "1 day left", "Amina Hassan", "AH", "IN_PROGRESS", "In progress", "green"],
  ["HND-DEMO-004", "REQ-DEMO-004", "Enrollment Verification", "Linda Njeri", "Admissions Office", "Brian Otieno", "Confirm the current Finance snapshot associated with the enrollment record.", "Admissions requires a Finance snapshot before confirming enrollment.", "Return the account status and any active Finance hold.", "May 11, 2026 · 2:10 PM", "May 15, 2026", "2 days left", "Marcus Lee", "ML", "RETURNED_FOR_CLARIFICATION", "Returned", "purple"],
  ["HND-DEMO-005", "REQ-DEMO-005", "Payment Plan Adjustment", "Daniel Kiptoo", "Bursar Office", "Priya Patel", "Review and confirm whether the proposed payment-plan adjustment can proceed.", "A Finance decision is needed before the applicant can receive revised terms.", "Return the adjustment eligibility result.", "May 10, 2026 · 11:32 AM", "May 16, 2026", "3 days left", "Priya Patel", "PP", "PENDING_ACCEPTANCE", "Pending acceptance", "orange"],
  ["HND-DEMO-006", "REQ-DEMO-006", "Academic Progress Appeal", "Faith Njeri", "Student Success", "Sammy K.", "Review the supporting Finance documentation attached to the appeal.", "The appeal requires confirmation of the payment and sponsorship position.", "Return a clear Finance recommendation.", "May 10, 2026 · 10:18 AM", "May 16, 2026", "3 days left", "Amina Hassan", "AH", "IN_PROGRESS", "In progress", "green"],
  ["HND-DEMO-007", "REQ-DEMO-007", "I-20 Financial Certification", "Mary Achieng", "International Office", "James Wong", "Confirm the available funding documentation and account position.", "International documentation requires a Finance confirmation.", "Return the funding-verification result.", "May 9, 2026 · 2:40 PM", "May 18, 2026", "5 days left", "Marcus Lee", "ML", "PENDING_ACCEPTANCE", "Pending acceptance", "orange"],
  ["HND-DEMO-008", "REQ-DEMO-008", "Refund Authorization", "Collins Mutua", "Housing Office", "Fatima Ali", "Approve or clarify the Finance position for the requested housing refund.", "Housing cannot finalize the refund without Finance verification.", "Return an authorization or a clear hold reason.", "May 9, 2026 · 1:12 PM", "May 18, 2026", "5 days left", "Priya Patel", "PP", "RETURNED_FOR_CLARIFICATION", "Returned", "purple"],
] as const;

const rows = baseRows.map((row, index) => ({
  id: row[0],
  requestId: row[1],
  requestTitle: row[2],
  applicantName: row[3],
  fromDepartment: row[4],
  fromOfficer: row[5],
  requestedAction: row[6],
  reason: row[7],
  expectedOutput: row[8],
  receivedLabel: row[9],
  dueDateLabel: row[10],
  dueStateLabel: row[11],
  assignedOfficer: row[12],
  assignedOfficerInitials: row[13],
  status: row[14],
  statusLabel: row[15],
  statusTone: row[16],
  href: `/demo/department/handoffs/${row[0]}`,
  documents:
    index === 0
      ? [{ id: "DOC-DEMO-001", name: "Transcript Request Notes.pdf", summary: "PDF · 128 KB" }]
      : [],
  timeline,
})) satisfies readonly DepartmentHandoffRowModel[];

const completed = [
  { id: "HND-COMPLETE-001", departmentName: "Student Accounts", requestTitle: "Refund Authorization", completedLabel: "May 12, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-008" },
  { id: "HND-COMPLETE-002", departmentName: "Financial Aid Office", requestTitle: "Pell Grant Adjustment", completedLabel: "May 12, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-002" },
  { id: "HND-COMPLETE-003", departmentName: "Admissions Office", requestTitle: "Enrollment Verification", completedLabel: "May 11, 2026", resultLabel: "Completed", href: "/demo/department/handoffs/HND-DEMO-004" },
] satisfies readonly DepartmentCompletedHandoffModel[];

export const departmentHandoffsReference = Object.freeze({
  title: "Handoff Inbox",
  subtitle: "Review and act on handoffs from other departments.",
  departmentName: "Finance",
  metrics: [
    { id: "pending", label: "Pending Acceptance", value: 8, tone: "orange", icon: "inbox", actionLabel: "View all" },
    { id: "progress", label: "In Progress", value: 5, tone: "green", icon: "progress", actionLabel: "View all" },
    { id: "returned", label: "Returned for Clarification", value: 3, tone: "purple", icon: "clarification", actionLabel: "View all" },
    { id: "due", label: "Due Today", value: 4, tone: "red", icon: "calendar", actionLabel: "View all" },
  ],
  rows,
  completed,
} satisfies DepartmentInboxModel);
