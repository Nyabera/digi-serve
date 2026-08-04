"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  Eye,
  FileBadge2,
  FileCheck2,
  LockKeyhole,
  PackageCheck,
  Printer,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { useDemoState } from "@/features/demo/state";
import type { DemoServiceConfig } from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

type ControlledOutcomeWorkspaceProps = {
  readonly requestId: string;
  readonly organizationName: string;
  readonly service: DemoServiceConfig;
};

type RegistrarDecisionRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly decision:
    | "APPROVED"
    | "REJECTED"
    | "RETURNED_FOR_CLARIFICATION";
  readonly applicantReason: string;
  readonly decidedBy: string;
  readonly profile: "Registrar";
  readonly departmentName: string;
  readonly decidedAt: string;
  readonly financeResult:
    | "CLEAR"
    | "HOLD"
    | "CANNOT_VERIFY"
    | null;
  readonly immutable: boolean;
};

type DeliveryMethod =
  | "CONTROLLED_DOWNLOAD"
  | "PHYSICAL_COLLECTION";

type OutcomeStatus =
  | "ISSUED"
  | "DELIVERED"
  | "COLLECTED";

type ControlledOutcomeRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly serviceSlug: string;
  readonly serviceName: string;
  readonly documentType: "DEMO_TRANSCRIPT";
  readonly title: string;
  readonly publicReference: string;
  readonly version: 1;
  readonly status: OutcomeStatus;
  readonly deliveryMethod: DeliveryMethod;
  readonly issuedAt: string;
  readonly issuedBy: string;
  readonly decisionId: string;
  readonly applicantName: string;
  readonly studentReference: string;
  readonly programme: string;
  readonly checksum: string;
  readonly documentHtml: string;
  readonly exactCopyStatement: string;
  readonly deliveredAt?: string;
  readonly deliveredBy?: string;
};

type UnknownRecord = Record<string, unknown>;

const DECISION_RECORD_FIELD =
  "__supervisorDecision:record";
const OUTCOME_RECORD_FIELD = "__outcome:record";
const OUTCOME_STATUS_FIELD = "__outcome:status";
const OUTCOME_PUBLIC_STATUS_FIELD =
  "__outcome:publicStatus";

const ISSUING_OFFICER = "Dr. Miriam Wekesa";

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

function parseOutcome(
  value: DemoFormValue | undefined,
): ControlledOutcomeRecord | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      typeof candidate.serviceSlug !== "string" ||
      typeof candidate.serviceName !== "string" ||
      candidate.documentType !== "DEMO_TRANSCRIPT" ||
      typeof candidate.title !== "string" ||
      typeof candidate.publicReference !== "string" ||
      candidate.version !== 1 ||
      !["ISSUED", "DELIVERED", "COLLECTED"].includes(
        String(candidate.status),
      ) ||
      ![
        "CONTROLLED_DOWNLOAD",
        "PHYSICAL_COLLECTION",
      ].includes(String(candidate.deliveryMethod)) ||
      typeof candidate.issuedAt !== "string" ||
      typeof candidate.issuedBy !== "string" ||
      typeof candidate.decisionId !== "string" ||
      typeof candidate.applicantName !== "string" ||
      typeof candidate.studentReference !== "string" ||
      typeof candidate.programme !== "string" ||
      typeof candidate.checksum !== "string" ||
      typeof candidate.documentHtml !== "string" ||
      typeof candidate.exactCopyStatement !== "string"
    ) {
      return null;
    }

    return parsed as ControlledOutcomeRecord;
  } catch {
    return null;
  }
}

