import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function ServiceCataloguePage() {
  return (
    <AdminRouteSurface
      section="Services"
      title="Service Catalogue"
      description="Review the institution’s published, draft, and inactive services from one organization-level catalogue."
      route="/demo/admin/services"
      capabilities={[
        "Review service availability",
        "Inspect ownership and publication state",
        "Prepare services for controlled configuration",
      ]}
    />
  );
}
