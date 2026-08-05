"use client";

import Link from "next/link";
import {
  type DragEvent,
  type FormEvent,
  useMemo, useRef, useState,
} from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  FileText,
  GitBranch,
  GripVertical,
  History,
  Play,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCheck,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  buildAdminWorkflowOverviewHref,
} from "@/features/demo-engine/navigation/admin-workflow-route-compatibility";
import {
  createWorkflowBuilderNode,
  createWorkflowBuilderNodes,
  EMPTY_WORKFLOW_TEMPLATE,
  type WorkflowBuilderNode as WorkflowNode,
  type WorkflowBuilderNodeKind as NodeKind,
  WORKFLOW_STEP_PALETTE as palette,
} from "@/features/demo-engine/workflows";
import {
  useDemoDepartments,
  useDemoWorkflows,
} from "@/features/demo-engine/config";
import styles from "./workflow-builder.module.css";

type EditableField = "title" | "description" | "sla" | "assignee";

type WorkflowBuilderProps = {
  initialTemplateId?: string;
};

function iconForKind(
  kind: NodeKind,
): LucideIcon {
  switch (kind) {
    case "start":
      return Play;
    case "approval":
      return UserCheck;
    case "verification":
      return ShieldCheck;
    case "task":
      return FileText;
    case "automated":
      return Zap;
    case "decision":
      return GitBranch;
    case "end":
      return CheckCircle2;
  }
}

