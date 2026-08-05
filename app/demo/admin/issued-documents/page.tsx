import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function IssuedDocumentsPage() {
  return (
    <AdminRouteSurface
      section="Documents"
      title="Issued Documents"
      description="Review organization-issued outcomes, references, current validity, and revocation state."
      route="/demo/admin/issued-documents"
      capabilities={[
        "Inspect issued outcomes",
        "Review validity and replacement state",
        "Locate document references",
      ]}
    />
  );
}
