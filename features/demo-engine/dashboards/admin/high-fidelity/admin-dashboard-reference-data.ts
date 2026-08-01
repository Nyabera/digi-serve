export type Tone = "blue" | "teal" | "green" | "orange" | "red" | "violet";

export type AdminDashboardReferenceData = typeof adminDashboardReferenceData;

export const adminDashboardReferenceData = {
  identity: {
    institution: "Savannah Technical College",
    dateRange: "May 1 – May 31, 2026",
    user: "Grace Wanjiku",
    role: "System Administrator",
  },
  executiveBrief:
    "Overall service performance is strong. Completion rate is above target at 87%, with average turnaround time of 2.8 days. Monitor overdue requests in Finance and Transport and address two SLA breaches in Student Affairs.",
  metrics: [
    { label: "Submitted", value: "1,248", delta: "12%", comparison: "vs Apr", direction: "up", tone: "blue" },
    { label: "Completed", value: "1,086", delta: "15%", comparison: "vs Apr", direction: "up", tone: "green" },
    { label: "Open", value: "162", delta: "5%", comparison: "vs Apr", direction: "down", tone: "orange" },
    { label: "Completion rate", value: "87%", delta: "6pp", comparison: "vs Apr", direction: "up", tone: "teal" },
    { label: "Avg turnaround", value: "2.8 days", delta: "0.4", comparison: "vs Apr", direction: "down-good", tone: "blue" },
    { label: "Overdue", value: "14", delta: "4", comparison: "vs Apr", direction: "down", tone: "red" },
  ],
  deliveryTrend: [
    { date: "May 1", submitted: 665, completed: 522, backlog: 148 },
    { date: "May 4", submitted: 612, completed: 548, backlog: 176 },
    { date: "May 8", submitted: 704, completed: 568, backlog: 224 },
    { date: "May 11", submitted: 642, completed: 506, backlog: 181 },
    { date: "May 15", submitted: 594, completed: 478, backlog: 136 },
    { date: "May 18", submitted: 651, completed: 532, backlog: 194 },
    { date: "May 22", submitted: 698, completed: 571, backlog: 228 },
    { date: "May 25", submitted: 616, completed: 526, backlog: 141 },
    { date: "May 29", submitted: 681, completed: 538, backlog: 145 },
    { date: "May 31", submitted: 486, completed: 714, backlog: 151 },
  ],
  alerts: [
    { title: "SLA breach: Transcript Request", meta: "Student Affairs  •  2 hours ago", priority: "High", tone: "red" },
    { title: "High overdue: 9 requests", meta: "Finance  •  4 hours ago", priority: "High", tone: "orange" },
    { title: "Payment exception detected", meta: "Bursary  •  6 hours ago", priority: "Medium", tone: "orange" },
    { title: "System maintenance scheduled", meta: "IT Services  •  May 10, 2026", priority: "Low", tone: "blue" },
  ],
  departments: [
    { rank: 1, name: "Student Affairs", submitted: 312, completed: 276, rate: 88, turnaround: "2.5 days", sla: 92, slaTone: "green" },
    { rank: 2, name: "Finance", submitted: 248, completed: 206, rate: 83, turnaround: "3.6 days", sla: 81, slaTone: "orange" },
    { rank: 3, name: "Academic Affairs", submitted: 224, completed: 195, rate: 87, turnaround: "2.7 days", sla: 90, slaTone: "green" },
    { rank: 4, name: "Registry", submitted: 198, completed: 174, rate: 88, turnaround: "2.3 days", sla: 94, slaTone: "green" },
    { rank: 5, name: "ICT Services", submitted: 156, completed: 141, rate: 90, turnaround: "2.1 days", sla: 95, slaTone: "green" },
    { rank: 6, name: "Transport", submitted: 110, completed: 94, rate: 85, turnaround: "3.1 days", sla: 83, slaTone: "orange" },
  ],
  statusBars: [
    { label: "Completed", value: 1086, percentage: 87, tone: "teal" },
    { label: "Open", value: 162, percentage: 13, tone: "blue" },
    { label: "Overdue", value: 14, percentage: 1, tone: "red" },
    { label: "On hold", value: 4, percentage: 0.4, tone: "blue" },
  ],
  serviceBars: [
    { label: "Transcript Request", count: 312, duration: "2.1 days", width: 100 },
    { label: "Certificate Request", count: 248, duration: "2.6 days", width: 80 },
    { label: "Payment Plan", count: 198, duration: "2.9 days", width: 67 },
    { label: "ID Replacement", count: 156, duration: "3.2 days", width: 52 },
    { label: "Hostel Allocation", count: 110, duration: "3.4 days", width: 37 },
  ],
  heatmap: [
    { department: "Student Affairs", values: [8, 32, 38, 22] },
    { department: "Finance", values: [10, 36, 34, 20] },
    { department: "Academic Affairs", values: [12, 40, 30, 18] },
    { department: "Registry", values: [15, 41, 27, 17] },
    { department: "ICT Services", values: [20, 45, 22, 13] },
    { department: "Transport", values: [18, 39, 26, 17] },
  ],
  bottlenecks: [
    { label: "Review & Verification", value: "2.1 days", width: 100, tone: "red" },
    { label: "Pending Approval", value: "1.4 days", width: 70, tone: "orange" },
    { label: "Finance Check", value: "1.1 days", width: 55, tone: "orange" },
    { label: "Document Generation", value: "0.6 days", width: 30, tone: "teal" },
    { label: "Final Dispatch", value: "0.3 days", width: 15, tone: "green" },
  ],
  approvals: [
    { type: "Approval", item: "Scholarship Waiver", from: "Student Affairs", raised: "1 hour ago", priority: "High", action: "Review" },
    { type: "Escalation", item: "Transcript Request ATR-8921", from: "Finance", raised: "4 hours ago", priority: "High", action: "Resolve" },
    { type: "Approval", item: "Budget Reallocation", from: "Academic Affairs", raised: "6 hours ago", priority: "Medium", action: "Review" },
    { type: "Escalation", item: "Payment Plan Review #PP-334", from: "Bursary", raised: "1 day ago", priority: "Medium", action: "Resolve" },
    { type: "Approval", item: "New Service Proposal", from: "ICT Services", raised: "2 days ago", priority: "Low", action: "Review" },
  ],
  payments: {
    metrics: [
      { label: "Expected", value: "KES 4.8M", delta: "8%", tone: "green" },
      { label: "Confirmed", value: "KES 4.3M", delta: "10%", tone: "green" },
      { label: "Exceptions", value: "23", delta: "6", tone: "red" },
    ],
    revenue: [
      { label: "Tuition Fees", value: "KES 2.4M", width: 100 },
      { label: "Application Fees", value: "KES 1.1M", width: 44 },
      { label: "Examination Fees", value: "KES 0.5M", width: 24 },
      { label: "Certificate Fees", value: "KES 0.2M", width: 14 },
      { label: "Other Fees", value: "KES 0.1M", width: 8 },
    ],
  },
  documents: {
    metrics: [
      { label: "Uploaded", value: "1,642", delta: "14%", tone: "green" },
      { label: "In Review", value: "312", delta: "3%", tone: "red" },
      { label: "Rejected", value: "46", delta: "12%", tone: "red" },
      { label: "Issued", value: "1,284", delta: "9%", tone: "green" },
    ],
    types: [
      { label: "Transcripts", value: 521, width: 100 },
      { label: "Certificates", value: 389, width: 75 },
      { label: "ID Cards", value: 214, width: 42 },
      { label: "Clearance Letter", value: 102, width: 20 },
      { label: "Others", value: 58, width: 12 },
    ],
  },
  verificationTrend: [
    { date: "May 1", value: 170 }, { date: "May 4", value: 255 }, { date: "May 7", value: 146 },
    { date: "May 10", value: 302 }, { date: "May 13", value: 186 }, { date: "May 16", value: 222 },
    { date: "May 19", value: 174 }, { date: "May 22", value: 129 }, { date: "May 25", value: 231 },
    { date: "May 28", value: 182 }, { date: "May 31", value: 239 }, { date: "Jun 2", value: 269 },
    { date: "Jun 5", value: 183 }, { date: "Jun 8", value: 142 },
  ],
  renewals: [
    { title: "Lab Equipment Calibration", date: "Jun 10, 2026", days: "18 days", tone: "orange" },
    { title: "System Maintenance Contract", date: "Jun 28, 2026", days: "36 days", tone: "orange" },
    { title: "ISO Certification Renewal", date: "Jul 15, 2026", days: "53 days", tone: "orange" },
    { title: "Insurance Policy Expiry", date: "Aug 2, 2026", days: "71 days", tone: "green" },
    { title: "Domain & SSL Renewal", date: "Aug 20, 2026", days: "89 days", tone: "green" },
  ],
  risks: [
    { label: "Data retention policy review due", priority: "High", date: "May 30" },
    { label: "Incomplete audit trail: Finance", priority: "Medium", date: "May 31" },
    { label: "Missing approvals: 5 requests", priority: "Medium", date: "May 31" },
    { label: "Policy acknowledgement overdue", priority: "Low", date: "Jun 2" },
  ],
  adoption: [
    { date: "May 1", users: 510 }, { date: "May 3", users: 430 }, { date: "May 5", users: 475 },
    { date: "May 7", users: 390 }, { date: "May 9", users: 492 }, { date: "May 11", users: 365 },
    { date: "May 13", users: 520 }, { date: "May 15", users: 448 }, { date: "May 17", users: 472 },
    { date: "May 19", users: 565 }, { date: "May 21", users: 447 }, { date: "May 23", users: 502 },
    { date: "May 25", users: 535 }, { date: "May 27", users: 570 }, { date: "May 29", users: 612 },
  ],
  leakage: [
    { label: "Email", value: 32, tone: "red" }, { label: "Walk-in", value: 28, tone: "orange" },
    { label: "Phone", value: 20, tone: "orange" }, { label: "WhatsApp", value: 12, tone: "teal" },
    { label: "Other", value: 8, tone: "blue" },
  ],
  recentActivity: [
    { action: "Bulk document upload completed", person: "Michael Otieno", when: "25 min ago" },
    { action: "Payment batch #PB-1039 posted", person: "Lucy Achieng", when: "1 hour ago" },
    { action: "SLA breach resolved: ATR-0011", person: "Daniel Otieno", when: "2 hours ago" },
    { action: "Workflow updated: Certificate Request", person: "Grace Wanjiku", when: "3 hours ago" },
  ],
  scheduledReports: [
    { name: "Weekly Performance Report", cadence: "Every Monday • 8:00 AM", next: "Next run: Jun 2, 2026" },
    { name: "SLA Compliance Report", cadence: "Every Monday • 9:00 AM", next: "Next run: Jun 2, 2026" },
    { name: "Financial Summary Report", cadence: "Every Friday • 5:00 PM", next: "Next run: May 30, 2026" },
    { name: "Audit Trail Report", cadence: "1st of Month • 9:00 AM", next: "Next run: Jun 1, 2026" },
    { name: "Executive Brief", cadence: "Daily • 7:30 AM", next: "Next run: May 28, 2026" },
  ],
} as const;

