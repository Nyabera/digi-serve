import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function AssignmentRulesPage() {
  return (
    <AdminRouteSurface
      section="Workflows"
      title="Assignment Rules"
      description="Control how submitted work is routed to departments, teams, and responsible officers."
      route="/demo/admin/assignment-rules"
      capabilities={[
        "Review initial ownership rules",
        "Define department routing",
        "Document assignment fallbacks",
      ]}
    />
  );
}
