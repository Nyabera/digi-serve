import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function ApprovalRulesPage() {
  return (
    <AdminRouteSurface
      section="Workflows"
      title="Approval Rules"
      description="Define which roles may approve, reject, return, or escalate institutional requests."
      route="/demo/admin/approval-rules"
      capabilities={[
        "Review decision authorities",
        "Set approval checkpoints",
        "Record escalation boundaries",
      ]}
    />
  );
}
