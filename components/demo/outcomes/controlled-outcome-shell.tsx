"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Maximize2,
  RefreshCw,
} from "lucide-react";

import { InternalAppShell } from "@/components/demo/internal-shell";
import { ControlledOutcomeWorkspace } from "@/components/demo/outcomes/controlled-outcome-workspace";
import { InternalSecondaryPageFrame } from "@/components/demo/shell-pages/internal-secondary-page-frame";
import type { DemoServiceConfig } from "@/types/demo/client-config";

type ControlledOutcomeShellProps = {
  readonly requestId: string;
  readonly organizationName: string;
  readonly service: DemoServiceConfig;
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

export function ControlledOutcomeShell({
  requestId,
  organizationName,
  service,
}: ControlledOutcomeShellProps) {
  const router = useRouter();

  return (
    <div
      data-d29r7-outcome-shell="true"
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
              Open request stage
            </span>
            <select
              className="input-base input-compact"
              value={`/demo/outcomes/${requestId}`}
              onChange={(event) =>
                router.push(event.target.value)
              }
            >
              <option
                value={`/demo/outcomes/${requestId}`}
              >
                {requestId} — Outcome
              </option>
              <option
                value={`/demo/supervisor/approvals/${requestId}`}
              >
                {requestId} — Approval
              </option>
              <option
                value={`/demo/track/${requestId}`}
              >
                {requestId} — Applicant tracking
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
        <InternalSecondaryPageFrame
          eyebrow="Registrar issuance"
          title="Controlled outcome"
          subtitle={`Issue, deliver and audit the exact controlled result for ${requestId}.`}
          actions={
            <>
              <Link
                href={`/demo/supervisor/approvals/${requestId}`}
                className="button-base button-compact button-secondary"
              >
                <ArrowLeft aria-hidden="true" />
                Registrar decision
              </Link>

              <Link
                href={`/demo/track/${requestId}`}
                className="button-base button-compact button-primary"
              >
                Applicant tracking
              </Link>
            </>
          }
        >
          <ControlledOutcomeWorkspace
            requestId={requestId}
            organizationName={organizationName}
            service={service}
          />
        </InternalSecondaryPageFrame>
      </InternalAppShell>
    </div>
  );
}
