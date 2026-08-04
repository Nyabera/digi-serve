"use client";

import { useRouter } from "next/navigation";
import {
  Maximize2,
  RefreshCw,
} from "lucide-react";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { getDemoSupervisorApprovalsReference } from "@/features/demo-engine/adapters/get-demo-supervisor-approvals-reference";
import { useDemoState } from "@/features/demo/state";
import { SupervisorApprovalBody } from "@/features/supervisor-approvals/components/supervisor-approval-body";
import type {
  SupervisorApprovalDetailModel,
  SupervisorDecision,
} from "@/features/supervisor-approvals/model/supervisor-approval-model";
import type {
  DemoDocumentRequirementConfig,
  DemoFormFieldConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type {
  DemoFormValue,
} from "@/types/demo/demo-state";

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type SupervisorApprovalWorkspaceProps = {
  readonly requestId: string;
  readonly organizationName: string;
  readonly service: DemoServiceConfig;
  readonly registrarDepartment: DepartmentOption;
};

type FinanceResultCode =
  | "CLEAR"
  | "HOLD"
  | "CANNOT_VERIFY";

type FinanceResultRecord = {
  readonly requestId: string;
  readonly departmentName: string;
  readonly result: FinanceResultCode;
  readonly note: string;
  readonly completedBy: string;
  readonly completedAt: string;
  readonly returnedTo: string;
};

type RegistrarDecisionRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly decision: SupervisorDecision;
  readonly internalNote: string;
  readonly applicantReason: string;
  readonly decidedBy: string;
  readonly profile: "Registrar";
  readonly departmentName: string;
  readonly decidedAt: string;
  readonly financeResult: FinanceResultCode | null;
  readonly immutable: boolean;
};

type UnknownRecord = Record<string, unknown>;

const DOCUMENT_FIELD_PREFIX = "__document:";
const OFFICER_REVIEW_STATUS_FIELD =
  "__officerReview:status";
const OFFICER_APPLICATION_CHECKED_FIELD =
  "__officerReview:applicationChecked";
const OFFICER_DOCUMENTS_CHECKED_FIELD =
  "__officerReview:documentsChecked";
const OFFICER_IDENTITY_CHECKED_FIELD =
  "__officerReview:identityChecked";
const LEGACY_DEPARTMENT_RESULT_FIELD =
  "__departmentProcessing:financeResult";
const DECISION_RECORD_FIELD =
  "__supervisorDecision:record";
const DECISION_STATUS_FIELD =
  "__supervisorDecision:status";
const DECISION_PUBLIC_STATUS_FIELD =
  "__supervisorDecision:publicStatus";

const REGISTRAR_NAME = "Dr. Miriam Wekesa";

function documentFieldKey(
  requirementId: string,
): string {
  return `${DOCUMENT_FIELD_PREFIX}${requirementId}`;
}

function asRecord(
  value: unknown,
): UnknownRecord {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as UnknownRecord;
  }

  return {};
}

function parseLegacyFinanceResult(
  value: DemoFormValue | undefined,
): FinanceResultRecord | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      value,
    );
    const candidate = asRecord(parsed);

    if (
      typeof candidate.requestId !== "string" ||
      typeof candidate.departmentName !==
        "string" ||
      ![
        "CLEAR",
        "HOLD",
        "CANNOT_VERIFY",
      ].includes(String(candidate.result)) ||
      typeof candidate.note !== "string" ||
      typeof candidate.completedBy !==
        "string" ||
      typeof candidate.completedAt !==
        "string" ||
      typeof candidate.returnedTo !== "string"
    ) {
      return null;
    }

    return parsed as FinanceResultRecord;
  } catch {
    return null;
  }
}

