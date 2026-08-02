import type {
  DemoPack,
} from "../../config/demo-pack.types";

type UnknownRecord = Readonly<
  Record<string, unknown>
>;

export type DashboardPackService = {
  readonly id: string;
  readonly name: string;
  readonly category: string;
};

export type DashboardPackDepartment = {
  readonly id: string;
  readonly name: string;
};

export type DashboardPackUser = {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly departmentId?: string;
};

export type DashboardPackRequest = {
  readonly id: string;
  readonly requestId: string;
  readonly serviceId?: string;
  readonly requesterId?: string;
  readonly assignedOfficerId?: string;
  readonly assignedDepartmentId?: string;
  readonly status: string;
  readonly currentStepId?: string;
  readonly submittedAt?: string;
  readonly dueAt?: string;
  readonly data: UnknownRecord;
};

export type DashboardPackWorkflow = {
  readonly id: string;
  readonly name: string;
  readonly serviceId?: string;
  readonly steps: readonly UnknownRecord[];
};

export type DashboardPackDocument = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly status: string;
  readonly issuedAt?: string;
};

export type DashboardPackSnapshot = {
  readonly institutionName: string;
  readonly services: readonly DashboardPackService[];
  readonly departments:
    readonly DashboardPackDepartment[];
  readonly users: readonly DashboardPackUser[];
  readonly requests:
    readonly DashboardPackRequest[];
  readonly workflows:
    readonly DashboardPackWorkflow[];
  readonly documents:
    readonly DashboardPackDocument[];
  readonly raw: UnknownRecord;
};

function toRecord(
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

function readArray(
  source: UnknownRecord,
  keys: readonly string[],
): readonly unknown[] {
  for (const key of keys) {
    const value = source[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function readString(
  source: UnknownRecord,
  keys: readonly string[],
  fallback = "",
): string {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value.trim();
    }

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return String(value);
    }
  }

  return fallback;
}

function readOptionalString(
  source: UnknownRecord,
  keys: readonly string[],
): string | undefined {
  const value = readString(
    source,
    keys,
    "",
  );

  return value || undefined;
}

function normalizeId(
  source: UnknownRecord,
  fallback: string,
): string {
  return readString(
    source,
    [
      "id",
      "key",
      "slug",
      "code",
      "requestId",
    ],
    fallback,
  );
}

function normalizeService(
  value: unknown,
  index: number,
): DashboardPackService {
  const source = toRecord(value);

  return {
    id: normalizeId(
      source,
      `service-${index + 1}`,
    ),
    name: readString(
      source,
      [
        "name",
        "title",
        "label",
        "serviceName",
      ],
      `Service ${index + 1}`,
    ),
    category: readString(
      source,
      [
        "category",
        "group",
        "department",
      ],
      "General",
    ),
  };
}

function normalizeDepartment(
  value: unknown,
  index: number,
): DashboardPackDepartment {
  const source = toRecord(value);

  return {
    id: normalizeId(
      source,
      `department-${index + 1}`,
    ),
    name: readString(
      source,
      [
        "name",
        "title",
        "label",
        "departmentName",
      ],
      `Department ${index + 1}`,
    ),
  };
}

function normalizeUser(
  value: unknown,
  index: number,
): DashboardPackUser {
  const source = toRecord(value);

  const firstName = readString(
    source,
    ["firstName"],
    "",
  );
  const lastName = readString(
    source,
    ["lastName"],
    "",
  );
  const composedName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    id: normalizeId(
      source,
      `user-${index + 1}`,
    ),
    name:
      readString(
        source,
        [
          "displayName",
          "name",
          "fullName",
          "staffName",
        ],
        composedName,
      ) || `User ${index + 1}`,
    role: readString(
      source,
      [
        "role",
        "roleLabel",
        "type",
      ],
      "user",
    ).toLowerCase(),
    departmentId: readOptionalString(
      source,
      [
        "departmentId",
        "assignedDepartmentId",
        "department",
      ],
    ),
  };
}

