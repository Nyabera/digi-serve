import type { ReactNode } from "react";

import { OperationalWorkspaceShell } from "@/components/demo/workspace-shells";

export default function OfficerWorkspaceLayout({ children }: { children: ReactNode }) {
  return <OperationalWorkspaceShell role="officer">{children}</OperationalWorkspaceShell>;
}