function parseModernFinanceResult(
  draft: Readonly<
    Record<string, DemoFormValue>
  >,
  requestId: string,
): FinanceResultRecord | null {
  const referralValue =
    draft["__officerReview:referral"];
  let preferredHandoffId: string | null = null;

  if (
    typeof referralValue === "string" &&
    referralValue.trim()
  ) {
    try {
      const referral = asRecord(
        JSON.parse(referralValue),
      );

      if (
        referral.requestId === requestId &&
        typeof referral.id === "string"
      ) {
        preferredHandoffId = referral.id;
      }
    } catch {
      preferredHandoffId = null;
    }
  }

  if (!preferredHandoffId) {
    const requestNumber = requestId.match(
      /REQ-DEMO-(\d+)$/,
    )?.[1];

    if (requestNumber) {
      preferredHandoffId =
        `HND-DEMO-${requestNumber}`;
    }
  }

  if (!preferredHandoffId) {
    return null;
  }

  const handoffPrefix =
    `__departmentHandoff:${preferredHandoffId}`;
  const resultValue =
    draft[`${handoffPrefix}:result`];
  const status =
    draft[`${handoffPrefix}:status`];
  const note =
    draft[`${handoffPrefix}:resultNote`];
  const completedAt =
    draft[`${handoffPrefix}:completedAt`];

  if (
    status !== "COMPLETED" ||
    typeof resultValue !== "string"
  ) {
    return null;
  }

  return {
    requestId,
    departmentName: "Finance",
    result:
      resultValue as FinanceResultCode,
    note:
      typeof note === "string"
        ? note
        : "Finance completed the departmental verification.",
    completedBy: "Amina Hassan",
    completedAt:
      typeof completedAt === "string"
        ? completedAt
        : new Date(0).toISOString(),
    returnedTo: "Student Records",
  };
}

function parseDecision(
  value: DemoFormValue | undefined,
): RegistrarDecisionRecord | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      value,
    );
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      ![
        "APPROVED",
        "REJECTED",
        "RETURNED_FOR_CLARIFICATION",
      ].includes(String(candidate.decision)) ||
      typeof candidate.internalNote !==
        "string" ||
      typeof candidate.applicantReason !==
        "string" ||
      typeof candidate.decidedBy !== "string" ||
      candidate.profile !== "Registrar" ||
      typeof candidate.departmentName !==
        "string" ||
      typeof candidate.decidedAt !== "string" ||
      typeof candidate.immutable !== "boolean"
    ) {
      return null;
    }

    return parsed as RegistrarDecisionRecord;
  } catch {
    return null;
  }
}

function hasValue(
  value: DemoFormValue | undefined,
): boolean {
  if (
    value === undefined ||
    value === null
  ) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

function formatFieldValue(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): string {
  if (!hasValue(value)) {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Confirmed" : "No";
  }

  if (
    field.options &&
    typeof value === "string"
  ) {
    return (
      field.options.find(
        (option) =>
          option.value === value,
      )?.label ?? value
    );
  }

  return String(value);
}

function documentLevelLabel(
  requirement: DemoDocumentRequirementConfig,
): string {
  switch (requirement.level) {
    case "REQUIRED":
      return "Required";
    case "CONDITIONAL":
      return "Conditional";
    case "OPTIONAL":
      return "Optional";
  }
}

function formatTimestamp(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function initials(
  name: string,
): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? "",
    )
    .join("");
}

function triggerPresentationShortcut() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "p",
      shiftKey: true,
      bubbles: true,
    }),
  );
}

function triggerResetShortcut() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "r",
      shiftKey: true,
      bubbles: true,
    }),
  );
}

