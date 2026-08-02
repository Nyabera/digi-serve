import type {
  ReactNode,
} from "react";

import {
  RoleWorkspaceShell,
} from "@/components/demo/internal-shell/role-workspace-shell";

export type AdminWorkspaceShellProps = {
  readonly children: ReactNode;
};

/**
 * Stable Admin route-layout boundary.
 *
 * The current implementation deliberately delegates to the existing role
 * shell so D31-2 causes no visual regression. D31-8 may replace the internals
 * of this component with the separate dark organization-admin shell without
 * changing the Admin route layout or dashboard body.
 */
export function AdminWorkspaceShell({
  children,
}: AdminWorkspaceShellProps) {
  return (
    <RoleWorkspaceShell role="admin">
      {children}
    </RoleWorkspaceShell>
  );
}