function normalizeRequest(
  value: unknown,
  index: number,
): DashboardPackRequest {
  const source = toRecord(value);
  const id = normalizeId(
    source,
    `request-${index + 1}`,
  );

  return {
    id,
    requestId: readString(
      source,
      [
        "requestId",
        "reference",
        "referenceNumber",
        "code",
      ],
      id,
    ),
    serviceId: readOptionalString(
      source,
      [
        "serviceId",
        "service",
        "serviceSlug",
      ],
    ),
    requesterId: readOptionalString(
      source,
      [
        "requesterId",
        "applicantId",
        "userId",
      ],
    ),
    assignedOfficerId: readOptionalString(
      source,
      [
        "assignedOfficerId",
        "officerId",
        "assigneeId",
      ],
    ),
    assignedDepartmentId:
      readOptionalString(
        source,
        [
          "assignedDepartmentId",
          "departmentId",
        ],
      ),
    status: readString(
      source,
      [
        "status",
        "state",
      ],
      "open",
    ).toLowerCase(),
    currentStepId: readOptionalString(
      source,
      [
        "currentStepId",
        "stageId",
        "currentStage",
      ],
    ),
    submittedAt: readOptionalString(
      source,
      [
        "submittedAt",
        "createdAt",
        "dateSubmitted",
      ],
    ),
    dueAt: readOptionalString(
      source,
      [
        "dueAt",
        "dueDate",
        "slaDueAt",
      ],
    ),
    data: toRecord(source.data),
  };
}

function normalizeWorkflow(
  value: unknown,
  index: number,
): DashboardPackWorkflow {
  const source = toRecord(value);

  return {
    id: normalizeId(
      source,
      `workflow-${index + 1}`,
    ),
    name: readString(
      source,
      [
        "name",
        "title",
        "label",
      ],
      `Workflow ${index + 1}`,
    ),
    serviceId: readOptionalString(
      source,
      [
        "serviceId",
        "service",
      ],
    ),
    steps: readArray(
      source,
      [
        "steps",
        "nodes",
        "stages",
      ],
    ).map(toRecord),
  };
}

function normalizeDocument(
  value: unknown,
  index: number,
): DashboardPackDocument {
  const source = toRecord(value);

  return {
    id: normalizeId(
      source,
      `document-${index + 1}`,
    ),
    name: readString(
      source,
      [
        "name",
        "title",
        "fileName",
        "documentName",
      ],
      `Document ${index + 1}`,
    ),
    type: readString(
      source,
      [
        "type",
        "documentType",
        "category",
      ],
      "Document",
    ),
    status: readString(
      source,
      [
        "status",
        "verificationStatus",
      ],
      "uploaded",
    ).toLowerCase(),
    issuedAt: readOptionalString(
      source,
      [
        "issuedAt",
        "createdAt",
        "awardDate",
      ],
    ),
  };
}

function readInstitutionName(
  source: UnknownRecord,
): string {
  const direct = readString(
    source,
    [
      "institutionName",
      "organizationName",
      "tenantName",
      "name",
    ],
    "",
  );

  if (direct) {
    return direct;
  }

  const organization = toRecord(
    source.organization,
  );
  const institution = toRecord(
    source.institution,
  );

  return (
    readString(
      organization,
      ["name", "title"],
      "",
    ) ||
    readString(
      institution,
      ["name", "title"],
      "",
    ) ||
    "Demo Institution"
  );
}

export function createDashboardPackSnapshot(
  pack: DemoPack,
): DashboardPackSnapshot {
  const raw = toRecord(
    pack as unknown,
  );

  return {
    institutionName:
      readInstitutionName(raw),
    services: readArray(
      raw,
      [
        "services",
        "serviceCatalog",
      ],
    ).map(normalizeService),
    departments: readArray(
      raw,
      [
        "departments",
        "teams",
      ],
    ).map(normalizeDepartment),
    users: readArray(
      raw,
      [
        "users",
        "staff",
        "people",
      ],
    ).map(normalizeUser),
    requests: readArray(
      raw,
      [
        "requests",
        "cases",
        "applications",
      ],
    ).map(normalizeRequest),
    workflows: readArray(
      raw,
      [
        "workflows",
        "workflowTemplates",
      ],
    ).map(normalizeWorkflow),
    documents: readArray(
      raw,
      [
        "documents",
        "documentRecords",
      ],
    ).map(normalizeDocument),
    raw,
  };
}
