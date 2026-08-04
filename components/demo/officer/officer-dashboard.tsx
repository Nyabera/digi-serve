"use client";

import { useRouter } from "next/navigation";
import {
  Maximize2,
  RefreshCw,
} from "lucide-react";

import {
  InternalAppShell,
} from "@/components/demo/internal-shell";
import { getDemoOfficerDashboardModel } from "@/features/demo-engine/adapters/get-demo-officer-dashboard-model";
import { OfficerDashboardBody } from "@/features/officer-dashboard/components/officer-dashboard-body";

import styles from "./officer-dashboard.module.css";

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

export function OfficerDashboard({
  organizationName,
}: OfficerDashboardProps) {
  const router = useRouter();
  const model =
    getDemoOfficerDashboardModel();

  return (
    <div
      data-d29r3-officer-shell="true"
      data-internal-shell-role="OFFICER"
    >
      <InternalAppShell
        role="OFFICER"
        institutionName={organizationName}
        institutionSubtitle="Student Services"
        institutionInitials="STC"
        staffName="Grace Wanjiku"
        staffRoleLabel="Student Records Officer"
        requestSelector={
          <label>
            <span className="sr-only">
              Open request
            </span>
            <select
              className={[
                "input-base",
                "input-compact",
                styles.topbarSelect,
              ].join(" ")}
              value=""
              onChange={(event) => {
                const href = event.target.value;

                if (href) {
                  router.push(href);
                }
              }}
            >
              <option value="">
                Open request
              </option>
              {model.queue.rows.map((row) => (
                <option
                  key={row.requestId}
                  value={row.requestHref}
                >
                  {row.requestId}
                </option>
              ))}
            </select>
          </label>
        }
        roleSelector={
          <label>
            <span className="sr-only">
              Switch workspace
            </span>
            <select
              className={[
                "input-base",
                "input-compact",
                styles.topbarSelect,
              ].join(" ")}
              value="/demo/officer"
              onChange={(event) =>
                router.push(event.target.value)
              }
            >
              <option value="/demo/officer">
                Officer
              </option>
              <option value="/demo/department">
                Finance
              </option>
              <option value="/demo/supervisor">
                Supervisor
              </option>
            </select>
          </label>
        }
        presentationAction={
          <button
            type="button"
            onClick={triggerPresentationShortcut}
            className={[
              "button-base",
              "button-compact",
              "button-secondary",
              styles.topbarAction,
            ].join(" ")}
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            onClick={triggerResetShortcut}
            className={[
              "button-base",
              "button-compact",
              "button-destructive",
              styles.topbarAction,
            ].join(" ")}
          >
            <RefreshCw aria-hidden="true" />
            Reset
          </button>
        }
      >
        <OfficerDashboardBody
          model={model}
        />
      </InternalAppShell>
    </div>
  );
}
