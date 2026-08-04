import type {
  ReactNode,
} from "react";

import {
  RoleWorkspaceShell,
} from "@/components/demo/internal-shell/role-workspace-shell";

export type OperationalWorkspaceRole =
  | "officer"
  | "supervisor";

export type OperationalWorkspaceShellProps = {
  readonly children: ReactNode;
  readonly role: OperationalWorkspaceRole;
};

/**
 * Stable route-layout boundary shared by Officer and Supervisor.
 *
 * D31 dashboard bodies must render beneath this component and must not mount
 * InternalAppShell, RoleWorkspaceShell, sidebars or top bars directly.
 */
export function OperationalWorkspaceShell({
  children,
  role,
}: OperationalWorkspaceShellProps) {
  return (
    <RoleWorkspaceShell role={role}>
      {children}
    </RoleWorkspaceShell>
  );
}
