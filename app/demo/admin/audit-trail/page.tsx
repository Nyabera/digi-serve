import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function AuditTrailPage() {
  return (
    <AdminRouteSurface
      section="Operations"
      title="Audit Trail"
      description="Review the chronological record of administrative, workflow, document, and access activity."
      route="/demo/admin/audit-trail"
      capabilities={[
        "Inspect actor and action history",
        "Review entity changes",
        "Trace important administrative decisions",
      ]}
    />
  );
}
