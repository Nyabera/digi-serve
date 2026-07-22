"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  Inbox,
  Search,
  Send,
  UserRoundCheck,
} from "lucide-react";

import { useDemoState } from "@/features/demo/state";

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type OfficerDashboardProps = {
  readonly organizationName: string;
  readonly services: readonly ServiceOption[];
  readonly departments: readonly DepartmentOption[];
};

type QueueRow = {
  readonly id: string;
  readonly applicantName: string;
  readonly serviceName: string;
  readonly status: string;
  readonly departmentName: string;
  readonly submittedAt: string;
  readonly priority: string;
};

type UnknownRecord = Record<string, unknown>;

const FALLBACK_QUEUE: readonly QueueRow[] = [
  {
    id: "REQ-DEMO-001",
    applicantName: "Grace Wanjiku",
    serviceName: "Transcript Request",
    status: "Submitted",
    departmentName: "Student Records",
    submittedAt: "Today, 10:24",
    priority: "Normal",
  },
  {
    id: "REQ-DEMO-002",
    applicantName: "Brian Otieno",
    serviceName: "Student Clearance",
    status: "Under review",
    departmentName: "Finance",
    submittedAt: "Yesterday, 15:42",
    priority: "Normal",
  },
  {
    id: "REQ-DEMO-003",
    applicantName: "Amina Hassan",
    serviceName: "Certificate Replacement",
    status: "Referred",
    departmentName: "Registrar",
    submittedAt: "Yesterday, 09:18",
    priority: "High",
  },
  {
    id: "REQ-DEMO-004",
    applicantName: "Daniel Kamau",
    serviceName: "Transcript Request",
    status: "Completed",
    departmentName: "Student Records",
    submittedAt: "18 Jul, 14:06",
    priority: "Normal",
  },
];

const STATUS_FILTERS = [
  "All",
  "Submitted",
  "Under review",
  "Referred",
  "Completed",
] as const;

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

