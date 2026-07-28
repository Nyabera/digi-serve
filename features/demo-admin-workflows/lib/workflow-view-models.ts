import type {
  DemoPack,
  DemoRequestStatus,
  DemoWorkflowPresentationTone,
} from "@/features/demo-engine/config";

export type WorkflowTemplateCard = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly usedCount: number;
  readonly steps: number;
  readonly tone: DemoWorkflowPresentationTone;
  readonly status: "Published" | "Draft";
};

export type ActiveWorkflowRow = {
  readonly id: string;
  readonly name: string;
  readonly template: string;
  readonly initiatedBy: string;
  readonly initiatedAt: string;
  readonly currentStep: string;
  readonly status: string;
};

export type RecentWorkflowActivity = {
  readonly title: string;
  readonly detail: string;
  readonly time: string;
  readonly tone: DemoWorkflowPresentationTone;
};

const tones = [
  "blue",
  "green",
  "purple",
  "orange",
] as const satisfies readonly DemoWorkflowPresentationTone[];

function displayStatus(status: DemoRequestStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "in-review":
      return "In Progress";
    case "awaiting-information":
      return "Clarification";
    case "pending-approval":
      return "Pending";
    case "approved":
      return "Approved";
    case "completed":
      return "Completed";
    case "rejected":
      return "Rejected";
    case "overdue":
      return "Overdue";
  }
}

function activityTone(
  status: DemoRequestStatus,
): DemoWorkflowPresentationTone {
  switch (status) {
    case "completed":
    case "approved":
      return "green";
    case "pending-approval":
    case "awaiting-information":
    case "overdue":
      return "orange";
    case "rejected":
      return "purple";
    case "draft":
    case "submitted":
    case "in-review":
      return "blue";
  }
}

function formatSubmittedAt(value?: string): string {
  if (!value) {
    return "Seeded demo date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildWorkflowTemplateCards(
  pack: DemoPack,
): WorkflowTemplateCard[] {
  return pack.workflows.map((workflow, index) => {
    const seededRequestCount = pack.requests.filter(
      (request) =>
        pack.services.find(
          (service) =>
            service.id === request.serviceId &&
            service.workflowId === workflow.id,
        ),
    ).length;

    return {
      id: workflow.id,
      name: workflow.name,
      description:
        workflow.description ??
        "Configurable workflow template.",
      category: workflow.category ?? "General",
      usedCount:
        workflow.usageCount ??
        Math.max(seededRequestCount, 1),
      steps: workflow.steps.length,
      tone:
        workflow.presentationTone ??
        tones[index % tones.length],
      status:
        workflow.status === "published"
          ? "Published"
          : "Draft",
    };
  });
}

export function buildActiveWorkflowRows(
  pack: DemoPack,
): ActiveWorkflowRow[] {
  return [...pack.requests]
    .sort((left, right) =>
      (right.submittedAt ?? "").localeCompare(
        left.submittedAt ?? "",
      ),
    )
    .map((request) => {
      const service = pack.services.find(
        (item) => item.id === request.serviceId,
      );
      const workflow = pack.workflows.find(
        (item) => item.id === service?.workflowId,
      );
      const requester = pack.users.find(
        (item) => item.id === request.requesterId,
      );
      const currentStep = workflow?.steps.find(
        (step) => step.id === request.currentStepId,
      );

      const workflowName =
        workflow?.name ??
        service?.name ??
        "Configured Workflow";
      const requesterName =
        requester?.name ?? "Demo Requester";

      return {
        id: request.id,
        name: `${workflowName} — ${requesterName}`,
        template: workflowName,
        initiatedBy: requesterName,
        initiatedAt: formatSubmittedAt(
          request.submittedAt,
        ),
        currentStep:
          currentStep?.label ?? "Awaiting next step",
        status: displayStatus(request.status),
      };
    });
}

export function buildRecentWorkflowActivity(
  pack: DemoPack,
): RecentWorkflowActivity[] {
  return [...pack.requests]
    .sort((left, right) =>
      (right.submittedAt ?? "").localeCompare(
        left.submittedAt ?? "",
      ),
    )
    .slice(0, 5)
    .map((request) => {
      const service = pack.services.find(
        (item) => item.id === request.serviceId,
      );
      const requester = pack.users.find(
        (item) => item.id === request.requesterId,
      );

      return {
        title: `${requester?.name ?? "Demo Requester"} — ${
          service?.name ?? "Configured Service"
        }`,
        detail: `Current status: ${displayStatus(
          request.status,
        )}`,
        time: formatSubmittedAt(request.submittedAt),
        tone: activityTone(request.status),
      };
    });
}
