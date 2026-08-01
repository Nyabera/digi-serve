import "./admin-dashboard-reference.css";

import {
  getActiveDemoPack,
} from "@/features/demo-engine/config";
import {
  adaptAdminDashboard,
  assertDashboardDataValid,
  validateAdminDashboardData,
} from "@/features/demo-engine/dashboards/data";
import {
  AdminDashboardHighFidelity,
  buildAdminDashboardReferenceData,
} from "@/features/demo-engine/dashboards/admin";

export default function DemoAdminDashboardPage() {
  const adaptedData = adaptAdminDashboard(
    getActiveDemoPack(),
  );

  assertDashboardDataValid(
    "admin",
    validateAdminDashboardData(adaptedData),
  );

  const data =
    buildAdminDashboardReferenceData(
      adaptedData,
    );

  return (
    <AdminDashboardHighFidelity
      data={data}
    />
  );
}
