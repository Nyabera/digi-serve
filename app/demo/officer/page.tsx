import { OfficerDashboard } from "@/components/demo/officer/officer-dashboard";
import { getDefaultDemoClient } from "@/config/demo";

export default function DemoOfficerPage() {
  const client = getDefaultDemoClient();

  const services = client.services
    .filter((service) => service.active)
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
    }));

  const departments = client.departments.map((department) => ({
    id: department.id,
    name: department.name,
  }));

  return (
    <OfficerDashboard
      organizationName={client.organization.name}
      services={services}
      departments={departments}
    />
  );
}
