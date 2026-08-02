export type DashboardSemanticTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "purple"
  | "teal";

export type DashboardRole =
  | "officer"
  | "supervisor"
  | "admin";

export type DashboardIdentity = {
  readonly id: string;
  readonly displayName: string;
  readonly role: DashboardRole;
  readonly roleLabel: string;
  readonly institutionName: string;
  readonly departmentName?: string;
};

export type DashboardAction = {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly intent?:
    | "view"
    | "review"
    | "approve"
    | "assign"
    | "resolve"
    | "export";
};

export type DashboardMetricData = {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly tone: DashboardSemanticTone;
  readonly deltaLabel?: string;
  readonly progress?: number;
};

export type DashboardTrendPoint = {
  readonly label: string;
  readonly primary: number;
  readonly secondary?: number;
};

export type DashboardDistributionItem = {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly percentage?: number;
  readonly tone?: DashboardSemanticTone;
};

export type DashboardActivityItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestampLabel: string;
  readonly tone: DashboardSemanticTone;
  readonly action?: DashboardAction;
};

export type DashboardDateRange = {
  readonly label: string;
  readonly start: string;
  readonly end: string;
};

export type DashboardAdapterContext = {
  readonly now?: string;
  readonly institutionId?: string;
  readonly departmentId?: string;
  readonly officerId?: string;
  readonly supervisorId?: string;
  readonly adminId?: string;
};

export const DEFAULT_DASHBOARD_REFERENCE_DATE =
  "2026-05-08T12:00:00.000Z";
