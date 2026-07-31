import {
  getActiveDemoPack,
} from "@/features/demo-engine/config";
import {
  adaptOfficerDashboard,
  assertDashboardDataValid,
  validateOfficerDashboardData,
} from "@/features/demo-engine/dashboards/data";
import {
  OfficerDashboard,
} from "@/features/demo-engine/dashboards/officer";

export default function DemoOfficerDashboardPage() {
  const data = adaptOfficerDashboard(
    getActiveDemoPack(),
  );

  assertDashboardDataValid(
    "officer",
    validateOfficerDashboardData(data),
  );

  return <OfficerDashboard data={data} />;
}
