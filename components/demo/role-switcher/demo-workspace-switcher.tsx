"use client";

import {
  useDemoWorkspaceRole,
  type DemoWorkspaceRole,
} from "@/features/demo/roles";

const ROLES: readonly {
  readonly label: string;
  readonly value: DemoWorkspaceRole;
}[] = [
  { label: "Applicant", value: "APPLICANT" },
  { label: "Officer", value: "OFFICER" },
  { label: "Supervisor", value: "SUPERVISOR" },
  { label: "Admin", value: "ADMIN" },
];

export function DemoWorkspaceSwitcher({
  className = "input-base input-compact",
}: {
  readonly className?: string;
}) {
  const { role, switchRole } = useDemoWorkspaceRole();

  return (
    <label data-demo-workspace-switcher="true">
      <span className="sr-only">Switch demo workspace</span>
      <select
        aria-label="Switch Applicant, Officer, Supervisor or Admin workspace"
        className={className}
        value={role}
        onChange={(event) =>
          switchRole(
            event.target.value as DemoWorkspaceRole,
          )
        }
      >
        {ROLES.map((roleOption) => (
          <option
            key={roleOption.value}
            value={roleOption.value}
          >
            {roleOption.label}
          </option>
        ))}
      </select>
    </label>
  );
}
