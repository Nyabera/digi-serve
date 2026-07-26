import type { ReactNode } from "react";

import { RoleWorkspaceShell } from "@/components/demo/internal-shell/role-workspace-shell";

export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  return <RoleWorkspaceShell role="admin">{children}</RoleWorkspaceShell>;
}