type UnknownRecord = Record<string, unknown>;

function asRecord(
  value: unknown,
): UnknownRecord | undefined {
  if (
    typeof value !== "object"
    || value === null
    || Array.isArray(value)
  ) {
    return undefined;
  }

  return value as UnknownRecord;
}

function readString(
  record: UnknownRecord | undefined,
  keys: readonly string[],
): string | undefined {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string"
      && value.trim().length > 0
    ) {
      return value;
    }
  }

  return undefined;
}

function readArray(
  record: UnknownRecord | undefined,
  keys: readonly string[],
): readonly unknown[] | undefined {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const value = record[key];

    if (
      Array.isArray(value)
      && value.length > 0
    ) {
      return value;
    }
  }

  return undefined;
}

function looksLikeReferenceData(
  value: unknown,
): value is AdminDashboardReferenceData {
  const record = asRecord(value);

  return Boolean(
    record
      && asRecord(record.identity)
      && readArray(record, ["metrics"])
      && readArray(record, ["deliveryTrend"])
      && readArray(record, ["departments"])
      && readArray(record, ["scheduledReports"]),
  );
}

/**
 * Converts the typed D31-5 Admin view model into the exact high-fidelity
 * reference shape. When the adapter already exposes the reference fields,
 * they are used directly. Otherwise the supplied runnable-bundle data remains
 * the visual fallback while institution identity and executive summary are
 * taken from the active Demo Pack when available.
 */
