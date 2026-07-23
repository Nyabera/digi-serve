export type DashboardTone = "blue" | "orange" | "red" | "purple" | "green";

export type DashboardIcon =
  | "clipboard"
  | "calendar"
  | "clock"
  | "applicant"
  | "department"
  | "completed"
  | "document"
  | "shield";

export interface DashboardAction {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  tone: DashboardTone;
  icon: DashboardIcon;
  action: DashboardAction;
}

export interface QueuePreviewRow {
  requestId: string;
  requestTitle: string;
  requestHref: string;
  requestIcon: "document" | "shield";
  requestTone: DashboardTone;
  applicantName: string;
  applicantReference: string;
  typeLabel: string;
  priority: "High" | "Medium" | "Low";
  dueDateLabel: string;
  dueStateLabel: string;
  dueState: "overdue" | "upcoming";
  actionLabel: "Review" | "Verify";
}

export interface HandoffPreviewRow {
  id: string;
  title: string;
  subject: string;
  requestReference: string;
  dateLabel: string;
  timeLabel: string;
  direction: "incoming" | "outgoing" | "completed";
  href: string;
}

export interface MessagePreviewRow {
  id: string;
  applicantName: string;
  initials: string;
  initialsTone: "purple" | "orange" | "green";
  subject: string;
  preview: string;
  dateLabel: string;
  timeLabel: string;
  readState: "read" | "unread";
  href: string;
}

export interface SlaBreakdown {
  targetPercent: number;
  onTime: { percent: number; count: number };
  dueSoon: { percent: number; count: number };
  overdue: { percent: number; count: number };
}

export interface WorkloadSnapshot {
  totalAssigned: number;
  inProgress: number;
  dueToday: number;
  overdue: number;
}

export interface OfficerDashboardModel {
  greeting: string;
  subtitle: string;
  metrics: DashboardMetric[];
  queue: {
    rows: QueuePreviewRow[];
    totalAssigned: number;
    fullQueueHref: string;
  };
  handoffs: {
    rows: HandoffPreviewRow[];
    allHref: string;
  };
  messages: {
    rows: MessagePreviewRow[];
    allHref: string;
  };
  sla: SlaBreakdown;
  workload: WorkloadSnapshot;
  detailedReportHref: string;
}
