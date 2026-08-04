import { OfficerSharedWorkWorkspace } from "@/features/demo-operations/components/officer-shared-work-workspace";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerSharedWorkPage() {
  return (
    <section data-officer-route={OFFICER_ROUTE_HREFS.sharedWork}>
      <OfficerSharedWorkWorkspace />
    </section>
  );
}
