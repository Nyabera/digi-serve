"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { getDemoOfficerReviewReference } from "@/features/demo-engine/adapters/get-demo-officer-review-reference";
import { useDemoState } from "@/features/demo/state";
import { OfficerReviewReferralBody } from "@/features/officer-review/components/officer-review-referral-body";
import type {
  OfficerReviewReferralModel,
  ReviewStatusTone,
} from "@/features/officer-review/model/officer-review-model";
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

const REVIEW_STARTED_FIELD =
  `${REVIEW_FIELD_PREFIX}started`;
const REVIEW_STARTED_AT_FIELD =
  `${REVIEW_FIELD_PREFIX}startedAt`;
const REVIEW_STATUS_FIELD =
  `${REVIEW_FIELD_PREFIX}status`;
const PUBLIC_STATUS_FIELD =
  `${REVIEW_FIELD_PREFIX}publicStatus`;
const APPLICATION_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}applicationChecked`;
const DOCUMENTS_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}documentsChecked`;
const IDENTITY_CHECKED_FIELD =
  `${REVIEW_FIELD_PREFIX}identityChecked`;
const INTERNAL_NOTES_FIELD =
  `${REVIEW_FIELD_PREFIX}internalNotes`;
const CORRECTION_REASON_FIELD =
  `${REVIEW_FIELD_PREFIX}correctionReason`;
const CORRECTION_INSTRUCTIONS_FIELD =
  `${REVIEW_FIELD_PREFIX}correctionInstructions`;
const REFERRAL_FIELD =
  `${REVIEW_FIELD_PREFIX}referral`;

const ORIGINATING_DEPARTMENT_NAME =
  "Student Records";
const OFFICER_NAME = "Grace Wanjiku";

function documentFieldKey(
  requirementId: string,
): string {
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

function firstText(
  record: UnknownRecord,
  keys: readonly string[],
): string | null {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return null;
}

function parseDocumentMetadata(
  value: DemoFormValue | undefined,
): SimulatedDocumentMetadata | null {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed !== "object" ||
      parsed === null
    ) {
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
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (note): note is InternalNote => {
        const candidate = asRecord(note);

        return (
          typeof candidate.id === "string" &&
          typeof candidate.body === "string" &&
          typeof candidate.author === "string" &&
          typeof candidate.createdAt === "string"
        );
      },
    );
  } catch {
    return [];
  }
}

function parseReferral(
  value: DemoFormValue | undefined,
): ReferralRecord | null {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    const candidate = asRecord(parsed);

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.requestId !== "string" ||
      typeof candidate.receivingDepartmentId !==
        "string" ||
      typeof candidate.receivingDepartmentName !==
        "string" ||
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
  return (
    typeof value === "string" &&
    value.trim().length > 0
      ? value
      : null
  );
}

