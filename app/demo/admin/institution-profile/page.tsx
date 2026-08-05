import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function InstitutionProfilePage() {
  return (
    <AdminRouteSurface
      section="Organization"
      title="Institution Profile"
      description="Maintain the identity and contact information presented across the institution’s workspace and portal."
      route="/demo/admin/institution-profile"
      capabilities={[
        "Review organization identity",
        "Inspect contact and campus details",
        "Prepare profile updates",
      ]}
    />
  );
}
