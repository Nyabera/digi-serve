import { SUPERVISOR_ROUTE_HREFS } from "@/features/demo-engine/navigation/supervisor-navigation-contract";
import { SupervisorRouteSurface } from "@/features/demo-operations/components/supervisor-route-surface";

export default function SupervisorOverdueWorkPage() {
  return (
    <SupervisorRouteSurface
      canonicalHref={SUPERVISOR_ROUTE_HREFS.overdueWork}
      view="overdue-work"
    />
  );
}
