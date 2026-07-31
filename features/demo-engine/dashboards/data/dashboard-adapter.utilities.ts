import type {
  DashboardSemanticTone,
} from "./dashboard-data.shared";
import type {
  DashboardPackDepartment,
  DashboardPackRequest,
  DashboardPackService,
  DashboardPackSnapshot,
  DashboardPackUser,
} from "./demo-pack-dashboard.snapshot";

export function clampPercentage(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

export function percentage(
  part: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return clampPercentage(
    (part / total) * 100,
  );
}

export function formatCompactNumber(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-GB",
    {
      notation:
        value >= 1000
          ? "compact"
          : "standard",
      maximumFractionDigits: 1,
    },
  ).format(value);
}

export function formatDateLabel(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Nairobi",
    },
  ).format(date);
}

export function formatTimestampLabel(
  value: string | undefined,
  fallback: string,
): string {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",
    },
  ).format(date);
}

export function serviceById(
  snapshot: DashboardPackSnapshot,
  serviceId: string | undefined,
): DashboardPackService | undefined {
  return snapshot.services.find(
    (service) => service.id === serviceId,
  );
}

export function departmentById(
  snapshot: DashboardPackSnapshot,
  departmentId: string | undefined,
): DashboardPackDepartment | undefined {
  return snapshot.departments.find(
    (department) =>
      department.id === departmentId,
  );
}

export function userById(
  snapshot: DashboardPackSnapshot,
  userId: string | undefined,
): DashboardPackUser | undefined {
  return snapshot.users.find(
    (user) => user.id === userId,
  );
}

export function selectUser(
  snapshot: DashboardPackSnapshot,
  roleNeedle: string,
  preferredId?: string,
): DashboardPackUser | undefined {
  if (preferredId) {
    const exact = userById(
      snapshot,
      preferredId,
    );

    if (exact) {
      return exact;
    }
  }

  return snapshot.users.find(
    (user) =>
      user.role.includes(roleNeedle),
  );
}

export function statusTone(
  status: string,
): DashboardSemanticTone {
  const normalized =
    status.toLowerCase();

  if (
    normalized.includes("complete") ||
    normalized.includes("approved") ||
    normalized.includes("issued") ||
    normalized.includes("verified") ||
    normalized.includes("valid")
  ) {
    return "success";
  }

  if (
    normalized.includes("overdue") ||
    normalized.includes("reject") ||
    normalized.includes("fail") ||
    normalized.includes("revoked")
  ) {
    return "danger";
  }

  if (
    normalized.includes("pending") ||
    normalized.includes("due") ||
    normalized.includes("review")
  ) {
    return "warning";
  }

  if (
    normalized.includes("wait") ||
    normalized.includes("hold")
  ) {
    return "purple";
  }

  if (
    normalized.includes("assign") ||
    normalized.includes("progress") ||
    normalized.includes("open")
  ) {
    return "primary";
  }

  return "neutral";
}

export function dueState(
  dueAt: string | undefined,
  nowIso: string,
): {
  readonly label: string;
  readonly progress: number;
  readonly tone: DashboardSemanticTone;
} {
  if (!dueAt) {
    return {
      label: "No due date",
      progress: 30,
      tone: "neutral",
    };
  }

  const due = new Date(dueAt);
  const now = new Date(nowIso);

  if (
    Number.isNaN(due.getTime()) ||
    Number.isNaN(now.getTime())
  ) {
    return {
      label: "Due date set",
      progress: 45,
      tone: "neutral",
    };
  }

  const hours =
    (due.getTime() - now.getTime()) /
    3_600_000;

  if (hours < 0) {
    const days = Math.max(
      1,
      Math.ceil(Math.abs(hours) / 24),
    );

    return {
      label: `Overdue ${days}d`,
      progress: 92,
      tone: "danger",
    };
  }

  if (hours <= 24) {
    return {
      label: "Due today",
      progress: 78,
      tone: "warning",
    };
  }

  const days = Math.ceil(hours / 24);

  return {
    label: `Due in ${days}d`,
    progress: Math.max(
      35,
      75 - days * 5,
    ),
    tone:
      days <= 2
        ? "warning"
        : "purple",
  };
}

export function requestApplicantName(
  snapshot: DashboardPackSnapshot,
  request: DashboardPackRequest,
): string {
  const requester = userById(
    snapshot,
    request.requesterId,
  );

  if (requester) {
    return requester.name;
  }

  const data = request.data;

  for (const key of [
    "applicantName",
    "studentName",
    "fullName",
    "name",
  ]) {
    const value = data[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "Demo Applicant";
}

export function serviceNameForRequest(
  snapshot: DashboardPackSnapshot,
  request: DashboardPackRequest,
): string {
  return (
    serviceById(
      snapshot,
      request.serviceId,
    )?.name ??
    "Service Request"
  );
}

export function stageLabel(
  request: DashboardPackRequest,
): string {
  return (
    request.currentStepId
      ?.replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (value) =>
        value.toUpperCase(),
      ) ??
    "Officer Review"
  );
}

export function stableSlice<T>(
  values: readonly T[],
  count: number,
): readonly T[] {
  return values.slice(
    0,
    Math.max(0, count),
  );
}
