import type {
  DemoEngineState,
  DemoHandoffRecord,
  DemoRequestRecord,
} from "@/types/demo/demo-state";

const closedRequestStatuses = new Set([
  "COMPLETED",
  "REJECTED",
]);

const closedHandoffStatuses = new Set([
  "COMPLETED",
  "DECLINED",
]);

export function selectRequestById(
  state: DemoEngineState,
  requestId: string,
): DemoRequestRecord | undefined {
  return state.requests.find(
    (request) => request.id === requestId,
  );
}

export function selectActiveRequest(
  state: DemoEngineState,
): DemoRequestRecord | undefined {
  return selectRequestById(state, state.activeRequestId);
}

export function selectHandoffById(
  state: DemoEngineState,
  handoffId: string,
): DemoHandoffRecord | undefined {
  return state.handoffs.find(
    (handoff) => handoff.id === handoffId,
  );
}

export function selectActiveHandoff(
  state: DemoEngineState,
): DemoHandoffRecord | undefined {
  return selectHandoffById(state, state.activeHandoffId);
}

export function selectOpenRequests(state: DemoEngineState) {
  return state.requests.filter(
    (request) => !closedRequestStatuses.has(request.status),
  );
}

export function selectPendingHandoffs(state: DemoEngineState) {
  return state.handoffs.filter(
    (handoff) => !closedHandoffStatuses.has(handoff.status),
  );
}

export function selectUnreadNotifications(
  state: DemoEngineState,
) {
  return state.notifications.filter(
    (notification) => !notification.read,
  );
}

export function selectDemoStateSummary(state: DemoEngineState) {
  return {
    totalRequests: state.requests.length,
    openRequests: selectOpenRequests(state).length,
    completedRequests: state.requests.filter(
      (request) => request.status === "COMPLETED",
    ).length,
    pendingHandoffs: selectPendingHandoffs(state).length,
    unreadNotifications:
      selectUnreadNotifications(state).length,
    revision: state.meta.revision,
  };
}
