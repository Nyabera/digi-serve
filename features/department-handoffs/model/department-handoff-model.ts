export type DepartmentHandoffStatus =
  | "PENDING_ACCEPTANCE"
  | "IN_PROGRESS"
  | "RETURNED_FOR_CLARIFICATION"
  | "DECLINED"
  | "COMPLETED";

export type DepartmentHandoffStatusTone =
  | "blue"
  | "orange"
  | "purple"
  | "red"
  | "green"
  | "neutral";

export type DepartmentHandoffResult =
  | "CLEAR"
  | "HOLD"
  | "CANNOT_VERIFY";

export interface DepartmentMetricModel {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly tone: "blue" | "orange" | "purple" | "red" | "green";
  readonly icon: "inbox" | "progress" | "clarification" | "calendar";
  readonly actionLabel: string;
}

export interface DepartmentHandoffDocumentModel {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
}

export interface DepartmentHandoffTimelineModel {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly occurredAt: string;
  readonly timestampLabel: string;
  readonly tone: "blue" | "orange" | "purple" | "green" | "neutral";
}

export interface DepartmentHandoffRowModel {
  readonly id: string;
  readonly requestId: string;
  readonly requestTitle: string;
  readonly applicantName: string;
  readonly fromDepartment: string;
  readonly fromOfficer: string;
  readonly requestedAction: string;
  readonly reason: string;
  readonly expectedOutput: string;
  readonly receivedLabel: string;
  readonly dueDateLabel: string;
  readonly dueStateLabel: string;
  readonly assignedOfficer: string;
  readonly assignedOfficerInitials: string;
  readonly status: DepartmentHandoffStatus;
  readonly statusLabel: string;
  readonly statusTone: DepartmentHandoffStatusTone;
  readonly href: string;
  readonly documents: readonly DepartmentHandoffDocumentModel[];
  readonly timeline: readonly DepartmentHandoffTimelineModel[];
}

export interface DepartmentCompletedHandoffModel {
  readonly id: string;
  readonly departmentName: string;
  readonly requestTitle: string;
  readonly completedLabel: string;
  readonly resultLabel: string;
  readonly href: string;
}

export interface DepartmentInboxModel {
  readonly title: string;
  readonly subtitle: string;
  readonly departmentName: string;
  readonly metrics: readonly DepartmentMetricModel[];
  readonly rows: readonly DepartmentHandoffRowModel[];
  readonly completed: readonly DepartmentCompletedHandoffModel[];
}

export interface DepartmentProcessingModel {
  readonly handoff: DepartmentHandoffRowModel;
  readonly parentOwnerName: string;
  readonly receivingDepartmentName: string;
  readonly receivingOfficerName: string;
  readonly result?: DepartmentHandoffResult;
  readonly resultNote?: string;
  readonly completedAtLabel?: string;
}
