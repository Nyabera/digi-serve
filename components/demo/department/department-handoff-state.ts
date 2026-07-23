import type {
  DepartmentHandoffResult,
  DepartmentHandoffRowModel,
  DepartmentHandoffStatus,
  DepartmentHandoffStatusTone,
} from "@/features/department-handoffs/model/department-handoff-model";
import type { DemoFormValue } from "@/types/demo/demo-state";

export const OFFICER_REFERRAL_FIELD = "__officerReview:referral";

export function handoffFieldKey(handoffId: string, key: string): string {
  return `__departmentHandoff:${handoffId}:${key}`;
}

type ReferralRecord = {
  readonly id: string;
  readonly requestId: string;
  readonly originatingDepartmentName: string;
  readonly receivingDepartmentName: string;
  readonly requestedAction: string;
  readonly reason: string;
  readonly expectedOutput: string;
  readonly dueDate: string;
  readonly status:
    | "PENDING_ACCEPTANCE"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "RETURNED_FOR_CLARIFICATION"
    | "DECLINED"
    | "COMPLETED";
  readonly originatingOfficer: string;
  readonly createdAt: string;
  readonly result?: DepartmentHandoffResult;
  readonly resultNote?: string;
  readonly completedAt?: string;
};

export type HandoffContext = {
  readonly serviceSlug: string;
  readonly row: DepartmentHandoffRowModel;
  readonly result?: DepartmentHandoffResult;
  readonly resultNote?: string;
  readonly completedAt?: string;
};

function asText(value: DemoFormValue | undefined): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function parseReferral(value: DemoFormValue | undefined): ReferralRecord | null {
  const text = asText(value);
  if (!text) return null;

  try {
    const parsed = JSON.parse(text) as Partial<ReferralRecord>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.requestId !== "string" ||
      typeof parsed.receivingDepartmentName !== "string" ||
      typeof parsed.requestedAction !== "string" ||
      typeof parsed.expectedOutput !== "string"
    ) {
      return null;
    }
    return parsed as ReferralRecord;
  } catch {
    return null;
  }
}

function statusTone(status: DepartmentHandoffStatus): DepartmentHandoffStatusTone {
  switch (status) {
    case "PENDING_ACCEPTANCE": return "orange";
    case "IN_PROGRESS": return "green";
    case "RETURNED_FOR_CLARIFICATION": return "purple";
    case "DECLINED": return "red";
    case "COMPLETED": return "blue";
  }
}

function statusLabel(status: DepartmentHandoffStatus): string {
  switch (status) {
    case "PENDING_ACCEPTANCE": return "Pending acceptance";
    case "IN_PROGRESS": return "In progress";
    case "RETURNED_FOR_CLARIFICATION": return "Returned";
    case "DECLINED": return "Declined";
    case "COMPLETED": return "Completed";
  }
}


