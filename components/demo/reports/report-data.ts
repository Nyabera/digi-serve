export type KpiTone = "indigo" | "amber" | "red" | "teal";

export type KpiItem = {
  id: "open" | "due" | "overdue" | "turnaround";
  label: string;
  value: string;
  suffix?: string;
  change: string;
  context: string;
  tone: KpiTone;
  sparkline: number[];
};

export const KPI_ITEMS: KpiItem[] = [
  {
    id: "open",
    label: "Open requests",
    value: "86",
    change: "8",
    context: "vs prior period",
    tone: "indigo",
    sparkline: [72, 74, 79, 75, 73, 77, 72, 78, 80, 82, 86],
  },
  {
    id: "due",
    label: "Due in 48 hours",
    value: "17",
    change: "5",
    context: "need assignment",
    tone: "amber",
    sparkline: [11, 15, 14, 12, 13, 20, 12, 10, 11, 15, 17],
  },
  {
    id: "overdue",
    label: "Overdue",
    value: "9",
    change: "3",
    context: "fewer than prior period",
    tone: "red",
    sparkline: [16, 14, 13, 8, 12, 9, 8, 10, 9, 8, 9],
  },
  {
    id: "turnaround",
    label: "Median turnaround",
    value: "3.4",
    suffix: "days",
    change: "0.6",
    context: "days faster",
    tone: "teal",
    sparkline: [4.4, 4.1, 4.5, 4.2, 4.0, 4.1, 3.8, 3.7, 3.8, 3.5, 3.4],
  },
];

export const WORKLOAD_DATA = [
  { period: "Week 1|Apr 14–20", submitted: 58, completed: 43, returned: 6, capacity: 80 },
  { period: "Week 2|Apr 21–27", submitted: 67, completed: 50, returned: 7, capacity: 80 },
  { period: "Week 3|Apr 28–May 4", submitted: 71, completed: 53, returned: 8, capacity: 80 },
  { period: "Week 4|May 5–11", submitted: 62, completed: 45, returned: 5, capacity: 80 },
  { period: "Week 5|May 12–18", submitted: 52, completed: 51, returned: 4, capacity: 80 },
  { period: "Week 6|May 19–25", submitted: 55, completed: 49, returned: 5, capacity: 80 },
  { period: "Week 7|May 26–Jun 1", submitted: 57, completed: 46, returned: 6, capacity: 80 },
  { period: "Week 8|Jun 2–8", submitted: 61, completed: 45, returned: 7, capacity: 80 },
];

export const SLA_DATA = [
  { name: "On track", value: 64, percentage: 74 },
  { name: "Due soon", value: 13, percentage: 15 },
  { name: "Overdue", value: 9, percentage: 11 },
];

export const DEPARTMENT_SLA = [
  { department: "Student Records", percentage: 79 },
  { department: "Finance", percentage: 68 },
  { department: "Registrar", percentage: 71 },
];

export const BACKLOG_DATA = [
  { department: "Student Records", fresh: 16, ageing: 10, old: 5, total: 31 },
  { department: "Finance", fresh: 14, ageing: 11, old: 9, total: 34 },
  { department: "Registrar", fresh: 11, ageing: 7, old: 3, total: 21 },
];

export const WORKFLOW_DATA = [
  { stage: "Submitted", value: 240, fill: "#5C6BC0" },
  { stage: "Records review", value: 214, fill: "#42A5F5" },
  { stage: "Finance check", value: 178, fill: "#26A69A" },
  { stage: "Registrar approval", value: 161, fill: "#66BB6A" },
  { stage: "Completed", value: 154, fill: "#78909C" },
];

