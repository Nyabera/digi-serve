import { OfficerDocumentHub } from "@/features/demo-documents/components/officer-document-hub";
import { OFFICER_ROUTE_HREFS } from "@/features/demo-engine/navigation/officer-navigation-contract";

export default function OfficerGeneratedDocumentsPage() {
  return (
    <section data-officer-route={OFFICER_ROUTE_HREFS.generatedPdfs}>
      <OfficerDocumentHub initialTab="issued" />
    </section>
  );
}
