import { describe, expect, it } from "vitest";

import type { DemoWorkflowConfig } from "../../../features/demo-engine/config/demo-pack.types";
import {
  canTransitionWorkflow,
  createUniversalWorkflowModel,
  getIncomingWorkflowTransitions,
  getOutgoingWorkflowTransitions,
  getUniversalWorkflowNode,
  isTerminalWorkflowStep,
} from "../../../features/demo-engine/workflows/universal-workflow-model";
import {
  advanceUniversalWorkflowInstance,
  createUniversalWorkflowInstance,
  resolveWorkflowTransition,
} from "../../../features/demo-engine/workflows/workflow-instance";

const linearWorkflow: DemoWorkflowConfig = {
  id: "student-clearance",
  name: "Student Clearance",
  status: "published",
  steps: [
    {
      id: "records-review",
      type: "review",
      label: "Records review",
      nextStepIds: ["registrar-approval"],
    },
    {
      id: "registrar-approval",
      type: "approval",
      label: "Registrar approval",
    },
  ],
};

const branchingWorkflow: DemoWorkflowConfig = {
  id: "course-application",
  name: "Course Application",
  status: "published",
  steps: [
    {
      id: "start",
      type: "start",
      label: "Application received",
      nextStepIds: ["eligibility-decision"],
    },
    {
      id: "eligibility-decision",
      type: "decision",
      label: "Eligibility decision",
      conditionLabel: "Does the applicant qualify?",
      nextStepIds: ["approved", "rejected"],
    },
    {
      id: "approved",
      type: "end",
      label: "Approved",
    },
    {
      id: "rejected",
      type: "end",
      label: "Rejected",
    },
  ],
};

describe("createUniversalWorkflowModel", () => {
  it("adds synthetic boundaries to a configured operational workflow", () => {
    const model = createUniversalWorkflowModel(linearWorkflow);

    expect(model.entryStepId).toBe("student-clearance__start");
    expect(model.terminalStepIds).toEqual(["student-clearance__end"]);
    expect(model.nodes).toHaveLength(4);
    expect(getUniversalWorkflowNode(model, model.entryStepId)).toMatchObject({
      type: "start",
      synthetic: true,
    });
    expect(
      getUniversalWorkflowNode(model, model.terminalStepIds[0]),
    ).toMatchObject({ type: "end", synthetic: true });
  });

  it("builds the expected sequence and approval transitions", () => {
    const model = createUniversalWorkflowModel(linearWorkflow);
    const approvalTransition = getOutgoingWorkflowTransitions(
      model,
      "registrar-approval",
    );

    expect(
      canTransitionWorkflow(model, model.entryStepId, "records-review"),
    ).toBe(true);
    expect(
      canTransitionWorkflow(model, "records-review", "registrar-approval"),
    ).toBe(true);
    expect(approvalTransition).toHaveLength(1);
    expect(approvalTransition[0]).toMatchObject({
      toStepId: model.terminalStepIds[0],
      kind: "approval",
    });
  });

  it("preserves configured start and terminal nodes", () => {
    const model = createUniversalWorkflowModel(branchingWorkflow);

    expect(model.entryStepId).toBe("start");
    expect(model.terminalStepIds).toEqual(["approved", "rejected"]);
    expect(model.nodes.every((node) => !node.synthetic)).toBe(true);
  });

  it("models decision branches as conditional transitions", () => {
    const model = createUniversalWorkflowModel(branchingWorkflow);
    const outgoing = getOutgoingWorkflowTransitions(
      model,
      "eligibility-decision",
    );

    expect(outgoing).toHaveLength(2);
    expect(outgoing.map((transition) => transition.toStepId)).toEqual([
      "approved",
      "rejected",
    ]);
    expect(
      outgoing.every((transition) => transition.kind === "conditional"),
    ).toBe(true);
    expect(getIncomingWorkflowTransitions(model, "rejected")).toHaveLength(1);
    expect(isTerminalWorkflowStep(model, "rejected")).toBe(true);
  });

  it("avoids collisions when creating synthetic node ids", () => {
    const workflow: DemoWorkflowConfig = {
      ...linearWorkflow,
      id: "collision",
      steps: [
        {
          id: "collision__start",
          type: "task",
          label: "Existing task",
        },
        {
          id: "collision__start_2",
          type: "task",
          label: "Second existing task",
        },
      ],
    };

    const model = createUniversalWorkflowModel(workflow);

    expect(model.entryStepId).toBe("collision__start_3");
    expect(new Set(model.nodes.map((node) => node.id)).size).toBe(
      model.nodes.length,
    );
  });
});

