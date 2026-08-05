import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function AllApplicationsPage() {
  return (
    <AdminRouteSurface
      section="Operations"
      title="All Applications"
      description="View the organization-wide request register across services, departments, owners, and statuses."
      route="/demo/admin/applications"
      capabilities={[
        "Review current requests",
        "Inspect service and department ownership",
        "Locate requests requiring intervention",
      ]}
    />
  );
}
