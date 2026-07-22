import type {
  DemoHomepageVariant,
  DemoRole,
} from "@/types/demo/client-config";

export type DemoFormValue =
  | string
  | number
  | boolean
  | readonly string[]
  | null;

export type DemoRequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "RECORDS_REVIEW_IN_PROGRESS"
  | "WAITING_ON_APPLICANT"
  | "FINANCE_REFERRAL_IN_PROGRESS"
  | "AWAITING_APPROVAL"
  | "OUTCOME_PREPARATION"
  | "COMPLETED"
  | "REJECTED";

export type DemoDocumentStatus =
  | "SELECTED"
  | "UPLOADED_SIMULATED"
  | "UNDER_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "REPLACED";

export type DemoWorkItemStatus =
  | "READY"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING_ON_APPLICANT"
  | "WAITING_ON_DEPARTMENT"
  | "COMPLETED"
  | "OVERDUE";

export type DemoHandoffStatus =
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DECLINED"
  | "RETURNED_FOR_CLARIFICATION";

export type DemoApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "RETURNED";

export type DemoOutcomeStatus =
  | "NOT_ISSUED"
  | "PREPARING"
  | "ISSUED"
  | "COLLECTED";

export type DemoTimelineVisibility = "APPLICANT" | "INTERNAL";

export interface DemoApplicantState {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly registered: boolean;
}

export interface DemoDocumentRecord {
  readonly id: string;
  readonly requestId: string;
  readonly requirementId: string;
  readonly name: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: DemoDocumentStatus;
  readonly selectedAt: string;
  readonly reviewedAt?: string;
  readonly reviewReason?: string;
}

export interface DemoRequestRecord {
  readonly id: string;
  readonly reference: string;
  readonly serviceId: string;
  readonly serviceSlug: string;
  readonly applicantId: string;
  readonly status: DemoRequestStatus;
  readonly publicStatus: string;
  readonly currentDepartmentId: string;
  readonly assignedOfficerId?: string;
  readonly currentWorkflowStepId: string;
  readonly createdAt: string;
  readonly submittedAt?: string;
  readonly dueAt?: string;
  readonly completedAt?: string;
  readonly formResponse: Readonly<Record<string, DemoFormValue>>;
}

export interface DemoWorkItemRecord {
  readonly id: string;
  readonly requestId: string;
  readonly title: string;
  readonly description: string;
  readonly departmentId: string;
  readonly assignedOfficerId?: string;
  readonly status: DemoWorkItemStatus;
  readonly createdAt: string;
  readonly dueAt?: string;
  readonly completedAt?: string;
}

export interface DemoHandoffRecord {
  readonly id: string;
  readonly requestId: string;
  readonly workItemId: string;
  readonly type: "REFERRAL" | "TRANSFER";
  readonly fromDepartmentId: string;
  readonly toDepartmentId: string;
  readonly createdByOfficerId: string;
  readonly assignedOfficerId?: string;
  readonly requestedAction: string;
  readonly reason: string;
  readonly expectedOutput: string;
  readonly status: DemoHandoffStatus;
  readonly createdAt: string;
  readonly dueAt: string;
  readonly acceptedAt?: string;
  readonly completedAt?: string;
  readonly result?: string;
}

export interface DemoApprovalRecord {
  readonly id: string;
  readonly requestId: string;
  readonly approverId: string;
  readonly status: DemoApprovalStatus;
  readonly recommendation: string;
  readonly decisionReason?: string;
  readonly createdAt: string;
  readonly decidedAt?: string;
}

export interface DemoOutcomeRecord {
  readonly id: string;
  readonly requestId: string;
  readonly label: string;
  readonly status: DemoOutcomeStatus;
  readonly reference: string;
  readonly description: string;
  readonly issuedAt?: string;
  readonly collectedAt?: string;
}

export interface DemoNotificationRecord {
  readonly id: string;
  readonly recipientId: string;
  readonly requestId?: string;
  readonly title: string;
  readonly message: string;
  readonly href: string;
  readonly read: boolean;
  readonly createdAt: string;
}

export interface DemoTimelineEvent {
  readonly id: string;
  readonly requestId: string;
  readonly title: string;
  readonly description: string;
  readonly visibility: DemoTimelineVisibility;
  readonly occurredAt: string;
}

export interface DemoActivityEvent {
  readonly id: string;
  readonly name: string;
  readonly requestId?: string;
  readonly departmentId?: string;
  readonly occurredAt: string;
}

export interface DemoStateMeta {
  readonly seededAt: string;
  readonly lastUpdatedAt: string;
  readonly revision: number;
}