function formatFormValue(
  field: DemoFormFieldConfig,
  value: DemoFormValue | undefined,
): string {
  if (
    value === undefined ||
    value === ""
  ) {
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

function formatFileSize(
  sizeBytes: number,
): string {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(sizeBytes / 1024),
    )} KB`;
  }

  return `${(
    sizeBytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
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

function formatTimestamp(
  value: string,
): string {
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
  const mapped = timelineEvents
    .map((event, index) => {
      const record = asRecord(event);
      const eventRequestId = firstText(record, [
        "requestId",
        "entityId",
      ]);

      if (
        eventRequestId &&
        eventRequestId !== requestId
      ) {
        return null;
      }

      return {
        id:
          firstText(record, ["id"]) ??
          `timeline-${index}`,
        title:
          firstText(record, [
            "title",
            "label",
            "name",
            "eventName",
          ]) ?? "Request activity",
        detail:
          firstText(record, [
            "detail",
            "description",
            "message",
            "summary",
          ]) ??
          "Recorded in the shared demonstration history.",
        occurredAt:
          firstText(record, [
            "occurredAt",
            "createdAt",
            "timestamp",
            "at",
          ]) ?? new Date(0).toISOString(),
      };
    })
    .filter(
      (item): item is TimelineItem =>
        item !== null,
    )
    .sort(
      (left, right) =>
        new Date(
          right.occurredAt,
        ).getTime() -
        new Date(
          left.occurredAt,
        ).getTime(),
    );

  if (mapped.length > 0) {
    return mapped.slice(0, 4);
  }

  return [
    {
      id: "timeline-review",
      title: "Grace Wanjiku",
      detail:
        "Reviewed submitted information and opened the officer workspace.",
      occurredAt: "2026-07-23T11:22:00+03:00",
    },
    {
      id: "timeline-created",
      title: "System",
      detail:
        "Application submitted and added to the Student Records queue.",
      occurredAt: "2026-07-22T10:43:00+03:00",
    },
  ];
}

function statusPresentation(
  status: string,
): {
  readonly label: string;
  readonly tone: ReviewStatusTone;
  readonly step: string;
} {
  switch (status) {
    case "WAITING_ON_FINANCE":
      return {
        label: "Waiting on Finance",
        tone: "orange",
        step: "Department verification",
      };
    case "CORRECTION_REQUESTED":
      return {
        label: "Correction requested",
        tone: "red",
        step: "Applicant correction",
      };
    case "IN_REVIEW":
      return {
        label: "In review",
        tone: "blue",
        step: "Officer review",
      };
    default:
      return {
        label: "Submitted",
        tone: "neutral",
        step: "Document verification",
      };
  }
}

function applicantInitials(
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

export function OfficerRequestReview({
  requestId,
  organizationName,
  service,
  departments,
}: OfficerRequestReviewProps) {
  const {
    state,
    dispatch,
    isHydrated,
  } = useDemoState();
  const reference =
    getDemoOfficerReviewReference();

  const [internalNote, setInternalNote] =
    useState("");
  const [
    correctionOpen,
    setCorrectionOpen,
  ] = useState(false);
  const [
    correctionReason,
    setCorrectionReason,
  ] = useState("");
  const [
    correctionInstructions,
    setCorrectionInstructions,
  ] = useState("");
  const [
    referralDepartmentId,
    setReferralDepartmentId,
  ] = useState(
    () =>
      departments.find(
        (department) =>
          department.name === "Finance",
      )?.id ??
      departments[0]?.id ??
      "",
  );
  const [officerId, setOfficerId] =
    useState(
      reference.officers.find(
        (officer) =>
          officer.departmentName ===
          "Finance",
      )?.id ??
        reference.officers[0]?.id ??
        "",
    );
  const [
    requestedAction,
    setRequestedAction,
  ] = useState(
    reference.defaultRequestedAction,
  );
  const [
    referralReason,
    setReferralReason,
  ] = useState(reference.defaultReason);
  const [
    expectedOutput,
    setExpectedOutput,
  ] = useState(
    reference.defaultExpectedOutput,
  );
  const [dueDate, setDueDate] =
    useState(reference.defaultDueDate);
  const [urgency, setUrgency] =
    useState<
      "LOW" | "NORMAL" | "HIGH"
    >("NORMAL");
  const [
    shareSelections,
    setShareSelections,
  ] = useState({
    notes: true,
    sla: true,
    audit: true,
  });
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

  const selectedDocuments = useMemo(
    () =>
      Object.fromEntries(
        service.requiredDocuments.map(
          (requirement) => [
            requirement.id,
            parseDocumentMetadata(
              draft[
                documentFieldKey(
                  requirement.id,
                )
              ],
            ),
          ],
        ),
      ) as Readonly<
        Record<
          string,
          SimulatedDocumentMetadata | null
        >
      >,
    [
      draft,
      service.requiredDocuments,
    ],
  );

  const internalNotes = useMemo(
    () =>
      parseInternalNotes(
        draft[INTERNAL_NOTES_FIELD],
      ),
    [draft],
  );

  const referral = useMemo(
    () =>
      parseReferral(
        draft[REFERRAL_FIELD],
      ),
    [draft],
  );

  const timelineItems = useMemo(
    () =>
      createTimelineItems(
        state.timelineEvents as readonly unknown[],
        requestId,
      ),
    [
      requestId,
      state.timelineEvents,
    ],
  );

  const reviewStarted = readBoolean(
    draft[REVIEW_STARTED_FIELD],
  );
  const applicationChecked =
    readBoolean(
      draft[
        APPLICATION_CHECKED_FIELD
      ],
    );
  const documentsChecked =
    readBoolean(
      draft[DOCUMENTS_CHECKED_FIELD],
    );
  const identityChecked =
    readBoolean(
      draft[IDENTITY_CHECKED_FIELD],
    );

  const reviewStatus =
    readString(
      draft[REVIEW_STATUS_FIELD],
    ) ?? "SUBMITTED";

  const originatingDepartment =
    departments.find(
      (department) =>
        department.name ===
        ORIGINATING_DEPARTMENT_NAME,
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

    saveReviewValue(
      REVIEW_STARTED_FIELD,
      true,
      at,
    );
    saveReviewValue(
      REVIEW_STARTED_AT_FIELD,
      at,
      at,
    );
    saveReviewValue(
      REVIEW_STATUS_FIELD,
      "IN_REVIEW",
      at,
    );
    saveReviewValue(
      PUBLIC_STATUS_FIELD,
      "IN_REVIEW",
      at,
    );

    addActivity(
      "request_opened_by_officer",
      at,
    );
    addActivity(
      "first_action_taken",
      at,
    );

    setErrorMessage(null);
    setFeedbackMessage(
      "Review started and recorded.",
    );
  }

  function updateChecklist(
    fieldKey: string,
    checked: boolean,
  ) {
    saveReviewValue(
      fieldKey,
      checked,
    );
    setErrorMessage(null);
    setFeedbackMessage(
      "Review and sharing selection updated.",
    );
  }

  function saveInternalNote(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const body = internalNote.trim();

    if (!body) {
      setErrorMessage(
        "Enter an internal note before saving.",
      );
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
    addActivity(
      "internal_note_added",
      at,
    );

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

    const reason =
      correctionReason.trim();
    const instructions =
      correctionInstructions.trim();

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

    saveReviewValue(
      CORRECTION_REASON_FIELD,
      reason,
      at,
    );
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
    saveReviewValue(
      PUBLIC_STATUS_FIELD,
      "ACTION_REQUIRED",
      at,
    );

    addActivity(
      "document_returned",
      at,
    );

    setCorrectionOpen(false);
    setErrorMessage(null);
    setFeedbackMessage(
      "Applicant correction requested. Internal notes were not exposed.",
    );
  }

  function createReferral(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const receivingDepartment =
      departments.find(
        (department) =>
          department.id ===
          referralDepartmentId,
      );

    const checklistComplete =
      applicationChecked &&
      documentsChecked &&
      identityChecked;

    if (!reviewStarted) {
      setErrorMessage(
        "Start the officer review before creating a referral.",
      );
      return;
    }

    if (!checklistComplete) {
      setErrorMessage(
        "Review the application, documents and identity details before creating the referral.",
      );
      return;
    }

    if (
      !receivingDepartment ||
      !officerId ||
      !requestedAction.trim() ||
      !referralReason.trim() ||
      !expectedOutput.trim() ||
      !dueDate
    ) {
      setErrorMessage(
        "Complete the department, officer, reason, message, expected output and due date.",
      );
      return;
    }

    const at = new Date().toISOString();

    const referralRecord: ReferralRecord = {
      id: `HND-DEMO-${Date.now()}`,
      requestId,
      originatingDepartmentId:
        originatingDepartment?.id ??
        "student-records",
      originatingDepartmentName:
        originatingDepartment?.name ??
        ORIGINATING_DEPARTMENT_NAME,
      receivingDepartmentId:
        receivingDepartment.id,
      receivingDepartmentName:
        receivingDepartment.name,
      requestedAction:
        requestedAction.trim(),
      reason:
        `${referralReason.trim()} Urgency: ${urgency}. Assigned officer: ${officerId}.`,
      expectedOutput:
        expectedOutput.trim(),
      dueDate,
      status:
        "PENDING_ACCEPTANCE",
      originatingOfficer:
        OFFICER_NAME,
      createdAt: at,
    };

    saveReviewValue(
      REFERRAL_FIELD,
      JSON.stringify(
        referralRecord,
      ),
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

    addActivity(
      "handoff_created",
      at,
    );

    setErrorMessage(null);
    setFeedbackMessage(
      `${receivingDepartment.name} referral created. Student Records remains the parent-request owner.`,
    );
  }

  const presentation =
    statusPresentation(reviewStatus);

  const responseItems = service.form.sections
    .flatMap((section) =>
      section.fields.map((field) => ({
        id: `${section.id}-${field.key}`,
        label: field.label,
        value: formatFormValue(
          field,
          draft[field.key] ??
            field.defaultValue,
        ),
      })),
    )
    .slice(0, 4);

  const documentItems =
    service.requiredDocuments.map(
      (requirement) => {
        const document =
          selectedDocuments[
            requirement.id
          ];

        return {
          id: requirement.id,
          name: requirement.name,
          requirementLabel:
            requirementLevelLabel(
              requirement,
            ),
          fileSummary: document
            ? `${document.fileName} · ${formatFileSize(
                document.sizeBytes,
              )}`
            : "No document selected",
          available: Boolean(document),
        };
      },
    );

  const applicantName =
    state.applicant.fullName ||
    "Demo applicant";

  const model: OfficerReviewReferralModel = {
    requestId,
    organizationName,
    serviceName: service.name,
    applicant: {
      name: applicantName,
      initials:
        applicantInitials(
          applicantName,
        ) || "DA",
      email:
        state.applicant.email ||
        "applicant@example.com",
      phone:
        state.applicant.phone ||
        "+254 700 000 000",
    },
    submittedLabel:
      "14 May 2026, 10:43 AM",
    categoryLabel:
      "Student service request",
    currentStepLabel:
      presentation.step,
    statusLabel:
      presentation.label,
    statusTone:
      presentation.tone,
    slaLabel:
      service.expectedProcessingTime,
    parentOwnerLabel:
      originatingDepartment?.name ??
      ORIGINATING_DEPARTMENT_NAME,
    responseItems,
    documentItems,
    timelineItems:
      timelineItems.map((item) => ({
        ...item,
        title:
          item.title.replaceAll(
            "_",
            " ",
          ),
        timestampLabel:
          formatTimestamp(
            item.occurredAt,
          ),
      })),
    noteItems:
      internalNotes.map((note) => ({
        ...note,
        timestampLabel:
          formatTimestamp(
            note.createdAt,
          ),
      })),
    availableDocumentCount:
      documentItems.filter(
        (item) => item.available,
      ).length,
    totalDocumentCount:
      documentItems.length,
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-12">
        <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-slate-950">
            Restoring officer workspace…
          </p>
          <p className="mt-2 text-sm text-slate-600">
            FAIDIA is loading the shared browser demonstration state.
          </p>
        </section>
      </main>
    );
  }

  return (
    <OfficerReviewReferralBody
          model={model}
          reviewStarted={
            reviewStarted
          }
          checklist={{
            application:
              applicationChecked,
            documents:
              documentsChecked,
            identity:
              identityChecked,
          }}
          internalNote={internalNote}
          correctionOpen={
            correctionOpen
          }
          correctionReason={
            correctionReason
          }
          correctionInstructions={
            correctionInstructions
          }
          referralDepartmentId={
            referralDepartmentId
          }
          officerId={officerId}
          referralReason={
            referralReason
          }
          urgency={urgency}
          requestedAction={
            requestedAction
          }
          expectedOutput={
            expectedOutput
          }
          dueDate={dueDate}
          shareSelections={
            shareSelections
          }
          departments={departments.filter(
            (department) =>
              department.id !==
              originatingDepartment?.id,
          )}
          officers={
            reference.officers
          }
          reasons={
            reference.reasons
          }
          referralSummary={
            referral
              ? {
                  departmentName:
                    referral.receivingDepartmentName,
                  statusLabel:
                    "Pending acceptance",
                }
              : null
          }
          feedbackMessage={
            feedbackMessage
          }
          errorMessage={errorMessage}
          onStartReview={startReview}
          onInternalNoteChange={
            setInternalNote
          }
          onSaveInternalNote={
            saveInternalNote
          }
          onCorrectionToggle={() =>
            setCorrectionOpen(
              (current) => !current,
            )
          }
          onCorrectionReasonChange={
            setCorrectionReason
          }
          onCorrectionInstructionsChange={
            setCorrectionInstructions
          }
          onRequestCorrection={
            requestCorrection
          }
          onChecklistChange={(
            key,
            checked,
          ) => {
            const fieldByKey = {
              application:
                APPLICATION_CHECKED_FIELD,
              documents:
                DOCUMENTS_CHECKED_FIELD,
              identity:
                IDENTITY_CHECKED_FIELD,
            } as const;

            updateChecklist(
              fieldByKey[key],
              checked,
            );
          }}
          onShareSelectionChange={(
            key,
            checked,
          ) =>
            setShareSelections(
              (current) => ({
                ...current,
                [key]: checked,
              }),
            )
          }
          onReferralDepartmentChange={(
            value,
          ) => {
            setReferralDepartmentId(
              value,
            );

            const department =
              departments.find(
                (candidate) =>
                  candidate.id === value,
              );

            const nextOfficer =
              reference.officers.find(
                (officer) =>
                  officer.departmentName ===
                  department?.name,
              );

            setOfficerId(
              nextOfficer?.id ?? "",
            );
          }}
          onOfficerChange={setOfficerId}
          onReferralReasonChange={
            setReferralReason
          }
          onUrgencyChange={setUrgency}
          onRequestedActionChange={
            setRequestedAction
          }
          onExpectedOutputChange={
            setExpectedOutput
          }
          onDueDateChange={setDueDate}
          onPreview={() => {
            setErrorMessage(null);
            setFeedbackMessage(
              "Share preview prepared. No workflow state was changed.",
            );
          }}
          onCreateReferral={
            createReferral
          }
    />
  );
}