export const TURNAROUND_DATA = [
  { period: "W1", transcript: 4.8, clearance: 6.2, certificate: 8.4, target: 5 },
  { period: "W2", transcript: 4.4, clearance: 5.9, certificate: 8.2, target: 5 },
  { period: "W3", transcript: 4.1, clearance: 5.6, certificate: 7.9, target: 5 },
  { period: "W4", transcript: 3.9, clearance: 5.3, certificate: 7.6, target: 5 },
  { period: "W5", transcript: 3.7, clearance: 5.0, certificate: 7.5, target: 5 },
  { period: "W6", transcript: 3.5, clearance: 4.8, certificate: 7.3, target: 5 },
  { period: "W7", transcript: 3.4, clearance: 4.7, certificate: 7.1, target: 5 },
  { period: "W8", transcript: 3.2, clearance: 4.5, certificate: 6.9, target: 5 },
];

export const REQUESTS_BY_SERVICE = [
  { service: "Academic transcripts", requests: 82 },
  { service: "Missing marks review", requests: 58 },
  { service: "Student clearance", requests: 46 },
  { service: "Certificate replacement", requests: 31 },
  { service: "Fee verification", requests: 24 },
  { service: "Attachment letters", requests: 19 },
];

export const HANDOFF_DELAY_DATA = [
  { from: "Student Records", to: "Student Records", hours: 0 },
  { from: "Student Records", to: "Finance", hours: 1.8 },
  { from: "Student Records", to: "Registrar", hours: 0.8 },
  { from: "Finance", to: "Student Records", hours: 1.2 },
  { from: "Finance", to: "Finance", hours: 0 },
  { from: "Finance", to: "Registrar", hours: 2.6 },
  { from: "Registrar", to: "Student Records", hours: 0.6 },
  { from: "Registrar", to: "Finance", hours: 0.9 },
  { from: "Registrar", to: "Registrar", hours: 0 },
];

export const OFFICER_DATA = [
  { officer: "N. Otieno", workload: 42, completionRate: 88, overdue: 3 },
  { officer: "A. Kamau", workload: 56, completionRate: 78, overdue: 9 },
  { officer: "J. Mwangi", workload: 38, completionRate: 92, overdue: 2 },
  { officer: "P. Njeri", workload: 61, completionRate: 74, overdue: 11 },
  { officer: "R. Ali", workload: 47, completionRate: 84, overdue: 5 },
  { officer: "M. Wekesa", workload: 33, completionRate: 95, overdue: 1 },
];

export const OUTCOME_DATA = [
  { service: "Transcripts", completed: 68, rejected: 5, returned: 12, cancelled: 3, open: 12 },
  { service: "Clearance", completed: 61, rejected: 4, returned: 18, cancelled: 5, open: 12 },
  { service: "Certificates", completed: 55, rejected: 8, returned: 20, cancelled: 7, open: 10 },
  { service: "Missing marks", completed: 49, rejected: 10, returned: 24, cancelled: 5, open: 12 },
  { service: "Attachment", completed: 72, rejected: 3, returned: 10, cancelled: 4, open: 11 },
];

export const DEMAND_WEEKS = [
  { week: "Apr 14", values: [4, 8, 10, 12, 9, 2, 1] },
  { week: "Apr 21", values: [6, 9, 13, 15, 11, 3, 2] },
  { week: "Apr 28", values: [8, 14, 18, 20, 16, 5, 3] },
  { week: "May 5", values: [7, 12, 15, 14, 12, 4, 2] },
  { week: "May 12", values: [5, 9, 11, 13, 10, 3, 2] },
  { week: "May 19", values: [6, 10, 12, 14, 11, 4, 2] },
  { week: "May 26", values: [9, 15, 17, 19, 16, 6, 4] },
  { week: "Jun 2", values: [8, 13, 16, 18, 15, 5, 3] },
  { week: "Jun 9", values: [7, 11, 14, 16, 12, 4, 2] },
  { week: "Jun 16", values: [6, 10, 13, 15, 11, 3, 2] },
  { week: "Jun 23", values: [10, 16, 21, 23, 18, 7, 4] },
  { week: "Jun 30", values: [9, 14, 19, 20, 17, 6, 3] },
];

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
