import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function ServiceBuilderPage() {
  return (
    <AdminRouteSurface
      section="Services"
      title="Service Builder"
      description="Create and configure the institutional services that applicants can discover and submit."
      route="/demo/admin/services/builder"
      capabilities={[
        "Define service identity and purpose",
        "Set availability and ownership",
        "Prepare requirements and workflow connections",
      ]}
    />
  );
}
