import { AdminRouteSurface } from "@/components/demo/admin/admin-route-surface";

/**
 * D34-2 canonical admin route surface.
 *
 * This page intentionally renders content only and inherits the existing
 * admin sidebar and top bar from app/demo/admin/layout.tsx.
 */
export default function DocumentTemplatesPage() {
  return (
    <AdminRouteSurface
      section="Documents"
      title="Document Templates"
      description="Manage reusable institutional templates for letters, certificates, receipts, and other outcomes."
      route="/demo/admin/document-templates"
      capabilities={[
        "Review available templates",
        "Inspect template purpose and status",
        "Prepare controlled template updates",
      ]}
    />
  );
}
