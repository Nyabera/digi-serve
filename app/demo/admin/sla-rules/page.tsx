import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function SLARulesPage() {
  return (
    <AdminRouteSurface
      section="Workflows"
      title="SLA Rules"
      description="Configure processing targets, warning thresholds, and overdue conditions for services and work items."
      route="/demo/admin/sla-rules"
      capabilities={[
        "Review processing targets",
        "Define warning thresholds",
        "Document overdue handling",
      ]}
    />
  );
}
