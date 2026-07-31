import type {
  DashboardAction,
  DashboardActivityItem,
  DashboardDistributionItem,
  DashboardIdentity,
  DashboardMetricData,
  DashboardSemanticTone,
  DashboardTrendPoint,
} from "./dashboard-data.shared";

export type SupervisorApprovalItem = {
  readonly id: string;
  readonly requestId: string;
  readonly applicantName: string;
  readonly serviceName: string;
  readonly dueLabel: string;
  readonly stageLabel: string;
  readonly ownerName: string;
  readonly action: DashboardAction;
};

export type SupervisorAttentionItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly count: number;
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type SupervisorOfficerCapacity = {
  readonly id: string;
  readonly officerName: string;
  readonly roleLabel: string;
  readonly utilization: number;
  readonly tone: DashboardSemanticTone;
  readonly openCount: number;
};

export type SupervisorAssignmentRecommendation = {
  readonly id: string;
  readonly serviceName: string;
  readonly estimatedDurationLabel: string;
  readonly skillMatch: number;
  readonly recommendedOfficerName: string;
  readonly action: DashboardAction;
};

export type SupervisorQueueRow = {
  readonly id: string;
  readonly serviceName: string;
  readonly count: number;
  readonly dueToday: number;
  readonly overdue: number;
};

export type SupervisorHandoffItem = {
  readonly id: string;
  readonly stageLabel: string;
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly contextLabel: string;
  readonly timestampLabel: string;
  readonly action: DashboardAction;
};

export type SupervisorExceptionItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly count: number;
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type SupervisorServiceStage = {
  readonly id: string;
  readonly label: string;
  readonly averageDurationHours: number;
  readonly targetHours: number;
  readonly inProgress: number;
  readonly tone: DashboardSemanticTone;
};

export type SupervisorPerformanceRank = {
  readonly id: string;
  readonly label: string;
  readonly secondaryLabel: string;
  readonly score: number;
  readonly tone: DashboardSemanticTone;
};

export type SupervisorThroughputData = {
  readonly total: number;
  readonly deltaPercentage: number;
  readonly points: readonly DashboardTrendPoint[];
};

export type SupervisorApplicantExperience = {
  readonly score: number;
  readonly responseCount: number;
  readonly distribution:
    readonly DashboardDistributionItem[];
};

export type SupervisorInsight = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tone: DashboardSemanticTone;
};

export type SupervisorAuditSummary = {
  readonly decisionsMade: number;
  readonly handoffsCreated: number;
  readonly escalations: number;
  readonly auditEvents: number;
  readonly signals: readonly string[];
  readonly action: DashboardAction;
};

export type SupervisorReportCard = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly runAction: DashboardAction;
  readonly scheduleAction: DashboardAction;
};

export type SupervisorDashboardData = {
  readonly identity: DashboardIdentity;
  readonly greeting: string;
  readonly dateLabel: string;
  readonly departmentHealth:
    readonly DashboardMetricData[];
  readonly approvalLane:
    readonly SupervisorApprovalItem[];
  readonly criticalAttention:
    readonly SupervisorAttentionItem[];
  readonly unassignedWork:
    readonly SupervisorAttentionItem[];
  readonly officerCapacity:
    readonly SupervisorOfficerCapacity[];
  readonly assignmentCentre:
    readonly SupervisorAssignmentRecommendation[];
  readonly departmentQueue:
    readonly SupervisorQueueRow[];
  readonly handoffControl:
    readonly SupervisorHandoffItem[];
  readonly escalations:
    readonly SupervisorExceptionItem[];
  readonly documentPaymentExceptions:
    readonly SupervisorExceptionItem[];
  readonly serviceFlow:
    readonly SupervisorServiceStage[];
  readonly slaTrend:
    readonly DashboardTrendPoint[];
  readonly officerPerformance:
    readonly SupervisorPerformanceRank[];
  readonly servicePerformance:
    readonly SupervisorPerformanceRank[];
  readonly throughput: SupervisorThroughputData;
  readonly applicantExperience:
    SupervisorApplicantExperience;
  readonly performanceInsights:
    readonly SupervisorInsight[];
  readonly recentDecisions:
    readonly DashboardActivityItem[];
  readonly departmentActivity:
    readonly DashboardActivityItem[];
  readonly auditHighlights:
    SupervisorAuditSummary;
  readonly teamNotifications:
    readonly DashboardActivityItem[];
  readonly reports:
    readonly SupervisorReportCard[];
};
