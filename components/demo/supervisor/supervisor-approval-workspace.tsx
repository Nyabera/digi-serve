"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  RotateCcw,
  ShieldCheck,
  UserRoundCheck,
  XCircle,
} from "lucide-react";
import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useDemoState } from "@/features/demo/state";
import type {
  DemoDocumentRequirementConfig,
  DemoFormFieldConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

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

type ReferralRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly originatingDepartmentName: string;
  readonly receivingDepartmentName: string;
  readonly requestedAction: string;
  readonly expectedOutput: string;
  readonly dueDate: string;
  readonly status:
    | "PENDING_ACCEPTANCE"
    | "ACCEPTED"
    | "COMPLETED"
    | "DECLINED"
    | "RETURNED_FOR_CLARIFICATION";
  readonly result?: FinanceResultCode;
  readonly resultNote?: string;
};

type RegistrarDecisionType =
  | "APPROVED"
  | "REJECTED"
  | "RETURNED_FOR_CLARIFICATION";

type RegistrarDecisionRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly decision: RegistrarDecisionType;
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
const OFFICER_REFERRAL_FIELD =
  "__officerReview:referral";
const DEPARTMENT_RESULT_FIELD =
  "__departmentProcessing:financeResult";
const DECISION_RECORD_FIELD =
  "__supervisorDecision:record";
const DECISION_STATUS_FIELD =
  "__supervisorDecision:status";
const DECISION_PUBLIC_STATUS_FIELD =
  "__supervisorDecision:publicStatus";

const REGISTRAR_NAME = "Dr. Miriam Wekesa";

function documentFieldKey(requirementId: string): string {
  return `${DOCUMENT_FIELD_PREFIX}${requirementId}`;
}

function asRecord(value: unknown): UnknownRecord {
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as UnknownRecord;
  }

  return {};
}

function parseFinanceResult(
  value: DemoFormValue | undefined,
): FinanceResultRecord | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.requestId !== "string" ||
      typeof candidate.departmentName !== "string" ||
      !["CLEAR", "HOLD", "CANNOT_VERIFY"].includes(
        String(candidate.result),
      ) ||
      typeof candidate.note !== "string" ||
      typeof candidate.completedBy !== "string" ||
      typeof candidate.completedAt !== "string" ||
      typeof candidate.returnedTo !== "string"
    ) {
      return null;
    }

    return parsed as FinanceResultRecord;
  } catch {
    return null;
  }
}

function parseReferral(
  value: DemoFormValue | undefined,
): ReferralRecord | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      typeof candidate.originatingDepartmentName !==
        "string" ||
      typeof candidate.receivingDepartmentName !==
        "string" ||
      typeof candidate.requestedAction !== "string" ||
      typeof candidate.expectedOutput !== "string" ||
      typeof candidate.dueDate !== "string" ||
      ![
        "PENDING_ACCEPTANCE",
        "ACCEPTED",
        "COMPLETED",
        "DECLINED",
        "RETURNED_FOR_CLARIFICATION",
      ].includes(String(candidate.status))
    ) {
      return null;
    }

    return parsed as ReferralRecord;
  } catch {
    return null;
  }
}

function parseDecision(
  value: DemoFormValue | undefined,
): RegistrarDecisionRecord | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      ![
        "APPROVED",
        "REJECTED",
        "RETURNED_FOR_CLARIFICATION",
      ].includes(String(candidate.decision)) ||
      typeof candidate.internalNote !== "string" ||
      typeof candidate.applicantReason !== "string" ||
      typeof candidate.decidedBy !== "string" ||
      candidate.profile !== "Registrar" ||
      typeof candidate.departmentName !== "string" ||
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

