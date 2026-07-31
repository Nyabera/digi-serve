export {
  adaptAdminDashboard,
} from "./admin-dashboard.adapter";

export type {
  AdminDashboardData,
  AdminDepartmentPerformance,
  AdminExecutiveBrief,
} from "./admin-dashboard.types";

export {
  assertDashboardDataValid,
  validateAdminDashboardData,
  validateOfficerDashboardData,
  validateSupervisorDashboardData,
} from "./dashboard-data.validation";

export type {
  DashboardValidationIssue,
} from "./dashboard-data.validation";

export type {
  DashboardAction,
  DashboardActivityItem,
  DashboardAdapterContext,
  DashboardDateRange,
  DashboardDistributionItem,
  DashboardIdentity,
  DashboardMetricData,
  DashboardSemanticTone,
  DashboardTrendPoint,
} from "./dashboard-data.shared";

export {
  createDashboardPackSnapshot,
} from "./demo-pack-dashboard.snapshot";

export type {
  DashboardPackDepartment,
  DashboardPackDocument,
  DashboardPackRequest,
  DashboardPackService,
  DashboardPackSnapshot,
  DashboardPackUser,
  DashboardPackWorkflow,
} from "./demo-pack-dashboard.snapshot";

export {
  adaptOfficerDashboard,
} from "./officer-dashboard.adapter";

export type {
  OfficerActionRequiredItem,
  OfficerCaseSignal,
  OfficerDashboardData,
  OfficerHandoffItem,
  OfficerQueueItem,
  OfficerRhythmData,
  OfficerSignalGroup,
  OfficerWorkPlanGroup,
  OfficerWorkPlanItem,
} from "./officer-dashboard.types";

export {
  adaptSupervisorDashboard,
} from "./supervisor-dashboard.adapter";

export type {
  SupervisorApplicantExperience,
  SupervisorApprovalItem,
  SupervisorAssignmentRecommendation,
  SupervisorAttentionItem,
  SupervisorAuditSummary,
  SupervisorDashboardData,
  SupervisorExceptionItem,
  SupervisorHandoffItem,
  SupervisorInsight,
  SupervisorOfficerCapacity,
  SupervisorPerformanceRank,
  SupervisorQueueRow,
  SupervisorReportCard,
  SupervisorServiceStage,
  SupervisorThroughputData,
} from "./supervisor-dashboard.types";
