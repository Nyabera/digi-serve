import { OfficerCommunicationsWorkspace } from "@/features/demo-operations";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerApplicantMessagesPage() {
  return (
    <OfficerCommunicationsWorkspace
      canonicalHref={OFFICER_ROUTE_HREFS.applicantMessages}
      kind="applicant"
    />
  );
}
