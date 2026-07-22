"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileText,
  MessageSquareText,
  Send,
  ShieldCheck,
  TriangleAlert,
  UserRound,
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

type OfficerRequestReviewProps = {
  readonly requestId: string;
  readonly organizationName: string;
  readonly service: DemoServiceConfig;
  readonly departments: readonly DepartmentOption[];
};

type SimulatedDocumentMetadata = {
  readonly requirementId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly lastModified: number;
  readonly selectedAt: string;
};

type InternalNote = {
  readonly id: string;
  readonly body: string;
  readonly author: string;
  readonly createdAt: string;
};

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
  readonly status: "PENDING_ACCEPTANCE";
  readonly originatingOfficer: string;
  readonly createdAt: string;
};

type TimelineItem = {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly occurredAt: string;
};

type UnknownRecord = Record<string, unknown>;

const DOCUMENT_FIELD_PREFIX = "__document:";
const REVIEW_FIELD_PREFIX = "__officerReview:";

const REVIEW_STARTED_FIELD = `${REVIEW_FIELD_PREFIX}started`;
const REVIEW_STARTED_AT_FIELD = `${REVIEW_FIELD_PREFIX}startedAt`;
const REVIEW_STATUS_FIELD = `${REVIEW_FIELD_PREFIX}status`;
const PUBLIC_STATUS_FIELD = `${REVIEW_FIELD_PREFIX}publicStatus`;
const APPLICATION_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}applicationChecked`;
const DOCUMENTS_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}documentsChecked`;
const IDENTITY_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}identityChecked`;
const INTERNAL_NOTES_FIELD = `${REVIEW_FIELD_PREFIX}internalNotes`;
const CORRECTION_REASON_FIELD =
  `${REVIEW_FIELD_PREFIX}correctionReason`;
const CORRECTION_INSTRUCTIONS_FIELD =
  `${REVIEW_FIELD_PREFIX}correctionInstructions`;
const REFERRAL_FIELD = `${REVIEW_FIELD_PREFIX}referral`;

const ORIGINATING_DEPARTMENT_NAME = "Student Records";
const OFFICER_NAME = "Amina Njeri";

function documentFieldKey(requirementId: string): string {
  return `${DOCUMENT_FIELD_PREFIX}${requirementId}`;
}

function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as UnknownRecord;
  }

  return {};
}

function firstText(
  record: UnknownRecord,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function parseDocumentMetadata(
  value: DemoFormValue | undefined,
): SimulatedDocumentMetadata | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const candidate =
      parsed as Partial<SimulatedDocumentMetadata>;

    if (
      typeof candidate.requirementId !== "string" ||
      typeof candidate.fileName !== "string" ||
      typeof candidate.mimeType !== "string" ||
      typeof candidate.sizeBytes !== "number" ||
      typeof candidate.lastModified !== "number" ||
      typeof candidate.selectedAt !== "string"
    ) {
      return null;
    }

    return candidate as SimulatedDocumentMetadata;
  } catch {
    return null;
  }
}

function parseInternalNotes(
  value: DemoFormValue | undefined,
): readonly InternalNote[] {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((note): note is InternalNote => {
      const candidate = asRecord(note);

      return (
        typeof candidate.id === "string" &&
        typeof candidate.body === "string" &&
        typeof candidate.author === "string" &&
        typeof candidate.createdAt === "string"
      );
    });
  } catch {
    return [];
  }
}

function parseReferral(
  value: DemoFormValue | undefined,
): ReferralRecord | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      typeof candidate.receivingDepartmentId !== "string" ||
      typeof candidate.receivingDepartmentName !== "string" ||
      typeof candidate.requestedAction !== "string" ||
      typeof candidate.reason !== "string" ||
      typeof candidate.expectedOutput !== "string" ||
      typeof candidate.dueDate !== "string" ||
      candidate.status !== "PENDING_ACCEPTANCE" ||
      typeof candidate.createdAt !== "string"
    ) {
      return null;
    }

    return parsed as ReferralRecord;
  } catch {
    return null;
  }
}

function readBoolean(
  value: DemoFormValue | undefined,
): boolean {
  return value === true;
}

function readString(
  value: DemoFormValue | undefined,
): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : null;
}

function formatFormValue(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): string {
  if (value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Confirmed" : "No";
  }

  if (field.options && typeof value === "string") {
    return (
      field.options.find((option) => option.value === value)?.label ??
      value
    );
  }

  return String(value);
}

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function requirementLevelLabel(
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

function createTimelineItems(
  timelineEvents: readonly unknown[],
  requestId: string,
): readonly TimelineItem[] {
  return timelineEvents
    .map((event, index) => {
      const record = asRecord(event);
      const eventRequestId = firstText(record, [
        "requestId",
        "entityId",
      ]);

      if (eventRequestId && eventRequestId !== requestId) {
        return null;
      }

      const title =
        firstText(record, ["title", "label", "name", "eventName"]) ??
        "Request activity";

      const detail =
        firstText(record, [
          "detail",
          "description",
          "message",
          "summary",
        ]) ?? "Recorded in the shared demonstration history.";

      const occurredAt =
        firstText(record, [
          "occurredAt",
          "createdAt",
          "timestamp",
          "at",
        ]) ?? new Date(0).toISOString();

      return {
        id:
          firstText(record, ["id"]) ??
          `timeline-${index}`,
        title,
        detail,
        occurredAt,
      };
    })
    .filter((item): item is TimelineItem => item !== null)
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() -
        new Date(left.occurredAt).getTime(),
    )
    .slice(0, 8);
}

function statusBadgeClassName(status: string): string {
  if (status === "WAITING_ON_FINANCE") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (status === "CORRECTION_REQUESTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "IN_REVIEW") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function statusLabel(status: string): string {
  switch (status) {
    case "WAITING_ON_FINANCE":
      return "Waiting on Finance";
    case "CORRECTION_REQUESTED":
      return "Correction requested";
    case "IN_REVIEW":
      return "In review";
    default:
      return "Submitted";
  }
}

export function OfficerRequestReview({
  requestId,
  organizationName,
  service,
  departments,
}: OfficerRequestReviewProps) {
  const { state, dispatch, isHydrated } = useDemoState();

  const [internalNote, setInternalNote] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctionInstructions, setCorrectionInstructions] =
    useState("");
  const [referralDepartmentId, setReferralDepartmentId] = useState(
    () =>
      departments.find(
        (department) => department.name === "Finance",
      )?.id ??
      departments[0]?.id ??
      "",
  );
  const [requestedAction, setRequestedAction] = useState(
    "Verify the submitted manual payment reference and confirm whether the student account is clear.",
  );
  const [referralReason, setReferralReason] = useState(
    "Finance verification is required before the transcript request can proceed to final review.",
  );
  const [expectedOutput, setExpectedOutput] = useState(
    "Return one structured result: CLEAR, HOLD or CANNOT_VERIFY.",
  );
  const [dueDate, setDueDate] = useState("");
  const [feedbackMessage, setFeedbackMessage] =
    useState<string | null>(null);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const draft = useMemo(
    () => state.formDrafts[service.slug] ?? {},
    [service.slug, state.formDrafts],
  );


  const selectedDocuments = useMemo(
    () =>
      Object.fromEntries(
        service.requiredDocuments.map((requirement) => [
          requirement.id,
          parseDocumentMetadata(
            draft[documentFieldKey(requirement.id)],
          ),
        ]),
      ) as Readonly<
        Record<string, SimulatedDocumentMetadata | null>
      >,
    [draft, service.requiredDocuments],
  );

  const internalNotes = useMemo(
    () => parseInternalNotes(draft[INTERNAL_NOTES_FIELD]),
    [draft],
  );

  const referral = useMemo(
    () => parseReferral(draft[REFERRAL_FIELD]),
    [draft],
  );

  const timelineItems = useMemo(
    () =>
      createTimelineItems(
        state.timelineEvents as readonly unknown[],
        requestId,
      ),
    [requestId, state.timelineEvents],
  );

  const reviewStarted = readBoolean(
    draft[REVIEW_STARTED_FIELD],
  );
  const applicationChecked = readBoolean(
    draft[APPLICATION_CHECKED_FIELD],
  );
  const documentsChecked = readBoolean(
    draft[DOCUMENTS_CHECKED_FIELD],
  );
  const identityChecked = readBoolean(
    draft[IDENTITY_CHECKED_FIELD],
  );

  const reviewStatus =
    readString(draft[REVIEW_STATUS_FIELD]) ?? "SUBMITTED";

  const checklistComplete =
    applicationChecked &&
    documentsChecked &&
    identityChecked;

  const originatingDepartment =
    departments.find(
      (department) =>
        department.name === ORIGINATING_DEPARTMENT_NAME,
    ) ?? departments[0];

  function saveReviewValue(
    fieldKey: string,
    value: DemoFormValue,
    at = new Date().toISOString(),
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
    at = new Date().toISOString(),
  ) {
    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-${name.toUpperCase()}-${Date.now()}`,
        name,
        requestId,
        occurredAt: at,
      },
      at,
    });
  }

  function startReview() {
    const at = new Date().toISOString();

    saveReviewValue(REVIEW_STARTED_FIELD, true, at);
    saveReviewValue(REVIEW_STARTED_AT_FIELD, at, at);
    saveReviewValue(REVIEW_STATUS_FIELD, "IN_REVIEW", at);
    saveReviewValue(PUBLIC_STATUS_FIELD, "IN_REVIEW", at);

    addActivity("request_opened_by_officer", at);
    addActivity("first_action_taken", at);

    setErrorMessage(null);
    setFeedbackMessage("Review started and recorded.");
  }

  function updateChecklist(
    fieldKey: string,
    checked: boolean,
  ) {
    saveReviewValue(fieldKey, checked);
    setErrorMessage(null);
    setFeedbackMessage("Completeness assessment updated.");
  }

  function saveInternalNote(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const body = internalNote.trim();

    if (!body) {
      setErrorMessage("Enter an internal note before saving.");
      return;
    }

    const at = new Date().toISOString();
    const nextNotes: readonly InternalNote[] = [
      ...internalNotes,
      {
        id: `NOTE-${Date.now()}`,
        body,
        author: OFFICER_NAME,
        createdAt: at,
      },
    ];

    saveReviewValue(
      INTERNAL_NOTES_FIELD,
      JSON.stringify(nextNotes),
      at,
    );
    addActivity("internal_note_added", at);

    setInternalNote("");
    setErrorMessage(null);
    setFeedbackMessage(
      "Internal note saved. It remains hidden from applicants.",
    );
  }

  function requestCorrection(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const reason = correctionReason.trim();
    const instructions = correctionInstructions.trim();

    if (!reviewStarted) {
      setErrorMessage(
        "Start the officer review before requesting a correction.",
      );
      return;
    }

    if (!reason || !instructions) {
      setErrorMessage(
        "Enter both a correction reason and applicant instructions.",
      );
      return;
    }

    const at = new Date().toISOString();

    saveReviewValue(CORRECTION_REASON_FIELD, reason, at);
    saveReviewValue(
      CORRECTION_INSTRUCTIONS_FIELD,
      instructions,
      at,
    );
    saveReviewValue(
      REVIEW_STATUS_FIELD,
      "CORRECTION_REQUESTED",
      at,
    );
    saveReviewValue(PUBLIC_STATUS_FIELD, "ACTION_REQUIRED", at);

    addActivity("document_returned", at);

    setErrorMessage(null);
    setFeedbackMessage(
      "Applicant correction requested. Internal notes were not exposed.",
    );
  }

  function createReferral(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const receivingDepartment = departments.find(
      (department) =>
        department.id === referralDepartmentId,
    );

    if (!reviewStarted) {
      setErrorMessage(
        "Start the officer review before creating a referral.",
      );
      return;
    }

    if (!checklistComplete) {
      setErrorMessage(
        "Complete all three review checks before creating the referral.",
      );
      return;
    }

    if (
      !receivingDepartment ||
      !requestedAction.trim() ||
      !referralReason.trim() ||
      !expectedOutput.trim() ||
      !dueDate
    ) {
      setErrorMessage(
        "Complete the receiving department, requested action, reason, expected output and due date.",
      );
      return;
    }

    const at = new Date().toISOString();

    const referralRecord: ReferralRecord = {
      id: `HND-DEMO-${Date.now()}`,
      requestId,
      originatingDepartmentId:
        originatingDepartment?.id ?? "student-records",
      originatingDepartmentName:
        originatingDepartment?.name ??
        ORIGINATING_DEPARTMENT_NAME,
      receivingDepartmentId: receivingDepartment.id,
      receivingDepartmentName: receivingDepartment.name,
      requestedAction: requestedAction.trim(),
      reason: referralReason.trim(),
      expectedOutput: expectedOutput.trim(),
      dueDate,
      status: "PENDING_ACCEPTANCE",
      originatingOfficer: OFFICER_NAME,
      createdAt: at,
    };

    saveReviewValue(
      REFERRAL_FIELD,
      JSON.stringify(referralRecord),
      at,
    );
    saveReviewValue(
      REVIEW_STATUS_FIELD,
      "WAITING_ON_FINANCE",
      at,
    );
    saveReviewValue(
      PUBLIC_STATUS_FIELD,
      "ADDITIONAL_CHECKS_IN_PROGRESS",
      at,
    );

    addActivity("handoff_created", at);

    setErrorMessage(null);
    setFeedbackMessage(
      `${receivingDepartment.name} referral created. Student Records remains the parent-request owner.`,
    );
  }

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#f4f5f7] px-5 py-12 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-slate-950">
            Restoring officer workspace…
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            FAIDIA is loading the shared browser demonstration state.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="border-b border-white/10 bg-[#07090f] text-white">
        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8">
          <Link
            href="/demo/officer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white/65 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to officer queue
          </Link>

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Officer request review
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {requestId}
              </h1>
              <p className="mt-3 text-base text-white/70">
                {service.name} · {organizationName}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-4 py-2 text-sm font-bold ${statusBadgeClassName(reviewStatus)}`}
              >
                {statusLabel(reviewStatus)}
              </span>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/40">
                  Parent owner
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {originatingDepartment?.name ??
                    ORIGINATING_DEPARTMENT_NAME}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
        <div className="grid gap-8">
          <section className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <UserRound
                className="h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Applicant
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {state.applicant.fullName || "Demo applicant"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {state.applicant.email || "No email recorded"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {state.applicant.phone || "No phone recorded"}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Building2
                className="h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Current ownership
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {originatingDepartment?.name ??
                  ORIGINATING_DEPARTMENT_NAME}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Ownership remains here during a referral.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Clock3
                className="h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Processing target
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {service.expectedProcessingTime}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Demo SLA context; not a production commitment.
              </p>
            </article>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Submitted application
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Applicant responses
              </h2>
            </div>

            <div className="mt-7 grid gap-8">
              {service.form.sections.map((section) => (
                <div key={section.id}>
                  <h3 className="text-lg font-bold text-slate-950">
                    {section.title}
                  </h3>

                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    {section.fields.map((field) => (
                      <div
                        key={field.key}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {field.label}
                        </dt>
                        <dd className="mt-2 text-sm font-medium leading-6 text-slate-900">
                          {formatFormValue(
                            field,
                            draft[field.key] ?? field.defaultValue,
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Document review
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Submitted document metadata
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The Demo Engine displays selected-file metadata only.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {service.requiredDocuments.map((requirement) => {
                const document =
                  selectedDocuments[requirement.id];

                return (
                  <article
                    key={requirement.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <FileText
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {requirement.name}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {requirementLevelLabel(requirement)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {document
                            ? `${document.fileName} · ${formatFileSize(
                                document.sizeBytes,
                              )}`
                            : "No document metadata selected."}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
                        document
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {document ? (
                        <CheckCircle2
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      ) : (
                        <TriangleAlert
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      )}
                      {document ? "Available for review" : "Not selected"}
                    </span>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Internal timeline
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Request activity
              </h2>
            </div>

            <div className="mt-6 grid gap-5">
              {timelineItems.length > 0 ? (
                timelineItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid grid-cols-[18px_minmax(0,1fr)] gap-4"
                  >
                    <span className="mt-1.5 h-3 w-3 rounded-full bg-[#2557ff] ring-4 ring-blue-50" />
                    <div>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="text-sm font-bold text-slate-950">
                          {item.title.replaceAll("_", " ")}
                        </h3>
                        <time className="text-xs text-slate-500">
                          {formatTimestamp(item.occurredAt)}
                        </time>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-600">
                  No request-specific activity has been recorded yet.
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ClipboardCheck
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Available actions
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">
                  Officer review
                </h2>
              </div>
            </div>

            {!reviewStarted ? (
              <button
                type="button"
                onClick={startReview}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2557ff] px-5 text-sm font-bold text-white transition hover:bg-[#1945de]"
              >
                Start review
                <ArrowRight
                  className="ml-3 h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
                <CheckCircle2
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                Review started by {OFFICER_NAME}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold">
                Completeness assessment
              </h2>
            </div>

            <div className="mt-5 grid gap-3">
              {[
                {
                  fieldKey: APPLICATION_CHECKED_FIELD,
                  checked: applicationChecked,
                  label: "Application responses reviewed",
                },
                {
                  fieldKey: DOCUMENTS_CHECKED_FIELD,
                  checked: documentsChecked,
                  label: "Required documents reviewed",
                },
                {
                  fieldKey: IDENTITY_CHECKED_FIELD,
                  checked: identityChecked,
                  label: "Applicant identity details reviewed",
                },
              ].map((item) => (
                <label
                  key={item.fieldKey}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    disabled={!reviewStarted}
                    onChange={(event) =>
                      updateChecklist(
                        item.fieldKey,
                        event.target.checked,
                      )
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Complete all three checks before creating a departmental
              referral.
            </p>
          </section>

          <form
            onSubmit={saveInternalNote}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <MessageSquareText
                className="h-5 w-5 text-slate-500"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold">Internal notes</h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Notes are visible to authorized staff only.
            </p>

            <textarea
              value={internalNote}
              onChange={(event) =>
                setInternalNote(event.target.value)
              }
              rows={4}
              placeholder="Record an internal review observation"
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <button
              type="submit"
              disabled={!reviewStarted}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save internal note
            </button>

            {internalNotes.length > 0 ? (
              <div className="mt-5 border-t border-slate-200 pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Latest note
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {internalNotes[internalNotes.length - 1]?.body}
                </p>
              </div>
            ) : null}
          </form>

          <form
            onSubmit={requestCorrection}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <TriangleAlert
                className="h-5 w-5 text-amber-600"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold">
                Request applicant correction
              </h2>
            </div>

            <label className="mt-5 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Reason
              </span>
              <input
                value={correctionReason}
                onChange={(event) =>
                  setCorrectionReason(event.target.value)
                }
                placeholder="Example: payment evidence is unclear"
                className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Applicant-visible instructions
              </span>
              <textarea
                value={correctionInstructions}
                onChange={(event) =>
                  setCorrectionInstructions(event.target.value)
                }
                rows={4}
                placeholder="Explain exactly what the applicant must correct"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <button
              type="submit"
              disabled={!reviewStarted}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-5 text-sm font-bold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send correction request
            </button>
          </form>

          <form
            onSubmit={createReferral}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Send
                className="h-5 w-5 text-[#2557ff]"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold">
                Create departmental referral
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Student Records keeps the parent request. The receiving
              department gets one defined work item.
            </p>

            <label className="mt-5 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Receiving department
              </span>
              <select
                value={referralDepartmentId}
                onChange={(event) =>
                  setReferralDepartmentId(event.target.value)
                }
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                {departments
                  .filter(
                    (department) =>
                      department.id !== originatingDepartment?.id,
                  )
                  .map((department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.name}
                    </option>
                  ))}
              </select>
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Requested action
              </span>
              <textarea
                value={requestedAction}
                onChange={(event) =>
                  setRequestedAction(event.target.value)
                }
                rows={3}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Reason
              </span>
              <textarea
                value={referralReason}
                onChange={(event) =>
                  setReferralReason(event.target.value)
                }
                rows={3}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Expected output
              </span>
              <textarea
                value={expectedOutput}
                onChange={(event) =>
                  setExpectedOutput(event.target.value)
                }
                rows={3}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <label className="mt-4 grid gap-2">
              <span className="text-sm font-bold text-slate-800">
                Due date
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </label>

            <button
              type="submit"
              disabled={!reviewStarted || !checklistComplete}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send referral
              <ArrowRight
                className="ml-3 h-4 w-4"
                aria-hidden="true"
              />
            </button>

            {referral ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <FileCheck2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Referral pending acceptance
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      {referral.receivingDepartmentName} · due{" "}
                      {referral.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </form>

          {errorMessage ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium leading-6 text-red-700"
            >
              {errorMessage}
            </div>
          ) : null}

          {feedbackMessage ? (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium leading-6 text-emerald-800"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{feedbackMessage}</span>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
