"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Maximize2,
  RefreshCw,
} from "lucide-react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { ReportsDashboard } from "@/components/demo/reports";
import {
  getDemoRoleHome,
  useDemoWorkspaceRole,
} from "@/features/demo/roles";

type ServiceOption = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
};

type DepartmentOption = {
  readonly id: string;
  readonly name: string;
};

type OperationalReportsShellProps = {
  readonly organizationName: string;
  readonly services: readonly ServiceOption[];
  readonly departments: readonly DepartmentOption[];
};

function triggerShortcut(key: "p" | "r") {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      shiftKey: true,
      bubbles: true,
    }),
  );
}

export function OperationalReportsShell({
  organizationName,
  services,
  departments,
}: OperationalReportsShellProps) {
  const router = useRouter();
  const { role, isHydrated } =
    useDemoWorkspaceRole();

  const canViewReports =
    role === "SUPERVISOR" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (!isHydrated || canViewReports) return;
    router.replace(getDemoRoleHome(role));
  }, [canViewReports, isHydrated, role, router]);

  const supervisorDepartments = useMemo(() => {
    const studentRecords = departments.filter(
      (department) =>
        department.name
          .toLowerCase()
          .includes("student record"),
    );

    return studentRecords.length > 0
      ? studentRecords
      : departments.slice(0, 1);
  }, [departments]);

  if (!isHydrated || !canViewReports) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-12">
        <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-slate-950">
            Opening the correct role workspace…
          </p>
        </section>
      </main>
    );
  }

  const visibleDepartments = isAdmin
    ? departments
    : supervisorDepartments;
  const departmentName =
    visibleDepartments[0]?.name ??
    "Student Records";
  const shellRole = isAdmin
    ? "ADMIN"
    : "SUPERVISOR";

  return (
    <div
      data-d29r18-role-aware-reports="true"
      data-report-scope={
        isAdmin ? "INSTITUTION" : "DEPARTMENT"
      }
    >
      <InternalAppShell
        role={shellRole}
        institutionName={organizationName}
        institutionSubtitle={
          isAdmin
            ? "Institution Administration"
            : "Student Services"
        }
        institutionInitials="STC"
        staffName={
          isAdmin
            ? "Amina Otieno"
            : "Dr. Miriam Wekesa"
        }
        staffRoleLabel={
          isAdmin
            ? "Institution Administrator"
            : "Registrar Supervisor"
        }
        requestSelector={
          <label>
            <span className="sr-only">
              Open operations page
            </span>
            <select
              className="input-base input-compact"
              value="/demo/reports"
              onChange={(event) =>
                router.push(event.target.value)
              }
            >
              <option value="/demo/reports">
                {isAdmin
                  ? "Institution reports"
                  : "Department reports"}
              </option>
              <option value="/demo/supervisor">
                Registrar oversight
              </option>
              <option value="/demo/department">
                Workflow inbox
              </option>
              <option value="/demo/officer">
                Officer dashboard
              </option>
            </select>
          </label>
        }
        presentationAction={
          <button
            type="button"
            onClick={() => triggerShortcut("p")}
            className="button-base button-compact button-secondary"
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            onClick={() => triggerShortcut("r")}
            className="button-base button-compact button-destructive"
          >
            <RefreshCw aria-hidden="true" />
            Reset
          </button>
        }
      >
        <ReportsDashboard
          organizationName={organizationName}
          services={services}
          departments={visibleDepartments}
          viewerRole={isAdmin ? "ADMIN" : "SUPERVISOR"}
          scopeLabel={
            isAdmin
              ? organizationName
              : departmentName
          }
          lockedDepartment={
            isAdmin
              ? null
              : visibleDepartments[0]?.id ??
                visibleDepartments[0]?.name ??
                "student-records"
          }
        />
      </InternalAppShell>
    </div>
  );
}
