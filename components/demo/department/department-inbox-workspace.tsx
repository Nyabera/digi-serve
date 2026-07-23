"use client";

import { useRouter } from "next/navigation";
import { Maximize2, RefreshCw } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { DepartmentInboxBody } from "@/features/department-handoffs/components/department-inbox-body";
import type { DepartmentHandoffStatus } from "@/features/department-handoffs/model/department-handoff-model";
import { getDemoDepartmentHandoffsReference } from "@/features/demo-engine/adapters/get-demo-department-handoffs-reference";
import { useDemoState } from "@/features/demo/state";

import {
  buildDepartmentHandoffContexts,
  findDepartmentHandoffContext,
  handoffFieldKey,
} from "./department-handoff-state";

type DepartmentOption = { readonly id: string; readonly name: string };
type Props = {
  readonly organizationName: string;
  readonly departments: readonly DepartmentOption[];
  readonly serviceSlugs: readonly string[];
};
type ActionMode = "RETURN" | "DECLINE" | null;

function triggerShortcut(key: "p" | "r") {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey: true, bubbles: true }));
}

export function DepartmentInboxWorkspace({ organizationName, serviceSlugs }: Props) {
  const router = useRouter();
  const { state, dispatch, isHydrated } = useDemoState();
  const reference = getDemoDepartmentHandoffsReference();

  const contexts = useMemo(
    () =>
      buildDepartmentHandoffContexts({
        formDrafts: state.formDrafts,
        fixtureRows: reference.rows,
        serviceSlugs,
        applicantName: state.applicant.fullName,
      }),
    [reference.rows, serviceSlugs, state.applicant.fullName, state.formDrafts],
  );

  const [selectedId, setSelectedId] = useState(reference.rows[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("DUE");
  const [actionMode, setActionMode] = useState<ActionMode>(null);
  const [actionReason, setActionReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedContext = findDepartmentHandoffContext(contexts, selectedId);

  const visibleRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const rows = contexts.map((context) => context.row).filter((row) => {
      const matchesQuery =
        !normalized ||
        [row.id, row.requestId, row.requestTitle, row.applicantName, row.fromDepartment, row.requestedAction]
          .some((value) => value.toLowerCase().includes(normalized));
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "DUE_TODAY"
          ? row.dueStateLabel.toLowerCase().includes("today")
          : row.status === statusFilter);
      return matchesQuery && matchesStatus;
    });

    return [...rows].sort((left, right) => {
      if (sortBy === "STATUS") return left.statusLabel.localeCompare(right.statusLabel);
      if (sortBy === "DEPARTMENT") return left.fromDepartment.localeCompare(right.fromDepartment);
      return left.dueDateLabel.localeCompare(right.dueDateLabel);
    });
  }, [contexts, query, sortBy, statusFilter]);

  function saveValue(fieldKey: string, value: string, at = new Date().toISOString()) {
    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug: selectedContext.serviceSlug,
      fieldKey,
      value,
      at,
    });
  }

  function addActivity(name: string, at = new Date().toISOString()) {
    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-${name.toUpperCase()}-${Date.now()}`,
        name,
        requestId: selectedContext.row.requestId,
        occurredAt: at,
      },
      at,
    });
  }

  function setStatus(status: DepartmentHandoffStatus, activityName: string) {
    const at = new Date().toISOString();
    saveValue(handoffFieldKey(selectedContext.row.id, "status"), status, at);
    addActivity(activityName, at);
  }

  function acceptHandoff() {
    if (selectedContext.row.status !== "PENDING_ACCEPTANCE") {
      setErrorMessage("Only a pending handoff can be accepted.");
      return;
    }
    setStatus("IN_PROGRESS", "handoff_accepted");
    setErrorMessage(null);
    setFeedbackMessage("Handoff accepted. Finance processing is now in progress.");
  }

  function submitSecondaryAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reason = actionReason.trim();
    if (!actionMode || !reason) {
      setErrorMessage("Enter a reason before confirming this action.");
      return;
    }

    const at = new Date().toISOString();
    saveValue(
      handoffFieldKey(selectedContext.row.id, actionMode === "RETURN" ? "clarificationReason" : "declineReason"),
      reason,
      at,
    );
    setStatus(
      actionMode === "RETURN" ? "RETURNED_FOR_CLARIFICATION" : "DECLINED",
      actionMode === "RETURN" ? "handoff_returned_for_clarification" : "handoff_declined",
    );
    setFeedbackMessage(
      actionMode === "RETURN"
        ? "Handoff returned to Student Records for clarification."
        : "Handoff declined with a recorded reason.",
    );
    setActionMode(null);
    setActionReason("");
    setErrorMessage(null);
  }

  if (!isHydrated) {
    return <main className="min-h-screen bg-slate-50 px-5 py-12"><p>Restoring Finance handoff inbox…</p></main>;
  }

  return (
    <div data-d29r3-officer-shell="true" data-internal-shell-role="DEPARTMENT">
      <InternalAppShell
        role="DEPARTMENT"
        institutionName={organizationName}
        institutionSubtitle="Student Services"
        institutionInitials="STC"
        staffName="Amina Hassan"
        staffRoleLabel="Finance Officer"
        requestSelector={
          <label>
            <span className="sr-only">Open handoff</span>
            <select className="input-base input-compact" value={selectedContext.row.href} onChange={(event) => router.push(event.target.value)}>
              {contexts.map((context) => <option key={context.row.id} value={context.row.href}>{context.row.id}</option>)}
            </select>
          </label>
        }
        roleSelector={
          <label>
            <span className="sr-only">Switch workspace</span>
            <select className="input-base input-compact" value="/demo/department" onChange={(event) => router.push(event.target.value)}>
              <option value="/demo/officer">Officer</option>
              <option value="/demo/department">Finance</option>
              <option value="/demo/supervisor">Supervisor</option>
            </select>
          </label>
        }
        presentationAction={<button type="button" onClick={() => triggerShortcut("p")} className="button-base button-compact button-secondary"><Maximize2 aria-hidden="true" />Present</button>}
        resetAction={<button type="button" onClick={() => triggerShortcut("r")} className="button-base button-compact button-destructive"><RefreshCw aria-hidden="true" />Reset</button>}
      >
        <DepartmentInboxBody
          model={{ ...reference, rows: contexts.map((context) => context.row) }}
          visibleRows={visibleRows}
          selectedHandoff={selectedContext.row}
          query={query}
          statusFilter={statusFilter}
          sortBy={sortBy}
          actionMode={actionMode}
          actionReason={actionReason}
          feedbackMessage={feedbackMessage}
          errorMessage={errorMessage}
          onQueryChange={setQuery}
          onStatusFilterChange={setStatusFilter}
          onSortByChange={setSortBy}
          onSelectHandoff={(handoffId) => {
            setSelectedId(handoffId);
            setActionMode(null);
            setActionReason("");
          }}
          onAccept={acceptHandoff}
          onActionModeChange={setActionMode}
          onActionReasonChange={setActionReason}
          onSubmitSecondaryAction={submitSecondaryAction}
        />
      </InternalAppShell>
    </div>
  );
}
