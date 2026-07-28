import {
  getOutgoingWorkflowTransitions,
  isTerminalWorkflowStep,
  type UniversalWorkflowModel,
  type UniversalWorkflowTransition,
} from "./universal-workflow-model";

export type UniversalWorkflowInstanceStatus =
  | "not-started"
  | "active"
  | "completed";

export type UniversalWorkflowInstance = {
  readonly workflowId: string;
  readonly currentStepId: string;
  readonly visitedStepIds: readonly string[];
  readonly transitionHistory: readonly string[];
  readonly status: UniversalWorkflowInstanceStatus;
};

export function createUniversalWorkflowInstance(
  model: UniversalWorkflowModel,
): UniversalWorkflowInstance {
  return {
    workflowId: model.id,
    currentStepId: model.entryStepId,
    visitedStepIds: [model.entryStepId],
    transitionHistory: [],
    status: isTerminalWorkflowStep(
      model,
      model.entryStepId,
    )
      ? "completed"
      : "not-started",
  };
}

export function resolveWorkflowTransition(
  model: UniversalWorkflowModel,
  currentStepId: string,
  transitionId?: string,
): UniversalWorkflowTransition {
  const outgoing = getOutgoingWorkflowTransitions(
    model,
    currentStepId,
  );

  if (transitionId) {
    const selected = outgoing.find(
      (transition) => transition.id === transitionId,
    );

    if (!selected) {
      throw new Error(
        `Transition "${transitionId}" is not available from ` +
          `"${currentStepId}".`,
      );
    }

    return selected;
  }

  if (outgoing.length !== 1) {
    throw new Error(
      `Step "${currentStepId}" requires an explicit ` +
        `transition selection.`,
    );
  }

  return outgoing[0];
}

export function advanceUniversalWorkflowInstance(
  model: UniversalWorkflowModel,
  instance: UniversalWorkflowInstance,
  transitionId?: string,
): UniversalWorkflowInstance {
  if (instance.workflowId !== model.id) {
    throw new Error(
      "Workflow instance does not belong to this model.",
    );
  }

  if (instance.status === "completed") {
    return instance;
  }

  const transition = resolveWorkflowTransition(
    model,
    instance.currentStepId,
    transitionId,
  );
  const completed = isTerminalWorkflowStep(
    model,
    transition.toStepId,
  );

  return {
    workflowId: instance.workflowId,
    currentStepId: transition.toStepId,
    visitedStepIds: [
      ...instance.visitedStepIds,
      transition.toStepId,
    ],
    transitionHistory: [
      ...instance.transitionHistory,
      transition.id,
    ],
    status: completed ? "completed" : "active",
  };
}
