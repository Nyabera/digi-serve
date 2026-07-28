import type {
  DemoWorkflowConfig,
  DemoWorkflowStepConfig,
  DemoWorkflowStepType,
} from "../config";

export type WorkflowBuilderNodeKind =
  | "start"
  | "approval"
  | "verification"
  | "task"
  | "automated"
  | "decision"
  | "end";

export type WorkflowBuilderNode = {
  readonly id: string;
  readonly kind: WorkflowBuilderNodeKind;
  readonly title: string;
  readonly description: string;
  readonly sla: string;
  readonly assignee: string;
};

export type WorkflowStepPaletteItem = {
  readonly kind: WorkflowBuilderNodeKind;
  readonly title: string;
  readonly description: string;
};

export const WORKFLOW_STEP_PALETTE = [
  {
    kind: "start",
    title: "Start",
    description: "Begin a workflow instance",
  },
  {
    kind: "approval",
    title: "Approval",
    description: "Require a named approval",
  },
  {
    kind: "verification",
    title: "Verification",
    description: "Validate information or documents",
  },
  {
    kind: "task",
    title: "Task",
    description: "Assign operational work",
  },
  {
    kind: "automated",
    title: "Automated Task",
    description: "Run a system action",
  },
  {
    kind: "decision",
    title: "Decision",
    description: "Branch using a condition",
  },
  {
    kind: "end",
    title: "End",
    description: "Complete the workflow",
  },
] as const satisfies readonly WorkflowStepPaletteItem[];

export const EMPTY_WORKFLOW_TEMPLATE: DemoWorkflowConfig = {
  id: "untitled-workflow",
  name: "Untitled Workflow",
  description: "A new configurable workflow.",
  category: "General",
  status: "draft",
  steps: [],
};

function toBuilderKind(
  type: DemoWorkflowStepType,
): WorkflowBuilderNodeKind {
  switch (type) {
    case "start":
      return "start";
    case "approval":
      return "approval";
    case "verification":
      return "verification";
    case "decision":
      return "decision";
    case "automation":
    case "notification":
    case "output":
      return "automated";
    case "end":
      return "end";
    case "submission":
    case "review":
    case "task":
    case "handoff":
      return "task";
  }
}

function defaultAssignee(
  step: DemoWorkflowStepConfig,
  resolveDepartmentName?: (departmentId: string) => string,
): string {
  if (step.departmentId) {
    return (
      resolveDepartmentName?.(step.departmentId) ??
      step.departmentId
    );
  }

  if (step.role) {
    return step.role;
  }

  if (
    step.type === "start" ||
    step.type === "automation" ||
    step.type === "notification" ||
    step.type === "output" ||
    step.type === "end"
  ) {
    return "System";
  }

  return "Unassigned role";
}

function toBuilderNode(
  step: DemoWorkflowStepConfig,
  resolveDepartmentName?: (departmentId: string) => string,
): WorkflowBuilderNode {
  return {
    id: step.id,
    kind: toBuilderKind(step.type),
    title: step.label,
    description:
      step.description ??
      step.conditionLabel ??
      step.outputLabel ??
      "Configured workflow step",
    sla: step.slaId ?? "Configured target",
    assignee: defaultAssignee(
      step,
      resolveDepartmentName,
    ),
  };
}

export function createWorkflowBuilderNodes(
  workflow: DemoWorkflowConfig,
  resolveDepartmentName?: (departmentId: string) => string,
): WorkflowBuilderNode[] {
  const converted = workflow.steps.map((step) =>
    toBuilderNode(step, resolveDepartmentName),
  );

  const hasStart = converted.some(
    (node) => node.kind === "start",
  );
  const hasEnd = converted.some(
    (node) => node.kind === "end",
  );

  return [
    ...(hasStart
      ? []
      : [
          {
            id: `${workflow.id}-start`,
            kind: "start" as const,
            title: "Start",
            description: "Workflow instance created",
            sla: "Immediate",
            assignee: "System",
          },
        ]),
    ...converted,
    ...(hasEnd
      ? []
      : [
          {
            id: `${workflow.id}-end`,
            kind: "end" as const,
            title: "End",
            description: "Workflow completed",
            sla: "Complete",
            assignee: "System",
          },
        ]),
  ];
}

export function createWorkflowBuilderNode(
  kind: WorkflowBuilderNodeKind,
  sequence: number,
): WorkflowBuilderNode {
  const item =
    WORKFLOW_STEP_PALETTE.find(
      (entry) => entry.kind === kind,
    ) ?? WORKFLOW_STEP_PALETTE[3];

  return {
    id: `${kind}-${sequence}`,
    kind,
    title: item.title,
    description: item.description,
    sla:
      kind === "start"
        ? "Immediate"
        : kind === "end"
          ? "Complete"
          : "1 working day",
    assignee:
      kind === "start" ||
      kind === "automated" ||
      kind === "end"
        ? "System"
        : "Unassigned role",
  };
}

export function reorderWorkflowBuilderNodes(
  nodes: readonly WorkflowBuilderNode[],
  sourceIndex: number,
  targetIndex: number,
): WorkflowBuilderNode[] {
  if (
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= nodes.length ||
    targetIndex >= nodes.length ||
    sourceIndex === targetIndex
  ) {
    return [...nodes];
  }

  const next = [...nodes];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}
