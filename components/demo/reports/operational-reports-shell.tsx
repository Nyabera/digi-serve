"use client";

import { useRouter } from "next/navigation";
import {
  Maximize2,
  RefreshCw,
} from "lucide-react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { ReportsDashboard } from "@/components/demo/reports";

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

function triggerPresentationShortcut() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "p",
      shiftKey: true,
      bubbles: true,
    }),
  );
}

function triggerResetShortcut() {
  window.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "r",
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

  return (
    <div
      data-d29r7-reports-shell="true"
      data-internal-shell-role="SUPERVISOR"
    >
      <InternalAppShell
        role="SUPERVISOR"
        institutionName={organizationName}
        institutionSubtitle="Student Services"
        institutionInitials="STC"
        staffName="Dr. Miriam Wekesa"
        staffRoleLabel="Registrar Supervisor"
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
                Reports &amp; insights
              </option>
              <option value="/demo/supervisor">
                Registrar oversight
              </option>
              <option value="/demo/department">
                Finance inbox
              </option>
              <option value="/demo/officer">
                Officer dashboard
              </option>
            </select>
          </label>
        }
        roleSelector={
          <label>
            <span className="sr-only">
              Switch workspace
            </span>
            <select
              className="input-base input-compact"
              value="/demo/supervisor"
              onChange={(event) =>
                router.push(event.target.value)
              }
            >
              <option value="/demo/officer">Officer</option>
              <option value="/demo/department">Finance</option>
              <option value="/demo/supervisor">Supervisor</option>
            </select>
          </label>
        }
        presentationAction={
          <button
            type="button"
            onClick={triggerPresentationShortcut}
            className="button-base button-compact button-secondary"
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            onClick={triggerResetShortcut}
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
          departments={departments}
        />
      </InternalAppShell>
    </div>
  );
}
