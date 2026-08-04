"use client";

import type { ReactNode } from "react";

import { InternalAppShell } from "./internal-app-shell";

export type WorkspaceRole = "officer" | "supervisor" | "admin";

type InternalRole = Parameters<typeof InternalAppShell>[0]["role"];

type RoleShellConfig = {
  shellRole: InternalRole;
  staffName: string;
  staffRoleLabel: string;
};

const ROLE_SHELL_CONFIG: Record<WorkspaceRole, RoleShellConfig> = {
  officer: {
    shellRole: "OFFICER",
    staffName: "Grace Wanjiku",
    staffRoleLabel: "Student Records Officer",
  },
  supervisor: {
    shellRole: "SUPERVISOR",
    staffName: "Dr. Miriam Wekesa",
    staffRoleLabel: "Registrar Supervisor",
  },
  admin: {
    shellRole: "ADMIN",
    staffName: "System Administrator",
    staffRoleLabel: "Institution Administrator",
  },
};

export function RoleWorkspaceShell({
  children,
  role,
}: {
  children: ReactNode;
  role: WorkspaceRole;
}) {
  const config = ROLE_SHELL_CONFIG[role];

  return (
    <InternalAppShell
      institutionName="Savannah Technical College"
      role={config.shellRole}
      staffName={config.staffName}
      staffRoleLabel={config.staffRoleLabel}
    >
      {children}
    </InternalAppShell>
  );
}
