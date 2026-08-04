import { supervisorApprovalsReference } from "@/features/demo-engine/fixtures/supervisor-approvals.reference";
import type { SupervisorDashboardModel } from "@/features/supervisor-approvals/model/supervisor-approval-model";

export function getDemoSupervisorApprovalsReference(): SupervisorDashboardModel {
  return supervisorApprovalsReference;
}
