import { notFound } from "next/navigation";

import { SupervisorDashboardWorkspace } from "@/components/demo/supervisor/supervisor-dashboard-workspace";
import { getDefaultDemoClient } from "@/config/demo";

export default function DemoSupervisorPage() {
  const client = getDefaultDemoClient();

  const service =
    client.services.find(
      (candidate) =>
        candidate.active &&
        candidate.slug ===
          "transcript-request",
    ) ??
    client.services.find(
      (candidate) => candidate.active,
    );

  if (!service) {
    notFound();
  }

  return (
    <SupervisorDashboardWorkspace
      organizationName={
        client.organization.name
      }
      service={service}
    />
  );
}
