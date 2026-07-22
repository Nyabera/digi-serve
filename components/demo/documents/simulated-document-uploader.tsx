"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  FileText,
  RefreshCw,
  Trash2,
  TriangleAlert,
  UploadCloud,
} from "lucide-react";

import { useDemoState } from "@/features/demo/state";
import type {
  DemoDocumentRequirementConfig,
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type { DemoFormValue } from "@/types/demo/demo-state";

type SimulatedDocumentUploaderProps = {
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

function formatFileSize(sizeBytes: number): string {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAcceptedTypes(
  acceptedTypes: readonly string[],
): string {
  const labels: Readonly<Record<string, string>> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/png": "PNG",
  };

  return acceptedTypes
    .map((type) => labels[type] ?? type)
    .join(", ");
}

function requirementLevelLabel(
  level: DemoDocumentRequirementConfig["level"],
): string {
  switch (level) {
    case "REQUIRED":
      return "Required";
    case "CONDITIONAL":
      return "Conditional";
    case "OPTIONAL":
      return "Optional";
  }
}

export function SimulatedDocumentUploader({
  service,
}: SimulatedDocumentUploaderProps) {
  const router = useRouter();
  const { state, dispatch, isHydrated } = useDemoState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const draft = state.formDrafts[service.slug] ?? {};

  const selectedDocuments = useMemo(
    () =>
      Object.fromEntries(
        service.requiredDocuments.map((requirement) => [
          requirement.id,
          parseDocumentMetadata(
            draft[documentFieldKey(requirement.id)],
          ),
        ]),
      ) as Readonly<Record<string, SimulatedDocumentMetadata | null>>,
    [draft, service.requiredDocuments],
  );

  const requiredDocuments = service.requiredDocuments.filter(
    (requirement) => requirement.level === "REQUIRED",
  );

  const completedRequiredDocuments = requiredDocuments.filter(
    (requirement) => selectedDocuments[requirement.id] !== null,
  );

  function saveDocumentValue(
    requirementId: string,
    value: string,
  ) {
    dispatch({
      type: "SET_FORM_VALUE",
      serviceSlug: service.slug,
      fieldKey: documentFieldKey(requirementId),
      value,
      at: new Date().toISOString(),
    });
  }

  function handleFileSelection(
    requirement: DemoDocumentRequirementConfig,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    const currentDocument = selectedDocuments[requirement.id];

    if (currentDocument && !requirement.replacementAllowed) {
      setErrorMessage(
        `${requirement.name} cannot be replaced after selection.`,
      );
      return;
    }

    if (!requirement.acceptedFileTypes.includes(file.type)) {
      setErrorMessage(
        `${requirement.name} must be one of: ${formatAcceptedTypes(
          requirement.acceptedFileTypes,
        )}.`,
      );
      return;
    }

    const maximumSizeBytes =
      requirement.maximumSizeMb * 1024 * 1024;

    if (file.size > maximumSizeBytes) {
      setErrorMessage(
        `${requirement.name} must not exceed ${requirement.maximumSizeMb} MB.`,
      );
      return;
    }

    const metadata: SimulatedDocumentMetadata = {
      requirementId: requirement.id,
      fileName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      lastModified: file.lastModified,
      selectedAt: new Date().toISOString(),
    };

    saveDocumentValue(
      requirement.id,
      JSON.stringify(metadata),
    );
    setErrorMessage(null);
  }

  function removeDocument(
    requirement: DemoDocumentRequirementConfig,
  ) {
    if (!requirement.replacementAllowed) {
      setErrorMessage(
        `${requirement.name} is locked after selection in this configuration.`,
      );
      return;
    }

    saveDocumentValue(requirement.id, "");
    setErrorMessage(null);
  }

  function continueToReview() {
    const missingRequiredDocuments = requiredDocuments.filter(
      (requirement) => selectedDocuments[requirement.id] === null,
    );

    if (missingRequiredDocuments.length > 0) {
      setErrorMessage(
        `Select ${missingRequiredDocuments.length} required document${
          missingRequiredDocuments.length === 1 ? "" : "s"
        } before continuing.`,
      );
      return;
    }

    setErrorMessage(null);
    router.push(
      `/demo/requests/${state.activeRequestId}/confirmation?service=${service.slug}`,
    );
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Simulated document selection
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Add supporting documents
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Select non-sensitive sample files. The demo validates file
              metadata but does not upload or retain the file contents.
            </p>
          </div>

          <div className="min-w-52 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-bold text-slate-700">
                Required documents
              </span>
              <span className="font-bold text-slate-950">
                {completedRequiredDocuments.length}/
                {requiredDocuments.length}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-950 transition-[width]"
                style={{
                  width: `${
                    requiredDocuments.length
                      ? Math.round(
                          (completedRequiredDocuments.length /
                            requiredDocuments.length) *
                            100,
                        )
                      : 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {service.requiredDocuments.length > 0 ? (
          <div className="mt-7 grid gap-5">
            {service.requiredDocuments.map((requirement) => {
              const selectedDocument =
                selectedDocuments[requirement.id];

              return (
                <article
                  key={requirement.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                        <FileText
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950">
                            {requirement.name}
                          </h3>

                          <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                            {requirementLevelLabel(requirement.level)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {requirement.description}
                        </p>

                        <p className="mt-3 text-xs font-medium text-slate-500">
                          {formatAcceptedTypes(
                            requirement.acceptedFileTypes,
                          )}{" "}
                          · Maximum {requirement.maximumSizeMb} MB
                        </p>
                      </div>
                    </div>

                    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100">
                      {selectedDocument ? (
                        <RefreshCw
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      ) : (
                        <UploadCloud
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      )}

                      {selectedDocument
                        ? requirement.replacementAllowed
                          ? "Replace document"
                          : "Selection locked"
                        : "Select document"}

                      <input
                        type="file"
                        accept={requirement.acceptedFileTypes.join(",")}
                        disabled={
                          Boolean(selectedDocument) &&
                          !requirement.replacementAllowed
                        }
                        onChange={(event) =>
                          handleFileSelection(requirement, event)
                        }
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {selectedDocument ? (
                    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                          aria-hidden="true"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-emerald-950">
                            {selectedDocument.fileName}
                          </p>
                          <p className="mt-1 text-xs text-emerald-800">
                            {formatFileSize(
                              selectedDocument.sizeBytes,
                            )}{" "}
                            · Metadata saved in this demo session
                          </p>
                        </div>
                      </div>

                      {requirement.replacementAllowed ? (
                        <button
                          type="button"
                          onClick={() => removeDocument(requirement)}
                          className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-100"
                        >
                          <Trash2
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Remove
                        </button>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                          Replacement disabled
                        </span>
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <FileCheck2
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold text-emerald-950">
                No supporting documents required
              </p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                This configured service can continue directly to review.
              </p>
            </div>
          </div>
        )}
      </section>

      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          <TriangleAlert
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          File contents are not persisted. Only filename, MIME type, size,
          modification timestamp and selection time are stored.
        </p>

        <button
          type="button"
          disabled={!isHydrated}
          onClick={continueToReview}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue to review
          <ArrowRight
            className="ml-3 h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </section>
    </div>
  );
}