function hasValue(value: DemoFormValue | undefined): boolean {
  if (value === undefined || value === null) {
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

  if (field.options && typeof value === "string") {
    return (
      field.options.find(
        (option) => option.value === value,
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

function decisionClassName(
  decision: RegistrarDecisionType,
): string {
  if (decision === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (decision === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  return "border-violet-200 bg-violet-50 text-violet-800";
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function SupervisorApprovalWorkspace({
  requestId,
  organizationName,
  service,
  registrarDepartment,
}: SupervisorApprovalWorkspaceProps) {
  const { state, dispatch, isHydrated } = useDemoState();

  const [internalNote, setInternalNote] = useState(
    "All required operational checks have been reviewed by the Registrar.",
  );
  const [rejectionReason, setRejectionReason] =
    useState("");
  const [clarificationReason, setClarificationReason] =
    useState("");
  const [decisionConfirmed, setDecisionConfirmed] =
    useState(false);
  const [message, setMessage] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  const draft = useMemo(
    () => state.formDrafts[service.slug] ?? {},
    [service.slug, state.formDrafts],
  );

  const requiredFields = useMemo(
    () =>
      service.form.sections.flatMap(
        (section) =>
          section.fields.filter((field) => field.required),
      ),
    [service.form.sections],
  );

  const requiredDocuments = useMemo(
    () =>
      service.requiredDocuments.filter(
        (requirement) =>
          requirement.level === "REQUIRED",
      ),
    [service.requiredDocuments],
  );

  const financeResult = useMemo(
    () =>
      parseFinanceResult(
        draft[DEPARTMENT_RESULT_FIELD],
      ),
    [draft],
  );

  const referral = useMemo(
    () => parseReferral(draft[OFFICER_REFERRAL_FIELD]),
    [draft],
  );

  const existingDecision = useMemo(
    () => parseDecision(draft[DECISION_RECORD_FIELD]),
    [draft],
  );

  const applicationComplete = requiredFields.every(
    (field) => hasValue(draft[field.key]),
  );

  const requiredDocumentsComplete =
    requiredDocuments.every((requirement) =>
      hasValue(draft[documentFieldKey(requirement.id)]),
    );

  const officerReviewComplete =
    draft[OFFICER_APPLICATION_CHECKED_FIELD] === true &&
    draft[OFFICER_DOCUMENTS_CHECKED_FIELD] === true &&
    draft[OFFICER_IDENTITY_CHECKED_FIELD] === true;

  const financeWorkComplete =
    referral?.status === "COMPLETED" &&
    financeResult !== null;

  const financeClear =
    financeResult?.result === "CLEAR";

  const unresolvedOfficerState = [
    "CORRECTION_REQUESTED",
    "FINANCE_CLARIFICATION_REQUIRED",
    "REFERRAL_DECLINED",
  ].includes(
    String(draft[OFFICER_REVIEW_STATUS_FIELD] ?? ""),
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
      label: "Required application fields are complete",
      passed: applicationComplete,
      detail: `${requiredFields.length} required configured fields checked`,
    },
    {
      label: "Required documents are available",
      passed: requiredDocumentsComplete,
      detail: `${requiredDocuments.length} required document records checked`,
    },
    {
      label: "Originating officer review is complete",
      passed: officerReviewComplete,
      detail: "Application, documents and identity checks",
    },
    {
      label: "Finance work item is complete",
      passed: financeWorkComplete,
      detail: referral
        ? `Referral status: ${referral.status}`
        : "No completed Finance referral found",
    },
    {
      label: "Finance returned CLEAR",
      passed: financeClear,
      detail: financeResult
        ? `Finance result: ${financeResult.result}`
        : "No structured Finance result found",
    },
    {
      label: "No unresolved correction or clarification",
      passed: !unresolvedOfficerState,
      detail: String(
        draft[OFFICER_REVIEW_STATUS_FIELD] ??
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

  function addActivity(name: string, at: string) {
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
    decision: RegistrarDecisionType,
    applicantReason: string,
    internalStatus: string,
    publicStatus: string,
    eventName: string,
  ) {
    if (existingDecision) {
      setError(
        "A Registrar decision has already been recorded for this demonstration request.",
      );
      return;
    }

    if (!decisionConfirmed) {
      setError(
        "Confirm the Registrar declaration before recording a decision.",
      );
      return;
    }

    const at = new Date().toISOString();
    const record: RegistrarDecisionRecord = {
      id: `DEC-REG-${at.replace(/\D/g, "")}`,
      requestId,
      decision,
      internalNote: internalNote.trim(),
      applicantReason,
      decidedBy: REGISTRAR_NAME,
      profile: "Registrar",
      departmentName: registrarDepartment.name,
      decidedAt: at,
      financeResult: financeResult?.result ?? null,
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

    setError(null);
    setMessage(
      `${decision.replaceAll(
        "_",
        " ",
      )} recorded by the Registrar profile.`,
    );
  }

  function approveRequest() {
    if (!approvalReady) {
      setError(
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

    const reason = rejectionReason.trim();

    if (!rejectionReady) {
      setError(
        "Rejection requires a reviewed application, required documents and a Finance result.",
      );
      return;
    }

    if (!reason) {
      setError(
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

    const reason = clarificationReason.trim();

    if (!reason) {
      setError(
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

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-sm font-bold">
          Restoring Registrar approval workspace…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="bg-[#100b18] text-white">
        <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600">
                <BadgeCheck
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  Supervisor approval workspace
                </p>
                <h1 className="mt-1 text-2xl font-bold">
                  Registrar decision
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  {organizationName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/demo/officer/requests/${requestId}`}
                className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-bold"
              >
                <ArrowLeft
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                Officer review
              </Link>

              <Link
                href="/demo/department"
                className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950"
              >
                Finance workspace
                <ArrowRight
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1380px] px-5 py-8 sm:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Pending approval",
              value:
                !existingDecision && approvalReady ? 1 : 0,
              icon: ClipboardCheck,
            },
            {
              label: "Blocked",
              value:
                !existingDecision && !approvalReady ? 1 : 0,
              icon: Clock3,
            },
            {
              label: "Approved",
              value:
                existingDecision?.decision === "APPROVED"
                  ? 1
                  : 0,
              icon: CheckCircle2,
            },
            {
              label: "Rejected",
              value:
                existingDecision?.decision === "REJECTED"
                  ? 1
                  : 0,
              icon: XCircle,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">
                      {item.label}
                    </p>
                    <p className="mt-3 text-4xl font-bold">
                      {item.value}
                    </p>
                  </div>
                  <Icon
                    className="h-5 w-5 text-slate-500"
                    aria-hidden="true"
                  />
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_410px] xl:items-start">
          <div className="grid gap-6">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-sm font-bold text-slate-500">
                    {requestId}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    {service.name}
                  </h2>
                  <p className="mt-3 text-sm text-slate-600">
                    Applicant:{" "}
                    <span className="font-bold text-slate-900">
                      {state.applicant.fullName ||
                        "Demo applicant"}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Decision authority
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {REGISTRAR_NAME}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Registrar-profile Supervisor
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Building2
                      className="h-5 w-5 text-slate-500"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-bold">
                      Parent owner
                    </p>
                  </div>
                  <p className="mt-3 text-lg font-bold">
                    {referral?.originatingDepartmentName ??
                      "Student Records"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <UserRoundCheck
                      className="h-5 w-5 text-slate-500"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-bold">
                      Approval department
                    </p>
                  </div>
                  <p className="mt-3 text-lg font-bold">
                    {registrarDepartment.name}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Approval gate
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Required checks
              </h2>

              <div className="mt-6 grid gap-4">
                {prerequisites.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        item.passed
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.passed ? (
                        <CheckCircle2
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <CircleAlert
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-bold">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <FileCheck2
                    className="h-5 w-5 text-slate-600"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Finance result
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {financeResult?.result ??
                      "Not available"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {financeResult?.note ??
                      "Complete the Finance work item before approval."}
                  </p>
                  {financeResult ? (
                    <p className="mt-3 text-sm font-bold text-slate-700">
                      Completed by{" "}
                      {financeResult.completedBy} ·{" "}
                      {formatTimestamp(
                        financeResult.completedAt,
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Submitted record
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Application and documents
              </h2>

              <div className="mt-6 grid gap-6">
                {service.form.sections.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-lg font-bold">
                      {section.title}
                    </h3>
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      {section.fields
                        .filter((field) => field.required)
                        .map((field) => (
                          <div
                            key={field.key}
                            className="rounded-xl bg-slate-50 p-4"
                          >
                            <dt className="text-xs font-bold uppercase text-slate-500">
                              {field.label}
                            </dt>
                            <dd className="mt-2 text-sm leading-6">
                              {formatFieldValue(
                                field,
                                draft[field.key],
                              )}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                ))}

                <div>
                  <h3 className="text-lg font-bold">
                    Required documents
                  </h3>
                  <div className="mt-3 grid gap-3">
                    {service.requiredDocuments.map(
                      (requirement) => (
                        <div
                          key={requirement.id}
                          className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText
                              className="h-4 w-4 text-slate-500"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-sm font-bold">
                                {requirement.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {documentLevelLabel(
                                  requirement,
                                )}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              hasValue(
                                draft[
                                  documentFieldKey(
                                    requirement.id,
                                  )
                                ],
                              )
                                ? "text-emerald-700"
                                : "text-amber-700"
                            }`}
                          >
                            {hasValue(
                              draft[
                                documentFieldKey(
                                  requirement.id,
                                )
                              ],
                            )
                              ? "Available"
                              : "Not selected"}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="grid h-fit gap-5 xl:sticky xl:top-6">
            {existingDecision ? (
              <section
                className={`rounded-3xl border p-6 shadow-sm ${decisionClassName(
                  existingDecision.decision,
                )}`}
              >
                <BadgeCheck
                  className="h-7 w-7"
                  aria-hidden="true"
                />
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em]">
                  Registrar decision recorded
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {existingDecision.decision.replaceAll(
                    "_",
                    " ",
                  )}
                </h2>
                <p className="mt-3 text-sm leading-7">
                  {existingDecision.applicantReason}
                </p>
                <p className="mt-4 text-sm font-bold">
                  {existingDecision.decidedBy} ·{" "}
                  {formatTimestamp(
                    existingDecision.decidedAt,
                  )}
                </p>

                {existingDecision.decision ===
                "APPROVED" ? (
                  <Link
                    href={`/demo/outcomes/${requestId}`}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white"
                  >
                    Continue to outcome issuance
                    <ArrowRight
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                    />
                  </Link>
                ) : null}
              </section>
            ) : (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className="h-5 w-5 text-violet-600"
                      aria-hidden="true"
                    />
                    <h2 className="text-lg font-bold">
                      Registrar declaration
                    </h2>
                  </div>

                  <label className="mt-5 grid gap-2">
                    <span className="text-sm font-bold">
                      Internal decision note
                    </span>
                    <textarea
                      value={internalNote}
                      onChange={(event) =>
                        setInternalNote(
                          event.target.value,
                        )
                      }
                      rows={4}
                      className="rounded-xl border border-slate-300 p-3 text-sm"
                    />
                  </label>

                  <label className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={decisionConfirmed}
                      onChange={(event) =>
                        setDecisionConfirmed(
                          event.target.checked,
                        )
                      }
                      className="mt-1 h-4 w-4"
                    />
                    <span className="text-sm leading-6 text-slate-700">
                      I confirm that I am acting as the
                      Registrar-profile Supervisor and have
                      reviewed the available request record.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={approveRequest}
                    disabled={!approvalReady}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Approve request
                  </button>

                  {!approvalReady ? (
                    <p className="mt-3 text-xs leading-5 text-amber-700">
                      Approval remains blocked until all six
                      prerequisite checks pass.
                    </p>
                  ) : null}
                </section>

                <form
                  onSubmit={rejectRequest}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <XCircle
                      className="h-5 w-5 text-red-600"
                      aria-hidden="true"
                    />
                    <h2 className="text-lg font-bold">
                      Final rejection
                    </h2>
                  </div>

                  <label className="mt-5 grid gap-2">
                    <span className="text-sm font-bold">
                      Applicant-visible rejection reason
                    </span>
                    <textarea
                      value={rejectionReason}
                      onChange={(event) =>
                        setRejectionReason(
                          event.target.value,
                        )
                      }
                      rows={4}
                      placeholder="Explain why the request cannot be approved"
                      className="rounded-xl border border-slate-300 p-3 text-sm"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!rejectionReady}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Record rejection
                  </button>
                </form>

                <form
                  onSubmit={returnForClarification}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw
                      className="h-5 w-5 text-violet-600"
                      aria-hidden="true"
                    />
                    <h2 className="text-lg font-bold">
                      Return for clarification
                    </h2>
                  </div>

                  <label className="mt-5 grid gap-2">
                    <span className="text-sm font-bold">
                      Clarification required
                    </span>
                    <textarea
                      value={clarificationReason}
                      onChange={(event) =>
                        setClarificationReason(
                          event.target.value,
                        )
                      }
                      rows={4}
                      placeholder="Explain what Student Records must resolve"
                      className="rounded-xl border border-slate-300 p-3 text-sm"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-5 text-sm font-bold text-violet-700"
                  >
                    Return to Student Records
                  </button>
                </form>
              </>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                D23 boundary
              </p>
              <h2 className="mt-2 text-lg font-bold">
                Decision only
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Approval authorizes the next stage. D23 does
                not generate, upload or issue the controlled
                outcome document.
              </p>
            </section>

            {error ? (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            {message ? (
              <p
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                {message}
              </p>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
