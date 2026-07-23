import type { OfficerDashboardModel } from "../../officer-dashboard/model/officer-dashboard-model";
import { officerDashboardReference } from "../fixtures/officer-dashboard.reference";

export function getDemoOfficerDashboardModel(): OfficerDashboardModel {
  return structuredClone(officerDashboardReference);
}
