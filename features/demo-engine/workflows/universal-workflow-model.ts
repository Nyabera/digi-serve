import type {
  DemoRole,
  DemoWorkflowConfig,
  DemoWorkflowStatus,
  DemoWorkflowStepType,
} from "../config";

export const UNIVERSAL_WORKFLOW_STEP_TYPES = [
  "start",
  "submission",
  "review",
  "verification",
  "task",
  "handoff",
  "approval",
  "decision",
  "automation",
  "notification",
  "output",
  "end",
] as const satisfies readonly DemoWorkflowStepType[];

export type UniversalWorkflowTransitionKind =
  | "sequence"
  | "conditional"
  | "handoff"
  | "approval"
  | "rejection"
  | "clarification"
  | "timeout"
  | "escalation";

export type UniversalWorkflowNode = {
  readonly id: string;
  readonly type: DemoWorkflowStepType;
  readonly label: string;
  readonly description?: string;
  readonly departmentId?: string;
  readonly role?: DemoRole;
  readonly slaId?: string;
  readonly conditionLabel?: string;
  readonly outputLabel?: string;
  readonly synthetic: boolean;
};

export type UniversalWorkflowTransition = {
  readonly id: string;
  readonly fromStepId: string;
  readonly toStepId: string;
  readonly kind: UniversalWorkflowTransitionKind;
  readonly label?: string;
  readonly conditionLabel?: string;
};

export type UniversalWorkflowModel = {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly category?: string;
  readonly status: DemoWorkflowStatus;
  readonly entryStepId: string;
  readonly terminalStepIds: readonly string[];
  readonly nodes: readonly UniversalWorkflowNode[];
  readonly transitions: readonly UniversalWorkflowTransition[];
};

function transitionKindFor(
  type: DemoWorkflowStepType,
): UniversalWorkflowTransitionKind {
  switch (type) {
    case "decision":
      return "conditional";
    case "handoff":
      return "handoff";
    case "approval":
      return "approval";
    case "start":
    case "submission":
    case "review":
    case "verification":
    case "task":
    case "automation":
    case "notification":
    case "output":
    case "end":
      return "sequence";
  }
}

function createTransitionId(
  workflowId: string,
  fromStepId: string,
  toStepId: string,
  index: number,
): string {
  return [
    workflowId,
    fromStepId,
    toStepId,
    String(index + 1),
  ].join("__");
}

function uniqueSyntheticId(
  workflow: DemoWorkflowConfig,
  suffix: "start" | "end",
): string {
  const base = `${workflow.id}__${suffix}`;
  const existingIds = new Set(
    workflow.steps.map((step) => step.id),
  );

  if (!existingIds.has(base)) {
    return base;
  }

  let sequence = 2;

  while (existingIds.has(`${base}_${sequence}`)) {
    sequence += 1;
  }

  return `${base}_${sequence}`;
}

export function createUniversalWorkflowModel(
  workflow: DemoWorkflowConfig,
): UniversalWorkflowModel {
  const configuredNodes: UniversalWorkflowNode[] =
    workflow.steps.map((step) => ({
      id: step.id,
      type: step.type,
      label: step.label,
      description: step.description,
      departmentId: step.departmentId,
      role: step.role,
      slaId: step.slaId,
      conditionLabel: step.conditionLabel,
      outputLabel: step.outputLabel,
      synthetic: false,
    }));

  const configuredStart = configuredNodes.find(
    (node) => node.type === "start",
  );
  const configuredEnds = configuredNodes.filter(
    (node) => node.type === "end",
  );

  const startNode: UniversalWorkflowNode =
    configuredStart ?? {
      id: uniqueSyntheticId(workflow, "start"),
      type: "start",
      label: "Start",
      description: "Workflow instance created",
      synthetic: true,
    };

  const endNodes: UniversalWorkflowNode[] =
    configuredEnds.length > 0
      ? configuredEnds
      : [
          {
            id: uniqueSyntheticId(workflow, "end"),
            type: "end",
            label: "End",
            description: "Workflow completed",
            synthetic: true,
          },
        ];

  const nodes = [
    ...(configuredStart ? [] : [startNode]),
    ...configuredNodes,
    ...(configuredEnds.length > 0 ? [] : endNodes),
  ];

  const transitions: UniversalWorkflowTransition[] = [];
  const firstOperationalNode = configuredNodes.find(
    (node) => node.type !== "start",
  );
  const defaultTerminalStepId = endNodes[0].id;

  if (!configuredStart) {
    const firstTarget =
      firstOperationalNode?.id ?? defaultTerminalStepId;

    transitions.push({
      id: createTransitionId(
        workflow.id,
        startNode.id,
        firstTarget,
        transitions.length,
      ),
      fromStepId: startNode.id,
      toStepId: firstTarget,
      kind: "sequence",
    });
  }

  for (const step of workflow.steps) {
    if (step.type === "end") {
      continue;
    }

    const explicitTargets = step.nextStepIds ?? [];
    const targets =
      explicitTargets.length > 0
        ? explicitTargets
        : [defaultTerminalStepId];

    for (const targetStepId of targets) {
      transitions.push({
        id: createTransitionId(
          workflow.id,
          step.id,
          targetStepId,
          transitions.length,
        ),
        fromStepId: step.id,
        toStepId: targetStepId,
        kind: transitionKindFor(step.type),
        conditionLabel: step.conditionLabel,
      });
    }
  }

  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    category: workflow.category,
    status: workflow.status,
    entryStepId: startNode.id,
    terminalStepIds: endNodes.map((node) => node.id),
    nodes,
    transitions,
  };
}

export function getUniversalWorkflowNode(
  model: UniversalWorkflowModel,
  stepId: string,
): UniversalWorkflowNode | undefined {
  return model.nodes.find((node) => node.id === stepId);
}

export function getOutgoingWorkflowTransitions(
  model: UniversalWorkflowModel,
  stepId: string,
): readonly UniversalWorkflowTransition[] {
  return model.transitions.filter(
    (transition) => transition.fromStepId === stepId,
  );
}

export function getIncomingWorkflowTransitions(
  model: UniversalWorkflowModel,
  stepId: string,
): readonly UniversalWorkflowTransition[] {
  return model.transitions.filter(
    (transition) => transition.toStepId === stepId,
  );
}

export function isTerminalWorkflowStep(
  model: UniversalWorkflowModel,
  stepId: string,
): boolean {
  return model.terminalStepIds.includes(stepId);
}

export function canTransitionWorkflow(
  model: UniversalWorkflowModel,
  fromStepId: string,
  toStepId: string,
): boolean {
  return model.transitions.some(
    (transition) =>
      transition.fromStepId === fromStepId &&
      transition.toStepId === toStepId,
  );
}
