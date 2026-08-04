"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Inbox,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { useDemoState } from "@/features/demo/state";
import type { DemoFormValue } from "@/types/demo/demo-state";

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentProcessingDashboardProps = {
  readonly organizationName: string;
  readonly department: DepartmentOption;
  readonly services: readonly ServiceOption[];
};

type ReferralStatus =
  | "PENDING_ACCEPTANCE"
  | "ACCEPTED"
  | "COMPLETED"
  | "DECLINED"
  | "RETURNED_FOR_CLARIFICATION";

type FinanceResult = "CLEAR" | "HOLD" | "CANNOT_VERIFY";

type ReferralRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly originatingDepartmentId: string;
  readonly originatingDepartmentName: string;
  readonly receivingDepartmentId: string;
  readonly receivingDepartmentName: string;
  readonly requestedAction: string;
  readonly reason: string;
  readonly expectedOutput: string;
  readonly dueDate: string;
  readonly status: ReferralStatus;
  readonly originatingOfficer: string;
  readonly createdAt: string;
  readonly acceptedAt?: string;
  readonly acceptedBy?: string;
  readonly result?: FinanceResult;
  readonly resultNote?: string;
  readonly completedAt?: string;
  readonly completedBy?: string;
  readonly returnedAt?: string;
  readonly declinedAt?: string;
  readonly declinedBy?: string;
  readonly declineReason?: string;
  readonly clarificationReason?: string;
};

type ReferralContext = {
  readonly serviceSlug: string;
  readonly serviceName: string;
  readonly referral: ReferralRecord;
  readonly isFallback: boolean;
};

type UnknownRecord = Record<string, unknown>;

const OFFICER_REFERRAL_FIELD = "__officerReview:referral";
const OFFICER_REVIEW_STATUS_FIELD = "__officerReview:status";
const OFFICER_PUBLIC_STATUS_FIELD = "__officerReview:publicStatus";
const DEPARTMENT_RESULT_FIELD =
  "__departmentProcessing:financeResult";
const FINANCE_OFFICER_NAME = "Peter Mwangi";

const FALLBACK_REFERRAL: ReferralRecord = {
  id: "HND-DEMO-001",
  requestId: "REQ-DEMO-001",
  originatingDepartmentId: "student-records",
  originatingDepartmentName: "Student Records",
  receivingDepartmentId: "finance",
  receivingDepartmentName: "Finance",
  requestedAction:
    "Verify the submitted manual payment reference and confirm whether the student account is clear.",
  reason:
    "Finance verification is required before the transcript request can proceed.",
  expectedOutput:
    "Return one structured result: CLEAR, HOLD or CANNOT_VERIFY.",
  dueDate: "2026-07-30",
  status: "PENDING_ACCEPTANCE",
  originatingOfficer: "Amina Njeri",
  createdAt: "2026-07-22T10:24:00.000Z",
};

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

function isReferralStatus(
  value: unknown,
): value is ReferralStatus {
  return [
    "PENDING_ACCEPTANCE",
    "ACCEPTED",
    "COMPLETED",
    "DECLINED",
    "RETURNED_FOR_CLARIFICATION",
  ].includes(String(value));
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
      typeof candidate.originatingDepartmentId !== "string" ||
      typeof candidate.originatingDepartmentName !== "string" ||
      typeof candidate.receivingDepartmentId !== "string" ||
      typeof candidate.receivingDepartmentName !== "string" ||
      typeof candidate.requestedAction !== "string" ||
      typeof candidate.reason !== "string" ||
      typeof candidate.expectedOutput !== "string" ||
      typeof candidate.dueDate !== "string" ||
      !isReferralStatus(candidate.status) ||
      typeof candidate.originatingOfficer !== "string" ||
      typeof candidate.createdAt !== "string"
    ) {
      return null;
    }

    return parsed as ReferralRecord;
  } catch {
    return null;
  }
}

function findReferralContext(
  formDrafts: Record<
    string,
    Record<string, DemoFormValue>
  >,
  services: readonly ServiceOption[],
): ReferralContext {
  for (const service of services) {
    const referral = parseReferral(
      formDrafts[service.slug]?.[OFFICER_REFERRAL_FIELD],
    );

    if (referral) {
      return {
        serviceSlug: service.slug,
        serviceName: service.name,
        referral,
        isFallback: false,
      };
    }
  }

  const service =
    services.find(
      (candidate) =>
        candidate.slug === "transcript-request",
    ) ?? services[0];

  return {
    serviceSlug: service?.slug ?? "transcript-request",
    serviceName: service?.name ?? "Transcript Request",
    referral: FALLBACK_REFERRAL,
    isFallback: true,
  };
}

