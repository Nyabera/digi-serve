import type {
  DashboardAction,
  DashboardActivityItem,
  DashboardIdentity,
  DashboardMetricData,
  DashboardSemanticTone,
  DashboardTrendPoint,
} from "./dashboard-data.shared";

export type OfficerWorkPlanGroup =
  | "needs-action"
  | "waiting-on-others"
  | "ready-to-complete";

export type OfficerSignalGroup =
  | "messages"
  | "assignments"
  | "notices"
  | "case-updates";

export type OfficerWorkPlanItem = {
  readonly id: string;
  readonly serviceName: string;
  readonly applicantName: string;
  readonly requestId: string;
  readonly nextAction: string;
  readonly stageLabel: string;
  readonly slaLabel: string;
  readonly slaProgress: number;
  readonly slaTone: DashboardSemanticTone;
  readonly statusLabel: string;
  readonly statusTone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type OfficerCaseSignal = {
  readonly id: string;
  readonly group: OfficerSignalGroup;
  readonly senderName: string;
  readonly senderInitials: string;
  readonly title: string;
  readonly message: string;
  readonly contextLabel: string;
  readonly timestampLabel: string;
  readonly unread: boolean;
  readonly tone: DashboardSemanticTone;
  readonly action?: DashboardAction;
};

export type OfficerHandoffItem = {
  readonly id: string;
  readonly direction:
    | "incoming"
    | "outgoing"
    | "completed";
  readonly title: string;
  readonly serviceName: string;
  readonly requestId: string;
  readonly timestampLabel: string;
  readonly action: DashboardAction;
};

export type OfficerQueueItem = {
  readonly id: string;
  readonly title: string;
  readonly requestId: string;
  readonly dueLabel: string;
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type OfficerActionRequiredItem = {
  readonly id: string;
  readonly label: string;
  readonly count: number;
  readonly tone: DashboardSemanticTone;
  readonly action: DashboardAction;
};

export type OfficerRhythmData = {
  readonly periodLabel: string;
  readonly points: readonly DashboardTrendPoint[];
  readonly primaryLabel: string;
  readonly secondaryLabel: string;
  readonly slaOnTime: number;
  readonly action: DashboardAction;
};

export type OfficerDashboardData = {
  readonly identity: DashboardIdentity;
  readonly greeting: string;
  readonly dateLabel: string;
  readonly workloadPulse: readonly DashboardMetricData[];
  readonly workPlan: Readonly<
    Record<
      OfficerWorkPlanGroup,
      readonly OfficerWorkPlanItem[]
    >
  >;
  readonly caseSignals: Readonly<
    Record<
      OfficerSignalGroup,
      readonly OfficerCaseSignal[]
    >
  >;
  readonly recentHandoffs:
    readonly OfficerHandoffItem[];
  readonly recentActivity:
    readonly DashboardActivityItem[];
  readonly upNext: readonly OfficerQueueItem[];
  readonly actionRequired:
    readonly OfficerActionRequiredItem[];
  readonly rhythm: OfficerRhythmData;
};
