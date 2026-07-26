import type { ReactNode } from "react";

import { RoleWorkspaceShell } from "@/components/demo/internal-shell/role-workspace-shell";

export default function SupervisorWorkspaceLayout({ children }: { children: ReactNode }) {
  return <RoleWorkspaceShell role="supervisor">{children}</RoleWorkspaceShell>;
}
