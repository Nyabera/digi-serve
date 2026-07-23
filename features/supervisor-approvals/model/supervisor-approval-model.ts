export type SupervisorTone =
  | "blue"
  | "orange"
  | "red"
  | "purple"
  | "green"
  | "neutral";

export type SupervisorDecision =
  | "APPROVED"
  | "REJECTED"
  | "RETURNED_FOR_CLARIFICATION";

export interface SupervisorMetricModel {
  readonly id: string;
  readonly label: string;
  readonly value: string | number;
  readonly tone: SupervisorTone;
  readonly icon:
    | "requests"
    | "approval"
    | "overdue"
    | "unassigned"
    | "handoff"
    | "duration";
  readonly actionLabel: string;
  readonly href: string;
}

export interface SupervisorApprovalQueueRowModel {
  readonly requestId: string;
  readonly requestTitle: string;
  readonly applicantName: string;
  readonly applicantReference: string;
  readonly ownerDepartment: string;
  readonly financeResult: "CLEAR" | "HOLD" | "CANNOT_VERIFY";
  readonly submittedLabel: string;
  readonly dueLabel: string;
  readonly dueStateLabel: string;
  readonly priorityLabel: "High" | "Medium" | "Low";
  readonly priorityTone: "red" | "orange" | "green";
  readonly statusLabel:
    | "Ready"
    | "Blocked"
    | "Approved"
    | "Rejected"
    | "Returned";
  readonly statusTone: SupervisorTone;
  readonly href: string;
}

export interface SupervisorOfficerLoadModel {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly role: string;
  readonly assigned: number;
  readonly inProgress: number;
  readonly overdue: number;
  readonly utilizationPercent: number;
}

export interface SupervisorStageTimingModel {
  readonly id: string;
  readonly label: string;
  readonly averageLabel: string;
  readonly targetLabel: string;
  readonly varianceLabel: string;
  readonly tone: "green" | "orange" | "red";
  readonly widthPercent: number;
}

export interface SupervisorAttentionItemModel {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly statusLabel: string;
  readonly statusTone: SupervisorTone;
  readonly href: string;
}

export interface SupervisorDashboardModel {
  readonly title: string;
  readonly subtitle: string;
  readonly metrics: readonly SupervisorMetricModel[];
  readonly approvals: readonly SupervisorApprovalQueueRowModel[];
  readonly officers: readonly SupervisorOfficerLoadModel[];
  readonly stageTimings: readonly SupervisorStageTimingModel[];
  readonly attentionItems: readonly SupervisorAttentionItemModel[];
}

export interface SupervisorPrerequisiteModel {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly passed: boolean;
}

export interface SupervisorRecordItemModel {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface SupervisorDocumentItemModel {
  readonly id: string;
  readonly name: string;
  readonly levelLabel: string;
  readonly statusLabel: string;
  readonly available: boolean;
}

export interface SupervisorDecisionRecordModel {
  readonly decision: SupervisorDecision;
  readonly internalNote: string;
  readonly applicantReason: string;
  readonly decidedBy: string;
  readonly decidedAtLabel: string;
}

export interface SupervisorApprovalDetailModel {
  readonly requestId: string;
  readonly serviceName: string;
  readonly applicantName: string;
  readonly applicantInitials: string;
  readonly applicantEmail: string;
  readonly applicantPhone: string;
  readonly submittedLabel: string;
  readonly parentOwnerName: string;
  readonly registrarDepartmentName: string;
  readonly decisionAuthorityName: string;
  readonly currentStatusLabel: string;
  readonly currentStatusTone: SupervisorTone;
  readonly financeResult: "CLEAR" | "HOLD" | "CANNOT_VERIFY" | null;
  readonly financeNote: string;
  readonly financeCompletedBy: string;
  readonly financeCompletedAtLabel: string;
  readonly prerequisites: readonly SupervisorPrerequisiteModel[];
  readonly applicationItems: readonly SupervisorRecordItemModel[];
  readonly documents: readonly SupervisorDocumentItemModel[];
  readonly existingDecision: SupervisorDecisionRecordModel | null;
}
