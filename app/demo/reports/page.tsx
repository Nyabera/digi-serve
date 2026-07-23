import { OperationalReportsDashboard } from "@/components/demo/reports/operational-reports-dashboard";
import { getDefaultDemoClient } from "@/config/demo";

export default function DemoReportsPage() {
  const client = getDefaultDemoClient();

  const services = client.services
    .filter((service) => service.active)
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
    }));

  const departments = client.departments.map(
    (department) => ({
      id: department.id,
      name: department.name,
    }),
  );

  return (
    <OperationalReportsDashboard
      organizationName={client.organization.name}
      services={services}
      departments={departments}
    />
  );
}
