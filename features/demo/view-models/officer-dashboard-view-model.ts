export type OfficerQueuePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type OfficerStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export type OfficerQueueRow = {
  readonly id: string;
  readonly applicantName: string;
  readonly serviceName: string;
  readonly status: string;
  readonly statusTone: OfficerStatusTone;
  readonly departmentName: string;
  readonly submittedLabel: string;
  readonly dueLabel: string;
  readonly priority: OfficerQueuePriority;
  readonly href: string;
};

export type OfficerHandoffSummary = {
  readonly id: string;
  readonly requestId: string;
  readonly departmentName: string;
  readonly requestedAction: string;
  readonly status: string;
  readonly statusTone: OfficerStatusTone;
  readonly href: string;
};

export type OfficerMessageSummary = {
  readonly id: string;
  readonly senderName: string;
  readonly senderRole: string;
  readonly subject: string;
  readonly message: string;
  readonly timestamp: string;
  readonly href: string;
  readonly unread: boolean;
};

export type OfficerDeadlineSummary = {
  readonly id: string;
  readonly day: string;
  readonly month: string;
  readonly title: string;
  readonly reference: string;
  readonly dueLabel: string;
  readonly priority: OfficerQueuePriority;
  readonly href: string;
};

export type OfficerDashboardViewModel = {
  readonly queue: readonly OfficerQueueRow[];
  readonly handoffs: readonly OfficerHandoffSummary[];
  readonly messages: readonly OfficerMessageSummary[];
  readonly deadlines: readonly OfficerDeadlineSummary[];
  readonly metrics: {
    readonly assignedToMe: number;
    readonly dueToday: number;
    readonly overdue: number;
    readonly waitingOnApplicant: number;
    readonly waitingOnDepartment: number;
    readonly completedToday: number;
  };
};

type ServiceOption = { readonly id: string; readonly slug: string; readonly name: string };
type DepartmentOption = { readonly id: string; readonly name: string };
type UnknownRecord = Record<string, unknown>;