export function buildAdminDashboardReferenceData(
  source: unknown,
): AdminDashboardReferenceData {
  if (looksLikeReferenceData(source)) {
    return source;
  }

  const record = asRecord(source);
  const identity = asRecord(record?.identity);

  const institution =
    readString(
      identity,
      [
        "institution",
        "institutionName",
        "organizationName",
      ],
    )
    ?? readString(
      record,
      [
        "institution",
        "institutionName",
        "organizationName",
      ],
    )
    ?? adminDashboardReferenceData
      .identity.institution;

  const user =
    readString(
      identity,
      [
        "user",
        "userName",
        "displayName",
        "name",
      ],
    )
    ?? adminDashboardReferenceData.identity.user;

  const role =
    readString(
      identity,
      [
        "role",
        "roleLabel",
        "title",
      ],
    )
    ?? adminDashboardReferenceData.identity.role;

  const dateRange =
    readString(
      identity,
      [
        "dateRange",
        "dateLabel",
        "periodLabel",
      ],
    )
    ?? readString(
      record,
      [
        "dateRange",
        "dateLabel",
        "periodLabel",
      ],
    )
    ?? adminDashboardReferenceData
      .identity.dateRange;

  const executiveBrief =
    readString(
      record,
      [
        "executiveBrief",
        "summary",
        "brief",
      ],
    )
    ?? adminDashboardReferenceData
      .executiveBrief;

  return {
    ...adminDashboardReferenceData,
    identity: {
      institution,
      dateRange,
      user,
      role,
    },
    executiveBrief,
  } as unknown as AdminDashboardReferenceData;
}