function firstArray(
  record: UnknownRecord,
  keys: readonly string[],
): readonly unknown[] {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function formatDateLabel(value: string | null): string {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapRequestToQueueRow(
  value: unknown,
  services: readonly ServiceOption[],
  departments: readonly DepartmentOption[],
  index: number,
): QueueRow {
  const request = asRecord(value);
  const applicant = asRecord(request.applicant);

  const id =
    firstText(request, ["id", "requestId", "reference", "referenceNumber"]) ??
    `REQ-DEMO-${String(index + 1).padStart(3, "0")}`;

  const applicantName =
    firstText(request, ["applicantName", "fullName", "customerName"]) ??
    firstText(applicant, ["fullName", "name"]) ??
    "Demo applicant";

  const serviceKey = firstText(request, [
    "serviceId",
    "serviceSlug",
    "service",
    "serviceName",
  ]);

  const matchedService = services.find(
    (service) =>
      service.id === serviceKey ||
      service.slug === serviceKey ||
      service.name === serviceKey,
  );

  const serviceName =
    firstText(request, ["serviceName"]) ??
    matchedService?.name ??
    "Configured service";

  const departmentKey = firstText(request, [
    "departmentId",
    "currentDepartmentId",
    "department",
    "departmentName",
  ]);

  const matchedDepartment = departments.find(
    (department) =>
      department.id === departmentKey || department.name === departmentKey,
  );

  const departmentName =
    firstText(request, ["departmentName", "currentDepartmentName"]) ??
    matchedDepartment?.name ??
    "Front office";

  const status =
    firstText(request, [
      "publicStatus",
      "internalStatus",
      "status",
      "state",
    ]) ?? "Submitted";

  const submittedAt = formatDateLabel(
    firstText(request, [
      "submittedAt",
      "createdAt",
      "updatedAt",
      "lastActivityAt",
    ]),
  );

  const priority =
    firstText(request, ["priority", "urgency"]) ?? "Normal";

  return {
    id,
    applicantName,
    serviceName,
    status,
    departmentName,
    submittedAt,
    priority,
  };
}

function statusClassName(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes("complete") || normalized.includes("approved")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("refer") || normalized.includes("handoff")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalized.includes("review") || normalized.includes("progress")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function OfficerDashboard({
  organizationName,
  services,
  departments,
}: OfficerDashboardProps) {
  const { state, isHydrated } = useDemoState();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("All");

  const stateRecord = asRecord(state);
  const stateRequests = firstArray(stateRecord, [
    "requests",
    "requestRecords",
    "cases",
  ]);

  const queueRows =
    stateRequests.length > 0
      ? stateRequests.map((request, index) =>
          mapRequestToQueueRow(request, services, departments, index),
        )
      : [...FALLBACK_QUEUE];

  const normalizedQuery = query.trim().toLowerCase();

  const visibleRows = queueRows.filter((row) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        row.id,
        row.applicantName,
        row.serviceName,
        row.departmentName,
        row.status,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesStatus =
      statusFilter === "All" ||
      row.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesQuery && matchesStatus;
  });

  const completedCount = queueRows.filter((row) =>
    row.status.toLowerCase().includes("complete"),
  ).length;

  const referredCount = queueRows.filter((row) =>
    row.status.toLowerCase().includes("refer"),
  ).length;

  const reviewCount = queueRows.filter((row) => {
    const status = row.status.toLowerCase();
    return status.includes("review") || status.includes("submitted");
  }).length;

  const kpis = [
    {
      label: "Open requests",
      value: queueRows.length - completedCount,
      detail: "Requires operational attention",
      icon: Inbox,
    },
    {
      label: "Awaiting review",
      value: reviewCount,
      detail: "New or active front-office work",
      icon: FileSearch,
    },
    {
      label: "Referred",
      value: referredCount,
      detail: "With receiving departments",
      icon: Send,
    },
    {
      label: "Completed",
      value: completedCount,
      detail: "Controlled outcomes issued",
      icon: CheckCircle2,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <header className="border-b border-white/10 bg-[#07090f] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2557ff]">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                FAIDIA officer workspace
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Request operations
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-white/40">
                Institution
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {organizationName}
              </p>
            </div>

            <Link
              href="/demo"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Public portal
              <ArrowRight className="ml-3 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:py-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <article
                key={kpi.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-600">
                      {kpi.label}
                    </p>
                    <p className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                      {isHydrated ? kpi.value : "—"}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {kpi.detail}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Officer queue
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Submitted and active requests
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Open a request to review its applicant information,
                  configured responses, document metadata and activity history.
                </p>
              </div>

              <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">
                    Search the officer queue
                  </span>
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search reference, applicant or service"
                    className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </label>

                <div className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
                  <Filter
                    className="h-4 w-4 text-slate-500"
                    aria-hidden="true"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as (typeof STATUS_FILTERS)[number],
                      )
                    }
                    className="min-h-10 bg-transparent pr-3 text-sm font-bold text-slate-700 outline-none"
                    aria-label="Filter officer queue by status"
                  >
                    {STATUS_FILTERS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-[140px_minmax(180px,1fr)_minmax(180px,1fr)_160px_150px_100px] gap-4 border-b border-slate-200 bg-slate-50 px-7 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 lg:grid">
            <span>Reference</span>
            <span>Applicant</span>
            <span>Service</span>
            <span>Status</span>
            <span>Department</span>
            <span className="text-right">Action</span>
          </div>

          <div className="divide-y divide-slate-200">
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <article
                  key={row.id}
                  className="grid gap-4 px-5 py-6 transition hover:bg-slate-50 sm:px-7 lg:grid-cols-[140px_minmax(180px,1fr)_minmax(180px,1fr)_160px_150px_100px] lg:items-center"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                      Reference
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-950">
                      {row.id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {row.submittedAt}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                      Applicant
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <UserRoundCheck
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          {row.applicantName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Priority: {row.priority}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                      Service
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {row.serviceName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                      Status
                    </p>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClassName(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">
                      Department
                    </p>
                    <p className="text-sm text-slate-700">
                      {row.departmentName}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <Link
                      href={`/demo/officer/requests/${row.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      Review
                      <ArrowRight
                        className="ml-2 h-4 w-4"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <Clock3
                  className="mx-auto h-8 w-8 text-slate-400"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  No matching requests
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Change the search text or queue filter.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Queue rule
            </p>
            <h3 className="mt-3 text-lg font-bold text-slate-950">
              Submitted requests enter front-office review
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The officer reviews completeness and determines the correct
              processing path before any departmental handoff.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Decision boundary
            </p>
            <h3 className="mt-3 text-lg font-bold text-slate-950">
              D20 does not approve or reject requests
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Review actions, clarification and referral are implemented in
              the next stage.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Demonstration state
            </p>
            <h3 className="mt-3 text-lg font-bold text-slate-950">
              Synthetic queue data only
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The workspace reads the shared browser demo state and never
              queries or modifies production records.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
