# D30-9 Universal Workflow Model

## Purpose

D30-9 creates one universal workflow model for every Demo Pack and future
organization vertical.

A workflow is represented as:

```text
Nodes + transitions + entry step + terminal steps
```

The engine does not need to understand whether a workflow concerns a
transcript, supplier, medical file, permit or customer complaint.

## Universal step types

- Start
- Submission
- Review
- Verification
- Task
- Handoff
- Approval
- Decision
- Automation
- Notification
- Output
- End

## Universal transition types

- Sequence
- Conditional
- Handoff
- Approval
- Rejection
- Clarification
- Timeout
- Escalation

## Normalization

`createUniversalWorkflowModel()` converts a configured Demo Pack workflow into
a normalized model.

It:

- preserves configured workflow nodes;
- creates a synthetic Start node when one is absent;
- creates a synthetic End node when one is absent;
- converts `nextStepIds` into explicit transitions;
- routes terminal configured steps to the End node;
- identifies the entry step;
- identifies all terminal steps.

## Runtime instance

A universal workflow instance records:

- workflow ID;
- current step;
- visited steps;
- transition history;
- status.

The generic runtime can create and advance an instance without knowing the
workflow's business meaning.

## Builder integration

The visual workflow builder converts the universal model into builder nodes.

This prevents the Admin UI from maintaining a separate workflow structure.

## Boundary rule

The universal model owns structure and transition mechanics.

The active Demo Pack owns workflow names, labels, departments, SLA references,
conditions and outputs.
