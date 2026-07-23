"use client";

import { useRouter } from "next/navigation";
import { Maximize2, RefreshCw } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { DepartmentProcessingBody } from "@/features/department-handoffs/components/department-processing-body";
import type {
  DepartmentHandoffResult,
  DepartmentHandoffStatus,
} from "@/features/department-handoffs/model/department-handoff-model";
import { getDemoDepartmentHandoffsReference } from "@/features/demo-engine/adapters/get-demo-department-handoffs-reference";
import { useDemoState } from "@/features/demo/state";

import {
  buildDepartmentHandoffContexts,
  findDepartmentHandoffContext,
  handoffFieldKey,
} from "./department-handoff-state";

type DepartmentOption = { readonly id: string; readonly name: string };
type Props = {
  readonly handoffId: string;
  readonly organizationName: string;
  readonly departments: readonly DepartmentOption[];
  readonly serviceSlugs: readonly string[];
};

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function triggerShortcut(key: "p" | "r") {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, shiftKey: true, bubbles: true }));
}

export function DepartmentHandoffProcessingWorkspace({
  handoffId,
  organizationName,
  departments,
  serviceSlugs,
}: Props) {
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

  const context = findDepartmentHandoffContext(contexts, handoffId);
  const [selectedResult, setSelectedResult] = useState<DepartmentHandoffResult>(context.result ?? "CLEAR");
  const [resultNote, setResultNote] = useState(
    context.resultNote ?? "The submitted payment reference was reviewed against the demonstration Finance record.",
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const financeDepartment = departments.find((department) => department.name === "Finance");

  function saveValue(fieldKey: string, value: string, at = new Date().toISOString()) {
    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug: context.serviceSlug,
      fieldKey,
      value,
      at,
    });
  }

  function addActivity(name: string, at = new Date().toISOString()) {
    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-${name.toUpperCase()}-${at.replace(/\D/g, "")}`,
        name,
        requestId: context.row.requestId,
        occurredAt: at,
      },
      at,
    });
  }

  function setStatus(status: DepartmentHandoffStatus, activityName: string) {
    const at = new Date().toISOString();
    saveValue(handoffFieldKey(context.row.id, "status"), status, at);
    addActivity(activityName, at);
  }

  function acceptHandoff() {
    if (context.row.status !== "PENDING_ACCEPTANCE") {
      setErrorMessage("Only a pending handoff can be accepted.");
      return;
    }
    setStatus("IN_PROGRESS", "handoff_accepted");
    setErrorMessage(null);
    setFeedbackMessage("Handoff accepted. Finance processing is now in progress.");
  }

  function completeHandoff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (context.row.status !== "IN_PROGRESS") {
      setErrorMessage("Accept the handoff before completing Finance processing.");
      return;
    }
    const note = resultNote.trim();
    if (!note) {
      setErrorMessage("Enter a Finance result note before completing the handoff.");
      return;
    }

    const at = new Date().toISOString();
    saveValue(handoffFieldKey(context.row.id, "result"), selectedResult, at);
    saveValue(handoffFieldKey(context.row.id, "resultNote"), note, at);
    saveValue(handoffFieldKey(context.row.id, "completedAt"), at, at);
    saveValue("__officerReview:status", "IN_REVIEW", at);
    saveValue("__officerReview:publicStatus", "IN_REVIEW", at);
    setStatus("COMPLETED", "handoff_completed");
    setErrorMessage(null);
    setFeedbackMessage(`${selectedResult.replaceAll("_", " ")} recorded. The Finance result was returned to Student Records.`);
  }

  function returnForClarification() {
    if (context.row.status !== "IN_PROGRESS") {
      setErrorMessage("Accept the handoff before returning it for clarification.");
      return;
    }
    const note = resultNote.trim();
    if (!note) {
      setErrorMessage("Enter the clarification required in the Finance note.");
      return;
    }
    const at = new Date().toISOString();
    saveValue(handoffFieldKey(context.row.id, "clarificationReason"), note, at);
    setStatus("RETURNED_FOR_CLARIFICATION", "handoff_returned_for_clarification");
    setErrorMessage(null);
    setFeedbackMessage("Handoff returned to Student Records for clarification.");
  }

  function declineHandoff() {
    if (context.row.status !== "IN_PROGRESS") {
      setErrorMessage("Accept the handoff before declining it.");
      return;
    }
    const note = resultNote.trim();
    if (!note) {
      setErrorMessage("Enter a decline reason in the Finance note.");
      return;
    }
    const at = new Date().toISOString();
    saveValue(handoffFieldKey(context.row.id, "declineReason"), note, at);
    setStatus("DECLINED", "handoff_declined");
    setErrorMessage(null);
    setFeedbackMessage("Handoff declined with a recorded Finance reason.");
  }

  if (!isHydrated) {
    return <main className="min-h-screen bg-slate-50 px-5 py-12"><p>Restoring Finance processing workspace…</p></main>;
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
            <select className="input-base input-compact" value={context.row.href} onChange={(event) => router.push(event.target.value)}>
              {contexts.map((candidate) => <option key={candidate.row.id} value={candidate.row.href}>{candidate.row.id}</option>)}
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
        <DepartmentProcessingBody
          model={{
            handoff: context.row,
            parentOwnerName: "Student Records",
            receivingDepartmentName: financeDepartment?.name ?? "Finance",
            receivingOfficerName: context.row.assignedOfficer,
            result: context.result,
            resultNote: context.resultNote,
            completedAtLabel: context.completedAt ? formatTimestamp(context.completedAt) : undefined,
          }}
          selectedResult={selectedResult}
          resultNote={resultNote}
          feedbackMessage={feedbackMessage}
          errorMessage={errorMessage}
          onAccept={acceptHandoff}
          onResultChange={setSelectedResult}
          onResultNoteChange={setResultNote}
          onComplete={completeHandoff}
          onReturnForClarification={returnForClarification}
          onDecline={declineHandoff}
        />
      </InternalAppShell>
    </div>
  );
}
