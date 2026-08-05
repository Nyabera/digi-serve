import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function ReportsDashboardPage() {
  return (
    <AdminRouteSurface
      section="Reports"
      title="Reports Dashboard"
      description="Review organization-level service volume, completion, backlog, SLA, handoff, and document indicators."
      route="/demo/admin/reports"
      capabilities={[
        "Inspect operational totals",
        "Review service and department trends",
        "Identify organization-wide bottlenecks",
      ]}
    />
  );
}