export interface DemoEngineState {
  readonly schemaVersion: 1;
  readonly clientSlug: string;
  readonly activeHomepageVariant: DemoHomepageVariant;
  readonly activeRole: DemoRole;
  readonly activeRequestId: string;
  readonly activeHandoffId: string;
  readonly applicant: DemoApplicantState;
  readonly formDrafts: Readonly<
    Record<string, Readonly<Record<string, DemoFormValue>>>
  >;
  readonly documents: readonly DemoDocumentRecord[];
  readonly requests: readonly DemoRequestRecord[];
  readonly workItems: readonly DemoWorkItemRecord[];
  readonly handoffs: readonly DemoHandoffRecord[];
  readonly approvals: readonly DemoApprovalRecord[];
  readonly outcomes: readonly DemoOutcomeRecord[];
  readonly notifications: readonly DemoNotificationRecord[];
  readonly timelineEvents: readonly DemoTimelineEvent[];
  readonly activityEvents: readonly DemoActivityEvent[];
  readonly meta: DemoStateMeta;
}

export type DemoStateAction =
  | {
      readonly type: "SET_HOMEPAGE_VARIANT";
      readonly variant: DemoHomepageVariant;
      readonly at: string;
    }
  | {
      readonly type: "SET_ACTIVE_ROLE";
      readonly role: DemoRole;
      readonly at: string;
    }
  | {
      readonly type: "SET_ACTIVE_REQUEST";
      readonly requestId: string;
      readonly at: string;
    }
  | {
      readonly type: "SET_ACTIVE_HANDOFF";
      readonly handoffId: string;
      readonly at: string;
    }
  | {
      readonly type: "UPDATE_APPLICANT";
      readonly applicant: Partial<DemoApplicantState>;
      readonly at: string;
    }
  | {
      readonly type: "SET_FORM_VALUE";
      readonly serviceSlug: string;
      readonly fieldKey: string;
      readonly value: DemoFormValue;
      readonly at: string;
    }
  | {
      readonly type: "ADD_DOCUMENT";
      readonly document: DemoDocumentRecord;
      readonly at: string;
    }
  | {
      readonly type: "UPDATE_DOCUMENT_STATUS";
      readonly documentId: string;
      readonly status: DemoDocumentStatus;
      readonly reviewReason?: string;
      readonly at: string;
    }
  | {
      readonly type: "ADD_REQUEST";
      readonly request: DemoRequestRecord;
      readonly at: string;
    }
  | {
      readonly type: "UPDATE_REQUEST_STATUS";
      readonly requestId: string;
      readonly status: DemoRequestStatus;
      readonly publicStatus: string;
      readonly currentDepartmentId?: string;
      readonly assignedOfficerId?: string;
      readonly currentWorkflowStepId?: string;
      readonly completedAt?: string;
      readonly at: string;
    }
  | {
      readonly type: "ADD_WORK_ITEM";
      readonly workItem: DemoWorkItemRecord;
      readonly at: string;
    }
  | {
      readonly type: "UPDATE_WORK_ITEM_STATUS";
      readonly workItemId: string;
      readonly status: DemoWorkItemStatus;
      readonly completedAt?: string;
      readonly at: string;
    }
  | {
      readonly type: "ADD_HANDOFF";
      readonly handoff: DemoHandoffRecord;
      readonly at: string;
    }
  | {
      readonly type: "UPDATE_HANDOFF_STATUS";
      readonly handoffId: string;
      readonly status: DemoHandoffStatus;
      readonly assignedOfficerId?: string;
      readonly result?: string;
      readonly acceptedAt?: string;
      readonly completedAt?: string;
      readonly at: string;
    }
  | {
      readonly type: "RECORD_APPROVAL";
      readonly approval: DemoApprovalRecord;
      readonly at: string;
    }
  | {
      readonly type: "ISSUE_OUTCOME";
      readonly outcome: DemoOutcomeRecord;
      readonly at: string;
    }
  | {
      readonly type: "ADD_NOTIFICATION";
      readonly notification: DemoNotificationRecord;
      readonly at: string;
    }
  | {
      readonly type: "MARK_NOTIFICATION_READ";
      readonly notificationId: string;
      readonly at: string;
    }
  | {
      readonly type: "ADD_TIMELINE_EVENT";
      readonly event: DemoTimelineEvent;
      readonly at: string;
    }
  | {
      readonly type: "ADD_ACTIVITY_EVENT";
      readonly event: DemoActivityEvent;
      readonly at: string;
    }
  | {
      readonly type: "HYDRATE_DEMO_STATE";
      readonly state: DemoEngineState;
    }
  | {
      readonly type: "RESET_DEMO";
    };
