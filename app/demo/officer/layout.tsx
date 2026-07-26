import type { ReactNode } from "react";

import { RoleWorkspaceShell } from "@/components/demo/internal-shell/role-workspace-shell";

export default function OfficerWorkspaceLayout({ children }: { children: ReactNode }) {
  return <RoleWorkspaceShell role="officer">{children}</RoleWorkspaceShell>;
}
