import type { ReactNode } from "react";

import { AdminWorkspaceShell } from "@/components/demo/workspace-shells";

export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  return <AdminWorkspaceShell>{children}</AdminWorkspaceShell>;
}
