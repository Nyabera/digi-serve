import type {
  ReactNode,
} from "react";

import {
  ApplicantWorkspaceShell,
} from "@/features/demo-applicant/components/applicant-workspace-shell";

export default function ApplicantLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ApplicantWorkspaceShell>
      {children}
    </ApplicantWorkspaceShell>
  );
}
