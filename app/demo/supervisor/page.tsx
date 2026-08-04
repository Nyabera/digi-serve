import {
  getActiveDemoPack,
} from "@/features/demo-engine/config";
import {
  adaptSupervisorDashboard,
  assertDashboardDataValid,
  validateSupervisorDashboardData,
} from "@/features/demo-engine/dashboards/data";
import {
  SupervisorDashboard,
} from "@/features/demo-engine/dashboards/supervisor";

export default function DemoSupervisorDashboardPage() {
  const data = adaptSupervisorDashboard(
    getActiveDemoPack(),
  );

  assertDashboardDataValid(
    "supervisor",
    validateSupervisorDashboardData(data),
  );

  return <SupervisorDashboard data={data} />;
}