function firstDraftText(
  draft: Readonly<Record<string, DemoFormValue>>,
  keys: readonly string[],
  fallback: string,
): string {
  for (const key of keys) {
    const value = draft[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createChecksum(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `DEMO-${(hash >>> 0)
    .toString(16)
    .toUpperCase()
    .padStart(8, "0")}`;
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

function buildTranscriptHtml({
  organizationName,
  requestId,
  publicReference,
  applicantName,
  studentReference,
  programme,
  issueDate,
  decisionReference,
}: {
  readonly organizationName: string;
  readonly requestId: string;
  readonly publicReference: string;
  readonly applicantName: string;
  readonly studentReference: string;
  readonly programme: string;
  readonly issueDate: string;
  readonly decisionReference: string;
}): string {
  const safeOrganization = escapeHtml(organizationName);
  const safeRequestId = escapeHtml(requestId);
  const safePublicReference =
    escapeHtml(publicReference);
  const safeApplicantName = escapeHtml(applicantName);
  const safeStudentReference =
    escapeHtml(studentReference);
  const safeProgramme = escapeHtml(programme);
  const safeIssueDate = escapeHtml(issueDate);
  const safeDecisionReference =
    escapeHtml(decisionReference);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Demo Transcript ${safePublicReference}</title>
<style>
  body {
    margin: 0;
    background: #eef1f5;
    color: #111827;
    font-family: Arial, sans-serif;
  }
  .page {
    box-sizing: border-box;
    width: min(860px, calc(100% - 32px));
    min-height: 1120px;
    margin: 24px auto;
    padding: 56px;
    background: white;
    border: 1px solid #d7dce3;
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: 32px;
    border-bottom: 3px solid #173f5f;
    padding-bottom: 24px;
  }
  .brand {
    font-size: 28px;
    font-weight: 800;
  }
  .muted {
    color: #667085;
  }
  .reference {
    text-align: right;
    font-size: 13px;
    line-height: 1.7;
  }
  h1 {
    margin: 52px 0 12px;
    font-size: 36px;
  }
  .notice {
    margin: 24px 0;
    padding: 18px;
    background: #f4f7fb;
    border-left: 4px solid #2557ff;
    line-height: 1.6;
  }
  table {
    width: 100%;
    margin-top: 32px;
    border-collapse: collapse;
  }
  th, td {
    padding: 14px;
    border: 1px solid #d7dce3;
    text-align: left;
    vertical-align: top;
  }
  th {
    width: 34%;
    background: #f8fafc;
  }
  .sample {
    margin-top: 38px;
    padding: 18px;
    border: 2px dashed #9ca3af;
    color: #6b7280;
    text-align: center;
    font-weight: 700;
  }
  .footer {
    margin-top: 72px;
    padding-top: 22px;
    border-top: 1px solid #d7dce3;
    font-size: 12px;
    line-height: 1.7;
    color: #667085;
  }
</style>
</head>
<body>
  <main class="page">
    <header class="top">
      <div>
        <div class="brand">${safeOrganization}</div>
        <div class="muted">Registrar · Controlled Outcome</div>
      </div>
      <div class="reference">
        Public reference: <strong>${safePublicReference}</strong><br />
        Request: ${safeRequestId}<br />
        Decision: ${safeDecisionReference}
      </div>
    </header>

    <h1>Demonstration Academic Transcript</h1>
    <p class="muted">
      Issued on ${safeIssueDate} through the FAIDIA controlled demonstration workflow.
    </p>

    <div class="notice">
      This document is a synthetic demonstration outcome. It is not an
      official academic transcript and must not be used as evidence of
      qualification or institutional standing.
    </div>

    <table>
      <tr>
        <th>Student name</th>
        <td>${safeApplicantName}</td>
      </tr>
      <tr>
        <th>Student reference</th>
        <td>${safeStudentReference}</td>
      </tr>
      <tr>
        <th>Programme</th>
        <td>${safeProgramme}</td>
      </tr>
      <tr>
        <th>Outcome</th>
        <td>Transcript request approved</td>
      </tr>
      <tr>
        <th>Issued copy</th>
        <td>Version 1 · Exact stored demonstration copy</td>
      </tr>
    </table>

    <div class="sample">
      DEMONSTRATION RECORD — NOT AN OFFICIAL TRANSCRIPT
    </div>

    <footer class="footer">
      FAIDIA stores the exact issued demonstration copy and its checksum.
      Production delivery would use private storage, authorization checks,
      short-lived signed access and download logging.
    </footer>
  </main>
</body>
</html>`;
}

function outcomeStatusLabel(
  outcome: ControlledOutcomeRecord,
): string {
  if (outcome.status === "DELIVERED") {
    return "Downloaded · Completed";
  }

  if (outcome.status === "COLLECTED") {
    return "Collected · Completed";
  }

  return outcome.deliveryMethod ===
    "CONTROLLED_DOWNLOAD"
    ? "Ready for controlled download"
    : "Ready for physical collection";
}

export function ControlledOutcomeWorkspace({
  requestId,
  organizationName,
  service,
}: ControlledOutcomeWorkspaceProps) {
  const { state, dispatch, isHydrated } =
    useDemoState();

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("CONTROLLED_DOWNLOAD");
  const [previewOpen, setPreviewOpen] =
    useState(false);
  const [message, setMessage] =
    useState<string | null>(null);
  const [error, setError] =
    useState<string | null>(null);

  const draft = state.formDrafts[service.slug] ?? {};
  const decision = parseDecision(
    draft[DECISION_RECORD_FIELD],
  );
  const outcome = parseOutcome(
    draft[OUTCOME_RECORD_FIELD],
  );

  const applicantName =
    state.applicant.fullName || "Demo applicant";

  const studentReference = firstDraftText(
    draft,
    [
      "studentNumber",
      "admissionNumber",
      "admissionOrStudentNumber",
      "studentReference",
    ],
    "STC-DEMO-001",
  );

  const programme = firstDraftText(
    draft,
    ["programme", "program", "course"],
    "Configured academic programme",
  );

  const approved =
    decision?.decision === "APPROVED";

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

  function issueOutcome() {
    if (!decision || !approved) {
      setError(
        "A Registrar APPROVED decision is required before issuance.",
      );
      return;
    }

    if (outcome) {
      setError(
        "An immutable issued outcome already exists for this request.",
      );
      return;
    }

    const at = new Date().toISOString();
    const referenceSuffix = at
      .replace(/\D/g, "")
      .slice(-10);
    const publicReference =
      `STC-${requestId.replace(/\W/g, "")}-${referenceSuffix}`;

    const documentHtml = buildTranscriptHtml({
      organizationName,
      requestId,
      publicReference,
      applicantName,
      studentReference,
      programme,
      issueDate: formatTimestamp(at),
      decisionReference: decision.id,
    });

    const record: ControlledOutcomeRecord = {
      id: `DOC-ISSUED-${at.replace(/\D/g, "")}`,
      requestId,
      serviceSlug: service.slug,
      serviceName: service.name,
      documentType: "DEMO_TRANSCRIPT",
      title: "Demonstration Academic Transcript",
      publicReference,
      version: 1,
      status: "ISSUED",
      deliveryMethod,
      issuedAt: at,
      issuedBy: ISSUING_OFFICER,
      decisionId: decision.id,
      applicantName,
      studentReference,
      programme,
      checksum: createChecksum(documentHtml),
      documentHtml,
      exactCopyStatement:
        "The stored HTML is the exact issued demonstration copy and is not regenerated on access.",
    };

    saveValue(
      OUTCOME_RECORD_FIELD,
      JSON.stringify(record),
      at,
    );
    saveValue(
      OUTCOME_STATUS_FIELD,
      "OUTCOME_ISSUED",
      at,
    );
    saveValue(
      OUTCOME_PUBLIC_STATUS_FIELD,
      deliveryMethod === "CONTROLLED_DOWNLOAD"
        ? "READY_FOR_DOWNLOAD"
        : "READY_FOR_COLLECTION",
      at,
    );

    addActivity("document_issued", at);
    addActivity("outcome_issued", at);

    setError(null);
    setMessage(
      deliveryMethod === "CONTROLLED_DOWNLOAD"
        ? "The exact demonstration transcript copy is ready for controlled download."
        : "The demonstration transcript is ready for recorded physical collection.",
    );
  }

  function completeDelivery(
    currentOutcome: ControlledOutcomeRecord,
    status: "DELIVERED" | "COLLECTED",
    eventName: string,
  ) {
    if (currentOutcome.status !== "ISSUED") {
      setError(
        "This outcome has already been delivered or collected.",
      );
      return;
    }

    const at = new Date().toISOString();
    const completedOutcome: ControlledOutcomeRecord = {
      ...currentOutcome,
      status,
      deliveredAt: at,
      deliveredBy:
        status === "DELIVERED"
          ? applicantName
          : ISSUING_OFFICER,
    };

    saveValue(
      OUTCOME_RECORD_FIELD,
      JSON.stringify(completedOutcome),
      at,
    );
    saveValue(
      OUTCOME_STATUS_FIELD,
      "COMPLETED",
      at,
    );
    saveValue(
      OUTCOME_PUBLIC_STATUS_FIELD,
      "COMPLETED",
      at,
    );

    addActivity(eventName, at);
    addActivity("request_completed", at);

    setError(null);
    setMessage(
      status === "DELIVERED"
        ? "Controlled download recorded. The request is complete."
        : "Physical collection recorded. The request is complete.",
    );
  }

  function downloadControlledCopy() {
    if (
      !outcome ||
      outcome.deliveryMethod !==
        "CONTROLLED_DOWNLOAD"
    ) {
      setError(
        "No controlled-download outcome is available.",
      );
      return;
    }

    if (outcome.status !== "ISSUED") {
      setError(
        "The controlled copy has already been delivered.",
      );
      return;
    }

    const blob = new Blob(
      [outcome.documentHtml],
      {
        type: "text/html;charset=utf-8",
      },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `${outcome.publicReference}-demo-transcript.html`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    completeDelivery(
      outcome,
      "DELIVERED",
      "outcome_downloaded",
    );
  }

  function recordCollection() {
    if (
      !outcome ||
      outcome.deliveryMethod !==
        "PHYSICAL_COLLECTION"
    ) {
      setError(
        "No physical-collection outcome is available.",
      );
      return;
    }

    completeDelivery(
      outcome,
      "COLLECTED",
      "outcome_collected",
    );
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <p className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-sm font-bold">
          Restoring controlled outcome workspace…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="bg-[#07101a] text-white">
        <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2557ff]">
                <FileBadge2
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  Controlled outcome issuance
                </p>
                <h1 className="mt-1 text-2xl font-bold">
                  Issued document workspace
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  {organizationName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo/supervisor"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-bold"
              >
                <ArrowLeft
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                Registrar decision
              </Link>

              <Link
                href={`/demo/track/${requestId}`}
                className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950"
              >
                Applicant tracking
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
              label: "Registrar decision",
              value: approved
                ? "Approved"
                : decision?.decision ??
                  "Not recorded",
              icon: BadgeCheck,
            },
            {
              label: "Outcome state",
              value: outcome
                ? outcome.status
                : "Not issued",
              icon: FileCheck2,
            },
            {
              label: "Delivery method",
              value: outcome
                ? outcome.deliveryMethod.replaceAll(
                    "_",
                    " ",
                  )
                : "Not selected",
              icon: PackageCheck,
            },
            {
              label: "Request state",
              value:
                outcome?.status === "DELIVERED" ||
                outcome?.status === "COLLECTED"
                  ? "Completed"
                  : outcome
                    ? "Ready"
                    : "Approved",
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Icon
                  className="h-5 w-5 text-slate-500"
                  aria-hidden="true"
                />
                <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-lg font-bold capitalize">
                  {item.value.toLowerCase()}
                </p>
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
                      {applicantName}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Issuance authority
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    Registrar
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {ISSUING_OFFICER}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <UserRound
                    className="h-5 w-5 text-slate-500"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                    Student reference
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {studentReference}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <Building2
                    className="h-5 w-5 text-slate-500"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                    Programme
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {programme}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <Clock3
                    className="h-5 w-5 text-slate-500"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-xs font-bold uppercase text-slate-500">
                    Processing target
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {service.expectedProcessingTime}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    approved
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {approved ? (
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
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                    D23 decision gate
                  </p>
                  <h2 className="mt-2 text-2xl font-bold">
                    {approved
                      ? "Registrar approval confirmed"
                      : "Outcome issuance blocked"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {decision
                      ? decision.applicantReason
                      : "Complete the Registrar decision before issuing an outcome."}
                  </p>
                  {decision ? (
                    <p className="mt-3 text-sm font-bold text-slate-700">
                      {decision.decidedBy} ·{" "}
                      {formatTimestamp(
                        decision.decidedAt,
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>

            {outcome ? (
              <article className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2557ff] text-white">
                      <FileBadge2
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                        Issued outcome
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-blue-950">
                        {outcome.title}
                      </h2>
                      <p className="mt-2 font-mono text-sm font-bold text-blue-800">
                        {outcome.publicReference}
                      </p>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-800">
                    {outcomeStatusLabel(outcome)}
                  </span>
                </div>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-5">
                    <dt className="text-xs font-bold uppercase text-blue-700">
                      Issued
                    </dt>
                    <dd className="mt-2 text-sm font-bold text-blue-950">
                      {formatTimestamp(outcome.issuedAt)}
                    </dd>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-5">
                    <dt className="text-xs font-bold uppercase text-blue-700">
                      Checksum
                    </dt>
                    <dd className="mt-2 font-mono text-sm font-bold text-blue-950">
                      {outcome.checksum}
                    </dd>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-5 sm:col-span-2">
                    <dt className="text-xs font-bold uppercase text-blue-700">
                      Exact-copy rule
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-blue-950">
                      {outcome.exactCopyStatement}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(
                      (currentValue) =>
                        !currentValue,
                    )
                  }
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-white px-5 text-sm font-bold text-blue-800"
                >
                  <Eye
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  {previewOpen
                    ? "Close exact-copy preview"
                    : "Preview exact issued copy"}
                </button>

                {previewOpen ? (
                  <iframe
                    title="Exact issued demonstration transcript"
                    srcDoc={outcome.documentHtml}
                    className="mt-5 h-[720px] w-full rounded-2xl border border-blue-200 bg-white"
                  />
                ) : null}
              </article>
            ) : null}

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <LockKeyhole
                  className="mt-1 h-5 w-5 shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    Controlled demonstration boundary
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    D24 stores one exact synthetic HTML
                    transcript in browser session state. It
                    does not create an official transcript,
                    production PDF, public storage URL or
                    permanent verification record.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <aside className="grid h-fit gap-5 xl:sticky xl:top-6">
            {!outcome ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="h-5 w-5 text-[#2557ff]"
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-bold">
                    Issue controlled outcome
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Choose the applicant delivery method. The
                  issued copy cannot be replaced during D24.
                </p>

                <div className="mt-5 grid gap-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={
                        deliveryMethod ===
                        "CONTROLLED_DOWNLOAD"
                      }
                      onChange={() =>
                        setDeliveryMethod(
                          "CONTROLLED_DOWNLOAD",
                        )
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-bold">
                        Controlled download
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Applicant downloads the exact stored
                        demonstration copy.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={
                        deliveryMethod ===
                        "PHYSICAL_COLLECTION"
                      }
                      onChange={() =>
                        setDeliveryMethod(
                          "PHYSICAL_COLLECTION",
                        )
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-bold">
                        Physical collection
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600">
                        Staff records collection before the
                        request completes.
                      </span>
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={issueOutcome}
                  disabled={!approved}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2557ff] px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileCheck2
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Issue exact demo transcript
                </button>
              </section>
            ) : (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <PackageCheck
                    className="h-5 w-5 text-emerald-600"
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-bold">
                    Applicant access
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Issuance and completion are separate. The
                  request completes only after recorded
                  download or collection.
                </p>

                {outcome.status === "ISSUED" &&
                outcome.deliveryMethod ===
                  "CONTROLLED_DOWNLOAD" ? (
                  <button
                    type="button"
                    onClick={downloadControlledCopy}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white"
                  >
                    <Download
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Download exact demo transcript
                  </button>
                ) : null}

                {outcome.status === "ISSUED" &&
                outcome.deliveryMethod ===
                  "PHYSICAL_COLLECTION" ? (
                  <button
                    type="button"
                    onClick={recordCollection}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white"
                  >
                    <Printer
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Record physical collection
                  </button>
                ) : null}

                {outcome.status !== "ISSUED" ? (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <CheckCircle2
                      className="h-5 w-5 text-emerald-700"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-bold text-emerald-950">
                      Request completed
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      Delivery was recorded at{" "}
                      {outcome.deliveredAt
                        ? formatTimestamp(
                            outcome.deliveredAt,
                          )
                        : "the controlled completion step"}
                      .
                    </p>
                  </div>
                ) : null}
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Required audit sequence
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  "request_approved",
                  "document_issued",
                  outcome?.deliveryMethod ===
                  "PHYSICAL_COLLECTION"
                    ? "outcome_collected"
                    : "outcome_downloaded",
                  "request_completed",
                ].map((eventName, index) => (
                  <div
                    key={eventName}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {eventName}
                    </span>
                  </div>
                ))}
              </div>
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
