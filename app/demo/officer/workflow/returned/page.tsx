import { OfficerWorkflowWorkspace } from "@/features/demo-operations";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerReturnedWorkflowPage() {
  return (
    <OfficerWorkflowWorkspace
      canonicalHref={OFFICER_ROUTE_HREFS.returnedToApplicant}
      view="returned"
    />
  );
}