describe("universal workflow instances", () => {
  it("advances a linear workflow from not-started to completed", () => {
    const model = createUniversalWorkflowModel(linearWorkflow);
    const created = createUniversalWorkflowInstance(model);
    const reviewing = advanceUniversalWorkflowInstance(model, created);
    const approving = advanceUniversalWorkflowInstance(model, reviewing);
    const completed = advanceUniversalWorkflowInstance(model, approving);

    expect(created.status).toBe("not-started");
    expect(reviewing).toMatchObject({
      currentStepId: "records-review",
      status: "active",
    });
    expect(approving.currentStepId).toBe("registrar-approval");
    expect(completed).toMatchObject({
      currentStepId: model.terminalStepIds[0],
      status: "completed",
    });
    expect(completed.visitedStepIds).toHaveLength(4);
    expect(completed.transitionHistory).toHaveLength(3);
  });

  it("requires an explicit choice at a branch", () => {
    const model = createUniversalWorkflowModel(branchingWorkflow);
    const created = createUniversalWorkflowInstance(model);
    const decision = advanceUniversalWorkflowInstance(model, created);

    expect(() => advanceUniversalWorkflowInstance(model, decision)).toThrow(
      "requires an explicit transition selection",
    );
  });

  it("takes the selected branch and completes the workflow", () => {
    const model = createUniversalWorkflowModel(branchingWorkflow);
    const created = createUniversalWorkflowInstance(model);
    const decision = advanceUniversalWorkflowInstance(model, created);
    const rejectedTransition = getOutgoingWorkflowTransitions(
      model,
      decision.currentStepId,
    ).find((transition) => transition.toStepId === "rejected");

    expect(rejectedTransition).toBeDefined();

    const completed = advanceUniversalWorkflowInstance(
      model,
      decision,
      rejectedTransition?.id,
    );

    expect(completed).toMatchObject({
      currentStepId: "rejected",
      status: "completed",
    });
  });

  it("rejects an unavailable transition", () => {
    const model = createUniversalWorkflowModel(branchingWorkflow);

    expect(() =>
      resolveWorkflowTransition(model, "start", "missing-transition"),
    ).toThrow('Transition "missing-transition" is not available from "start".');
  });

  it("rejects an instance belonging to another workflow", () => {
    const model = createUniversalWorkflowModel(linearWorkflow);
    const foreignModel = createUniversalWorkflowModel({
      ...linearWorkflow,
      id: "foreign-workflow",
    });
    const foreignInstance = createUniversalWorkflowInstance(foreignModel);

    expect(() =>
      advanceUniversalWorkflowInstance(model, foreignInstance),
    ).toThrow("Workflow instance does not belong to this model.");
  });

  it("leaves a completed instance unchanged", () => {
    const model = createUniversalWorkflowModel({
      id: "already-complete",
      name: "Already Complete",
      status: "published",
      steps: [
        {
          id: "done",
          type: "end",
          label: "Done",
        },
      ],
    });
    const created = createUniversalWorkflowInstance(model);
    const completed = advanceUniversalWorkflowInstance(model, created);

    expect(completed.status).toBe("completed");
    expect(advanceUniversalWorkflowInstance(model, completed)).toBe(completed);
  });
});
