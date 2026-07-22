import { DepartmentProcessingDashboard } from "@/components/demo/department/department-processing-dashboard";
import { getDefaultDemoClient } from "@/config/demo";

export default function DemoDepartmentPage() {
  const client = getDefaultDemoClient();

  const financeDepartment =
    client.departments.find(
      (department) => department.name === "Finance",
    ) ?? client.departments[0];

  const services = client.services
    .filter((service) => service.active)
    .map((service) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
    }));

  return (
    <DepartmentProcessingDashboard
      organizationName={client.organization.name}
      department={{
        id: financeDepartment.id,
        name: financeDepartment.name,
      }}
      services={services}
    />
  );
}