export function WorkflowBuilder({
  initialTemplateId = "transcript-request",
}: WorkflowBuilderProps) {
  const workflows = useDemoWorkflows();
  const departments = useDemoDepartments();
  const selectedTemplate =
    workflows.find(
      (workflow) => workflow.id === initialTemplateId,
    ) ??
    workflows[0] ??
    EMPTY_WORKFLOW_TEMPLATE;

  const initialBuilderNodes = useMemo(
    () =>
      createWorkflowBuilderNodes(
        selectedTemplate,
        (departmentId) =>
          departments.find(
            (department) =>
              department.id === departmentId,
          )?.name ?? departmentId,
      ),
    [departments, selectedTemplate],
  );

  const nodeIdSequenceRef = useRef(
    initialBuilderNodes.length,
  );

  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialBuilderNodes,
  );
  const [selectedId, setSelectedId] = useState("document-check");
  const [status, setStatus] = useState(
    `${selectedTemplate.name} template loaded in demo mode.`,
  );
  const [zoom, setZoom] = useState(100);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? nodes[0],
    [nodes, selectedId],
  );

  const addNode = (kind: NodeKind) => {
    nodeIdSequenceRef.current += 1;

    const node = createWorkflowBuilderNode(
      kind,
      nodeIdSequenceRef.current,
    );

    setNodes((current) => [...current, node]);
    setSelectedId(node.id);
    setStatus(`${node.title} added to the workflow.`);
  };

  const handlePaletteDragStart = (
    event: DragEvent<HTMLButtonElement>,
    kind: NodeKind,
  ) => {
    event.dataTransfer.setData("application/x-faidia-step", kind);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleNodeDragStart = (
    event: DragEvent<HTMLElement>,
    index: number,
  ) => {
    event.dataTransfer.setData("application/x-faidia-node-index", String(index));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData(
      "application/x-faidia-step",
    ) as NodeKind;

    if (kind) addNode(kind);
  };

  const handleNodeDrop = (
    event: DragEvent<HTMLElement>,
    targetIndex: number,
  ) => {
    const rawIndex = event.dataTransfer.getData(
      "application/x-faidia-node-index",
    );

    if (!rawIndex) return;

    event.preventDefault();
    event.stopPropagation();

    const sourceIndex = Number(rawIndex);
    if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    setNodes((current) => {
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setStatus("Workflow step reordered.");
  };

  const updateSelected = (field: EditableField, value: string) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === selectedId ? { ...node, [field]: value } : node,
      ),
    );
  };

  const removeNode = (id: string) => {
    setNodes((current) => current.filter((node) => node.id !== id));

    if (selectedId === id) {
      const replacement = nodes.find((node) => node.id !== id);
      setSelectedId(replacement?.id ?? "");
    }

    setStatus("Workflow step removed.");
  };

  const handleSettingsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Step settings saved in browser memory.");
  };

  return (
    <main className={styles.builderPage}>
      <header className={styles.builderHeader}>
        <div className={styles.breadcrumbs}>
          <Link href={buildAdminWorkflowOverviewHref()}>
            <ArrowLeft aria-hidden="true" size={15} />
            Workflows
          </Link>
          <span>/</span>
          <strong>{selectedTemplate.name}</strong>
          <span className={styles.version}>v1.3</span>
          <span className={styles.draft}>Draft</span>
        </div>

        <div className={styles.headerActions}>
          <button onClick={() => setStatus("Preview opened in demo mode.")} type="button">
            <Eye aria-hidden="true" size={15} /> Preview
          </button>
          <button onClick={() => setStatus("Draft saved in browser memory.")} type="button">
            <Save aria-hidden="true" size={15} /> Save Draft
          </button>
          <button
            className={styles.publishButton}
            onClick={() =>
              setStatus("Demo publish complete. No production workflow was changed.")
            }
            type="button"
          >
            <CheckCircle2 aria-hidden="true" size={15} /> Publish
          </button>
          <button onClick={() => setStatus("Template duplicated in demo mode.")} type="button">
            <Copy aria-hidden="true" size={15} /> Duplicate
          </button>
          <button onClick={() => setStatus("Version history opened in demo mode.")} type="button">
            <History aria-hidden="true" size={15} /> Version History
          </button>
        </div>
      </header>

      <nav aria-label="Workflow builder sections" className={styles.tabs}>
        <button aria-current="page" type="button">Builder</button>
        <button onClick={() => setStatus("Workflow settings selected.")} type="button">
          Settings
        </button>
        <button onClick={() => setStatus("Access and visibility selected.")} type="button">
          Access &amp; Visibility
        </button>

        <div className={styles.zoomControls}>
          <button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(70, value - 10))} type="button">−</button>
          <span>{zoom}%</span>
          <button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(130, value + 10))} type="button">+</button>
        </div>
      </nav>

      <div className={styles.builderGrid}>
        <aside className={styles.palettePanel}>
          <div className={styles.panelHeading}>
            <h2>Add Step</h2>
            <p>Drag and drop a step to the canvas</p>
          </div>

          <div className={styles.paletteSection}>
            <h3>Start / End</h3>
            {palette
              .filter((item) => item.kind === "start" || item.kind === "end")
              .map((item) => {
                const Icon = iconForKind(item.kind);
                return (
                  <button
                    draggable
                    key={item.kind}
                    onClick={() => addNode(item.kind)}
                    onDragStart={(event) => handlePaletteDragStart(event, item.kind)}
                    type="button"
                  >
                    <span data-kind={item.kind}><Icon aria-hidden="true" size={15} /></span>
                    {item.title}
                    <GripVertical aria-hidden="true" size={13} />
                  </button>
                );
              })}
          </div>

          <div className={styles.paletteSection}>
            <h3>Process Steps</h3>
            {palette
              .filter((item) => item.kind !== "start" && item.kind !== "end")
              .map((item) => {
                const Icon = iconForKind(item.kind);
                return (
                  <button
                    draggable
                    key={item.kind}
                    onClick={() => addNode(item.kind)}
                    onDragStart={(event) => handlePaletteDragStart(event, item.kind)}
                    type="button"
                  >
                    <span data-kind={item.kind}><Icon aria-hidden="true" size={15} /></span>
                    {item.title}
                    <GripVertical aria-hidden="true" size={13} />
                  </button>
                );
              })}
          </div>

          <div className={styles.paletteSection}>
            <h3>Connectors</h3>
            <button onClick={() => setStatus("Sequence connector selected.")} type="button">
              <span><Workflow aria-hidden="true" size={15} /></span>
              Sequence Flow
            </button>
            <button onClick={() => setStatus("Conditional connector selected.")} type="button">
              <span><GitBranch aria-hidden="true" size={15} /></span>
              Conditional Flow
            </button>
          </div>

          <div className={styles.minimap}>
            <div className={styles.minimapHeader}>
              <strong>Minimap</strong>
              <span>{nodes.length} steps</span>
            </div>
            <div>
              {nodes.map((node) => (
                <span data-kind={node.kind} key={node.id} />
              ))}
            </div>
          </div>
        </aside>

        <section className={styles.canvasPanel}>
          <div className={styles.canvasInfo}>
            <div>
              <Workflow aria-hidden="true" size={15} />
              <span>Dynamic Workflow Engine / Visual Workflow Builder</span>
            </div>
            <small>Drag steps from the left. Drag cards to reorder.</small>
          </div>

          <div
            className={styles.canvas}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleCanvasDrop}
          >
            <div
              className={styles.canvasScale}
              style={{ transform: `scale(${zoom / 100})` }}
            >
              {nodes.map((node, index) => {
                const Icon = iconForKind(node.kind);
                const selected = node.id === selectedId;

                return (
                  <article
                    aria-current={selected ? "step" : undefined}
                    className={styles.workflowNode}
                    data-kind={node.kind}
                    draggable
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(event) => handleNodeDragStart(event, index)}
                    onDrop={(event) => handleNodeDrop(event, index)}
                  >
                    <span className={styles.nodeIcon}>
                      <Icon aria-hidden="true" size={17} />
                    </span>
                    <div>
                      <strong>{node.title}</strong>
                      <p>{node.description}</p>
                      <small>{node.assignee} · SLA: {node.sla}</small>
                    </div>
                    <button
                      aria-label={`Remove ${node.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeNode(node.id);
                      }}
                      type="button"
                    >
                      <Trash2 aria-hidden="true" size={14} />
                    </button>
                    {index < nodes.length - 1 ? (
                      <span aria-hidden="true" className={styles.connector} />
                    ) : null}
                  </article>
                );
              })}

              <button className={styles.dropHint} onClick={() => addNode("task")} type="button">
                <Plus aria-hidden="true" size={15} />
                Drop a step here or add a task
              </button>
            </div>
          </div>
        </section>

        <aside className={styles.settingsPanel}>
          <div className={styles.settingsHeader}>
            <div>
              <h2>Step Settings</h2>
              <p>{selectedNode?.kind ?? "No step selected"}</p>
            </div>
            <button aria-label="Close settings" onClick={() => setStatus("Settings remain available in demo mode.")} type="button">
              <X aria-hidden="true" size={16} />
            </button>
          </div>

          <nav className={styles.settingsTabs}>
            <button aria-current="page" type="button">General</button>
            <button type="button">SLA</button>
            <button type="button">Rules</button>
            <button type="button">Fields</button>
            <button type="button">Notifications</button>
          </nav>

          {selectedNode ? (
            <form className={styles.settingsForm} onSubmit={handleSettingsSubmit}>
              <h3>Step Information</h3>

              <label>
                <span>Step Name</span>
                <input
                  onChange={(event) => updateSelected("title", event.target.value)}
                  value={selectedNode.title}
                />
              </label>

              <label>
                <span>Description</span>
                <textarea
                  onChange={(event) => updateSelected("description", event.target.value)}
                  value={selectedNode.description}
                />
              </label>

              <label>
                <span>Assignee</span>
                <select
                  onChange={(event) => updateSelected("assignee", event.target.value)}
                  value={selectedNode.assignee}
                >
                  <option>{selectedNode.assignee}</option>
                  <option>Student Services</option>
                  <option>Verification Officer</option>
                  <option>Finance Office</option>
                  <option>Head of Department</option>
                  <option>Registrar Office</option>
                  <option>System</option>
                </select>
              </label>

              <label>
                <span>SLA target</span>
                <select
                  onChange={(event) => updateSelected("sla", event.target.value)}
                  value={selectedNode.sla}
                >
                  <option>{selectedNode.sla}</option>
                  <option>Immediate</option>
                  <option>4 working hours</option>
                  <option>1 working day</option>
                  <option>2 working days</option>
                  <option>3 working days</option>
                </select>
              </label>

              <div className={styles.toggleRows}>
                <label>
                  <span><strong>Mandatory Step</strong><small>Cannot be skipped by an officer</small></span>
                  <input defaultChecked type="checkbox" />
                </label>
                <label>
                  <span><strong>Allow Reassignment</strong><small>Supervisors may change the assignee</small></span>
                  <input defaultChecked type="checkbox" />
                </label>
                <label>
                  <span><strong>Send Notification</strong><small>Notify the assignee when work arrives</small></span>
                  <input defaultChecked type="checkbox" />
                </label>
              </div>

              <section className={styles.conditionCard}>
                <div>
                  <GitBranch aria-hidden="true" size={15} />
                  <strong>Conditions</strong>
                  <button type="button">Add condition</button>
                </div>
                <p>Proceed when all configured conditions are met.</p>
                <div>
                  <select defaultValue="Document Status">
                    <option>Document Status</option>
                    <option>Payment Status</option>
                    <option>Applicant Type</option>
                  </select>
                  <select defaultValue="is"><option>is</option><option>is not</option></select>
                  <select defaultValue="Valid"><option>Valid</option><option>Pending</option><option>Rejected</option></select>
                </div>
              </section>

              <section className={styles.timeoutCard}>
                <div><Clock3 aria-hidden="true" size={15} /><strong>Timeout Handling</strong></div>
                <div>
                  <label>
                    <span>Action on timeout</span>
                    <select defaultValue="Escalate">
                      <option>Escalate</option>
                      <option>Reassign</option>
                      <option>Notify supervisor</option>
                    </select>
                  </label>
                  <label>
                    <span>Escalate to</span>
                    <select defaultValue="HOD">
                      <option>HOD</option>
                      <option>Registrar</option>
                      <option>Institution Admin</option>
                    </select>
                  </label>
                </div>
              </section>

              <button className={styles.saveSettings} type="submit">
                <Settings2 aria-hidden="true" size={15} />
                Save Step Settings
              </button>
            </form>
          ) : (
            <p className={styles.emptySettings}>Select a workflow step to edit its settings.</p>
          )}
        </aside>
      </div>

      <footer className={styles.builderStatus}>
        <div><Bell aria-hidden="true" size={15} /><span role="status">{status}</span></div>
        <small>Demo-only drag-and-drop configuration. Nothing is written to Supabase or published externally.</small>
      </footer>
    </main>
  );
}
