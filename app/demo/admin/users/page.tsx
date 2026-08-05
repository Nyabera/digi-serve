import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function UsersPage() {
  return (
    <AdminRouteSurface
      section="People & Access"
      title="Users"
      description="Manage staff accounts, invitations, membership status, and organization access."
      route="/demo/admin/users"
      capabilities={[
        "Review active and invited users",
        "Inspect membership status",
        "Prepare staff access changes",
      ]}
    />
  );
}
