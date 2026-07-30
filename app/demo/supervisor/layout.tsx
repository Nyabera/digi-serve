import type { ReactNode } from "react";

import { OperationalWorkspaceShell } from "@/components/demo/workspace-shells";

export default function SupervisorWorkspaceLayout({ children }: { children: ReactNode }) {
  return <OperationalWorkspaceShell role="supervisor">{children}</OperationalWorkspaceShell>;
}
