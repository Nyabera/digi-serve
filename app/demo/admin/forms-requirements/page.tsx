import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function FormsRequirementsPage() {
  return (
    <AdminRouteSurface
      section="Services"
      title="Forms & Requirements"
      description="Define the information, acknowledgements, and supporting documents required for each service."
      route="/demo/admin/forms-requirements"
      capabilities={[
        "Review form sections and fields",
        "Set required supporting documents",
        "Record applicant acknowledgements",
      ]}
    />
  );
}