const fallbackQueue: readonly OfficerQueueRow[] = [
  { id: "REQ-DEMO-001", applicantName: "Grace Wanjiku", serviceName: "Transcript Request", status: "Submitted", statusTone: "info", departmentName: "Student Records", submittedLabel: "Today, 10:24", dueLabel: "Due today", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-001" },
  { id: "REQ-DEMO-002", applicantName: "Brian Otieno", serviceName: "Student Clearance", status: "Under review", statusTone: "info", departmentName: "Student Records", submittedLabel: "Yesterday, 15:42", dueLabel: "Due tomorrow", priority: "MEDIUM", href: "/demo/officer/requests/REQ-DEMO-002" },
  { id: "REQ-DEMO-003", applicantName: "Amina Hassan", serviceName: "Certificate Replacement", status: "Waiting on department", statusTone: "warning", departmentName: "Finance", submittedLabel: "Yesterday, 09:18", dueLabel: "2 days remaining", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-003" },
  { id: "REQ-DEMO-004", applicantName: "Daniel Kamau", serviceName: "Transcript Request", status: "Completed", statusTone: "success", departmentName: "Student Records", submittedLabel: "18 Jul, 14:06", dueLabel: "Completed today", priority: "LOW", href: "/demo/officer/requests/REQ-DEMO-004" },
  { id: "REQ-DEMO-005", applicantName: "Mercy Njeri", serviceName: "Student Clearance", status: "Waiting on applicant", statusTone: "warning", departmentName: "Student Records", submittedLabel: "17 Jul, 11:38", dueLabel: "Overdue by 1 day", priority: "CRITICAL", href: "/demo/officer/requests/REQ-DEMO-005" },
  { id: "REQ-DEMO-006", applicantName: "Kelvin Mutiso", serviceName: "Transcript Request", status: "Under review", statusTone: "info", departmentName: "Student Records", submittedLabel: "16 Jul, 08:52", dueLabel: "Due today", priority: "MEDIUM", href: "/demo/officer/requests/REQ-DEMO-006" },
];

const fallbackHandoffs: readonly OfficerHandoffSummary[] = [
  { id: "HND-DEMO-001", requestId: "REQ-DEMO-001", departmentName: "Finance", requestedAction: "Confirm fee-clearance position", status: "Pending acceptance", statusTone: "warning", href: "/demo/department" },
  { id: "HND-DEMO-002", requestId: "REQ-DEMO-003", departmentName: "Registrar", requestedAction: "Confirm certificate reissue authority", status: "In progress", statusTone: "info", href: "/demo/department" },
  { id: "HND-DEMO-003", requestId: "REQ-DEMO-004", departmentName: "Finance", requestedAction: "Return verified result", status: "Completed", statusTone: "success", href: "/demo/department" },
];

const fallbackMessages: readonly OfficerMessageSummary[] = [
  { id: "MSG-DEMO-001", senderName: "Brian Otieno", senderRole: "Applicant", subject: "Clearance request document", message: "I have uploaded the missing library clearance confirmation.", timestamp: "12 min", href: "/demo/officer/requests/REQ-DEMO-002", unread: true },
  { id: "MSG-DEMO-002", senderName: "Miriam Wekesa", senderRole: "Registrar", subject: "Approval requirement", message: "Please confirm the Finance result before forwarding the request.", timestamp: "48 min", href: "/demo/officer/requests/REQ-DEMO-001", unread: false },
  { id: "MSG-DEMO-003", senderName: "Finance Desk", senderRole: "Department", subject: "Payment reference", message: "The reference is being checked against the daily collection report.", timestamp: "2 hr", href: "/demo/department", unread: false },
];

const fallbackDeadlines: readonly OfficerDeadlineSummary[] = [
  { id: "DDL-DEMO-001", day: "23", month: "Jul", title: "Complete initial transcript review", reference: "REQ-DEMO-001", dueLabel: "Due today", priority: "HIGH", href: "/demo/officer/requests/REQ-DEMO-001" },
  { id: "DDL-DEMO-002", day: "24", month: "Jul", title: "Review applicant correction", reference: "REQ-DEMO-005", dueLabel: "Due tomorrow", priority: "CRITICAL", href: "/demo/officer/requests/REQ-DEMO-005" },
  { id: "DDL-DEMO-003", day: "25", month: "Jul", title: "Confirm Finance handoff result", reference: "REQ-DEMO-003", dueLabel: "2 days remaining", priority: "MEDIUM", href: "/demo/department" },
];

function asRecord(value: unknown): UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function firstText(record: UnknownRecord, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function firstArray(record: UnknownRecord, keys: readonly string[]): readonly unknown[] {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

function formatDate(value: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-KE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

function normalizePriority(value: string | null, index: number): OfficerQueuePriority {
  const normalized = value?.toUpperCase();
  if (normalized === "LOW" || normalized === "MEDIUM" || normalized === "HIGH" || normalized === "CRITICAL") return normalized;
  return (["HIGH", "MEDIUM", "LOW", "CRITICAL"] as const)[index % 4];
}

export function officerStatusTone(status: string): OfficerStatusTone {
  const normalized = status.toLowerCase();
  if (normalized.includes("complete") || normalized.includes("approved") || normalized.includes("clear") || normalized.includes("issued")) return "success";
  if (normalized.includes("overdue") || normalized.includes("reject") || normalized.includes("declin") || normalized.includes("blocked")) return "danger";
  if (normalized.includes("waiting") || normalized.includes("pending") || normalized.includes("refer") || normalized.includes("handoff") || normalized.includes("due")) return "warning";
  if (normalized.includes("review") || normalized.includes("progress") || normalized.includes("submit") || normalized.includes("new")) return "info";
  return "neutral";
}

function mapRequest(value: unknown, index: number, services: readonly ServiceOption[], departments: readonly DepartmentOption[]): OfficerQueueRow {
  const request = asRecord(value);
  const applicant = asRecord(request.applicant);
  const id = firstText(request, ["id", "requestId", "reference", "referenceNumber"]) ?? `REQ-DEMO-${String(index + 1).padStart(3, "0")}`;
  const serviceKey = firstText(request, ["serviceId", "serviceSlug", "service", "serviceName"]);
  const departmentKey = firstText(request, ["departmentId", "currentDepartmentId", "department", "departmentName", "currentDepartmentName"]);
  const status = firstText(request, ["internalStatus", "publicStatus", "status", "state"]) ?? "Submitted";
  const priority = normalizePriority(firstText(request, ["priority", "urgency"]), index);

  return {
    id,
    applicantName: firstText(request, ["applicantName", "fullName", "customerName"]) ?? firstText(applicant, ["fullName", "name"]) ?? "Demo applicant",
    serviceName: firstText(request, ["serviceName"]) ?? services.find((service) => service.id === serviceKey || service.slug === serviceKey || service.name === serviceKey)?.name ?? "Configured service",
    status,
    statusTone: officerStatusTone(status),
    departmentName: firstText(request, ["departmentName", "currentDepartmentName"]) ?? departments.find((department) => department.id === departmentKey || department.name === departmentKey)?.name ?? "Student Records",
    submittedLabel: formatDate(firstText(request, ["submittedAt", "createdAt", "updatedAt", "lastActivityAt"])),
    dueLabel: firstText(request, ["dueLabel", "slaLabel", "deadlineLabel"]) ?? (priority === "CRITICAL" ? "Overdue" : index % 3 === 0 ? "Due today" : `${index + 1} days remaining`),
    priority,
    href: `/demo/officer/requests/${id}`,
  };
}

function mapHandoff(value: unknown, index: number): OfficerHandoffSummary {
  const handoff = asRecord(value);
  const id = firstText(handoff, ["id", "handoffId", "reference"]) ?? `HND-DEMO-${String(index + 1).padStart(3, "0")}`;
  const status = firstText(handoff, ["status", "state"]) ?? "Pending acceptance";
  return {
    id,
    requestId: firstText(handoff, ["requestId"]) ?? "REQ-DEMO-001",
    departmentName: firstText(handoff, ["receivingDepartmentName", "toDepartmentName", "departmentName"]) ?? "Finance",
    requestedAction: firstText(handoff, ["requestedAction", "action", "reason"]) ?? "Complete the requested departmental check",
    status,
    statusTone: officerStatusTone(status),
    href: firstText(handoff, ["href"]) ?? "/demo/department",
  };
}

export function buildOfficerDashboardViewModel({ state, services, departments }: { readonly state: unknown; readonly services: readonly ServiceOption[]; readonly departments: readonly DepartmentOption[] }): OfficerDashboardViewModel {
  const stateRecord = asRecord(state);
  const rawRequests = firstArray(stateRecord, ["requests", "requestRecords", "cases"]);
  const mapped = rawRequests.length > 0 ? rawRequests.map((request, index) => mapRequest(request, index, services, departments)) : fallbackQueue;
  const queue = [...mapped, ...fallbackQueue.filter((fallback) => !mapped.some((request) => request.id === fallback.id))].slice(0, 8);
  const rawHandoffs = firstArray(stateRecord, ["handoffs", "requestHandoffs"]);
  const handoffs = rawHandoffs.length > 0 ? rawHandoffs.map(mapHandoff).slice(0, 3) : fallbackHandoffs;
  const completed = queue.filter((row) => row.status.toLowerCase().includes("complete")).length;

  return {
    queue,
    handoffs,
    messages: fallbackMessages,
    deadlines: fallbackDeadlines,
    metrics: {
      assignedToMe: queue.filter((row) => !row.status.toLowerCase().includes("complete")).length,
      dueToday: queue.filter((row) => row.dueLabel.toLowerCase().includes("today")).length,
      overdue: queue.filter((row) => row.dueLabel.toLowerCase().includes("overdue") || row.priority === "CRITICAL").length,
      waitingOnApplicant: queue.filter((row) => row.status.toLowerCase().includes("applicant")).length,
      waitingOnDepartment: queue.filter((row) => row.status.toLowerCase().includes("department") || row.status.toLowerCase().includes("refer") || row.status.toLowerCase().includes("handoff")).length,
      completedToday: completed,
    },
  };
}
