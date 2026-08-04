import { VerificationWorkspaceBody } from "@/features/demo-verification/components/public-verification-page";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerVerificationPage() {
  return (
    <section data-officer-route={OFFICER_ROUTE_HREFS.qrVerification}>
      <VerificationWorkspaceBody />
    </section>
  );
}
