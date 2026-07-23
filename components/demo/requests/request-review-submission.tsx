"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileText,
  ShieldCheck,
  TriangleAlert,
  UserRound,
} from "lucide-react";

import { useDemoState } from "@/features/demo/state";
import type {
  DemoDocumentRequirementConfig,
  DemoFormFieldConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

type RequestReviewSubmissionProps = {
  readonly requestId: string;
  readonly service: DemoServiceConfig;
};

type SimulatedDocumentMetadata = {
  readonly requirementId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly lastModified: number;
  readonly selectedAt: string;
};

const DOCUMENT_FIELD_PREFIX = "__document:";
const SUBMISSION_FIELD_PREFIX = "__submission:";
const SUBMITTED_AT_FIELD = `${SUBMISSION_FIELD_PREFIX}submittedAt`;
const REFERENCE_FIELD = `${SUBMISSION_FIELD_PREFIX}reference`;
const CONFIRMATION_FIELD = `${SUBMISSION_FIELD_PREFIX}confirmed`;

function documentFieldKey(requirementId: string): string {
  return `${DOCUMENT_FIELD_PREFIX}${requirementId}`;
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

    const candidate = parsed as Partial<SimulatedDocumentMetadata>;

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

function isComplete(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): boolean {
  if (!field.required) {
    return true;
  }

  if (field.type === "CHECKBOX" || field.type === "DECLARATION") {
    return value === true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return false;
}

function formatValue(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): string {
  if (value === true) {
    return "Confirmed";
  }

  if (value === false || value === undefined || value === "") {
    return "Not provided";
  }

  if (field.type === "SELECT" && typeof value === "string") {
    return (
      field.options?.find((option) => option.value === value)?.label ??
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

function readString(
  value: DemoFormValue | undefined,
): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : null;
}

export function RequestReviewSubmission({
  requestId,
  service,
}: RequestReviewSubmissionProps) {
  const router = useRouter();
  const { state, dispatch, isHydrated } = useDemoState();
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const draft = useMemo(

    () => state.formDrafts[service.slug] ?? {},

    [service.slug, state.formDrafts],

  );
  const submittedAt = readString(draft[SUBMITTED_AT_FIELD]);
  const submissionReference =
    readString(draft[REFERENCE_FIELD]) ?? requestId;

  const fields = useMemo(
    () => service.form.sections.flatMap((section) => section.fields),
    [service.form.sections],
  );

  const missingFields = fields.filter(
    (field) => !isComplete(field, draft[field.key]),
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

  const missingDocuments = service.requiredDocuments.filter(
    (requirement) =>
      requirement.level === "REQUIRED" &&
      selectedDocuments[requirement.id] === null,
  );

  const applicationComplete =
    state.applicant.registered &&
    missingFields.length === 0 &&
    missingDocuments.length === 0;

  function saveSubmissionValue(
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

  function submitRequest() {
    if (!applicationComplete) {
      setErrorMessage(
        "Complete the applicant, form and required-document steps before submission.",
      );
      return;
    }

    if (!confirmed) {
      setErrorMessage(
        "Confirm the submission declaration before submitting.",
      );
      return;
    }

    if (submittedAt) {
      router.replace(
        `/demo/requests/${submissionReference}/confirmation?service=${service.slug}&submitted=1`,
      );
      return;
    }

    const at = new Date().toISOString();

    saveSubmissionValue(SUBMITTED_AT_FIELD, at, at);
    saveSubmissionValue(REFERENCE_FIELD, requestId, at);
    saveSubmissionValue(CONFIRMATION_FIELD, true, at);

    dispatch({
      type: "ADD_ACTIVITY_EVENT",
      event: {
        id: `ACT-SUBMISSION-${Date.now()}`,
        name: "request_submitted",
        requestId,
        occurredAt: at,
      },
      at,
    });

    setErrorMessage(null);
    router.replace(
      `/demo/requests/${requestId}/confirmation?service=${service.slug}&submitted=1`,
    );
  }

  if (!isHydrated) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-950">
          Loading your saved application…
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          FAIDIA is restoring the current browser-session draft.
        </p>
      </section>
    );
  }

  if (submittedAt) {
    return (
      <div className="grid gap-8">
        <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
          <div className="bg-emerald-700 px-6 py-8 text-white sm:px-8">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
              <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
            </span>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Submission confirmed
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Your request has been submitted
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              {service.name} has entered the simulated institutional
              workflow. Use the reference below when tracking progress.
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Request reference
              </p>
              <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-slate-950">
                {submissionReference}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Submitted
              </p>
              <p className="mt-3 text-lg font-bold text-slate-950">
                {new Date(submittedAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Applicant-safe status
              </p>
              <p className="mt-3 text-lg font-bold text-slate-950">
                Submitted
              </p>
              <p className="mt-1 text-sm text-slate-600">
                The receiving team can now begin review.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Processing target
              </p>
              <p className="mt-3 text-lg font-bold text-slate-950">
                {service.expectedProcessingTime}
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-slate-950">
              Continue the demonstration
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Track the applicant-safe journey or open the staff workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/demo/track/${submissionReference}`}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Track request
              <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/demo/officer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
            >
              Open officer workspace
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {!applicationComplete ? (
        <section
          role="alert"
          className="rounded-3xl border border-amber-200 bg-amber-50 p-6"
        >
          <div className="flex items-start gap-3">
            <TriangleAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />

            <div>
              <h2 className="font-bold text-amber-950">
                Application is incomplete
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-900/80">
                {missingFields.length} required form field
                {missingFields.length === 1 ? "" : "s"} and{" "}
                {missingDocuments.length} required document
                {missingDocuments.length === 1 ? "" : "s"} still need
                attention.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/demo/apply/${service.slug}`}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-amber-300 bg-white px-4 text-sm font-bold text-amber-950"
                >
                  Return to application
                </Link>

                <Link
                  href={`/demo/apply/${service.slug}?step=documents`}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-amber-300 bg-white px-4 text-sm font-bold text-amber-950"
                >
                  Return to documents
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Review before submission
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Applicant and service
            </h2>
          </div>

          <Link
            href={`/demo/sign-up?service=${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Edit applicant
          </Link>
        </div>

        <dl className="mt-7 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Applicant
            </dt>
            <dd className="mt-3 text-lg font-bold text-slate-950">
              {state.applicant.fullName || "Not provided"}
            </dd>
            <dd className="mt-1 text-sm text-slate-600">
              {state.applicant.email || "No email"} ·{" "}
              {state.applicant.phone || "No phone"}
            </dd>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Service
            </dt>
            <dd className="mt-3 text-lg font-bold text-slate-950">
              {service.name}
            </dd>
            <dd className="mt-1 text-sm text-slate-600">
              {service.expectedProcessingTime}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Application responses
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Confirm the information provided
            </h2>
          </div>

          <Link
            href={`/demo/apply/${service.slug}`}
            className="text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            Edit form
          </Link>
        </div>

        <div className="mt-7 grid gap-8">
          {service.form.sections.map((section) => (
            <section key={section.id}>
              <h3 className="text-lg font-bold text-slate-950">
                {section.title}
              </h3>

              <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.key} className="bg-white p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {field.label}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-medium leading-6 text-slate-900">
                      {formatValue(field, draft[field.key])}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Supporting documents
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Selected document metadata
            </h2>
          </div>

          <Link
            href={`/demo/apply/${service.slug}?step=documents`}
            className="text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            Edit documents
          </Link>
        </div>

        <div className="mt-7 grid gap-4">
          {service.requiredDocuments.map((requirement) => {
            const document = selectedDocuments[requirement.id];

            return (
              <article
                key={requirement.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                    {document ? (
                      <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-950">
                        {requirement.name}
                      </h3>

                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        {requirementLevelLabel(requirement)}
                      </span>
                    </div>

                    <p className="mt-2 break-all text-sm text-slate-600">
                      {document
                        ? `${document.fileName} · ${formatFileSize(
                            document.sizeBytes,
                          )}`
                        : "No document selected"}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                    document
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {document ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : null}
                  {document ? "Selected" : "Not selected"}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => {
              setConfirmed(event.target.checked);
              setErrorMessage(null);
            }}
            className="mt-1 h-4 w-4 rounded border-slate-300"
          />

          <span className="text-sm leading-6 text-slate-700">
            I confirm that I have reviewed the applicant information,
            application responses and selected-document metadata, and I
            authorize this simulated request to be submitted.
          </span>
        </label>

        <div className="mt-6 flex flex-col gap-5 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-xl items-start gap-3 text-sm leading-6 text-slate-600">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <p>
              Submission records a synthetic activity event and confirmation
              metadata in the browser session. It does not create a production database record.
            </p>
          </div>

          <button
            type="button"
            onClick={submitRequest}
            disabled={!applicationComplete || !isHydrated}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit request
            <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <Clock3 className="h-5 w-5 text-slate-500" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold text-slate-950">
            Processing target
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {service.expectedProcessingTime}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <FileCheck2 className="h-5 w-5 text-slate-500" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold text-slate-950">
            Documents selected
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {
              Object.values(selectedDocuments).filter(
                (document) => document !== null,
              ).length
            }{" "}
            of {service.requiredDocuments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <ShieldCheck className="h-5 w-5 text-slate-500" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold text-slate-950">
            Confirmation required
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            The submit action stays disabled until the journey is complete.
          </p>
        </div>
      </section>
    </div>
  );
}
