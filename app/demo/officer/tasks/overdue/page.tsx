import { OfficerTasksWorkspace } from "@/features/demo-operations";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerOverdueTasksPage() {
  return (
    <section data-officer-route={OFFICER_ROUTE_HREFS.overdueTasks}>
      <OfficerTasksWorkspace initialFilter="overdue" />
    </section>
  );
}
