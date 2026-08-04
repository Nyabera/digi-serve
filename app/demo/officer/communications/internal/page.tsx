import { OfficerCommunicationsWorkspace } from "@/features/demo-operations";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerInternalNotesPage() {
  return (
    <OfficerCommunicationsWorkspace
      canonicalHref={OFFICER_ROUTE_HREFS.internalNotes}
      kind="internal"
    />
  );
}
