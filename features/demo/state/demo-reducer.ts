import { createDemoSeedState } from "@/features/demo/state/demo-seed";
import type {
  DemoEngineState,
  DemoStateAction,
} from "@/types/demo/demo-state";

function nextMeta(state: DemoEngineState, at: string) {
  return {
    ...state.meta,
    lastUpdatedAt: at,
    revision: state.meta.revision + 1,
  };
}

export function demoStateReducer(
  state: DemoEngineState,
  action: DemoStateAction,
): DemoEngineState {
  switch (action.type) {
    case "SET_HOMEPAGE_VARIANT":
      return {
        ...state,
        activeHomepageVariant: action.variant,
        meta: nextMeta(state, action.at),
      };

    case "SET_ACTIVE_ROLE":
      return {
        ...state,
        activeRole: action.role,
        meta: nextMeta(state, action.at),
      };

    case "SET_ACTIVE_REQUEST":
      return {
        ...state,
        activeRequestId: action.requestId,
        meta: nextMeta(state, action.at),
      };

    case "SET_ACTIVE_HANDOFF":
      return {
        ...state,
        activeHandoffId: action.handoffId,
        meta: nextMeta(state, action.at),
      };

    case "UPDATE_APPLICANT":
      return {
        ...state,
        applicant: {
          ...state.applicant,
          ...action.applicant,
        },
        meta: nextMeta(state, action.at),
      };

    case "SET_FORM_VALUE":
      return {
        ...state,
        formDrafts: {
          ...state.formDrafts,
          [action.serviceSlug]: {
            ...state.formDrafts[action.serviceSlug],
            [action.fieldKey]: action.value,
          },
        },
        meta: nextMeta(state, action.at),
      };

    case "ADD_DOCUMENT":
      return {
        ...state,
        documents: [...state.documents, action.document],
        meta: nextMeta(state, action.at),
      };

    case "UPDATE_DOCUMENT_STATUS":
      return {
        ...state,
        documents: state.documents.map((document) =>
          document.id === action.documentId
            ? {
                ...document,
                status: action.status,
                reviewedAt: action.at,
                reviewReason: action.reviewReason,
              }
            : document,
        ),
        meta: nextMeta(state, action.at),
      };

    case "ADD_REQUEST":
      return {
        ...state,
        requests: [...state.requests, action.request],
        activeRequestId: action.request.id,
        meta: nextMeta(state, action.at),
      };

    case "UPDATE_REQUEST_STATUS":
      return {
        ...state,
        requests: state.requests.map((request) =>
          request.id === action.requestId
            ? {
                ...request,
                status: action.status,
                publicStatus: action.publicStatus,
                currentDepartmentId:
                  action.currentDepartmentId ??
                  request.currentDepartmentId,
                assignedOfficerId:
                  action.assignedOfficerId ??
                  request.assignedOfficerId,
                currentWorkflowStepId:
                  action.currentWorkflowStepId ??
                  request.currentWorkflowStepId,
                completedAt:
                  action.completedAt ?? request.completedAt,
              }
            : request,
        ),
        meta: nextMeta(state, action.at),
      };

    case "ADD_WORK_ITEM":
      return {
        ...state,
        workItems: [...state.workItems, action.workItem],
        meta: nextMeta(state, action.at),
      };

    case "UPDATE_WORK_ITEM_STATUS":
      return {
        ...state,
        workItems: state.workItems.map((workItem) =>
          workItem.id === action.workItemId
            ? {
                ...workItem,
                status: action.status,
                completedAt:
                  action.completedAt ?? workItem.completedAt,
              }
            : workItem,
        ),
        meta: nextMeta(state, action.at),
      };

    case "ADD_HANDOFF":
      return {
        ...state,
        handoffs: [...state.handoffs, action.handoff],
        activeHandoffId: action.handoff.id,
        meta: nextMeta(state, action.at),
      };

    case "UPDATE_HANDOFF_STATUS":
      return {
        ...state,
        handoffs: state.handoffs.map((handoff) =>
          handoff.id === action.handoffId
            ? {
                ...handoff,
                status: action.status,
                assignedOfficerId:
                  action.assignedOfficerId ??
                  handoff.assignedOfficerId,
                result: action.result ?? handoff.result,
                acceptedAt:
                  action.acceptedAt ?? handoff.acceptedAt,
                completedAt:
                  action.completedAt ?? handoff.completedAt,
              }
            : handoff,
        ),
        meta: nextMeta(state, action.at),
      };

    case "RECORD_APPROVAL":
      return {
        ...state,
        approvals: [
          ...state.approvals.filter(
            (approval) =>
              approval.requestId !== action.approval.requestId,
          ),
          action.approval,
        ],
        meta: nextMeta(state, action.at),
      };

    case "ISSUE_OUTCOME":
      return {
        ...state,
        outcomes: [
          ...state.outcomes.filter(
            (outcome) =>
              outcome.requestId !== action.outcome.requestId,
          ),
          action.outcome,
        ],
        meta: nextMeta(state, action.at),
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          action.notification,
          ...state.notifications,
        ],
        meta: nextMeta(state, action.at),
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.notificationId
            ? { ...notification, read: true }
            : notification,
        ),
        meta: nextMeta(state, action.at),
      };

    case "ADD_TIMELINE_EVENT":
      return {
        ...state,
        timelineEvents: [
          ...state.timelineEvents,
          action.event,
        ],
        meta: nextMeta(state, action.at),
      };

    case "ADD_ACTIVITY_EVENT":
      return {
        ...state,
        activityEvents: [
          ...state.activityEvents,
          action.event,
        ],
        meta: nextMeta(state, action.at),
      };

    case "HYDRATE_DEMO_STATE":
      return action.state.schemaVersion === 1
        ? action.state
        : state;

    case "RESET_DEMO":
      return createDemoSeedState();

    default: {
      const exhaustiveAction: never = action;
      return exhaustiveAction;
    }
  }
}