function normalizeReferralStatus(
  status: ReferralRecord["status"],
): DepartmentHandoffStatus {
  return status === "ACCEPTED" ? "IN_PROGRESS" : status;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function buildDepartmentHandoffContexts({
  formDrafts,
  fixtureRows,
  serviceSlugs,
  applicantName,
}: {
  readonly formDrafts: Readonly<Record<string, Readonly<Record<string, DemoFormValue>>>>;
  readonly fixtureRows: readonly DepartmentHandoffRowModel[];
  readonly serviceSlugs: readonly string[];
  readonly applicantName: string;
}): readonly HandoffContext[] {
  const defaultServiceSlug = serviceSlugs[0] ?? "transcript-request";

  const fixtureContexts = fixtureRows.map((row) => {
    const draft = formDrafts[defaultServiceSlug] ?? {};
    const status =
      (asText(draft[handoffFieldKey(row.id, "status")]) as DepartmentHandoffStatus | null) ?? row.status;

    return {
      serviceSlug: defaultServiceSlug,
      row: { ...row, status, statusLabel: statusLabel(status), statusTone: statusTone(status) },
      result: (asText(draft[handoffFieldKey(row.id, "result")]) as DepartmentHandoffResult | null) ?? undefined,
      resultNote: asText(draft[handoffFieldKey(row.id, "resultNote")]) ?? undefined,
      completedAt: asText(draft[handoffFieldKey(row.id, "completedAt")]) ?? undefined,
    };
  });

  const dynamicContexts = Object.entries(formDrafts)
    .map<HandoffContext | null>(([serviceSlug, draft]) => {
      const referral = parseReferral(draft[OFFICER_REFERRAL_FIELD]);
      if (!referral) return null;

      const status =
        (asText(draft[handoffFieldKey(referral.id, "status")]) as DepartmentHandoffStatus | null) ??
        normalizeReferralStatus(referral.status);

      const row: DepartmentHandoffRowModel = {
        id: referral.id,
        requestId: referral.requestId,
        requestTitle: "Transcript Request",
        applicantName: applicantName || "Demo applicant",
        fromDepartment: referral.originatingDepartmentName || "Student Records",
        fromOfficer: referral.originatingOfficer || "Grace Wanjiku",
        requestedAction: referral.requestedAction,
        reason: referral.reason,
        expectedOutput: referral.expectedOutput,
        receivedLabel: formatDate(referral.createdAt),
        dueDateLabel: referral.dueDate,
        dueStateLabel: "Due soon",
        assignedOfficer: "Amina Hassan",
        assignedOfficerInitials: "AH",
        status,
        statusLabel: statusLabel(status),
        statusTone: statusTone(status),
        href: `/demo/department/handoffs/${referral.id}`,
        documents: [{ id: `${referral.id}-notes`, name: "Transcript Request Notes.pdf", summary: "Shared request document" }],
        timeline: [{
          id: `${referral.id}-created`,
          title: "Referral created",
          detail: `${referral.originatingDepartmentName} created the Finance handoff.`,
          occurredAt: referral.createdAt,
          timestampLabel: formatDate(referral.createdAt),
          tone: "blue",
        }],
      };

      return {
        serviceSlug,
        row,
        result:
          (asText(draft[handoffFieldKey(referral.id, "result")]) as DepartmentHandoffResult | null) ??
          referral.result ??
          undefined,
        resultNote:
          asText(draft[handoffFieldKey(referral.id, "resultNote")]) ??
          referral.resultNote ??
          undefined,
        completedAt:
          asText(draft[handoffFieldKey(referral.id, "completedAt")]) ??
          referral.completedAt ??
          undefined,
      };
    })
    .filter((context): context is HandoffContext => context !== null);

  const dynamicIds = new Set(dynamicContexts.map((context) => context.row.id));
  return [...dynamicContexts, ...fixtureContexts.filter((context) => !dynamicIds.has(context.row.id))];
}

export function findDepartmentHandoffContext(
  contexts: readonly HandoffContext[],
  handoffId: string,
): HandoffContext {
  const match = contexts.find((context) => context.row.id === handoffId) ?? contexts[0];
  if (match) return match;

  return {
    serviceSlug: "transcript-request",
    row: {
      id: handoffId,
      requestId: "REQ-DEMO-001",
      requestTitle: "Transcript Request",
      applicantName: "Demo applicant",
      fromDepartment: "Student Records",
      fromOfficer: "Grace Wanjiku",
      requestedAction: "Complete the requested Finance verification.",
      reason: "The parent request requires a Finance result.",
      expectedOutput: "Return CLEAR, HOLD or CANNOT_VERIFY.",
      receivedLabel: "Not recorded",
      dueDateLabel: "Not recorded",
      dueStateLabel: "Not recorded",
      assignedOfficer: "Amina Hassan",
      assignedOfficerInitials: "AH",
      status: "PENDING_ACCEPTANCE",
      statusLabel: "Pending acceptance",
      statusTone: "orange",
      href: `/demo/department/handoffs/${handoffId}`,
      documents: [],
      timeline: [],
    },
  };
}
