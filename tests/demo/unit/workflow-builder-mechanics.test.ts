import { describe, expect, it } from "vitest";

import type { DemoWorkflowConfig } from "../../../features/demo-engine/config/demo-pack.types";
import {
  createWorkflowBuilderNode,
  createWorkflowBuilderNodes,
  reorderWorkflowBuilderNodes,
} from "../../../features/demo-engine/workflows/workflow-builder-mechanics";

const workflow: DemoWorkflowConfig = {
  id: "transcript-request",
  name: "Transcript Request",
  status: "published",
  steps: [
    {
      id: "start",
      type: "start",
      label: "Request received",
      nextStepIds: ["records-review"],
    },
    {
      id: "records-review",
      type: "review",
      label: "Records review",
      description: "Check the applicant record.",
      departmentId: "student-records",
      slaId: "sla-records-review",
      nextStepIds: ["notify-applicant"],
    },
    {
      id: "notify-applicant",
      type: "notification",
      label: "Notify applicant",
    },
    {
      id: "end",
      type: "end",
      label: "Complete",
    },
  ],
};

describe("workflow builder mechanics", () => {
  it("maps workflow configuration into builder nodes", () => {
    const nodes = createWorkflowBuilderNodes(workflow, (departmentId) =>
      departmentId === "student-records" ? "Student Records" : departmentId,
    );

    expect(nodes).toHaveLength(4);
    expect(nodes[1]).toEqual({
      id: "records-review",
      kind: "task",
      title: "Records review",
      description: "Check the applicant record.",
      sla: "sla-records-review",
      assignee: "Student Records",
    });
    expect(nodes[2]).toMatchObject({
      kind: "automated",
      assignee: "System",
    });
  });

  it("creates operational nodes with useful defaults", () => {
    expect(createWorkflowBuilderNode("approval", 3)).toEqual({
      id: "approval-3",
      kind: "approval",
      title: "Approval",
      description: "Require a named approval",
      sla: "1 working day",
      assignee: "Unassigned role",
    });
  });

  it("uses system-specific defaults for boundary nodes", () => {
    expect(createWorkflowBuilderNode("start", 1)).toMatchObject({
      sla: "Immediate",
      assignee: "System",
    });
    expect(createWorkflowBuilderNode("end", 4)).toMatchObject({
      sla: "Complete",
      assignee: "System",
    });
  });

  it("reorders nodes without mutating the source array", () => {
    const nodes = createWorkflowBuilderNodes(workflow);
    const originalIds = nodes.map((node) => node.id);
    const reordered = reorderWorkflowBuilderNodes(nodes, 1, 3);

    expect(nodes.map((node) => node.id)).toEqual(originalIds);
    expect(reordered.map((node) => node.id)).toEqual([
      "start",
      "notify-applicant",
      "end",
      "records-review",
    ]);
  });

  it("returns an unchanged copy for invalid reorder positions", () => {
    const nodes = createWorkflowBuilderNodes(workflow);
    const reordered = reorderWorkflowBuilderNodes(nodes, -1, 2);

    expect(reordered).toEqual(nodes);
    expect(reordered).not.toBe(nodes);
  });
});
