import { notFound } from "next/navigation";

import { SupervisorApprovalWorkspace } from "@/components/demo/supervisor/supervisor-approval-workspace";
import { getDefaultDemoClient } from "@/config/demo";

type DemoSupervisorApprovalPageProps = {
  readonly params: Promise<{
    readonly requestId: string;
  }>;
};

export default async function DemoSupervisorApprovalPage({
  params,
}: DemoSupervisorApprovalPageProps) {
  const { requestId } = await params;
  const client = getDefaultDemoClient();

  const service =
    client.services.find(
      (candidate) =>
        candidate.active && candidate.slug === "transcript-request",
    ) ?? client.services.find((candidate) => candidate.active);

  if (!service) {
    notFound();
  }

  const registrarDepartment =
    client.departments.find((department) => department.name === "Registrar") ??
    client.departments[0];

  return (
    <SupervisorApprovalWorkspace
      requestId={requestId}
      service={service}
      registrarDepartment={{
        id: registrarDepartment.id,
        name: registrarDepartment.name,
      }}
    />
  );
}
