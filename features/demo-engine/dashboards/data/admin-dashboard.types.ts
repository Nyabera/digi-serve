import type {
  DashboardAction,
  DashboardActivityItem,
  DashboardDateRange,
  DashboardDistributionItem,
  DashboardIdentity,
  DashboardMetricData,
  DashboardSemanticTone,
  DashboardTrendPoint,
} from "./dashboard-data.shared";

export type AdminExecutiveBrief = {
  readonly title: string;
  readonly summary: string;
};

export type AdminAlert = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority:
    | "low"
    | "medium"
    | "high";
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type AdminDepartmentPerformance = {
  readonly id: string;
  readonly departmentName: string;
  readonly submitted: number;
  readonly completed: number;
  readonly completionRate: number;
  readonly averageTurnaroundDays: number;
  readonly slaCompliance: number;
};

export type AdminCapacityCell = {
  readonly departmentId: string;
  readonly departmentName: string;
  readonly low: number;
  readonly moderate: number;
  readonly high: number;
  readonly veryHigh: number;
};

export type AdminWorkflowBottleneck = {
  readonly id: string;
  readonly stageLabel: string;
  readonly averageDurationDays: number;
  readonly requestCount: number;
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type AdminHandoffNode = {
  readonly id: string;
  readonly label: string;
  readonly category:
    | "core"
    | "department"
    | "external";
};

export type AdminHandoffEdge = {
  readonly id: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly frequency:
    | "frequent"
    | "occasional";
  readonly count: number;
};

export type AdminApprovalEscalation = {
  readonly id: string;
  readonly typeLabel: string;
  readonly itemLabel: string;
  readonly sourceLabel: string;
  readonly raisedLabel: string;
  readonly priority:
    | "low"
    | "medium"
    | "high";
  readonly action: DashboardAction;
};

export type AdminPaymentOverview = {
  readonly expected: number;
  readonly confirmed: number;
  readonly exceptions: number;
  readonly currency: string;
  readonly revenueByService:
    readonly DashboardDistributionItem[];
};

export type AdminDocumentOperations = {
  readonly uploaded: number;
  readonly inReview: number;
  readonly rejected: number;
  readonly issued: number;
  readonly topDocumentTypes:
    readonly DashboardDistributionItem[];
};

export type AdminVerificationActivity = {
  readonly total: number;
  readonly successRate: number;
  readonly trend: readonly DashboardTrendPoint[];
  readonly action: DashboardAction;
};

export type AdminRenewalItem = {
  readonly id: string;
  readonly label: string;
  readonly dateLabel: string;
  readonly daysRemaining: number;
  readonly tone: DashboardSemanticTone;
};

export type AdminRiskItem = {
  readonly id: string;
  readonly title: string;
  readonly priority:
    | "low"
    | "medium"
    | "high";
  readonly dueLabel: string;
  readonly action: DashboardAction;
};

export type AdminApplicantFunnel = {
  readonly stages:
    readonly DashboardDistributionItem[];
  readonly completionRate: number;
};

export type AdminAdoptionData = {
  readonly activeUsers: number;
  readonly sessions: number;
  readonly featureUsage: number;
  readonly trend: readonly DashboardTrendPoint[];
};

export type AdminOutcomeMetric = {
  readonly id: string;
  readonly label: string;
  readonly before: number;
  readonly after: number;
  readonly unit: string;
  readonly tone: DashboardSemanticTone;
};

export type AdminSystemHealthItem = {
  readonly id: string;
  readonly label: string;
  readonly status:
    | "operational"
    | "degraded"
    | "offline";
  readonly tone: DashboardSemanticTone;
};

export type AdminScheduledReport = {
  readonly id: string;
  readonly title: string;
  readonly scheduleLabel: string;
  readonly enabled: boolean;
  readonly action: DashboardAction;
};

export type AdminDashboardData = {
  readonly identity: DashboardIdentity;
  readonly dateRange: DashboardDateRange;
  readonly executiveBrief: AdminExecutiveBrief;
  readonly institutionHealth:
    readonly DashboardMetricData[];
  readonly serviceDeliveryTrend:
    readonly DashboardTrendPoint[];
  readonly alerts: readonly AdminAlert[];
  readonly departmentPerformance:
    readonly AdminDepartmentPerformance[];
  readonly slaCompliance: number;
  readonly requestsByStatus:
    readonly DashboardDistributionItem[];
  readonly requestsByService:
    readonly DashboardDistributionItem[];
  readonly capacityHeatmap:
    readonly AdminCapacityCell[];
  readonly workflowBottlenecks:
    readonly AdminWorkflowBottleneck[];
  readonly handoffNodes:
    readonly AdminHandoffNode[];
  readonly handoffEdges:
    readonly AdminHandoffEdge[];
  readonly approvalsEscalations:
    readonly AdminApprovalEscalation[];
  readonly payments: AdminPaymentOverview;
  readonly documents: AdminDocumentOperations;
  readonly verification:
    AdminVerificationActivity;
  readonly renewals:
    readonly AdminRenewalItem[];
  readonly complianceRisks:
    readonly AdminRiskItem[];
  readonly applicantFunnel:
    AdminApplicantFunnel;
  readonly platformAdoption:
    AdminAdoptionData;
  readonly externalCoordination:
    readonly DashboardDistributionItem[];
  readonly institutionalOutcomes:
    readonly AdminOutcomeMetric[];
  readonly systemHealth:
    readonly AdminSystemHealthItem[];
  readonly recentAdministrativeActivity:
    readonly DashboardActivityItem[];
  readonly scheduledReports:
    readonly AdminScheduledReport[];
};