export function SupervisorApprovalWorkspace({
  requestId,
  organizationName,
  service,
  registrarDepartment,
}: SupervisorApprovalWorkspaceProps) {
  const router = useRouter();
  const {
    state,
    dispatch,
    isHydrated,
  } = useDemoState();
  const reference =
    getDemoSupervisorApprovalsReference();

  const [internalNote, setInternalNote] =
    useState(
      "All required operational checks have been reviewed by the Registrar.",
    );
  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");
  const [
    clarificationReason,
    setClarificationReason,
  ] = useState("");
  const [
    decisionConfirmed,
    setDecisionConfirmed,
  ] = useState(false);
  const [
    feedbackMessage,
    setFeedbackMessage,
  ] = useState<string | null>(null);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const draft = useMemo(
    () =>
      state.formDrafts[service.slug] ?? {},
    [service.slug, state.formDrafts],
  );

  const requiredFields = useMemo(
    () =>
      service.form.sections.flatMap(
        (section) =>
          section.fields.filter(
            (field) => field.required,
          ),
      ),
    [service.form.sections],
  );

  const requiredDocuments = useMemo(
    () =>
      service.requiredDocuments.filter(
        (requirement) =>
          requirement.level ===
          "REQUIRED",
      ),
    [service.requiredDocuments],
  );

  const financeResult = useMemo(
    () =>
      parseModernFinanceResult(
        draft,
        requestId,
      ) ??
      parseLegacyFinanceResult(
        draft[
          LEGACY_DEPARTMENT_RESULT_FIELD
        ],
      ),
    [draft, requestId],
  );

  const existingDecision = useMemo(
    () =>
      parseDecision(
        draft[DECISION_RECORD_FIELD],
      ),
    [draft],
  );

  const applicationComplete =
    requiredFields.every((field) =>
      hasValue(draft[field.key]),
    );

  const requiredDocumentsComplete =
    requiredDocuments.every(
      (requirement) =>
        hasValue(
          draft[
            documentFieldKey(
              requirement.id,
            )
          ],
        ),
    );

  const officerReviewComplete =
    draft[
      OFFICER_APPLICATION_CHECKED_FIELD
    ] === true &&
    draft[
      OFFICER_DOCUMENTS_CHECKED_FIELD
    ] === true &&
    draft[
      OFFICER_IDENTITY_CHECKED_FIELD
    ] === true;

  const financeWorkComplete =
    financeResult !== null;

  const financeClear =
    financeResult?.result === "CLEAR";

  const unresolvedOfficerState = [
    "CORRECTION_REQUESTED",
    "FINANCE_CLARIFICATION_REQUIRED",
    "REFERRAL_DECLINED",
    "SUPERVISOR_CLARIFICATION_REQUIRED",
  ].includes(
    String(
      draft[
        OFFICER_REVIEW_STATUS_FIELD
      ] ?? "",
    ),
  );

  const approvalReady =
    applicationComplete &&
    requiredDocumentsComplete &&
    officerReviewComplete &&
    financeWorkComplete &&
    financeClear &&
    !unresolvedOfficerState;

  const rejectionReady =
    applicationComplete &&
    requiredDocumentsComplete &&
    financeResult !== null;

  const prerequisites = [
    {
      id: "application",
      label:
        "Required application fields are complete",
      passed: applicationComplete,
      detail: `${requiredFields.length} required configured fields checked`,
    },
    {
      id: "documents",
      label:
        "Required documents are available",
      passed: requiredDocumentsComplete,
      detail: `${requiredDocuments.length} required document records checked`,
    },
    {
      id: "officer",
      label:
        "Originating officer review is complete",
      passed: officerReviewComplete,
      detail:
        "Application, documents and identity checks",
    },
    {
      id: "finance-complete",
      label:
        "Finance work item is complete",
      passed: financeWorkComplete,
      detail: financeResult
        ? `Completed by ${financeResult.completedBy}`
        : "No completed Finance result found",
    },
    {
      id: "finance-clear",
      label: "Finance returned CLEAR",
      passed: financeClear,
      detail: financeResult
        ? `Finance result: ${financeResult.result}`
        : "No structured Finance result found",
    },
    {
      id: "unresolved",
      label:
        "No unresolved correction or clarification",
      passed: !unresolvedOfficerState,
      detail: String(
        draft[
          OFFICER_REVIEW_STATUS_FIELD
        ] ??
          "No blocking officer state",
      ),
    },
  ] as const;

  function saveValue(
    fieldKey: string,
    value: DemoFormValue,
    at: string,
  ) {
    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug: service.slug,
      fieldKey,
      value,
      at,
    });
  }

  function addActivity(
    name: string,
    at: string,
  ) {
    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-${name.toUpperCase()}-${at.replace(
          /\D/g,
          "",
        )}`,
        name,
        requestId,
        occurredAt: at,
      },
      at,
    });
  }

  function saveDecision(
    decision: SupervisorDecision,
    applicantReason: string,
    internalStatus: string,
    publicStatus: string,
    eventName: string,
  ) {
    if (existingDecision) {
      setErrorMessage(
        "A Registrar decision has already been recorded for this demonstration request.",
      );
      return;
    }

    if (!decisionConfirmed) {
      setErrorMessage(
        "Confirm the Registrar declaration before recording a decision.",
      );
      return;
    }

    const at =
      new Date().toISOString();
    const record: RegistrarDecisionRecord = {
      id: `DEC-REG-${at.replace(
        /\D/g,
        "",
      )}`,
      requestId,
      decision,
      internalNote:
        internalNote.trim(),
      applicantReason,
      decidedBy: REGISTRAR_NAME,
      profile: "Registrar",
      departmentName:
        registrarDepartment.name,
      decidedAt: at,
      financeResult:
        financeResult?.result ?? null,
      immutable:
        decision === "APPROVED" ||
        decision === "REJECTED",
    };

    saveValue(
      DECISION_RECORD_FIELD,
      JSON.stringify(record),
      at,
    );
    saveValue(
      DECISION_STATUS_FIELD,
      internalStatus,
      at,
    );
    saveValue(
      DECISION_PUBLIC_STATUS_FIELD,
      publicStatus,
      at,
    );
    saveValue(
      OFFICER_REVIEW_STATUS_FIELD,
      internalStatus,
      at,
    );
    addActivity(eventName, at);

    setErrorMessage(null);
    setFeedbackMessage(
      `${decision.replaceAll(
        "_",
        " ",
      )} recorded by the Registrar profile.`,
    );
  }

  function approveRequest() {
    if (!approvalReady) {
      setErrorMessage(
        "Approval is blocked until every approval prerequisite passes.",
      );
      return;
    }

    saveDecision(
      "APPROVED",
      "Your transcript request has been approved. The controlled outcome is now being prepared.",
      "APPROVED",
      "APPROVED",
      "request_approved",
    );
  }

  function rejectRequest(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const reason =
      rejectionReason.trim();

    if (!rejectionReady) {
      setErrorMessage(
        "Rejection requires a reviewed application, required documents and a Finance result.",
      );
      return;
    }

    if (!reason) {
      setErrorMessage(
        "Enter an applicant-visible rejection reason.",
      );
      return;
    }

    saveDecision(
      "REJECTED",
      reason,
      "REJECTED",
      "REJECTED",
      "request_rejected",
    );
  }

  function returnForClarification(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const reason =
      clarificationReason.trim();

    if (!reason) {
      setErrorMessage(
        "Enter the clarification required from Student Records.",
      );
      return;
    }

    saveDecision(
      "RETURNED_FOR_CLARIFICATION",
      reason,
      "SUPERVISOR_CLARIFICATION_REQUIRED",
      "ADDITIONAL_CHECKS_IN_PROGRESS",
      "request_returned_for_clarification",
    );
  }

  const applicantName =
    state.applicant.fullName ||
    "Demo applicant";

  const currentStatus =
    existingDecision?.decision ??
    (approvalReady
      ? "PENDING_APPROVAL"
      : "BLOCKED");

  const model: SupervisorApprovalDetailModel = {
    requestId,
    serviceName: service.name,
    applicantName,
    applicantInitials:
      initials(applicantName) || "DA",
    applicantEmail:
      state.applicant.email ||
      "applicant@example.com",
    applicantPhone:
      state.applicant.phone ||
      "+254 700 000 000",
    submittedLabel:
      "14 May 2026, 10:43 AM",
    parentOwnerName:
      "Student Records",
    registrarDepartmentName:
      registrarDepartment.name,
    decisionAuthorityName:
      REGISTRAR_NAME,
    currentStatusLabel:
      currentStatus.replaceAll(
        "_",
        " ",
      ),
    currentStatusTone:
      currentStatus === "APPROVED"
        ? "green"
        : currentStatus === "REJECTED"
          ? "red"
          : currentStatus ===
              "RETURNED_FOR_CLARIFICATION"
            ? "purple"
            : approvalReady
              ? "green"
              : "orange",
    financeResult:
      financeResult?.result ?? null,
    financeNote:
      financeResult?.note ??
      "Complete the Finance work item before approval.",
    financeCompletedBy:
      financeResult?.completedBy ?? "",
    financeCompletedAtLabel:
      financeResult
        ? formatTimestamp(
            financeResult.completedAt,
          )
        : "",
    prerequisites,
    applicationItems:
      requiredFields.slice(0, 6).map(
        (field) => ({
          id: field.key,
          label: field.label,
          value: formatFieldValue(
            field,
            draft[field.key],
          ),
        }),
      ),
    documents:
      service.requiredDocuments.map(
        (requirement) => {
          const available = hasValue(
            draft[
              documentFieldKey(
                requirement.id,
              )
            ],
          );

          return {
            id: requirement.id,
            name: requirement.name,
            levelLabel:
              documentLevelLabel(
                requirement,
              ),
            statusLabel: available
              ? "Available"
              : "Not selected",
            available,
          };
        },
      ),
    existingDecision:
      existingDecision
        ? {
            decision:
              existingDecision.decision,
            internalNote:
              existingDecision.internalNote,
            applicantReason:
              existingDecision.applicantReason,
            decidedBy:
              existingDecision.decidedBy,
            decidedAtLabel:
              formatTimestamp(
                existingDecision.decidedAt,
              ),
          }
        : null,
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-12">
        <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-slate-950">
            Restoring Registrar approval workspace…
          </p>
        </section>
      </main>
    );
  }

  return (
    <div
      data-d29r3-officer-shell="true"
      data-internal-shell-role="SUPERVISOR"
    >
      <InternalAppShell
        role="SUPERVISOR"
        institutionName={organizationName}
        institutionSubtitle="Student Services"
        institutionInitials="STC"
        staffName={REGISTRAR_NAME}
        staffRoleLabel="Registrar Supervisor"
        requestSelector={
          <label>
            <span className="sr-only">
              Open approval
            </span>
            <select
              className="input-base input-compact"
              value={
                `/demo/supervisor/approvals/${requestId}`
              }
              onChange={(event) =>
                router.push(
                  event.target.value,
                )
              }
            >
              {reference.approvals.map(
                (approval) => (
                  <option
                    key={approval.requestId}
                    value={approval.href}
                  >
                    {approval.requestId}
                  </option>
                ),
              )}
            </select>
          </label>
        }
        roleSelector={
          <label>
            <span className="sr-only">
              Switch workspace
            </span>
            <select
              className="input-base input-compact"
              value="/demo/supervisor"
              onChange={(event) =>
                router.push(
                  event.target.value,
                )
              }
            >
              <option value="/demo/officer">
                Officer
              </option>
              <option value="/demo/department">
                Finance
              </option>
              <option value="/demo/supervisor">
                Supervisor
              </option>
            </select>
          </label>
        }
        presentationAction={
          <button
            type="button"
            onClick={
              triggerPresentationShortcut
            }
            className="button-base button-compact button-secondary"
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            onClick={
              triggerResetShortcut
            }
            className="button-base button-compact button-destructive"
          >
            <RefreshCw aria-hidden="true" />
            Reset
          </button>
        }
      >
        <SupervisorApprovalBody
          model={model}
          approvalReady={approvalReady}
          rejectionReady={rejectionReady}
          decisionConfirmed={
            decisionConfirmed
          }
          internalNote={internalNote}
          rejectionReason={
            rejectionReason
          }
          clarificationReason={
            clarificationReason
          }
          feedbackMessage={
            feedbackMessage
          }
          errorMessage={errorMessage}
          onDecisionConfirmedChange={
            setDecisionConfirmed
          }
          onInternalNoteChange={
            setInternalNote
          }
          onRejectionReasonChange={
            setRejectionReason
          }
          onClarificationReasonChange={
            setClarificationReason
          }
          onApprove={approveRequest}
          onReject={rejectRequest}
          onReturn={
            returnForClarification
          }
        />
      </InternalAppShell>
    </div>
  );
}
