"use client";

import { useRouter } from "next/navigation";
import {
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { useMemo } from "react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { getDemoSupervisorApprovalsReference } from "@/features/demo-engine/adapters/get-demo-supervisor-approvals-reference";
import { useDemoState } from "@/features/demo/state";
import { SupervisorDashboardBody } from "@/features/supervisor-approvals/components/supervisor-dashboard-body";
import type {
  SupervisorDecision,
} from "@/features/supervisor-approvals/model/supervisor-approval-model";
import type {
  DemoServiceConfig,
} from "@/types/demo/client-config";
import type {
  DemoFormValue,
} from "@/types/demo/demo-state";

type SupervisorDashboardWorkspaceProps = {
  readonly organizationName: string;
  readonly service: DemoServiceConfig;
};

const DECISION_RECORD_FIELD =
  "__supervisorDecision:record";

function readDecision(
  value: DemoFormValue | undefined,
): SupervisorDecision | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      value,
    ) as {
      readonly decision?: unknown;
    };

    return [
      "APPROVED",
      "REJECTED",
      "RETURNED_FOR_CLARIFICATION",
    ].includes(String(parsed.decision))
      ? (parsed.decision as SupervisorDecision)
      : null;
  } catch {
    return null;
  }
}

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

export function SupervisorDashboardWorkspace({
  organizationName,
  service,
}: SupervisorDashboardWorkspaceProps) {
  const router = useRouter();
  const {
    state,
    isHydrated,
  } = useDemoState();
  const reference =
    getDemoSupervisorApprovalsReference();

  const decision = useMemo(
    () =>
      readDecision(
        state.formDrafts[service.slug]?.[
          DECISION_RECORD_FIELD
        ],
      ),
    [service.slug, state.formDrafts],
  );

  const model = useMemo(
    () => ({
      ...reference,
      metrics: reference.metrics.map(
        (metric) => {
          if (metric.id === "approval") {
            return {
              ...metric,
              value: decision ? 5 : 6,
            };
          }

          return metric;
        },
      ),
      approvals: reference.approvals.map(
        (approval) => {
          if (
            approval.requestId !==
              "REQ-DEMO-001" ||
            !decision
          ) {
            return approval;
          }

          return {
            ...approval,
            statusLabel:
              decision === "APPROVED"
                ? "Approved"
                : decision === "REJECTED"
                  ? "Rejected"
                  : "Returned",
            statusTone:
              decision === "APPROVED"
                ? "green"
                : decision === "REJECTED"
                  ? "red"
                  : "purple",
          } as const;
        },
      ),
    }),
    [decision, reference],
  );

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-12">
        <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold text-slate-950">
            Restoring supervisor workspace…
          </p>
        </section>
      </main>
    );
  }

  return (
    <div
      data-d29r3-officer-shell="true"
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
              Open approval
            </span>
            <select
              className="input-base input-compact"
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  router.push(
                    event.target.value,
                  );
                }
              }}
            >
              <option value="">
                Open approval
              </option>
              {reference.approvals.map(
                (approval) => (
                  <option
                    key={approval.requestId}
                    value={approval.href}
                  >
                    {approval.requestId}
                  </option>
                ),
              )}
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
                router.push(
                  event.target.value,
                )
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
            onClick={
              triggerPresentationShortcut
            }
            className="button-base button-compact button-secondary"
          >
            <Maximize2 aria-hidden="true" />
            Present
          </button>
        }
        resetAction={
          <button
            type="button"
            onClick={
              triggerResetShortcut
            }
            className="button-base button-compact button-destructive"
          >
            <RefreshCw aria-hidden="true" />
            Reset
          </button>
        }
      >
        <SupervisorDashboardBody
          model={model}
        />
      </InternalAppShell>
    </div>
  );
}
