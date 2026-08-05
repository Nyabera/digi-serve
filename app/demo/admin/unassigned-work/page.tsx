import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function UnassignedWorkPage() {
  return (
    <AdminRouteSurface
      section="Operations"
      title="Unassigned Work"
      description="Identify submitted requests and work items that do not yet have a responsible owner."
      route="/demo/admin/unassigned-work"
      capabilities={[
        "Review unassigned requests",
        "Inspect queue age and urgency",
        "Prepare assignment decisions",
      ]}
    />
  );
}
