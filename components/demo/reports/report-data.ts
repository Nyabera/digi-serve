export type KpiTone = "blue" | "amber" | "coral" | "teal";

export type KpiItem = {
  id: "open" | "due" | "overdue" | "turnaround";
  label: string;
  value: string;
  suffix?: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
  context: string;
  tone: KpiTone;
  sparkline: number[];
};

export const OPEN_REQUESTS = 86;

export const KPI_ITEMS: KpiItem[] = [
  {
    id: "open",
    label: "Open requests",
    value: String(OPEN_REQUESTS),
    change: "8",
    changeDirection: "up",
    context: "vs prior period",
    tone: "blue",
    sparkline: [41, 44, 42, 51, 43, 39, 45, 40, 47, 38, 42, 49],
  },
  {
    id: "due",
    label: "Due in 48 hours",
    value: "17",
    change: "5 need assignment",
    changeDirection: "neutral",
    context: "",
    tone: "amber",
    sparkline: [12, 16, 13, 11, 14, 20, 9, 8, 10, 14, 11, 13],
  },
  {
    id: "overdue",
    label: "Overdue",
    value: "9",
    change: "3",
    changeDirection: "down",
    context: "vs prior period",
    tone: "coral",
    sparkline: [15, 12, 11, 8, 14, 9, 8, 10, 7, 6, 8, 5],
  },
  {
    id: "turnaround",
    label: "Median turnaround",
    value: "3.4",
    suffix: "days",
    change: "0.6d faster",
    changeDirection: "down",
    context: "",
    tone: "teal",
    sparkline: [3.1, 4.2, 3.5, 4.8, 3.7, 4.1, 3.2, 3.0, 3.6, 2.9, 3.4, 3.2],
  },
];

export const WORKLOAD_DATA = [
  { week: "Week 1|Apr 14–20", submitted: 54, completed: 40, capacity: 80 },
  { week: "Week 2|Apr 21–27", submitted: 67, completed: 49, capacity: 80 },
  { week: "Week 3|Apr 28–May 4", submitted: 71, completed: 53, capacity: 80 },
  { week: "Week 4|May 5–11", submitted: 62, completed: 44, capacity: 80 },
  { week: "Week 5|May 12–18", submitted: 52, completed: 51, capacity: 80 },
  { week: "Week 6|May 19–25", submitted: 55, completed: 49, capacity: 80 },
  { week: "Week 7|May 26–Jun 1", submitted: 57, completed: 45, capacity: 80 },
  { week: "Week 8|Jun 2–8", submitted: 61, completed: 44, capacity: 80 },
];

export const SLA_DATA = [
  { name: "On track", value: 74, color: "#15b8a6" },
  { name: "Due soon", value: 17, color: "#ffae1a" },
  { name: "Overdue", value: 9, color: "#ff525c" },
];

export const DEPARTMENT_SLA = [
  { department: "Student Records", value: 79 },
  { department: "Finance", value: 68 },
  { department: "Registrar", value: 71 },
];

export type BacklogRow = {
  department: string;
  zeroTwo: number;
  zeroTwoLabel: string;
  threeFive: number;
  threeFiveLabel: string;
  sixPlus: number;
  sixPlusLabel: string;
  total: number;
};

export const BACKLOG_DATA: BacklogRow[] = [
  {
    department: "Student Records",
    zeroTwo: 16,
    zeroTwoLabel: "16 (52%)",
    threeFive: 10,
    threeFiveLabel: "10 (32%)",
    sixPlus: 5,
    sixPlusLabel: "5 (16%)",
    total: 31,
  },
  {
    department: "Finance",
    zeroTwo: 14,
    zeroTwoLabel: "14 (41%)",
    threeFive: 11,
    threeFiveLabel: "11 (32%)",
    sixPlus: 9,
    sixPlusLabel: "9 (27%)",
    total: 34,
  },
  {
    department: "Registrar",
    zeroTwo: 11,
    zeroTwoLabel: "11 (52%)",
    threeFive: 7,
    threeFiveLabel: "7 (33%)",
    sixPlus: 3,
    sixPlusLabel: "3 (14%)",
    total: 21,
  },
];

export const WORKFLOW_DATA = [
  { stage: "Submitted", value: 240, retained: "100%", color: "#1769ff" },
  { stage: "Records review", value: 214, retained: "89%", color: "#39a8ec" },
  { stage: "Finance check", value: 178, retained: "83%", color: "#079b86", highlight: true },
  { stage: "Registrar approval", value: 161, retained: "90%", color: "#10a993" },
  { stage: "Completed", value: 154, retained: "96%", color: "#19b6a5" },
];

export const ATTENTION_ITEMS = [
  {
    id: "approval",
    title: "Registrar approval queue",
    description: "6 requests are overdue; oldest is 8 days.",
    action: "Review queue",
    href: "/demo/supervisor#approvals",
    tone: "coral" as const,
  },
  {
    id: "handoff",
    title: "Finance handoffs",
    description: "Acceptance is 1.8 days slower than target.",
    action: "View handoffs",
    href: "/demo/department",
    tone: "amber" as const,
  },
  {
    id: "service",
    title: "Certificate replacement",
    description: "29% correction rate, mainly missing ID copies.",
    action: "Inspect service",
    href: "/demo/officer",
    tone: "teal" as const,
  },
];