function statusLabel(status: ReferralStatus): string {
  switch (status) {
    case "PENDING_ACCEPTANCE":
      return "Pending acceptance";
    case "ACCEPTED":
      return "Accepted · In progress";
    case "COMPLETED":
      return "Completed · Returned";
    case "DECLINED":
      return "Declined";
    case "RETURNED_FOR_CLARIFICATION":
      return "Clarification requested";
  }
}

function statusClassName(status: ReferralStatus): string {
  if (status === "COMPLETED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "ACCEPTED") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "DECLINED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "RETURNED_FOR_CLARIFICATION") {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function DepartmentProcessingDashboard({
  organizationName,
  department,
  services,
}: DepartmentProcessingDashboardProps) {
  const { state, dispatch, isHydrated } = useDemoState();

  const [result, setResult] =
    useState<FinanceResult>("CLEAR");
  const [resultNote, setResultNote] = useState(
    "The submitted payment reference was verified against the demonstration Finance record.",
  );
  const [declineReason, setDeclineReason] = useState("");
  const [clarificationReason, setClarificationReason] =
    useState("");
  const [message, setMessage] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const context = findReferralContext(
    state.formDrafts as Record<
      string,
      Record<string, DemoFormValue>
    >,
    services,
  );
  const { referral, serviceSlug, serviceName } = context;

  function saveValue(
    fieldKey: string,
    value: DemoFormValue,
    at = new Date().toISOString(),
  ) {
    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug,
      fieldKey,
      value,
      at,
    });
  }

  function addActivity(
    name: string,
    at = new Date().toISOString(),
  ) {
    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-${name.toUpperCase()}-${at.replace(/\D/g, "")}`,
        name,
        requestId: referral.requestId,
        occurredAt: at,
      },
      at,
    });
  }

  function saveReferral(
    nextReferral: ReferralRecord,
    at: string,
  ) {
    saveValue(
      OFFICER_REFERRAL_FIELD,
      JSON.stringify(nextReferral),
      at,
    );
  }

  function acceptReferral() {
    if (referral.status !== "PENDING_ACCEPTANCE") {
      setError("Only a pending referral can be accepted.");
      return;
    }

    const at = new Date().toISOString();

    saveReferral(
      {
        ...referral,
        receivingDepartmentId: department.id,
        receivingDepartmentName: department.name,
        status: "ACCEPTED",
        acceptedAt: at,
        acceptedBy: FINANCE_OFFICER_NAME,
      },
      at,
    );
    saveValue(
      OFFICER_REVIEW_STATUS_FIELD,
      "IN_FINANCE_REVIEW",
      at,
    );
    saveValue(
      OFFICER_PUBLIC_STATUS_FIELD,
      "ADDITIONAL_CHECKS_IN_PROGRESS",
      at,
    );
    addActivity("handoff_accepted", at);

    setError(null);
    setMessage(
      "Finance accepted the work item. Student Records still owns the parent request.",
    );
  }

  function completeReferral(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (referral.status !== "ACCEPTED") {
      setError(
        "Accept the referral before recording a result.",
      );
      return;
    }

    const note = resultNote.trim();

    if (!note) {
      setError(
        "Enter a Finance result note before completion.",
      );
      return;
    }

    const at = new Date().toISOString();
    const nextReferral: ReferralRecord = {
      ...referral,
      status: "COMPLETED",
      result,
      resultNote: note,
      completedAt: at,
      completedBy: FINANCE_OFFICER_NAME,
      returnedAt: at,
    };

    saveReferral(nextReferral, at);
    saveValue(
      DEPARTMENT_RESULT_FIELD,
      JSON.stringify({
        requestId: referral.requestId,
        departmentName: department.name,
        result,
        note,
        completedBy: FINANCE_OFFICER_NAME,
        completedAt: at,
        returnedTo: referral.originatingDepartmentName,
      }),
      at,
    );
    saveValue(
      OFFICER_REVIEW_STATUS_FIELD,
      "FINANCE_COMPLETE",
      at,
    );
    saveValue(
      OFFICER_PUBLIC_STATUS_FIELD,
      "ADDITIONAL_CHECKS_COMPLETED",
      at,
    );
    addActivity("handoff_completed", at);

    setError(null);
    setMessage(
      `Finance returned ${result} to ${referral.originatingDepartmentName}.`,
    );
  }

  function returnForClarification(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (referral.status !== "ACCEPTED") {
      setError(
        "Accept the referral before returning it.",
      );
      return;
    }

    const reason = clarificationReason.trim();

    if (!reason) {
      setError("Enter the clarification required.");
      return;
    }

    const at = new Date().toISOString();

    saveReferral(
      {
        ...referral,
        status: "RETURNED_FOR_CLARIFICATION",
        clarificationReason: reason,
        returnedAt: at,
      },
      at,
    );
    saveValue(
      OFFICER_REVIEW_STATUS_FIELD,
      "FINANCE_CLARIFICATION_REQUIRED",
      at,
    );
    saveValue(
      OFFICER_PUBLIC_STATUS_FIELD,
      "ADDITIONAL_CHECKS_IN_PROGRESS",
      at,
    );
    addActivity(
      "handoff_returned_for_clarification",
      at,
    );

    setError(null);
    setMessage(
      "The referral was returned to Student Records for clarification.",
    );
  }

  function declineReferral(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (referral.status !== "PENDING_ACCEPTANCE") {
      setError("Only a pending referral can be declined.");
      return;
    }

    const reason = declineReason.trim();

    if (!reason) {
      setError("Enter a reason before declining.");
      return;
    }

    const at = new Date().toISOString();

    saveReferral(
      {
        ...referral,
        status: "DECLINED",
        declinedAt: at,
        declinedBy: FINANCE_OFFICER_NAME,
        declineReason: reason,
        returnedAt: at,
      },
      at,
    );
    saveValue(
      OFFICER_REVIEW_STATUS_FIELD,
      "REFERRAL_DECLINED",
      at,
    );
    addActivity("handoff_declined", at);

    setError(null);
    setMessage(
      "The referral was declined and returned with a reason.",
    );
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-sm font-bold">
          Restoring Finance workspace…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="bg-[#07110d] text-white">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500">
              <Building2
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                Receiving department workspace
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                {department.name} verification
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {organizationName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/demo/officer"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-bold"
            >
              <ArrowLeft
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Officer queue
            </Link>
            <Link
              href={`/demo/officer/requests/${referral.requestId}`}
              className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950"
            >
              Parent request
              <ArrowRight
                className="ml-2 h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Pending acceptance",
              value:
                referral.status ===
                "PENDING_ACCEPTANCE"
                  ? 1
                  : 0,
              icon: Inbox,
            },
            {
              label: "In progress",
              value:
                referral.status === "ACCEPTED" ? 1 : 0,
              icon: Clock3,
            },
            {
              label: "Returned",
              value:
                referral.status ===
                "RETURNED_FOR_CLARIFICATION"
                  ? 1
                  : 0,
              icon: RotateCcw,
            },
            {
              label: "Completed",
              value:
                referral.status === "COMPLETED" ? 1 : 0,
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex justify-between">
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

        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-sm font-bold text-slate-500">
                  {referral.id}
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {serviceName}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Parent request: {referral.requestId}
                </p>
              </div>
              <span
                className={`w-fit rounded-full border px-4 py-2 text-sm font-bold ${statusClassName(referral.status)}`}
              >
                {statusLabel(referral.status)}
              </span>
            </div>

            {context.isFallback ? (
              <p className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                No D21 referral exists in this browser session, so
                FAIDIA is displaying the controlled pending referral.
              </p>
            ) : null}

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Parent owner
                </dt>
                <dd className="mt-2 text-lg font-bold">
                  {referral.originatingDepartmentName}
                </dd>
                <p className="mt-2 text-sm text-slate-600">
                  Ownership does not transfer to Finance.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Receiving department
                </dt>
                <dd className="mt-2 text-lg font-bold">
                  {department.name}
                </dd>
                <p className="mt-2 text-sm text-slate-600">
                  Officer: {FINANCE_OFFICER_NAME}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Requested action
                </dt>
                <dd className="mt-2 text-sm leading-7">
                  {referral.requestedAction}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Reason
                </dt>
                <dd className="mt-2 text-sm leading-7">
                  {referral.reason}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Expected output
                </dt>
                <dd className="mt-2 text-sm leading-7">
                  {referral.expectedOutput}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                <dt className="text-xs font-bold uppercase text-slate-500">
                  Due date
                </dt>
                <dd className="mt-2 text-lg font-bold">
                  {referral.dueDate}
                </dd>
              </div>
            </dl>

            {referral.status === "COMPLETED" ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <FileCheck2
                    className="mt-1 h-5 w-5 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Finance result: {referral.result}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                      {referral.resultNote}
                    </p>
                    <p className="mt-3 text-sm font-bold text-emerald-800">
                      Returned to{" "}
                      {referral.originatingDepartmentName}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </article>

          <aside className="grid h-fit gap-5">
            {referral.status === "PENDING_ACCEPTANCE" ? (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold">
                    Accept referral
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Acceptance begins Finance processing without
                    transferring the parent request.
                  </p>
                  <button
                    type="button"
                    onClick={acceptReferral}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2557ff] px-5 text-sm font-bold text-white"
                  >
                    <Send
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Accept Finance work item
                  </button>
                </section>

                <form
                  onSubmit={declineReferral}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <h2 className="text-lg font-bold">
                    Decline referral
                  </h2>
                  <textarea
                    value={declineReason}
                    onChange={(event) =>
                      setDeclineReason(event.target.value)
                    }
                    rows={4}
                    placeholder="Reason for declining"
                    className="mt-4 w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                  <button
                    type="submit"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700"
                  >
                    <XCircle
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Decline and return
                  </button>
                </form>
              </>
            ) : null}

            {referral.status === "ACCEPTED" ? (
              <>
                <form
                  onSubmit={completeReferral}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <h2 className="text-lg font-bold">
                    Record Finance result
                  </h2>

                  <div className="mt-4 grid gap-3">
                    {(
                      [
                        "CLEAR",
                        "HOLD",
                        "CANNOT_VERIFY",
                      ] as const
                    ).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                      >
                        <input
                          type="radio"
                          name="result"
                          checked={result === option}
                          onChange={() => setResult(option)}
                        />
                        <span className="text-sm font-bold">
                          {option.replaceAll("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>

                  <textarea
                    value={resultNote}
                    onChange={(event) =>
                      setResultNote(event.target.value)
                    }
                    rows={5}
                    className="mt-4 w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />

                  <button
                    type="submit"
                    className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white"
                  >
                    Complete and return
                    <ArrowRight
                      className="ml-2 h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </form>

                <form
                  onSubmit={returnForClarification}
                  className="rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <h2 className="text-lg font-bold">
                    Return for clarification
                  </h2>
                  <textarea
                    value={clarificationReason}
                    onChange={(event) =>
                      setClarificationReason(
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Clarification required"
                    className="mt-4 w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                  <button
                    type="submit"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-5 text-sm font-bold text-violet-700"
                  >
                    <RotateCcw
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Return to Student Records
                  </button>
                </form>
              </>
            ) : null}

            {referral.status === "COMPLETED" ? (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                <CheckCircle2
                  className="h-6 w-6 text-emerald-700"
                  aria-hidden="true"
                />
                <h2 className="mt-3 text-xl font-bold text-emerald-950">
                  Work item complete
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  The result is back with Student Records.
                </p>
                <Link
                  href={`/demo/officer/requests/${referral.requestId}`}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white"
                >
                  Continue in Student Records
                </Link>
              </section>
            ) : null}

            {referral.status ===
            "RETURNED_FOR_CLARIFICATION" ? (
              <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
                <h2 className="text-xl font-bold text-violet-950">
                  Clarification requested
                </h2>
                <p className="mt-2 text-sm leading-6 text-violet-800">
                  {referral.clarificationReason}
                </p>
              </section>
            ) : null}

            {referral.status === "DECLINED" ? (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <h2 className="text-xl font-bold text-red-950">
                  Referral declined
                </h2>
                <p className="mt-2 text-sm leading-6 text-red-800">
                  {referral.declineReason}
                </p>
              </section>
            ) : null}

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
