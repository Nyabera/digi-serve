import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function RolesPermissionsPage() {
  return (
    <AdminRouteSurface
      section="People & Access"
      title="Roles & Permissions"
      description="Review fixed demo roles and the organization, department, and assignment scopes attached to them."
      route="/demo/admin/roles-permissions"
      capabilities={[
        "Inspect role responsibilities",
        "Review permission scopes",
        "Prepare controlled access changes",
      ]}
    />
  );
}
